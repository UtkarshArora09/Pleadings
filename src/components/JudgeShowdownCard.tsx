'use client';

import React from 'react';
import Link from 'next/link';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface JudgeShowdownCardProps {
  caseData: CaseData;
}

export function JudgeShowdownCard({ caseData }: JudgeShowdownCardProps) {
  const { language } = useApp();
  const decisionPanel = caseData.panels.find((p) => p.type === 'YOU_DECIDE')?.judgeDecision;
  const opt1 = decisionPanel?.options[0];
  const opt2 = decisionPanel?.options[1];

  return (
    <div className="group relative flex-shrink-0 w-80 sm:w-96 md:w-[410px] cursor-pointer select-none">
      <Link href={`/case/${caseData.slug}`} className="block h-full">
        <div className="relative h-full flex flex-col justify-between p-5 sm:p-6 rounded-md bg-[#131620] hover:bg-[#181C28] border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)]">
          
          {/* Header Tag */}
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#E50914] animate-pulse" />
              <span>JUDICIAL DELIBERATION</span>
            </span>
            <span className="text-[10px] font-mono text-white/50 uppercase">
              {caseData.court} · {caseData.year}
            </span>
          </div>

          {/* Question / Dilemma */}
          <div className="mb-4">
            <h3 className="font-anton text-lg sm:text-xl text-white uppercase tracking-tight leading-snug mb-2 group-hover:text-[#D4AF37] transition-colors">
              {caseData.title[language]}
            </h3>
            <p className="text-xs text-[#c9c5bc] leading-relaxed line-clamp-2 font-sans font-normal">
              {decisionPanel?.question[language] || caseData.blurb[language]}
            </p>
          </div>

          {/* Showdown Split Bar */}
          {opt1 && opt2 && (
            <div className="my-3 bg-black/40 p-3 rounded-xs border border-white/5">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold mb-1.5 uppercase">
                <span className="text-[#38bdf8] truncate max-w-[45%]">{opt1.title[language]}</span>
                <span className="text-[#f59e0b] truncate max-w-[45%] text-right">{opt2.title[language]}</span>
              </div>
              
              {/* Proportional Split Bar */}
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="bg-[#38bdf8] h-full" style={{ width: `${opt1.simulatedVotesPercent}%` }} />
                <div className="bg-[#f59e0b] h-full" style={{ width: `${opt2.simulatedVotesPercent}%` }} />
              </div>

              <div className="flex items-center justify-between text-[9px] font-mono text-white/50 mt-1">
                <span>{opt1.simulatedVotesPercent}% Student Votes</span>
                <span>{opt2.simulatedVotesPercent}% Student Votes</span>
              </div>
            </div>
          )}

          {/* Footer Action */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#D4AF37] uppercase tracking-wider font-bold">
              {caseData.categoryTag}
            </span>
            <span className="text-white font-bold group-hover:text-[#D4AF37] transition-colors flex items-center gap-1 uppercase tracking-widest">
              <span>Enter Bench</span>
              <span>→</span>
            </span>
          </div>

        </div>
      </Link>
    </div>
  );
}
