'use client';

import React from 'react';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface EvidenceDossierCardProps {
  caseData: CaseData;
}

export function EvidenceDossierCard({ caseData }: EvidenceDossierCardProps) {
  const { language } = useApp();
  const evidencePanel = caseData.panels.find((p) => p.type === 'EVIDENCE' || p.type === 'INCIDENT');
  const masthead = evidencePanel?.evidence?.masthead || 'FORENSIC INVESTIGATION RECORD';
  const exhibitNumber = evidencePanel?.evidence?.exhibitNumber || 'EXHIBIT 01';

  return (
    <div className="group relative flex-shrink-0 w-80 sm:w-96 md:w-[380px] cursor-pointer select-none">
      <Link href={`/case/${caseData.slug}`} className="block h-full">
        {/* Manila Docket Dossier Frame */}
        <div className="relative h-full flex flex-col justify-between p-5 sm:p-6 rounded-sm bg-[#161413] hover:bg-[#1c1918] border border-[#a89070]/30 hover:border-[#a89070]/70 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
          
          {/* Top Tape Accent */}
          <div className="absolute -top-2.5 left-8 z-20 w-16 h-4 bg-[#c5b89a]/40 border border-white/20 backdrop-blur-xs transform -rotate-1 shadow-xs pointer-events-none" />

          {/* Dossier Header */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#a89070]/20 text-[9px] font-mono font-bold uppercase tracking-widest text-[#a89070]">
              <span>{exhibitNumber}</span>
              <span>{caseData.court}</span>
            </div>

            {/* Title */}
            <h3 className="font-anton text-xl text-white uppercase tracking-tight leading-snug mb-1 group-hover:text-[#D4AF37] transition-colors">
              {caseData.title[language]}
            </h3>

            {/* Masthead Tag */}
            <span className="text-[10px] font-mono text-[#E50914] uppercase font-bold tracking-wider block mb-3">
              {masthead}
            </span>

            {/* Forensic Note */}
            <div className="bg-black/40 p-3 rounded-xs border border-[#a89070]/20 mb-4">
              <p className="text-xs text-[#d5cfc5] leading-relaxed italic font-serif">
                "{caseData.blurb[language]}"
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-[#a89070]/20 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#a89070] uppercase">
              {caseData.tag[language]}
            </span>
            <span className="text-white font-bold group-hover:text-[#D4AF37] transition-colors uppercase tracking-widest">
              Inspect Evidence →
            </span>
          </div>

        </div>
      </Link>
    </div>
  );
}
