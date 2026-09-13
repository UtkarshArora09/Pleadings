'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

interface AudioNarratorProps {
  textToRead: string;
  className?: string;
}

export function AudioNarrator({ textToRead, className = '' }: AudioNarratorProps) {
  const { language, isPlayingAudio, toggleAudio } = useApp();

  return (
    <button
      onClick={() => toggleAudio(textToRead, language)}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 border cursor-pointer ${
        isPlayingAudio
          ? 'bg-[#D4AF37] text-[#0E1016] border-[#D4AF37] shadow-lg animate-pulse'
          : 'bg-white/5 hover:bg-white/15 text-[#F3EFE6] border-white/20 hover:border-[#D4AF37]'
      } ${className}`}
      title={isPlayingAudio ? 'Pause Narration' : 'Listen to story narration'}
      aria-label="Narrate story panel"
    >
      {isPlayingAudio ? (
        <>
          <span className="flex items-center gap-0.5">
            <span className="w-1 h-3 bg-[#0E1016] animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-4 bg-[#0E1016] animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-2 bg-[#0E1016] animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
          <span>{language === 'en' ? 'Stop Audio' : 'ऑडियो रोकें'}</span>
        </>
      ) : (
        <>
          <span className="text-sm">🔊</span>
          <span>{language === 'en' ? 'Listen' : 'सुनें'}</span>
        </>
      )}
    </button>
  );
}
