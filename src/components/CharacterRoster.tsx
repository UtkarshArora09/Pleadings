'use client';

import React from 'react';
import { PersonaItem } from '@/types/case';
import { CharacterItem } from '@/types';
import { useApp } from '@/context/AppContext';

interface CharacterRosterProps {
  characters?: PersonaItem[] | CharacterItem[];
  personas?: PersonaItem[] | CharacterItem[];
}

function resolveText(val: any, lang: 'en' | 'hi', nestedHi?: string): string {
  if (lang === 'hi' && nestedHi) return nestedHi;
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    return val[lang] || val['en'] || Object.values(val)[0] || '';
  }
  return String(val);
}

export function CharacterRoster({ characters, personas }: CharacterRosterProps) {
  const { language } = useApp();
  const list = personas || characters || [];

  if (!list || list.length === 0) return null;

  return (
    <div className="w-full my-6 space-y-4">
      {/* Section Sub-header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-[#D4AF37] uppercase tracking-[0.2em]">
            {language === 'hi' ? 'नाट्य पात्र · प्रमुख पक्ष एवं न्यायालय' : 'DRAMATIS PERSONAE · KEY LITIGANTS & BENCH'}
          </span>
        </div>
        <span className="text-[10px] font-mono font-semibold text-white/60 bg-white/5 px-2.5 py-0.5 rounded-xs border border-white/10">
          {list.length} {language === 'hi' ? 'पात्र' : list.length === 1 ? 'PERSONA' : 'PERSONAS'}
        </span>
      </div>

      {/* Dynamic Persona Columns (Each Persona in a Dedicated Box Card as per Wireframe) */}
      <div className="flex flex-col gap-3.5 w-full">
        {list.map((char: any, index) => {
          const personaNum = index + 1;
          const pLabel = personaNum < 10 ? `PERSONA 0${personaNum}` : `PERSONA ${personaNum}`;
          const name = resolveText(char.name, language, char.hi?.name);
          const role = resolveText(char.role, language, char.hi?.role);
          const tag = resolveText(char.tag, language, char.hi?.tag);
          const description = resolveText(char.description, language, char.hi?.description);

          return (
            <div
              key={index}
              className="bg-gradient-to-r from-[#141722] via-[#11141D] to-[#0D0F17] border border-white/10 hover:border-[#D4AF37]/60 border-l-4 border-l-[#D4AF37] p-4 sm:p-5 transition-all duration-200 rounded-xs shadow-lg group relative"
            >
              {/* Top Row: Persona Number Badge + Name + Role Pill */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 pb-2.5 border-b border-white/5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <div className="flex items-center gap-1.5 bg-[#D4AF37]/10 px-2 py-0.5 rounded-xs border border-[#D4AF37]/30">
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                      {pLabel}
                    </span>
                  </div>

                  <h3 className="font-anton text-base sm:text-lg text-white uppercase tracking-wide group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {name || `Persona ${personaNum}`}
                  </h3>
                </div>

                {role && (
                  <span className="text-[9px] font-mono font-bold uppercase tracking-[0.14em] text-[#D4AF37] bg-black/40 px-2.5 py-1 rounded-xs border border-white/10 shrink-0 self-start sm:self-auto">
                    {role}
                  </span>
                )}
              </div>

              {/* Tag / Designation (Optional) */}
              {tag && tag !== role && (
                <div className="text-[10px] font-mono font-medium text-[#a9a49a] mb-2 uppercase tracking-wider">
                  {tag}
                </div>
              )}

              {/* Persona Description */}
              <p className="text-xs sm:text-[13px] text-[#c9c5bc] leading-[1.8] font-normal font-sans">
                {description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
