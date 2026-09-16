'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseFile } from '@/types/case';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface PosterCardProps {
  caseData: CaseFile | CaseData;
}

export function PosterCard({ caseData }: PosterCardProps) {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const bookmarked = isBookmarked(caseData.slug);

  // Normalizing fields
  const title = typeof (caseData as CaseFile).title === 'string'
    ? (language === 'hi' && (caseData as CaseFile).hi ? (caseData as CaseFile).hi?.title : (caseData as CaseFile).title)
    : (caseData as CaseData).title?.[language] || (caseData as CaseFile).title;

  const hook = typeof (caseData as CaseFile).hook === 'string'
    ? (language === 'hi' && (caseData as CaseFile).hi ? (caseData as CaseFile).hi?.hook : (caseData as CaseFile).hook)
    : (caseData as CaseData).blurb?.[language] || (caseData as CaseFile).hook;

  const bannerImg = (caseData as CaseFile).poster?.src || (caseData as CaseData).bannerImage || '/images/cases/ghost-case.jpg';
  const categoryTag = (caseData as any).tag || (caseData as CaseData).categoryTag || (caseData as CaseFile).doctrines?.[0] || 'IPC';
  const readTimeStr = typeof (caseData as CaseFile).readingTime?.story === 'number'
    ? `${(caseData as CaseFile).readingTime.story} min read`
    : (caseData as CaseData).readTime?.[language] || '5 min read';

  const isCrime = String((caseData as any).tag || (caseData as CaseData).genre || (caseData as CaseFile).doctrines?.[0] || '').toLowerCase().includes('ipc') || (caseData as CaseData).genre === 'crime';
  const accentColor = isCrime ? '#E50914' : '#D4AF37';

  const defaultFallback = '/images/cases/ghost-case.jpg';
  const [imgSrc, setImgSrc] = React.useState<string>(bannerImg);

  React.useEffect(() => {
    setImgSrc(bannerImg);
  }, [bannerImg]);

  return (
    <div className="group relative flex-shrink-0 w-72 sm:w-80 md:w-[330px] cursor-pointer select-none">
      <Link href={`/case/${caseData.slug}`} className="block h-full">
        {/* Modern Editorial Legal Card */}
        <div className="relative h-full flex flex-col justify-between p-4 sm:p-5 rounded-md bg-[#12141D] hover:bg-[#171A26] border border-white/10 hover:border-white/25 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
          
          {/* Top Bar: Clean Tag & Bookmark */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span
              className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs bg-white/5 border border-white/10"
              style={{ color: accentColor }}
            >
              {categoryTag}
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#8c887e]">
                {caseData.year}
              </span>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleBookmark(caseData.slug);
                }}
                className={`w-6 h-6 rounded-xs flex items-center justify-center transition-all cursor-pointer text-xs font-mono border ${
                  bookmarked
                    ? 'bg-[#E50914] text-white border-[#E50914]'
                    : 'bg-white/5 text-[#8c887e] hover:text-white border-white/10 hover:bg-white/10'
                }`}
                title={bookmarked ? 'Saved in My Library' : 'Save to My Library'}
                aria-label="Bookmark Case"
              >
                {bookmarked ? '✓' : '+'}
              </button>
            </div>
          </div>

          {/* Cinematic Photo Thumbnail with Play Glow on Hover */}
          <div className="relative w-full aspect-[16/9] rounded-xs overflow-hidden bg-[#0A0C12] mb-3.5 border border-white/5">
            <Image
              src={imgSrc}
              alt={String(title)}
              fill
              sizes="(max-width: 640px) 280px, 330px"
              onError={() => setImgSrc(defaultFallback)}
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105 brightness-90 group-hover:brightness-100"
            />

            {/* Subtle Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#12141D]/80 via-transparent to-transparent pointer-events-none" />

            {/* Play Button Overlay on Hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg text-white text-sm pl-0.5">
                ▶
              </div>
            </div>
          </div>

          {/* Case Content: Title & Court & Synopsis */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] block mb-1 font-semibold truncate">
                {caseData.court}
              </span>

              <h3 className="font-anton text-xl text-white uppercase tracking-tight leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-1">
                {title}
              </h3>

              <p className="text-xs text-[#c9c5bc] leading-relaxed line-clamp-2 font-sans font-normal mb-3">
                {hook}
              </p>
            </div>

            {/* Bottom Footer: Read Time & Action CTA */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#8c887e] uppercase">
                {readTimeStr}
              </span>

              <div className="flex items-center gap-1 text-white font-bold group-hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
                <span>{language === 'en' ? 'Review Case' : 'केस पढ़ें'}</span>
                <span className="transform transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
}
