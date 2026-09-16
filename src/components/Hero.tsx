'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseFile } from '@/types/case';
import { StatusBadge } from '@/components/case/StatusBadge';
import { ProvenanceStrip } from '@/components/case/ProvenanceStrip';
import { useApp } from '@/context/AppContext';

interface HeroProps {
  featuredCase: CaseFile;
  casesList: CaseFile[];
}

export function Hero({ featuredCase, casesList }: HeroProps) {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const [activeCase, setActiveCase] = useState<CaseFile>(featuredCase);

  useEffect(() => {
    if (featuredCase) {
      setActiveCase(featuredCase);
    }
  }, [featuredCase]);

  const activeContent = language === 'hi' && activeCase.hi ? activeCase.hi : activeCase;
  const rawTitle = activeContent.title;
  const displayTitle = typeof rawTitle === 'string' ? rawTitle : ((rawTitle as any)?.[language] || (rawTitle as any)?.en || activeCase.slug);
  const rawHook = activeContent.hook;
  const displayHook = typeof rawHook === 'string' ? rawHook : ((rawHook as any)?.[language] || (rawHook as any)?.en || '');
  const bookmarked = isBookmarked(activeCase.slug);

  const totalParasCited = activeCase.episodes.reduce((acc, ep) => {
    const count = ep.layers.story.blocks.filter((b) => b.source.tier === 'BLACK').length;
    return acc + count;
  }, 0) || 12;

  const defaultHeroFallback = '/images/cases/ghost-case.jpg';
  const [heroImg, setHeroImg] = useState<string>(activeCase.poster.src || defaultHeroFallback);

  useEffect(() => {
    setHeroImg(activeCase.poster.src || defaultHeroFallback);
  }, [activeCase.poster.src, defaultHeroFallback]);

  return (
    <section
      id="section-hero"
      className="relative w-full max-w-full min-h-[500px] sm:min-h-[560px] md:min-h-[85vh] lg:min-h-screen bg-[#0E1016] flex flex-col justify-end pb-6 sm:pb-10 md:pb-14 pt-20 sm:pt-24 md:pt-28 overflow-hidden md:snap-start"
    >
      {/* Full Bleed Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImg}
          alt={activeCase.poster.alt || displayTitle}
          fill
          priority
          sizes="100vw"
          onError={() => setHeroImg(defaultHeroFallback)}
          className="object-cover object-center transform scale-105 transition-all duration-1000 brightness-60 sm:brightness-75"
        />

        {/* Cinematic Vignettes */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-[#0E1016] via-[#0E1016]/80 to-transparent w-full md:w-[70%] pointer-events-none" />
        <div className="md:hidden absolute inset-0 bg-gradient-to-b from-[#0E1016]/90 via-[#0E1016]/40 to-[#0E1016] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0E1016] via-[#0E1016]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0E1016]/90 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Body */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-end">
        <div className="max-w-2xl animate-fadeIn space-y-3 sm:space-y-3.5">
          {/* Tag & Court Identity Bar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="flex items-center gap-1 bg-[#E50914] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-2 sm:px-2.5 py-0.5 rounded-xs shadow-md">
              <span>PLEADINGS</span>
              <span className="font-sans font-normal opacity-80">ORIGINAL</span>
            </span>

            <span className="text-[#D4AF37] text-[11px] sm:text-xs font-mono font-semibold uppercase tracking-wider">
              {activeCase.court} · {activeCase.year}
            </span>
          </div>

          {/* Bold Billboard Title in Netflix Anton Style */}
          <h1 className="font-anton text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-[0.95] drop-shadow-xl">
            {displayTitle}
          </h1>

          {/* Subtitle / Citation in Amber Gold */}
          <p className="text-xs sm:text-sm font-semibold text-[#D4AF37] uppercase tracking-wider font-mono">
            {activeCase.court} · {activeCase.doctrines?.[0] || 'IPC 79'}
          </p>

          {/* Dramatic Story Hook */}
          <p className="text-xs sm:text-sm md:text-base text-[#e5e5e5] leading-relaxed line-clamp-3 font-sans drop-shadow-md">
            {displayHook}
          </p>

          {/* Action CTAs: Play Story, Evidence & Brief, Bookmark */}
          <div className="flex items-center gap-2 sm:gap-3 pt-1 sm:pt-2">
            {/* 1. Play Story */}
            <Link
              href={`/case/${activeCase.slug}`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-7 py-3 bg-white hover:bg-white/90 text-[#141414] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xs transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <span className="text-sm sm:text-base">▶</span>
              <span className="truncate">{language === 'en' ? 'Play Story' : 'स्टोरी शुरू करें'}</span>
            </Link>

            {/* 2. Evidence & Brief */}
            <Link
              href={`/case/${activeCase.slug}#episode-2`}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-6 py-3 bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xs backdrop-blur-md transition-all cursor-pointer border border-white/20"
            >
              <span>ℹ</span>
              <span className="truncate">{language === 'en' ? 'Evidence' : 'साक्ष्य'}</span>
            </Link>

            {/* 3. Bookmark Toggle */}
            <button
              onClick={() => toggleBookmark(activeCase.slug)}
              className={`p-3 rounded-xs border transition-all cursor-pointer text-xs sm:text-sm font-bold flex items-center justify-center min-w-[44px] min-h-[44px] flex-shrink-0 ${
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

        {/* Thumbnail Selector Bar for Cases */}
        <div className="pt-3 sm:pt-6 mt-4 sm:mt-8 border-t border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-none py-1 w-full max-w-full">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a9a49a] hidden sm:inline flex-shrink-0">
            {language === 'en' ? 'Quick Switch:' : 'त्वरित चुनाव:'}
          </span>
          {casesList.slice(0, 8).map((c, idx) => {
            const isSelected = c.slug === activeCase.slug;
            const rawItemTitle = language === 'hi' && c.hi ? c.hi.title : c.title;
            const cTitle = typeof rawItemTitle === 'string' ? rawItemTitle : ((rawItemTitle as any)?.[language] || (rawItemTitle as any)?.en || c.slug);
            return (
              <button
                key={c.slug}
                onClick={() => setActiveCase(c)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xs transition-all flex-shrink-0 cursor-pointer text-xs font-mono font-semibold ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-bold shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/10'
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="truncate max-w-[100px] sm:max-w-[160px] font-sans">{cTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
