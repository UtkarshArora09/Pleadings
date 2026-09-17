'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CaseFile } from '@/types/case';
import { StatusBadge } from '@/components/case/StatusBadge';
import { useApp } from '@/context/AppContext';

interface CaseCardProps {
  caseData: CaseFile;
  className?: string;
  priority?: boolean;
}

export function CaseCard({ caseData, className = '', priority = false }: CaseCardProps) {
  const { language, isBookmarked, toggleBookmark } = useApp();
  const [hasVoted, setHasVoted] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [caseData.poster.src]);

  useEffect(() => {
    const saved = localStorage.getItem('pleadings:votes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed[caseData.slug]) {
          setHasVoted(true);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [caseData.slug]);

  const activeContent = language === 'hi' && caseData.hi ? caseData.hi : caseData;
  const rawTitle = activeContent.title;
  const displayTitle = typeof rawTitle === 'string' ? rawTitle : ((rawTitle as any)?.[language] || (rawTitle as any)?.en || caseData.slug);
  const rawHook = activeContent.hook;
  const displayHook = typeof rawHook === 'string' ? rawHook : ((rawHook as any)?.[language] || (rawHook as any)?.en || '');
  const doctrine = (activeContent.doctrines && activeContent.doctrines[0]) || 'Constitutional Law';
  const readTime = `${caseData.readingTime?.story || 5} min`;
  const bookmarked = isBookmarked(caseData.slug);

  return (
    <div
      className={`group relative flex flex-col justify-between bg-[#12141C] hover:bg-[#181C26] border border-white/10 hover:border-[#D4AF37]/60 rounded-xs overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] select-none ${className}`}
    >
      <Link href={`/case/${caseData.slug}`} className="block flex-1">
        {/* Poster Image Container */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-black/80">
          {hasError || !caseData.poster.src ? (
            <div className="w-full h-full flex flex-col items-center justify-center bg-[#12141C] border border-red-500/30 p-3 text-center">
              <span className="text-red-400 font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                ✕ Error loading image
              </span>
              <span className="text-white/40 text-[9px] font-mono truncate max-w-full px-1">
                {displayTitle}
              </span>
            </div>
          ) : (
            <Image
              src={caseData.poster.src}
              alt={caseData.poster.alt || displayTitle}
              fill
              unoptimized={typeof caseData.poster.src === 'string' && (caseData.poster.src.startsWith('data:') || caseData.poster.src.startsWith('blob:'))}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={priority}
              onError={() => setHasError(true)}
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90 group-hover:brightness-100"
            />
          )}

          {/* Top Overlay Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1 pointer-events-none z-10">
            <StatusBadge status={caseData.status} size="sm" interactive={false} />

            {hasVoted && (
              <span className="px-2 py-0.5 bg-black/80 backdrop-blur-xs text-[#D4AF37] border border-[#D4AF37]/50 rounded-2xs text-[9px] font-mono font-bold tracking-wider uppercase">
                VOTED ✓
              </span>
            )}
          </div>

          {/* Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#12141C] via-transparent to-black/30 pointer-events-none" />
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-2.5">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[10px] font-mono text-white/50">
            <span className="font-bold text-[#D4AF37] uppercase truncate max-w-[65%]">
              {caseData.court} · {caseData.year}
            </span>
            <span>⏱ {readTime}</span>
          </div>

          {/* Title in Netflix Font-Anton Style */}
          <h3 className="font-anton text-lg sm:text-xl text-white group-hover:text-[#D4AF37] uppercase tracking-tight leading-snug line-clamp-2 transition-colors">
            {displayTitle}
          </h3>

          {/* Hook */}
          <p className="text-xs text-[#a9a49a] font-sans leading-relaxed line-clamp-2">
            {displayHook}
          </p>

          {/* Doctrine Chip */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-white/5 border border-white/10 rounded-2xs text-white/70">
              § {doctrine}
            </span>
          </div>
        </div>
      </Link>

      {/* Card Action Footprint */}
      <div className="px-4 pb-3.5 pt-1 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
        <Link
          href={`/case/${caseData.slug}`}
          className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1"
        >
          <span>Read Story</span>
          <span>→</span>
        </Link>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleBookmark(caseData.slug);
          }}
          className={`p-1.5 rounded-xs transition-colors cursor-pointer text-xs ${
            bookmarked
              ? 'text-[#E50914] bg-[#E50914]/10'
              : 'text-white/40 hover:text-white hover:bg-white/10'
          }`}
          title={bookmarked ? 'Remove bookmark' : 'Bookmark case'}
          aria-label="Bookmark case"
        >
          {bookmarked ? '★' : '☆'}
        </button>
      </div>
    </div>
  );
}
