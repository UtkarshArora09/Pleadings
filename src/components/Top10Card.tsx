'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CaseFile } from '@/types/case';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface Top10CardProps {
  caseData: CaseFile | CaseData;
  index: number;
}

export function Top10Card({ caseData, index }: Top10CardProps) {
  const { language, toggleBookmark, isBookmarked } = useApp();
  const rank = index + 1;
  const bookmarked = isBookmarked(caseData.slug);

  // Normalizing fields between CaseFile and CaseData
  const rawTitle = (caseData as any).title;
  const title = typeof rawTitle === 'string'
    ? (language === 'hi' && (caseData as CaseFile).hi ? (caseData as CaseFile).hi?.title : rawTitle)
    : (rawTitle?.[language] || rawTitle?.en || caseData.slug);

  const rawTag = (caseData as any).tag || (caseData as any).categoryTag || (caseData as CaseFile).doctrines?.[0] || 'IPC';
  const categoryTag = typeof rawTag === 'string' ? rawTag : (rawTag?.[language] || rawTag?.en || 'IPC');

  const rawReadTime = (caseData as CaseFile).readingTime?.story ?? (caseData as any).readTime;
  const readTimeStr = typeof rawReadTime === 'number'
    ? `${rawReadTime} min read`
    : typeof rawReadTime === 'string'
    ? rawReadTime
    : ((rawReadTime as any)?.[language] || (rawReadTime as any)?.en || '5 min read');

  const rawCourt = (caseData as any).court;
  const displayCourt = typeof rawCourt === 'string' ? rawCourt : ((rawCourt as any)?.[language] || (rawCourt as any)?.en || 'Supreme Court of India');

  const bannerImg = (caseData as CaseFile).poster?.src || (caseData as any).bannerImage || '/images/cases/ghost-case.jpg';

  const defaultFallback = '/images/cases/ghost-case.jpg';
  const [imgSrc, setImgSrc] = React.useState<string>(bannerImg);

  React.useEffect(() => {
    setImgSrc(bannerImg);
  }, [bannerImg]);

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
            src={imgSrc}
            alt={String(title)}
            fill
            unoptimized={typeof imgSrc === 'string' && (imgSrc.startsWith('data:') || imgSrc.startsWith('blob:'))}
            sizes="220px"
            onError={() => setImgSrc(defaultFallback)}
            className="object-cover object-center brightness-90 group-hover:brightness-100 transition-transform duration-500 group-hover:scale-110"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

          {/* Top category badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-[#E50914] text-white text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-xs shadow-md">
              {categoryTag}
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
              {displayCourt}
            </span>
            <h3 className="font-anton text-base sm:text-lg text-white uppercase tracking-tight leading-tight line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
              {title}
            </h3>
            <span className="text-[10px] font-mono text-white/60 block mt-1">
              {caseData.year} · {readTimeStr}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
