import React from 'react';
import { StatuteRefInline } from '@/components/StatuteRef';
import { TapToDefine } from '@/components/case/TapToDefine';
import { LEGAL_DICTIONARY } from '@/lib/legalDictionary';

// Build a cached regex of legal terms sorted from longest to shortest
const SORTED_TERMS = Object.keys(LEGAL_DICTIONARY).sort((a, b) => b.length - a.length);
// Escape special regex characters
const ESCAPED_TERMS = SORTED_TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
const LEGAL_TERMS_REGEX = new RegExp(`\\b(${ESCAPED_TERMS.join('|')})\\b`, 'gi');

/**
 * Scans plain text for known legal terms and wraps them in TapToDefine components
 */
function enrichPlainTextWithDictionary(text: string, baseKey: string): React.ReactNode[] {
  if (!text) return [];

  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;

  // Reset regex state
  LEGAL_TERMS_REGEX.lastIndex = 0;

  while ((m = LEGAL_TERMS_REGEX.exec(text)) !== null) {
    const matchIdx = m.index;
    const matchStr = m[0];

    if (matchIdx > lastIdx) {
      parts.push(text.substring(lastIdx, matchIdx));
    }

    parts.push(
      <TapToDefine
        key={`${baseKey}-term-${matchIdx}-${matchStr}`}
        term={matchStr}
        display={matchStr}
      />
    );

    lastIdx = matchIdx + matchStr.length;
  }

  if (lastIdx < text.length) {
    parts.push(text.substring(lastIdx));
  }

  return parts.length > 0 ? parts : [text];
}

/**
 * Parses rich text strings containing:
 * - {{term:slug|display}} -> TapToDefine inline tooltip
 * - {{stat:IPC §302}} -> StatuteRefInline
 * - Plain text with automatic Plain-English dictionary detection
 */
export function parseRichText(
  text: string,
  onOpenTerm?: (slug: string) => void,
  onOpenStatute?: (oldSec: string) => void
): React.ReactNode {
  if (!text) return null;

  // Regex matches {{term:...}} or {{stat:...}}
  const regex = /\{\{(term|stat):([^}]+)\}\}/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let chunkCount = 0;

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Process preceding plain text with automatic dictionary enrichment
    if (matchStart > lastIndex) {
      const rawChunk = text.substring(lastIndex, matchStart);
      elements.push(...enrichPlainTextWithDictionary(rawChunk, `pre-${chunkCount}`));
      chunkCount++;
    }

    const type = match[1];
    const payload = match[2];

    if (type === 'term') {
      const parts = payload.split('|');
      const slug = parts[0].trim();
      const display = parts[1] ? parts[1].trim() : slug;
      elements.push(
        <TapToDefine
          key={`term-${matchStart}-${slug}`}
          term={slug}
          display={display}
        />
      );
    } else if (type === 'stat') {
      const parts = payload.split('|');
      const oldSec = parts[0].trim();
      const newSec = parts[1] ? parts[1].trim() : undefined;
      elements.push(
        <StatuteRefInline
          key={`stat-${matchStart}-${oldSec}`}
          oldSec={oldSec}
          newSec={newSec}
          onClick={() => onOpenStatute && onOpenStatute(oldSec)}
        />
      );
    }

    lastIndex = matchEnd;
  }

  // Process remaining plain text
  if (lastIndex < text.length) {
    const rawChunk = text.substring(lastIndex);
    elements.push(...enrichPlainTextWithDictionary(rawChunk, `post-${chunkCount}`));
  }

  return elements.length > 0 ? elements : text;
}
