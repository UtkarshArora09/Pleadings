'use client';

import React, { useRef } from 'react';
import { CaseFile } from '@/types/case';
import { Top10Card } from './Top10Card';

interface Top10CarouselProps {
  cases: CaseFile[];
}

export function Top10Carousel({ cases }: Top10CarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="space-y-4">
      {/* Header & Scroll Controls */}
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-3">
        <div>
          <h2 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
            TOP 10 LANDMARK PRECEDENTS IN INDIA
          </h2>
          <p className="text-xs sm:text-sm text-[#a9a49a] font-sans mt-0.5">
            Most referenced court rulings by law students, advocates, and citizens
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            aria-label="Previous Cases"
          >
            ‹
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition-all cursor-pointer"
            aria-label="Next Cases"
          >
            ›
          </button>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-6 overflow-x-auto pb-4 pt-2 scrollbar-none scroll-smooth pl-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {cases.slice(0, 10).map((caseItem, idx) => (
          <Top10Card
            key={caseItem.slug}
            caseData={caseItem}
            index={idx}
          />
        ))}
      </div>
    </section>
  );
}
