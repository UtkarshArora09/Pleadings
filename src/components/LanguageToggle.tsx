'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export function LanguageToggle() {
  const { language, setLanguage } = useApp();

  return (
    <div
      role="group"
      aria-label="Language selection"
      className="inline-flex items-center bg-[#171A24] border border-white/15 rounded-full p-1 shadow-md"
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          language === 'en'
            ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
            : 'text-[#a9a49a] hover:text-white'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer ${
          language === 'hi'
            ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
            : 'text-[#a9a49a] hover:text-white'
        }`}
        aria-label="Switch to Hindi"
      >
        हिं
      </button>
    </div>
  );
}
