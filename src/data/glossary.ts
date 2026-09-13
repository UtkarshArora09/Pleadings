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
      en: 'Mistake of Fact (Section 79 IPC)',
      hi: 'तथ्य की भूल (आईपीसी धारा 79)',
    },
    pronunciation: 'ig-nor-AN-she-uh FAK-ty ex-KEW-zat',
    category: 'Criminal Law',
    code: 'IPC · Section 79 / BNS · Section 17',
    definition: {
      en: 'A legal defence under Section 79 IPC where an act is done in good faith by a person who, by reason of a mistake of fact and not a mistake of law, genuinely believes themselves to be justified by law in doing it.',
      hi: 'धारा 79 आईपीसी के तहत कानूनी बचाव जहां सद्भाव में कोई कार्य उस व्यक्ति द्वारा किया जाता है, जो कानून की भूल नहीं बल्कि तथ्य की भूल के कारण ईमानदारी से मानता है कि वह ऐसा करने के लिए कानूनन उचित है।',
    },
    plainExplanation: {
      en: "If you honestly believe you're attacking a supernatural spirit in pitch darkness (when it was actually a person), the law protects you because your intention was not to harm a human.",
      hi: 'यदि आप सचमुच यह मानते हैं कि आप अंधेरे में किसी अलौकिक भूत पर वार कर रहे हैं (जो वास्तव में इंसान निकला), तो कानून आपको बचाता है क्योंकि आपका इरादा इंसान को नुकसान पहुँचाने का नहीं था।',
    },
    relatedCaseSlugs: ['ghost-case'],
  },
  {
    id: 'bona-fide',
    term: {
      en: 'Bona Fide (Good Faith)',
      hi: 'सद्भावपूर्वक (सच्चा विश्वास)',
    },
    pronunciation: 'BOH-nuh FY-dee',
    category: 'Evidence & Procedure',
    code: 'Section 52 IPC · Due Care and Attention',
    definition: {
      en: 'Acting with honest intention, sincerity, and without any intention to deceive or commit an intentional crime.',
      hi: 'सच्चे इरादे, ईमानदारी और उचित सतर्कता के साथ किया गया कार्य जिसमें किसी को धोखा देने या अपराध करने की मंशा न हो।',
    },
    plainExplanation: {
      en: 'Doing something with completely pure and honest intentions, having exercised due care under the circumstances.',
      hi: 'परिस्थितियों के अनुसार पूरी ईमानदारी और सद्भाव से किया गया कार्य।',
    },
    relatedCaseSlugs: ['ghost-case'],
  },
  {
    id: 'acquittal',
    term: {
      en: 'Acquittal (Discharge of Guilt)',
      hi: 'दोषमुक्ति (बरी किया जाना)',
    },
    pronunciation: 'uh-KWIT-ul',
    category: 'Evidence & Procedure',
    code: 'Section 232 / 235 CrPC · Criminal Procedure',
    definition: {
      en: 'A formal judicial declaration that the accused person is not guilty of the criminal charges brought against them, setting them completely free.',
      hi: 'अदालत का औपचारिक फैसला जिसमें अभियुक्त को सभी आपराधिक आरोपों से निर्दोष पाकर बाइज्जत बरी कर दिया जाता है।',
    },
    plainExplanation: {
      en: 'When the court finds that the prosecution failed to prove the crime beyond reasonable doubt or the accused proved a valid legal defence, they are acquitted.',
      hi: 'जब अदालत पाती है कि अपराध साबित नहीं हुआ या कानूनी बचाव सिद्ध हो गया, तो व्यक्ति को बरी कर दिया जाता है।',
    },
    relatedCaseSlugs: ['ghost-case', 'nanavati-case'],
  },
  {
    id: 'grave-sudden-provocation',
    term: {
      en: 'Grave and Sudden Provocation (Section 300 IPC)',
      hi: 'गंभीर और अचानक प्रकोपन (धारा 300 आईपीसी)',
    },
    pronunciation: 'grayv and SUD-den prah-vuh-KAY-shun',
    category: 'Criminal Law',
    code: 'IPC · Section 300 (Exception 1) / BNS · Section 101',
    definition: {
      en: 'An exception to Section 300 IPC that reduces murder (Sec 302) to culpable homicide not amounting to murder (Sec 304) if the offender was deprived of the power of self-control by grave and sudden provocation.',
      hi: 'धारा 300 आईपीसी का एक अपवाद जो हत्या को गैर-इरादतन मानव वध में बदल देता है यदि अपराधी गंभीर और अचानक उत्तेजना के कारण आत्म-नियंत्रण खो बैठा हो।',
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
      en: 'Basic Structure Doctrine (Article 368)',
      hi: 'संविधान के बुनियादी ढांचे का सिद्धांत (अनुच्छेद 368)',
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
      en: 'Chilling Effect & Vagueness Doctrine (Section 66A)',
      hi: 'वाक् स्वतंत्रता पर प्रतिकूल प्रभाव (धारा 66A)',
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
    id: 'section-125-crpc',
    term: {
      en: 'Section 125 CrPC (Maintenance Rights)',
      hi: 'धारा 125 सीआरपीसी (भरण-पोषण का अधिकार)',
    },
    pronunciation: 'SEK-shun 125 CR-P-C',
    category: 'Criminal Law',
    code: 'Code of Criminal Procedure · Section 125',
    definition: {
      en: 'A statutory social-welfare law enabling wives, children, and elderly parents unable to maintain themselves to claim a monthly financial allowance from a person with sufficient means.',
      hi: 'एक सामाजिक कल्याणकारी कानून जो बेसहारा पत्नियों, बच्चों और बुजुर्ग माता-पिता को जीवनयापन के लिए मासिक गुजारा भत्ता पाने का अधिकार देता है।',
    },
    plainExplanation: {
      en: 'A secular law ensuring that no person with financial ability can abandon their dependent family members into starvation or destitution, regardless of religion.',
      hi: 'एक धर्मनिरपेक्ष कानून जो सुनिश्चित करता है कि कोई भी सक्षम व्यक्ति अपने परिवार को भुखमरी या बेसहारा हालत में नहीं छोड़ सकता।',
    },
    relatedCaseSlugs: ['shah-bano'],
  },
  {
    id: 'vishaka-guidelines',
    term: {
      en: 'Vishaka Guidelines (Workplace Safety & POSH Act)',
      hi: 'विशाखा दिशानिर्देश (कार्यस्थल सुरक्षा व पॉश एक्ट)',
    },
    pronunciation: 'vih-SHAH-kuh GUIDE-lyns',
    category: 'Constitutional Law',
    code: 'Articles 14, 19, 21 & 141 · POSH Act 2013',
    definition: {
      en: 'Mandatory judicial regulations formulated by the Supreme Court of India in 1997 to prevent sexual harassment of women at workplaces, making Internal Complaints Committees (ICC) compulsory.',
      hi: '1997 में सुप्रीम कोर्ट द्वारा जारी बाध्यकारी नियम जो कार्यस्थल पर महिलाओं के यौन उत्पीड़न की रोकथाम और आंतरिक शिकायत समिति (ICC) का गठन अनिवार्य बनाते हैं।',
    },
    plainExplanation: {
      en: 'Every workplace with 10 or more employees must provide a safe environment free from harassment, with a dedicated complaints committee headed by a woman.',
      hi: '10 या अधिक कर्मचारियों वाले हर संस्थान को एक सुरक्षित वातावरण और महिला की अध्यक्षता में शिकायत निवारण समिति प्रदान करनी होगी।',
    },
    relatedCaseSlugs: ['vishaka-case'],
  },
  {
    id: 'due-process-of-law',
    term: {
      en: 'Due Process of Law (Article 21)',
      hi: 'विधि की सम्यक प्रक्रिया (अनुच्छेद 21)',
    },
    pronunciation: 'DOO PRAH-sess of LAW',
    category: 'Constitutional Law',
    code: 'Article 21 · Maneka Gandhi Rule',
    definition: {
      en: 'The constitutional doctrine that any law or executive procedure depriving a citizen of life or personal liberty must not merely exist on paper, but must be just, fair, and reasonable, adhering to natural justice.',
      hi: 'संवैधानिक सिद्धांत कि नागरिक की स्वतंत्रता छीनने वाला कानून केवल कागजों पर नहीं, बल्कि वास्तव में उचित, निष्पक्ष और न्यायसंगत होना चाहिए।',
    },
    plainExplanation: {
      en: "The government cannot just invent arbitrary rules to seize your passport or lock you up. The procedure itself must be inherently fair and give you a chance to defend yourself.",
      hi: 'सरकार मनमाने नियम बनाकर आपका पासपोर्ट जब्त या आपकी आजादी नहीं छीन सकती। प्रक्रिया का न्यायसंगत और निष्पक्ष होना अनिवार्य है।',
    },
    relatedCaseSlugs: ['maneka-gandhi'],
  },
  {
    id: 'golden-triangle',
    term: {
      en: 'The Golden Triangle (Articles 14, 19 & 21)',
      hi: 'स्वर्ण त्रिकोण (अनुच्छेद 14, 19 और 21)',
    },
    pronunciation: 'GOHL-den TRY-ang-gul',
    category: 'Constitutional Law',
    code: 'Articles 14, 19, 21 · Constitutional Triad',
    definition: {
      en: 'The jurisprudential doctrine that Equality (Art 14), Fundamental Freedoms (Art 19), and Right to Life & Liberty (Art 21) form an inseparable triad. A restriction on one must satisfy all three.',
      hi: 'समानता (अनुच्छेद 14), स्वतंत्रता (अनुच्छेद 19) और जीवन के अधिकार (अनुच्छेद 21) का अटूट त्रिकोण। किसी कानून को वैध होने के लिए तीनों की कसौटी पर खरा उतरना होगा।',
    },
    plainExplanation: {
      en: 'These three articles are the beating heart of the Indian Constitution, protecting citizens from arbitrary state power and tyranny.',
      hi: 'ये तीन अनुच्छेद संविधान की आत्मा हैं जो नागरिकों को सरकारी मनमानी और तानाशाही से बचाते हैं।',
    },
    relatedCaseSlugs: ['maneka-gandhi', 'navtej-johar'],
  },
  {
    id: 'constitutional-morality',
    term: {
      en: 'Constitutional Morality vs. Popular Morality',
      hi: 'संवैधानिक नैतिकता बनाम सामाजिक पूर्वाग्रह',
    },
    pronunciation: 'kon-stih-TOO-shun-ul mor-AL-ih-tee',
    category: 'Constitutional Law',
    code: 'Articles 14, 15, 21 · Navtej Johar Doctrine',
    definition: {
      en: 'The principle that courts must uphold constitutional values of equality, liberty, and human dignity, even when popular majoritarian opinion or orthodox social prejudices oppose them.',
      hi: 'यह सिद्धांत कि अदालतों को सामाजिक पूर्वाग्रहों या बहुसंख्यक राय के बजाय संविधान के समानता और स्वतंत्रता के मूल्यों को सर्वोपरि रखना चाहिए।',
    },
    plainExplanation: {
      en: "Just because a majority of people disapprove of a minority community's identity does not make it illegal. The Constitution protects everyone equally.",
      hi: 'सिर्फ इसलिए कि समाज का एक बड़ा वर्ग किसी अल्पसंख्यक वर्ग को नापसंद करता है, उनके मूल अधिकार नहीं छीने जा सकते। संविधान सबके लिए समान है।',
    },
    relatedCaseSlugs: ['navtej-johar'],
  },
  {
    id: 'section-377-ipc',
    term: {
      en: 'Section 377 IPC (Decriminalization of Consensual Acts)',
      hi: 'धारा 377 आईपीसी (गैर-अपराधीकरण)',
    },
    pronunciation: 'SEK-shun 377 IPC',
    category: 'Constitutional Law',
    code: 'Section 377 IPC · Navtej Johar (2018)',
    definition: {
      en: 'An 1860 colonial penal provision that penalized unnatural offences. In 2018, the Supreme Court struck down Section 377 to the extent it criminalized consensual adult private intimacy.',
      hi: '1860 का औपनिवेशिक कानून। 2018 में सुप्रीम कोर्ट ने सर्वसम्मति से इसे वयस्कों के आपसी सहमति वाले संबंधों के लिए असंवैधानिक घोषित कर दिया।',
    },
    plainExplanation: {
      en: 'Adults have the constitutional right to privacy and intimate association without state intrusion or fear of arrest.',
      hi: 'वयस्कों को सरकारी दखलंदाजी या गिरफ्तारी के डर के बिना निजता और सम्मान का मौलिक अधिकार है।',
    },
    relatedCaseSlugs: ['navtej-johar'],
  },
  {
    id: 'ratio-decidendi',
    term: {
      en: 'Ratio Decidendi (Binding Legal Principle)',
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
  {
    id: 'mens-rea',
    term: {
      en: 'Mens Rea (Guilty Mind)',
      hi: 'मेन्स रिया (आपराधिक मनःस्थिति / दुराशय)',
    },
    pronunciation: 'MENZ RAY-uh',
    category: 'Criminal Law',
    code: 'Fundamental Principle of Criminal Law',
    definition: {
      en: 'The intention or knowledge of wrongdoing that constitutes part of a crime, as opposed to the action or conduct of the accused (Actus Reus).',
      hi: 'अपराध करने का इरादा या ज्ञान। आपराधिक कानून में किसी को दोषी ठहराने के लिए काम के साथ-साथ गलत इरादे का होना भी अनिवार्य है।',
    },
    plainExplanation: {
      en: "An act alone doesn't make someone guilty unless their mind was also guilty (Actus non facit reum nisi mens sit rea).",
      hi: 'केवल कोई कार्य किसी को अपराधी नहीं बनाता जब तक कि उसका मन भी आपराधिक न हो।',
    },
    relatedCaseSlugs: ['ghost-case', 'nanavati-case'],
  },
  {
    id: 'public-interest-litigation',
    term: {
      en: 'Public Interest Litigation (PIL)',
      hi: 'जनहित याचिका (पीआईएल)',
    },
    pronunciation: 'P-I-L / Lih-tih-GAY-shun',
    category: 'Evidence & Procedure',
    code: 'Articles 32 & 226 · Locus Standi Relaxation',
    definition: {
      en: 'Litigation undertaken to secure public interest and demonstrate the availability of justice to socially-disadvantaged parties who cannot approach the court themselves.',
      hi: 'जनता के हित में या कमजोर वर्गों के अधिकारों की रक्षा के लिए किसी भी जागरूक नागरिक या संगठन द्वारा अदालत में दायर की गई याचिका।',
    },
    plainExplanation: {
      en: 'You can file a court petition on behalf of the public or vulnerable victims even if your own personal rights were not directly affected.',
      hi: 'आप जनता या पीड़ितों के पक्ष में अदालत जा सकते हैं, भले ही आपका व्यक्तिगत नुकसान न हुआ हो।',
    },
    relatedCaseSlugs: ['m-c-mehta', 'vishaka-case'],
  },
];
