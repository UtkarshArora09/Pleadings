'use client';

import React from 'react';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface ConstitutionalWideCardProps {
  caseData: CaseData;
}

export function ConstitutionalWideCard({ caseData }: ConstitutionalWideCardProps) {
  const { language } = useApp();

  return (
    <div className="group relative flex-shrink-0 w-80 sm:w-[440px] md:w-[480px] cursor-pointer select-none">
      <Link href={`/case/${caseData.slug}`} className="block h-full">
        <div className="relative h-full flex flex-col justify-between p-6 rounded-md bg-gradient-to-br from-[#12141C] to-[#0A0C12] border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.9)] overflow-hidden">
          
          {/* Subtle gold watermark emblem */}
          <div className="absolute -right-4 -bottom-4 text-7xl font-anton text-white/3 pointer-events-none select-none">
            {caseData.watermark || 'CONSTITUTION'}
          </div>

          <div>
            {/* Top Badge */}
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D4AF37]/20">
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                SUPREME COURT CONSTITUTION BENCH
              </span>
              <span className="text-[10px] font-mono text-white/60 font-semibold">
                {caseData.year}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-anton text-2xl text-white uppercase tracking-tight leading-tight mb-2 group-hover:text-[#D4AF37] transition-colors">
              {caseData.title[language]}
            </h3>

            {/* Citation */}
            <p className="text-[11px] font-mono text-[#D4AF37]/80 uppercase tracking-wider mb-3">
              {caseData.citation}
            </p>

            {/* Core Constitutional Doctrine / Blurb */}
            <p className="text-xs text-[#c9c5bc] leading-[1.7] line-clamp-2 font-sans font-normal mb-4">
              {caseData.blurb[language]}
            </p>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-white/60 uppercase">
              {caseData.tag[language]}
            </span>
            <span className="text-[#D4AF37] font-bold group-hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1">
              <span>Read Doctrine</span>
              <span>→</span>
            </span>
          </div>

        </div>
      </Link>
    </div>
  );
}
