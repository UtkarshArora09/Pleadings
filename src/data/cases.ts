import { CaseData } from '@/types';

export const CASES_DATA: CaseData[] = [
  {
    slug: 'ghost-case',
    title: {
      en: 'The Ghost Case',
      hi: 'भूत वाला मामला',
    },
    tag: {
      en: 'IPC 79 · Mistake of Fact',
      hi: 'आईपीसी 79 · तथ्य की भूल',
    },
    categoryTag: 'IPC 79',
    genre: 'crime',
    theme: 'crime-noir',
    court: 'Orissa High Court',
    year: 1959,
    readTime: {
      en: '4 min read',
      hi: '4 मिनट',
    },
    matchRate: 98,
    maturityRating: 'U/A 16+',
    rank: 1,
    bannerImage: '/images/cases/ghost-case.jpg',
    blurb: {
      en: 'A midnight killing in an abandoned aerodrome. Can an honest belief in ghosts save a man from the gallows?',
      hi: 'एक सुनसान हवाई अड्डे पर आधी रात को हुई हत्या। क्या भूतों पर सच्चा विश्वास किसी को फांसी के फंदे से बचा सकता है?',
    },
    citation: 'State of Orissa v. Ram Bahadur Thapa, AIR 1960 Ori 161, 1960 CriLJ 1349',
    judgmentUrl: 'https://indiankanoon.org/doc/1489567/',
    watermark: '§79',
    featuredHeroHook: {
      en: 'He killed a ghost. The High Court believed him.',
      hi: 'उसने एक भूत को मार डाला। हाई कोर्ट ने उसकी बात मानी।',
    },
    featuredHeroDesc: {
      en: 'In 1958, a servant attacked what he believed was a spirit in an abandoned World War II aerodrome. When the "ghost" turned out to be a living human, the Orissa High Court had to decide: does an honest mistake of fact protect you from murder?',
      hi: '1958 में, एक नौकर ने द्वितीय विश्व युद्ध के सुनसान हवाई अड्डे पर एक रोशनी पर हमला किया जिसे वह भूत समझ रहा था। जब वह रोशनी महुआ बीनने वाली महिलाएं निकलीं, तो अदालत के सामने बड़ा सवाल था: क्या अलौकिक शक्ति में सच्चा विश्वास हत्या से बचा सकता है?',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · THE PREMISE',
          hi: 'एपिसोड 01 · भूमिका',
        },
        headline: {
          en: 'He killed a ghost. The court believed him.',
          hi: 'उसने एक भूत को मार डाला। अदालत ने उस पर भरोसा किया।',
        },
        body: {
          en: 'Rasgovindpur village, May 1958. An abandoned World War II military airstrip surrounded by dense jungle. Every villager swore it was cursed and crawling with vengeful spirits.',
          hi: 'रसगोविंदपुर गांव, मई 1958। घने जंगलों से घिरा द्वितीय विश्व युद्ध का एक सुनसान सैन्य हवाई अड्डा। गांव का हर व्यक्ति कसम खाता था कि वहां भूत और चुड़ैलों का साया है।',
        },
        photoExhibitSrc: '/images/cases/ghost-case.jpg',
        photoExhibitCaption: {
          en: 'Archival crime scene photo: Rasgovindpur abandoned military runway (May 1958).',
          hi: 'घटनास्थल की पुरालेखीय तस्वीर: रसगोविंदपुर हवाई पट्टी (मई 1958)।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य पात्र',
        },
        headline: {
          en: 'Three men who went into the dark.',
          hi: 'तीन लोग जो उस रात अंधेरे में उतरे।',
        },
        body: {
          en: 'Meet the key figures whose lives collided on that pitch-black midnight in May 1958.',
          hi: 'जानिए उन मुख्य लोगों को जिनकी जिंदगी उस अंधेरी रात में हमेशा के लिए बदल गई।',
        },
        photoExhibitSrc: '/images/cases/ghost_thapa_portrait.jpg',
        photoExhibitCaption: {
          en: 'Orissa Police CID archival suspect photo: Ram Bahadur Thapa holding the khukri (1958).',
          hi: 'उड़ीसा पुलिस सीआईडी पुरालेख: राम बहादुर थापा खुखरी के साथ (1958)।',
        },
        characters: [
          {
            name: { en: 'Ram Bahadur Thapa', hi: 'राम बहादुर थापा' },
            role: { en: 'Accused (Servant)', hi: 'अभियुक्त (नेपाली नौकर)' },
            tag: { en: 'Firm Believer in Spirits', hi: 'भूत-प्रेत में अटूट विश्वास' },
            description: {
              en: 'A 22-year-old Nepali domestic servant armed with a heavy khukri blade.',
              hi: '22 वर्षीय नेपाली घरेलू सहायक जो अपनी खुखरी के साथ गया था।',
            },
            badgeEmoji: '🗡️',
          },
          {
            name: { en: 'Jagat Bandhu Chatterjee', hi: 'जगत बंधु चटर्जी' },
            role: { en: 'Employer & Landlord', hi: 'मालिक और ज़मींदार' },
            tag: { en: 'Scrap Dealer', hi: 'कबाड़ व्यापारी' },
            description: {
              en: 'Came to purchase military scrap from the aerodrome; wanted to test the ghost rumors.',
              hi: 'हवाई अड्डे का कबाड़ खरीदने आया था और भूतों की अफवाहों की सच्चाई देखना चाहता था।',
            },
            badgeEmoji: '👔',
          },
          {
            name: { en: 'Gelhi Majhiani', hi: 'गेल्ही मझियानी' },
            role: { en: 'Victim (Villager)', hi: 'पीड़िता (स्थानीय ग्रामीण)' },
            tag: { en: 'Tribal Flower Collector', hi: 'महुआ बीनने वाली आदिवासी महिला' },
            description: {
              en: 'A local village woman collecting fallen mahua flowers under the cover of night.',
              hi: 'एक स्थानीय महिला जो रात के सन्नाटे में महुआ के फूल एकत्र कर रही थी।',
            },
            badgeEmoji: '🥀',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'INCIDENT',
        eyebrow: {
          en: 'EPISODE 03 · THE MIDNIGHT ENCOUNTER',
          hi: 'एपिसोड 03 · आधी रात की घटना',
        },
        headline: {
          en: 'A flickering lantern in the dead of night.',
          hi: 'सन्नाटे में टिमटिमाती एक लालटेन।',
        },
        body: {
          en: 'At 12:30 AM, Jagat Bandhu and Thapa walked into the runway area. Deep in the darkness, they saw a bobbing, swinging light moving across the overgrown fields. Wind whipped through the trees. Convinced he was confronting a deadly apparition, Thapa charged forward with his khukri shouting battle cries.',
          hi: 'रात 12:30 बजे, जगत बंधु और थापा हवाई पट्टी की ओर बढ़े। घुप अंधेरे में उन्हें एक डगमगाती हुई रोशनी हिलती दिखाई दी। हवाएं तेज थीं। भूत समझकर थापा अपनी खुखरी लेकर "भूत आया!" चिल्लाते हुए दौड़ पड़ा।',
        },
        evidence: {
          archiveType: 'police_record',
          masthead: 'RASGOVINDPUR THANA CASE DIARY',
          date: '21 MAY 1958 · 01:30 HRS',
          headline: {
            en: 'WITNESS STATEMENT: ACCUSED CHARGED SHOUTING "GHOST HAS COME TO KILL US!"',
            hi: 'गवाह बयान: आरोपी चिल्लाते हुए दौड़ा "भूत हमें मारने आया है!"',
          },
          snippet: {
            en: 'Landlord Chatterjee deposed: The night was pitch dark and stormy. The accused Thapa genuinely believed the bobbing light was a blood-drinking phantom and struck blindly with his khukri to protect us.',
            hi: 'जमींदार चटर्जी का बयान: रात घुप अंधेरी और तूफानी थी। अभियुक्त थापा को पक्का विश्वास था कि वह रोशनी कोई खून पीने वाली चुड़ैल है और उसने हमारी जान बचाने के लिए अंधाधुंध वार किया।',
          },
          highlightedPhrase: {
            en: 'genuinely believed the bobbing light was a blood-drinking phantom',
            hi: 'पक्का विश्वास था कि वह रोशनी कोई खून पीने वाली चुड़ैल है',
          },
          exhibitNumber: 'POLICE DIARY #14/1958',
          caption: {
            en: 'Official Station House Officer entry recorded at Rasgovindpur Police Post.',
            hi: 'रसगोविंदपुर पुलिस चौकी में दर्ज गवाह का मूल बयान।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 04 · THE CRIME SCENE EVIDENCE',
          hi: 'एपिसोड 04 · फॉरेंसिक साक्ष्य',
        },
        headline: {
          en: 'The lantern that cost a life.',
          hi: 'वह लालटेन जिसने एक जान ले ली।',
        },
        body: {
          en: 'The light was not a phantom. It was an ordinary hurricane lantern carried by three tribal women quietly gathering mahua flowers.',
          hi: 'वह रोशनी कोई भूत नहीं थी। वह महुआ के फूल चुन रही तीन महिलाओं की साधारण लालटेन थी।',
        },
        evidence: {
          archiveType: 'newspaper',
          masthead: 'THE STATESMAN · CALCUTTA',
          date: '24 MAY 1958',
          headline: {
            en: 'TRAGIC BLUNDER AT ABANDONED AIRSTRIP: WOMAN KILLED AS SERVANT MISTAKES LANTERN FOR SPIRIT',
            hi: 'सुनसान हवाई पट्टी पर दुखद भूल: नौकर ने लालटेन को भूत समझकर किया वार, महिला की मौत',
          },
          snippet: {
            en: 'The accused inflicted multiple wounds before realizing human screams. Gelhi Majhiani died on the spot, while Ganga and Sukhi sustained grievous injuries.',
            hi: 'आरोपी ने कई वार किए जिसके बाद मानवीय चीखें सुनाई दीं। गेल्ही मझियानी की मौके पर ही मौत हो गई, जबकि दो अन्य महिलाएं गंभीर रूप से घायल हो गईं।',
          },
          highlightedPhrase: {
            en: 'The accused inflicted multiple wounds before realizing human screams.',
            hi: 'आरोपी ने कई वार किए जिसके बाद मानवीय चीखें सुनाई दीं।',
          },
          exhibitNumber: 'EXHIBIT A-1 · PRESS DISPATCH',
          caption: {
            en: 'Archival report: Mayurbhanj district police recovery memo and news cutting.',
            hi: 'पुरालेख रिपोर्ट: मयूरभंज जिला पुलिस जब्ती सूची और अखबार की कटिंग।',
          },
        },
      },
      {
        id: 'panel-5',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 05 · COURTROOM SHOWDOWN',
          hi: 'एपिसोड 05 · अदालत में बहस',
        },
        headline: {
          en: 'Murder (IPC 302) vs. Honest Mistake of Fact (IPC 79).',
          hi: 'हत्या का आरोप (302) बनाम तथ्य की भूल (79)।',
        },
        body: {
          en: 'The State charged Thapa with murder. Thapa raised the ancient common law shield: Mistake of Fact under Section 79.',
          hi: 'राज्य ने थापा पर हत्या का मुकदमा चलाया। थापा ने धारा 79 (तथ्य की भूल) का बचाव लिया।',
        },
        evidence: {
          archiveType: 'court_decree',
          masthead: 'MAYURBHANJ SESSIONS COURT DOCKET',
          date: 'NOVEMBER 1958',
          headline: {
            en: 'STATE APPEAL: CAN IRRATIONAL SUPERSTITION QUALIFY AS GOOD FAITH?',
            hi: 'राज्य की अपील: क्या अंधविश्वास कानून में "सद्भाव" माना जा सकता है?',
          },
          snippet: {
            en: 'Public Prosecutor submitted: Good faith under Section 52 IPC requires due care and attention. Hacking with a deadly weapon in the dark without verbal challenge constitutes reckless disregard for human life.',
            hi: 'सरकारी वकील की दलील: धारा 52 के तहत सद्भाव के लिए उचित सावधानी आवश्यक है। अंधेरे में बिना पूछे जानलेवा हथियार चलाना मानव जीवन के प्रति घोर लापरवाही है।',
          },
          highlightedPhrase: {
            en: 'Good faith under Section 52 IPC requires due care and attention',
            hi: 'धारा 52 के तहत सद्भाव के लिए उचित सावधानी आवश्यक है',
          },
          exhibitNumber: 'EXHIBIT C-2 · SESSIONS RECORD',
          caption: {
            en: 'Sessions Court trial record appealed by State of Orissa to High Court.',
            hi: 'सत्र न्यायालय के फैसले के खिलाफ उड़ीसा उच्च न्यायालय में अपील का रिकॉर्ड।',
          },
        },
        prosecutionArgs: {
          party: { en: 'State of Orissa (Prosecution)', hi: 'राज्य अभियोजन पक्ष' },
          claim: {
            en: 'Gross recklessness! You cannot swing a deadly weapon in the dark without verifying if a human is present.',
            hi: 'घोर लापरवाही! अंधेरे में बिना जांचे किसी पर घातक हथियार से हमला नहीं किया जा सकता।',
          },
          statute: 'IPC § 302 · Murder / Section 326 · Grievous Hurt',
          keyPoint: {
            en: 'Belief in ghosts is an irrational superstition and cannot constitute "good faith" or "due care and attention" under Section 52.',
            hi: 'भूतों पर विश्वास एक अंधविश्वास है और इसे कानून के तहत "सद्भाव" या "उचित सावधानी" नहीं माना जा सकता।',
          },
        },
        defenceArgs: {
          party: { en: 'Ram Bahadur Thapa (Defence)', hi: 'अभियुक्त का बचाव पक्ष' },
          claim: {
            en: 'Complete absence of Mens Rea (criminal intent). Thapa genuinely believed he was defending his master from a ghost.',
            hi: 'आपराधिक इरादे (Mens Rea) का पूर्ण अभाव। थापा का सचमुच मानना था कि वह अलौकिक राक्षस से अपने मालिक की रक्षा कर रहा था।',
          },
          statute: 'IPC § 79 · Ignorantia Facti Excusat',
          keyPoint: {
            en: 'Section 79 protects acts done under an honest mistake of fact. Thapa thought he was attacking a spirit, not a human being.',
            hi: 'धारा 79 तथ्य की भूल के तहत किए गए कृत्य की रक्षा करती है। थापा इंसान को नहीं, भूत को मारने के विश्वास में था।',
          },
        },
        tappableTerms: [
          {
            id: 'mistake-of-fact',
            term: { en: 'Mistake of Fact', hi: 'तथ्य की भूल' },
            code: 'IPC Section 79',
            definition: {
              en: 'Nothing is an offence which is done by any person who by reason of a mistake of fact, and not by reason of a mistake of law, in good faith believes himself to be justified by law in doing it.',
              hi: 'कोई बात अपराध नहीं है जो किसी ऐसे व्यक्ति द्वारा की जाए जो तथ्य की भूल के कारण सद्भावपूर्वक विश्वास करता हो कि वह ऐसा करने के लिए कानूनन उचित है।',
            },
          },
        ],
      },
      {
        id: 'panel-6',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 06 · YOU ARE THE JUDGE',
          hi: 'एपिसोड 06 · आप हैं जज',
        },
        headline: {
          en: 'How would you decide this case?',
          hi: 'यदि आप जज होते, तो क्या फैसला सुनाते?',
        },
        body: {
          en: 'A woman is dead, but the killer had no grievance against her and genuinely thought she was an evil spirit. Does the law convict him or acquit him?',
          hi: 'एक महिला की मृत्यु हो गई है, लेकिन हत्यारे की उससे कोई दुश्मनी नहीं थी और वह उसे भूत मान रहा था। क्या कानून उसे सजा देगा या बरी करेगा?',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'ORISSA HIGH COURT BENCH FILE',
          date: 'CUTTACK · 1959',
          headline: {
            en: 'JUDICIAL CONUNDRUM: SUBJECTIVE BELIEF VS OBJECTIVE LEGAL REASON',
            hi: 'न्यायिक दुविधा: व्यक्तिपरक विश्वास बनाम वस्तुनिष्ठ कानूनी तर्क',
          },
          snippet: {
            en: 'The Bench must determine: Should the standard of "due care" be measured against an educated city scholar, or against a terrified 22-year-old servant in a haunted forest at midnight?',
            hi: 'पीठ को तय करना है: क्या "उचित सावधानी" का पैमाना किसी शिक्षित नागरिक के अनुसार तय होगा, या आधी रात को डरे हुए 22 वर्षीय नौकर की मानसिक स्थिति से?',
          },
          highlightedPhrase: {
            en: 'Should the standard of "due care" be measured against a terrified servant in a haunted forest at midnight',
            hi: 'क्या "उचित सावधानी" का पैमाना आधी रात को डरे हुए नौकर की मानसिक स्थिति से तय होगा',
          },
          exhibitNumber: 'DELIBERATION DOSSIER · §79',
          caption: {
            en: 'Chief Justice Narasimham judicial question balance sheet.',
            hi: 'मुख्य न्यायाधीश नरसिम्हम की न्यायिक विचारणीय प्रश्नावली।',
          },
        },
        judgeDecision: {
          question: {
            en: 'Should Ram Bahadur Thapa be convicted of Murder or Acquitted under Section 79?',
            hi: 'क्या राम बहादुर थापा को हत्या का दोषी ठहराया जाए या धारा 79 के तहत बरी किया जाए?',
          },
          subtext: {
            en: 'Consider whether an honest subjective belief in ghosts can constitute "good faith" in the eyes of criminal law.',
            hi: 'विचार करें कि क्या भूतों में सच्चा विश्वास कानून की नजर में "सद्भाव" माना जा सकता है।',
          },
          options: [
            {
              id: 'convict',
              title: {
                en: 'Convict of Culpable Homicide',
                hi: 'गैर-इरादतन हत्या का दोषी ठहराएं',
              },
              reason: {
                en: 'Superstition is no excuse. Striking in the dark without verifying human presence is gross recklessness.',
                hi: 'अंधविश्वास कोई बहाना नहीं है। अंधेरे में बिना जांचे हमला करना घोर लापरवाही है।',
              },
              simulatedVotesPercent: 38,
              isActualVerdict: false,
            },
            {
              id: 'acquit',
              title: {
                en: 'Acquit under Section 79 IPC',
                hi: 'धारा 79 के तहत पूरी तरह बरी करें',
              },
              reason: {
                en: 'No Mens Rea. Thapa acted under a bona fide mistake of fact, believing he was attacking a spirit to defend his master.',
                hi: 'कोई आपराधिक इरादा नहीं था। थापा ने तथ्य की भूल में अपने मालिक की रक्षा के लिए हमला किया था।',
              },
              simulatedVotesPercent: 62,
              isActualVerdict: true,
            },
          ],
          judicialRationale: {
            en: 'The Orissa High Court held that "due care and attention" must be judged in the context of the terrified state of mind and the surroundings. Section 79 completely shielded Thapa.',
            hi: 'उड़ीसा उच्च न्यायालय ने फैसला सुनाया कि "उचित सावधानी" का मूल्यांकन उस समय के भयभीत वातावरण और मानसिक स्थिति के आधार पर होना चाहिए। धारा 79 ने थापा को पूर्ण संरक्षण दिया।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · THE COURT RULING',
          hi: 'एपिसोड 07 · अदालत का फैसला',
        },
        headline: {
          en: 'The Verdict: Complete Acquittal.',
          hi: 'फैसला: पूरी तरह से बाइज्जत बरी।',
        },
        stamp: {
          en: 'ACQUITTED · SECTION 79 IPC',
          hi: 'बरी · आईपीसी धारा 79',
        },
        body: {
          en: 'Chief Justice R.L. Narasimham and Justice S.P. Mohapatra of the Orissa High Court upheld the Sessions Court acquittal.\n\nThe court held that Thapa had no motive or animosity against the victims. He acted in absolute bona fide belief that he was attacking a ghost. The protection of Section 79 applied in full.',
          hi: 'उड़ीसा उच्च न्यायालय के मुख्य न्यायाधीश आर.एल. नरसिम्हम और न्यायमूर्ति एस.पी. महापात्रा ने सत्र अदालत के बरी करने के फैसले को बरकरार रखा।\n\nअदालत ने माना कि थापा की पीड़िता से कोई दुश्मनी नहीं थी। उसने पूरी तरह से सच्चे विश्वास में काम किया कि वह भूत पर हमला कर रहा था। धारा 79 का संरक्षण पूरी तरह से लागू हुआ।',
        },
        photoExhibitSrc: '/images/cases/ghost_court_verdict.jpg',
        photoExhibitCaption: {
          en: 'Orissa High Court Bench delivering the landmark verdict (AIR 1960 Ori 161).',
          hi: 'उड़ीसा उच्च न्यायालय की खंडपीठ ऐतिहासिक फैसला सुनाते हुए (1960)।',
        },
      },
      {
        id: 'panel-8',
        type: 'RATIO',
        eyebrow: {
          en: 'EPISODE 08 · LEGAL RATIO & IMPACT',
          hi: 'एपिसोड 08 · कानूनी सिद्धांत और प्रभाव',
        },
        headline: {
          en: 'Ignorantia Facti Excusat: Mistake of Fact Excuses.',
          hi: 'तथ्य की भूल माफी योग्य है।',
        },
        body: {
          en: 'This case remains India’s leading precedent on Section 79 IPC and the latin maxim *Ignorantia facti excusat, ignorantia juris non excusat* (Mistake of fact excuses, mistake of law does not).\n\nIt established that "due care and attention" is not an absolute mechanical standard, but depends on the intellectual capacity, terror, and physical circumstances of the accused.',
          hi: 'यह मामला आज भी भारतीय दंड संहिता की धारा 79 और लैटिन कहावत *Ignorantia facti excusat* (तथ्य की भूल क्षम्य है, कानून की नहीं) पर भारत का सबसे बड़ा नजीर है।\n\nइसने स्थापित किया कि "उचित सावधानी" कोई कठोर पैमाना नहीं है, बल्कि अभियुक्त की मानसिक स्थिति, भय और परिस्थितियों पर निर्भर करता है।',
        },
        evidence: {
          archiveType: 'verdict_decree',
          masthead: 'ALL INDIA REPORTER · AIR 1960 ORI 161',
          date: '1960 JUDICIAL RECORD',
          headline: {
            en: 'LANDMARK RATIO: MISTAKE OF FACT PREVENTS FORMATION OF MENS REA',
            hi: 'ऐतिहासिक सिद्धांत: तथ्य की भूल आपराधिक इरादे (Mens Rea) को समाप्त करती है',
          },
          snippet: {
            en: 'HELD: An act done under a bona fide mistake of fact is not an offence. The mental state must be evaluated from the standpoint of the accused in that terrifying midnight environment.',
            hi: 'फैसला: तथ्य की वास्तविक भूल के तहत किया गया कृत्य अपराध नहीं है। अभियुक्त की मानसिक स्थिति का मूल्यांकन उस भयावह वातावरण के दृष्टिकोण से होना चाहिए।',
          },
          highlightedPhrase: {
            en: 'An act done under a bona fide mistake of fact is not an offence',
            hi: 'तथ्य की वास्तविक भूल के तहत किया गया कृत्य अपराध नहीं है',
          },
          exhibitNumber: 'PRECEDENT · AIR 1960 ORI 161',
          caption: {
            en: 'Certified law report entry: State of Orissa v. Ram Bahadur Thapa.',
            hi: 'प्रमाणित लॉ रिपोर्ट प्रविष्टि: स्टेट ऑफ उड़ीसा बनाम राम बहादुर थापा।',
          },
        },
        citationFooter: 'AIR 1960 Ori 161 · Orissa High Court',
        judgmentUrl: 'https://indiankanoon.org/doc/1489567/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Orissa High Court · 1959',
        hi: 'उड़ीसा उच्च न्यायालय · 1959',
      },
      facts: {
        en: 'Ram Bahadur Thapa, a servant, accompanied his master Jagat Bandhu Chatterjee to an abandoned WWII aerodrome in Rasgovindpur, reputed to be haunted. At midnight, seeing a flickering light, Thapa believed it to be a ghost and attacked it with a khukri, killing Gelhi Majhiani and injuring two other women who were gathering mahua flowers.',
        hi: 'राम बहादुर थापा अपने मालिक के साथ रसगोविंदपुर की एक सुनसान हवाई पट्टी पर गया, जिसके बारे में भूतों की अफवाह थी। आधी रात को एक टिमटिमाती रोशनी देखकर थापा ने उसे भूत समझा और खुखरी से हमला कर दिया। इसमें महुआ बीन रही गेल्ही मझियानी की मौत हो गई और दो अन्य महिलाएं घायल हो गईं।',
      },
      issues: {
        en: [
          'Whether the accused is entitled to the benefit of Section 79 of the Indian Penal Code (mistake of fact)?',
          'Whether belief in ghosts and spirits can be considered an act done in "good faith" with due care and attention under Section 52 IPC?',
        ],
        hi: [
          'क्या अभियुक्त भारतीय दंड संहिता की धारा 79 (तथ्य की भूल) का लाभ पाने का हकदार है?',
          'क्या भूतों पर विश्वास को धारा 52 के तहत "उचित सावधानी और ध्यान" से किया गया सद्भावपूर्ण कृत्य माना जा सकता है?',
        ],
      },
      chargesApplied: ['IPC § 302 (Murder)', 'IPC § 326 (Grievous Hurt)', 'IPC § 324 (Hurt with dangerous weapon)'],
      held: {
        en: 'The High Court held that the accused acted under a bona fide mistake of fact believing he was attacking a ghost. The acquittal under Section 79 IPC was upheld.',
        hi: 'उच्च न्यायालय ने माना कि अभियुक्त ने तथ्य की भूल के कारण यह मानते हुए हमला किया कि वह भूत पर वार कर रहा है। धारा 79 के तहत बरी करने का फैसला बरकरार रखा गया।',
      },
      reasoning: {
        en: 'The court observed that the test of "due care and attention" under Section 52 must be judged relative to the terrifying circumstances, darkness, and intellectual capacity of the accused. There was complete absence of mens rea or animosity against the victim.',
        hi: 'अदालत ने कहा कि धारा 52 के तहत "उचित सावधानी" का मूल्यांकन उस समय के डरावने माहौल, अंधेरे और अभियुक्त के बौद्धिक स्तर के संदर्भ में किया जाना चाहिए। पीड़िता के प्रति कोई आपराधिक इरादा या द्वेष नहीं था।',
      },
      whyItMatters: {
        en: 'This case is the foremost Indian authority on Section 79 IPC and the doctrine of Ignorantia Facti Excusat (mistake of fact excuses). It illustrates how the subjective state of mind at the time of the incident can eliminate criminal liability.',
        hi: 'यह मामला आईपीसी धारा 79 और "तथ्य की भूल माफी योग्य है" के सिद्धांत पर भारत की सबसे प्रमुख नजीर है। यह दिखाता है कि घटना के समय की मानसिक स्थिति कैसे आपराधिक दायित्व को समाप्त कर सकती है।',
      },
    },
  },

  {
    slug: 'nanavati-case',
    title: {
      en: 'The Nanavati Case',
      hi: 'नानावटी केस',
    },
    tag: {
      en: 'IPC 300 · Grave & Sudden Provocation',
      hi: 'आईपीसी 300 · गंभीर व अचानक उकसावा',
    },
    categoryTag: 'IPC 300',
    genre: 'crime',
    theme: 'crime-noir',
    court: 'Supreme Court of India',
    year: 1961,
    readTime: {
      en: '5 min read',
      hi: '5 मिनट',
    },
    matchRate: 99,
    maturityRating: 'A 18+',
    rank: 2,
    bannerImage: '/images/cases/nanavati-case.jpg',
    blurb: {
      en: 'Three bullets in a Bombay bedroom. The sensational trial that killed the jury system in India forever.',
      hi: 'बॉम्बे के एक बेडरूम में चली तीन गोलियां। वह सनसनीखेज मुकदमा जिसने भारत में जूरी सिस्टम को हमेशा के लिए खत्म कर दिया।',
    },
    citation: 'K.M. Nanavati v. State of Maharashtra, AIR 1962 SC 605, 1962 SCR Supl. (1) 567',
    judgmentUrl: 'https://indiankanoon.org/doc/1596139/',
    watermark: '§300',
    featuredHeroHook: {
      en: 'Three shots in Colaba. The end of India’s jury system.',
      hi: 'कोलाबा में तीन गोलियां। भारत में जूरी व्यवस्था का अंत।',
    },
    featuredHeroDesc: {
      en: 'Naval Commander K.M. Nanavati shot his wife’s lover in a crime of passion that captivated the nation. The 8-1 jury verdict in his favor was overturned by the High Court, leading to the historic abolition of jury trials in India.',
      hi: 'नौसेना कमांडर के.एम. नानावटी ने अपनी पत्नी के प्रेमी को गोली मार दी। जूरी ने 8-1 से उन्हें निर्दोष माना, लेकिन हाई कोर्ट ने इस फैसले को पलट दिया। इस ऐतिहासिक मामले ने भारत में जूरी ट्रायल को हमेशा के लिए समाप्त कर दिया।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · THE CRIME OF PASSION',
          hi: 'एपिसोड 01 · सनसनीखेज वारदात',
        },
        headline: {
          en: 'Three shots in a Bombay bedroom.',
          hi: 'बॉम्बे के बेडरूम में तीन गोलियां।',
        },
        body: {
          en: '27 April 1959, 4:30 PM. Commander Kawas Manekshaw Nanavati walked into Prem Ahuja’s bedroom at Jeevan Jyot apartments in Colaba, Bombay. Moments later, three shots rang out. Ahuja lay dead in a puddle of blood.',
          hi: '27 अप्रैल 1959, शाम 4:30 बजे। कमांडर कावस मानेकशॉ नानावटी कोलाबा स्थित जीवन ज्योत अपार्टमेंट में प्रेम आहूजा के बेडरूम में दाखिल हुए। कुछ ही पलों में तीन गोलियां चलीं। आहूजा खून से लथपथ फर्श पर गिर पड़ा।',
        },
        photoExhibitSrc: '/images/cases/nanavati-case.jpg',
        photoExhibitCaption: {
          en: 'Archival crime scene photo: Prem Ahuja bedroom, Jeevan Jyot Flat, Colaba (1959).',
          hi: 'घटनास्थल का पुरालेख: प्रेम आहूजा का बेडरूम, जीवन ज्योत अपार्टमेंट, कोलाबा (1959)।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य पात्र',
        },
        headline: {
          en: 'The Commander, the Wife, and the Play-boy.',
          hi: 'कमांडर, पत्नी और प्लेबॉय।',
        },
        body: {
          en: 'The three lives entangled in India’s most sensational love triangle and legal saga.',
          hi: 'वे तीन जिंदगियां जो भारत के सबसे चर्चित प्रेम त्रिकोण और कानूनी ड्रामे में उलझ गईं।',
        },
        photoExhibitSrc: '/images/cases/nanavati_portrait.jpg',
        photoExhibitCaption: {
          en: 'Bombay Police CID archival record: Commander K.M. Nanavati in Indian Navy uniform (1959).',
          hi: 'बॉम्बे पुलिस सीआईडी रिकॉर्ड: नौसेना की वर्दी में कमांडर के.एम. नानावटी (1959)।',
        },
        characters: [
          {
            name: { en: 'Commander K.M. Nanavati', hi: 'कमांडर के.एम. नानावटी' },
            role: { en: 'Accused (Naval Officer)', hi: 'अभियुक्त (नौसेना कमांडर)' },
            tag: { en: 'Second-in-Command, INS Mysore', hi: 'आईएनएस मैसूर के सेकंड-इन-कमांड' },
            description: {
              en: 'A decorated Indian Navy officer of impeccable record and high social standing.',
              hi: 'भारतीय नौसेना के एक सम्मानित और निष्ठावान अधिकारी।',
            },
            badgeEmoji: '⚓',
          },
          {
            name: { en: 'Sylvia Nanavati', hi: 'सिल्विया नानावटी' },
            role: { en: 'Wife', hi: 'पत्नी' },
            tag: { en: 'English-born spouse', hi: 'ब्रिटिश मूल की पत्नी' },
            description: {
              en: 'Confessed her extramarital affair with Prem Ahuja on the afternoon of 27 April 1959.',
              hi: 'जिन्होंने 27 अप्रैल 1959 की दोपहर प्रेम आहूजा के साथ अपने संबंधों की बात कबूल की।',
            },
            badgeEmoji: '💍',
          },
          {
            name: { en: 'Prem Bhagwandas Ahuja', hi: 'प्रेम भगवानदास आहूजा' },
            role: { en: 'Victim', hi: 'मृतक (सिंधी व्यापारी)' },
            tag: { en: 'Wealthy Automobile Dealer', hi: 'कारोबारी और प्लेबॉय' },
            description: {
              en: 'A wealthy bachelor who had promised to marry Sylvia, but refused when confronted.',
              hi: 'एक अमीर व्यापारी जिसने सिल्विया से शादी का वादा किया था, लेकिन बाद में मुकर गया।',
            },
            badgeEmoji: '🍸',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'INCIDENT',
        eyebrow: {
          en: 'EPISODE 03 · THE THREE HOURS',
          hi: 'एपिसोड 03 · वे तीन घंटे',
        },
        headline: {
          en: 'From confession to confrontation: The timeline.',
          hi: 'कबूलनामे से गोलीबारी तक: समयरेखा।',
        },
        body: {
          en: 'At 1:30 PM, Sylvia broke down and confessed her affair to Nanavati.\n\nNanavati drove his wife and children to the Metro Cinema for a 4:00 PM movie. He then drove to his naval ship INS Mysore, requisitioned a .38 service revolver and 6 rounds under a false pretext, and drove straight to Ahuja’s office and then his home.',
          hi: 'दोपहर 1:30 बजे, सिल्विया रो पड़ी और नानावटी के सामने अपने प्रेम संबंध का कबूलनामा किया।\n\nनानावटी अपनी पत्नी और बच्चों को 4:00 बजे का शो देखने मेट्रो सिनेमा छोड़ आए। इसके बाद वे अपने युद्धपोत आईएनएस मैसूर गए, झूठा बहाना बनाकर .38 की सर्विस रिवॉल्वर और 6 गोलियां लीं, और सीधे आहूजा के घर जा पहुंचे।',
        },
        evidence: {
          archiveType: 'police_record',
          masthead: 'INS MYSORE NAVAL ARMOURY LOG',
          date: '27 APRIL 1959 · 15:30 HRS',
          headline: {
            en: 'WEAPONS LOG: REVOLVER ISSUED UNDER PRETENCE OF NIGHT TARGET PRACTICE',
            hi: 'हथियार रजिस्टर: रात्रि अभ्यास के झूठे बहाने रिवॉल्वर जारी की गई',
          },
          snippet: {
            en: 'Armourer Gunner deposed: Commander Nanavati signed out one .38 Webly-Scott revolver and six live cartridges in a sealed brown envelope, stating he was proceeding on night patrol duty to Ahmednagar.',
            hi: 'आर्मरी गनर का बयान: कमांडर नानावटी ने सीलबंद लिफाफे में एक .38 वेब्ली-स्कॉट रिवॉल्वर और छह जिंदा कारतूस पर हस्ताक्षर किए, यह कहते हुए कि वे अहमदनगर रात्रि गश्त पर जा रहे हैं।',
          },
          highlightedPhrase: {
            en: 'signed out one .38 Webly-Scott revolver and six live cartridges',
            hi: 'एक .38 वेब्ली-स्कॉट रिवॉल्वर और छह जिंदा कारतूस पर हस्ताक्षर किए',
          },
          exhibitNumber: 'EXHIBIT P-1 · NAVAL LOG',
          caption: {
            en: 'Prosecution Exhibit 1: Original naval ship weapons issue register.',
            hi: 'अभियोजन पक्ष प्रदर्श 1: नौसेना युद्धपोत हथियार रजिस्टर।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 04 · THE CRIME SCENE EVIDENCE',
          hi: 'एपिसोड 04 · फॉरेंसिक साक्ष्य',
        },
        headline: {
          en: 'The towel that unraveled the defence.',
          hi: 'वह तौलिया जिसने बचाव पक्ष की पोल खोल दी।',
        },
        body: {
          en: 'Nanavati claimed that when he confronted Ahuja, Ahuja said: "Am I to marry every woman I sleep with?" A physical struggle ensued and the gun went off accidentally.',
          hi: 'नानावटी ने दावा किया कि जब उन्होंने आहूजा से पूछा कि क्या वह सिल्विया से शादी करेगा, तो आहूजा ने कहा: "क्या मैं हर उस औरत से शादी करूंगा जिसके साथ सोता हूं?" इसके बाद हाथापाई हुई और गलती से गोली चल गई।',
        },
        photoExhibitSrc: '/images/cases/nanavati_ballistics.jpg',
        photoExhibitCaption: {
          en: 'Bombay Police CID ballistics diagram: Bedroom trajectory and towel evidence (1959).',
          hi: 'बॉम्बे पुलिस सीआईडी बैलिस्टिक विश्लेषण: बेडरूम में गोली की दिशा और तौलिया (1959)।',
        },
      },
      {
        id: 'panel-5',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 05 · COURTROOM SHOWDOWN',
          hi: 'एपिसोड 05 · अदालत में घमासान',
        },
        headline: {
          en: 'Premeditated Murder vs. Sudden Provocation.',
          hi: 'योजनाबद्ध हत्या (302) बनाम अचानक उकसावा (300 Exception 1)।',
        },
        body: {
          en: 'The trial at the Sessions Court gripped all of India. The tabloid *Blitz* ran front-page campaigns portraying Nanavati as a patriotic officer defending his family honor.',
          hi: 'सत्र अदालत के मुकदमे ने पूरे देश का ध्यान खींचा। अखबार *ब्लिट्ज़* ने नानावटी को अपने परिवार के सम्मान की रक्षा करने वाले एक देशभक्त अधिकारी के रूप में पेश किया।',
        },
        evidence: {
          archiveType: 'newspaper',
          masthead: 'BLITZ WEEKLY · SPECIAL EDITION',
          date: 'MAY 1959 · BOMBAY',
          headline: {
            en: 'PATRIOTIC NAVY HERO DEFENDS HONOR: NATION RALLIES BEHIND NANAVATI',
            hi: 'देशभक्त नौसेना हीरो ने बचाई परिवार की लाज: पूरा देश नानावटी के साथ खड़ा',
          },
          snippet: {
            en: 'Crowds outside Bombay Sessions Court chant in support of Commander Nanavati. Defense Counsel Karl Khandalavala argues: "A man defending his sacred marriage against a corrupt predator cannot be called a murderer."',
            hi: 'बॉम्बे कोर्ट के बाहर भारी भीड़ नानावटी के समर्थन में नारे लगा रही है। मशहूर वकील कार्ल खंडालावाला ने दलील दी: "अपनी शादी की पवित्रता बचाने वाले को हत्यारा नहीं कहा जा सकता।"',
          },
          highlightedPhrase: {
            en: 'A man defending his sacred marriage against a predator cannot be called a murderer',
            hi: 'अपनी शादी की पवित्रता बचाने वाले को हत्यारा नहीं कहा जा सकता',
          },
          exhibitNumber: 'EXHIBIT B-4 · BLITZ ARCHIVE',
          caption: {
            en: 'Blitz tabloid sold out at 20x price during the trial.',
            hi: 'मुकदमे के दौरान ब्लिट्ज़ अखबार अपने मूल्य से 20 गुना दाम पर बिका।',
          },
        },
        prosecutionArgs: {
          party: { en: 'State / Karl Khandalavala / Jethmalani', hi: 'राज्य अभियोजन पक्ष' },
          claim: {
            en: 'Premeditated, cold-blooded murder. Nanavati had three full hours to cool down after Sylvia’s confession.',
            hi: 'सोची-समझी हत्या। सिल्विया के कबूलनामे के बाद नानावटी के पास शांत होने के लिए पूरे तीन घंटे थे।',
          },
          statute: 'IPC § 302 · Murder',
          keyPoint: {
            en: 'Nanavati went to the ship, lied to get a weapon, loaded it, and went hunting for Ahuja. The provocation was neither grave nor sudden at the time of shooting.',
            hi: 'नानावटी जहाज पर गए, झूठ बोलकर हथियार लिया, गोलियां भरीं और आहूजा को ढूंढने निकले। गोली मारते समय उकसावा न तो गंभीर था और न ही अचानक।',
          },
        },
        defenceArgs: {
          party: { en: 'Defence Counsel', hi: 'नानावटी का बचाव पक्ष' },
          claim: {
            en: 'Grave and sudden provocation or accidental death during a scuffle.',
            hi: 'गंभीर व अचानक उकसावा या हाथापाई में दुर्घटनावश चली गोली।',
          },
          statute: 'IPC § 300 Exception 1 / IPC § 80 (Accident)',
          keyPoint: {
            en: 'Ahuja’s insulting remark about marrying every woman provoked Nanavati into a temporary loss of self-control. The firearm discharged accidentally during the grapple.',
            hi: 'आहूजा की अपमानजनक टिप्पणी ने नानावटी का आत्मनियंत्रण खो दिया। हाथापाई के दौरान दुर्घटनावश गोली चल गई।',
          },
        },
        tappableTerms: [
          {
            id: 'grave-sudden-provocation',
            term: { en: 'Grave & Sudden Provocation', hi: 'गंभीर व अचानक उकसावा' },
            code: 'IPC Section 300 Exception 1',
            definition: {
              en: 'Culpable homicide is not murder if the offender, whilst deprived of the power of self-control by grave and sudden provocation, causes the death of the person who gave the provocation.',
              hi: 'आपराधिक मानव वध हत्या नहीं है यदि अपराधी गंभीर और अचानक उकसावे के कारण आत्म-नियंत्रण खोकर उस व्यक्ति की मृत्यु का कारण बनता है जिसने उकसाया था।',
            },
          },
        ],
      },
      {
        id: 'panel-6',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 06 · YOU ARE THE JURY',
          hi: 'एपिसोड 06 · आप हैं जूरी',
        },
        headline: {
          en: 'Guilty of Murder or Provoked Manslaughter?',
          hi: 'हत्या का दोषी या उकसावे में गैर-इरादतन हत्या?',
        },
        body: {
          en: 'Put yourself in the shoes of the 9-member jury in the Bombay Sessions Court in 1959. What verdict would you cast?',
          hi: '1959 की बॉम्बे सेशंस कोर्ट के 9 सदस्यों वाली जूरी की जगह खुद को रखकर सोचिए। आप क्या फैसला देते?',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'BOMBAY SESSIONS JURY CHARGE',
          date: 'OCTOBER 1959',
          headline: {
            en: 'JUDGE R.B. MEHTA CHARGE: DID THREE HOURS COOL THE FATAL PASSION?',
            hi: 'जज आर.बी. मेहता का निर्देश: क्या तीन घंटों ने नानावटी के गुस्से को ठंडा कर दिया था?',
          },
          snippet: {
            en: 'The learned Sessions Judge charged the jury: "If you believe the accused had time for cooling of blood between 1:30 PM and 4:30 PM, then the plea of sudden provocation cannot stand in law."',
            hi: 'सत्र न्यायाधीश ने जूरी को निर्देश दिया: "यदि आप मानते हैं कि दोपहर 1:30 से शाम 4:30 के बीच नानावटी का गुस्सा शांत होने का पर्याप्त समय था, तो कानून में अचानक उकसावे का बचाव नहीं टिक सकता।"',
          },
          highlightedPhrase: {
            en: 'If you believe the accused had time for cooling of blood, the plea of sudden provocation cannot stand',
            hi: 'यदि नानावटी का गुस्सा शांत होने का पर्याप्त समय था, तो अचानक उकसावे का बचाव नहीं टिक सकता',
          },
          exhibitNumber: 'SESSIONS JURY CHARGE #9',
          caption: {
            en: 'Sessions Judge instruction sheet delivered to the 9 jurors.',
            hi: '9 जूरी सदस्यों को दी गई सत्र न्यायाधीश की निर्देश पंजिका।',
          },
        },
        judgeDecision: {
          question: {
            en: 'Is Commander Nanavati Guilty of Premeditated Murder (Section 302) or Manslaughter under Provocation (Section 304)?',
            hi: 'क्या कमांडर नानावटी सोची-समझी हत्या (धारा 302) के दोषी हैं या उकसावे में गैर-इरादतन हत्या (धारा 304) के?',
          },
          subtext: {
            en: 'Did the 3-hour interval between Sylvia’s confession and the shooting provide sufficient "cooling time" to defeat the claim of sudden provocation?',
            hi: 'क्या सिल्विया के कबूलनामे और गोली चलने के बीच के 3 घंटे गुस्से के शांत होने के लिए पर्याप्त थे?',
          },
          options: [
            {
              id: 'not-guilty-murder',
              title: {
                en: 'Not Guilty of Murder (Culpable Homicide / Provocation)',
                hi: 'हत्या का दोषी नहीं (उकसावे में हुआ वध)',
              },
              reason: {
                en: 'Ahuja’s remark in the bedroom revived the sudden provocation. The jury believed he did not intend cold-blooded murder.',
                hi: 'बेडरूम में आहूजा की बात ने अचानक उकसावे को फिर से भड़का दिया। जूरी का मानना था कि यह सोची-समझी हत्या नहीं थी।',
              },
              simulatedVotesPercent: 44,
              isActualVerdict: false,
            },
            {
              id: 'guilty-murder',
              title: {
                en: 'Guilty of Murder under Section 302 IPC',
                hi: 'धारा 302 के तहत हत्या का दोषी',
              },
              reason: {
                en: 'Procuring a gun, loading it, and driving across town shows clear premeditation. 3 hours was ample cooling time.',
                hi: 'बंदूक लेना, उसमें गोलियां भरना और शहर पार करके जाना स्पष्ट रूप से पूर्व-नियोजित योजना दर्शाता है। 3 घंटे का समय शांत होने के लिए पर्याप्त था।',
              },
              simulatedVotesPercent: 56,
              isActualVerdict: true,
            },
          ],
          judicialRationale: {
            en: 'The Supreme Court laid down that "cooling time" between the provocation and the act completely destroys the defence of sudden provocation. Nanavati was convicted of murder.',
            hi: 'सुप्रीम कोर्ट ने स्पष्ट किया कि उकसावे और अपराध के बीच का समय (Cooling Time) अचानक उकसावे के बचाव को पूरी तरह समाप्त कर देता है। नानावटी को हत्या का दोषी ठहराया गया।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · THE HIGH COURT & SUPREME COURT',
          hi: 'एपिसोड 07 · हाई कोर्ट और सुप्रीम कोर्ट',
        },
        headline: {
          en: 'Jury Overturned: Convicted of Murder.',
          hi: 'जूरी का फैसला रद्द: हत्या के लिए उम्रकैद।',
        },
        stamp: {
          en: 'GUILTY OF MURDER · IPC 302',
          hi: 'दोषी · आईपीसी धारा 302',
        },
        body: {
          en: 'The 9-member jury had acquitted Nanavati by an 8-1 majority. But Sessions Judge Mehta found the verdict perverse and referred it to the Bombay High Court.\n\nThe High Court overturned the jury verdict, finding Nanavati guilty of murder under Section 302 IPC and sentencing him to life imprisonment. The Supreme Court dismissed his appeal in 1961.',
          hi: '9 सदस्यीय जूरी ने 8-1 के बहुमत से नानावटी को निर्दोष ठहरा दिया था। लेकिन सेशंस जज मेहता ने इस फैसले को पक्षपातपूर्ण मानकर बॉम्बे हाई कोर्ट को रेफर कर दिया।\n\nहाई कोर्ट ने जूरी के फैसले को पलटते हुए नानावटी को धारा 302 के तहत हत्या का दोषी पाया और उम्रकैद की सजा सुनाई। 1961 में सुप्रीम कोर्ट ने भी उनकी अपील खारिज कर दी।',
        },
        evidence: {
          archiveType: 'verdict_decree',
          masthead: 'BOMBAY HIGH COURT BENCH (AIR 1961 BOM 130)',
          date: '11 MARCH 1960',
          headline: {
            en: 'HISTORIC REVERSAL: JURY VERDICT WAS PERVERSE AND CONTRARY TO WEIGHT OF EVIDENCE',
            hi: 'ऐतिहासिक फैसला: जूरी का निर्णय पक्षपातपूर्ण और सबूतों के खिलाफ था',
          },
          snippet: {
            en: 'Justices Shelat and Naik hold: The jury was misled by emotional appeals and Blitz publicity. The evidence clearly establishes deliberate, premeditated murder under Section 302 IPC. Sentenced to life imprisonment.',
            hi: 'न्यायमूर्ति शेलत और नाइक का निर्णय: जूरी भावनात्मक प्रचार से बहक गई थी। साक्ष्य स्पष्ट रूप से साबित करते हैं कि यह धारा 302 के तहत सोची-समझी हत्या थी। उम्रकैद की सजा दी जाती है।',
          },
          highlightedPhrase: {
            en: 'The jury was misled by emotional appeals. Evidence clearly establishes premeditated murder',
            hi: 'जूरी भावनात्मक प्रचार से बहक गई थी। साक्ष्य साबित करते हैं कि यह सोची-समझी हत्या थी',
          },
          exhibitNumber: 'HIGH COURT ORDER #130/1961',
          caption: {
            en: 'Certified Bombay High Court decree overturning the 8-1 jury verdict.',
            hi: 'बॉम्बे हाई कोर्ट का प्रमाणित आदेश जिसने 8-1 जूरी फैसले को पलट दिया।',
          },
        },
      },
      {
        id: 'panel-8',
        type: 'RATIO',
        eyebrow: {
          en: 'EPISODE 08 · LEGAL RATIO & IMPACT',
          hi: 'एपिसोड 08 · कानूनी सिद्धांत और प्रभाव',
        },
        headline: {
          en: 'The Four-Part Test & The Death of Jury Trials.',
          hi: 'चार सूत्रीय सिद्धांत और जूरी व्यवस्था का अंत।',
        },
        body: {
          en: 'Justice K. Subba Rao laid down the landmark 4-part test for Grave & Sudden Provocation:\n1. The provocation must be grave and sudden.\n2. The test is objective: would a reasonable person lose self-control?\n3. Words and gestures can constitute provocation only in exceptional cases.\n4. The fatal act must be committed before cooling time has elapsed.\n\nPublic outrage over jury bias in this case led Parliament to abolish jury trials in India in the 1973 CrPC.',
          hi: 'न्यायमूर्ति के. सुब्बा राव ने गंभीर और अचानक उकसावे के लिए 4 सूत्रीय ऐतिहासिक सिद्धांत तय किए:\n1. उकसावा गंभीर और अचानक होना चाहिए।\n2. पैमाना वस्तुनिष्ठ है: क्या एक सामान्य व्यक्ति आत्म-नियंत्रण खो देता?\n3. केवल असाधारण मामलों में ही शब्द उकसावा बन सकते हैं।\n4. कृत्य गुस्सा शांत होने (Cooling Time) से पहले होना चाहिए।\n\nइस मामले में जूरी के पक्षपात के बाद 1973 के नए CrPC में भारत से जूरी व्यवस्था को हमेशा के लिए समाप्त कर दिया गया।',
        },
        evidence: {
          archiveType: 'court_decree',
          masthead: 'SUPREME COURT OF INDIA (1962 AIR 605)',
          date: 'NOVEMBER 1961',
          headline: {
            en: 'THE APEX RATIO: COOLING TIME DESTROYS EXCEPTION 1 TO SECTION 300 IPC',
            hi: 'शीर्ष अदालत का सिद्धांत: समय का बीत जाना अचानक उकसावे के बचाव को समाप्त कर देता है',
          },
          snippet: {
            en: 'HELD: Where sufficient time has elapsed between the provocation and the fatal blow for passion to cool and reason to resume, the killing is murder, not manslaughter. Jury trial system abolished in 1973 CrPC.',
            hi: 'फैसला: यदि उकसावे और वार के बीच गुस्सा ठंडा होने का पर्याप्त समय मिल चुका हो, तो वह हत्या मानी जाएगी, उकसावे का वध नहीं। 1973 में जूरी प्रथा समाप्त कर दी गई।',
          },
          highlightedPhrase: {
            en: 'Where sufficient time has elapsed for passion to cool, the killing is murder',
            hi: 'यदि गुस्सा ठंडा होने का पर्याप्त समय मिल चुका हो, तो वह हत्या मानी जाएगी',
          },
          exhibitNumber: 'PRECEDENT · 1962 AIR 605',
          caption: {
            en: 'Supreme Court ratio establishing cooling time and ending jury trials in India.',
            hi: 'सुप्रीम कोर्ट का ऐतिहासिक सिद्धांत जिसने भारत में जूरी प्रथा को खत्म किया।',
          },
        },
        citationFooter: 'AIR 1962 SC 605 · Supreme Court of India',
        judgmentUrl: 'https://indiankanoon.org/doc/1596139/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India · 1961',
        hi: 'सुप्रीम कोर्ट ऑफ इंडिया · 1961',
      },
      facts: {
        en: 'Commander K.M. Nanavati was tried for the murder of Prem Ahuja, his wife’s paramour. After Sylvia confessed the affair, Nanavati procured a revolver from his ship, went to Ahuja’s flat, and shot him dead. The jury returned a verdict of "not guilty" by 8:1, which the Sessions Judge referred to the High Court as perverse.',
        hi: 'कमांडर के.एम. नानावटी पर अपनी पत्नी के प्रेमी प्रेम आहूजा की हत्या का मुकदमा चला। पत्नी के कबूलनामे के बाद नानावटी ने युद्धपोत से रिवॉल्वर ली और आहूजा के घर जाकर गोली मार दी। जूरी ने 8-1 से नानावटी को निर्दोष ठहराया, जिसे सेशंस जज ने अनुचित मानकर हाई कोर्ट भेज दिया।',
      },
      issues: {
        en: [
          'Whether the High Court had the power to set aside a jury verdict under Section 307 of the CrPC?',
          'Whether the killing of Prem Ahuja was done under grave and sudden provocation within the meaning of Exception 1 to Section 300 IPC?',
        ],
        hi: [
          'क्या हाई कोर्ट के पास CrPC की धारा 307 के तहत जूरी के फैसले को रद्द करने का अधिकार था?',
          'क्या प्रेम आहूजा की हत्या आईपीसी धारा 300 के अपवाद 1 के तहत गंभीर और अचानक उकसावे में की गई थी?',
        ],
      },
      chargesApplied: ['IPC § 302 (Murder)', 'IPC § 304 Part I (Culpable Homicide)', 'Arms Act § 19'],
      held: {
        en: 'The Supreme Court upheld the High Court conviction under Section 302 IPC. The 3-hour interval between confession and the shooting provided sufficient cooling time, negating sudden provocation.',
        hi: 'सुप्रीम कोर्ट ने हाई कोर्ट के फैसले को बरकरार रखते हुए धारा 302 के तहत नानावटी को हत्या का दोषी ठहराया। कबूलनामे और गोलीबारी के बीच के 3 घंटे गुस्सा शांत होने के लिए पर्याप्त थे।',
      },
      reasoning: {
        en: 'Justice Subba Rao established that for Exception 1 to apply, the fatal blow must be delivered while the accused is still deprived of the power of self-control by sudden provocation. The deliberate act of securing the firearm, loading it, and driving to the victim showed pre-meditation.',
        hi: 'न्यायमूर्ति सुब्बा राव ने स्थापित किया कि अपवाद 1 लागू होने के लिए जरूरी है कि वार अचानक उकसावे के तुरंत बाद आत्म-नियंत्रण खोने की स्थिति में किया गया हो। हथियार का प्रबंध करना और योजना बनाकर जाना यह दर्शाता है कि यह सोची-समझी हत्या थी।',
      },
      whyItMatters: {
        en: 'This case is the definitive Indian precedent on Grave & Sudden Provocation and the concept of "cooling time." It also led directly to the abolition of jury trials in India through the Code of Criminal Procedure, 1973.',
        hi: 'यह मामला गंभीर और अचानक उकसावे तथा "Cooling Time" के सिद्धांत पर भारत की सबसे बड़ी नजीर है। इसके परिणामस्वरूप ही 1973 के नए कानून में भारत से जूरी व्यवस्था समाप्त कर दी गई।',
      },
    },
  },

  {
    slug: 'haircut-case',
    title: {
      en: 'The ₹2 Crore Haircut Case',
      hi: '₹2 करोड़ का हेयरकट मामला',
    },
    tag: {
      en: 'Consumer Protection · Deficiency of Service',
      hi: 'उपभोक्ता संरक्षण · सेवा में कमी',
    },
    categoryTag: 'Consumer Law',
    genre: 'consumer',
    theme: 'corporate-luxury',
    court: 'Supreme Court of India',
    year: 2023,
    readTime: {
      en: '3 min read',
      hi: '3 मिनट',
    },
    matchRate: 94,
    maturityRating: 'U/A 13+',
    rank: 3,
    bannerImage: '/images/cases/haircut-case.jpg',
    blurb: {
      en: 'A botched haircut at a 5-star hotel salon led to a ₹2 Crore compensation award. The Supreme Court stepped in.',
      hi: '5-स्टार होटल के सैलून में खराब हेयरकट के लिए ₹2 करोड़ का हर्जाना दिया गया। सुप्रीम कोर्ट ने तय किया कानून का दायरा।',
    },
    citation: 'ITC Ltd. v. Aashna Roy, 2023 INSC 124, Civil Appeal No. 6371 of 2021',
    judgmentUrl: 'https://indiankanoon.org/doc/171887260/',
    watermark: '₹2CR',
    featuredHeroHook: {
      en: 'A ₹2 Crore haircut. The Supreme Court draws the line.',
      hi: '₹2 करोड़ का हेयरकट। सुप्रीम कोर्ट ने खींची लक्ष्मण रेखा।',
    },
    featuredHeroDesc: {
      en: 'A model walked into a luxury hotel salon for a simple trim and walked out with short chops. The National Consumer Commission awarded her an unprecedented ₹2 Crore. The Supreme Court intervened to draw the line between genuine loss and speculative windfall.',
      hi: 'एक मॉडल 5-स्टार होटल के सैलून में बाल ट्रिम कराने गई और उसके बाल बहुत छोटे काट दिए गए। उपभोक्ता आयोग ने 2 करोड़ रुपये हर्जाना दे दिया। सुप्रीम कोर्ट ने हस्तक्षेप कर वास्तविक नुकसान और मनमानी रकम के बीच की रेखा तय की।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · LUXURY DISPUTE',
          hi: 'एपिसोड 01 · 5-स्टार विवाद',
        },
        headline: {
          en: 'The most expensive haircut in Indian legal history.',
          hi: 'भारतीय कानूनी इतिहास का सबसे महंगा हेयरकट।',
        },
        body: {
          en: 'New Delhi, April 2018. Aashna Roy, an executive and aspiring hair model, visited the salon at ITC Maurya before a major professional interview. What followed sparked an 8-year battle in India’s apex court.',
          hi: 'नई दिल्ली, अप्रैल 2018। आशना रॉय एक महत्वपूर्ण इंटरव्यू से पहले आईटीसी मौर्या के सैलून गईं। इसके बाद जो हुआ उसने सुप्रीम कोर्ट तक 8 साल लंबी कानूनी लड़ाई छेड़ दी।',
        },
        photoExhibitSrc: '/images/cases/haircut-case.jpg',
        photoExhibitCaption: {
          en: 'Archival visual: Luxury salon styling station at ITC Maurya 5-Star Hotel, New Delhi.',
          hi: '5-स्टार होटल सैलून का दृश्य, नई दिल्ली।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य पात्र',
        },
        headline: {
          en: 'The Model vs. The Hospitality Giant.',
          hi: 'मॉडल बनाम 5-स्टार होटल समूह।',
        },
        body: {
          en: 'The parties who faced off in India’s most high-profile consumer law dispute.',
          hi: 'वे दो पक्ष जो भारत के सबसे चर्चित उपभोक्ता मामले में आमने-सामने आए।',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'NCDRC CLAIMANT DOSSIER · CC/1622/2018',
          date: 'NEW DELHI · 2018',
          headline: {
            en: 'CLAIMANT PROFILE: EXECUTIVE MODEL AASHNA ROY VS ITC HOTELS LTD',
            hi: 'दावेदार प्रोफाइल: एग्जीक्यूटिव मॉडल आशना रॉय बनाम आईटीसी होटल्स लिमिटेड',
          },
          snippet: {
            en: 'Complaint states: Complainant was an executive model for renowned hair product brands including Pantene and Sunsilk. The unauthorized severe cut and scalp damage led to complete loss of contracts and severe depression.',
            hi: 'शिकायत में दर्ज: दावेदार पैंटीन और सनसिल्क जैसे बड़े ब्रांड्स के लिए हेयर मॉडल थीं। बिना सहमति के काटे गए छोटे बालों और स्कैल्प डैमेज से उनके सारे मॉडलिंग कॉन्ट्रैक्ट रद्द हो गए और वे गहरे तनाव में चली गईं।',
          },
          highlightedPhrase: {
            en: 'executive model for renowned hair product brands including Pantene and Sunsilk',
            hi: 'पैंटीन और सनसिल्क जैसे बड़े ब्रांड्स के लिए हेयर मॉडल थीं',
          },
          exhibitNumber: 'NCDRC DOSSIER #1622',
          caption: {
            en: 'Original claimant portfolio dossier submitted to National Consumer Commission.',
            hi: 'राष्ट्रीय उपभोक्ता आयोग में जमा की गई मूल दावेदार प्रोफाइल फाइल।',
          },
        },
        characters: [
          {
            name: { en: 'Aashna Roy', hi: 'आशना रॉय' },
            role: { en: 'Complainant / Model', hi: 'शिकायतकर्ता / मॉडल' },
            tag: { en: 'Hair Product Model', hi: 'हेयर केयर मॉडल' },
            description: {
              en: 'Claimed ₹3 Crore in damages for loss of hair modeling contracts and severe psychological trauma.',
              hi: 'मॉडलिंग कॉन्ट्रैक्ट्स के नुकसान और मानसिक आघात के लिए ₹3 करोड़ के मुआवजे की मांग की।',
            },
            badgeEmoji: '💇‍♀️',
          },
          {
            name: { en: 'ITC Maurya Hotel', hi: 'आईटीसी मौर्या होटल' },
            role: { en: 'Opposite Party (Salon)', hi: 'विपक्षी पार्टी (सैलून)' },
            tag: { en: 'Luxury 5-Star Hotel', hi: 'लक्जरी 5-स्टार होटल' },
            description: {
              en: 'Offered free hair treatments but disputed the astronomical ₹2 Crore damages claim.',
              hi: 'मुफ्त हेयर ट्रीटमेंट की पेशकश की लेकिन ₹2 करोड़ के भारी हर्जाने का कड़ा विरोध किया।',
            },
            badgeEmoji: '🏨',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'INCIDENT',
        eyebrow: {
          en: 'EPISODE 03 · THE SALON DISASTER',
          hi: 'एपिसोड 03 · सैलून में हुई चूक',
        },
        headline: {
          en: 'Chemical treatment and severed tresses.',
          hi: 'केमिकल ट्रीटमेंट और बालों का नुकसान।',
        },
        body: {
          en: 'The customer requested a 4-inch trim from the bottom. Instead, the stylist chopped her hair to just 1 inch from the scalp.\n\nWhen the salon offered a corrective keratin treatment, excess chemicals burned her scalp, causing permanent follicle damage.',
          hi: 'ग्राहक ने केवल नीचे से 4 इंच बाल ट्रिम करने को कहा था। लेकिन स्टाइलिस्ट ने ऊपर से काटते हुए केवल 1 इंच बाल छोड़े।\n\nइसके बाद जब सैलून ने सुधार के लिए केराटिन ट्रीटमेंट किया, तो अत्यधिक केमिकल से स्कैल्प जल गया और बालों की जड़ें खराब हो गईं।',
        },
        evidence: {
          archiveType: 'forensic',
          masthead: 'DERMATOLOGY & TRICHOLOGY CLINICAL REPORT',
          date: 'MAY 2018 · NEW DELHI',
          headline: {
            en: 'EXAMINATION FINDINGS: CHEMICAL BURNS & IRREVERSIBLE FOLLICULAR DAMAGE',
            hi: 'जांच रिपोर्ट: केमिकल बर्न और बालों की जड़ों को गंभीर नुकसान',
          },
          snippet: {
            en: 'Trichological examination confirms severe chemical scalp irritation from excess ammonia and peroxide during corrective salon procedure, resulting in permanent thinning and follicle trauma.',
            hi: 'ट्राइकोलॉजिकल जांच में पुष्टि हुई कि सुधार प्रक्रिया के दौरान अत्यधिक अमोनिया और पेरोक्साइड के उपयोग से स्कैल्प बुरी तरह जल गया और जड़ों को स्थायी नुकसान पहुंचा।',
          },
          highlightedPhrase: {
            en: 'severe chemical scalp irritation from excess ammonia resulting in permanent thinning',
            hi: 'अत्यधिक अमोनिया के उपयोग से स्कैल्प बुरी तरह जल गया और जड़ों को स्थायी नुकसान पहुंचा',
          },
          exhibitNumber: 'EXHIBIT A-3 · TRICHOLOGY LAB',
          caption: {
            en: 'Medical dermatology report filed as evidence of physical bodily harm.',
            hi: 'शारीरिक क्षति के प्रमाण के रूप में अदालत में प्रस्तुत मेडिकल रिपोर्ट।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 04 · BILLING & DEFICIENCY EVIDENCE',
          hi: 'एपिसोड 04 · बिलिंग और साक्ष्य',
        },
        headline: {
          en: 'The ₹11,800 invoice and the ₹2 Crore award.',
          hi: '₹11,800 का बिल और ₹2 करोड़ का हर्जाना।',
        },
        body: {
          en: 'The National Consumer Commission (NCDRC) ruled that the luxury hotel committed gross deficiency in service, awarding an unprecedented ₹2,00,00,000 in compensation.',
          hi: 'राष्ट्रीय उपभोक्ता आयोग (NCDRC) ने माना कि लक्जरी होटल ने सेवा में घोर लापरवाही की, और अभूतपूर्व ₹2,00,00,000 का मुआवजा देने का आदेश दिया।',
        },
        evidence: {
          archiveType: 'police_record',
          masthead: 'SALON DI AURUM · ITC MAURYA INVOICE',
          date: '12 APRIL 2018 · 19:42 HRS',
          headline: {
            en: 'INVOICE #ITC-DEL-8839: VIP HAIRCUT & KERATIN REPAIR SUITE',
            hi: 'बिल संख्या #ITC-DEL-8839: वीआईपी हेयरकट और केराटिन ट्रीटमेंट',
          },
          snippet: {
            en: 'Billing ledger proves ₹11,800 paid for senior stylist service. NCDRC noted: Trainee stylist assigned without consent, chopping 4-inch flick into 1-inch buzz cut against explicit customer instructions.',
            hi: 'बिलिंग रिकॉर्ड साबित करता है कि सीनियर स्टाइलिस्ट के लिए ₹11,800 दिए गए थे। NCDRC ने दर्ज किया: ग्राहक की सहमति के बिना ट्रेनी स्टाइलिस्ट लगाया गया जिसने 4 इंच की जगह 1 इंच बाल छोड़ दिए।',
          },
          highlightedPhrase: {
            en: 'Trainee stylist assigned without consent, chopping 4-inch flick into 1-inch buzz cut',
            hi: 'सहमति के बिना ट्रेनी स्टाइलिस्ट लगाया गया जिसने 4 इंच की जगह 1 इंच बाल छोड़ दिए',
          },
          exhibitNumber: 'EXHIBIT B-1 · BILLING RECEIPT',
          caption: {
            en: 'Original luxury salon invoice submitted to National Consumer Court.',
            hi: 'राष्ट्रीय उपभोक्ता अदालत में प्रस्तुत मूल 5-स्टार सैलून बिल रसीद।',
          },
        },
      },
      {
        id: 'panel-5',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 05 · SUPREME COURT APPEAL',
          hi: 'एपिसोड 05 · सुप्रीम कोर्ट में बहस',
        },
        headline: {
          en: 'Can damages be granted without documentary proof of loss?',
          hi: 'क्या बिना दस्तावेजी सबूत के करोड़ों का हर्जाना दिया जा सकता है?',
        },
        body: {
          en: 'ITC appealed to the Supreme Court, arguing that the ₹2 Crore award was arbitrary and unsupported by any tax returns, modeling contracts, or financial records.',
          hi: 'आईटीसी ने सुप्रीम कोर्ट में अपील की कि ₹2 करोड़ का हर्जाना पूरी तरह मनमाना था और इसके समर्थन में कोई टैक्स रिटर्न या मॉडलिंग कॉन्ट्रैक्ट पेश नहीं किया गया।',
        },
        evidence: {
          archiveType: 'newspaper',
          masthead: 'THE HINDUSTAN TIMES · NEW DELHI',
          date: '24 SEPTEMBER 2021',
          headline: {
            en: 'NCDRC ORDERS 5-STAR HOTEL TO PAY ₹2 CRORE DAMAGES FOR BOTCHED HAIRCUT',
            hi: 'उपभोक्ता आयोग का आदेश: खराब हेयरकट के लिए 5-स्टार होटल मॉडल को ₹2 करोड़ हर्जाना दे',
          },
          snippet: {
            en: 'The Commission ruled: "There is no doubt that women are cautious about their hair. A woman’s hair is part of her physical identity. Botched service ruined her career and caused grave mental agony."',
            hi: 'आयोग ने फैसला दिया: "इसमें कोई संदेह नहीं कि महिलाएं अपने बालों को लेकर सतर्क रहती हैं। बाल महिला की पहचान का अहम हिस्सा हैं। इस लापरवाही ने उनका करियर बर्बाद कर दिया।"',
          },
          highlightedPhrase: {
            en: 'women are cautious about their hair. Botched service ruined her career',
            hi: 'महिलाएं अपने बालों को लेकर सतर्क रहती हैं। इस लापरवाही ने उनका करियर बर्बाद कर दिया',
          },
          exhibitNumber: 'EXHIBIT C-2 · PRESS COVERAGE',
          caption: {
            en: 'National news coverage of the unprecedented ₹2 Crore consumer award.',
            hi: 'अभूतपूर्व ₹2 करोड़ के उपभोक्ता मुआवजे की राष्ट्रीय मीडिया कवरेज।',
          },
        },
        prosecutionArgs: {
          party: { en: 'Aashna Roy (Consumer)', hi: 'आशना रॉय (उपभोक्ता)' },
          claim: {
            en: 'Gross deficiency of service destroyed my high-paying modeling career and caused permanent psychological trauma.',
            hi: 'सैलून की घोर लापरवाही ने मेरा मॉडलिंग करियर बर्बाद कर दिया और गंभीर मानसिक आघात पहुंचाया।',
          },
          statute: 'Consumer Protection Act § 14(1)(d)',
          keyPoint: {
            en: 'A woman’s hair is central to her identity. In modeling, hair loss is career-ending. ₹2 Crore reflects the prestige and earning loss.',
            hi: 'बाल महिला के व्यक्तित्व का अहम हिस्सा हैं। मॉडलिंग में बालों का नुकसान करियर का अंत है। ₹2 करोड़ का हर्जाना उचित है।',
          },
        },
        defenceArgs: {
          party: { en: 'ITC Ltd. (Hotel Management)', hi: 'आईटीसी होटल्स लिमिटेड' },
          claim: {
            en: '₹2 Crore is completely arbitrary. The complainant produced zero income tax returns or signed modeling contracts.',
            hi: '₹2 करोड़ की रकम पूरी तरह निराधार है। शिकायतकर्ता ने एक भी टैक्स रिटर्न या मॉडलिंग अनुबंध का सबूत नहीं दिया।',
          },
          statute: 'Principle of Restitutio in Integrum',
          keyPoint: {
            en: 'Compensation in tort cannot be a lottery or punitive windfall. It must be proven with mathematical and documentary evidence.',
            hi: 'उपभोक्ता मामलों में मुआवजा कोई लॉटरी या मनमानी रकम नहीं हो सकता। इसे दस्तावेजी सबूतों से साबित किया जाना चाहिए।',
          },
        },
        tappableTerms: [
          {
            id: 'deficiency-of-service',
            term: { en: 'Deficiency of Service', hi: 'सेवा में कमी' },
            code: 'Consumer Protection Act Section 2(11)',
            definition: {
              en: 'Any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance which is required to be maintained by or under any law.',
              hi: 'गुणवत्ता, प्रकृति या निष्पादन में कोई भी दोष, खामी या अपर्याप्तता जिसे कानून के तहत बनाए रखना आवश्यक है।',
            },
          },
        ],
      },
      {
        id: 'panel-6',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 06 · YOU ARE THE JUDGE',
          hi: 'एपिसोड 06 · आप हैं जज',
        },
        headline: {
          en: 'What is fair compensation for a bad haircut?',
          hi: 'खराब हेयरकट के लिए उचित हर्जाना क्या होना चाहिए?',
        },
        body: {
          en: 'Deficiency of service is established. But how should an apex court quantify damages when the consumer cannot produce past tax returns or contracts?',
          hi: 'सेवा में कमी साबित हो चुकी है। लेकिन जब उपभोक्ता के पास टैक्स रिटर्न या अनुबंध का सबूत न हो, तो अदालत को कितना हर्जाना तय करना चाहिए?',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'SUPREME COURT OF INDIA CHAMBERS',
          date: 'FEBRUARY 2023',
          headline: {
            en: 'APEX COURT DILEMMA: QUANTIFICATION OF TORT DAMAGES WITHOUT EVIDENCE',
            hi: 'सुप्रीम कोर्ट की दुविधा: बिना सबूत के नुकसान की गणना कैसे हो',
          },
          snippet: {
            en: 'Bench of Justices Bose and Vikram Nath: "What is the basis for ₹2 Crore? A consumer court cannot pick an astronomical figure out of thin air without material evidence of income."',
            hi: 'न्यायमूर्ति बोस और विक्रम नाथ की पीठ: "₹2 करोड़ का आधार क्या है? उपभोक्ता अदालत बिना किसी आय प्रमाण के हवा में से मनमानी रकम तय नहीं कर सकती।"',
          },
          highlightedPhrase: {
            en: 'A consumer court cannot pick an astronomical figure out of thin air without material evidence',
            hi: 'उपभोक्ता अदालत बिना किसी आय प्रमाण के हवा में से मनमानी रकम तय नहीं कर सकती',
          },
          exhibitNumber: 'SUPREME COURT DOSSIER · CA 6371',
          caption: {
            en: 'Supreme Court bench deliberation file on consumer damages standards.',
            hi: 'उपभोक्ता हर्जाने के मानकों पर सुप्रीम कोर्ट की विचारणीय फाइल।',
          },
        },
        judgeDecision: {
          question: {
            en: 'Should the ₹2 Crore compensation be upheld or reduced to a reasonable evidenced amount?',
            hi: 'क्या ₹2 करोड़ का हर्जाना बरकरार रखा जाए या इसे घटाकर एक उचित राशि की जाए?',
          },
          subtext: {
            en: 'Balance consumer accountability against the rule that compensation must reflect proven economic loss.',
            hi: 'उपभोक्ता अधिकारों की जवाबदेही और साबित हुए आर्थिक नुकसान के सिद्धांत के बीच संतुलन बनाएं।',
          },
          options: [
            {
              id: 'uphold-2cr',
              title: {
                en: 'Uphold ₹2 Crore as Deterrent Punitive Damages',
                hi: 'सबक सिखाने के लिए ₹2 करोड़ का हर्जाना बरकरार रखें',
              },
              reason: {
                en: '5-star hotels charging luxury rates must be held to the highest standard of accountability for destroying a client’s looks.',
                hi: 'महंगी फीस लेने वाले 5-स्टार होटलों को ग्राहक का रूप बिगाड़ने के लिए सख्त जवाबदेह ठहराया जाना चाहिए।',
              },
              simulatedVotesPercent: 29,
              isActualVerdict: false,
            },
            {
              id: 'reduce-damages',
              title: {
                en: 'Set Aside & Remand for Evidence-Based Compensation',
                hi: 'फैसला रद्द करें और सबूतों के आधार पर उचित हर्जाना तय करें',
              },
              reason: {
                en: 'Compensation must be realistic and proven with material evidence (tax returns, lost contracts). Speculation has no place in law.',
                hi: 'मुआवजा वास्तविक और दस्तावेजी सबूतों (टैक्स रिटर्न, अनुबंध) पर आधारित होना चाहिए। कानून में अटकलों की कोई जगह नहीं है।',
              },
              simulatedVotesPercent: 71,
              isActualVerdict: true,
            },
          ],
          judicialRationale: {
            en: 'The Supreme Court held that deficiency of service was proven, but ₹2 Crore was arbitrary without documentary proof. The matter was remanded, and compensation was capped at ₹25 Lakhs.',
            hi: 'सुप्रीम कोर्ट ने माना कि सेवा में कमी साबित थी, लेकिन बिना दस्तावेजी सबूत के ₹2 करोड़ मनमाना था। मामले को दोबारा भेजा गया और हर्जाना ₹25 लाख तय किया गया।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · SUPREME COURT VERDICT & RATIO',
          hi: 'एपिसोड 07 · सुप्रीम कोर्ट का फैसला व सिद्धांत',
        },
        headline: {
          en: 'The Supreme Court Verdict: ₹2 Cr Set Aside, Reduced to ₹25 Lakhs.',
          hi: 'सुप्रीम कोर्ट का फैसला: ₹2 करोड़ रद्द, घटाकर ₹25 लाख किया गया।',
        },
        stamp: {
          en: '₹2 CR QUASHED · ₹25 LAKH AWARDED',
          hi: '₹2 करोड़ रद्द · ₹25 लाख मुआवजा',
        },
        body: {
          en: 'A Supreme Court bench of Justices Aniruddha Bose and Vikram Nath held that while ITC was unquestionably guilty of deficiency in service, compensation must be based on quantifiable material evidence.\n\nThe apex court held that consumer courts cannot award arbitrary windfall damages without examining tax returns and actual financial loss. The award was reduced to ₹25 Lakhs.',
          hi: 'सुप्रीम कोर्ट के न्यायमूर्ति अनिरुद्ध बोस और विक्रम नाथ की पीठ ने फैसला सुनाया कि हालांकि आईटीसी सेवा में कमी की दोषी थी, लेकिन मुआवजा ठोस दस्तावेजी सबूतों पर आधारित होना चाहिए।\n\nअदालत ने कहा कि उपभोक्ता आयोग बिना टैक्स रिटर्न या वित्तीय नुकसान की जांच किए मनमाना हर्जाना नहीं दे सकते। मुआवजे को घटाकर ₹25 लाख कर दिया गया।',
        },
        evidence: {
          archiveType: 'verdict_decree',
          masthead: 'SUPREME COURT OF INDIA (2023 INSC 124)',
          date: 'FEBRUARY 2023',
          headline: {
            en: 'LANDMARK RATIO: CONSUMER DAMAGES MUST BE PROPORTIONATE AND DOCUMENTED',
            hi: 'ऐतिहासिक सिद्धांत: उपभोक्ता हर्जाना आनुपातिक और प्रमाणित होना चाहिए',
          },
          snippet: {
            en: 'HELD: Compensation awarded by Consumer Commissions cannot be a speculative bonanza. It must correspond to actual proved injury. Deficiency of service upheld; ₹2 Crore reduced to ₹25 Lakhs.',
            hi: 'फैसला: उपभोक्ता आयोग द्वारा दिया गया मुआवजा कोई काल्पनिक लॉटरी नहीं हो सकता। यह वास्तविक साबित हुए नुकसान के अनुरूप होना चाहिए। सेवा में कमी बरकरार; ₹2 करोड़ घटाकर ₹25 लाख किया गया।',
          },
          highlightedPhrase: {
            en: 'Compensation awarded by Consumer Commissions cannot be a speculative bonanza',
            hi: 'उपभोक्ता आयोग द्वारा दिया गया मुआवजा कोई काल्पनिक लॉटरी नहीं हो सकता',
          },
          exhibitNumber: 'APEX DECREE · 2023 INSC 124',
          caption: {
            en: 'Certified Supreme Court judgment: ITC Ltd. v. Aashna Roy.',
            hi: 'प्रमाणित सुप्रीम कोर्ट फैसला: आईटीसी लिमिटेड बनाम आशना रॉय।',
          },
        },
        citationFooter: '2023 INSC 124 · Supreme Court of India',
        judgmentUrl: 'https://indiankanoon.org/doc/171887260/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India · 2023',
        hi: 'सुप्रीम कोर्ट ऑफ इंडिया · 2023',
      },
      facts: {
        en: 'Aashna Roy visited the salon at ITC Maurya Hotel in New Delhi for a hair trim. The stylist cut her hair extremely short against instructions, and a subsequent chemical treatment burned her scalp. The NCDRC awarded ₹2 Crore in damages citing loss of modeling career. ITC appealed to the Supreme Court.',
        hi: 'आशना रॉय नई दिल्ली के आईटीसी मौर्या होटल के सैलून में बाल कटवाने गईं। स्टाइलिस्ट ने निर्देशों के खिलाफ बाल बहुत छोटे काट दिए और बाद के ट्रीटमेंट से स्कैल्प जल गया। NCDRC ने मॉडलिंग करियर के नुकसान का हवाला देते हुए ₹2 करोड़ का हर्जाना दिया। आईटीसी ने सुप्रीम कोर्ट में अपील की।',
      },
      issues: {
        en: [
          'Whether the NCDRC erred in awarding ₹2 Crore compensation without documentary proof of income and modeling contracts?',
          'What are the principles for quantifying compensation for deficiency of service under Consumer Protection law?',
        ],
        hi: [
          'क्या NCDRC ने आय और मॉडलिंग कॉन्ट्रैक्ट के दस्तावेजी सबूत के बिना ₹2 करोड़ का मुआवजा देकर गलती की?',
          'उपभोक्ता संरक्षण कानून के तहत सेवा में कमी के लिए मुआवजे की गणना के क्या सिद्धांत हैं?',
        ],
      },
      chargesApplied: ['Consumer Protection Act § 14(1)(d) (Compensation for Negligence)'],
      held: {
        en: 'The Supreme Court confirmed deficiency in service but set aside the ₹2 Crore award for lack of material evidence. The matter was remanded and subsequently compensation was determined at ₹25 Lakhs.',
        hi: 'सुप्रीम कोर्ट ने सेवा में कमी की पुष्टि की लेकिन ठोस सबूतों के अभाव में ₹2 करोड़ के हर्जाने को रद्द कर दिया। मामले को दोबारा भेजा गया और अंततः ₹25 लाख मुआवजा तय हुआ।',
      },
      reasoning: {
        en: 'The court held that compensation must be proportionate and based on quantifiable proof such as income tax returns, contract values, and actual financial loss. Emotion and subjective claims cannot justify speculative awards.',
        hi: 'अदालत ने माना कि मुआवजा आनुपातिक होना चाहिए और टैक्स रिटर्न, अनुबंध मूल्य व वास्तविक वित्तीय नुकसान जैसे ठोस प्रमाणों पर आधारित होना चाहिए। केवल भावनात्मक दावों पर मनमाना हर्जाना नहीं दिया जा सकता।',
      },
      whyItMatters: {
        en: 'This judgment establishes strict guidelines for Consumer Commissions across India, ensuring that compensation remains compensatory rather than speculative or punitive.',
        hi: 'यह फैसला पूरे भारत के उपभोक्ता आयोगों के लिए सख्त दिशानिर्देश तय करता है कि मुआवजा वास्तविक नुकसान की भरपाई होना चाहिए, न कि कोई मनमानी या दंडात्मक रकम।',
      },
    },
  },

  {
    slug: 'shreya-singhal',
    title: {
      en: 'Shreya Singhal v. Union of India',
      hi: 'श्रेया सिंघल बनाम भारत संघ',
    },
    tag: {
      en: 'Article 19(1)(a) · Digital Free Speech',
      hi: 'अनुच्छेद 19(1)(a) · डिजिटल अभिव्यक्ति की स्वतंत्रता',
    },
    categoryTag: 'IT Act 66A',
    genre: 'cyber',
    theme: 'cyber-neon',
    court: 'Supreme Court of India',
    year: 2015,
    readTime: {
      en: '4 min read',
      hi: '4 मिनट',
    },
    matchRate: 97,
    maturityRating: 'U/A 13+',
    rank: 4,
    bannerImage: '/images/cases/shreya-singhal.jpg',
    blurb: {
      en: 'Two girls arrested for a Facebook post. A 21-year-old law student strikes down the dreaded Section 66A.',
      hi: 'फेसबुक पोस्ट के लिए दो लड़कियों की गिरफ्तारी। 21 साल की लॉ स्टूडेंट ने आईटी एक्ट की धारा 66A को खत्म कराया।',
    },
    citation: 'Shreya Singhal v. Union of India, AIR 2015 SC 1523, (2015) 5 SCC 1',
    judgmentUrl: 'https://indiankanoon.org/doc/110813550/',
    watermark: '§66A',
    featuredHeroHook: {
      en: 'Arrested for a Facebook like. The law student who saved online free speech.',
      hi: 'फेसबुक लाइक के लिए गिरफ्तारी। लॉ स्टूडेंट जिसने इंटरनेट पर अभिव्यक्ति की आजादी बचाई।',
    },
    featuredHeroDesc: {
      en: 'When Maharashtra police arrested two college girls for questioning a city shutdown on Facebook, 21-year-old law student Shreya Singhal filed a PIL. The Supreme Court struck down Section 66A of the IT Act in its entirety, cementing digital free speech in India.',
      hi: 'जब महाराष्ट्र पुलिस ने फेसबुक पर सवाल उठाने पर दो कॉलेज छात्राओं को गिरफ्तार किया, तो 21 वर्षीय कानून की छात्रा श्रेया सिंघल ने सुप्रीम कोर्ट में जनहित याचिका दायर की। सुप्रीम कोर्ट ने धारा 66A को पूरी तरह असंवैधानिक घोषित कर रद्द कर दिया।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · THE CRACKDOWN',
          hi: 'एपिसोड 01 · पुलिसिया कार्रवाई',
        },
        headline: {
          en: 'Arrested for a Facebook post.',
          hi: 'फेसबुक पोस्ट के लिए गिरफ्तारी।',
        },
        body: {
          en: 'November 2012, Palghar, Maharashtra. 21-year-old Shaheen Dhada posted a status on Facebook questioning the complete shutdown of Mumbai following a political leader’s demise. Her friend Rinu Srinivasan merely "liked" it.\n\nWithin hours, both were arrested under Section 66A of the IT Act.',
          hi: 'नवंबर 2012, पालघर, महाराष्ट्र। 21 वर्षीय शाहीन ढाडा ने एक राजनेता के निधन पर मुंबई बंद को लेकर फेसबुक पर एक सवाल उठाया। उनकी सहेली रिनू श्रीनिवासन ने उस पोस्ट को केवल "लाइक" किया था।\n\nकुछ ही घंटों में दोनों को आईटी एक्ट की धारा 66A के तहत गिरफ्तार कर लिया गया।',
        },
        photoExhibitSrc: '/images/cases/shreya-singhal.jpg',
        photoExhibitCaption: {
          en: 'Digital Constitution & Cyber Law Landmark: Section 66A IT Act struck down (2015).',
          hi: 'डिजिटल संविधान व साइबर कानून की नजीर: आईटी एक्ट धारा 66A रद्द (2015)।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य पात्र',
        },
        headline: {
          en: 'The Student, the Arrested Girls, and the Apex Court.',
          hi: 'लॉ स्टूडेंट, गिरफ्तार छात्राएं और सर्वोच्च न्यायालय।',
        },
        body: {
          en: 'Meet the people behind the landmark battle for digital free expression.',
          hi: 'जानिए उन लोगों को जिन्होंने इंटरनेट पर बोलने की आजादी के लिए यह ऐतिहासिक लड़ाई लड़ी।',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'SUPREME COURT PIL WRIT REGISTRY',
          date: 'NOVEMBER 2012 · NEW DELHI',
          headline: {
            en: 'WRIT PETITION (CRL.) NO. 167/2012: SHREYA SINGHAL V. UNION OF INDIA',
            hi: 'रिट याचिका (आपराधिक) सं. 167/2012: श्रेया सिंघल बनाम भारत संघ',
          },
          snippet: {
            en: 'Petition filed under Article 32: 21-year-old Delhi University law student Shreya Singhal moves Supreme Court challenging the constitutional validity of Section 66A, arguing it creates an unbearable chilling effect on digital freedom of speech.',
            hi: 'अनुच्छेद 32 के तहत दायर याचिका: 21 वर्षीय लॉ छात्रा श्रेया सिंघल ने धारा 66A की संवैधानिक वैधता को चुनौती देते हुए तर्क दिया कि यह कानून ऑनलाइन बोलने की आजादी पर एक भयानक डर पैदा करता है।',
          },
          highlightedPhrase: {
            en: 'challenging constitutional validity of Section 66A, arguing it creates a chilling effect on speech',
            hi: 'धारा 66A की संवैधानिक वैधता को चुनौती देते हुए तर्क दिया कि यह बोलने की आजादी पर डर पैदा करता है',
          },
          exhibitNumber: 'PIL WRIT #167/2012',
          caption: {
            en: 'Original Article 32 Public Interest Litigation writ petition document.',
            hi: 'सुप्रीम कोर्ट में दायर मूल जनहित याचिका का पुरालेख।',
          },
        },
        characters: [
          {
            name: { en: 'Shreya Singhal', hi: 'श्रेया सिंघल' },
            role: { en: 'Petitioner (Law Student)', hi: 'याचिकाकर्ता (लॉ स्टूडेंट)' },
            tag: { en: '21-Year-Old Crusader', hi: '21 वर्षीय कानून छात्रा' },
            description: {
              en: 'A 21-year-old law student who read about the arrests and filed a public interest writ petition under Article 32.',
              hi: '21 वर्षीय कानून की छात्रा जिन्होंने गिरफ्तारी की खबर पढ़कर सीधे सुप्रीम कोर्ट में जनहित याचिका दायर कर दी।',
            },
            badgeEmoji: '⚖️',
          },
          {
            name: { en: 'Shaheen & Rinu', hi: 'शाहीन और रिनू' },
            role: { en: 'Arrested Students', hi: 'गिरफ्तार छात्राएं' },
            tag: { en: 'Palghar Residents', hi: 'पालघर निवासी' },
            description: {
              en: 'Targeted for exercising peaceful speech on social media.',
              hi: 'सोशल मीडिया पर अपने विचार रखने के लिए पुलिस द्वारा गिरफ्तार की गईं।',
            },
            badgeEmoji: '📱',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'INCIDENT',
        eyebrow: {
          en: 'EPISODE 03 · DRACONIAN LAW',
          hi: 'एपिसोड 03 · काला कानून',
        },
        headline: {
          en: 'What made Section 66A so dangerous?',
          hi: 'धारा 66A इतनी खतरनाक क्यों थी?',
        },
        body: {
          en: 'Section 66A criminalized sending any message via computer or phone that was "grossly offensive", "annoying", or "inconvenient", punishable with up to 3 years in prison.\n\nBecause terms like "offensive" were never defined, police across India used it to arrest cartoonists, activists, journalists, and ordinary citizens for criticizing politicians.',
          hi: 'धारा 66A के तहत कंप्यूटर या फोन से ऐसा कोई भी संदेश भेजना अपराध था जो "अत्यंत आपत्तिजनक", "परेशान करने वाला" या "असुविधाजनक" हो, जिसकी सजा 3 साल तक की जेल थी।\n\nचूंकि "आपत्तिजनक" शब्द की कोई परिभाषा नहीं थी, इसलिए पूरे देश की पुलिस इसका इस्तेमाल नेताओं की आलोचना करने वाले कार्टूनिस्टों, पत्रकारों और आम नागरिकों को जेल भेजने के लिए करने लगी।',
        },
        evidence: {
          archiveType: 'police_record',
          masthead: 'PALGHAR POLICE STATION CRIME LOG',
          date: '18 NOVEMBER 2012 · 22:30 HRS',
          headline: {
            en: 'FIR NO. 142/2012: REGISTERED UNDER SECTION 66A FOR "OFFENSIVE" SOCIAL POST',
            hi: 'प्राथमिकी सं. 142/2012: आपत्तिजनक पोस्ट के लिए धारा 66A में मामला दर्ज',
          },
          snippet: {
            en: 'Station House Officer booked two college students under Sec 66A IT Act: "Sending information of grossly offensive character." Accused were taken into custody late night following political party complaints.',
            hi: 'थाना प्रभारी ने धारा 66A के तहत दो छात्राओं पर केस दर्ज किया: "अत्यंत आपत्तिजनक संदेश भेजना।" राजनीतिक दल की शिकायत के बाद देर रात छात्राओं को हिरासत में लिया गया।',
          },
          highlightedPhrase: {
            en: 'booked two college students under Sec 66A IT Act: Sending information of grossly offensive character',
            hi: 'धारा 66A के तहत दो छात्राओं पर केस दर्ज किया: अत्यंत आपत्तिजनक संदेश भेजना',
          },
          exhibitNumber: 'EXHIBIT A-1 · POLICE FIR',
          caption: {
            en: 'Certified copy of the Palghar police FIR sheet that sparked nationwide outrage.',
            hi: 'पालघर पुलिस थाने की एफआईआर प्रति जिसने देश भर में आक्रोश पैदा किया।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 04 · EDITORIAL & PRESS CAMPAIGN',
          hi: 'एपिसोड 04 · मीडिया और जनता का विरोध',
        },
        headline: {
          en: 'The chilling effect on Indian democracy.',
          hi: 'लोकतंत्र पर मंडराता डर का साया।',
        },
        body: {
          en: 'Citizens stopped posting opinions online out of fear of arrest. The vagueness of the section created an intolerable "chilling effect" on free speech.',
          hi: 'गिरफ्तारी के डर से नागरिकों ने इंटरनेट पर अपनी राय रखना बंद कर दिया। इस कानून की अस्पष्टता ने स्वतंत्र अभिव्यक्ति पर एक गहरा डर (Chilling Effect) पैदा कर दिया।',
        },
        evidence: {
          archiveType: 'newspaper',
          masthead: 'THE INDIAN EXPRESS · EDITORIAL',
          date: '24 MARCH 2015 · NEW DELHI',
          headline: {
            en: 'HISTORIC BLOW FOR FREE SPEECH: SUPREME COURT STRIKES DOWN DREADED SECTION 66A',
            hi: 'अभिव्यक्ति की आजादी की ऐतिहासिक जीत: सुप्रीम कोर्ट ने धारा 66A को किया खत्म',
          },
          snippet: {
            en: 'Supreme Court bench holds Section 66A unconstitutional in its entirety. Justice Nariman observes: "The section is cast so widely that it criminalizes innocent discussion and legitimate advocacy."',
            hi: 'सुप्रीम कोर्ट ने धारा 66A को पूरी तरह असंवैधानिक घोषित किया। न्यायमूर्ति नरीमन ने कहा: "यह कानून इतना व्यापक और अस्पष्ट है कि यह निर्दोष चर्चा और विचार विमर्श को भी अपराध बना देता है।"',
          },
          highlightedPhrase: {
            en: 'The section is cast so widely that it criminalizes innocent discussion and legitimate advocacy',
            hi: 'यह कानून इतना व्यापक है कि यह निर्दोष चर्चा और विचार विमर्श को भी अपराध बना देता है',
          },
          exhibitNumber: 'EXHIBIT B-2 · EDITORIAL CLIP',
          caption: {
            en: 'Indian Express front-page banner reporting the striking down of Section 66A.',
            hi: 'धारा 66A रद्द होने की ऐतिहासिक खबर इंडियन एक्सप्रेस के मुख्य पृष्ठ पर।',
          },
        },
      },
      {
        id: 'panel-5',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 05 · CONSTITUTIONAL ARGUMENTS',
          hi: 'एपिसोड 05 · संवैधानिक बहस',
        },
        headline: {
          en: 'Discussion vs. Advocacy vs. Incitement.',
          hi: 'चर्चा बनाम समर्थन बनाम उकसावा।',
        },
        body: {
          en: 'Senior Advocate Harish Salve and Soli Sorabjee argued for the petitioners, while the Union of India defended the law as necessary for cyberspace regulation.',
          hi: 'याचिकाकर्ताओं की ओर से वरिष्ठ वकील हरीश साल्वे और सोली सोराबजी ने बहस की, जबकि केंद्र सरकार ने इंटरनेट पर नियंत्रण के लिए कानून का बचाव किया।',
        },
        evidence: {
          archiveType: 'court_decree',
          masthead: 'SUPREME COURT COURTROOM NO. 3',
          date: 'JANUARY 2015',
          headline: {
            en: 'ARGUMENTS: ARTICLE 19(1)(a) SPEECH VS ARTICLE 19(2) REASONABLE RESTRICTIONS',
            hi: 'बहस: अनुच्छेद 19(1)(a) बोलने की आजादी बनाम 19(2) के उचित प्रतिबंध',
          },
          snippet: {
            en: 'Counsel argued: "What is offensive to one person may be art or truth to another. A law that punishes speech simply because it is annoying does not fall under any head of Article 19(2) like public order or state security."',
            hi: 'वकीलों की दलील: "जो एक के लिए आपत्तिजनक है, वह दूसरे के लिए कला या सच हो सकता है। केवल परेशान करने वाले भाषण को अपराध बनाना संविधान के अनुच्छेद 19(2) के किसी भी दायरे में नहीं आता।"',
          },
          highlightedPhrase: {
            en: 'What is offensive to one person may be truth to another. Annoyance is not in Article 19(2)',
            hi: 'जो एक के लिए आपत्तिजनक है, वह दूसरे के लिए सच हो सकता है। परेशानी अनुच्छेद 19(2) में नहीं आती',
          },
          exhibitNumber: 'EXHIBIT C-1 · SC ARGUMENTS',
          caption: {
            en: 'Supreme Court hearing transcript on the doctrine of vagueness and overbreadth.',
            hi: 'कानून की अस्पष्टता और अत्यधिक विस्तार पर सुप्रीम कोर्ट की सुनवाई का विवरण।',
          },
        },
        prosecutionArgs: {
          party: { en: 'Union of India (Government)', hi: 'भारत संघ (केंद्र सरकार)' },
          claim: {
            en: 'The internet is vast and dangerous. Section 66A is necessary to prevent cyberbullying, defamation, and incitement.',
            hi: 'इंटरनेट बहुत बड़ा और खतरनाक माध्यम है। साइबर बुलिंग और मानहानि रोकने के लिए धारा 66A जरूरी है।',
          },
          statute: 'Article 19(2) · Reasonable Restrictions',
          keyPoint: {
            en: 'The government promised the court that the section would be administered with executive safeguards and not abused.',
            hi: 'सरकार ने अदालत को आश्वासन दिया कि कानून का दुरुपयोग नहीं होगा और सख्त प्रशासनिक दिशानिर्देश लागू किए जाएंगे।',
          },
        },
        defenceArgs: {
          party: { en: 'Shreya Singhal (Petitioners)', hi: 'श्रेया सिंघल (याचिकाकर्ता)' },
          claim: {
            en: 'Section 66A is unconstitutionally vague and overbroad, violating Article 19(1)(a).',
            hi: 'धारा 66A असंवैधानिक रूप से अस्पष्ट और अत्यधिक व्यापक है, जो अनुच्छेद 19(1)(a) का उल्लंघन करती है।',
          },
          statute: 'Article 19(1)(a) · Freedom of Speech',
          keyPoint: {
            en: 'A vague law cannot be saved by assurances of good administration. It creates a chilling effect where citizens self-censor.',
            hi: 'सरकार के वादों से काले कानून को बचाया नहीं जा सकता। यह नागरिकों में डर पैदा करता है जिससे वे खुद चुप रहने लगते हैं।',
          },
        },
        tappableTerms: [
          {
            id: 'chilling-effect',
            term: { en: 'Chilling Effect', hi: 'चिलिंग इफ़ेक्ट (भय का प्रभाव)' },
            code: 'Constitutional Doctrine',
            definition: {
              en: 'A doctrine where vague or overly broad laws discourage citizens from exercising their legitimate constitutional rights out of fear of prosecution.',
              hi: 'एक सिद्धांत जिसके तहत अस्पष्ट कानून नागरिकों को कानूनी कार्रवाई के डर से अपने संवैधानिक अधिकारों का उपयोग करने से रोकते हैं।',
            },
          },
        ],
      },
      {
        id: 'panel-6',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 06 · YOU ARE THE JUDGE',
          hi: 'एपिसोड 06 · आप हैं जज',
        },
        headline: {
          en: 'Strike it down or read it down with safeguards?',
          hi: 'कानून को पूरी तरह रद्द करें या सुरक्षा नियमों के साथ रखें?',
        },
        body: {
          en: 'If you were on the Supreme Court bench, would you strike down Section 66A entirely, or allow the government to fix its vague wording with guidelines?',
          hi: 'यदि आप सुप्रीम कोर्ट की बेंच में होते, तो क्या धारा 66A को पूरी तरह खत्म कर देते, या सरकार को दिशानिर्देशों के साथ सुधारने का मौका देते?',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'SUPREME COURT CONSTITUTION BENCH',
          date: 'MARCH 2015',
          headline: {
            en: 'JUDICIAL TEST: CAN EXECUTIVE ASSURANCES SAVE A VAGUE CRIMINAL STATUTE?',
            hi: 'न्यायिक सवाल: क्या सरकारी आश्वासन किसी अस्पष्ट आपराधिक कानून को बचा सकते हैं?',
          },
          snippet: {
            en: 'Justices Chelameswar and Nariman noted: "Governments may come and go, but Section 66A remains on the statute book. An unconstitutional sword hanging over citizens cannot be tolerated on mere executive promises."',
            hi: 'न्यायमूर्ति चेलमेश्वर और नरीमन की टिप्पणी: "सरकारें आएंगी और जाएंगी, लेकिन धारा 66A कानून की किताब में बनी रहेगी। नागरिकों के सिर पर लटकती असंवैधानिक तलवार को केवल सरकारी वादों पर नहीं छोड़ा जा सकता।"',
          },
          highlightedPhrase: {
            en: 'An unconstitutional sword hanging over citizens cannot be tolerated on mere executive promises',
            hi: 'नागरिकों के सिर पर लटकती असंवैधानिक तलवार को केवल सरकारी वादों पर नहीं छोड़ा जा सकता',
          },
          exhibitNumber: 'JUDICIAL DOSSIER · ART 19',
          caption: {
            en: 'Supreme Court deliberation note on the Doctrine of Overbreadth.',
            hi: 'ओवरब्रेड्थ (अत्यधिक विस्तार) के सिद्धांत पर सुप्रीम कोर्ट का विचारणीय दस्तावेज।',
          },
        },
        judgeDecision: {
          question: {
            en: 'Should Section 66A of the IT Act be struck down entirely as unconstitutional?',
            hi: 'क्या आईटी एक्ट की धारा 66A को पूरी तरह असंवैधानिक घोषित कर रद्द किया जाना चाहिए?',
          },
          subtext: {
            en: 'Consider whether the State can criminalize speech that merely "annoys" or "offends" without incitement to violence.',
            hi: 'विचार करें कि क्या सरकार बिना किसी हिंसा के उकसावे के केवल "आपत्तिजनक" लगने वाली बात पर जेल भेज सकती है।',
          },
          options: [
            {
              id: 'read-down',
              title: {
                en: 'Read Down with Strict Guidelines',
                hi: 'सख्त दिशानिर्देशों के साथ लागू रहने दें',
              },
              reason: {
                en: 'Cyberstalking and online abuse require strong statutory tools. The court could narrow the scope instead of voiding it.',
                hi: 'ऑनलाइन उत्पीड़न रोकने के लिए कड़े कानून की जरूरत है। अदालत इसे रद्द करने के बजाय सीमित कर सकती थी।',
              },
              simulatedVotesPercent: 18,
              isActualVerdict: false,
            },
            {
              id: 'strike-down',
              title: {
                en: 'Strike Down Entirely under Article 19(1)(a)',
                hi: 'अनुच्छेद 19(1)(a) के तहत पूरी तरह रद्द करें',
              },
              reason: {
                en: 'The law is hopelessly vague and overbroad. Mere annoyance is not a ground under Article 19(2). It must go.',
                hi: 'कानून पूरी तरह अस्पष्ट और मनमाना है। केवल परेशानी अनुच्छेद 19(2) के तहत प्रतिबंध का आधार नहीं हो सकती।',
              },
              simulatedVotesPercent: 82,
              isActualVerdict: true,
            },
          ],
          judicialRationale: {
            en: 'The Supreme Court struck down Section 66A in its entirety, establishing that speech can only be restricted if it crosses the line from advocacy to incitement of violence.',
            hi: 'सुप्रीम कोर्ट ने धारा 66A को पूरी तरह से रद्द कर दिया और फैसला दिया कि भाषण पर तभी रोक लगाई जा सकती है जब वह हिंसा भड़काने की सीमा पार कर जाए।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · THE LANDMARK JUDGMENT',
          hi: 'एपिसोड 07 · ऐतिहासिक फैसला',
        },
        headline: {
          en: 'Section 66A Struck Down in Its Entirety.',
          hi: 'धारा 66A पूरी तरह से असंवैधानिक और रद्द।',
        },
        stamp: {
          en: 'STRUCK DOWN · UNCONSTITUTIONAL',
          hi: 'रद्द · असंवैधानिक',
        },
        body: {
          en: 'On 24 March 2015, Justices J. Chelameswar and Rohinton Fali Nariman delivered the historic 120-page judgment striking down Section 66A in its entirety.\n\nJustice Nariman drew the crucial distinction between Discussion, Advocacy, and Incitement: free speech only loses constitutional protection when it reaches the clear threshold of **incitement**.',
          hi: '24 मार्च 2015 को, न्यायमूर्ति जे. चेलमेश्वर और रोहिंटन फली नरीमन ने धारा 66A को पूरी तरह से रद्द करते हुए 120 पन्नों का ऐतिहासिक फैसला सुनाया।\n\nन्यायमूर्ति नरीमन ने चर्चा, समर्थन और उकसावे के बीच महत्वपूर्ण अंतर स्पष्ट किया: अभिव्यक्ति की स्वतंत्रता का संरक्षण तभी समाप्त होता है जब वह सीधे तौर पर **हिंसा भड़काने** तक पहुंच जाए।',
        },
        evidence: {
          archiveType: 'verdict_decree',
          masthead: 'SUPREME COURT OF INDIA (JUSTICE R.F. NARIMAN)',
          date: '24 MARCH 2015',
          headline: {
            en: 'LANDMARK DECREE: (2015) 5 SCC 1 · DIGITAL FREE EXPRESSION PROTECTED',
            hi: 'ऐतिहासिक डिक्री: (2015) 5 SCC 1 · डिजिटल अभिव्यक्ति की आजादी सुरक्षित',
          },
          snippet: {
            en: 'HELD: Section 66A is unconstitutional and struck down in its entirety. It is not saved by Article 19(2). Every citizen has the fundamental right to discuss, advocate, and dissent in digital cyberspace.',
            hi: 'फैसला: धारा 66A पूरी तरह असंवैधानिक है और इसे निरस्त किया जाता है। प्रत्येक नागरिक को डिजिटल मंचों पर चर्चा करने, विचार रखने और असहमति जताने का मौलिक अधिकार है।',
          },
          highlightedPhrase: {
            en: 'Section 66A is unconstitutional and struck down in its entirety. It is not saved by Article 19(2)',
            hi: 'धारा 66A पूरी तरह असंवैधानिक है और इसे निरस्त किया जाता है।',
          },
          exhibitNumber: 'APEX DECREE · (2015) 5 SCC 1',
          caption: {
            en: 'Certified Supreme Court judgment decree in Shreya Singhal v. Union of India.',
            hi: 'श्रेया सिंघल बनाम भारत संघ में सुप्रीम कोर्ट की प्रमाणित ऐतिहासिक डिक्री।',
          },
        },
        citationFooter: '(2015) 5 SCC 1 · Supreme Court of India',
        judgmentUrl: 'https://indiankanoon.org/doc/110813550/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India · 2015',
        hi: 'सुप्रीम कोर्ट ऑफ इंडिया · 2015',
      },
      facts: {
        en: 'Two girls were arrested in Palghar, Maharashtra under Section 66A of the IT Act for a Facebook post criticizing the shutdown of Mumbai following Bal Thackeray’s death. Shreya Singhal, a law student, filed a PIL under Article 32 challenging Section 66A as unconstitutional and violative of Article 19(1)(a).',
        hi: 'बाल ठाकरे के निधन पर मुंबई बंद को लेकर फेसबुक पर सवाल उठाने के लिए महाराष्ट्र के पालघर में दो छात्राओं को धारा 66A के तहत गिरफ्तार किया गया। कानून की छात्रा श्रेया सिंघल ने धारा 66A को अनुच्छेद 19(1)(a) का उल्लंघन बताते हुए सुप्रीम कोर्ट में जनहित याचिका दायर की।',
      },
      issues: {
        en: [
          'Whether Section 66A of the Information Technology Act violates the fundamental right to freedom of speech under Article 19(1)(a)?',
          'Whether the restrictions imposed by Section 66A fall within the reasonable restrictions permissible under Article 19(2)?',
          'Whether Section 66A suffers from the vices of vagueness and overbreadth?',
        ],
        hi: [
          'क्या आईटी एक्ट की धारा 66A अनुच्छेद 19(1)(a) के तहत बोलने की आजादी के मौलिक अधिकार का उल्लंघन करती है?',
          'क्या धारा 66A के प्रतिबंध अनुच्छेद 19(2) के तहत अनुमति प्राप्त उचित प्रतिबंधों के दायरे में आते हैं?',
          'क्या धारा 66A अस्पष्टता और अत्यधिक विस्तार (Vagueness & Overbreadth) के दोष से ग्रसित है?',
        ],
      },
      chargesApplied: ['Information Technology Act § 66A (Punishment for sending offensive messages)'],
      held: {
        en: 'The Supreme Court struck down Section 66A in its entirety as unconstitutional. The court held it was vague, overbroad, and not saved by Article 19(2).',
        hi: 'सुप्रीम कोर्ट ने धारा 66A को पूरी तरह असंवैधानिक घोषित कर निरस्त कर दिया। अदालत ने माना कि यह अस्पष्ट और अत्यधिक व्यापक थी तथा अनुच्छेद 19(2) के तहत मान्य नहीं थी।',
      },
      reasoning: {
        en: 'Justice Rohinton Nariman distinguished between Discussion, Advocacy, and Incitement. The court held that speech can only be curtailed when it reaches the level of incitement. Mere "annoyance" or "inconvenience" cannot be grounds to criminalize speech in a democracy.',
        hi: 'न्यायमूर्ति रोहिंटन नरीमन ने चर्चा, समर्थन और उकसावे के बीच अंतर स्पष्ट किया। अदालत ने कहा कि भाषण पर केवल तभी रोक लगाई जा सकती है जब वह हिंसा भड़काने की सीमा तक पहुंचे। केवल "परेशानी" या "असुविधा" लोकतंत्र में अपराध का आधार नहीं हो सकती।',
      },
      whyItMatters: {
        en: 'This is the Magna Carta of digital free speech in India. It established that online expression enjoys the same constitutional protection as print or spoken words, preventing arbitrary police crackdowns on internet dissent.',
        hi: 'यह भारत में डिजिटल बोलने की आजादी का सबसे बड़ा चार्टर है। इसने स्थापित किया कि ऑनलाइन अभिव्यक्ति को भी अखबारों और भाषण के समान पूर्ण संवैधानिक सुरक्षा प्राप्त है।',
      },
    },
  },

  {
    slug: 'm-c-mehta',
    title: {
      en: 'M.C. Mehta v. Union of India',
      hi: 'एम.सी. मेहता बनाम भारत संघ',
    },
    tag: {
      en: 'Tort Law · Absolute Liability Doctrine',
      hi: 'टॉर्ट कानून · पूर्ण दायित्व का सिद्धांत',
    },
    categoryTag: 'Oleum Gas Leak',
    genre: 'tort',
    theme: 'corporate-luxury',
    court: 'Supreme Court of India',
    year: 1987,
    readTime: {
      en: '4 min read',
      hi: '4 मिनट',
    },
    matchRate: 96,
    maturityRating: 'U/A 16+',
    rank: 5,
    bannerImage: '/images/cases/m-c-mehta.jpg',
    blurb: {
      en: 'A toxic gas leak in Old Delhi. The Supreme Court creates the revolutionary Doctrine of Absolute Liability.',
      hi: 'पुरानी दिल्ली में जहरीली गैस का रिसाव। सुप्रीम कोर्ट ने रचा पूर्ण दायित्व (Absolute Liability) का क्रांतिकारी सिद्धांत।',
    },
    citation: 'M.C. Mehta v. Union of India (Oleum Gas Leak Case), AIR 1987 SC 1086, (1987) 1 SCC 395',
    judgmentUrl: 'https://indiankanoon.org/doc/1486949/',
    watermark: 'ABSOLUTE',
    featuredHeroHook: {
      en: 'Toxic gas over Old Delhi. The birth of Absolute Liability.',
      hi: 'पुरानी दिल्ली पर जहरीली गैस का साया। पूर्ण दायित्व सिद्धांत का जन्म।',
    },
    featuredHeroDesc: {
      en: 'Just one year after the Bhopal Gas Tragedy, an Oleum gas leak from a chemical plant in Delhi struck the capital. Chief Justice P.N. Bhagwati discarded century-old British rules to invent the "Absolute Liability" doctrine — making hazardous industries 100% liable with zero exceptions.',
      hi: 'भोपाल गैस त्रासदी के ठीक एक साल बाद दिल्ली में ओलियम गैस का रिसाव हुआ। चीफ जस्टिस पी.एन. भगवती ने 100 साल पुराने ब्रिटिश कानूनों को दरकिनार करते हुए "पूर्ण दायित्व" का सिद्धांत बनाया — खतरनाक उद्योगों को बिना किसी अपवाद के 100% जिम्मेदार ठहराया।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · THE DISASTER',
          hi: 'एपिसोड 01 · दिल्ली में गैस रिसाव',
        },
        headline: {
          en: 'A white toxic cloud blankets Delhi.',
          hi: 'दिल्ली पर छाया सफेद जहरीला धुआं।',
        },
        body: {
          en: '4 December 1985, 10:30 AM. Exactly one year after the Bhopal disaster, an Oleum gas storage tank at Shriram Foods & Fertilizers in West Delhi ruptured. A thick, suffocating cloud of white fumes swept across Karampura, Kirti Nagar, and the Tis Hazari Court complex.\n\nHundreds were hospitalized; Tis Hazari advocate Charanjit Khatra died from inhalation.',
          hi: '4 दिसंबर 1985, सुबह 10:30 बजे। भोपाल त्रासदी के ठीक एक साल बाद पश्चिमी दिल्ली स्थित श्रीराम फर्टिलाइजर्स का ओलियम गैस टैंक फट गया। जहरीला सफेद धुआं करमपुरा, कीर्ति नगर और तीस हजारी कोर्ट तक फैल गया।\n\nसैकड़ों लोग अस्पताल पहुंचे और तीस हजारी के वकील चरणजीत खटरा की गैस से मौत हो गई।',
        },
        photoExhibitSrc: '/images/cases/m-c-mehta.jpg',
        photoExhibitCaption: {
          en: 'Archival visual: Toxic Oleum gas cloud over West Delhi industrial zone (December 1985).',
          hi: 'पश्चिमी दिल्ली में ओलियम गैस रिसाव का दृश्य (दिसंबर 1985)।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य पात्र',
        },
        headline: {
          en: 'The Green Crusader vs. The Industrial Titan.',
          hi: 'पर्यावरण रक्षक वकील बनाम औद्योगिक समूह।',
        },
        body: {
          en: 'The historic clash between citizens’ right to clean life and heavy industrial enterprise.',
          hi: 'नागरिकों के जीवन के अधिकार और भारी उद्योग के बीच ऐतिहासिक टकराव।',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'SUPREME COURT ARTICLE 32 WRIT PETITION',
          date: 'DECEMBER 1985 · NEW DELHI',
          headline: {
            en: 'WRIT PETITION (CIVIL) NO. 12739/1985: M.C. MEHTA V. UNION OF INDIA',
            hi: 'रिट याचिका (सिविल) सं. 12739/1985: एम.सी. मेहता बनाम भारत संघ',
          },
          snippet: {
            en: 'Environmental advocate M.C. Mehta moves Supreme Court under Article 32 seeking immediate shutdown and relocation of hazardous chemical units situated in densely populated residential areas of Delhi.',
            hi: 'पर्यावरण वकील एम.सी. मेहता ने दिल्ली के घनी आबादी वाले इलाकों में चल रहे खतरनाक रासायनिक संयंत्रों को तुरंत बंद करने और हटाने की मांग करते हुए सुप्रीम कोर्ट में याचिका दायर की।',
          },
          highlightedPhrase: {
            en: 'seeking immediate shutdown and relocation of hazardous chemical units in populated areas',
            hi: 'घनी आबादी वाले इलाकों में चल रहे खतरनाक रासायनिक संयंत्रों को तुरंत बंद करने और हटाने की मांग',
          },
          exhibitNumber: 'PIL WRIT #12739/1985',
          caption: {
            en: 'Original PIL petition filed by M.C. Mehta following the Oleum gas tragedy.',
            hi: 'ओलियम गैस रिसाव के तुरंत बाद एम.सी. मेहता द्वारा दायर मूल जनहित याचिका।',
          },
        },
        characters: [
          {
            name: { en: 'M.C. Mehta', hi: 'एम.सी. मेहता' },
            role: { en: 'Petitioner (Green Lawyer)', hi: 'याचिकाकर्ता (पर्यावरण वकील)' },
            tag: { en: 'Pioneer of Indian PIL', hi: 'भारतीय जनहित याचिका के जनक' },
            description: {
              en: 'Pioneering public interest advocate who fought for decades to clean Delhi’s air and water.',
              hi: 'भारत के शीर्ष पर्यावरण वकील जिन्होंने दिल्ली के प्रदूषण और जनसुरक्षा के लिए ऐतिहासिक लड़ाइयां लड़ीं।',
            },
            badgeEmoji: '🌿',
          },
          {
            name: { en: 'CJI P.N. Bhagwati', hi: 'चीफ जस्टिस पी.एन. भगवती' },
            role: { en: 'Chief Justice of India', hi: 'भारत के मुख्य न्यायाधीश' },
            tag: { en: 'Judicial Innovator', hi: 'न्यायिक क्रांति के प्रणेता' },
            description: {
              en: 'Crafted the Absolute Liability Doctrine to protect citizens from hazardous corporate industries.',
              hi: 'जिन्होंने खतरनाक उद्योगों से जनता की रक्षा के लिए पूर्ण दायित्व का ऐतिहासिक सिद्धांत बनाया।',
            },
            badgeEmoji: '👨‍⚖️',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'INCIDENT',
        eyebrow: {
          en: 'EPISODE 03 · THE COLLAPSE',
          hi: 'एपिसोड 03 · संयंत्र में खराबी',
        },
        headline: {
          en: 'How the storage tank failed.',
          hi: 'स्टोरेज टैंक कैसे फटा।',
        },
        body: {
          en: 'A 55-ton storage vessel carrying fuming sulphuric acid (Oleum) collapsed due to structural corrosion of the support joints. Toxic vapor was carried by winter morning winds across residential colonies.',
          hi: 'फ्यूमिंग सल्फ्यूरिक एसिड (ओलियम) से भरा 55 टन का स्टोरेज टैंक जंग लगने के कारण अचानक गिर पड़ा। सर्द हवाओं के साथ यह जहरीला धुआं आसपास की घनी कॉलोनियों में फैल गया।',
        },
        evidence: {
          archiveType: 'police_record',
          masthead: 'DELHI ADMINISTRATION EMERGENCY DISASTER LOG',
          date: '04 DECEMBER 1985 · 11:00 AM',
          headline: {
            en: 'EMERGENCY DISPATCH: MASS EVACUATION ORDERED IN WEST DELHI',
            hi: 'आपातकालीन सूचना: पश्चिमी दिल्ली में लोगों को सुरक्षित बाहर निकालने के आदेश',
          },
          snippet: {
            en: 'Police Control Room diary: Thousands fleeing homes in Karampura with burning eyes and throat spasms. Fire engines deploying water sprays to neutralize acidic vapor clouds.',
            hi: 'पुलिस कंट्रोल रूम डायरी: आंखों में जलन और सांस में तकलीफ के कारण करमपुरा से हजारों लोग भाग रहे हैं। एसिडिक धुएं को दबाने के लिए दमकल गाड़ियां पानी का छिड़काव कर रही हैं।',
          },
          highlightedPhrase: {
            en: 'Thousands fleeing homes with burning eyes and throat spasms',
            hi: 'आंखों में जलन और सांस में तकलीफ के कारण करमपुरा से हजारों लोग भाग रहे हैं',
          },
          exhibitNumber: 'EXHIBIT A-2 · POLICE LOG',
          caption: {
            en: 'Delhi Administration police emergency logbook on the morning of the leak.',
            hi: 'गैस रिसाव की सुबह दर्ज दिल्ली पुलिस कंट्रोल रूम की आपातकालीन डायरी।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 04 · SCIENTIFIC COMMITTEE REPORT',
          hi: 'एपिसोड 04 · वैज्ञानिक जांच रिपोर्ट',
        },
        headline: {
          en: 'The Flaw in British Strict Liability (Rylands v. Fletcher).',
          hi: 'पुराने ब्रिटिश कानून (Rylands v. Fletcher) की खामी।',
        },
        body: {
          en: 'Under the 1868 British rule of *Strict Liability*, companies could escape paying damages if they proved an "Act of God", "Sabotage", or "Natural use of land". CJI Bhagwati realized this old rule was totally unfit for modern chemical industries.',
          hi: '1868 के ब्रिटिश *Strict Liability* नियम के तहत कंपनियां "दैवीय आपदा (Act of God)", "षड्यंत्र" या "जमीन का सामान्य उपयोग" कहकर हर्जाने से बच निकलती थीं। चीफ जस्टिस भगवती ने समझा कि यह पुराना कानून आधुनिक रासायनिक उद्योगों के लिए बेकार है।',
        },
        evidence: {
          archiveType: 'forensic',
          masthead: 'CENTRAL POLLUTION CONTROL BOARD EXPERT REPORT',
          date: '15 DECEMBER 1985',
          headline: {
            en: 'NILAY CHOUDHURY COMMITTEE: HAZARDOUS CHEMICAL OPERATIONS IN URBAN POPULATION',
            hi: 'निलय चौधरी समिति रिपोर्ट: घनी आबादी के बीच खतरनाक रासायनिक गतिविधियां',
          },
          snippet: {
            en: 'Expert scientific committee finds: The plant was operating without safety redundancies, storing lethal quantities of Oleum adjacent to 200,000 residents. Structural maintenance failed to detect deep metal corrosion.',
            hi: 'विशेषज्ञ समिति का निष्कर्ष: संयंत्र बिना उचित सुरक्षा उपकरणों के चल रहा था, और 2 लाख लोगों के पड़ोस में घातक ओलियम गैस रखी गई थी। धातु के गहरे जंग की समय पर जांच नहीं हुई।',
          },
          highlightedPhrase: {
            en: 'operating without safety redundancies, storing lethal quantities of Oleum adjacent to 200,000 residents',
            hi: 'संयंत्र बिना उचित सुरक्षा उपकरणों के चल रहा था, और 2 लाख लोगों के पड़ोस में घातक ओलियम गैस रखी गई थी',
          },
          exhibitNumber: 'EXHIBIT B-1 · FORENSIC REPORT',
          caption: {
            en: 'Central Pollution Control Board forensic engineering inspection findings.',
            hi: 'केंद्रीय प्रदूषण नियंत्रण बोर्ड की फोरेंसिक इंजीनियरिंग जांच रिपोर्ट।',
          },
        },
      },
      {
        id: 'panel-5',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 05 · LEGAL INNOVATION',
          hi: 'एपिसोड 05 · नई कानूनी क्रांति',
        },
        headline: {
          en: 'Strict Liability vs. Absolute Liability.',
          hi: 'कड़ा दायित्व (Strict) बनाम पूर्ण दायित्व (Absolute)।',
        },
        body: {
          en: 'The factory argued it had taken all precautions known to science. The Supreme Court declared that Indian law must evolve its own principles rather than copying outdated English common law.',
          hi: 'फैक्ट्री ने दलील दी कि उसने विज्ञान के अनुसार सभी सावधानियां बरती थीं। सुप्रीम कोर्ट ने जवाब दिया कि भारतीय कानून को पुराने अंग्रेजी कानूनों की नकल करने के बजाय अपने नए सिद्धांत बनाने होंगे।',
        },
        evidence: {
          archiveType: 'newspaper',
          masthead: 'THE TIMES OF INDIA · NEW DELHI',
          date: '06 DECEMBER 1985',
          headline: {
            en: 'GAS TERROR IN CAPITAL: SUPREME COURT TAKES COGNIZANCE OF CHEMICAL THREAT',
            hi: 'राजधानी में गैस का खौफ: सुप्रीम कोर्ट ने रासायनिक खतरे का स्वतः संज्ञान लिया',
          },
          snippet: {
            en: 'Front-page coverage: Supreme Court issues stern warning that corporate enterprises manufacturing hazardous chemicals cannot endanger public life and escape financial liability.',
            hi: 'मुख्य समाचार: सुप्रीम कोर्ट ने सख्त चेतावनी दी कि खतरनाक रसायन बनाने वाली कंपनियां जनता के जीवन को खतरे में डालकर आर्थिक दायित्व से बच नहीं सकतीं।',
          },
          highlightedPhrase: {
            en: 'corporate enterprises manufacturing hazardous chemicals cannot escape financial liability',
            hi: 'खतरनाक रसायन बनाने वाली कंपनियां आर्थिक दायित्व से बच नहीं सकतीं',
          },
          exhibitNumber: 'EXHIBIT C-1 · FRONT PAGE',
          caption: {
            en: 'Times of India coverage of the Supreme Court emergency intervention.',
            hi: 'सुप्रीम कोर्ट के आपातकालीन हस्तक्षेप पर टाइम्स ऑफ इंडिया की मुख्य खबर।',
          },
        },
        prosecutionArgs: {
          party: { en: 'M.C. Mehta & Citizens', hi: 'एम.सी. मेहता व नागरिक' },
          claim: {
            en: 'An industry bringing dangerous substances into society must be 100% responsible for any escape that harms people, with NO exceptions.',
            hi: 'खतरनाक रसायनों का उपयोग करने वाले उद्योग को गैस रिसाव से होने वाले नुकसान के लिए 100% जिम्मेदार होना चाहिए, बिना किसी अपवाद के।',
          },
          statute: 'Constitution of India Article 21 · Right to Life',
          keyPoint: {
            en: 'The compensation must be punitive and proportionate to the company’s capacity to create a true deterrent.',
            hi: 'मुआवजा कंपनी की आर्थिक क्षमता के अनुपात में होना चाहिए ताकि भविष्य के लिए कड़ा सबक मिले।',
          },
        },
        defenceArgs: {
          party: { en: 'Shriram Foods & Fertilizers', hi: 'श्रीराम फर्टिलाइजर्स' },
          claim: {
            en: 'We took all reasonable precautions. An unforeseen mechanical tank rupture cannot impose infinite liability.',
            hi: 'हमने सभी जरूरी सावधानियां बरती थीं। अचानक हुए यांत्रिक टैंक फेलियर के लिए असीमित जिम्मेदारी नहीं थोपी जा सकती।',
          },
          statute: 'Rylands v. Fletcher (1868) · Common Law Rule',
          keyPoint: {
            en: 'Tort liability requires proving negligence or fault. Without fault, enterprise liability will shut down all industrial development in India.',
            hi: 'हर्जाने के लिए लापरवाही (Negligence) साबित करना जरूरी है। बिना गलती के हर्जाना लगाने से देश का औद्योगिक विकास रुक जाएगा।',
          },
        },
        tappableTerms: [
          {
            id: 'absolute-liability',
            term: { en: 'Absolute Liability', hi: 'पूर्ण दायित्व का सिद्धांत' },
            code: 'Doctrine established in M.C. Mehta (1987)',
            definition: {
              en: 'An enterprise engaged in a hazardous activity owes an absolute and non-delegable duty to the community that no harm will result. It is strictly liable with ZERO exceptions.',
              hi: 'खतरनाक उद्योग चलाने वाली कंपनी का समाज के प्रति पूर्ण और अटूट दायित्व है कि कोई नुकसान न हो। इसके तहत बिना किसी अपवाद के 100% जिम्मेदारी होती है।',
            },
          },
        ],
      },
      {
        id: 'panel-6',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 06 · YOU ARE THE CHIEF JUSTICE',
          hi: 'एपिसोड 06 · आप हैं चीफ जस्टिस',
        },
        headline: {
          en: 'Should companies pay even if they were not negligent?',
          hi: 'क्या बिना गलती साबित हुए भी कंपनी को हर्जाना देना चाहिए?',
        },
        body: {
          en: 'If a hazardous plant took every safety step prescribed by the government, but a leak still occurs, should it be held 100% liable without any defence?',
          hi: 'यदि किसी फैक्ट्री ने सरकार द्वारा तय सभी सुरक्षा नियम माने हों, फिर भी गैस लीक हो जाए, तो क्या उसे बिना किसी बचाव के 100% जिम्मेदार मानना चाहिए?',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'SUPREME COURT CONSTITUTION BENCH CHAMBER',
          date: 'DECEMBER 1986',
          headline: {
            en: 'JUDICIAL CONUNDRUM: ENGLISH COMMON LAW OR INDIGENOUS INDIAN JURISPRUDENCE?',
            hi: 'न्यायिक दुविधा: 19वीं सदी का ब्रिटिश कानून या भारत का अपना नया सिद्धांत?',
          },
          snippet: {
            en: 'CJI P.N. Bhagwati notes: "We cannot allow our judicial thinking to be constricted by reference to the law as it prevails in England. We have to evolve new principles and lay down new norms which will adequately deal with new problems."',
            hi: 'चीफ जस्टिस भगवती की टिप्पणी: "हम अपनी न्यायिक सोच को इंग्लैंड के पुराने कानूनों तक सीमित नहीं रख सकते। हमें नई समस्याओं से निपटने के लिए भारत के अपने नए सिद्धांत और मानक बनाने होंगे।"',
          },
          highlightedPhrase: {
            en: 'We have to evolve new principles and lay down new norms to deal with new problems',
            hi: 'हमें नई समस्याओं से निपटने के लिए भारत के अपने नए सिद्धांत और मानक बनाने होंगे',
          },
          exhibitNumber: 'DELIBERATION DOSSIER · CJI BHAGWATI',
          caption: {
            en: 'Chief Justice Bhagwati bench notes formulating Absolute Liability.',
            hi: 'चीफ जस्टिस भगवती के ऐतिहासिक बेंच नोट्स जिन्होंने नए कानून को जन्म दिया।',
          },
        },
        judgeDecision: {
          question: {
            en: 'Should India adopt the strict Absolute Liability doctrine with zero defences for hazardous industries?',
            hi: 'क्या भारत को खतरनाक उद्योगों के लिए बिना किसी अपवाद वाला "पूर्ण दायित्व" सिद्धांत अपनाना चाहिए?',
          },
          subtext: {
            en: 'Decide whether modern hazardous industries must bear the entire social cost of their dangerous activities.',
            hi: 'तय करें कि क्या खतरनाक उद्योगों को अपनी गतिविधियों के पूरे सामाजिक नुकसान की भरपाई खुद करनी होगी।',
          },
          options: [
            {
              id: 'strict-liability-only',
              title: {
                en: 'Keep Strict Liability with Defences (Rylands v. Fletcher)',
                hi: 'पुराना कानून रखें (दैवीय आपदा व षड्यंत्र का बचाव मिले)',
              },
              reason: {
                en: 'Absolute liability without defences will scare away chemical and industrial investments from India.',
                hi: 'बिना किसी बचाव के 100% दायित्व से देश में औद्योगिक निवेश पर बुरा असर पड़ सकता है।',
              },
              simulatedVotesPercent: 14,
              isActualVerdict: false,
            },
            {
              id: 'absolute-liability-india',
              title: {
                en: 'Create Absolute Liability (No Defences Allowed)',
                hi: 'पूर्ण दायित्व का नया सिद्धांत बनाएं (कोई अपवाद नहीं)',
              },
              reason: {
                en: 'An enterprise that profits from dangerous activities must absorb all costs of damage. Human lives are paramount.',
                hi: 'खतरनाक गतिविधियों से मुनाफा कमाने वाली कंपनी को ही नुकसान उठाना होगा। इंसानी जान से बढ़कर कुछ नहीं।',
              },
              simulatedVotesPercent: 86,
              isActualVerdict: true,
            },
          ],
          judicialRationale: {
            en: 'CJI Bhagwati established that the rule of Absolute Liability is not subject to any of the exceptions in Rylands v. Fletcher. The enterprise has a non-delegable duty to the community.',
            hi: 'चीफ जस्टिस भगवती ने फैसला दिया कि पूर्ण दायित्व में कोई अपवाद लागू नहीं होगा। समाज की सुरक्षा कंपनी का सर्वोच्च और अटूट कर्तव्य है।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · THE APEX VERDICT',
          hi: 'एपिसोड 07 · सुप्रीम कोर्ट का फैसला',
        },
        headline: {
          en: 'The Birth of Absolute Liability.',
          hi: 'पूर्ण दायित्व (Absolute Liability) सिद्धांत का जन्म।',
        },
        stamp: {
          en: 'ABSOLUTE LIABILITY ESTABLISHED',
          hi: 'पूर्ण दायित्व सिद्धांत लागू',
        },
        body: {
          en: 'Chief Justice P.N. Bhagwati delivered the unanimous 5-judge bench judgment on 20 December 1986.\n\nThe Supreme Court held that where an enterprise engages in hazardous activities, it owes an **absolute and non-delegable duty** to ensure no harm results. If damage occurs, the enterprise must pay compensation regardless of whether it took all precautions.',
          hi: '20 दिसंबर 1986 को चीफ जस्टिस पी.एन. भगवती की 5 जजों की संविधान पीठ ने सर्वसम्मत फैसला सुनाया।\n\nसुप्रीम कोर्ट ने कहा कि खतरनाक उद्योग चलाने वाले हर उद्यम का समाज के प्रति **पूर्ण और गैर-हस्तांतरणीय कर्तव्य** है। यदि कोई नुकसान होता है, तो कंपनी को हर्जाना देना ही होगा, चाहे उसने कितनी भी सावधानियां क्यों न बरती हों।',
        },
        evidence: {
          archiveType: 'verdict_decree',
          masthead: 'SUPREME COURT OF INDIA (AIR 1987 SC 1086)',
          date: '20 DECEMBER 1986',
          headline: {
            en: 'HISTORIC RATIO: ABSOLUTE LIABILITY DOCTRINE BORN IN INDIAN JURISPRUDENCE',
            hi: 'ऐतिहासिक फैसला: भारतीय कानून में पूर्ण दायित्व सिद्धांत की स्थापना',
          },
          snippet: {
            en: 'HELD: The enterprise is strictly and absolutely liable to compensate all who are affected. The measure of compensation must be correlated to the magnitude and capacity of the enterprise so it has a deterrent effect.',
            hi: 'फैसला: प्रभावित सभी लोगों को मुआवजा देना कंपनी का पूर्ण और अंतिम दायित्व है। हर्जाने की राशि कंपनी की आर्थिक क्षमता के अनुरूप होनी चाहिए ताकि कड़ा सबक मिले।',
          },
          highlightedPhrase: {
            en: 'enterprise is strictly and absolutely liable. Compensation correlated to magnitude of enterprise',
            hi: 'प्रभावित सभी लोगों को मुआवजा देना कंपनी का पूर्ण दायित्व है। हर्जाना क्षमता के अनुरूप होना चाहिए',
          },
          exhibitNumber: 'APEX DECREE · AIR 1987 SC 1086',
          caption: {
            en: 'Certified Supreme Court judgment: M.C. Mehta v. Union of India.',
            hi: 'प्रमाणित सुप्रीम कोर्ट फैसला: एम.सी. मेहता बनाम भारत संघ (ओलियम गैस केस)।',
          },
        },
        citationFooter: 'AIR 1987 SC 1086 · Supreme Court of India',
        judgmentUrl: 'https://indiankanoon.org/doc/1486949/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India · 1987',
        hi: 'सुप्रीम कोर्ट ऑफ इंडिया · 1987',
      },
      facts: {
        en: 'In December 1985, Oleum gas leaked from Shriram Foods & Fertilizer Industries in Delhi, killing an advocate and injuring hundreds. M.C. Mehta filed a PIL under Article 32. The Supreme Court addressed whether the 19th-century British Strict Liability rule applied or a new Indian doctrine was required.',
        hi: 'दिसंबर 1985 में दिल्ली स्थित श्रीराम फर्टिलाइजर्स से ओलियम गैस लीक हुई, जिसमें एक वकील की मौत हुई और सैकड़ों घायल हुए। एम.सी. मेहता ने अनुच्छेद 32 के तहत याचिका दायर की। सुप्रीम कोर्ट ने तय किया कि क्या 19वीं सदी का ब्रिटिश कानून लागू होगा या भारत का अपना नया सिद्धांत।',
      },
      issues: {
        en: [
          'What is the scope of liability of enterprises engaged in inherently hazardous and dangerous activities?',
          'Whether the exceptions under the 1868 rule of Strict Liability in Rylands v. Fletcher should apply in India?',
          'How should compensation be quantified in mass environmental tort disasters?',
        ],
        hi: [
          'खतरनाक और जानलेवा औद्योगिक गतिविधियों में शामिल कंपनियों के दायित्व का क्या दायरा है?',
          'क्या 1868 के ब्रिटिश नियम (Rylands v. Fletcher) के अपवाद भारत में लागू होने चाहिए?',
          'पर्यावरणीय आपदाओं में हर्जाने की रकम कैसे तय की जानी चाहिए?',
        ],
      },
      chargesApplied: ['Constitution of India Article 21 (Right to Life)', 'Article 32 (Constitutional Remedies)'],
      held: {
        en: 'The Supreme Court established the Doctrine of Absolute Liability. Hazardous enterprises are strictly and absolutely liable with ZERO exceptions. Compensation must be correlated to the magnitude of the enterprise.',
        hi: 'सुप्रीम कोर्ट ने पूर्ण दायित्व (Absolute Liability) के सिद्धांत की स्थापना की। खतरनाक उद्योगों पर बिना किसी अपवाद के 100% जिम्मेदारी होगी। हर्जाना कंपनी की आर्थिक क्षमता के अनुसार तय होगा।',
      },
      reasoning: {
        en: 'CJI Bhagwati ruled that Indian jurisprudence must evolve its own principles suitable for its socio-economic conditions rather than relying on 19th-century English common law. An enterprise that profits from danger must internalize all social risks.',
        hi: 'चीफ जस्टिस भगवती ने कहा कि भारतीय कानून को 19वीं सदी के अंग्रेजी कानूनों पर निर्भर रहने के बजाय अपनी जरूरतों के अनुसार नए सिद्धांत बनाने चाहिए। जो कंपनी खतरे से मुनाफा कमाती है, उसे पूरे नुकसान की भरपाई करनी होगी।',
      },
      whyItMatters: {
        en: 'This case is India’s greatest contribution to global environmental tort law. It eliminated loopholes for corporate polluters and later formed the legal basis for the Bhopal Gas settlement and National Green Tribunal jurisprudence.',
        hi: 'यह मामला वैश्विक पर्यावरण कानून में भारत का सबसे बड़ा योगदान है। इसने प्रदूषण फैलाने वाली कंपनियों के बचने के सारे रास्ते बंद कर दिए और भोपाल गैस त्रासदी के निपटारे का आधार बना।',
      },
    },
  },

  {
    slug: 'kesavananda-bharati',
    title: {
      en: 'Kesavananda Bharati v. State of Kerala',
      hi: 'केशवानंद भारती बनाम केरल राज्य',
    },
    tag: {
      en: 'Constitutional Law · Basic Structure Doctrine',
      hi: 'संवैधानिक कानून · बुनियादी ढांचे का सिद्धांत',
    },
    categoryTag: 'Basic Structure',
    genre: 'constitutional',
    theme: 'constitutional-gold',
    court: 'Supreme Court of India',
    year: 1973,
    readTime: {
      en: '6 min read',
      hi: '6 मिनट',
    },
    matchRate: 100,
    maturityRating: 'U/A 13+',
    rank: 6,
    bannerImage: '/images/cases/kesavananda-bharati.jpg',
    blurb: {
      en: 'The 68-day marathon trial by 13 Supreme Court judges that saved the Indian Constitution from tyranny.',
      hi: '13 सुप्रीम कोर्ट जजों की 68 दिन लंबी मैराथन सुनवाई जिसने भारतीय संविधान और लोकतंत्र को बचाया।',
    },
    citation: 'Kesavananda Bharati Sripadagalvaru v. State of Kerala, (1973) 4 SCC 225, AIR 1973 SC 1461',
    judgmentUrl: 'https://indiankanoon.org/doc/257876/',
    watermark: 'BASIC STRUCTURE',
    featuredHeroHook: {
      en: '13 Judges. 68 Days. The case that saved Indian democracy.',
      hi: '13 जज। 68 दिन। वह मुकदमा जिसने भारतीय लोकतंत्र को बचाया।',
    },
    featuredHeroDesc: {
      en: 'A seer from Kerala challenged land reforms. In a 703-page epic judgment delivered by the largest bench in Indian history (13 judges, 7-6 split), the Supreme Court ruled that Parliament cannot alter the "Basic Structure" of the Constitution.',
      hi: 'केरल के एक संन्यासी ने भूमि सुधार कानून को चुनौती दी। 13 जजों की सबसे बड़ी संविधान पीठ ने 7-6 के ऐतिहासिक बहुमत से फैसला दिया कि संसद संविधान के "बुनियादी ढांचे" को कभी नष्ट नहीं कर सकती।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · THE EPIC BATTLE',
          hi: 'एपिसोड 01 · सबसे बड़ा मुकदमा',
        },
        headline: {
          en: 'The trial for the soul of the Indian Constitution.',
          hi: 'संविधान की आत्मा को बचाने की लड़ाई।',
        },
        body: {
          en: '1970–1973. Prime Minister Indira Gandhi’s government passed constitutional amendments claiming unlimited power: Parliament could amend, repeal, or rewrite ANY part of the Constitution, including Fundamental Rights.\n\nOne seer and one legendary lawyer stood in their way.',
          hi: '1970–1973। तत्कालीन प्रधानमंत्री इंदिरा गांधी की सरकार ने ऐसे संविधान संशोधन पारित किए जिसके तहत संसद को असीमित शक्तियां मिल गईं: संसद मौलिक अधिकारों सहित संविधान के किसी भी हिस्से को बदल या खत्म कर सकती थी।\n\nउनके सामने खड़े हुए एक संन्यासी और भारत के सबसे महान वकील।',
        },
        photoExhibitSrc: '/images/cases/kesavananda-bharati.jpg',
        photoExhibitCaption: {
          en: 'Archival visual: The 13-Judge Grand Constitutional Bench in Courtroom No. 1 (1973).',
          hi: '13 जजों की सबसे बड़ी संविधान पीठ, कोर्ट रूम नं. 1 (1973)।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य पात्र',
        },
        headline: {
          en: 'The Monk, the Jurist, and the Iron Lady.',
          hi: 'संन्यासी, प्रखर विधिवेत्ता और प्रधानमंत्री।',
        },
        body: {
          en: 'Meet the titans whose clash in Courtroom No. 1 decided whether India would remain a democracy or become a constitutional dictatorship.',
          hi: 'जानिए उन महान शख्सियतों को जिनकी कानूनी जंग ने तय किया कि भारत एक लोकतंत्र रहेगा या तानाशाही बनेगा।',
        },
        photoExhibitSrc: '/images/cases/kesavananda_monk.jpg',
        photoExhibitCaption: {
          en: 'Swami Kesavananda Bharati Sripadagalvaru, head of Edneer Mutt, Kasaragod (1970).',
          hi: 'स्वामी केशवानंद भारती, प्रमुख एडनीर मठ, कासरगोड (1970)।',
        },
        characters: [
          {
            name: { en: 'Swami Kesavananda Bharati', hi: 'स्वामी केशवानंद भारती' },
            role: { en: 'Petitioner (Mutt Head)', hi: 'याचिकाकर्ता (मठाधीश)' },
            tag: { en: 'Edneer Mutt, Kasaragod', hi: 'एडनीर मठ, कासरगोड' },
            description: {
              en: 'Head of a 1200-year-old Hindu monastery in Kerala whose temple lands were seized by state land reforms.',
              hi: 'केरल के 1200 साल पुराने मठ के प्रमुख जिनकी जमीनों को राज्य सरकार ने अधिग्रहित कर लिया था।',
            },
            badgeEmoji: '🪔',
          },
          {
            name: { en: 'Nani Palkhivala', hi: 'नानी पालकीवाला' },
            role: { en: 'Lead Counsel for Petitioner', hi: 'मुख्य वकील (याचिकाकर्ता)' },
            tag: { en: 'Legendary Constitutional Jurist', hi: 'भारत के सबसे महान विधिवेत्ता' },
            description: {
              en: 'Argued for 68 days with breathtaking eloquence that Parliament is a creature of the Constitution, not its master.',
              hi: 'जिन्होंने 68 दिनों तक जोरदार दलील दी कि संसद संविधान की संतान है, उसकी मालिक नहीं।',
            },
            badgeEmoji: '📜',
          },
          {
            name: { en: 'H.M. Seervai', hi: 'एच.एम. सीरवाई' },
            role: { en: 'Advocate General (State)', hi: 'एडवोकेट जनरल (सरकार)' },
            tag: { en: 'Foremost Constitutional Scholar', hi: 'शीर्ष संवैधानिक विद्वान' },
            description: {
              en: 'Defended the absolute supremacy of Parliament to amend any constitutional provision.',
              hi: 'जिन्होंने संसद की असीमित संशोधन शक्ति का पुरजोर बचाव किया।',
            },
            badgeEmoji: '🏛️',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'INCIDENT',
        eyebrow: {
          en: 'EPISODE 03 · THE DISPUTE',
          hi: 'एपिसोड 03 · विवाद की शुरुआत',
        },
        headline: {
          en: 'A Kerala monastery loses its lands.',
          hi: 'केरल के मठ की जमीन का अधिग्रहण।',
        },
        body: {
          en: 'In 1970, Kerala enacted the Land Reforms Act, acquiring hundreds of acres of agricultural land belonging to Edneer Mutt. Deprived of income to run temples and schools, Swami Kesavananda Bharati approached the Supreme Court under Article 32.',
          hi: '1970 में केरल सरकार ने भूमि सुधार कानून लाकर एडनीर मठ की सैकड़ों एकड़ कृषि भूमि अधिग्रहित कर ली। मंदिर और स्कूल चलाने के संसाधन छिन जाने पर स्वामी केशवानंद भारती ने अनुच्छेद 32 के तहत सुप्रीम कोर्ट का दरवाजा खटखटाया।',
        },
        evidence: {
          archiveType: 'police_record',
          masthead: 'KERALA STATE LAND BOARD NOTIFICATION',
          date: 'FEBRUARY 1970 · TRIVANDRUM',
          headline: {
            en: 'NOTIFICATION: COMPULSORY ACQUISITION OF EDNEER MUTT MONASTERY LANDS',
            hi: 'अधिसूचना: एडनीर मठ की 1200 साल पुरानी जमीनों का अनिवार्य सरकारी अधिग्रहण',
          },
          snippet: {
            en: 'Kerala Land Reforms Act, 1969: State notifies takeover of temple lands in Kasaragod without full market compensation. Swami Kesavananda Bharati challenges vires under Articles 25, 26, and 31.',
            hi: 'केरल भूमि सुधार अधिनियम: राज्य सरकार ने कासरगोड स्थित मठ की जमीनों के अधिग्रहण की अधिसूचना जारी की। स्वामी जी ने इसे अनुच्छेद 25, 26 और 31 के तहत चुनौती दी।',
          },
          highlightedPhrase: {
            en: 'State notifies takeover of temple lands without full compensation. Challenged under Articles 25, 26 and 31',
            hi: 'मठ की जमीनों के अधिग्रहण की अधिसूचना जारी की। इसे अनुच्छेद 25, 26 और 31 के तहत चुनौती दी गई',
          },
          exhibitNumber: 'EXHIBIT A-1 · GOVT GAZETTE',
          caption: {
            en: 'Original Kerala Government land acquisition notification challenged in court.',
            hi: 'केरल सरकार की मूल भूमि अधिग्रहण राजपत्र अधिसूचना।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 04 · THE 68-DAY MARATHON',
          hi: 'एपिसोड 04 · 68 दिनों की मैराथन सुनवाई',
        },
        headline: {
          en: 'The Longest Hearing in Indian History.',
          hi: 'भारतीय इतिहास की सबसे लंबी सुनवाई।',
        },
        body: {
          en: '13 judges sat continuously from 31 October 1972 to 23 March 1973. Tens of thousands of pages of international constitutions, treatises, and colonial archives were cited in Courtroom No. 1.',
          hi: '13 जज 31 अक्टूबर 1972 से 23 मार्च 1973 तक लगातार बैठे। कोर्ट रूम नं. 1 में दुनिया भर के संविधानों, ऐतिहासिक ग्रंथों और फैसलों के हजारों पन्ने पेश किए गए।',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: 'SUPREME COURT WRIT PETITION NO. 135/1970',
          date: '21 MARCH 1970',
          headline: {
            en: 'NANI PALKHIVALA: PARLIAMENT CANNOT AMEND THE CONSTITUTION TO DESTROY ITS CREATOR',
            hi: 'नानी पालकीवाला की दलील: संसद संविधान की संतान है, वह अपने निर्माता को खत्म नहीं कर सकती',
          },
          snippet: {
            en: 'Petition drafted by Nani Palkhivala challenges 24th, 25th, and 29th Amendments: "The power to amend under Article 368 is not a power to destroy. Parliament cannot convert itself into a sovereign despot."',
            hi: 'पालकीवाला द्वारा तैयार याचिका ने 24वें, 25वें और 29वें संशोधन को चुनौती दी: "अनुच्छेद 368 के तहत संशोधन की शक्ति नष्ट करने की शक्ति नहीं है। संसद खुद को तानाशाह नहीं बना सकती।"',
          },
          highlightedPhrase: {
            en: 'The power to amend under Article 368 is not a power to destroy',
            hi: 'अनुच्छेद 368 के तहत संशोधन की शक्ति नष्ट करने की शक्ति नहीं है',
          },
          exhibitNumber: 'PETITION DOSSIER · WP 135/1970',
          caption: {
            en: 'Original petition dossier drafted by N.A. Palkhivala.',
            hi: 'नानी पालकीवाला द्वारा तैयार की गई ऐतिहासिक याचिका का मुख्य दस्तावेज।',
          },
        },
      },
      {
        id: 'panel-5',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 05 · COURTROOM CLASH',
          hi: 'एपिसोड 05 · ऐतिहासिक टकराव',
        },
        headline: {
          en: 'Is Parliament Supreme or is the Constitution Supreme?',
          hi: 'क्या संसद सर्वोच्च है या संविधान सर्वोच्च है?',
        },
        body: {
          en: 'The core battle was over the word "Amend" in Article 368. Did "Amend" mean any change whatsoever, or did it mean preserving the core identity while altering details?',
          hi: 'मुख्य विवाद अनुच्छेद 368 में लिखे शब्द "संशोधन (Amend)" पर था। क्या संशोधन का अर्थ संविधान को पूरी तरह बदलना है, या मूल पहचान को बनाए रखते हुए सुधार करना?',
        },
        evidence: {
          archiveType: 'newspaper',
          masthead: 'THE HINDU · NATIONAL EDITION',
          date: '25 APRIL 1973',
          headline: {
            en: 'SUPREME COURT CURBS PARLIAMENTARY SUPREMACY: BASIC STRUCTURE CANNOT BE ALTERED',
            hi: 'सुप्रीम कोर्ट ने संसद की असीमित शक्ति पर लगाई रोक: बुनियादी ढांचा नहीं बदला जा सकता',
          },
          snippet: {
            en: 'Special Dispatch: In a razor-thin 7-6 decision, Supreme Court rules Parliament can amend any part of the Constitution, but cannot touch its Basic Structure like Democracy, Rule of Law, and Judicial Review.',
            hi: 'विशेष समाचार: 7-6 के नजदीकी बहुमत से सुप्रीम कोर्ट ने फैसला दिया कि संसद संविधान में बदलाव कर सकती है, लेकिन लोकतंत्र, कानून के शासन और न्यायिक समीक्षा जैसे बुनियादी ढांचे को छू भी नहीं सकती।',
          },
          highlightedPhrase: {
            en: 'Parliament can amend any part of Constitution, but cannot touch its Basic Structure',
            hi: 'संसद बदलाव कर सकती है, लेकिन बुनियादी ढांचे को छू भी नहीं सकती',
          },
          exhibitNumber: 'EXHIBIT B-3 · THE HINDU ARCHIVE',
          caption: {
            en: 'The Hindu front page announcing the Basic Structure judgment.',
            hi: 'द हिंदू का मुख्य पृष्ठ जिसने बेसिक स्ट्रक्चर फैसले की घोषणा की।',
          },
        },
        prosecutionArgs: {
          party: { en: 'Government / State of Kerala / AG', hi: 'केंद्र व राज्य सरकार' },
          claim: {
            en: 'Parliament represents the sovereign will of the people. Under Article 368, there are ZERO implied limitations on constitutional amendments.',
            hi: 'संसद जनता की संप्रभु इच्छा का प्रतिनिधित्व करती है। अनुच्छेद 368 के तहत संविधान संशोधन पर कोई पाबंदी नहीं हो सकती।',
          },
          statute: 'Article 368 (Amending Power of Parliament)',
          keyPoint: {
            en: 'Social and economic justice cannot be held hostage to court review. If Parliament wants to abolish property rights or restructure courts, it has the absolute mandate.',
            hi: 'सामाजिक और आर्थिक सुधारों को अदालतों द्वारा नहीं रोका जा सकता। संसद के पास संविधान बदलने का पूर्ण अधिकार है।',
          },
        },
        defenceArgs: {
          party: { en: 'Kesavananda Bharati / Nani Palkhivala', hi: 'केशवानंद भारती / नानी पालकीवाला' },
          claim: {
            en: 'Parliament is a creature of the Constitution. The creature cannot destroy the creator.',
            hi: 'संसद संविधान की रचना है। रचना अपने रचयिता को नष्ट नहीं कर सकती।',
          },
          statute: 'Doctrine of Implied Limitations & Basic Structure',
          keyPoint: {
            en: 'To "amend" means to improve while keeping the original structure intact. Parliament cannot amend India from a democracy into a monarchy or abolish the judiciary.',
            hi: 'संशोधन का अर्थ मूल ढांचे को बनाए रखते हुए सुधार करना है। संसद लोकतंत्र को राजशाही में नहीं बदल सकती और न ही अदालतों को खत्म कर सकती है।',
          },
        },
        tappableTerms: [
          {
            id: 'basic-structure-doctrine',
            term: { en: 'Basic Structure Doctrine', hi: 'बुनियादी ढांचे का सिद्धांत' },
            code: 'Constitutional Doctrine (1973)',
            definition: {
              en: 'A judicial principle establishing that certain fundamental features of the Indian Constitution (democracy, secularism, rule of law, judicial review, federalism) cannot be altered or destroyed by Parliament through constitutional amendments.',
              hi: 'एक न्यायिक सिद्धांत जिसके तहत भारतीय संविधान की बुनियादी विशेषताओं (लोकतंत्र, धर्मनिरपेक्षता, कानून का शासन, न्यायिक समीक्षा) को संसद किसी भी संशोधन द्वारा नष्ट नहीं कर सकती।',
            },
          },
        ],
      },
      {
        id: 'panel-6',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 06 · YOU ARE ON THE 13-JUDGE BENCH',
          hi: 'एपिसोड 06 · आप हैं 13 जजों की पीठ में',
        },
        headline: {
          en: 'Can Parliament abolish democracy through amendments?',
          hi: 'क्या संसद संशोधन के जरिए लोकतंत्र को समाप्त कर सकती है?',
        },
        body: {
          en: 'The 13 judges were locked in a 6-6 dead heat. Chief Justice S.M. Sikri was retiring the very next day. How would you cast the deciding 7th vote?',
          hi: '13 जज 6-6 के बराबर मतों पर अटके हुए थे। चीफ जस्टिस एस.एम. सीकरी अगले ही दिन रिटायर हो रहे थे। आप निर्णायक 7वां वोट किस पक्ष में देते?',
        },
        evidence: {
          archiveType: 'dossier',
          masthead: '13-JUDGE CONSTITUTION BENCH DELIBERATION',
          date: 'APRIL 1973',
          headline: {
            en: 'THE ULTIMATE QUESTION: CAN ARTICLE 368 BE USED TO REPEAL THE CONSTITUTION?',
            hi: 'सर्वोच्च प्रश्न: क्या अनुच्छेद 368 का उपयोग संविधान को ही समाप्त करने के लिए किया जा सकता है?',
          },
          snippet: {
            en: 'Judicial Balance Sheet: Six judges held Parliament has unlimited amending power. Six judges held Fundamental Rights are completely unamendable. Justice H.R. Khanna holds the crucial middle ground: Parliament can amend anything, EXCEPT the Basic Structure.',
            hi: 'न्यायिक संतुलन: 6 जजों का मानना था कि संसद के पास असीमित शक्ति है। 6 जजों का मानना था कि मौलिक अधिकार बदले ही नहीं जा सकते। न्यायमूर्ति एच.आर. खन्ना ने बीच का ऐतिहासिक रास्ता निकाला: संसद सब कुछ बदल सकती है, केवल बुनियादी ढांचे को छोड़कर।',
          },
          highlightedPhrase: {
            en: 'Justice H.R. Khanna holds crucial balance: Parliament can amend anything, EXCEPT the Basic Structure',
            hi: 'न्यायमूर्ति एच.आर. खन्ना ने रास्ता निकाला: संसद सब कुछ बदल सकती है, केवल बुनियादी ढांचे को छोड़कर',
          },
          exhibitNumber: 'DELIBERATION BALANCE · 13-JUDGE',
          caption: {
            en: 'Secret deliberation balance sheet of the 13-Judge Constitutional Bench.',
            hi: '13 जजों की संविधान पीठ की ऐतिहासिक विचार-विमर्श शीट।',
          },
        },
        judgeDecision: {
          question: {
            en: 'Does Parliament have unlimited amending power, or is it restrained by the "Basic Structure" of the Constitution?',
            hi: 'क्या संसद के पास असीमित संशोधन शक्ति है, या वह संविधान के "बुनियादी ढांचे" से बंधी है?',
          },
          subtext: {
            en: 'Decide whether elected representatives can alter fundamental constitutional pillars like judicial review and democracy.',
            hi: 'तय करें कि क्या जनता के चुने हुए प्रतिनिधि लोकतंत्र और न्यायिक समीक्षा जैसे मूल स्तंभों को बदल सकते हैं।',
          },
          options: [
            {
              id: 'parliament-unlimited',
              title: {
                en: 'Parliament has Unlimited Amending Power',
                hi: 'संसद के पास असीमित शक्ति है',
              },
              reason: {
                en: 'Elected representatives represent the sovereign will of the people. Courts should not limit constitutional amendments.',
                hi: 'चुनी हुई सरकार जनता की संप्रभु इच्छा का प्रतीक है। अदालतों को संविधान संशोधनों पर रोक नहीं लगानी चाहिए।',
              },
              simulatedVotesPercent: 12,
              isActualVerdict: false,
            },
            {
              id: 'basic-structure-shield',
              title: {
                en: 'Uphold the Basic Structure Doctrine',
                hi: 'बुनियादी ढांचे (Basic Structure) के सिद्धांत को मान्यता दें',
              },
              reason: {
                en: 'Parliament cannot destroy the democratic foundation that gave it power. The core pillars of the Constitution are immutable.',
                hi: 'संसद उस लोकतांत्रिक नींव को नष्ट नहीं कर सकती जिसने उसे शक्ति दी है। संविधान के मूल स्तंभ अटल हैं।',
              },
              simulatedVotesPercent: 88,
              isActualVerdict: true,
            },
          ],
          judicialRationale: {
            en: 'In a 7-6 nail-biting verdict, the Supreme Court ruled that Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution.',
            hi: '7-6 के ऐतिहासिक फैसले में सुप्रीम कोर्ट ने तय किया कि अनुच्छेद 368 संसद को संविधान के बुनियादी ढांचे को बदलने का अधिकार नहीं देता।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · THE HISTORIC 7-6 VERDICT',
          hi: 'एपिसोड 07 · 7-6 का ऐतिहासिक फैसला',
        },
        headline: {
          en: '24 April 1973: The 703-Page Judgment that Saved India.',
          hi: '24 अप्रैल 1973: 703 पन्नों का वह फैसला जिसने भारत को बचाया।',
        },
        stamp: {
          en: 'BASIC STRUCTURE DOCTRINE ESTABLISHED (7-6)',
          hi: 'बुनियादी ढांचे का सिद्धांत लागू (7-6)',
        },
        body: {
          en: 'On 24 April 1973 (the day before CJI Sikri retired), the Supreme Court delivered 11 separate opinions totaling 703 pages.\n\nBy a razor-thin 7–6 majority, the court ruled:\n**Parliament has wide power to amend the Constitution, but it CANNOT alter its Basic Structure.**\n\nSwami Kesavananda Bharati lost his land petition, but his name became immortalized as the case that saved Indian democracy.',
          hi: '24 अप्रैल 1973 को (सीजेआई सीकरी के रिटायरमेंट से ठीक एक दिन पहले) सुप्रीम कोर्ट ने 11 अलग-अलग रायों के साथ 703 पन्नों का फैसला सुनाया।\n\n7-6 के बहुमत से कोर्ट ने तय किया:\n**संसद के पास संविधान संशोधन की व्यापक शक्ति है, लेकिन वह इसके बुनियादी ढांचे को नहीं बदल सकती।**\n\nस्वामी केशवानंद भारती अपनी जमीन का केस हार गए, लेकिन उनका नाम भारतीय लोकतंत्र को बचाने वाले सबसे बड़े मुकदमे के रूप में अमर हो गया।',
        },
        evidence: {
          archiveType: 'court_decree',
          masthead: 'SUPREME COURT OF INDIA (1973) 4 SCC 225',
          date: '24 APRIL 1973',
          headline: {
            en: 'CERTIFIED DECREE: PARLIAMENT CANNOT ALTER THE BASIC STRUCTURE OF THE CONSTITUTION',
            hi: 'प्रमाणित डिक्री: संसद संविधान के बुनियादी ढांचे में बदलाव नहीं कर सकती',
          },
          snippet: {
            en: 'Majority View (CJI Sikri, Hegde, Mukherjea, Shelat, Grover, Jaganmohan Reddy, Khanna JJ): "Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution."',
            hi: 'बहुमत का फैसला (सीजेआई सीकरी, हेगड़े, मुखर्जी, शेलत, ग्रोवर, जगनमोहन रेड्डी, खन्ना): "अनुच्छेद 368 संसद को संविधान के बुनियादी ढांचे या ढांचे को बदलने का अधिकार नहीं देता है।"',
          },
          highlightedPhrase: {
            en: 'Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution',
            hi: 'अनुच्छेद 368 संसद को संविधान के बुनियादी ढांचे को बदलने का अधिकार नहीं देता है',
          },
          exhibitNumber: 'HISTORIC DECREE · (1973) 4 SCC 225',
          caption: {
            en: 'Certified Supreme Court judgment decree delivered on 24 April 1973.',
            hi: '24 अप्रैल 1973 को सुनाए गए सुप्रीम कोर्ट के प्रमाणित ऐतिहासिक फैसले की प्रति।',
          },
        },
      },
      {
        id: 'panel-8',
        type: 'RATIO',
        eyebrow: {
          en: 'EPISODE 08 · WHY IT SAVED DEMOCRACY',
          hi: 'एपिसोड 08 · लोकतंत्र की ढाल',
        },
        headline: {
          en: 'The Golden Precedent that Stopped Dictatorship.',
          hi: 'वह नजीर जिसने तानाशाही को रोका।',
        },
        body: {
          en: 'During the 1975 Emergency, the government passed the 39th Amendment to make Prime Minister election unchallengeable in any court.\n\nThe Supreme Court used the Basic Structure Doctrine to strike it down, declaring Judicial Review and Free Elections part of the untouchable basic structure.\n\nToday, India’s democracy stands protected because no government can ever rewrite the foundational pillars of the republic.',
          hi: '1975 के आपातकाल के दौरान सरकार ने 39वां संशोधन पारित कर प्रधानमंत्री के चुनाव को किसी भी अदालत में चुनौती से परे कर दिया था।\n\nसुप्रीम कोर्ट ने बेसिक स्ट्रक्चर सिद्धांत का उपयोग करके इस संशोधन को रद्द कर दिया और न्यायिक समीक्षा तथा निष्पक्ष चुनाव को संविधान का बुनियादी ढांचा घोषित किया।\n\nआज भारतीय लोकतंत्र सुरक्षित है क्योंकि कोई भी सरकार कभी भी संविधान के मूल स्तंभों को मिटा नहीं सकती।',
        },
        evidence: {
          archiveType: 'verdict_decree',
          masthead: 'CONSTITUTION OF INDIA · PERPETUAL RATIO',
          date: 'PERPETUAL DOCTRINE',
          headline: {
            en: 'THE UNALTERABLE PILLARS: DEMOCRACY, RULE OF LAW, SECULARISM & JUDICIAL REVIEW',
            hi: 'अटल संवैधानिक स्तंभ: लोकतंत्र, कानून का शासन, धर्मनिरपेक्षता और न्यायिक समीक्षा',
          },
          snippet: {
            en: 'The Basic Structure doctrine remains the ultimate constitutional shield in India. It prevents any ruling majority from converting the Indian republic into a totalitarian state or repealing fundamental liberties.',
            hi: 'बेसिक स्ट्रक्चर सिद्धांत आज भी भारत की सबसे बड़ी संवैधानिक ढाल है। यह किसी भी सत्तारूढ़ दल को भारतीय गणराज्य को तानाशाही में बदलने या नागरिकों की बुनियादी आजादी छीनने से रोकता है।',
          },
          highlightedPhrase: {
            en: 'prevents any ruling majority from converting the Indian republic into a totalitarian state',
            hi: 'किसी भी दल को भारतीय गणराज्य को तानाशाही में बदलने से रोकता है',
          },
          exhibitNumber: 'GOLDEN RATIO · BASIC STRUCTURE',
          caption: {
            en: 'The cornerstone of Indian constitutional jurisprudence.',
            hi: 'भारतीय संवैधानिक न्यायशास्त्र का अमर आधारस्तंभ।',
          },
        },
        citationFooter: '(1973) 4 SCC 225 · Supreme Court of India',
        judgmentUrl: 'https://indiankanoon.org/doc/257876/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India · 1973',
        hi: 'सुप्रीम कोर्ट ऑफ इंडिया · 1973',
      },
      facts: {
        en: 'Swami Kesavananda Bharati, head of Edneer Mutt in Kasaragod, Kerala, challenged the Kerala Land Reforms Act under Article 32. During the pendency of the case, Parliament passed the 24th, 25th, and 29th Constitutional Amendments giving Parliament unlimited power to amend any part of the Constitution. A special 13-judge bench was constituted.',
        hi: 'केरल के कासरगोड स्थित एडनीर मठ के प्रमुख स्वामी केशवानंद भारती ने केरल भूमि सुधार कानून को अनुच्छेद 32 के तहत चुनौती दी। मुकदमे के दौरान संसद ने 24वां, 25वां और 29वां संविधान संशोधन पारित कर संसद को संविधान बदलने की असीमित शक्ति दे दी। इसके बाद 13 जजों की विशेष संविधान पीठ गठित की गई।',
      },
      issues: {
        en: [
          'What is the true scope and extent of Parliament’s power to amend the Constitution under Article 368?',
          'Whether Parliament can amend, abridge, or destroy Fundamental Rights?',
          'Whether there are inherent or implied limitations on the amending power of Parliament?',
        ],
        hi: [
          'अनुच्छेद 368 के तहत संसद की संविधान संशोधन शक्ति का वास्तविक दायरा क्या है?',
          'क्या संसद मौलिक अधिकारों को कम या समाप्त कर सकती है?',
          'क्या संसद की संशोधन शक्ति पर कोई अंतर्निहित या बुनियादी सीमाएं हैं?',
        ],
      },
      chargesApplied: ['Constitution of India Articles 368, 13, 14, 19(1)(f), 25, 26, 31'],
      held: {
        en: 'In a 7-6 majority verdict, the 13-judge bench held that Parliament has wide power to amend any part of the Constitution, but CANNOT alter or destroy its "Basic Structure".',
        hi: '7-6 के बहुमत से 13 जजों की पीठ ने फैसला दिया कि संसद संविधान के किसी भी हिस्से में संशोधन कर सकती है, लेकिन इसके "बुनियादी ढांचे (Basic Structure)" को नहीं बदल सकती।',
      },
      reasoning: {
        en: 'The court held that the word "amend" in Article 368 implies retaining the original identity of the Constitution while modifying details. Core features such as democracy, rule of law, separation of powers, and judicial review constitute the unalterable Basic Structure.',
        hi: 'अदालत ने कहा कि अनुच्छेद 368 में "संशोधन" शब्द का अर्थ मूल पहचान को बनाए रखते हुए सुधार करना है। लोकतंत्र, कानून का शासन, शक्तियों का विभाजन और न्यायिक समीक्षा जैसी विशेषताएं संविधान का अटल बुनियादी ढांचा हैं।',
      },
      whyItMatters: {
        en: 'This is universally acknowledged as the most important judgment in Indian legal history. It saved Indian constitutional democracy by ensuring that no political party with a parliamentary majority can ever dismantle democratic institutions or fundamental liberties.',
        hi: 'यह भारतीय कानूनी इतिहास का सबसे महत्वपूर्ण फैसला है। इसने सुनिश्चित किया कि संसद में भारी बहुमत वाली कोई भी सरकार लोकतांत्रिक संस्थाओं या नागरिकों की आजादी को कभी खत्म नहीं कर सकती।',
      },
    },
  },
];
