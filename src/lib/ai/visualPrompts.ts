/**
 * Comprehensive Legal & Courtroom Visual Prompt Engine.
 * Provides 12+ distinct, high-fidelity prompt archetypes covering advocates, lawyers,
 * courtroom benches, archival newspaper cuttings, FIR dockets, chambers, and judicial verdicts.
 * 
 * Generates randomly selected or deterministic trios of prompts for each case
 * so no two cases look the same.
 */

export interface PromptArchetype {
  id: string;
  name: string;
  category: 'advocate' | 'bench' | 'newspaper' | 'docket' | 'chambers' | 'verdict' | 'symbolism' | 'forensics';
  targetSlot: 'poster' | 'exhibit' | 'verdict' | 'any';
  description: string;
  generatePrompt: (ctx: CasePromptContext) => string;
}

export interface CasePromptContext {
  title: string;
  shortTitle?: string;
  court?: string;
  year?: number | string;
  genre?: string;
  statuteSections?: string;
  categoryTag?: string;
  slug?: string;
}

export interface CasePromptSet {
  poster: {
    archetypeId: string;
    archetypeName: string;
    prompt: string;
  };
  exhibit: {
    archetypeId: string;
    archetypeName: string;
    prompt: string;
  };
  verdict: {
    archetypeId: string;
    archetypeName: string;
    prompt: string;
  };
  allAvailable: Array<{
    id: string;
    name: string;
    category: string;
    targetSlot: string;
    prompt: string;
  }>;
}

// 12+ Rich Legal Prompt Archetypes
export const LEGAL_PROMPT_ARCHETYPES: PromptArchetype[] = [
  {
    id: 'senior-advocate-bar',
    name: '1. Senior Advocate at the Bar',
    category: 'advocate',
    targetSlot: 'poster',
    description: 'Distinguished Indian Senior Advocate arguing passionately at the wooden lectern with robes and white neck bands.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Landmark Legal Case';
      const court = ctx.court || 'Supreme Court of India';
      const year = ctx.year || '1980';
      const genre = ctx.genre || ctx.categoryTag || 'Constitutional Law';
      return `Dramatic 16:9 cinematic archival photograph of a distinguished Indian Senior Advocate in classic black court gown with white neck bands, standing at the polished teak wooden lectern arguing passionately before the ${court} in the landmark trial of "${title}" (${year}), open law reports and legal briefs, golden tungsten lighting casting warm amber highlights and deep dramatic shadows, authentic Indian courtroom atmosphere, 8k resolution.`;
    },
  },
  {
    id: 'constitution-bench-rostrum',
    name: '2. Constitution Bench on High Rostrum',
    category: 'bench',
    targetSlot: 'verdict',
    description: 'Hon\'ble multi-judge Constitution Bench in solemn deliberation under the Ashoka Lion emblem.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Landmark Trial';
      const court = ctx.court || 'Supreme Court of India';
      const year = ctx.year || '1973';
      return `Historic 16:9 wide shot of the multi-judge Constitution Bench of the ${court} delivering the decisive ruling in "${title}" (${year}), Hon'ble judges in ceremonial robes seated on the elevated mahogany bench beneath the national Ashoka Lion crest, wooden gavels and stacks of certified dockets, solemn and dignified courtroom majesty, cinematic archival lighting, 8k ultra-sharp detail.`;
    },
  },
  {
    id: 'vintage-newspaper-headline',
    name: '3. Vintage Archival Newspaper Headline',
    category: 'newspaper',
    targetSlot: 'exhibit',
    description: '1970s-1990s yellowed broadsheet newspaper clipping with bold ink typography headline and halftone photo.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Historic Case';
      const year = ctx.year || '1985';
      const court = ctx.court || 'High Court';
      return `Authentic archival broadsheet newspaper front-page cutting from ${year} covering the sensational trial of "${title}", bold retro black ink typography headline: "SENSATIONAL PROCEEDINGS BEFORE ${court.toUpperCase()}", yellowed aged newsprint paper texture with realistic creases, vintage halftone monochrome press photograph, historic Indian journalism aesthetic, 8k macro documentary photography.`;
    },
  },
  {
    id: 'police-station-fir-docket',
    name: '4. Police FIR & Station House Crime Diary',
    category: 'docket',
    targetSlot: 'exhibit',
    description: 'Official FIR case docket, station house register with government red seal, tied with red ribbon.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Case Record';
      const statutes = ctx.statuteSections || 'Statutory Offences';
      const year = ctx.year || '1978';
      return `Official Indian station house investigation docket and certified FIR register for "${title}" (${year}), stamped government red ink seal, typed memo mentioning ${statutes}, tied with traditional red evidentiary ribbon tape, vintage brass magnifying glass and fountain pen resting on dark wooden police desk, archival documentary evidence record, 8k resolution.`;
    },
  },
  {
    id: 'senior-counsel-chambers',
    name: '5. Senior Counsel Chambers & Strategy Conference',
    category: 'chambers',
    targetSlot: 'poster',
    description: 'Late-night law chambers lined with thousands of leather-bound AIR & SCC reports and brass desk lamp.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Landmark Case';
      return `Cinematic 16:9 wide shot inside a senior Indian advocate's historic law chambers late at night preparing strategy for "${title}", tall mahogany bookshelves filled with thousands of gold-embossed All India Reporter (AIR) and SCC law volumes, classic green banker brass lamp casting warm golden glow over open case dockets with red ink annotations, steaming glass of tea, intense scholarly atmosphere.`;
    },
  },
  {
    id: 'courthouse-steps-press-scrum',
    name: '6. Courthouse Steps & Media Press Scrum',
    category: 'advocate',
    targetSlot: 'poster',
    description: 'Advocates emerging onto the monumental sandstone steps surrounded by journalists and flash cameras.',
    generatePrompt: (ctx) => {
      const court = ctx.court || 'Supreme Court of India';
      const title = ctx.title || 'Historic Verdict';
      const year = ctx.year || '1990';
      return `Atmospheric 16:9 press conference scene on the grand sandstone steps outside the ${court} following the hearing in "${title}" (${year}), senior advocates in black robes and collars surrounded by a swarm of press reporters with vintage microphones and flashbulbs, dramatic late afternoon golden hour lighting, energetic legal media frenzy, cinematic documentary capture.`;
    },
  },
  {
    id: 'lady-justice-bronze-scales',
    name: '7. Lady Justice Bronze Scales & Constitution',
    category: 'symbolism',
    targetSlot: 'poster',
    description: 'Dramatic bronze Lady Justice statue with balanced scales set against the Constitution of India.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Constitutional Precedent';
      const genre = ctx.genre || ctx.categoryTag || 'Constitutional Law';
      return `Striking cinematic 16:9 composition featuring a bronze Lady Justice holding the balanced scales of equity, set beside an illuminated leather-bound volume of the Constitution of India for "${title}" (${genre}), warm amber and dark mahogany chiaroscuro illumination, shallow depth of field, solemn judicial majesty, 8k resolution fine art render.`;
    },
  },
  {
    id: 'witness-box-cross-examination',
    name: '8. Witness Box & High-Tension Cross Examination',
    category: 'bench',
    targetSlot: 'verdict',
    description: 'Tense witness box in a crowded courtroom with advocate cross-examining under dramatic sunbeams.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Trial Evidence';
      const court = ctx.court || 'Court of Session';
      return `High-drama 16:9 cinematic shot of the wooden witness box inside the ${court} during crucial testimony in "${title}", defence advocate in black gown confronting witness with official records, beam of sunlight cutting through high courtroom windows, crowded gallery listening in silence, 1970s retro film grain, intense legal confrontation.`;
    },
  },
  {
    id: 'forensic-ballistics-docket',
    name: '9. Forensic Evidence & Ballistics Dossier',
    category: 'forensics',
    targetSlot: 'exhibit',
    description: 'Forensic lab comparison sheets, fingerprint cards, certified evidence tag with court seal.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Investigation Record';
      const year = ctx.year || '1961';
      return `Archival forensic investigation laboratory table for "${title}" (${year}), certified ballistic examination sheets, fingerprint comparison cards, official court registry exhibit tag marked "EXHIBIT NO. 1 - CONFIDENTIAL", vintage camera negatives and precision caliper on dark mahogany table, authentic historical forensic evidentiary document, 8k resolution.`;
    },
  },
  {
    id: 'judicial-chambers-drafting',
    name: '10. Judge in Private Chambers Writing the Ratio',
    category: 'chambers',
    targetSlot: 'verdict',
    description: 'High Court judge seated in private chambers writing the landmark ratio decidendi with a fountain pen.',
    generatePrompt: (ctx) => {
      const court = ctx.court || 'High Court';
      const title = ctx.title || 'Landmark Precedent';
      const year = ctx.year || '1980';
      return `Intimate 16:9 cinematic wide shot of a senior ${court} judge in private chambers late at night writing the landmark judgment ratio for "${title}" (${year}) with a classic fountain pen, legal treatises and precedent dockets spread across the wooden desk, warm brass desk lamp, grandfather clock in background, serene and solemn intellectual atmosphere, 8k cinematic lighting.`;
    },
  },
  {
    id: 'apex-court-monumental-dusk',
    name: '11. Apex Court Architecture at Dramatic Dusk',
    category: 'bench',
    targetSlot: 'poster',
    description: 'Monumental neoclassical dome and sandstone corridors of the apex court at dusk with advocates.',
    generatePrompt: (ctx) => {
      const court = ctx.court || 'Supreme Court of India';
      const title = ctx.title || 'Constitutional Milestone';
      return `Cinematic 16:9 archival establishing shot of the majestic neoclassical sandstone facade and dome of the ${court} at dusk, lawyers and advocates in flowing black robes walking through the illuminated pillared portico with leather briefcases, dramatic twilight sky, glowing amber lanterns, iconic legal landmark setting for "${title}", 8k resolution.`;
    },
  },
  {
    id: 'gavel-strike-final-order',
    name: '12. Gavel Strike Pronouncing Final Verdict',
    category: 'verdict',
    targetSlot: 'verdict',
    description: 'Teak wood judicial gavel striking the sound block as the historic judgment is pronounced.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Historic Case';
      const court = ctx.court || 'Supreme Court of India';
      const year = ctx.year || '2018';
      return `Dramatic close-up 16:9 shot of a dark polished teak wood judicial gavel striking the circular sound block on the bench of the ${court} in "${title}" (${year}), pronouncing the final authoritative holding, legal briefs and official court seal in soft focus background, dynamic motion impact, crisp lighting, 8k cinematic resolution.`;
    },
  },
  {
    id: 'official-gazette-notification',
    name: '13. Official Gazette Bulletin & Royal Seal',
    category: 'docket',
    targetSlot: 'exhibit',
    description: 'Official government gazette decree with royal seal and historic letterpress typography.',
    generatePrompt: (ctx) => {
      const title = ctx.title || 'Statutory Precedent';
      const statutes = ctx.statuteSections || 'Constitutional Amendment';
      const year = ctx.year || '1976';
      return `Authentic archival extraordinary Gazette of India publication and certified judicial decree for "${title}" (${year}), official government emblem and circular red seal, crisp letterpress typography outlining ${statutes}, aged cream parchment paper with historical deckled edges, 8k archival document reproduction.`;
    },
  },
];

/**
 * Deterministic string hash to seed pseudo-random number generator
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Generate 3 distinct prompts for a case.
 * If random=true, rolls purely randomly.
 * If random=false (default), uses case slug/title hash for deterministic variety.
 */
export function getCaseVisualPrompts(
  context: CasePromptContext,
  options?: { forceRandom?: boolean }
): CasePromptSet {
  const seedStr = options?.forceRandom
    ? `${context.slug || context.title}-${Date.now()}-${Math.random()}`
    : `${context.slug || context.title || 'case'}-seed-v2`;

  const seed = hashString(seedStr);

  // Group archetypes by preferred slot
  const posterPool = LEGAL_PROMPT_ARCHETYPES.filter(
    (a) => a.targetSlot === 'poster' || a.category === 'advocate' || a.category === 'chambers' || a.category === 'symbolism'
  );
  const exhibitPool = LEGAL_PROMPT_ARCHETYPES.filter(
    (a) => a.targetSlot === 'exhibit' || a.category === 'newspaper' || a.category === 'docket' || a.category === 'forensics'
  );
  const verdictPool = LEGAL_PROMPT_ARCHETYPES.filter(
    (a) => a.targetSlot === 'verdict' || a.category === 'bench' || a.category === 'verdict'
  );

  // Select 1 from each pool ensuring no duplicate archetype IDs
  const posterIndex = seed % posterPool.length;
  const selectedPoster = posterPool[posterIndex] || LEGAL_PROMPT_ARCHETYPES[0];

  const exhibitCandidates = exhibitPool.filter((a) => a.id !== selectedPoster.id);
  const exhibitIndex = (seed >> 3) % exhibitCandidates.length;
  const selectedExhibit = exhibitCandidates[exhibitIndex] || LEGAL_PROMPT_ARCHETYPES[2];

  const verdictCandidates = verdictPool.filter(
    (a) => a.id !== selectedPoster.id && a.id !== selectedExhibit.id
  );
  const verdictIndex = (seed >> 6) % verdictCandidates.length;
  const selectedVerdict = verdictCandidates[verdictIndex] || LEGAL_PROMPT_ARCHETYPES[1];

  // Map all available for selector dropdowns
  const allAvailable = LEGAL_PROMPT_ARCHETYPES.map((arch) => ({
    id: arch.id,
    name: arch.name,
    category: arch.category,
    targetSlot: arch.targetSlot,
    prompt: arch.generatePrompt(context),
  }));

  return {
    poster: {
      archetypeId: selectedPoster.id,
      archetypeName: selectedPoster.name,
      prompt: selectedPoster.generatePrompt(context),
    },
    exhibit: {
      archetypeId: selectedExhibit.id,
      archetypeName: selectedExhibit.name,
      prompt: selectedExhibit.generatePrompt(context),
    },
    verdict: {
      archetypeId: selectedVerdict.id,
      archetypeName: selectedVerdict.name,
      prompt: selectedVerdict.generatePrompt(context),
    },
    allAvailable,
  };
}

/**
 * Get a single specific archetype prompt for a case
 */
export function getArchetypePrompt(archetypeId: string, context: CasePromptContext): string {
  const arch = LEGAL_PROMPT_ARCHETYPES.find((a) => a.id === archetypeId);
  if (arch) {
    return arch.generatePrompt(context);
  }
  return LEGAL_PROMPT_ARCHETYPES[0].generatePrompt(context);
}
