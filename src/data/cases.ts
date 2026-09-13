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
          en: 'EPISODE 01 · THE HOOK',
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
          en: 'Archival scene of Rasgovindpur aerodrome where the midnight encounter occurred.',
          hi: 'रसगोविंदपुर हवाई अड्डे का दृश्य जहां आधी रात की घटना हुई थी।',
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
          en: 'EPISODE 03 · THE INCIDENT',
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
        photoExhibitSrc: '/images/cases/ghost-case.jpg',
        photoExhibitCaption: {
          en: 'Reconstruction of the swinging lantern light in the pitch-black jungle.',
          hi: 'जंगल के अंधेरे में टिमटिमाती रोशनी का पुनर्निर्माण।',
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
          exhibitNumber: 'POLICE FIR NO. 44/1958',
          caption: {
            en: 'Police recovery memo: 1x Hurricane lantern, 1x Khukri with blood traces.',
            hi: 'पुलिस जब्ती सूची: 1x लालटेन, 1x खुखरी।',
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
        judgeDecision: {
          question: {
            en: 'Should Ram Bahadur Thapa be convicted of Murder or Acquitted under Section 79?',
            hi: 'क्या राम बहादुर थापा को हत्या का दोषी ठहराया जाए या धारा 79 के तहत बरी किया जाए?',
          },
          subtext: {
            en: 'Consider whether an honest mistake about the supernatural qualifies as "good faith" in criminal law.',
            hi: 'विचार करें कि क्या अलौकिक शक्ति के बारे में ईमानदार भूल आपराधिक कानून में "सद्भाव" मानी जा सकती है।',
          },
          options: [
            {
              id: 'opt-acquit',
              title: {
                en: 'ACQUIT HIM (Protected by IPC 79)',
                hi: 'बरी करें (आईपीसी 79 के तहत संरक्षित)',
              },
              reason: {
                en: 'He lacked intention to kill a human being and acted under an honest mistake of fact.',
                hi: 'उसका किसी इंसान को मारने का इरादा नहीं था और उसने तथ्य की भूल के तहत काम किया।',
              },
              simulatedVotesPercent: 68,
              isActualVerdict: true,
            },
            {
              id: 'opt-convict',
              title: {
                en: 'CONVICT FOR MURDER (IPC 302)',
                hi: 'हत्या का दोषी ठहराएं (आईपीसी 302)',
              },
              reason: {
                en: 'Superstition is no excuse. Striking with a blade in the dark shows gross criminal recklessness.',
                hi: 'अंधविश्वास कोई बहाना नहीं है। अंधेरे में खुखरी चलाना घोर लापरवाही है।',
              },
              simulatedVotesPercent: 32,
              isActualVerdict: false,
            },
          ],
          judicialRationale: {
            en: 'The Orissa High Court held that good faith does not mean logical infallibility. Given the pitch-black night, aerodrome lore, and sudden panic, Thapa genuinely believed he was defending his party from a spirit.',
            hi: 'उड़ीसा उच्च न्यायालय ने फैसला दिया कि सद्भाव का अर्थ पूर्ण तार्किक अचूकता नहीं है। घुप अंधेरी रात और भूत के खौफ को देखते हुए थापा का विश्वास सद्भाव में माना गया।',
          },
        },
      },
      {
        id: 'panel-7',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 07 · THE FINAL VERDICT',
          hi: 'एपिसोड 07 · अंतिम फैसला',
        },
        stamp: {
          en: 'ACQUITTED — 1959',
          hi: 'बरी — 1959',
        },
        headline: {
          en: 'The High Court held: Good faith, not correctness, is what the law protects.',
          hi: 'हाई कोर्ट का फैसला: कानून सही होने की नहीं, बल्कि सद्भाव की रक्षा करता है।',
        },
        body: {
          en: 'Justice Narasimham held that under Section 79, the standard is whether the person genuinely believed in the facts as he perceived them. The State’s appeal was dismissed, and Thapa walked free.',
          hi: 'न्यायमूर्ति नरसिम्हम ने फैसला सुनाया कि धारा 79 के तहत मानक यह है कि क्या व्यक्ति ने अपने दृष्टिकोण में ईमानदारी से विश्वास किया था। राज्य की अपील खारिज कर दी गई और थापा बरी हो गया।',
        },
        photoExhibitSrc: '/images/cases/ghost-case.jpg',
        photoExhibitCaption: {
          en: 'Certified Ruling: State of Orissa v. Ram Bahadur Thapa, AIR 1960 Ori 161.',
          hi: 'प्रमाणित निर्णय: उड़ीसा राज्य बनाम राम बहादुर थापा।',
        },
        citationFooter: 'State of Orissa v. Ram Bahadur Thapa, AIR 1960 Ori 161 (High Court of Orissa).',
        judgmentUrl: 'https://indiankanoon.org/doc/1489567/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Orissa High Court — Decided 1959. Underlying Incident: 1958.',
        hi: 'उड़ीसा हाई कोर्ट — निर्णय 1959। मूल घटना: 1958।',
      },
      facts: {
        en: 'In Rasgovindpur, an abandoned World War II military aerodrome was notorious for ghosts. Ram Bahadur Thapa accompanied his employer to observe the aerodrome at midnight. Seeing a swinging light in the dark and believing it to be a ghost, Thapa attacked it with a khukri, killing Gelhi Majhiani and injuring two other women collecting mahua flowers with a lantern.',
        hi: 'रसगोविंदपुर में द्वितीय विश्व युद्ध का एक हवाई अड्डा भूतिया माना जाता था। थापा अपने मालिक के साथ आधी रात को वहां गया। अंधेरे में टिमटिमाती लालटेन देखकर उसे भूत समझकर थापा ने खुखरी से हमला कर दिया। महुआ बीन रही एक महिला की मौत हो गई और दो घायल हो गईं।',
      },
      issues: {
        en: [
          'Whether an honest and genuine belief in the supernatural can constitute a valid mistake of fact under Section 79 IPC.',
          'Whether acting on a mistaken belief without checking due to sudden panic negates the requirement of "good faith" under Section 52 IPC.',
        ],
        hi: [
          'क्या अलौकिक शक्ति में सच्चा विश्वास धारा 79 आईपीसी के तहत तथ्य की वैध भूल बन सकता है।',
          'क्या अचानक घबराहट में बिना जांचे कदम उठाना धारा 52 के तहत "सद्भाव" को समाप्त करता है।',
        ],
      },
      chargesApplied: ['IPC 302 · Murder', 'IPC 326 · Grievous Hurt', 'IPC 79 · Mistake of Fact'],
      held: {
        en: 'The Orissa High Court confirmed the acquittal. The Court ruled that Section 79 fully protected Thapa as he acted under an honest mistake of fact without any malice or human target in mind.',
        hi: 'उड़ीसा उच्च न्यायालय ने बरी किए जाने की पुष्टि की। न्यायालय ने फैसला सुनाया कि धारा 79 थापा को पूरी सुरक्षा प्रदान करती है।',
      },
      reasoning: {
        en: 'Section 79 protects acts done under an honest mistake of fact where the actor believes their action is justified. The Court emphasized that "good faith" in law does not require superhuman wisdom; in the dead of night at a reputedly haunted location, Thapa’s subjective conviction was genuine.',
        hi: 'धारा 79 तथ्य की भूल के तहत सद्भाव में किए गए कार्यों की रक्षा करती है। कानून में सद्भाव का अर्थ अलौकिक ज्ञान नहीं है; परिस्थितियों को देखते हुए थापा का विश्वास वास्तविक था।',
      },
      whyItMatters: {
        en: 'This case is taught in every Indian law faculty as the quintessential illustration of "Ignorantia Facti Excusat" (Mistake of Fact) and the necessity of Mens Rea in criminal law.',
        hi: 'यह मामला भारत के हर लॉ कॉलेज में तथ्य की भूल (Ignorantia Facti Excusat) और आपराधिक मंशा (Mens Rea) के सबसे प्रमुख उदाहरण के रूप में पढ़ाया जाता है।',
      },
    },
  },
  {
    slug: 'nanavati-case',
    title: {
      en: 'The 3 Gunshots in Colaba',
      hi: 'कोलाबा में 3 गोलियां: नानावटी केस',
    },
    tag: {
      en: 'IPC 300 · Grave Provocation',
      hi: 'आईपीसी 300 · गंभीर प्रकोपन',
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
    maturityRating: 'U/A 16+',
    rank: 2,
    bannerImage: '/images/cases/nanavati-case.jpg',
    blurb: {
      en: 'A decorated Naval Commander, his English wife, and a wealthy lover shot dead in a towel. The trial that ended jury trials in India.',
      hi: 'एक नौसेना कमांडर, उनकी विदेशी पत्नी और तौलिया लपेटे अमीर प्रेमी की गोली मारकर हत्या। वह मुकदमा जिसने भारत में जूरी प्रथा समाप्त कर दी।',
    },
    citation: 'K.M. Nanavati v. State of Maharashtra, 1962 AIR 605, 1962 SCR Supl. (1) 567',
    judgmentUrl: 'https://indiankanoon.org/doc/1596139/',
    watermark: '§300',
    featuredHeroHook: {
      en: '3 bullets in a bedroom. The trial that changed Indian justice forever.',
      hi: 'बेडरूम में 3 गोलियां। वह मुकदमा जिसने भारतीय न्याय प्रणाली को हमेशा के लिए बदल दिया।',
    },
    featuredHeroDesc: {
      en: 'Commander Kawas Nanavati discovered his wife Sylvia had an affair with playboy Prem Ahuja. Nanavati retrieved a semi-automatic revolver from his ship, drove to Ahuja’s luxury flat, and fired 3 shots. Was it hot-blooded provocation or cold-blooded execution?',
      hi: 'कमांडर कावस नानावटी को पता चला कि उनकी पत्नी सिल्विया का प्रेम आहूजा के साथ संबंध था। नानावटी ने नेवल जहाज से सरकारी रिवॉल्वर निकाली और आहूजा के फ्लैट में जाकर 3 गोलियां दाग दीं। क्या यह अचानक आया गुस्सा था या पूर्व-नियोजित हत्या?',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · CRIME OF PASSION',
          hi: 'एपिसोड 01 · जुनून का अपराध',
        },
        headline: {
          en: 'Three shots in Colaba that shook the nation.',
          hi: 'कोलाबा में चली तीन गोलियां जिसने देश को हिला दिया।',
        },
        body: {
          en: 'Bombay, 27 April 1959. Commander K.M. Nanavati, a celebrated war hero of the Indian Navy, walked into the luxury bedroom of businessman Prem Ahuja. Seconds later, Ahuja lay dead in a pool of blood with three bullet wounds.',
          hi: 'बंबई, 27 अप्रैल 1959। भारतीय नौसेना के सम्मानित युद्ध नायक कमांडर के.एम. नानावटी व्यवसायी प्रेम आहूजा के बेडरूम में दाखिल हुए। कुछ ही सेकंडों में आहूजा तीन गोलियों के घावों के साथ खून से लथपथ पड़ा था।',
        },
        photoExhibitSrc: '/images/cases/nanavati-case.jpg',
        photoExhibitCaption: {
          en: 'Crime scene recreation: Jeevan Jyot apartment, Colaba, Bombay (1959).',
          hi: 'घटनास्थल का दृश्य: जीवन ज्योत अपार्टमेंट, कोलाबा, बंबई (1959)।',
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
          en: 'Honor, betrayal, and high society.',
          hi: 'सम्मान, विश्वासघात और अभिजात्य वर्ग।',
        },
        body: {
          en: 'A high-profile scandal that pitted naval prestige against Bombay’s elite business circle.',
          hi: 'एक हाई-प्रोफाइल मामला जिसने नौसेना के गौरव को बंबई के अभिजात्य व्यापारिक वर्ग के सामने खड़ा कर दिया।',
        },
        characters: [
          {
            name: { en: 'Cmdr. Kawas Nanavati', hi: 'कमांडर कावस नानावटी' },
            role: { en: 'Accused (Naval Officer)', hi: 'अभियुक्त (नौसेना अधिकारी)' },
            tag: { en: 'Decorated Commander of INS Mysore', hi: 'आईएनएस मैसूर के कमांडर' },
            description: {
              en: 'Handsome, disciplined officer who surrendered in full uniform to the police immediately.',
              hi: 'अनुशासित नौसेना अधिकारी जिन्होंने घटना के तुरंत बाद वर्दी में आत्मसमर्पण कर दिया।',
            },
            badgeEmoji: '⚓',
          },
          {
            name: { en: 'Sylvia Nanavati', hi: 'सिल्विया नानावटी' },
            role: { en: 'Wife', hi: 'पत्नी' },
            tag: { en: 'Confessed the Affair', hi: 'अवैध संबंध स्वीकार किया' },
            description: {
              en: 'English-born mother of three who confessed her romance with Ahuja that very afternoon.',
              hi: 'ब्रिटिश मूल की महिला जिन्होंने उसी दोपहर पति के सामने प्रेम संबंध कबूल किया।',
            },
            badgeEmoji: '💍',
          },
          {
            name: { en: 'Prem Bhagwandas Ahuja', hi: 'प्रेम भगवानदास आहूजा' },
            role: { en: 'Victim (Playboy Businessman)', hi: 'मृतक (अमीर व्यवसायी)' },
            tag: { en: 'Automobile Tycoon', hi: 'ऑटोमोबाइल व्यापारी' },
            description: {
              en: 'Wealthy bachelor who promised marriage to Sylvia but refused to take in her children.',
              hi: 'धनी अविवाहित व्यवसायी जिसने सिल्विया से शादी का वादा किया था।',
            },
            badgeEmoji: '🥂',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 03 · THE EVIDENCE EXHIBIT',
          hi: 'एपिसोड 03 · फॉरेंसिक साक्ष्य',
        },
        headline: {
          en: 'The towel that didn’t fall.',
          hi: 'वह तौलिया जो गिरा नहीं।',
        },
        body: {
          en: 'Nanavati claimed that a violent struggle erupted when Ahuja tried to snatch the gun. But the physical evidence told another story.',
          hi: 'नानावटी ने दावा किया कि हाथापाई के दौरान बंदूक गलती से चल गई। लेकिन फॉरेंसिक साक्ष्य कुछ और कह रहे थे।',
        },
        evidence: {
          masthead: 'THE BOMBAY CHRONICLE',
          date: '28 APRIL 1959',
          headline: {
            en: 'SENSATIONAL KILLING IN COLABA: AHUJA SHOT DEAD WHILE WEARING TOWEL; NO SIGNS OF PHYSICAL STRUGGLE',
            hi: 'कोलाबा में सनसनीखेज हत्याकांड: तौलिया लपेटे आहूजा की हत्या; हाथापाई का कोई निशान नहीं',
          },
          snippet: {
            en: 'The deceased was found with the bath towel still intact around his waist. Eyeglasses on the dresser were undisturbed. Forensics confirmed contact wounds.',
            hi: 'मृतक की कमर पर स्नान तौलिया बंधा हुआ था। ड्रेसर पर रखे चश्मे अपनी जगह पर थे। फॉरेंसिक ने पॉइंट-ब्लैंक फायरिंग की पुष्टि की।',
          },
          highlightedPhrase: {
            en: 'The deceased was found with the bath towel still intact around his waist.',
            hi: 'मृतक की कमर पर स्नान तौलिया बंधा हुआ था।',
          },
          exhibitNumber: 'EXHIBIT C · BALLISTICS REPORT',
          caption: {
            en: 'Police diagram of Jeevan Jyot bedroom showing Ahuja slumped in bathroom doorway.',
            hi: 'कोलाबा बेडरूम का नक्शा जिसमें आहूजा बाथरूम के दरवाजे पर गिरा मिला।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'ARGUMENTS',
        eyebrow: {
          en: 'EPISODE 04 · JURY VS BENCH',
          hi: 'एपिसोड 04 · जूरी बनाम उच्च न्यायालय',
        },
        headline: {
          en: 'Grave Provocation or Premeditated Vengeance?',
          hi: 'अचानक गुस्सा या पूर्व-नियोजित प्रतिशोध?',
        },
        body: {
          en: 'The jury of 9 citizens initially declared Nanavati NOT GUILTY (8-1) under public sympathy, but the judge referred the verdict as perverse.',
          hi: 'जनता की सहानुभूति के चलते 9 सदस्यीय जूरी ने नानावटी को 8-1 से निर्दोष घोषित किया, जिसे जज ने विकृत मानते हुए सुप्रीम कोर्ट भेज दिया।',
        },
        prosecutionArgs: {
          party: { en: 'State / Karl Khandalawala', hi: 'राज्य अभियोजन' },
          claim: {
            en: 'There was a 3-hour cooling-off period. Nanavati went to his ship, retrieved a gun, loaded it, and executed Ahuja.',
            hi: 'कबूलनामे और हत्या के बीच 3 घंटे का समय था। नानावटी ने शांत दिमाग से जहाज से बंदूक ली, गोलियां भरीं और हत्या की।',
          },
          statute: 'IPC § 302 · Premeditated Murder',
          keyPoint: {
            en: 'Exception 1 of Section 300 requires provocation to be both GRAVE and SUDDEN. A 3-hour delay destroys the "sudden" requirement.',
            hi: 'धारा 300 का अपवाद 1 मांग करता है कि गुस्सा गंभीर और "अचानक" हो। 3 घंटे का समय अचानक होने की शर्त को खत्म कर देता है।',
          },
        },
        defenceArgs: {
          party: { en: 'Defence / Ram Jethmalani assist', hi: 'बचाव पक्ष' },
          claim: {
            en: 'Ahuja provoked Nanavati when asked if he would marry Sylvia, cynically replying: "Am I supposed to marry every woman I sleep with?"',
            hi: 'जब नानावटी ने पूछा कि क्या वह सिल्विया से शादी करेगा, तो आहूजा ने कहा: "क्या मैं हर उस औरत से शादी करूं जिसके साथ सोता हूँ?"',
          },
          statute: 'IPC § 300 (Exception 1) · Culpable Homicide Not Murder',
          keyPoint: {
            en: 'The cynical insult renewed the sudden provocation inside the bedroom, driving the commander out of self-control.',
            hi: 'इस अपमानजनक जवाब ने बेडरूम में दोबारा अचानक गुस्सा भड़का दिया और आत्म-नियंत्रण खो गया।',
          },
        },
      },
      {
        id: 'panel-5',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 05 · YOU ARE THE SUPREME COURT JUDGE',
          hi: 'एपिसोड 05 · आप हैं सुप्रीम कोर्ट जज',
        },
        headline: {
          en: 'Murder (302) or Provocation (304)?',
          hi: 'हत्या (302) या प्रकोपन में गैर-इरादतन वध (304)?',
        },
        body: {
          en: 'Nanavati was a national naval hero protecting his family’s honor, but he obtained a weapon and had 3 hours to reflect. How do you rule?',
          hi: 'नानावटी एक सम्मानित नौसेना अधिकारी थे, लेकिन उनके पास सोचने के लिए 3 घंटे थे और वे हथियार लेकर गए थे। आप क्या फैसला देंगे?',
        },
        judgeDecision: {
          question: {
            en: 'Is Commander Nanavati guilty of Premeditated Murder (IPC 302) or Culpable Homicide under Provocation (IPC 304)?',
            hi: 'क्या नानावटी पूर्व-नियोजित हत्या (धारा 302) के दोषी हैं या गंभीर प्रकोपन (धारा 304) के?',
          },
          subtext: {
            en: 'The core legal test: Did sufficient cooling-off time elapse for reason to resume control?',
            hi: 'मुख्य कानूनी कसौटी: क्या गुस्से को शांत होने और विवेक लौटने का पर्याप्त समय मिल चुका था?',
          },
          options: [
            {
              id: 'opt-convict-302',
              title: {
                en: 'CONVICT FOR MURDER (IPC 302)',
                hi: 'हत्या का दोषी (आईपीसी 302)',
              },
              reason: {
                en: 'A 3-hour gap, procuring a service revolver, and driving across town prove cold premeditation, not sudden rage.',
                hi: '3 घंटे का अंतर और जहाज से सरकारी हथियार लेकर जाना पूर्व-नियोजित इरादे को साबित करता है।',
              },
              simulatedVotesPercent: 74,
              isActualVerdict: true,
            },
            {
              id: 'opt-reduce-304',
              title: {
                en: 'CULPABLE HOMICIDE (IPC 304)',
                hi: 'गंभीर प्रकोपन (आईपीसी 304)',
              },
              reason: {
                en: 'The betrayal and Ahuja’s insulting remark in the bedroom caused temporary loss of self-control.',
                hi: 'पत्नी के विश्वासघात और आहूजा की बदतमीजी ने क्षणिक आत्म-नियंत्रण छीन लिया।',
              },
              simulatedVotesPercent: 26,
              isActualVerdict: false,
            },
          ],
          judicialRationale: {
            en: 'The Supreme Court ruled that the "cooling time" between Sylvia’s confession and the shooting was more than sufficient for a reasonable person to regain composure. The plea of sudden provocation failed completely.',
            hi: 'सुप्रीम कोर्ट ने माना कि कबूलनामे और गोलीबारी के बीच का समय आत्म-नियंत्रण वापस पाने के लिए पर्याप्त था। इसलिए गंभीर प्रकोपन का अपवाद लागू नहीं होता।',
          },
        },
      },
      {
        id: 'panel-6',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 06 · THE SUPREME COURT VERDICT',
          hi: 'एपिसोड 06 · सुप्रीम कोर्ट का फैसला',
        },
        stamp: {
          en: 'GUILTY OF MURDER — LIFE IMPRISONMENT',
          hi: 'हत्या का दोषी — उम्रकैद',
        },
        headline: {
          en: 'Life Imprisonment & The Abolition of Jury Trials in India.',
          hi: 'उम्रकैद की सज़ा और भारत में जूरी प्रथा का हमेशा के लिए अंत।',
        },
        body: {
          en: 'Justice Subba Rao held that the test of grave and sudden provocation is whether a reasonable person placed in the same situation would lose self-control. The 3-hour gap defeated the claim. This case led to the abolition of jury trials across India due to jury bias.',
          hi: 'न्यायमूर्ति सुब्बा राव ने फैसला सुनाया कि 3 घंटे का समय शांत होने के लिए पर्याप्त था। नानावटी को उम्रकैद हुई। इस मुकदमे में जूरी के पक्षपात के कारण भारत में जूरी ट्रायल हमेशा के लिए समाप्त कर दिए गए।',
        },
        photoExhibitSrc: '/images/cases/nanavati-case.jpg',
        photoExhibitCaption: {
          en: 'K.M. Nanavati v. State of Maharashtra, AIR 1962 SC 605.',
          hi: 'के.एम. नानावटी बनाम महाराष्ट्र राज्य।',
        },
        citationFooter: 'K.M. Nanavati v. State of Maharashtra, AIR 1962 SC 605.',
        judgmentUrl: 'https://indiankanoon.org/doc/1596139/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India — Decided 24 November 1961. (Events: 1959).',
        hi: 'सुप्रीम कोर्ट ऑफ़ इंडिया — निर्णय 24 नवंबर 1961। (घटना: 1959)।',
      },
      facts: {
        en: 'Commander K.M. Nanavati was informed by his wife Sylvia of her infidelity with businessman Prem Ahuja. Nanavati dropped his family at the cinema, retrieved a loaded revolver from his ship under false pretences, drove to Ahuja’s flat, and fired three fatal shots at point-blank range while Ahuja was in a towel.',
        hi: 'कमांडर नानावटी को पत्नी सिल्विया ने प्रेम आहूजा के साथ अपने संबंध बताए। नानावटी ने बच्चों को फिल्म देखने भेजा, अपने नौसैनिक जहाज से रिवॉल्वर निकाली और आहूजा के फ्लैट में जाकर 3 गोलियां मारकर हत्या कर दी।',
      },
      issues: {
        en: [
          'Whether the acts of the accused fell under Exception 1 to Section 300 IPC (Grave and Sudden Provocation).',
          'Whether the lapse of 3 hours between the confession and the shooting constituted a sufficient cooling-off period.',
          'Whether the verdict of a jury could be set aside if perverse and unsupported by evidence.',
        ],
        hi: [
          'क्या अभियुक्त का कृत्य धारा 300 आईपीसी के अपवाद 1 (गंभीर और अचानक प्रकोपन) के अंतर्गत आता है।',
          'क्या 3 घंटे का अंतराल गुस्से के शांत होने के लिए पर्याप्त समय था।',
          'क्या जूरी के विकृत फैसले को उच्च न्यायालय द्वारा रद्द किया जा सकता है।',
        ],
      },
      chargesApplied: ['IPC 302 · Murder', 'IPC 304 · Culpable Homicide', 'IPC 300 (Exception 1)'],
      held: {
        en: 'The Supreme Court upheld the conviction of Commander Nanavati for murder under Section 302 and sentenced him to life imprisonment.',
        hi: 'सुप्रीम कोर्ट ने नानावटी को धारा 302 के तहत हत्या का दोषी ठहराया और उम्रकैद की सजा सुनाई।',
      },
      reasoning: {
        en: 'The Court laid down the definitive test for "grave and sudden provocation": the provocation must be sudden, unexpected, and deprive a reasonable person of self-control before sufficient cooling time elapses. The premeditated collection of a firearm during a 3-hour interval proved calculated intention.',
        hi: 'न्यायालय ने गंभीर और अचानक प्रकोपन की कसौटी तय की: गुस्सा शांत होने के समय से पहले का होना चाहिए। 3 घंटे बाद हथियार लेकर जाना पूर्व-नियोजित मंशा को साबित करता है।',
      },
      whyItMatters: {
        en: 'Nanavati is the most famous criminal trial in Indian history. It established the standard for Section 300 Exception 1 and triggered the abolition of the jury system in the Indian Code of Criminal Procedure (CrPC).',
        hi: 'नानावटी केस भारतीय इतिहास का सबसे प्रसिद्ध मुकदमा है जिसने धारा 300 के मानकों को तय किया और भारत से जूरी व्यवस्था समाप्त कराई।',
      },
    },
  },
  {
    slug: 'haircut-case',
    title: {
      en: 'The ₹2 Crore Haircut',
      hi: 'बाल कटवाने का 2 करोड़ का मामला',
    },
    tag: {
      en: 'Consumer Law · Quantum of Damages',
      hi: 'उपभोक्ता कानून · हर्जाने की सीमा',
    },
    categoryTag: 'Consumer Law',
    genre: 'consumer',
    theme: 'corporate-luxury',
    court: 'Supreme Court of India',
    year: 2026,
    readTime: {
      en: '4 min read',
      hi: '4 मिनट',
    },
    matchRate: 96,
    maturityRating: 'U/A 13+',
    rank: 3,
    bannerImage: '/images/cases/haircut-case.jpg',
    blurb: {
      en: 'A model was awarded ₹2 crore after a 5-star hotel salon cut her hair too short. The Supreme Court had a stern lesson on evidence.',
      hi: 'एक 5-स्टार सैलून में बाल छोटे कटने पर मॉडल को 2 करोड़ रुपये हर्जाना मिला। सुप्रीम कोर्ट ने साक्ष्य पर कड़ा पाठ पढ़ाया।',
    },
    citation: 'ITC Limited v. Aashna Roy, 2026 INSC 135',
    judgmentUrl: 'https://indiankanoon.org/doc/82481772/',
    watermark: 'CPA',
    featuredHeroHook: {
      en: '₹2 crore for a bad haircut. The Supreme Court said no.',
      hi: 'खराब हेयरकट के 2 करोड़ रुपये। सुप्रीम कोर्ट ने कहा नहीं।',
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
          en: 'Luxury salon interior at 5-star property, New Delhi.',
          hi: '5-स्टार होटल सैलून का दृश्य, नई दिल्ली।',
        },
      },
      {
        id: 'panel-2',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 02 · COMMISSION ORDER',
          hi: 'एपिसोड 02 · आयोग का आदेश',
        },
        headline: {
          en: 'The ₹2 Crore order that shocked corporate India.',
          hi: '2 करोड़ का वह आदेश जिसने कॉरपोरेट जगत को चौंका दिया।',
        },
        body: {
          en: 'The National Consumer Commission (NCDRC) ruled that the hotel committed gross deficiency in service, causing severe mental trauma and destroying her modeling prospects.',
          hi: 'राष्ट्रीय उपभोक्ता आयोग (NCDRC) ने माना कि होटल ने सेवा में घोर कमी की, जिससे मानसिक तनाव हुआ और मॉडलिंग करियर को भारी नुकसान पहुंचा।',
        },
        evidence: {
          masthead: 'FINANCIAL EXPRESS',
          date: '22 SEPT 2021',
          headline: {
            en: 'NCDRC ORDERS 5-STAR HOTEL TO PAY ₹2 CRORE DAMAGES TO MODEL FOR BOTCHED HAIRCUT',
            hi: 'उपभोक्ता आयोग का आदेश: खराब हेयरकट के लिए 5-स्टार होटल मॉडल को ₹2 करोड़ हर्जाना दे',
          },
          snippet: {
            en: 'The Commission accepted the complainant’s claim that she had lucrative contracts with Pantene and Sunsilk that were completely lost due to the cut.',
            hi: 'आयोग ने शिकायतकर्ता के इस दावे को स्वीकार किया कि हेयरकट के कारण बड़े ब्रांड्स के मॉडलिंग कॉन्ट्रैक्ट्स हाथ से निकल गए।',
          },
          highlightedPhrase: {
            en: 'accepted the complainant’s claim that she had lucrative contracts with Pantene and Sunsilk',
            hi: 'दावे को स्वीकार किया कि बड़े ब्रांड्स के कॉन्ट्रैक्ट्स हाथ से निकल गए',
          },
          exhibitNumber: 'NCDRC ORDER NO. 1184/2018',
          caption: {
            en: 'The highest single consumer damages award ever ordered for personal grooming in India.',
            hi: 'भारत में पर्सनल ग्रूमिंग के लिए दिया गया अब तक का सबसे बड़ा उपभोक्ता हर्जाना।',
          },
        },
      },
      {
        id: 'panel-3',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 03 · YOU ARE THE SUPREME COURT BENCH',
          hi: 'एपिसोड 03 · आप हैं सुप्रीम कोर्ट जज',
        },
        headline: {
          en: 'How much compensation is legally justified?',
          hi: 'कानूनी रूप से कितना हर्जाना उचित है?',
        },
        body: {
          en: 'The service was definitely botched, but the proof of ₹2 Crore monetary loss consisted only of unverified photocopies. What is your judgment?',
          hi: 'सेवा में कमी स्पष्ट थी, लेकिन 2 करोड़ के नुकसान के सबूत केवल अप्रमाणित फोटोकॉपी थे। आपका फैसला क्या होगा?',
        },
        judgeDecision: {
          question: {
            en: 'Should the Supreme Court uphold the ₹2 Crore award or slash it for lack of strict proof?',
            hi: 'क्या सुप्रीम कोर्ट को 2 करोड़ के हर्जाने को बरकरार रखना चाहिए या सबूतों के अभाव में घटाना चाहिए?',
          },
          subtext: {
            en: 'Balance consumer accountability against the strict evidentiary requirement for damages.',
            hi: 'उपभोक्ता संरक्षण और क्षतिपूर्ति के कड़े कानूनी साक्ष्य मानकों के बीच संतुलन बनाएं।',
          },
          options: [
            {
              id: 'opt-slash',
              title: {
                en: 'SLASH COMPENSATION TO ₹25 LAKH',
                hi: 'हर्जाना घटाकर 25 लाख करें',
              },
              reason: {
                en: 'Deficiency in service is proven, but a ₹2 Crore claim requires strict audited proof of lost income.',
                hi: 'सेवा में कमी सच है, लेकिन 2 करोड़ के दावे के लिए ठोस वित्तीय सबूत अनिवार्य हैं।',
              },
              simulatedVotesPercent: 81,
              isActualVerdict: true,
            },
            {
              id: 'opt-uphold',
              title: {
                en: 'UPHOLD ₹2 CRORE AS PUNITIVE DAMAGES',
                hi: '2 करोड़ का पूरा हर्जाना बरकरार रखें',
              },
              reason: {
                en: 'Luxury brands must pay exemplary damages for destroying customer trust and appearance.',
                hi: 'लक्जरी ब्रांड्स को ग्राहक के भरोसे और गरिमा को ठेस पहुंचाने के लिए भारी हर्जाना देना चाहिए।',
              },
              simulatedVotesPercent: 19,
              isActualVerdict: false,
            },
          ],
          judicialRationale: {
            en: 'The Supreme Court held that damages cannot be awarded on presumptions, whims, or fancies. While deficiency existed, ₹2 Crore was completely unproven, reducing the final award to ₹25 Lakh.',
            hi: 'सुप्रीम कोर्ट ने कहा कि हर्जाना मनमर्ज़ी या अंदाज़ों पर नहीं दिया जा सकता। नुकसान साबित नहीं हुआ, इसलिए राशि घटाकर 25 लाख कर दी गई।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 04 · APEX COURT HOLDING',
          hi: 'एपिसोड 04 · सुप्रीम कोर्ट का फैसला',
        },
        stamp: {
          en: 'AWARD REDUCED — 2026',
          hi: 'हर्जाना घटाया गया — 2026',
        },
        headline: {
          en: '₹2 Crore slashed to ₹25 Lakh.',
          hi: '2 करोड़ की रकम घटकर 25 लाख रह गई।',
        },
        body: {
          en: 'The Supreme Court ruled that consumer courts cannot pass speculative awards without authenticated proof of actual financial loss. The ₹25 Lakh already deposited was awarded as full and final compensation.',
          hi: 'सुप्रीम कोर्ट ने फैसला दिया कि उपभोक्ता अदालतें बिना वित्तीय साक्ष्य के भारी रकम नहीं दे सकतीं। 25 लाख रुपये का हर्जाना पर्याप्त माना गया।',
        },
        photoExhibitSrc: '/images/cases/haircut-case.jpg',
        photoExhibitCaption: {
          en: 'Precedent: ITC Limited v. Aashna Roy, 2026 INSC 135.',
          hi: 'आईटीसी लिमिटेड बनाम आशना रॉय, 2026।',
        },
        citationFooter: 'ITC Limited v. Aashna Roy, 2026 INSC 135.',
        judgmentUrl: 'https://indiankanoon.org/doc/82481772/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India — Decided 6 February 2026. (Events: 2018).',
        hi: 'सुप्रीम कोर्ट ऑफ़ इंडिया — निर्णय 6 फरवरी 2026। (घटना: 2018)।',
      },
      facts: {
        en: 'A model visited an ITC salon in New Delhi for a haircut before an interview. The salon cut her hair excessively short without consent. She filed a consumer complaint before the NCDRC, which awarded ₹2 Crore in damages.',
        hi: 'एक मॉडल ने आईटीसी के सैलून में बाल कटवाए जहां सहमति के बिना बाल अत्यधिक छोटे काट दिए गए। उपभोक्ता आयोग ने ₹2 करोड़ का हर्जाना सुनाया जिसके खिलाफ सुप्रीम कोर्ट में अपील की गई।',
      },
      issues: {
        en: [
          'What is the legal standard and evidentiary burden required to award massive compensation in consumer disputes?',
          'Can compensation for loss of income be granted purely on unauthenticated photocopies without audited accounts or witness cross-examination?',
        ],
        hi: [
          'उपभोक्ता मामलों में भारी हर्जाना तय करने का कानूनी मानक और साक्ष्य का भार क्या है?',
          'क्या बिना प्रामाणिक दस्तावेजों के केवल अनुमान के आधार पर करोड़ों का हर्जाना दिया जा सकता है?',
        ],
      },
      chargesApplied: ['Consumer Protection Act · Section 2(11)', 'Evidentiary Burden of Damages'],
      held: {
        en: 'The Supreme Court confirmed deficiency in service but reduced the damages from ₹2 Crore to ₹25 Lakh, holding that awards cannot be made on whims or conjectures.',
        hi: 'सुप्रीम कोर्ट ने सेवा में कमी को बरकरार रखा लेकिन हर्जाने को ₹2 करोड़ से घटाकर ₹25 लाख कर दिया।',
      },
      reasoning: {
        en: 'The Court held that while emotional distress and service failure were real, high-quantum damages require strict proof of quantifiable financial loss. Assertions and unauthenticated documents do not meet the legal standard.',
        hi: 'न्यायालय ने कहा कि सेवा में कमी के बावजूद भारी क्षतिपूर्ति के लिए वित्तीय नुकसान का दस्तावेजी और ठोस प्रमाण आवश्यक है।',
      },
      whyItMatters: {
        en: 'A key precedent for consumer litigation in India, establishing that consumer commissions cannot grant punitive windfalls without mathematical and documentary substantiation.',
        hi: 'भारतीय उपभोक्ता कानून का महत्वपूर्ण फैसला जो यह स्थापित करता है कि हर्जाना मनमाना नहीं बल्कि प्रमाणित नुकसान के आधार पर होना चाहिए।',
      },
    },
  },
  {
    slug: 'shreya-singhal',
    title: {
      en: 'The Midnight Facebook Arrest',
      hi: 'फेसबुक पोस्ट पर आधी रात की गिरफ्तारी',
    },
    tag: {
      en: 'IT Act § 66A · Free Speech',
      hi: 'आईटी एक्ट 66A · अभिव्यक्ति की स्वतंत्रता',
    },
    categoryTag: 'Cyber Law',
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
      en: 'Two girls arrested at midnight for a harmless Facebook post questioning a city shutdown. A 21-year-old law student took the government to the Supreme Court.',
      hi: 'शहर बंद पर सवाल उठाने वाले एक फेसबुक पोस्ट के लिए दो लड़कियों की आधी रात को गिरफ्तारी। एक 21 वर्षीय लॉ स्टूडेंट ने सरकार को सुप्रीम कोर्ट में चुनौती दी।',
    },
    citation: 'Shreya Singhal v. Union of India, (2015) 5 SCC 1, AIR 2015 SC 1523',
    judgmentUrl: 'https://indiankanoon.org/doc/110813550/',
    watermark: '§66A',
    featuredHeroHook: {
      en: 'Arrested for a Facebook Like. Struck down by the Supreme Court.',
      hi: 'फेसबुक लाइक करने पर जेल। सुप्रीम कोर्ट ने धारा को ही खत्म कर दिया।',
    },
    featuredHeroDesc: {
      en: 'Section 66A of the IT Act made sending "offensive" online messages punishable by 3 years in prison. When police began arresting citizens across India for political satire and innocent social media posts, a young law student struck at the heart of the law.',
      hi: 'आईटी एक्ट की धारा 66A किसी भी "आपत्तिजनक" ऑनलाइन संदेश पर 3 साल की जेल का प्रावधान करती थी। जब पुलिस ने सोशल मीडिया पोस्ट्स पर लोगों को गिरफ्तार करना शुरू किया, तो एक लॉ स्टूडेंट ने इस कानून को सुप्रीम कोर्ट में चुनौती दी।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · DIGITAL RIGHTS',
          hi: 'एपिसोड 01 · डिजिटल अधिकार',
        },
        headline: {
          en: 'Two college girls, one Facebook post, and a midnight police raid.',
          hi: 'दो कॉलेज छात्राएं, एक फेसबुक पोस्ट और आधी रात को पुलिस का छापा।',
        },
        body: {
          en: 'Palghar, Maharashtra, November 2012. Following the death of a political leader, the city of Mumbai came to a complete standstill. Shaheen Dhada, a 21-year-old student, posted a question on Facebook: "Respect is earned, not forced... why shut down the city for everyone?" Her friend Rinu Srinivasan liked the post. By midnight, both were in a police lockup.',
          hi: 'पालघर, महाराष्ट्र, नवंबर 2012। एक नेता के निधन पर पूरी मुंबई बंद कर दी गई। 21 वर्षीय शाहीन ढाडा ने फेसबुक पर लिखा: "सम्मान कमाया जाता है, जबरन नहीं लिया जाता... पूरे शहर को बंद क्यों किया गया?" उनकी सहेली रिनू ने इसे लाइक किया। आधी रात तक दोनों पुलिस हिरासत में थीं।',
        },
        photoExhibitSrc: '/images/cases/shreya-singhal.jpg',
        photoExhibitCaption: {
          en: 'Digital rights battleground: The smartphone and the Constitution.',
          hi: 'डिजिटल अधिकारों की जंग: स्मार्टफोन और संविधान।',
        },
      },
      {
        id: 'panel-2',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 02 · PRESS ARCHIVE',
          hi: 'एपिसोड 02 · प्रेस रिपोर्ट',
        },
        headline: {
          en: 'The Draconian Law: Section 66A of the IT Act.',
          hi: 'काला कानून: आईटी एक्ट की धारा 66A।',
        },
        body: {
          en: 'The police invoked Section 66A of the Information Technology Act, which made sending any information deemed "grossly offensive" or causing "annoyance" punishable by 3 years in jail.',
          hi: 'पुलिस ने धारा 66A लागू की, जिसके तहत कोई भी "बेहद आपत्तिजनक" या "परेशानी" पैदा करने वाला मैसेज भेजने पर 3 साल की जेल हो सकती थी।',
        },
        evidence: {
          masthead: 'THE INDIAN EXPRESS',
          date: '20 NOV 2012',
          headline: {
            en: 'PALGHAR GIRLS JAILED FOR QUESTIONING BANDH: NATIONWIDE OUTCRY OVER CYBER LAW MISUSE',
            hi: 'बंद पर सवाल उठाने पर छात्राएं जेल में: साइबर कानून के दुरुपयोग पर देशव्यापी आक्रोश',
          },
          snippet: {
            en: 'The broad wording of Section 66A allows police officers arbitrary power to arrest any citizen for political commentary, cartoons, or personal opinions shared on the internet.',
            hi: 'धारा 66A के अस्पष्ट शब्दों के कारण पुलिस को इंटरनेट पर किसी भी राजनीतिक टिप्पणी या कार्टून पर मनमानी गिरफ्तारी का अधिकार मिल गया है।',
          },
          highlightedPhrase: {
            en: 'broad wording of Section 66A allows police officers arbitrary power to arrest any citizen',
            hi: 'अस्पष्ट शब्दों के कारण पुलिस को मनमानी गिरफ्तारी का अधिकार मिल गया',
          },
          exhibitNumber: 'POLICE DIARY · PALGHAR PS',
          caption: {
            en: 'FIR filed against Shaheen Dhada and Rinu Srinivasan under Sec 66A and Sec 505(2) IPC.',
            hi: 'शाहीन ढाडा और रिनू पर धारा 66A के तहत दर्ज की गई एफआईआर।',
          },
        },
      },
      {
        id: 'panel-3',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 03 · YOU ARE THE SUPREME COURT BENCH',
          hi: 'एपिसोड 03 · आप हैं सुप्रीम कोर्ट जज',
        },
        headline: {
          en: 'Strike down Section 66A or save it with guidelines?',
          hi: 'धारा 66A को पूरी तरह रद्द करें या दिशानिर्देश बनाकर बचाएं?',
        },
        body: {
          en: 'If you strike down the section, the government loses a tool against cyber harassment. If you keep it, innocent citizens will continue being jailed for tweets. What is your verdict?',
          hi: 'यदि रद्द करते हैं तो सरकार साइबर ट्रोलिंग रोकने का हथियार खो देगी। यदि रखते हैं तो आम लोग जेल जाते रहेंगे। आपका निर्णय क्या होगा?',
        },
        judgeDecision: {
          question: {
            en: 'Should Section 66A of the IT Act be declared unconstitutional and struck down entirely?',
            hi: 'क्या आईटी एक्ट की धारा 66A को असंवैधानिक घोषित कर पूरी तरह निरस्त किया जाए?',
          },
          subtext: {
            en: 'Apply the doctrine of vagueness and the constitutional right to free speech.',
            hi: 'अस्पष्टता के सिद्धांत और वाक् स्वतंत्रता के अधिकार को लागू करें।',
          },
          options: [
            {
              id: 'opt-strike-down',
              title: {
                en: 'STRIKE DOWN ENTIRELY (Unconstitutional)',
                hi: 'पूरी तरह रद्द करें (असंवैधानिक)',
              },
              reason: {
                en: 'It violates Article 19(1)(a) and creates a chilling effect because "annoyance" is not a constitutional ground to restrict speech.',
                hi: 'यह अनुच्छेद 19(1)(a) का उल्लंघन करता है क्योंकि "नाराजगी" अभिव्यक्ति रोकने का संवैधानिक आधार नहीं है।',
              },
              simulatedVotesPercent: 88,
              isActualVerdict: true,
            },
            {
              id: 'opt-keep-guidelines',
              title: {
                en: 'SAVE IT WITH STRICT POLICE GUIDELINES',
                hi: 'कड़े पुलिस दिशानिर्देशों के साथ बचाएं',
              },
              reason: {
                en: 'Retain the law for cyber safety but mandate high-level officer approval before making an arrest.',
                hi: 'साइबर सुरक्षा के लिए कानून बनाए रखें लेकिन गिरफ्तारी के लिए उच्च अधिकारी की मंजूरी अनिवार्य करें।',
              },
              simulatedVotesPercent: 12,
              isActualVerdict: false,
            },
          ],
          judicialRationale: {
            en: 'Justice Nariman struck down Section 66A in its entirety, holding that it cast the net too wide and suffered from incurable vagueness.',
            hi: 'न्यायमूर्ति नरीमन ने धारा 66A को पूरी तरह असंवैधानिक घोषित कर निरस्त कर दिया।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 04 · HISTORIC RULING',
          hi: 'एपिसोड 04 · ऐतिहासिक फैसला',
        },
        stamp: {
          en: 'STRUCK DOWN — UNCONSTITUTIONAL',
          hi: 'असंवैधानिक — निरस्त',
        },
        headline: {
          en: 'Section 66A Struck Down in its Entirety.',
          hi: 'धारा 66A को पूरी तरह असंवैधानिक करार दिया गया।',
        },
        body: {
          en: 'Justices J. Chelameswar and R.F. Nariman held that Section 66A arbitrarily infringed the freedom of speech. The Court drew a vital distinction between mere "discussion", "advocacy", and "incitement".',
          hi: 'सुप्रीम कोर्ट ने फैसला सुनाया कि धारा 66A वाक् स्वतंत्रता का हनन करती है। अदालत ने कानून को पूर्ण रूप से समाप्त कर दिया।',
        },
        photoExhibitSrc: '/images/cases/shreya-singhal.jpg',
        photoExhibitCaption: {
          en: 'Magna Carta of Free Speech: Shreya Singhal v. Union of India, AIR 2015 SC 1523.',
          hi: 'श्रेया सिंघल बनाम भारत संघ, 2015।',
        },
        citationFooter: 'Shreya Singhal v. Union of India, AIR 2015 SC 1523.',
        judgmentUrl: 'https://indiankanoon.org/doc/110813550/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India — Decided 24 March 2015. (Events: 2012–2015).',
        hi: 'सुप्रीम कोर्ट ऑफ़ इंडिया — निर्णय 24 मार्च 2015। (घटनाएं: 2012–2015)।',
      },
      facts: {
        en: 'Multiple citizens across India were arrested under Section 66A of the IT Act for social media posts, including two girls in Palghar who questioned a city shutdown. A 21-year-old law student, Shreya Singhal, filed a writ petition challenging the provision under Article 32.',
        hi: 'सोशल मीडिया पोस्ट्स पर कई नागरिकों को गिरफ्तार किया गया। 21 वर्षीय छात्रा श्रेया सिंघल ने धारा 66A की संवैधानिक वैधता को सुप्रीम कोर्ट में चुनौती दी।',
      },
      issues: {
        en: [
          'Whether Section 66A of the IT Act violated Article 19(1)(a) of the Constitution and failed the test of reasonable restrictions under Article 19(2).',
          'Whether the terms "offensive", "menacing", and "annoyance" suffered from unconstitutional vagueness and overbreadth.',
        ],
        hi: [
          'क्या आईटी एक्ट की धारा 66A अनुच्छेद 19(1)(a) का उल्लंघन करती है।',
          'क्या "आपत्तिजनक" और "परेशानी" जैसे शब्द असंवैधानिक रूप से अस्पष्ट हैं।',
        ],
      },
      chargesApplied: ['IT Act § 66A', 'Constitution of India · Article 19(1)(a)', 'Article 19(2)'],
      held: {
        en: 'The Supreme Court struck down Section 66A of the Information Technology Act, 2000 in its entirety as unconstitutional.',
        hi: 'सुप्रीम कोर्ट ने सूचना प्रौद्योगिकी अधिनियम की धारा 66A को पूरी तरह असंवैधानिक घोषित कर निरस्त कर दिया।',
      },
      reasoning: {
        en: 'The Court held that Section 66A had no proximate nexus to public order, decency, or morality. It criminalized innocent speech and created a chilling effect on internet expression. Discussion and advocacy cannot be curtailed under the guise of public annoyance.',
        hi: 'अदालत ने माना कि धारा 66A का लोक व्यवस्था से कोई सीधा संबंध नहीं था। यह वैध वाक् स्वतंत्रता पर पाबंदी लगाती थी।',
      },
      whyItMatters: {
        en: 'The Magna Carta of digital free speech in India. It firmly established that online speech enjoys the exact same constitutional protection as print and spoken words.',
        hi: 'भारत में डिजिटल वाक् स्वतंत्रता का महाधिकार पत्र। इसने साबित किया कि इंटरनेट पर अभिव्यक्ति को संविधान का पूरा संरक्षण प्राप्त है।',
      },
    },
  },
  {
    slug: 'm-c-mehta',
    title: {
      en: 'The Toxic Gas Leak in Delhi',
      hi: 'दिल्ली का जहरीला गैस रिसाव: एमसी मेहता केस',
    },
    tag: {
      en: 'Tort Law · Absolute Liability',
      hi: 'अपकृत्य कानून · पूर्ण दायित्व का सिद्धांत',
    },
    categoryTag: 'Tort Law',
    genre: 'tort',
    theme: 'corporate-luxury',
    court: 'Supreme Court of India',
    year: 1987,
    readTime: {
      en: '5 min read',
      hi: '5 मिनट',
    },
    matchRate: 95,
    maturityRating: 'U/A 13+',
    rank: 5,
    bannerImage: '/images/cases/m-c-mehta.jpg',
    blurb: {
      en: 'One year after Bhopal, toxic Oleum gas leaked in central Delhi, killing an advocate. The Supreme Court forged a brand new global legal doctrine.',
      hi: 'भोपाल त्रासदी के एक साल बाद दिल्ली में जहरीली ओलियम गैस का रिसाव। सुप्रीम कोर्ट ने दुनिया को पूर्ण दायित्व का एक नया सिद्धांत दिया।',
    },
    citation: 'M.C. Mehta v. Union of India, 1987 AIR 1086, 1987 SCR (1) 819',
    judgmentUrl: 'https://indiankanoon.org/doc/1486949/',
    watermark: 'ABSOLUTE',
    featuredHeroHook: {
      en: 'No excuses. No exceptions. The Absolute Liability Doctrine.',
      hi: 'कोई बहाना नहीं, कोई अपवाद नहीं। पूर्ण दायित्व का सिद्धांत।',
    },
    featuredHeroDesc: {
      en: 'In December 1985, toxic Oleum gas leaked from Shriram Foods and Fertilizers in heavily populated Old Delhi. The company hid behind the 1868 British rule of "Strict Liability" with its many loopholes. Chief Justice P.N. Bhagwati rejected the colonial law and invented "Absolute Liability".',
      hi: 'दिसंबर 1985 में श्रीराम फर्टिलाइजर्स से जहरीली ओलियम गैस का रिसाव हुआ। कंपनी ने 1868 के पुराने ब्रिटिश कानून के अपवादों की आड़ ली। चीफ जस्टिस पी.एन. भगवती ने पुराने कानून को खारिज कर "पूर्ण दायित्व" का नया सिद्धांत रचा।',
    },
    hasJudgeDecision: true,
    panels: [
      {
        id: 'panel-1',
        type: 'HOOK',
        eyebrow: {
          en: 'EPISODE 01 · INDUSTRIAL DISASTER',
          hi: 'एपिसोड 01 · औद्योगिक आपदा',
        },
        headline: {
          en: 'A white toxic cloud over Old Delhi.',
          hi: 'पुरानी दिल्ली के आसमान पर जहरीला सफेद बादल।',
        },
        body: {
          en: '4 December 1985. Exactly one year after the Bhopal disaster, an industrial tank cracked at the Shriram factory complex in Delhi. Pungent Oleum gas poured into the streets, sending thousands choking to hospitals and killing an advocate in the Tis Hazari Court.',
          hi: '4 दिसंबर 1985। भोपाल गैस कांड के ठीक एक साल बाद, दिल्ली की श्रीराम फैक्ट्री में टैंक फटा। तीखी ओलियम गैस सड़कों पर फैल गई। हजारों लोग अस्पतालों में भर्ती हुए और तीस हजारी कोर्ट के एक वकील की मौत हो गई।',
        },
        photoExhibitSrc: '/images/cases/m-c-mehta.jpg',
        photoExhibitCaption: {
          en: 'Industrial chemical works complex in Old Delhi, December 1985.',
          hi: 'पुरानी दिल्ली में श्रीराम केमिकल वर्क्स का परिसर, दिसंबर 1985।',
        },
      },
      {
        id: 'panel-2',
        type: 'EVIDENCE',
        eyebrow: {
          en: 'EPISODE 02 · PRESS RECORD',
          hi: 'एपिसोड 02 · प्रेस रिपोर्ट',
        },
        headline: {
          en: 'Panic in the National Capital.',
          hi: 'राजधानी दिल्ली में मची भगदड़।',
        },
        body: {
          en: 'Advocate M.C. Mehta had already filed a PIL asking for hazardous industries to be moved out of Delhi. While the petition was pending, the disaster struck.',
          hi: 'वकील एम.सी. मेहता ने खतरनाक कारखानों को दिल्ली से बाहर शिफ्ट करने के लिए पहले ही याचिका दायर की थी। उसी दौरान यह हादसा हो गया।',
        },
        evidence: {
          masthead: 'THE HINDUSTAN TIMES',
          date: '05 DEC 1985',
          headline: {
            en: 'OLEUM GAS LEAK SPARKS PANIC IN WEST DELHI: HUNDREDS HOSPITALIZED, FACTORY SEALED',
            hi: 'पश्चिम दिल्ली में ओलियम गैस रिसाव से दहशत: सैकड़ों अस्पताल में, कारखाना सील',
          },
          snippet: {
            en: 'The sulfuric acid plant was operating in close proximity to dense residential neighborhoods. Supreme Court constitutes expert committee on industrial safety.',
            hi: 'सल्फ्यूरिक एसिड प्लांट घनी आबादी वाले इलाकों के बिल्कुल पास चल रहा था। सुप्रीम कोर्ट ने सुरक्षा पर विशेषज्ञ समिति गठित की।',
          },
          highlightedPhrase: {
            en: 'operating in close proximity to dense residential neighborhoods',
            hi: 'घनी आबादी वाले इलाकों के बिल्कुल पास चल रहा था',
          },
          exhibitNumber: 'GOVT GAZETTE NOTIFICATION · 1985',
          caption: {
            en: 'Order of District Magistrate shutting down the caustic chlorine plant.',
            hi: 'जिला मजिस्ट्रेट द्वारा फैक्ट्री बंद करने का आदेश।',
          },
        },
      },
      {
        id: 'panel-3',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 03 · YOU ARE CHIEF JUSTICE OF INDIA',
          hi: 'एपिसोड 03 · आप हैं भारत के मुख्य न्यायाधीश',
        },
        headline: {
          en: 'Follow old British law or create a new Indian principle?',
          hi: 'पुराने ब्रिटिश कानून पर चलें या भारत के लिए नया सिद्धांत बनाएं?',
        },
        body: {
          en: 'India’s industrial sector is growing rapidly. Should corporations be allowed exceptions for accidental leaks, or should their liability be 100% absolute and non-negotiable?',
          hi: 'क्या कारखानों को हादसों में बचने के कानूनी अपवाद दिए जाएं या खतरनाक उद्योगों का दायित्व बिना किसी अपवाद के 100% पूर्ण तय किया जाए?',
        },
        judgeDecision: {
          question: {
            en: 'Should India adopt a new doctrine of "Absolute Liability" with zero exceptions for hazardous industries?',
            hi: 'क्या भारत को खतरनाक उद्योगों के लिए बिना किसी अपवाद वाला "पूर्ण दायित्व का सिद्धांत" अपनाना चाहिए?',
          },
          subtext: {
            en: 'Balance industrial development against human safety and Article 21 rights.',
            hi: 'औद्योगिक विकास और अनुच्छेद 21 के तहत जीवन की सुरक्षा में संतुलन तय करें।',
          },
          options: [
            {
              id: 'opt-absolute',
              title: {
                en: 'ESTABLISH ABSOLUTE LIABILITY (No Exceptions)',
                hi: 'पूर्ण दायित्व का सिद्धांत लागू करें (कोई अपवाद नहीं)',
              },
              reason: {
                en: 'An enterprise engaged in a hazardous industry has an absolute and non-delegable duty to ensure no harm results to anyone.',
                hi: 'खतरनाक उद्योग चलाने वाली कंपनी का यह पूर्ण कर्तव्य है कि किसी को कोई नुकसान न पहुंचे।',
              },
              simulatedVotesPercent: 92,
              isActualVerdict: true,
            },
            {
              id: 'opt-strict',
              title: {
                en: 'APPLY TRADITIONAL STRICT LIABILITY WITH EXCEPTIONS',
                hi: 'पुराने ब्रिटिश नियम के अपवादों को जारी रखें',
              },
              reason: {
                en: 'Holding businesses liable without any defence will discourage investment in chemical manufacturing.',
                hi: 'बिना किसी बचाव के पूर्ण दायित्व लगाने से उद्योगों का विकास प्रभावित हो सकता है।',
              },
              simulatedVotesPercent: 8,
              isActualVerdict: false,
            },
          ],
          judicialRationale: {
            en: 'Chief Justice Bhagwati held that Indian jurisprudence cannot remain shackled to 19th-century British law. India must develop its own legal principles suited to its economic and social conditions.',
            hi: 'सीजेआई भगवती ने फैसला दिया कि भारतीय न्यायशास्त्र 19वीं सदी के ब्रिटिश कानून से बंधा नहीं रह सकता। भारत को अपनी परिस्थितियों के अनुसार नए नियम बनाने होंगे।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 04 · HISTORIC DOCTRINE',
          hi: 'एपिसोड 04 · ऐतिहासिक सिद्धांत',
        },
        stamp: {
          en: 'ABSOLUTE LIABILITY ESTABLISHED',
          hi: 'पूर्ण दायित्व सिद्धांत लागू',
        },
        headline: {
          en: 'The Birth of Absolute Liability in Indian Jurisprudence.',
          hi: 'भारतीय कानून में "पूर्ण दायित्व" का जन्म।',
        },
        body: {
          en: 'The Supreme Court ruled that an enterprise engaged in hazardous industry owes an absolute and non-delegable duty to the community. If any escape of toxic gas occurs, the company is unconditionally liable to pay compensation — and the larger the company, the greater the damages.',
          hi: 'सुप्रीम कोर्ट ने व्यवस्था दी कि खतरनाक उद्योग चलाने वाले उपक्रम का जनता के प्रति पूर्ण दायित्व है। किसी भी रिसाव पर कंपनी बिना किसी अपवाद के मुआवजा देने के लिए बाध्य होगी — और कंपनी जितनी बड़ी होगी, हर्जाना उतना अधिक होगा।',
        },
        photoExhibitSrc: '/images/cases/m-c-mehta.jpg',
        photoExhibitCaption: {
          en: 'M.C. Mehta v. Union of India, AIR 1987 SC 1086.',
          hi: 'एम.सी. मेहता बनाम भारत संघ, 1987।',
        },
        citationFooter: 'M.C. Mehta v. Union of India, AIR 1987 SC 1086.',
        judgmentUrl: 'https://indiankanoon.org/doc/1486949/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India — Decided 20 December 1986. (Reported: 1987).',
        hi: 'सुप्रीम कोर्ट ऑफ़ इंडिया — निर्णय 20 दिसंबर 1986। (रिपोर्ट: 1987)।',
      },
      facts: {
        en: 'A major leak of Oleum gas occurred from Shriram Foods and Fertilizer Industries in Delhi, causing one death and widespread hospitalization. The case was brought under Article 32 by environmental advocate M.C. Mehta.',
        hi: 'दिल्ली में श्रीराम फर्टिलाइजर्स से ओलियम गैस का भारी रिसाव हुआ जिससे एक वकील की मौत हुई और सैकड़ों लोग बीमार पड़े। एम.सी. मेहता ने अनुच्छेद 32 के तहत याचिका दायर की।',
      },
      issues: {
        en: [
          'What is the scope of liability of an enterprise engaged in a hazardous and inherently dangerous industry?',
          'Does the 1868 rule of Strict Liability in Rylands v. Fletcher with its exceptions apply in modern India?',
          'What is the measure of damages to be awarded against large corporations?',
        ],
        hi: [
          'खतरनाक उद्योग चलाने वाली कंपनियों के दायित्व का क्या दायरा है?',
          'क्या 1868 का ब्रिटिश राइलेंड्स बनाम फ्लेचर नियम आधुनिक भारत पर लागू होता है?',
          'बड़ी कंपनियों पर हर्जाना तय करने का क्या पैमाना होना चाहिए?',
        ],
      },
      chargesApplied: ['Article 21 · Right to Life', 'Article 32 · Writ Jurisdiction', 'Doctrine of Absolute Liability'],
      held: {
        en: 'The Supreme Court laid down the Doctrine of Absolute Liability, holding that hazardous enterprises have zero legal exceptions and must compensate all victims unconditionally.',
        hi: 'सुप्रीम कोर्ट ने पूर्ण दायित्व का सिद्धांत प्रतिपादित किया और माना कि खतरनाक उद्योगों को किसी भी रिसाव के लिए बिना किसी अपवाद के हर्जाना देना होगा।',
      },
      reasoning: {
        en: 'The Court held that law must evolve to meet the challenges of modern industrialization. An enterprise that creates a hazard for private profit must internalize all risks and cannot plead external causes.',
        hi: 'न्यायालय ने कहा कि कानून को आधुनिक औद्योगिक चुनौतियों के साथ बदलना चाहिए। निजी लाभ के लिए खतरा पैदा करने वाला उद्योग सभी जोखिमों के लिए पूर्ण रूप से उत्तरदायी होगा।',
      },
      whyItMatters: {
        en: 'A world-first environmental jurisprudence breakthrough that later governed the compensation framework for the Bhopal Gas Disaster and all modern industrial accidents in India.',
        hi: 'पर्यावरण कानून में भारत का विश्व प्रसिद्ध ऐतिहासिक योगदान, जिसके आधार पर बाद में भोपाल गैस त्रासदी और सभी औद्योगिक दुर्घटनाओं का मुआवजा तय हुआ।',
      },
    },
  },
  {
    slug: 'kesavananda-bharati',
    title: {
      en: 'The Monk Who Saved the Constitution',
      hi: 'वह संत जिसने संविधान को बचाया: केशवानंद भारती केस',
    },
    tag: {
      en: 'Constitutional Law · Basic Structure',
      hi: 'संवैधानिक कानून · मूल ढांचा',
    },
    categoryTag: 'Constitutional Law',
    genre: 'constitutional',
    theme: 'constitutional-gold',
    court: 'Supreme Court of India',
    year: 1973,
    readTime: {
      en: '5 min read',
      hi: '5 मिनट',
    },
    matchRate: 99,
    maturityRating: 'U/A 13+',
    rank: 6,
    bannerImage: '/images/cases/kesavananda-bharati.jpg',
    blurb: {
      en: 'Can Parliament rewrite any part of the Indian Constitution? 13 judges sat for 68 days to decide the fate of Indian democracy. The verdict won by a single vote.',
      hi: 'क्या संसद भारतीय संविधान के किसी भी हिस्से को अपनी मर्जी से बदल सकती है? 13 जजों ने 68 दिनों तक लोकतंत्र का भविष्य तय किया। फैसला सिर्फ 1 वोट से हुआ।',
    },
    citation: 'Kesavananda Bharati Sripadagalvaru v. State of Kerala, (1973) 4 SCC 225, AIR 1973 SC 1461',
    judgmentUrl: 'https://indiankanoon.org/doc/257876/',
    watermark: 'ART 368',
    featuredHeroHook: {
      en: '703 pages. 13 Judges. 1 Vote that saved Indian Democracy.',
      hi: '703 पन्ने। 13 जज। और 1 वोट जिसने भारतीय लोकतंत्र को बचाया।',
    },
    featuredHeroDesc: {
      en: 'In 1970, the head of a Hindu monastery in Kerala challenged land reform laws. The case exploded into the greatest constitutional battle in Indian history: Does Parliament have unlimited power to amend the Constitution, even if it destroys democracy itself?',
      hi: '1970 में केरल के एक हिंदू मठ के मठाधीश ने भूमि सुधार कानूनों को चुनौती दी। यह मामला भारतीय इतिहास की सबसे बड़ी संवैधानिक लड़ाई में बदल गया: क्या संसद के पास संविधान को पूरी तरह बदलने की असीमित शक्ति है?',
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
          en: 'Can Parliament destroy the Constitution it was created to protect?',
          hi: 'क्या संसद उस संविधान को नष्ट कर सकती है जिसकी रक्षा के लिए वह बनी है?',
        },
        body: {
          en: 'In the early 1970s, Prime Minister Indira Gandhi’s government passed the 24th, 25th, and 29th Constitutional Amendments, asserting that Parliament’s power under Article 368 was absolute and above judicial review.',
          hi: '1970 के दशक की शुरुआत में सरकार ने 24वें, 25वें और 29वें संविधान संशोधन पारित किए और दावा किया कि अनुच्छेद 368 के तहत संसद की शक्ति असीमित है और अदालतें उसकी समीक्षा नहीं कर सकतीं।',
        },
        photoExhibitSrc: '/images/cases/kesavananda-bharati.jpg',
        photoExhibitCaption: {
          en: 'The 13-Judge Constitution Bench of the Supreme Court of India (1973).',
          hi: 'भारत के सुप्रीम कोर्ट की 13 जजों की संविधान पीठ (1973)।',
        },
      },
      {
        id: 'panel-2',
        type: 'PEOPLE',
        eyebrow: {
          en: 'EPISODE 02 · DRAMATIS PERSONAE',
          hi: 'एपिसोड 02 · मुख्य विभूतियां',
        },
        headline: {
          en: 'A saint, a legendary advocate, and a divided bench.',
          hi: 'एक संत, एक महान वकील और विभाजित संविधान पीठ।',
        },
        body: {
          en: 'The people who fought the longest oral hearing in Supreme Court history (68 days).',
          hi: 'वे लोग जिन्होंने सुप्रीम कोर्ट के इतिहास की सबसे लंबी 68 दिवसीय मौखिक बहस लड़ी।',
        },
        characters: [
          {
            name: { en: 'Swami Kesavananda Bharati', hi: 'स्वामी केशवानंद भारती' },
            role: { en: 'Petitioner (Monk)', hi: 'याचिकाकर्ता (मठाधीश)' },
            tag: { en: 'Head of Edneer Mutt, Kerala', hi: 'एडनीर मठ के प्रमुख' },
            description: {
              en: 'A quiet religious head whose property rights dispute sparked the monumental challenge.',
              hi: 'एक शांत संत जिनकी मठ की भूमि के विवाद ने देश की सबसे बड़ी कानूनी जंग छेड़ दी।',
            },
            badgeEmoji: '🕉️',
          },
          {
            name: { en: 'Nani Palkhivala', hi: 'नानी पालकीवाला' },
            role: { en: 'Lead Counsel for Freedom', hi: 'याचिकाकर्ता के मुख्य वकील' },
            tag: { en: 'Legal Titan', hi: 'महान विधिवेत्ता' },
            description: {
              en: 'Brilliant orator who argued that Article 368 gives the power to amend, not to abrogate the Constitution.',
              hi: 'महान विधिवेत्ता जिन्होंने तर्क दिया कि अनुच्छेद 368 संशोधन की शक्ति देता है, संविधान को नष्ट करने की नहीं।',
            },
            badgeEmoji: '⚖️',
          },
          {
            name: { en: 'Chief Justice S.M. Sikri', hi: 'चीफ जस्टिस एस.एम. सीकरी' },
            role: { en: 'Head of 13-Judge Bench', hi: '13 जजों की पीठ के अध्यक्ष' },
            tag: { en: 'Retiring on Verdict Day', hi: 'फैसले के दिन सेवानिवृत्त हुए' },
            description: {
              en: 'Led the largest bench in Indian history to save the democratic framework.',
              hi: 'जिन्होंने भारतीय लोकतंत्र के मूल ढांचे को बचाने के लिए सबसे बड़ी पीठ का नेतृत्व किया।',
            },
            badgeEmoji: '🏛️',
          },
        ],
      },
      {
        id: 'panel-3',
        type: 'YOU_DECIDE',
        eyebrow: {
          en: 'EPISODE 03 · YOU ARE THE 13TH SUPREME COURT JUDGE',
          hi: 'एपिसोड 03 · आप हैं 13वें सुप्रीम कोर्ट जज',
        },
        headline: {
          en: 'The bench is tied 6-6. Your vote will decide India’s future.',
          hi: '13 जजों की पीठ 6-6 पर बंटी है। आपका एक वोट भारत का भविष्य तय करेगा।',
        },
        body: {
          en: 'Does Parliament have unlimited power under Article 368 to amend any part of the Constitution, or are there inherent structural limits that cannot be touched?',
          hi: 'क्या संसद के पास संविधान को पूरी तरह बदलने की असीमित शक्ति है, या कुछ बुनियादी सिद्धांत हैं जिन्हें कोई सरकार नहीं छू सकती?',
        },
        judgeDecision: {
          question: {
            en: 'Can Parliament amend the "Basic Structure" of the Indian Constitution under Article 368?',
            hi: 'क्या संसद अनुच्छेद 368 के तहत भारतीय संविधान के "मूल ढांचे" को बदल या नष्ट कर सकती है?',
          },
          subtext: {
            en: 'The ruling that protected Indian Democracy from permanent authoritarian alteration.',
            hi: 'वह ऐतिहासिक फैसला जिसने भारतीय लोकतंत्र को स्थायी तानाशाही में बदलने से बचाया।',
          },
          options: [
            {
              id: 'opt-basic-structure',
              title: {
                en: 'NO · BASIC STRUCTURE IS SACROSANCT (7-6 Victory)',
                hi: 'नहीं · संविधान का मूल ढांचा अपरिवर्तनीय है (7-6 से जीत)',
              },
              reason: {
                en: 'Parliament can amend provisions, but cannot destroy core pillars like Democracy, Judicial Review, and Secularism.',
                hi: 'संसद संशोधन कर सकती है, लेकिन लोकतंत्र, धर्मनिरपेक्षता और न्यायिक समीक्षा जैसे मूल स्तंभों को नष्ट नहीं कर सकती।',
              },
              simulatedVotesPercent: 94,
              isActualVerdict: true,
            },
            {
              id: 'opt-unlimited',
              title: {
                en: 'YES · PARLIAMENT HAS UNLIMITED POWER',
                hi: 'हाँ · संसद के पास असीमित संप्रभु शक्ति है',
              },
              reason: {
                en: 'Elected representatives should have total authority to rewrite the Constitution for new eras.',
                hi: 'चुनी हुई संसद के पास नए युग के लिए संविधान को पूरी तरह बदलने का पूरा अधिकार होना चाहिए।',
              },
              simulatedVotesPercent: 6,
              isActualVerdict: false,
            },
          ],
          judicialRationale: {
            en: 'By a wafer-thin majority of 7 to 6, the Supreme Court ruled that Article 368 does not enable Parliament to alter the basic structure or framework of the Constitution.',
            hi: '7 बनाम 6 के मामूली बहुमत से सुप्रीम कोर्ट ने फैसला दिया कि संसद संविधान के मूल ढांचे को नष्ट नहीं कर सकती।',
          },
        },
      },
      {
        id: 'panel-4',
        type: 'VERDICT',
        eyebrow: {
          en: 'EPISODE 04 · THE 703-PAGE VERDICT',
          hi: 'एपिसोड 04 · 703 पन्नों का फैसला',
        },
        stamp: {
          en: 'BASIC STRUCTURE DOCTRINE ESTABLISHED (7-6)',
          hi: 'मूल ढांचा सिद्धांत स्थापित (7-6)',
        },
        headline: {
          en: 'Parliament is Powerful, but the Constitution is Supreme.',
          hi: 'संसद शक्तिशाली है, लेकिन संविधान सर्वोच्च है।',
        },
        body: {
          en: 'The Supreme Court invented the "Basic Structure Doctrine". Parliament can amend parts of the Constitution, but it can never touch Democracy, Federalism, Secularism, Judicial Independence, or the Rule of Law. This doctrine later saved Indian democracy during the 1975–1977 Emergency.',
          hi: 'सुप्रीम कोर्ट ने "मूल ढांचे का सिद्धांत" स्थापित किया। संसद संविधान में संशोधन कर सकती है, लेकिन लोकतंत्र, पंथनिरपेक्षता, न्यायिक स्वतंत्रता और कानून के शासन को कभी खत्म नहीं कर सकती।',
        },
        photoExhibitSrc: '/images/cases/kesavananda-bharati.jpg',
        photoExhibitCaption: {
          en: 'Historic judgment: Kesavananda Bharati v. State of Kerala, AIR 1973 SC 1461.',
          hi: 'ऐतिहासिक फैसला: केशवानंद भारती बनाम केरल राज्य, 1973।',
        },
        citationFooter: 'Kesavananda Bharati v. State of Kerala, AIR 1973 SC 1461.',
        judgmentUrl: 'https://indiankanoon.org/doc/257876/',
      },
    ],
    brief: {
      courtAndYear: {
        en: 'Supreme Court of India (13-Judge Bench) — Decided 24 April 1973.',
        hi: 'सुप्रीम कोर्ट ऑफ़ इंडिया (13 जजों की सबसे बड़ी पीठ) — निर्णय 24 अप्रैल 1973।',
      },
      facts: {
        en: 'Swami Kesavananda Bharati challenged the Kerala Land Reforms Act under Article 26. While the petition was pending, Parliament enacted the 24th, 25th, and 29th Amendments to override judicial decisions and grant itself absolute amending power under Article 368.',
        hi: 'स्वामी केशवानंद भारती ने केरल भूमि सुधार कानून को चुनौती दी। इस दौरान संसद ने 24वें, 25वें और 29वें संशोधन पारित कर खुद को अनुच्छेद 368 के तहत असीमित शक्ति दे दी।',
      },
      issues: {
        en: [
          'What is the true scope and extent of Parliament’s constituent amending power under Article 368 of the Constitution?',
          'Can Parliament abrogate or destroy fundamental rights and the democratic framework of the Constitution through an amendment?',
        ],
        hi: [
          'अनुच्छेद 368 के तहत संसद की संविधान संशोधन शक्ति का वास्तविक दायरा क्या है?',
          'क्या संसद संशोधन के जरिए मौलिक अधिकारों और लोकतंत्र को पूरी तरह समाप्त कर सकती है?',
        ],
      },
      chargesApplied: ['Article 368 · Amendment of Constitution', 'Article 13(2)', 'Basic Structure Doctrine'],
      held: {
        en: 'By a 7-6 majority, the Court held that while Parliament has wide amending powers under Article 368, it does not have the power to destroy or alter the "Basic Structure" of the Constitution.',
        hi: '7-6 के बहुमत से न्यायालय ने माना कि संसद के पास संशोधन की व्यापक शक्ति है, लेकिन वह संविधान के "मूल ढांचे" को नष्ट नहीं कर सकती।',
      },
      reasoning: {
        en: 'The word "amendment" in Article 368 implies preservation of the original identity. A power to amend is not a power to destroy the foundation. The Constitution derives its legitimacy from "We, the People", and Parliament as a constituted body cannot overturn the foundational compact.',
        hi: '"संशोधन" शब्द का अर्थ मूल पहचान को सुरक्षित रखना है। संशोधन की शक्ति विनाश की शक्ति नहीं है। संविधान जनता से अपनी शक्ति प्राप्त करता है, इसलिए संसद इसकी बुनियादी नींव को नहीं गिरा सकती।',
      },
      whyItMatters: {
        en: 'The most important judgment in the history of the Republic of India. It forms the ultimate democratic guardrail ensuring that no temporary parliamentary majority can turn India into a dictatorship.',
        hi: 'भारत के गणराज्य के इतिहास का सबसे महत्वपूर्ण फैसला, जिसने यह सुनिश्चित किया कि कोई भी सत्ताधारी दल लोकतंत्र को समाप्त नहीं कर सकता।',
      },
    },
  },
];
