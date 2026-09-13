'use client';

import React from 'react';
import { ArgumentSide } from '@/types';
import { useApp } from '@/context/AppContext';

interface ArgumentsGridProps {
  prosecutionArgs?: ArgumentSide;
  defenceArgs?: ArgumentSide;
}

export function ArgumentsGrid({ prosecutionArgs, defenceArgs }: ArgumentsGridProps) {
  const { language } = useApp();

  if (!prosecutionArgs || !defenceArgs) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4 w-full max-w-2xl mx-auto">
      {/* Prosecution / Appellant Box */}
      <div className="bg-[#1c1214] border border-[#B23A2E]/40 p-5 rounded-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#B23A2E]/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B23A2E]">
              {prosecutionArgs.party[language]}
            </span>
            <span className="text-sm">⚔️</span>
          </div>

          {prosecutionArgs.statute && (
            <span className="text-[10px] font-mono text-[#D4AF37] block mb-2 font-semibold">
              {prosecutionArgs.statute}
            </span>
          )}

          <h4 className="font-bold text-sm text-[#F3EFE6] leading-snug mb-3">
            "{prosecutionArgs.claim[language]}"
          </h4>

          <p className="text-xs text-[#c9c5bc] leading-relaxed">
            {prosecutionArgs.keyPoint[language]}
          </p>
        </div>
      </div>

      {/* Defence / Respondent Box */}
      <div className="bg-[#12161f] border border-[#3b82f6]/40 p-5 rounded-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#3b82f6]/20">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60a5fa]">
              {defenceArgs.party[language]}
            </span>
            <span className="text-sm">🛡️</span>
          </div>

          {defenceArgs.statute && (
            <span className="text-[10px] font-mono text-[#D4AF37] block mb-2 font-semibold">
              {defenceArgs.statute}
            </span>
          )}

          <h4 className="font-bold text-sm text-[#F3EFE6] leading-snug mb-3">
            "{defenceArgs.claim[language]}"
          </h4>

          <p className="text-xs text-[#c9c5bc] leading-relaxed">
            {defenceArgs.keyPoint[language]}
          </p>
        </div>
      </div>
    </div>
  );
}
