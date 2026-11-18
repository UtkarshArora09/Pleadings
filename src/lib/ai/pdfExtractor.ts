import zlib from 'zlib';

export interface ExtractedPdf {
  text: string;
  pages: string[];
  pageCount: number;
  hasText: boolean;
}

/**
 * High-precision, zero-dependency PDF text extraction engine.
 * Specifically handles Chromium/Edge print-to-pdf subsetted fonts with /ToUnicode CMaps,
 * standard Type1/TrueType fonts, uncompressed streams, and zlib/FlateDecode compressed streams.
 */
export function extractTextFromPdfBuffer(pdfBuffer: Buffer): ExtractedPdf {
  try {
    const binaryStr = pdfBuffer.toString('binary');

    // 1. Index all indirect objects: objNum -> object body text
    const objects = new Map<number, string>();
    const objRegex = /(\d+)\s+(\d+)\s+obj([\s\S]*?)endobj/g;
    let match: RegExpExecArray | null;

    while ((match = objRegex.exec(binaryStr)) !== null) {
      const objNum = parseInt(match[1], 10);
      objects.set(objNum, match[3]);
    }

    // Helper: Decompress stream in object body
    function getDecompressedStream(body: string): string | null {
      if (!body) return null;
      const streamIdx = body.indexOf('stream');
      if (streamIdx === -1) return null;
      const endStreamIdx = body.indexOf('endstream', streamIdx);
      if (endStreamIdx === -1) return null;

      let s = streamIdx + 6;
      while (body.charCodeAt(s) === 10 || body.charCodeAt(s) === 13) s++;

      const rawBytes = Buffer.from(body.slice(s, endStreamIdx), 'binary');
      try {
        return zlib.inflateSync(rawBytes).toString('latin1');
      } catch {
        try {
          return zlib.inflateRawSync(rawBytes).toString('latin1');
        } catch {
          return rawBytes.toString('latin1');
        }
      }
    }

    // 2. Parse CMaps (/ToUnicode streams)
    const cmaps = new Map<number, Map<string, string>>();

    function getCMap(cmapObjNum: number): Map<string, string> | null {
      if (cmaps.has(cmapObjNum)) return cmaps.get(cmapObjNum)!;
      const body = objects.get(cmapObjNum);
      if (!body) return null;
      const decomp = getDecompressedStream(body);
      if (!decomp) return null;

      const map = new Map<string, string>();

      // Parse beginbfchar: <glyphHex> <unicodeHex>
      const bfcharRegex = /(\d+)\s+beginbfchar([\s\S]*?)endbfchar/g;
      let bfcMatch: RegExpExecArray | null;
      while ((bfcMatch = bfcharRegex.exec(decomp)) !== null) {
        const lines = bfcMatch[2].trim().split(/\s+/);
        for (let i = 0; i < lines.length - 1; i += 2) {
          const src = lines[i].replace(/[<>]/g, '').toUpperCase();
          const dst = lines[i + 1].replace(/[<>]/g, '');
          if (src && dst) {
            let unicodeChar = '';
            for (let c = 0; c < dst.length; c += 4) {
              const hex = dst.slice(c, c + 4);
              unicodeChar += String.fromCharCode(parseInt(hex, 16));
            }
            map.set(src, unicodeChar);
          }
        }
      }

      // Parse beginbfrange: <startHex> <endHex> <startDstHex> or <startHex> <endHex> [ <dst1> <dst2> ... ]
      const bfrangeRegex = /(\d+)\s+beginbfrange([\s\S]*?)endbfrange/g;
      let bfrMatch: RegExpExecArray | null;
      while ((bfrMatch = bfrangeRegex.exec(decomp)) !== null) {
        const content = bfrMatch[2].trim();
        const tokens = content.match(/<[^>]+>|\[[^\]]+\]|\S+/g) || [];
        let i = 0;
        while (i < tokens.length) {
          const start = tokens[i]?.replace(/[<>]/g, '').toUpperCase();
          const end = tokens[i + 1]?.replace(/[<>]/g, '').toUpperCase();
          const target = tokens[i + 2];
          if (!start || !end || !target) break;

          const startCode = parseInt(start, 16);
          const endCode = parseInt(end, 16);

          if (target.startsWith('[')) {
            const list = target.slice(1, -1).trim().split(/\s+/);
            for (let c = startCode, idx = 0; c <= endCode && idx < list.length; c++, idx++) {
              const hexKey = c.toString(16).toUpperCase().padStart(start.length, '0');
              const dstHex = list[idx].replace(/[<>]/g, '');
              let unicodeChar = '';
              for (let ch = 0; ch < dstHex.length; ch += 4) {
                unicodeChar += String.fromCharCode(parseInt(dstHex.slice(ch, ch + 4), 16));
              }
              map.set(hexKey, unicodeChar);
            }
          } else {
            const dstStartHex = target.replace(/[<>]/g, '');
            let dstStartCode = parseInt(dstStartHex, 16);
            for (let c = startCode; c <= endCode; c++, dstStartCode++) {
              const hexKey = c.toString(16).toUpperCase().padStart(start.length, '0');
              map.set(hexKey, String.fromCharCode(dstStartCode));
            }
          }
          i += 3;
        }
      }

      cmaps.set(cmapObjNum, map);
      return map;
    }

    // 3. Resolve Font Object -> CMap
    const fontObjToCMap = new Map<number, Map<string, string> | null>();
    function getFontCMap(fontObjNum: number): Map<string, string> | null {
      if (fontObjToCMap.has(fontObjNum)) return fontObjToCMap.get(fontObjNum)!;
      const body = objects.get(fontObjNum);
      if (!body) return null;

      const toUnicodeMatch = body.match(/\/ToUnicode\s+(\d+)\s+0\s+R/);
      if (toUnicodeMatch) {
        const cmapObjNum = parseInt(toUnicodeMatch[1], 10);
        const cmap = getCMap(cmapObjNum);
        fontObjToCMap.set(fontObjNum, cmap);
        return cmap;
      }
      fontObjToCMap.set(fontObjNum, null);
      return null;
    }

    // 4. Identify Pages and their Font Resources
    interface PageInfo {
      pageObjNum: number;
      fontMap: Map<string, Map<string, string> | null>;
      contentsObjNums: number[];
    }
    const pages: PageInfo[] = [];

    for (const [objNum, body] of objects.entries()) {
      if (body.match(/\/Type\s*\/Page\b/)) {
        let resourcesBody = body;
        const resMatch = body.match(/\/Resources\s+(\d+)\s+0\s+R/);
        if (resMatch) {
          resourcesBody = objects.get(parseInt(resMatch[1], 10)) || body;
        }

        const fontMap = new Map<string, Map<string, string> | null>();
        const fontDictMatch = resourcesBody.match(/\/Font\s*<<([\s\S]*?)>>/);
        if (fontDictMatch) {
          const fontEntries = fontDictMatch[1].match(/\/([A-Za-z0-9_]+)\s+(\d+)\s+0\s+R/g) || [];
          for (const entry of fontEntries) {
            const m = entry.match(/\/([A-Za-z0-9_]+)\s+(\d+)\s+0\s+R/);
            if (m) {
              const fontName = '/' + m[1];
              const targetFontObj = parseInt(m[2], 10);
              const cmap = getFontCMap(targetFontObj);
              fontMap.set(fontName, cmap);
            }
          }
        }

        const contentsMatches: number[] = [];
        const singleContents = body.match(/\/Contents\s+(\d+)\s+0\s+R/);
        const arrayContents = body.match(/\/Contents\s*\[([\s\S]*?)\]/);

        if (arrayContents) {
          const ids = arrayContents[1].match(/(\d+)\s+0\s+R/g) || [];
          for (const id of ids) {
            const m = id.match(/(\d+)/);
            if (m) contentsMatches.push(parseInt(m[1], 10));
          }
        } else if (singleContents) {
          contentsMatches.push(parseInt(singleContents[1], 10));
        }

        pages.push({ pageObjNum: objNum, fontMap, contentsObjNums: contentsMatches });
      }
    }

    // 5. Parse Content Streams across all Pages
    const pageTexts: string[] = [];

    for (const page of pages) {
      let pageRaw = '';

      for (const cObjNum of page.contentsObjNums) {
        const body = objects.get(cObjNum);
        if (!body) continue;
        const streamStr = getDecompressedStream(body);
        if (streamStr) {
          pageRaw += parseContentStream(streamStr, page.fontMap);
        }
      }

      // Clean up browser/print header-footer noise if present
      const cleanedPage = pageRaw
        .split('\n')
        .filter((line) => {
          const trimmed = line.trim();
          if (!trimmed) return false;
          // Filter out Edge / Chrome print metadata stamps (e.g. "10/5/26, 2:23 AM", "file:///...", "1 / 6")
          if (/^\d{1,2}\/\d{1,2}\/\d{2,4},\s+\d{1,2}:\d{2}\s+(?:AM|PM)$/i.test(trimmed)) return false;
          if (/^file:\/\/\//i.test(trimmed)) return false;
          if (/^\d+\s*\/\s*\d+$/.test(trimmed)) return false;
          if (/^Pleadings\s*—\s*Landmark\s+Case/i.test(trimmed)) return false;
          return true;
        })
        .join('\n');

      if (cleanedPage.trim()) {
        pageTexts.push(cleanedPage.trim());
      }
    }

    // 6. Fallback if no page objects found or content empty: scan any BT...ET in any stream
    if (pageTexts.length === 0) {
      let fallbackText = '';
      for (const body of objects.values()) {
        const stream = getDecompressedStream(body);
        if (stream && stream.includes('BT')) {
          fallbackText += parseContentStream(stream, new Map()) + '\n';
        }
      }
      if (fallbackText.trim()) {
        pageTexts.push(fallbackText.trim());
      }
    }

    function parseContentStream(streamStr: string, fontMap: Map<string, Map<string, string> | null>): string {
      let currentFont = '';
      let currentCMap: Map<string, string> | null = null;
      let out = '';

      const btRegex = /BT([\s\S]*?)ET/g;
      let btMatch: RegExpExecArray | null;

      while ((btMatch = btRegex.exec(streamStr)) !== null) {
        const block = btMatch[1];
        const commands = block.match(/\/[A-Za-z0-9_]+\s+[\d.]+\s+Tf|(?:\([^)]*\)|<[^>]*>|\[[^\]]*\])\s*(?:Tj|TJ|'|")|[\d.-]+\s+[\d.-]+\s+(?:Td|TD|Tm)|T\*/g) || [];

        let lineText = '';
        for (const cmd of commands) {
          if (cmd.includes('Tf')) {
            const fontMatch = cmd.match(/\/([A-Za-z0-9_]+)\s+[\d.]+\s+Tf/);
            if (fontMatch) {
              currentFont = '/' + fontMatch[1];
              currentCMap = fontMap.get(currentFont) || null;
            }
          } else if (cmd.endsWith('Tj') || cmd.endsWith("'") || cmd.endsWith('"')) {
            const strMatch = cmd.match(/^(\([^)]*\)|<[^>]*>)/);
            if (strMatch) {
              lineText += decodeString(strMatch[1], currentCMap);
              if (cmd.endsWith("'") || cmd.endsWith('"')) lineText += '\n';
            }
          } else if (cmd.endsWith('TJ')) {
            const arrMatch = cmd.match(/^\[([\s\S]*)\]\s*TJ$/);
            if (arrMatch) {
              const inner = arrMatch[1].match(/\([^)]*\)|<[^>]*>|[\d.-]+/g) || [];
              for (const item of inner) {
                if (item.startsWith('(') || item.startsWith('<')) {
                  lineText += decodeString(item, currentCMap);
                } else {
                  const offset = parseFloat(item);
                  if (offset < -150) {
                    lineText += ' ';
                  }
                }
              }
            }
          } else if (cmd.endsWith('Td') || cmd.endsWith('TD') || cmd.endsWith('Tm')) {
            const parts = cmd.trim().split(/\s+/);
            const dy = parseFloat(parts[1]);
            if (Math.abs(dy) > 5) {
              lineText += '\n';
            }
          } else if (cmd === 'T*') {
            lineText += '\n';
          }
        }
        out += lineText + '\n';
      }

      return out;
    }

    function decodeString(str: string, cmap: Map<string, string> | null): string {
      if (str.startsWith('<') && str.endsWith('>')) {
        const hex = str.slice(1, -1).trim();
        let res = '';
        if (cmap) {
          let sampleKey = '';
          for (const k of cmap.keys()) {
            sampleKey = k;
            break;
          }
          const keyLen = sampleKey.length || 2;

          for (let i = 0; i < hex.length; i += keyLen) {
            const key = hex.slice(i, i + keyLen).toUpperCase();
            const decoded = cmap.get(key) || cmap.get(key.padStart(4, '0')) || cmap.get(key.slice(-2));
            res += decoded !== undefined ? decoded : '';
          }
        } else {
          for (let i = 0; i < hex.length; i += 2) {
            res += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
          }
        }
        return res;
      } else if (str.startsWith('(') && str.endsWith(')')) {
        return str
          .slice(1, -1)
          .replace(/\\n/g, '\n')
          .replace(/\\r/g, '\r')
          .replace(/\\t/g, '\t')
          .replace(/\\\(/g, '(')
          .replace(/\\\)/g, ')')
          .replace(/\\\\/g, '\\')
          .replace(/\\([0-7]{1,3})/g, (_, oct) => String.fromCharCode(parseInt(oct, 8)));
      }
      return '';
    }

    const fullText = pageTexts.join('\n\n--- PAGE BREAK ---\n\n').trim();

    return {
      text: fullText,
      pages: pageTexts,
      pageCount: pages.length || pageTexts.length,
      hasText: fullText.length > 50,
    };
  } catch (err) {
    console.error('PDF Text Extraction Engine Error:', err);
    return {
      text: '',
      pages: [],
      pageCount: 0,
      hasText: false,
    };
  }
}
