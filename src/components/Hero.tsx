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
  const displayTitle = activeContent.title;
  const displayHook = activeContent.hook;
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
    <section className="relative w-full min-h-[640px] md:min-h-[700px] bg-[#141414] flex items-end pb-12 sm:pb-16 overflow-hidden select-none">
      {/* Full Bleed Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImg}
          alt={activeCase.poster.alt || displayTitle}
          fill
          priority
          sizes="100vw"
          onError={() => setHeroImg(defaultHeroFallback)}
          className="object-cover object-center transform scale-105 transition-all duration-1000 brightness-60"
        />

        {/* Cinematic Vignettes */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0E1016] via-[#0E1016]/80 to-transparent w-full md:w-[70%] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0E1016] via-[#0E1016]/80 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0E1016]/90 to-transparent pointer-events-none" />
      </div>

      {/* Hero Content Body */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex flex-col justify-end">
        <div className="max-w-2xl animate-fadeIn space-y-3.5">
          {/* Tag & Court Identity Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="flex items-center gap-1 bg-[#E50914] text-white text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-xs shadow-md">
              <span>PLEADINGS</span>
              <span className="font-sans font-normal opacity-80">ORIGINAL</span>
            </span>

            <span className="text-[#D4AF37] text-xs font-mono font-semibold uppercase tracking-wider">
              {activeCase.court} · {activeCase.year}
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-bold tracking-tight leading-[1.05] drop-shadow-md">
            {displayTitle}
          </h1>

          {/* Dramatic Story Hook */}
          <p className="text-sm sm:text-base md:text-lg text-[#E0DCD3] leading-relaxed font-serif italic drop-shadow-sm">
            "{displayHook}"
          </p>

          {/* Status Badge & Provenance Strip */}
          <div className="pt-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <StatusBadge status={activeCase.status} size="md" />
            </div>
            <ProvenanceStrip
              citation={activeCase.citations.primary}
              paragraphsCitedCount={totalParasCited}
              reviewer={activeCase.review.reviewer}
              lastVerifiedDate={activeCase.review.reviewedOn}
            />
          </div>

          {/* CTA Row */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            {/* 1. [▶ Read Story · 5 min] */}
            <Link
              href={`/case/${activeCase.slug}`}
              className="flex items-center gap-2 px-6 sm:px-7 py-3 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xs transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              <span>▶</span>
              <span>{language === 'en' ? `Read Story · ${activeCase.readingTime?.story || 5} min` : `कहानी पढ़ें · ${activeCase.readingTime?.story || 5} मिनट`}</span>
            </Link>

            {/* 2. [⚖ Jump to Verdict] */}
            <Link
              href={`/case/${activeCase.slug}#episode-7`}
              className="flex items-center gap-2 px-5 sm:px-6 py-3 bg-white/15 hover:bg-white/25 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xs backdrop-blur-md transition-all cursor-pointer border border-white/20"
            >
              <span>⚖</span>
              <span>{language === 'en' ? 'Jump to Verdict' : 'फैसला देखें'}</span>
            </Link>

            {/* 3. [+ Save] */}
            <button
              onClick={() => toggleBookmark(activeCase.slug)}
              className={`px-4 py-3 rounded-xs border font-bold text-xs sm:text-sm uppercase tracking-wider transition-all cursor-pointer ${
                bookmarked
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
              title={bookmarked ? 'Saved in library' : 'Save case'}
            >
              {bookmarked ? '✓ Saved' : '+ Save'}
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Bar for Cases */}
        <div className="pt-6 mt-8 border-t border-white/10 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#a9a49a] hidden sm:inline flex-shrink-0">
            {language === 'en' ? 'Quick Switch:' : 'त्वरित चुनाव:'}
          </span>
          {casesList.slice(0, 6).map((c, idx) => {
            const isSelected = c.slug === activeCase.slug;
            const cTitle = language === 'hi' && c.hi ? c.hi.title : c.title;
            return (
              <button
                key={c.slug}
                onClick={() => setActiveCase(c)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xs transition-all flex-shrink-0 cursor-pointer text-xs font-mono font-semibold ${
                  isSelected
                    ? 'bg-[#D4AF37] text-black font-bold shadow-lg scale-105'
                    : 'bg-white/10 hover:bg-white/20 text-white/80 border border-white/10'
                }`}
              >
                <span>#{idx + 1}</span>
                <span className="truncate max-w-[120px] sm:max-w-[160px] font-sans">{cTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
