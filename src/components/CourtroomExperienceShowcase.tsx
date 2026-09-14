'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export function CourtroomExperienceShowcase() {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<'reels' | 'judge' | 'archives' | 'briefs'>('reels');
  const [demoVote, setDemoVote] = useState<string | null>(null);

  const features = {
    reels: {
      badge: language === 'en' ? 'FEATURE 01 · 3-MIN READS' : 'फीचर 01 · 3 मिनट रील्स',
      title: language === 'en' ? 'Binge Indian Law Like a Crime Series' : 'क्राइम थ्रिलर की तरह समझें भारतीय कानून',
      desc:
        language === 'en'
          ? 'Instead of sifting through dense 80-page judgments, experience real court proceedings broken down into fast, episodic, high-stakes panels with dual-language audio narration.'
          : '80 पन्नों के नीरस कानूनी फैसलों के बजाय, भारतीय अदालती बहसों को तेज, रोमांचक कड़ियों और हिंदी-अंग्रेजी ऑडियो के साथ पढ़ें।',
      highlights:
        language === 'en'
          ? ['Episodic vertical swipe reels', 'Bilingual text & audio narrator', 'Tappable legal terms with plain meanings']
          : ['एपिसोडिक वर्टिकल स्वाइप रील्स', 'द्विभाषी टेक्स्ट व ऑडियो नैरेटर', 'कठिन कानूनी शब्दों के आसान अर्थ'],
    },
    judge: {
      badge: language === 'en' ? 'FEATURE 02 · INTERACTIVE SIMULATOR' : 'फीचर 02 · इंटरैक्टिव सिमुलेटर',
      title: language === 'en' ? 'You Are The Judge: Weigh Arguments & Vote' : 'आप हैं जज: दलीलें तौलें और फैसला दें',
      desc:
        language === 'en'
          ? 'Review the prosecution’s charge and the defence’s constitutional shield. Cast your verdict and see how your legal instincts compare to other readers before the apex court’s ruling is revealed.'
          : 'सरकारी वकील के आरोप और बचाव पक्ष की दलीलों को तौलें। अपना वोट दें और सुप्रीम कोर्ट के फैसले से पहले अपनी न्यायिक समझ की जांच करें।',
      highlights:
        language === 'en'
          ? ['Prosecution vs Defence showdown cards', 'Live simulated crowd voting', 'Instant reveal of apex court Ratio Decidendi']
          : ['अभियोजन बनाम बचाव पक्ष का आमना-सामना', 'लाइव ऑडियंस वोटिंग प्रतिशत', 'सुप्रीम कोर्ट के विधिक सार का खुलासा'],
    },
    archives: {
      badge: language === 'en' ? 'FEATURE 03 · VERIFIED ARCHIVES' : 'फीचर 03 · प्रमाणित पुरालेख',
      title: language === 'en' ? 'Vintage Newspaper Cuttings & Evidence' : 'प्रामाणिक अखबारों की कटिंग व साक्ष्य',
      desc:
        language === 'en'
          ? 'Step into history with reconstructed vintage press dispatches (The Statesman, Blitz, The Hindu) and official FIR police logs from 1958 to 2023.'
          : '1958 से 2023 तक के पुराने अखबारों (द स्टेट्समैन, ब्लिट्ज, द हिंदू) और पुलिस डायरी के मूल साक्ष्यों के साथ इतिहास को करीब से देखें।',
      highlights:
        language === 'en'
          ? ['Historic newspaper clipping exhibits', 'Photorealistic paper grain & stamp styling', 'Mobile-optimized single-cutting focus']
          : ['ऐतिहासिक अखबारों की कटिंग प्रदर्शनी', 'विंटेज पेपर टेक्सचर और स्टैंप डिजाइन', 'मोबाइल पर केंद्रित व स्पष्ट विजुअल'],
    },
    briefs: {
      badge: language === 'en' ? 'FEATURE 04 · LAW STUDENT TOOL' : 'फीचर 04 · लॉ छात्रों के लिए टूल',
      title: language === 'en' ? '1-Click Standard Case Briefs & Citations' : '1-क्लिक में तैयार केस ब्रीफ और साइटेशन',
      desc:
        language === 'en'
          ? 'Perfect for law students, advocates, and civil services aspirants. Instant breakdown of Statement of Facts, Issues Presented, Applied Statutes, and Holding.'
          : 'लॉ के छात्रों, वकीलों और यूपीएससी अभ्यर्थियों के लिए उपयुक्त। तथ्यों का विवरण, कानूनी प्रश्न, लागू धाराएं और अंतिम निर्णय एक क्लिक में।',
      highlights:
        language === 'en'
          ? ['Complete IRAC structured legal brief', '1-Click copy to clipboard for case prep', 'Direct link to certified judgment on Indian Kanoon']
          : ['आईआरएसी (IRAC) पद्धति पर आधारित संक्षिप्त विवरण', 'केस तैयारी के लिए एक क्लिक में कॉपी', 'इंडियन कानून पर मूल प्रमाणित फैसले का लिंक'],
    },
  };

  const current = features[activeTab];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto border-t border-white/10">
      {/* Top Header */}
      <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
        <span className="inline-block text-[10px] font-bold uppercase tracking-[0.25em] text-[#E50914] bg-[#E50914]/10 border border-[#E50914]/25 px-3 py-1 rounded-xs mb-3">
          {language === 'en' ? 'The Pleadings Experience' : 'प्लीडिंग्स अनुभव'}
        </span>
        <h2 className="font-anton text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight leading-tight">
          {language === 'en'
            ? 'Courtroom Drama Meets Legal Precision'
            : 'अदालती रोमांच और कानूनी सटीकता का अनूठा संगम'}
        </h2>
      </div>

      {/* Interactive Tabs Navigation */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-8 sm:mb-10 max-w-4xl mx-auto">
        {(
          [
            { id: 'reels', labelEn: '3-Min Story Reels', labelHi: '3-मिनट रील्स', icon: '⚡' },
            { id: 'judge', labelEn: 'Judge Simulator', labelHi: 'जज सिमुलेटर', icon: '⚖️' },
            { id: 'archives', labelEn: 'Vintage Archives', labelHi: 'पुरालेख कटिंग', icon: '📰' },
            { id: 'briefs', labelEn: 'Instant Briefs', labelHi: 'केस ब्रीफ', icon: '📑' },
          ] as const
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-2 p-3 sm:p-3.5 rounded-xs text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border ${
                isActive
                  ? 'bg-white text-[#0E1016] border-white shadow-xl scale-[1.02]'
                  : 'bg-[#151720] text-[#a9a49a] border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{language === 'en' ? tab.labelEn : tab.labelHi}</span>
            </button>
          );
        })}
      </div>

      {/* Main Interactive Showcase Split Box */}
      <div className="bg-[#12141C] border border-white/10 rounded-sm p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Feature Narrative */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
          <div className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            {current.badge}
          </div>

          <h3 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight leading-snug">
            {current.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#c9c5bc] leading-relaxed">
            {current.desc}
          </p>

          <div className="pt-2 space-y-2.5">
            {current.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-[#E0DDD5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] flex-shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex items-center gap-4">
            <Link
              href="/case/nanavati-case"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xs shadow-md"
            >
              <span>{language === 'en' ? 'Try Interactive Reel' : 'केस रील शुरू करें'}</span>
              <span>→</span>
            </Link>

            <Link
              href="/browse"
              className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline"
            >
              {language === 'en' ? 'Browse All 10 Cases →' : 'सभी 10 केस देखें →'}
            </Link>
          </div>
        </div>

        {/* Right Side: Live Interactive Demonstration Card */}
        <div className="lg:col-span-6 flex items-center justify-center">
          {activeTab === 'reels' && (
            <div className="w-full max-w-md bg-[#181B24] border border-white/15 p-5 sm:p-6 rounded-sm shadow-2xl relative">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 text-[10px] font-mono text-[#D4AF37] uppercase tracking-wider">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
                  <span>EPISODE 04 · CRIME SCENE</span>
                </span>
                <span>AUDIO 🔊</span>
              </div>
              <h4 className="font-anton text-lg text-white uppercase mb-2">
                {language === 'en' ? 'The Lantern That Cost A Life' : 'वह लालटेन जिसने जान ले ली'}
              </h4>
              <p className="text-xs text-[#c9c5bc] leading-relaxed mb-4">
                {language === 'en'
                  ? 'At 12:30 AM, Thapa saw a bobbing light in the dark airstrip. Believing it was an evil spirit, he swung his khukri. The light was carried by tribal women gathering mahua flowers.'
                  : 'रात 12:30 बजे हवाई पट्टी पर टिमटिमाती रोशनी देखकर थापा ने भूत समझकर हमला कर दिया। वह रोशनी फूल चुन रही महिलाओं की साधारण लालटेन थी।'}
              </p>
              <div className="bg-black/40 p-2.5 rounded-xs border border-white/10 text-[11px] text-[#38bdf8] font-mono flex items-center justify-between">
                <span>§ IPC 79 · MISTAKE OF FACT</span>
                <span className="text-white/60">TAPPABLE LAW TERM</span>
              </div>
            </div>
          )}

          {activeTab === 'judge' && (
            <div className="w-full max-w-md bg-[#181B24] border border-[#D4AF37]/30 p-5 sm:p-6 rounded-sm shadow-2xl relative">
              <div className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest mb-1.5 font-bold">
                ⚖️ {language === 'en' ? 'YOU ARE THE SESSIONS JUDGE' : 'आप हैं सत्र न्यायाधीश'}
              </div>
              <h4 className="font-sans font-bold text-sm text-white mb-3 leading-snug">
                {language === 'en'
                  ? 'Can genuine superstitious belief in ghosts excuse a deadly attack under IPC Section 79?'
                  : 'क्या अंधविश्वास के कारण किए गए हमले में धारा 79 (तथ्य की भूल) का बचाव मिल सकता है?'}
              </h4>

              <div className="space-y-2 mb-3">
                <button
                  onClick={() => setDemoVote('A')}
                  className={`w-full p-2.5 text-left text-xs rounded-xs border transition-all cursor-pointer flex items-center justify-between ${
                    demoVote === 'A'
                      ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37]'
                      : 'bg-white/5 border-white/10 text-[#F3EFE6] hover:bg-white/10'
                  }`}
                >
                  <span>A. Yes · Protected by Mistake of Fact (No criminal intent)</span>
                  {demoVote === 'A' && <span className="text-[10px] font-mono">68% VOTED ✓</span>}
                </button>

                <button
                  onClick={() => setDemoVote('B')}
                  className={`w-full p-2.5 text-left text-xs rounded-xs border transition-all cursor-pointer flex items-center justify-between ${
                    demoVote === 'B'
                      ? 'bg-[#E50914] text-white font-bold border-[#E50914]'
                      : 'bg-white/5 border-white/10 text-[#F3EFE6] hover:bg-white/10'
                  }`}
                >
                  <span>B. No · Superstition is reckless and not in good faith</span>
                  {demoVote === 'B' && <span className="text-[10px] font-mono">32% VOTED ✓</span>}
                </button>
              </div>

              {demoVote && (
                <div className="text-[11px] text-emerald-400 font-mono bg-emerald-950/40 p-2 rounded-xs border border-emerald-500/30">
                  ✓ High Court Held: Ram Bahadur Thapa acquitted under Section 79 IPC (No Mens Rea).
                </div>
              )}
            </div>
          )}

          {activeTab === 'archives' && (
            <div className="w-full max-w-md bg-[#ECE6D8] text-[#1a1b1f] p-5 sm:p-6 rounded-sm shadow-2xl border border-[#d8d0bf] font-serif relative">
              <div className="flex items-center justify-between text-[9px] font-sans font-bold tracking-widest text-[#5c564b] uppercase pb-2 mb-2.5 border-b border-[#cfc8b8]">
                <span>THE STATESMAN · 1958</span>
                <span>ARCHIVAL PRESS REPRODUCTION</span>
              </div>
              <h4 className="font-sans font-black text-sm text-[#121316] leading-tight mb-2">
                TRAGIC BLUNDER AT AIRSTRIP: SERVANT MISTAKES LANTERN FOR SPIRIT
              </h4>
              <p className="text-xs font-sans text-[#24262c] leading-relaxed mb-3">
                "Gelhi Majhiani died on the spot when the accused swung with his khukri believing a phantom was attacking..."
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-[#121316]/20 text-[9px] font-mono text-[#5c564b]">
                <span className="text-[#B23A2E] font-bold">EXHIBIT A-1 · POLICE DISPATCH</span>
                <span>AUTHENTIC RECORD</span>
              </div>
            </div>
          )}

          {activeTab === 'briefs' && (
            <div className="w-full max-w-md bg-[#FAF6EC] text-[#0E1016] p-5 sm:p-6 rounded-sm shadow-2xl border-2 border-[#D4AF37]/40 font-sans relative">
              <div className="flex items-center justify-between text-[9px] font-bold tracking-widest text-[#8a712a] uppercase pb-2 mb-2.5 border-b border-[#0E1016]/10">
                <span>ORISSA HIGH COURT · 1959</span>
                <span className="bg-[#0E1016] text-[#D4AF37] px-2 py-0.5 rounded-xs">RATIO DECIDENDI</span>
              </div>
              <h4 className="font-anton text-base uppercase text-[#0E1016] mb-1">
                State of Orissa v. Ram Bahadur Thapa
              </h4>
              <div className="text-[11px] text-[#0E1016]/80 space-y-1.5 my-2.5 font-serif italic">
                <p><strong>Facts:</strong> Nighttime attack on mahua gatherers mistaken for spirits.</p>
                <p><strong>Core Ratio:</strong> Bona fide mistake of fact eliminates criminal mens rea under Section 79 IPC.</p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-[#0E1016]/10 text-[10px] font-mono text-[#8a712a] font-bold">
                <span>AIR 1960 Ori 161</span>
                <span className="text-emerald-700">1-CLICK COPY READY</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Key Quality Metrics Bar */}
      <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-[#12141C] p-4 sm:p-5 rounded-xs border border-white/5">
          <div className="font-anton text-2xl sm:text-3xl text-[#D4AF37]">10+</div>
          <div className="text-[11px] text-[#a9a49a] uppercase tracking-wider font-mono mt-1">
            {language === 'en' ? 'Landmark Cases' : 'ऐतिहासिक केस'}
          </div>
        </div>

        <div className="bg-[#12141C] p-4 sm:p-5 rounded-xs border border-white/5">
          <div className="font-anton text-2xl sm:text-3xl text-white">100%</div>
          <div className="text-[11px] text-[#a9a49a] uppercase tracking-wider font-mono mt-1">
            {language === 'en' ? 'Certified Judgments' : 'प्रमाणित अदालती फैसले'}
          </div>
        </div>

        <div className="bg-[#12141C] p-4 sm:p-5 rounded-xs border border-white/5">
          <div className="font-anton text-2xl sm:text-3xl text-[#E50914]">EN & HI</div>
          <div className="text-[11px] text-[#a9a49a] uppercase tracking-wider font-mono mt-1">
            {language === 'en' ? 'Voice Narration' : 'हिंदी-अंग्रेजी ऑडियो'}
          </div>
        </div>

        <div className="bg-[#12141C] p-4 sm:p-5 rounded-xs border border-white/5">
          <div className="font-anton text-2xl sm:text-3xl text-[#38bdf8]">0 JARGON</div>
          <div className="text-[11px] text-[#a9a49a] uppercase tracking-wider font-mono mt-1">
            {language === 'en' ? 'Tappable Definitions' : 'आसान कानूनी शब्दावली'}
          </div>
        </div>
      </div>
    </section>
  );
}
