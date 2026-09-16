import { processCaseIngestion } from '../src/lib/ai/pipeline.ts';
import { validateCase } from '../src/lib/validateCase.ts';

async function testPipeline() {
  console.log('--- TESTING AI CASE INGESTION PIPELINE ---');

  const testPayload = {
    title: 'K.S. Puttaswamy v. Union of India',
    shortTitle: 'The Right to Privacy Landmark',
    citation: '(2017) 10 SCC 1, AIR 2017 SC 4161',
    court: 'Supreme Court of India',
    year: 2017,
    genre: 'constitutional',
    statuteSections: 'Article 21, Part III of the Constitution of India',
    factsSummary: `Justice K.S. Puttaswamy (Retd.) challenged the constitutional validity of the Aadhaar biometric identification scheme.
The controversy centered on whether privacy is an intrinsic fundamental right guaranteed under Article 21 and Part III of the Constitution.
A 9-judge Constitution Bench was constituted to resolve earlier conflicting precedents from MP Sharma (1954) and Kharak Singh (1962).
The Union argued that the Constitution does not explicitly protect privacy as a fundamental right.
The Petitioners contended that dignity, personal autonomy, and informational privacy are inseparable components of liberty.`,
    judgmentUrl: 'https://indiankanoon.org/doc/127517806/',
    judgmentText: `A unanimous 9-judge bench declared that the right to privacy is protected as an intrinsic part of the right to life and personal liberty under Article 21.
Privacy includes bodily integrity, personal autonomy, and informational self-determination.
Any state restriction on privacy must satisfy the three-fold proportionality test: legality, legitimate state aim, and proportionality.`,
    reviewer: 'Adv. Girish Kr. Srivastava',
    enrolmentNumber: 'D/842/1991',
    bench: ['J.S. Khehar, CJI', 'J. Chelameswar, J.', 'S.A. Bobde, J.', 'D.Y. Chandrachud, J.'],
    decidedOn: '2017-08-24',
  };

  try {
    const generatedCase = await processCaseIngestion(testPayload);
    console.log('✅ Ingestion Pipeline Processed Successfully!');
    console.log(`   Slug: ${generatedCase.slug}`);
    console.log(`   Hook (${generatedCase.hook.split(' ').length} words): "${generatedCase.hook}"`);
    console.log(`   Episodes Generated: ${generatedCase.episodes.length}`);
    console.log(`   Reviewer: ${generatedCase.review.reviewer} (${generatedCase.review.enrolment})`);
    console.log(`   Poster Asset: ${generatedCase.poster.src}`);

    const validation = validateCase(generatedCase);
    if (validation.success) {
      console.log('🎉 Generated Case STRICTLY PASSED all contractual validation rules!\n');
    } else {
      console.error('❌ Validation Errors:', validation.errors);
    }
  } catch (err) {
    console.error('❌ Pipeline Test Failed:', err);
  }
}

testPipeline();
