export interface LegalDefinition {
  term: string;
  definition: string;
  definitionHi: string;
  category: 'procedure' | 'constitutional' | 'criminal' | 'general';
}

export const LEGAL_DICTIONARY: Record<string, LegalDefinition> = {
  'sub-judice': {
    term: 'Sub-judice',
    definition: 'A matter currently under active judicial consideration, meaning public commentary cannot try to influence or prejudice the trial.',
    definitionHi: 'वह मामला जो वर्तमान में न्यायालय के विचाराधीन है, जिस पर पूर्वाग्रही सार्वजनिक टिप्पणी प्रतिबंधित है।',
    category: 'procedure',
  },
  'stay order': {
    term: 'Stay Order',
    definition: 'A temporary judicial order halting a lower court proceeding, demolition, or administrative action until the court makes a final ruling.',
    definitionHi: 'न्यायालय द्वारा किसी आदेश या कार्रवाई पर अंतरिम रोक (स्थगन आदेश)।',
    category: 'procedure',
  },
  'quashing of fir': {
    term: 'Quashing of FIR',
    definition: 'A High Court power under Section 482 CrPC to completely cancel a police complaint when allegations disclose no cognizable offense.',
    definitionHi: 'उच्च न्यायालय द्वारा दुर्भावनापूर्ण या आधारहीन प्राथमिकी (FIR) को पूर्णतः रद्द करना।',
    category: 'criminal',
  },
  'ratio decidendi': {
    term: 'Ratio Decidendi',
    definition: 'The core legal principle and reason behind the judges\' decision, which serves as a binding rule for all lower courts.',
    definitionHi: 'फैसले का मूल विधिक सिद्धांत, जो भविष्य के सभी मामलों के लिए बाध्यकारी कानून बनता है।',
    category: 'general',
  },
  'obiter dicta': {
    term: 'Obiter Dicta',
    definition: 'Incidental opinions or observations made by a judge in a verdict that are influential but not legally binding precedents.',
    definitionHi: 'न्यायाधीश की अनौपचारिक विधिक टिप्पणियां, जो बाध्यकारी नहीं बल्कि मार्गदर्शक होती हैं।',
    category: 'general',
  },
  'habeas corpus': {
    term: 'Habeas Corpus',
    definition: 'A fundamental constitutional writ commanding police to physically produce a detained person in court to verify if their arrest was lawful.',
    definitionHi: 'संवैधानिक बंदी प्रत्यक्षीकरण याचिका, जिसके तहत गैरकानूनी रूप से हिरासत में लिए गए व्यक्ति को रिहा कराया जाता है।',
    category: 'constitutional',
  },
  'prima facie': {
    term: 'Prima Facie',
    definition: 'Latin for "at first sight" — evidence that appears sufficient to establish a fact unless rebutted or disproved by other evidence.',
    definitionHi: 'प्रथम दृष्टया — पहली नजर में पर्याप्त प्रतीत होने वाला साक्ष्य।',
    category: 'general',
  },
  'section 144': {
    term: 'Section 144 CrPC',
    definition: 'An executive magistrate order banning the assembly of 4 or more people to urgently prevent public disorder or riots.',
    definitionHi: 'कार्यकारी मजिस्ट्रेट द्वारा शांति व्यवस्था बनाए रखने हेतु 4 या अधिक व्यक्तियों के एकत्र होने पर प्रतिबंध।',
    category: 'criminal',
  },
  'quash': {
    term: 'Quash',
    definition: 'To officially declare an order, indictment, or warrant invalid and completely void.',
    definitionHi: 'किसी आदेश या कार्यवाही को कानूनी रूप से शून्य घोषित कर निरस्त करना।',
    category: 'procedure',
  },
  'anticipatory bail': {
    term: 'Anticipatory Bail',
    definition: 'Bail granted by a Sessions Court or High Court before arrest, ensuring an innocent citizen is not jailed in an anticipated false case.',
    definitionHi: 'गिरफ्तारी से पूर्व न्यायालय द्वारा दी जाने वाली अग्रिम जमानत।',
    category: 'criminal',
  },
  'cognizable offence': {
    term: 'Cognizable Offence',
    definition: 'A serious crime where police have the legal authority to arrest an accused immediately without waiting for a magistrate warrant.',
    definitionHi: 'गंभीर संज्ञेय अपराध, जिसमें पुलिस बिना वारंट के अभियुक्त को गिरफ्तार कर सकती है।',
    category: 'criminal',
  },
  'bailable offence': {
    term: 'Bailable Offence',
    definition: 'An offense where securing bail is a matter of statutory right upon depositing surety, not a court discretion.',
    definitionHi: 'जमानती अपराध, जिसमें जमानत पाना अभियुक्त का वैधानिक अधिकार होता है।',
    category: 'criminal',
  },
  'locus standi': {
    term: 'Locus Standi',
    definition: 'The legal right of an individual to bring a lawsuit or petition before the court (relaxed in Public Interest Litigation).',
    definitionHi: 'न्यायालय के समक्ष याचिका दाखिल करने का विधिक अधिकार।',
    category: 'procedure',
  },
  'ultra vires': {
    term: 'Ultra Vires',
    definition: 'An act or statute done beyond the legal power or jurisdiction of the authority or legislature, making it void.',
    definitionHi: 'विधिक या संवैधानिक अधिकारों से परे जाकर किया गया गैरकानूनी कार्य।',
    category: 'constitutional',
  },
  'res judicata': {
    term: 'Res Judicata',
    definition: 'A universal rule preventing parties from repeatedly suing over a dispute that has already been conclusively decided by a court.',
    definitionHi: 'प्राङ्न्याय — वह सिद्धांत जिसके तहत एक बार अंतिम रूप से निपटे विवाद पर पुनः मुकदमा नहीं हो सकता।',
    category: 'procedure',
  },
  'mandamus': {
    term: 'Writ of Mandamus',
    definition: 'A Supreme Court or High Court order commanding a public authority or government official to perform their statutory public duty.',
    definitionHi: 'परमादेश — उच्च या सर्वोच्च न्यायालय द्वारा लोक अधिकारी को अपने कानूनी कर्तव्य का पालन करने का आदेश।',
    category: 'constitutional',
  },
  'amicus curiae': {
    term: 'Amicus Curiae',
    definition: 'A "friend of the court" — a neutral expert senior advocate appointed by the bench to give unbiased legal advice on complex issues.',
    definitionHi: 'न्यायालय मित्र — जटिल कानूनी प्रश्नों पर पीठ की सहायता हेतु नियुक्त निष्पक्ष वरिष्ठ अधिवक्ता।',
    category: 'procedure',
  },
  'suo motu': {
    term: 'Suo Motu',
    definition: 'Action initiated by a court on its own initiative based on news reports or public grievances, without a formal petition.',
    definitionHi: 'स्वतः संज्ञान — बिना किसी औपचारिक याचिका के न्यायालय द्वारा स्वयं पहल कर शुरू की गई कार्यवाही।',
    category: 'procedure',
  },
  'per incuriam': {
    term: 'Per Incuriam',
    definition: 'A judgment rendered in ignorance or oversight of a binding statutory provision or higher Supreme Court precedent.',
    definitionHi: 'अनवधानता में दिया गया फैसला, जो पूर्ववर्ती बाध्यकारी कानून की अनदेखी के कारण नजीर नहीं माना जाता।',
    category: 'general',
  },
  'proportionality': {
    term: 'Doctrine of Proportionality',
    definition: 'A constitutional test requiring that state restrictions on citizen rights must be strictly necessary, least intrusive, and proportionate to the goal.',
    definitionHi: 'आनुपातिकता का सिद्धांत — राज्य द्वारा नागरिक अधिकारों पर पाबंदी केवल अपरिहार्य और न्यूनतम स्तर तक ही होनी चाहिए।',
    category: 'constitutional',
  },
  'ad interim': {
    term: 'Ad Interim',
    definition: 'A temporary emergency order passed by the court to protect the status quo until regular arguments can be heard.',
    definitionHi: 'अग्रिम सुनवाई होने तक लागू रहने वाला अल्पकालिक अंतरिम आदेश।',
    category: 'procedure',
  },
  'in limine': {
    term: 'In Limine',
    definition: 'A threshold dismissal of a petition at the very outset without issuing notice or calling for full counter-affidavits.',
    definitionHi: 'आरंभिक स्तर पर ही बिना विस्तृत सुनवाई याचिका को खारिज करना।',
    category: 'procedure',
  },
  'coram': {
    term: 'Coram / Bench',
    definition: 'The specific judges who constitute the judicial bench presiding over the case.',
    definitionHi: 'न्यायाधीशों की वह पीठ जो किसी मामले की सुनवाई और निर्णय करती है।',
    category: 'procedure',
  },
  'special leave petition': {
    term: 'Special Leave Petition (SLP)',
    definition: 'A discretionary petition under Article 136 asking the Supreme Court of India to grant special permission to appeal against any lower court order.',
    definitionHi: 'अनुच्छेद 136 के अंतर्गत सर्वोच्च न्यायालय में विशेष अनुमति याचिका।',
    category: 'constitutional',
  },
};

/**
 * Normalizes term string to dictionary lookup key
 */
export function findLegalDefinition(termOrSlug: string): LegalDefinition | null {
  if (!termOrSlug) return null;
  const clean = termOrSlug.toLowerCase().trim().replace(/[-_]/g, ' ');

  if (LEGAL_DICTIONARY[clean]) return LEGAL_DICTIONARY[clean];

  // Partial or key match
  for (const [key, val] of Object.entries(LEGAL_DICTIONARY)) {
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return val;
    }
  }

  return null;
}
