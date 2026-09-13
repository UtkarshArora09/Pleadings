'use client';

import React, { useRef } from 'react';
import { CaseData } from '@/types';
import { PosterCard } from './PosterCard';

interface BrowseRowProps {
  title: string;
  subtitle?: string;
  cases: CaseData[];
}

export function BrowseRow({ title, subtitle, cases }: BrowseRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (rowRef.current) {
      rowRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  if (cases.length === 0) return null;

  return (
    <section className="mb-10 relative group/row">
      {/* Sleek Row Header */}
      <div className="px-4 md:px-12 mb-3 flex items-end justify-between">
        <div>
          <h2 className="font-anton text-lg sm:text-xl text-white uppercase tracking-wider">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-[#808080] mt-0.5 font-sans font-normal">
              {subtitle}
            </p>
          )}
        </div>

        {/* Desktop Carousel Scroll Arrows (clean glass buttons) */}
        <div className="hidden sm:flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200">
          <button
            onClick={scrollLeft}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer text-xs"
            aria-label="Scroll left"
          >
            ‹
          </button>
          <button
            onClick={scrollRight}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all cursor-pointer text-xs"
            aria-label="Scroll right"
          >
            ›
          </button>
        </div>
      </div>

      {/* Horizontal Shelves Container */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-4 md:px-12 pb-4 pt-1 snap-x snap-mandatory scrollbar-none"
      >
        {cases.map((caseItem) => (
          <div key={caseItem.slug} className="snap-start">
            <PosterCard caseData={caseItem} />
          </div>
        ))}
      </div>
    </section>
  );
}
