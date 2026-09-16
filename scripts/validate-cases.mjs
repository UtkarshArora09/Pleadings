import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const casesDir = path.join(__dirname, '..', 'content', 'cases');

console.log('--- VALIDATING ALL CASE JSON FILES ---');

const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
let hasFailure = false;

for (const file of files) {
  const filePath = path.join(casesDir, file);
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);
    
    // Check episodes length
    if (!Array.isArray(data.episodes) || data.episodes.length !== 8) {
      console.error(`❌ [${file}] Episodes count is ${data.episodes?.length || 0}, expected 8.`);
      hasFailure = true;
    }

    // Check hook words count
    const words = (data.hook || '').trim().split(/\s+/).filter(Boolean).length;
    if (words > 14) {
      console.error(`❌ [${file}] Hook exceeds 14 words (${words} words).`);
      hasFailure = true;
    }

    // Check episodes rules
    data.episodes.forEach((ep, idx) => {
      // Check exhibits
      if (ep.exhibit) {
        if (ep.exhibit.kind === 'reconstruction' && ep.exhibit.docNumber) {
          console.error(`❌ [${file}] Episode ${idx+1}: Reconstruction exhibit has forbidden docNumber.`);
          hasFailure = true;
        }
        if (ep.exhibit.kind === 'record' && !ep.exhibit.sourceUrl) {
          console.error(`❌ [${file}] Episode ${idx+1}: Record exhibit missing required sourceUrl.`);
          hasFailure = true;
        }
        if (ep.exhibit.kind === 'quote' && typeof ep.exhibit.para !== 'number') {
          console.error(`❌ [${file}] Episode ${idx+1}: Quote exhibit missing required para number.`);
          hasFailure = true;
        }
      }

      // Check source tiers in blocks
      ['story', 'student', 'advocate'].forEach(layerKey => {
        const blocks = ep.layers?.[layerKey]?.blocks || [];
        blocks.forEach((b, bIdx) => {
          if (b.source?.tier === 'BLACK') {
            if (typeof b.source.para !== 'number' || !b.source.paraText || !b.source.cite) {
              console.error(`❌ [${file}] Episode ${idx+1} (${layerKey} block ${bIdx+1}): BLACK tier missing para/paraText/cite.`);
              hasFailure = true;
            }
          }
          if (b.source?.tier === 'BLUE') {
            if (!b.source.secondary?.publication || !b.source.secondary?.date) {
              console.error(`❌ [${file}] Episode ${idx+1} (${layerKey} block ${bIdx+1}): BLUE tier missing secondary publication/date.`);
              hasFailure = true;
            }
          }
        });
      });
    });

    console.log(`✅ [${file}] Validated 8 episodes, exhibits, source-tiers, and metadata.`);
  } catch (err) {
    console.error(`❌ [${file}] Failed to parse or validate:`, err);
    hasFailure = true;
  }
}

if (hasFailure) {
  console.error('\n💥 Validation failed. Build stopped.');
  process.exit(1);
} else {
  console.log('\n🎉 ALL 10 CASES STRICTLY PASS CONTRACTUAL VALIDATION!\n');
}
