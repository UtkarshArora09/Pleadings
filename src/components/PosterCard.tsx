'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface PosterCardProps {
  caseData: CaseData;
}

export function PosterCard({ caseData }: PosterCardProps) {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(caseData.slug);

  return (
    <div className="group relative flex-shrink-0 w-64 sm:w-72 md:w-80 cursor-pointer">
      {/* Sleek 16:9 Thumbnail Card */}
      <Link href={`/case/${caseData.slug}`} className="block">
        <div className="relative aspect-video w-full rounded-md overflow-hidden bg-[#181818] border border-white/10 transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-white/30 group-hover:shadow-2xl">
          {/* Cover Art */}
          <Image
            src={caseData.bannerImage}
            alt={caseData.title[language]}
            fill
            sizes="(max-width: 768px) 260px, 320px"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-110 brightness-90 group-hover:brightness-100"
          />

          {/* Subtle bottom gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

          {/* Minimalist overlay tag (top left) */}
          <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
            <span className="bg-black/70 backdrop-blur-md text-[#D4AF37] border border-white/10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs">
              {caseData.categoryTag}
            </span>
          </div>

          {/* Bookmark button (top right) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(caseData.slug);
            }}
            className={`absolute top-2.5 right-2.5 z-20 w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
              bookmarked
                ? 'bg-[#E50914] text-white shadow-md'
                : 'bg-black/60 text-white/70 hover:text-white hover:bg-black/90'
            }`}
            title={bookmarked ? 'Remove from My List' : 'Add to My List'}
            aria-label="Bookmark Case"
          >
            <span className="text-xs font-bold leading-none">{bookmarked ? '✓' : '+'}</span>
          </button>

          {/* Title & match at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 p-3 z-10">
            <h3 className="font-anton text-lg sm:text-xl text-white uppercase tracking-wide leading-tight group-hover:text-[#E50914] transition-colors line-clamp-1 drop-shadow-md">
              {caseData.title[language]}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-[#a9a49a] mt-0.5 font-sans">
              <span className="text-[#46d369] font-bold">{caseData.matchRate}% Match</span>
              <span>•</span>
              <span>{caseData.court}</span>
              <span>•</span>
              <span>{caseData.year}</span>
            </div>
          </div>

          {/* Hover Play Button Icon */}
          <div className="absolute inset-0 z-15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white/95 text-[#141414] flex items-center justify-center text-sm font-bold shadow-xl">
              ▶
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
