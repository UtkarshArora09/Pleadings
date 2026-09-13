'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface Top10CardProps {
  caseData: CaseData;
  index: number;
}

export function Top10Card({ caseData, index }: Top10CardProps) {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const rank = index + 1;
  const bookmarked = isBookmarked(caseData.slug);

  return (
    <div className="group relative flex-shrink-0 flex items-center cursor-pointer select-none">
      <Link href={`/case/${caseData.slug}`} className="flex items-center">
        {/* Giant Metallic Rank Number */}
        <div className="relative z-10 -mr-5 sm:-mr-7 flex-shrink-0 select-none pointer-events-none">
          <span
            className="font-anton text-7xl sm:text-8xl md:text-9xl tracking-tighter leading-none"
            style={{
              WebkitTextStroke: '2px rgba(255,255,255,0.3)',
              color: '#0e1017',
              textShadow: '0 10px 24px rgba(0,0,0,0.95)',
            }}
          >
            {rank}
          </span>
        </div>

        {/* Portrait Poster Card */}
        <div className="relative w-44 sm:w-48 md:w-52 aspect-[2/3] rounded-md overflow-hidden bg-[#151722] border border-white/10 group-hover:border-[#D4AF37] transition-all duration-300 ease-out group-hover:scale-105 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
          {/* Cover Art */}
          <Image
            src={caseData.bannerImage}
            alt={caseData.title[language]}
            fill
            sizes="220px"
            className="object-cover object-center brightness-90 group-hover:brightness-100 transition-transform duration-500 group-hover:scale-110"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Top category badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-[#E50914] text-white text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-xs shadow-md">
              {caseData.categoryTag}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(caseData.slug);
            }}
            className={`absolute top-2.5 right-2.5 z-20 w-6 h-6 rounded-xs flex items-center justify-center transition-all cursor-pointer text-xs font-mono backdrop-blur-md ${
              bookmarked
                ? 'bg-[#E50914] text-white'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/90'
            }`}
            title={bookmarked ? 'Saved' : 'Save'}
          >
            {bookmarked ? '✓' : '+'}
          </button>

          {/* Bottom Title & Meta */}
          <div className="absolute inset-x-0 bottom-0 p-3.5 z-10">
            <span className="text-[9px] font-mono text-[#D4AF37] font-bold tracking-widest uppercase block mb-0.5">
              {caseData.court}
            </span>
            <h3 className="font-anton text-base sm:text-lg text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
              {caseData.title[language]}
            </h3>
            <span className="text-[10px] font-mono text-white/60 block mt-1">
              {caseData.year} · {caseData.readTime[language]}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
