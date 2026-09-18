'use client';

import React from 'react';
import Link from 'next/link';
import { GLOSSARY_TERMS } from '@/data/glossary';
import { useApp } from '@/context/AppContext';

export function LawTermModal() {
  const { activeTerm, closeTermModal, language } = useApp();

  if (!activeTerm) return null;

  // Find extended glossary details if available
  const glossaryDetails = GLOSSARY_TERMS.find((gt) => gt.id === activeTerm.id);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none"
      onClick={closeTermModal}
    >
      <div
        className="w-full max-w-lg bg-[#121520] p-6 sm:p-7 rounded-md border border-[#D4AF37]/50 shadow-[0_25px_50px_rgba(0,0,0,0.9)] animate-slideUp text-[#F3EFE6] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Bar */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#D4AF37] via-[#f59e0b] to-[#D4AF37]" />

        {/* Modal Header: Code & Category */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
              {activeTerm.code || (glossaryDetails ? glossaryDetails.code : 'LEGAL DEFINITION')}
            </span>
          </div>

          <button
            onClick={closeTermModal}
            className="w-7 h-7 rounded-xs flex items-center justify-center text-[#a9a49a] hover:text-white bg-white/5 hover:bg-white/15 transition-all cursor-pointer text-xs font-mono"
            aria-label="Close definition"
          >
            ✕
          </button>
        </div>

        {/* Term Name */}
        <h3 className="font-anton text-2xl sm:text-3xl text-white mb-2 tracking-tight uppercase leading-tight">
          {activeTerm.term[language] || activeTerm.term.en}
        </h3>

        {/* Pronunciation guide if available */}
        {glossaryDetails?.pronunciation && (
          <p className="text-[11px] font-mono text-[#8c887e] italic mb-4">
            Pronounced: {glossaryDetails.pronunciation}
          </p>
        )}

        {/* Plain-Language Explanation Box */}
        {glossaryDetails?.plainExplanation && (
          <div className="bg-[#181B28] p-4 rounded-xs border-l-2 border-[#D4AF37] mb-4">
            <span className="text-[9px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider block mb-1">
              {language === 'en' ? 'IN SIMPLE WORDS:' : 'सरल शब्दों में:'}
            </span>
            <p className="text-xs text-[#d5cfc5] leading-relaxed">
              {glossaryDetails.plainExplanation[language] || glossaryDetails.plainExplanation.en}
            </p>
          </div>
        )}

        {/* Formal Legal Definition */}
        <div className="mb-6">
          <span className="text-[9px] font-mono font-bold text-[#8c887e] uppercase tracking-wider block mb-1">
            {language === 'en' ? 'STATUTORY DEFINITION:' : 'कानूनी परिभाषा:'}
          </span>
          <p className="text-xs sm:text-sm text-[#c9c5bc] leading-[1.75] font-normal">
            {activeTerm.definition[language] || activeTerm.definition.en}
          </p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-mono">
          <Link
            href="/glossary"
            onClick={closeTermModal}
            className="text-[#D4AF37] hover:underline uppercase tracking-wider text-[10px]"
          >
            {language === 'en' ? 'Full Legal Glossary →' : 'पूरी कानूनी शब्दावली →'}
          </Link>

          <button
            onClick={closeTermModal}
            className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[#0E1016] bg-[#D4AF37] hover:bg-white transition-colors cursor-pointer rounded-xs"
          >
            {language === 'en' ? 'Got it' : 'समझ गए'}
          </button>
        </div>
      </div>
    </div>
  );
}
