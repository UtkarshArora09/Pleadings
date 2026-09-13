'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export function LawTermModal() {
  const { activeTerm, closeTermModal, language } = useApp();

  if (!activeTerm) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={closeTermModal}
    >
      <div
        className="w-full max-w-xl bg-[#12151d] p-6 md:p-8 shadow-2xl animate-slideUp text-[#F3EFE6]"
        style={{ borderTop: '2px solid #D4AF37' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between pb-4 mb-5"
          style={{ borderBottom: '1px solid rgba(243,239,230,0.08)' }}
        >
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
            {activeTerm.code}
          </span>
          <button
            onClick={closeTermModal}
            className="w-7 h-7 flex items-center justify-center text-[#a9a49a] hover:text-white transition-colors cursor-pointer text-sm"
            aria-label="Close definition"
          >
            ✕
          </button>
        </div>

        <h3 className="font-anton text-2xl md:text-3xl text-white mb-4 tracking-wide capitalize leading-tight">
          {activeTerm.term[language]}
        </h3>

        <p className="text-sm md:text-base text-[#c9c5bc] leading-[1.8] font-normal mb-7">
          {activeTerm.definition[language]}
        </p>

        <button
          onClick={closeTermModal}
          className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#0E1016] bg-[#D4AF37] hover:bg-white transition-colors cursor-pointer"
        >
          {language === 'en' ? 'Dismiss' : 'बंद करें'}
        </button>
      </div>
    </div>
  );
}
