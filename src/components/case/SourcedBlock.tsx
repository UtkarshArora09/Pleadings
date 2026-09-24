'use client';

import React from 'react';
import { Block, Source } from '@/types/case';
import { parseRichText } from '@/lib/parseTerms';

interface SourcedBlockProps {
  block: Block;
  isFirstAmber?: boolean;
  onOpenSource: (source: Source) => void;
  onOpenTerm?: (slug: string) => void;
  onOpenStatute?: (oldSec: string) => void;
}

export function SourcedBlock({
  block,
  isFirstAmber = false,
  onOpenSource,
  onOpenTerm,
  onOpenStatute,
}: SourcedBlockProps) {
  const { text, source, type, items } = block;
  const isAmber = source.tier === 'AMBER';
  const isBlack = source.tier === 'BLACK';
  const isBlue = source.tier === 'BLUE';

  const renderedContent = parseRichText(text, onOpenTerm, onOpenStatute);

  // Pill button for source
  const sourcePill = (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onOpenSource(source);
      }}
      className={`inline-flex items-center justify-center font-mono align-super text-[10px] px-1.5 py-0.2 rounded-xs ml-1 transition-all cursor-pointer select-none font-bold ${
        isBlack
          ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-black'
          : isBlue
          ? 'bg-sky-900/40 text-sky-300 border border-sky-600/50 hover:bg-sky-500 hover:text-black'
          : 'hidden'
      }`}
      title={isBlack ? `View judgment paragraph ¶${source.para}` : 'View verified secondary source'}
      aria-label={isBlack ? `Paragraph ${source.para}` : 'Source reference'}
    >
      {isBlack ? `¶${source.para ?? ''}` : '†'}
    </button>
  );

  return (
    <div className="my-3 sm:my-4">
      {/* Block by Type */}
      {type === 'para' && (
        <p
          className={`text-sm sm:text-base leading-relaxed ${
            isAmber
              ? 'text-[#f0e6d2] italic pl-3.5 border-l-2 border-[#D4AF37]/60 font-serif'
              : 'text-[#E0DCD3] font-sans'
          }`}
        >
          {renderedContent}
          {(isBlack || isBlue) && sourcePill}
        </p>
      )}

      {type === 'pullquote' && (
        <blockquote className="my-4 p-4 bg-[#141824] border-l-3 border-[#D4AF37] rounded-r-xs italic text-base sm:text-lg text-white/95 font-serif leading-relaxed">
          "{renderedContent}"
          {(isBlack || isBlue) && sourcePill}
        </blockquote>
      )}

      {type === 'callout' && (
        <div className="my-4 p-3.5 sm:p-4 bg-[#181B26] border border-white/10 rounded-xs text-xs sm:text-sm text-white/90 space-y-1">
          <div className="font-mono text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
            KEY LEGAL FACT
          </div>
          <div>
            {renderedContent}
            {(isBlack || isBlue) && sourcePill}
          </div>
        </div>
      )}

      {type === 'list' && items && items.length > 0 && (
        <ul className="list-disc list-inside space-y-1.5 text-sm sm:text-base text-[#E0DCD3] pl-2 my-2">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {parseRichText(item, onOpenTerm, onOpenStatute)}
              {idx === items.length - 1 && (isBlack || isBlue) && sourcePill}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
