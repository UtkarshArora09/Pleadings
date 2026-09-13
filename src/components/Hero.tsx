'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';
import { CASES_DATA } from '@/data/cases';

interface HeroProps {
  featuredCase: CaseData;
}

export function Hero({ featuredCase }: HeroProps) {
  const { language, toggleBookmark, isBookmarked, openBriefModal } = useApp();
  const [activeCase, setActiveCase] = useState<CaseData>(featuredCase);
  const bookmarked = isBookmarked(activeCase.slug);

  return (
    <section className="relative w-full h-[88vh] min-h-[620px] bg-[#141414] flex items-end pb-16 overflow-hidden select-none">
      {/* Cinematic Full-Bleed 16:9 Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={activeCase.bannerImage}
          alt={activeCase.title[language]}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transform scale-105 transition-all duration-1000 brightness-75"
        />

        {/* Netflix-style Vignettes (Left dark fade, Bottom black fade, Top header shadow) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent w-full md:w-[70%] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0E1016] via-[#141414]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#141414]/90 to-transparent pointer-events-none" />
      </div>

      {/* Billboard Hero Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-12 flex flex-col justify-end">
        <div className="max-w-2xl animate-fadeIn">
          {/* Series & Case Identity Bar */}
          <div className="flex items-center gap-2.5 mb-3">
            <span className="flex items-center gap-1 bg-[#E50914] text-white text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-xs shadow-md">
              <span>PLEADINGS</span>
              <span className="font-sans font-normal opacity-80">ORIGINAL</span>
            </span>
            <span className="text-[#D4AF37] text-xs font-mono font-semibold uppercase tracking-wider">
              {activeCase.court} · {activeCase.year}
            </span>
          </div>

          {/* Bold Billboard Title */}
          <h1 className="font-anton text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight leading-[0.95] mb-3 text-shadow-lg">
            {activeCase.title[language]}
          </h1>

          {/* Subtitle / Citation */}
          <p className="text-xs sm:text-sm font-semibold text-[#D4AF37] uppercase tracking-wider mb-3">
            {activeCase.court} · {activeCase.tag[language]}
          </p>

          {/* Dramatic Story Hook */}
          <p className="text-sm sm:text-base text-[#e5e5e5] leading-relaxed line-clamp-3 mb-6 font-sans drop-shadow-md">
            {activeCase.featuredHeroDesc[language]}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {/* Play Button */}
            <Link
              href={`/case/${activeCase.slug}`}
              className="flex items-center gap-2.5 px-7 py-3 bg-white hover:bg-white/90 text-[#141414] font-bold text-sm uppercase tracking-wider rounded-xs transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <span className="text-base">▶</span>
              <span>{language === 'en' ? 'Play Story' : 'स्टोरी शुरू करें'}</span>
            </Link>

            {/* Case Brief Modal */}
            <Link
              href={`/case/${activeCase.slug}`}
              className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-sm uppercase tracking-wider rounded-xs backdrop-blur-md transition-all cursor-pointer border border-white/20"
            >
              <span>ℹ</span>
              <span>{language === 'en' ? 'Evidence & Brief' : 'साक्ष्य व ब्रीफ'}</span>
            </Link>

            {/* Bookmark Toggle */}
            <button
              onClick={() => toggleBookmark(activeCase.slug)}
              className={`p-3 rounded-xs border transition-all cursor-pointer ${
                bookmarked
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={bookmarked ? 'Remove from My List' : 'Add to My List'}
              aria-label="Add to My List"
            >
              {bookmarked ? '✓' : '+'}
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Bar for all 6 Cases */}
        <div className="pt-4 border-t border-white/10 flex items-center gap-3 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#a9a49a] hidden sm:inline flex-shrink-0">
            {language === 'en' ? 'Trending Cases:' : 'ट्रेंडिंग मामले:'}
          </span>
          {CASES_DATA.map((c) => {
            const isSelected = c.slug === activeCase.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setActiveCase(c)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition-all flex-shrink-0 cursor-pointer text-xs font-semibold ${
                  isSelected
                    ? 'bg-[#E50914] text-white font-bold shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/10'
                }`}
              >
                <span>#{c.rank}</span>
                <span>{c.title[language]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
