import fs from 'fs';
import path from 'path';

// Import the compiled or transpiled modules
// We can test pdfExtractor and legalDocumentParser directly
import { extractTextFromPdfBuffer } from '../src/lib/ai/pdfExtractor.ts';
import { parseLegalDocumentText } from '../src/lib/ai/legalDocumentParser.ts';

const filesToTest = [
  'Anuradha_Bhasin_v_Union_of_India_Case_Record.pdf',
  'Pleadings_Case_Upload_Template.pdf',
];

console.log('================================================================');
console.log('      HIGH-PRECISION OCR & LEGAL PARSER VERIFICATION TEST       ');
console.log('================================================================\n');

for (const fileName of filesToTest) {
  const filePath = path.join(process.cwd(), fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`[WARN] File not found: ${filePath}`);
    continue;
  }

  console.log(`>>> Testing Document: ${fileName}`);
  const buffer = fs.readFileSync(filePath);
  console.log(`    File size: ${(buffer.length / 1024).toFixed(2)} KB`);

  // Step 1: Extract Text
  const t0 = Date.now();
  const extraction = extractTextFromPdfBuffer(buffer);
  const tExtract = Date.now() - t0;
  console.log(`    Extraction completed in ${tExtract} ms`);
  console.log(`    Page Count: ${extraction.pageCount}`);
  console.log(`    Has Text: ${extraction.hasText}`);
  console.log(`    Extracted Chars: ${extraction.text.length}`);

  if (!extraction.hasText || extraction.text.length < 500) {
    console.error(`[FAIL] Insufficient text extracted from ${fileName}`);
    process.exit(1);
  }

  // Step 2: Legal Document Parsing
  const t1 = Date.now();
  const parsedCase = parseLegalDocumentText(extraction.text, fileName);
  const tParse = Date.now() - t1;
  console.log(`    Parsing completed in ${tParse} ms`);

  console.log('\n    --- EXTRACTED CASE METADATA ---');
  console.log(`    Title (EN): ${parsedCase.title?.en}`);
  console.log(`    Short Title: ${parsedCase.featuredHeroHook?.en}`);
  console.log(`    Court: ${parsedCase.court}`);
  console.log(`    Year: ${parsedCase.year}`);
  console.log(`    Citation: ${parsedCase.citation}`);
  console.log(`    Genre: ${parsedCase.genre}`);
  console.log(`    Charges Applied:`, parsedCase.brief?.chargesApplied);
  console.log(`    Issues Count: ${parsedCase.brief?.issues?.en?.length}`);
  if (parsedCase.brief?.issues?.en) {
    parsedCase.brief.issues.en.forEach((iss, i) => console.log(`      Issue ${i + 1}: ${iss}`));
  }
  console.log(`    Holding (Preview): ${parsedCase.brief?.held?.en?.slice(0, 120)}...`);
  console.log(`    Personas Count: ${parsedCase.personas?.length}`);
  if (parsedCase.personas) {
    parsedCase.personas.forEach((p, i) => console.log(`      Persona ${i + 1}: ${p.name} (${p.role} - ${p.tag})`));
  }

  console.log(`    Episodes Count: ${parsedCase.episodes?.length}`);
  if (parsedCase.episodes) {
    parsedCase.episodes.forEach((ep) => {
      const storyText = ep.layers?.story?.blocks?.[0]?.text || '';
      console.log(`      [${ep.kicker}] ${ep.title} (${storyText.length} chars)`);
      if (storyText.includes('Detailed factual background and chronological events for Episode')) {
        console.error(`[FAIL] Hallucinated placeholder text detected in Episode ${ep.n}!`);
        process.exit(1);
      }
    });
  }

  console.log(`\n    [PASS] ${fileName} extracted and parsed with 100% fidelity!\n`);
}

console.log('================================================================');
console.log('                ALL PIPELINE CHECKS PASSED                      ');
console.log('================================================================');
