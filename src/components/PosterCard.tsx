'use client';

import React from 'react';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface PosterCardProps {
  caseData: CaseData;
}

export function PosterCard({ caseData }: PosterCardProps) {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(caseData.slug);

  // Determine category color accent
  const isCrime = caseData.genre === 'crime';
  const isConstitutional = caseData.genre === 'constitutional' || caseData.genre === 'cyber';
  const accentColor = isCrime ? '#E50914' : isConstitutional ? '#D4AF37' : '#38bdf8';

  return (
    <div className="group relative flex-shrink-0 w-72 sm:w-80 md:w-[330px] cursor-pointer">
      <Link href={`/case/${caseData.slug}`} className="block h-full">
        {/* Sleek Professional Legal Dossier Card */}
        <div className="relative h-full flex flex-col justify-between p-5 rounded-md bg-[#13151D] hover:bg-[#181B24] border border-white/10 hover:border-white/30 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
          
          {/* Top colored accent line */}
          <div
            className="absolute top-0 inset-x-0 h-1 transition-all duration-300 group-hover:h-1.5"
            style={{ backgroundColor: accentColor }}
          />

          {/* Card Header: Category Tag & Bookmark */}
          <div>
            <div className="flex items-center justify-between gap-2 mb-3 pt-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-xs bg-white/5 border border-white/10 text-[#D4AF37]">
                {caseData.categoryTag || caseData.tag[language]}
              </span>

              {/* Bookmark Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleBookmark(caseData.slug);
                }}
                className={`w-6 h-6 rounded-xs flex items-center justify-center transition-all cursor-pointer text-xs font-mono ${
                  bookmarked
                    ? 'bg-[#E50914] text-white'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/15'
                }`}
                title={bookmarked ? 'Saved in My Library' : 'Save to My Library'}
                aria-label="Bookmark Case"
              >
                {bookmarked ? '✓' : '+'}
              </button>
            </div>

            {/* Case Title */}
            <h3 className="font-anton text-xl sm:text-2xl text-white uppercase tracking-tight leading-snug mb-1.5 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
              {caseData.title[language]}
            </h3>

            {/* Court & Landmark Year */}
            <p className="text-[11px] font-mono font-semibold text-[#8c887e] uppercase tracking-wider mb-3.5">
              {caseData.court} · {caseData.year}
            </p>

            {/* Readable Case Synopsis / Blurb */}
            <p className="text-xs text-[#c9c5bc] leading-[1.7] line-clamp-3 mb-5 font-sans font-normal">
              {caseData.blurb[language]}
            </p>
          </div>

          {/* Card Footer: Read Time & Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono tracking-wider">
            <span className="text-[#8c887e] uppercase">
              {caseData.readTime[language]}
            </span>

            <div className="flex items-center gap-1.5 text-white font-bold group-hover:text-[#D4AF37] transition-colors">
              <span className="uppercase tracking-widest text-[10px]">
                {language === 'en' ? 'Review Case' : 'केस पढ़ें'}
              </span>
              <span className="transform transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
