export interface GlossaryTerm {
  id: string;
  term: {
    en: string;
    hi: string;
  };
  pronunciation?: string;
  category: 'Criminal Law' | 'Constitutional Law' | 'Civil & Torts' | 'Evidence & Procedure' | 'Consumer Law';
  code: string;
  definition: {
    en: string;
    hi: string;
  };
  plainExplanation: {
    en: string;
    hi: string;
  };
  relatedCaseSlugs: string[];
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'mistake-of-fact',
    term: {
      en: 'Mistake of Fact (Ignorantia Facti Excusat)',
      hi: 'तथ्य की भूल',
    },
    pronunciation: 'ig-nor-AN-she-uh FAK-ty ex-KEW-zat',
    category: 'Criminal Law',
    code: 'IPC · Section 79 / BNS · Section 17',
    definition: {
      en: 'A legal defence where an act is done in good faith by a person who, by reason of a mistake of fact and not a mistake of law, genuinely believes themselves to be justified by law in doing it.',
      hi: 'एक कानूनी बचाव जहां सद्भाव में कोई कार्य उस व्यक्ति द्वारा किया जाता है, जो कानून की भूल नहीं बल्कि तथ्य की भूल के कारण ईमानदारी से मानता है कि वह ऐसा करने के लिए कानूनन उचित है।',
    },
    plainExplanation: {
      en: "If you honestly believe you're attacking a supernatural monster in pitch darkness (when it was actually a person), the law protects you because your intention was not to harm a human.",
      hi: 'यदि आप सचमुच यह मानते हैं कि आप अंधेरे में किसी अलौकिक भूत पर वार कर रहे हैं (जो वास्तव में इंसान निकला), तो कानून आपको बचाता है क्योंकि आपका इरादा इंसान को नुकसान पहुँचाने का नहीं था।',
    },
    relatedCaseSlugs: ['ghost-case'],
  },
  {
    id: 'grave-sudden-provocation',
    term: {
      en: 'Grave and Sudden Provocation',
      hi: 'गंभीर और अचानक प्रकोपन',
    },
    pronunciation: 'grayv and SUD-den prah-vuh-KAY-shun',
    category: 'Criminal Law',
    code: 'IPC · Section 300 (Exception 1) / BNS · Section 101',
    definition: {
      en: 'An exception that reduces murder (Sec 302) to culpable homicide not amounting to murder (Sec 304) if the offender was deprived of the power of self-control by grave and sudden provocation.',
      hi: 'एक अपवाद जो हत्या (धारा 302) को गैर-इरादतन मानव वध (धारा 304) में बदल देता है यदि अपराधी गंभीर और अचानक उत्तेजना के कारण आत्म-नियंत्रण खो बैठा हो।',
    },
    plainExplanation: {
      en: "If you catch someone in a shock discovery and react in instant, uncontrolled fury, it's not premeditated murder. But if you have time to cool off and plan revenge, the defence fails completely.",
      hi: 'यदि आप अचानक किसी स्तब्ध करने वाली घटना पर तुरंत अनियंत्रित होकर हमला कर देते हैं, तो यह पूर्व-नियोजित हत्या नहीं मानी जाती। लेकिन अगर आपके पास शांत होने का समय था, तो यह बचाव लागू नहीं होता।',
    },
    relatedCaseSlugs: ['nanavati-case'],
  },
  {
    id: 'absolute-liability',
    term: {
      en: 'Absolute Liability (Enterprise Liability)',
      hi: 'पूर्ण दायित्व का सिद्धांत',
    },
    pronunciation: 'AB-suh-loot ly-uh-BIL-ih-tee',
    category: 'Civil & Torts',
    code: 'M.C. Mehta Doctrine · Article 21 & 32',
    definition: {
      en: 'A legal standard holding hazardous industrial enterprises strictly and unconditionally liable for all escape of toxic substances, with zero exceptions (unlike the British Rylands v. Fletcher rule).',
      hi: 'एक कानूनी मानक जो खतरनाक उद्योगों को किसी भी जहरीले रिसाव के लिए बिना किसी अपवाद के पूर्ण रूप से उत्तरदायी ठहराता है।',
    },
    plainExplanation: {
      en: "If an enterprise operates a dangerous chemical factory for profit, it must bear 100% of the cost of any disaster, even if caused by third parties, sabotage, or natural events.",
      hi: 'यदि कोई कारखाना खतरनाक रसायनों से लाभ कमाता है, तो किसी भी रिसाव या दुर्घटना की 100% भरपाई उसे ही करनी होगी, चाहे कारण कुछ भी रहा हो।',
    },
    relatedCaseSlugs: ['m-c-mehta'],
  },
  {
    id: 'basic-structure-doctrine',
    term: {
      en: 'Basic Structure Doctrine',
      hi: 'संविधान के मूल ढांचे का सिद्धांत',
    },
    pronunciation: 'BAY-sik STRUK-chur DAHK-trin',
    category: 'Constitutional Law',
    code: 'Article 368 · Kesavananda Bharati Rule',
    definition: {
      en: 'A landmark judicial principle ruling that Parliament can amend provisions of the Indian Constitution, but cannot alter, destroy, or abrogate its fundamental identity and basic core structure (e.g. Democracy, Secularism, Judicial Review, Rule of Law).',
      hi: 'एक ऐतिहासिक न्यायिक सिद्धांत जिसके अनुसार संसद संविधान में संशोधन कर सकती है, लेकिन इसके मूल ढांचे (जैसे लोकतंत्र, धर्मनिरपेक्षता, न्यायिक समीक्षा, कानून का शासन) को नष्ट या बदल नहीं सकती।',
    },
    plainExplanation: {
      en: "Parliament is powerful, but not supreme — the Constitution is supreme. You can renovate the house, but you cannot demolish the foundation pillars.",
      hi: 'संसद शक्तिशाली है, लेकिन संविधान सर्वोच्च है। आप मकान का नवीनीकरण कर सकते हैं, लेकिन उसकी नींव के खंभों को नहीं गिरा सकते।',
    },
    relatedCaseSlugs: ['kesavananda-bharati'],
  },
  {
    id: 'chilling-effect',
    term: {
      en: 'Chilling Effect & Vagueness Doctrine',
      hi: 'वाक् स्वतंत्रता पर प्रतिकूल प्रभाव का सिद्धांत',
    },
    pronunciation: 'CHIL-ing ih-FEKT',
    category: 'Constitutional Law',
    code: 'IT Act · Section 66A / Article 19(1)(a)',
    definition: {
      en: 'When a law is so broadly or vaguely worded that innocent citizens self-censor their legitimate speech and opinions out of fear of arrest and prosecution.',
      hi: 'जब कोई कानून इतना अस्पष्ट हो कि आम नागरिक गिरफ्तारी के डर से अपनी वैध राय और विचार व्यक्त करने से डरने लगें।',
    },
    plainExplanation: {
      en: "If criticizing a public figure online can get you arrested because someone called it 'offensive', nobody will dare speak up. Such vague laws violate free speech.",
      hi: 'अगर किसी पोस्ट को केवल "आपत्तिजनक" कहकर पुलिस किसी को गिरफ्तार कर सकती है, तो कोई भी बोलने की हिम्मत नहीं करेगा। ऐसी धाराएं असंवैधानिक हैं।',
    },
    relatedCaseSlugs: ['shreya-singhal'],
  },
  {
    id: 'deficiency-in-service',
    term: {
      en: 'Deficiency in Service',
      hi: 'सेवा में कमी',
    },
    pronunciation: 'dih-FISH-un-see in SUR-vis',
    category: 'Consumer Law',
    code: 'Consumer Protection Act · Section 2(11)',
    definition: {
      en: 'Any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance required to be maintained by or under any law for the time being in force.',
      hi: 'कानून के तहत या अनुबंध के अनुसार प्रदान की जाने वाली सेवा की गुणवत्ता, प्रकृति या कार्यप्रणाली में कोई भी कमी या अपूर्णता।',
    },
    plainExplanation: {
      en: "When a professional or company charges for a service but fails to deliver what was promised or cuts corners unreasonably.",
      hi: 'जब कोई पेशेवर या कंपनी सेवा के लिए पैसे लेती है लेकिन वादे के मुताबिक काम नहीं करती।',
    },
    relatedCaseSlugs: ['haircut-case'],
  },
  {
    id: 'ratio-decidendi',
    term: {
      en: 'Ratio Decidendi',
      hi: 'निर्णय का कानूनी आधार (विधिक सार)',
    },
    pronunciation: 'RAY-shee-oh des-ih-DEN-dye',
    category: 'Evidence & Procedure',
    code: 'Article 141 · Law declared by Supreme Court',
    definition: {
      en: 'The legal rule, rationale, and reasoning upon which the final decision of a court is based. It creates binding precedent for lower courts.',
      hi: 'वह कानूनी तर्क और सिद्धांत जिस पर अदालत का अंतिम फैसला आधारित होता है। यह निचली अदालतों के लिए बाध्यकारी कानून बन जाता है।',
    },
    plainExplanation: {
      en: 'Not just who won the case, but the core legal rule established by the judges that will apply to all future cases across India.',
      hi: 'सिर्फ यह नहीं कि कौन जीता, बल्कि वह नियम जो भविष्य के सभी समान मामलों पर लागू होगा।',
    },
    relatedCaseSlugs: ['ghost-case', 'nanavati-case', 'kesavananda-bharati', 'haircut-case'],
  },
];
