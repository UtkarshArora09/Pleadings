'use client';

import React from 'react';
import { CharacterItem } from '@/types';
import { useApp } from '@/context/AppContext';

interface CharacterRosterProps {
  characters: CharacterItem[];
}

export function CharacterRoster({ characters }: CharacterRosterProps) {
  const { language } = useApp();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 my-4 w-full max-w-2xl mx-auto">
      {characters.map((char, index) => (
        <div
          key={index}
          className="bg-[#151821] border border-white/10 hover:border-[#D4AF37]/50 p-4 transition-all duration-300 rounded-xs flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{char.badgeEmoji || '👤'}</span>
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#D4AF37] bg-[#D4AF37]/10 px-2 py-0.5 rounded-xs">
                {char.role[language]}
              </span>
            </div>

            <h4 className="font-anton text-lg text-white uppercase tracking-wide mb-1 group-hover:text-[#D4AF37] transition-colors">
              {char.name[language]}
            </h4>

            <p className="text-[11px] font-semibold text-[#a9a49a] mb-2 uppercase tracking-wider">
              {char.tag[language]}
            </p>

            <p className="text-xs text-[#c4c0b6] leading-relaxed font-normal">
              {char.description[language]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
