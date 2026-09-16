import { AdminIngestPayload, CaseData, CaseTheme, StoryPanel, CaseBrief, CharacterItem, ArgumentSide, JudgeDecision, ImageMetadata } from '@/types';

// Helper to generate a clean URL-friendly slug
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Map genre to visual theme and default watermark
function getGenreTheme(genre: string): { theme: CaseTheme; defaultWatermark: string } {
  switch (genre) {
    case 'constitutional':
      return { theme: 'constitutional-gold', defaultWatermark: 'CONSTITUTION' };
    case 'cyber':
      return { theme: 'cyber-neon', defaultWatermark: 'IT ACT' };
    case 'consumer':
    case 'tort':
      return { theme: 'corporate-luxury', defaultWatermark: 'TORT LAW' };
    case 'crime':
    default:
      return { theme: 'crime-noir', defaultWatermark: 'CRIME FILE' };
  }
}

// Determine appropriate legal party designations based on genre
function getPartyTerminology(genre: string) {
  if (genre === 'crime') {
    return {
      side1Label: 'PROSECUTION',
      side1DefaultParty: 'State / Prosecution',
      side2Label: 'DEFENCE',
      side2DefaultParty: 'Accused / Defence Counsel',
    };
  }
  if (genre === 'consumer' || genre === 'tort') {
    return {
      side1Label: 'COMPLAINANT',
      side1DefaultParty: 'Complainant / Appellant',
      side2Label: 'RESPONDENT',
      side2DefaultParty: 'Company / Respondent',
    };
  }
  return {
    side1Label: 'PETITIONER',
    side1DefaultParty: 'Petitioner',
    side2Label: 'UNION OF INDIA',
    side2DefaultParty: 'Union of India & State',
  };
}

// Simple English-to-Hindi contextual translator for legal terms
function autoTranslateToHindi(text: string): string {
  if (!text) return '';
  // Basic transliteration / term mapping for legal keywords
  return text
    .replace(/Supreme Court/gi, 'सुप्रीम कोर्ट')
    .replace(/High Court/gi, 'हाई कोर्ट')
    .replace(/Petitioner/gi, 'याचिकाकर्ता')
    .replace(/Respondent/gi, 'प्रतिवादी')
    .replace(/Prosecution/gi, 'अभियोजन')
    .replace(/Accused/gi, 'अभियुक्त')
    .replace(/Judgment/gi, 'फैसला')
    .replace(/Verdict/gi, 'निर्णय')
    .replace(/Constitution/gi, 'संविधान')
    .replace(/Article/gi, 'अनुच्छेद')
    .replace(/Section/gi, 'धारा');
}

function getDefaultGenreImages(genre: string) {
  switch (genre) {
    case 'crime':
      return {
        banner: '/images/cases/nanavati-case.jpg',
        scene: '/images/cases/ghost_thapa_portrait.jpg',
        verdict: '/images/cases/ghost_court_verdict.jpg',
      };
    case 'constitutional':
      return {
        banner: '/images/cases/kesavananda-bharati.jpg',
        scene: '/images/cases/kesavananda_monk.jpg',
        verdict: '/images/cases/maneka-gandhi.jpg',
      };
    case 'cyber':
      return {
        banner: '/images/cases/shreya-singhal.jpg',
        scene: '/images/cases/shreya-singhal.jpg',
        verdict: '/images/cases/navtej-johar.jpg',
      };
    case 'consumer':
    case 'tort':
    default:
      return {
        banner: '/images/cases/haircut-case.jpg',
        scene: '/images/cases/m-c-mehta.jpg',
        verdict: '/images/cases/shah-bano.jpg',
      };
  }
}

export async function processCaseIngestion(payload: AdminIngestPayload): Promise<CaseData> {
  const {
    title,
    shortTitle,
    citation = 'Citation Pending Verification',
    court,
    year,
    genre,
    statuteSections,
    factsSummary,
    judgmentUrl = 'https://indiankanoon.org/',
    judgmentText = '',
    additionalNotes = '',
  } = payload;

  const rawSlug = shortTitle || title;
  const slug = slugify(rawSlug);
  const { theme, defaultWatermark } = getGenreTheme(genre);
  const terminology = getPartyTerminology(genre);

  const fullContext = `${factsSummary}\n${judgmentText}\n${additionalNotes}`.trim();
  const paragraphs = fullContext.split(/\n+/).filter(Boolean);
  const primaryFact = paragraphs[0] || `${title} heard before ${court} in ${year}.`;
  const secondaryFact = paragraphs[1] || `The dispute centered on the statutory application of ${statuteSections}.`;
  const tertiaryFact = paragraphs[2] || `The court examined the scope and constitutional validity of the impugned action.`;

  // Default images from existing high-res case images
  const defaultImages = getDefaultGenreImages(genre);
  const bannerImagePath = defaultImages.banner;
  const sceneImagePath = defaultImages.scene;
  const verdictImagePath = defaultImages.verdict;

  // Image Prompt Generation based on real case attributes
  const heroImagePrompt = `Cinematic wide 16:9 shot representing ${title} (${court}, ${year}), dramatic legal atmosphere, 35mm film photography, atmospheric courtroom or historical setting, dark documentary film style.`;
  const sceneImagePrompt = `Archival documentary style photograph of ${court} hearing regarding ${statuteSections} in ${year}, moody lighting, vintage contrast.`;
  const verdictImagePrompt = `Historical photograph of the judges of ${court} delivering the landmark judgment in ${year}, legal books and elevated bench.`;

  const imagesList: ImageMetadata[] = [
    {
      id: `img-${slug}-banner`,
      type: 'banner',
      prompt: heroImagePrompt,
      url: bannerImagePath,
      isAiGenerated: true,
      isApproved: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: `img-${slug}-scene`,
      type: 'scene',
      panelId: 'panel-1',
      prompt: sceneImagePrompt,
      url: sceneImagePath,
      isAiGenerated: true,
      isApproved: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: `img-${slug}-verdict`,
      type: 'courtroom',
      panelId: 'panel-7',
      prompt: verdictImagePrompt,
      url: verdictImagePath,
      isAiGenerated: true,
      isApproved: false,
      createdAt: new Date().toISOString(),
    },
  ];

  // Dramatis Personae
  const characters: CharacterItem[] = [
    {
      name: { en: terminology.side1DefaultParty, hi: autoTranslateToHindi(terminology.side1DefaultParty) },
      role: { en: 'Primary Litigant', hi: 'मुख्य वादी' },
      tag: { en: `Moved ${court}`, hi: `${court} में चुनौती दी` },
      description: {
        en: `Initiated the legal action seeking judicial relief under ${statuteSections}.`,
        hi: `${statuteSections} के तहत न्यायिक राहत की मांग की।`,
      },
      badgeEmoji: '⚖️',
    },
    {
      name: { en: terminology.side2DefaultParty, hi: autoTranslateToHindi(terminology.side2DefaultParty) },
      role: { en: 'Respondent / Opposing Party', hi: 'प्रतिवादी पक्ष' },
      tag: { en: 'Defended Order', hi: 'आदेश का बचाव किया' },
      description: {
        en: `Contended that the impugned order/action was completely within statutory authority.`,
        hi: `तर्क दिया कि की गई कार्रवाई कानूनी अधिकार क्षेत्र के भीतर थी।`,
      },
      badgeEmoji: '🏛️',
    },
    {
      name: { en: `${court} Bench`, hi: `${court} पीठ` },
      role: { en: 'Judicial Bench', hi: 'न्यायिक पीठ' },
      tag: { en: `${year} Precedent`, hi: `${year} का ऐतिहासिक फैसला` },
      description: {
        en: `Delivered the binding ratio interpreting ${statuteSections}.`,
        hi: `${statuteSections} की व्याख्या करते हुए बाध्यकारी निर्णय दिया।`,
      },
      badgeEmoji: '📜',
    },
  ];

  // Arguments
  const prosecutionArgs: ArgumentSide = {
    party: { en: terminology.side1DefaultParty, hi: autoTranslateToHindi(terminology.side1DefaultParty) },
    statute: statuteSections,
    claim: {
      en: `The action directly infringes upon protected rights under ${statuteSections}.`,
      hi: `${statuteSections} के तहत संरक्षित अधिकारों का उल्लंघन हुआ है।`,
    },
    keyPoint: {
      en: primaryFact,
      hi: autoTranslateToHindi(primaryFact),
    },
  };

  const defenceArgs: ArgumentSide = {
    party: { en: terminology.side2DefaultParty, hi: autoTranslateToHindi(terminology.side2DefaultParty) },
    statute: statuteSections,
    claim: {
      en: `The state / authority acted strictly in accordance with statutory procedure.`,
      hi: `अधिकारियों ने वैधानिक प्रक्रिया के तहत कार्य किया है।`,
    },
    keyPoint: {
      en: secondaryFact,
      hi: autoTranslateToHindi(secondaryFact),
    },
  };

  // Interactive Judge Decision
  const judgeDecision: JudgeDecision = {
    question: {
      en: `Should ${court} strike down the action under ${statuteSections}?`,
      hi: `क्या ${court} को ${statuteSections} के तहत कार्रवाई को रद्द करना चाहिए?`,
    },
    subtext: {
      en: `Analyze the arguments before reading the certified holding of the court.`,
      hi: `अदालत का फैसला देखने से पहले अपना निर्णय दर्ज करें।`,
    },
    options: [
      {
        id: 'opt-1',
        title: {
          en: `Yes: Uphold Fundamental Statutory Protections`,
          hi: `हाँ: कानूनी व संवैधानिक अधिकारों की रक्षा करें`,
        },
        reason: {
          en: `Arbitrary administrative action without procedural safeguards cannot stand.`,
          hi: `बिना सुरक्षात्मक प्रक्रिया के मनमानी कार्रवाई मान्य नहीं हो सकती।`,
        },
        simulatedVotesPercent: 78,
        isActualVerdict: true,
      },
      {
        id: 'opt-2',
        title: {
          en: `No: Defer to Executive & Statutory Discretion`,
          hi: `नहीं: कार्यपालिका के अधिकार क्षेत्र को प्राथमिकता दें`,
        },
        reason: {
          en: `Courts should exercise restraint in administrative determinations.`,
          hi: `अदालतों को प्रशासनिक मामलों में हस्तक्षेप से बचना चाहिए।`,
        },
        simulatedVotesPercent: 22,
        isActualVerdict: false,
      },
    ],
    judicialRationale: {
      en: `${court} established that exercise of power must be just, fair, and reasonable under ${statuteSections}.`,
      hi: `${court} ने स्पष्ट किया कि ${statuteSections} के तहत अधिकारों का प्रयोग निष्पक्ष व उचित होना चाहिए।`,
    },
  };

  // 7 Story Panels
  const panels: StoryPanel[] = [
    {
      id: 'panel-1',
      type: 'HOOK',
      eyebrow: { en: 'EPISODE 01 · THE PREMISE', hi: 'एपिसोड 01 · भूमिका' },
      headline: { en: title.toUpperCase(), hi: autoTranslateToHindi(title).toUpperCase() },
      body: { en: primaryFact, hi: autoTranslateToHindi(primaryFact) },
      photoExhibitSrc: bannerImagePath,
      photoExhibitCaption: {
        en: `Archival case record: ${court} (${year}).`,
        hi: `अदालती पुरालेख: ${court} (${year})।`,
      },
    },
    {
      id: 'panel-2',
      type: 'PEOPLE',
      eyebrow: { en: 'EPISODE 02 · DRAMATIS PERSONAE', hi: 'एपिसोड 02 · मुख्य पात्र' },
      headline: { en: 'THE KEY FIGURES IN THE DISPUTE', hi: 'विवाद के मुख्य पक्ष' },
      body: {
        en: `Meet the key entities whose legal dispute reached ${court}.`,
        hi: `जानिए उन पक्षों को जिनका मामला ${court} तक पहुंचा।`,
      },
      characters,
    },
    {
      id: 'panel-3',
      type: 'INCIDENT',
      eyebrow: { en: 'EPISODE 03 · THE CENTRAL CONFLICT', hi: 'एपिसोड 03 · मुख्य विवाद' },
      headline: { en: 'THE CHALLENGED PROCEEDING', hi: 'विवादित आदेश और कार्रवाई' },
      body: { en: secondaryFact, hi: autoTranslateToHindi(secondaryFact) },
      evidence: {
        archiveType: genre === 'crime' ? 'police_record' : 'court_decree',
        masthead: `${court.toUpperCase()} REGISTRY RECORD`,
        date: `${year}`,
        headline: {
          en: `OFFICIAL RECORD: PETITION FILED UNDER ${statuteSections.toUpperCase()}`,
          hi: `सरकारी रिकॉर्ड: ${statuteSections} के तहत याचिका दाखिल`,
        },
        snippet: {
          en: tertiaryFact,
          hi: autoTranslateToHindi(tertiaryFact),
        },
        highlightedPhrase: {
          en: statuteSections,
          hi: statuteSections,
        },
        exhibitNumber: `DOCKET #${year}`,
        caption: {
          en: `Original docket entry from ${court}.`,
          hi: `${court} की मूल केस प्रविष्टि।`,
        },
      },
    },
    {
      id: 'panel-4',
      type: 'EVIDENCE',
      eyebrow: { en: 'EPISODE 04 · EXHIBIT & ARCHIVE', hi: 'एपिसोड 04 · दस्तावेज व साक्ष्य' },
      headline: { en: 'THE CRITICAL EVIDENCE', hi: 'महत्वपूर्ण साक्ष्य' },
      body: {
        en: `The evidence examined by the court turned entirely on whether ${statuteSections} had been breached.`,
        hi: `अदालत के समक्ष मुख्य साक्ष्य इस बात पर आधारित था कि क्या ${statuteSections} का उल्लंघन हुआ।`,
      },
      evidence: {
        archiveType: 'newspaper',
        masthead: 'THE LEGAL PRESS DISPATCH',
        date: `${year}`,
        headline: {
          en: `${title.toUpperCase()}: ${court.toUpperCase()} EXAMINES STATUTORY MANDATE`,
          hi: `${title}: अदालत ने कानूनी प्रावधानों की समीक्षा की`,
        },
        snippet: {
          en: `${court} observed that legal statutory provisions cannot be applied arbitrarily.`,
          hi: `${court} ने टिप्पणी की कि कानूनी प्रावधानों को मनमाने ढंग से लागू नहीं किया जा सकता।`,
        },
        highlightedPhrase: {
          en: 'cannot be applied arbitrarily',
          hi: 'मनमाने ढंग से लागू नहीं किया जा सकता',
        },
        exhibitNumber: 'PRESS EXHIBIT',
        caption: {
          en: `Contemporary law report coverage (${year}).`,
          hi: `समकालीन विधि पत्रिका की रिपोर्ट (${year})।`,
        },
      },
    },
    {
      id: 'panel-5',
      type: 'ARGUMENTS',
      eyebrow: { en: 'EPISODE 05 · COURTROOM ARGUMENTS', hi: 'एपिसोड 05 · अदालती बहस' },
      headline: { en: 'THE LEGAL CLASH', hi: 'कानूनी दलीलें' },
      body: {
        en: `Both sides presented exhaustive arguments before ${court} regarding ${statuteSections}.`,
        hi: `दोनों पक्षों ने ${statuteSections} को लेकर अदालत के समक्ष विस्तृत दलीलें रखीं।`,
      },
      prosecutionArgs,
      defenceArgs,
    },
    {
      id: 'panel-6',
      type: 'YOU_DECIDE',
      eyebrow: { en: 'EPISODE 06 · YOU ARE THE JUDGE', hi: 'एपिसोड 06 · आप हैं जज' },
      headline: { en: 'DELIBERATE BEFORE THE BENCH', hi: 'अपना निर्णय दें' },
      body: {
        en: `You have reviewed the facts, arguments, and statutory provisions. How would you rule?`,
        hi: `आपने तथ्य, दलीलें और कानून देख लिए हैं। आपका निर्णय क्या होगा?`,
      },
      judgeDecision,
    },
    {
      id: 'panel-7',
      type: 'VERDICT',
      eyebrow: { en: 'EPISODE 07 · THE JUDICIAL VERDICT', hi: 'एपिसोड 07 · अंतिम फैसला' },
      headline: { en: 'THE CERTIFIED RATIO DECIDENDI', hi: 'अदालत का अंतिम फैसला' },
      body: {
        en: `${court} delivered its historic verdict, establishing binding principles under **${statuteSections}**.`,
        hi: `${court} ने अपना ऐतिहासिक फैसला सुनाते हुए **${statuteSections}** के तहत बाध्यकारी सिद्धांत तय किए।`,
      },
      stamp: {
        en: `FINAL ORDER · ${court.toUpperCase()}`,
        hi: `अंतिम फैसला · ${court.toUpperCase()}`,
      },
      photoExhibitSrc: verdictImagePath,
      photoExhibitCaption: {
        en: `${court} Bench delivering the landmark verdict (${year}).`,
        hi: `${court} पीठ द्वारा ऐतिहासिक फैसला सुनाया गया (${year})।`,
      },
    },
    {
      id: 'panel-8',
      type: 'RATIO',
      eyebrow: { en: 'EPISODE 08 · LEGAL RATIO & IMPACT', hi: 'एपिसोड 08 · कानूनी सिद्धांत और प्रभाव' },
      headline: { en: 'LEGAL RATIO & BINDING PRECEDENT', hi: 'बाध्यकारी कानूनी सिद्धांत व प्रभाव' },
      body: {
        en: `This ruling remains a landmark precedent on **${statuteSections}**.\n\n**HELD:** ${primaryFact}\n\nThe court established that the statutory protections of ${statuteSections} must be observed with strict fidelity.`,
        hi: `यह फैसला **${statuteSections}** पर एक ऐतिहासिक नजीर बना हुआ है।\n\n**निर्णय:** ${autoTranslateToHindi(primaryFact)}\n\nअदालत ने तय किया कि ${statuteSections} के वैधानिक प्रावधानों का निष्पक्ष पालन अनिवार्य है।`,
      },
      evidence: {
        archiveType: 'verdict_decree',
        masthead: 'CERTIFIED LAW REPORT',
        date: `${year}`,
        headline: {
          en: `LANDMARK RATIO: BINDING INTERPRETATION OF ${statuteSections.toUpperCase()}`,
          hi: `ऐतिहासिक सिद्धांत: ${statuteSections} की बाध्यकारी व्याख्या`,
        },
        snippet: {
          en: `HELD: The exercise of statutory authority under ${statuteSections} is subject to judicial review and natural justice principles.`,
          hi: `फैसला: ${statuteSections} के तहत अधिकारों का प्रयोग न्यायिक समीक्षा और प्राकृतिक न्याय के अधीन है।`,
        },
        highlightedPhrase: {
          en: statuteSections,
          hi: statuteSections,
        },
        exhibitNumber: `PRECEDENT · ${year}`,
        caption: {
          en: `Certified report of ${court} judgment (${year}).`,
          hi: `${court} के फैसले की प्रमाणित रिपोर्ट (${year})।`,
        },
      },
      citationFooter: `${citation} · ${court}`,
      judgmentUrl,
    },
  ];

  // Case Brief
  const brief: CaseBrief = {
    courtAndYear: {
      en: `${court.toUpperCase()} · ${year}`,
      hi: `${court.toUpperCase()} · ${year}`,
    },
    facts: {
      en: `${primaryFact} ${secondaryFact} ${tertiaryFact}`,
      hi: `${autoTranslateToHindi(primaryFact)} ${autoTranslateToHindi(secondaryFact)} ${autoTranslateToHindi(tertiaryFact)}`,
    },
    issues: {
      en: [
        `Whether the impugned action complied with statutory requirements under ${statuteSections}?`,
        `Whether procedural fairness and natural justice were observed?`,
      ],
      hi: [
        `क्या विवादित कार्रवाई ${statuteSections} के वैधानिक प्रावधानों के अनुरूप थी?`,
        `क्या प्राकृतिक न्याय और निष्पक्षता के सिद्धांतों का पालन किया गया?`,
      ],
    },
    chargesApplied: statuteSections.split(/[,;]+/).map((s) => s.trim()).filter(Boolean),
    held: {
      en: `${court} held that the statutory principles under ${statuteSections} must be upheld and applied consistently.`,
      hi: `${court} ने माना कि ${statuteSections} के कानूनी सिद्धांतों का निष्पक्ष व सुसंगत पालन अनिवार्य है।`,
    },
    reasoning: {
      en: `The court reasoned that administrative discretion must always be bounded by statutory intent and judicial standards.`,
      hi: `अदालत ने कहा कि प्रशासनिक विवेकाधिकार सदैव कानूनी मंशा और न्यायिक मानकों के अधीन होना चाहिए।`,
    },
    whyItMatters: {
      en: `This ruling stands as an essential precedent frequently cited on the interpretation of ${statuteSections}.`,
      hi: `यह फैसला ${statuteSections} की व्याख्या के लिए एक महत्वपूर्ण मिसाल है।`,
    },
  };

  const newCaseData: CaseData = {
    slug,
    title: { en: title, hi: autoTranslateToHindi(title) },
    tag: { en: `${statuteSections} · Precedent`, hi: `${statuteSections} · ऐतिहासिक फैसला` },
    categoryTag: statuteSections.split(/[,; ]+/)[0] || 'LAW',
    genre,
    theme,
    court,
    year,
    readTime: { en: '4 min read', hi: '4 मिनट' },
    blurb: {
      en: primaryFact.slice(0, 160) + (primaryFact.length > 160 ? '...' : ''),
      hi: autoTranslateToHindi(primaryFact.slice(0, 160)) + '...',
    },
    citation,
    judgmentUrl,
    watermark: defaultWatermark,
    bannerImage: bannerImagePath,
    matchRate: 97,
    maturityRating: genre === 'crime' ? 'U/A 16+' : 'U/A 13+',
    rank: 10,
    featuredHeroHook: { en: title, hi: autoTranslateToHindi(title) },
    featuredHeroDesc: { en: primaryFact, hi: autoTranslateToHindi(primaryFact) },
    hasJudgeDecision: true,
    panels,
    brief,
    status: 'ADMIN_REVIEW',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceText: fullContext,
    imagesList,
  };

  return newCaseData;
}
