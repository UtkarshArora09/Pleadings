'use client';

import React from 'react';
import { Source } from '@/types/case';

interface ParaSheetProps {
  source: Source | null;
  isOpen: boolean;
  onClose: () => void;
  caseTitle?: string;
}

export function ParaSheet({ source, isOpen, onClose, caseTitle }: ParaSheetProps) {
  if (!isOpen || !source) return null;

  const isBlack = source.tier === 'BLACK';
  const isBlue = source.tier === 'BLUE';

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center sm:justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fadeIn cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Modal (Mobile: Bottom Sheet, Desktop: Right Drawer) */}
      <aside
        className="relative z-10 w-full sm:max-w-md sm:h-full bg-[#12141C] text-[#F3EFE6] border-t sm:border-t-0 sm:border-l border-[#D4AF37]/30 shadow-2xl rounded-t-2xl sm:rounded-none p-6 flex flex-col max-h-[85vh] sm:max-h-full animate-slideUp sm:animate-slideLeft overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="parasheet-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded-xs ${
                isBlack
                  ? 'bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40'
                  : 'bg-sky-950 text-sky-300 border border-sky-600/40'
              }`}
            >
              {isBlack ? `VERBATIM JUDGMENT · ¶${source.para ?? ''}` : 'SECONDARY SOURCE · VERIFIED'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-lg leading-none"
            aria-label="Close judgment sheet"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 space-y-4">
          <h3 id="parasheet-title" className="font-serif text-lg font-bold text-white leading-snug">
            {isBlack ? `Certified Judicial Record: Paragraph ${source.para}` : (source.secondary?.publication || 'Historical Record')}
          </h3>

          {caseTitle && (
            <div className="text-xs font-mono text-[#D4AF37] tracking-wider uppercase">
              {caseTitle}
            </div>
          )}

          {/* Citation badge */}
          {source.cite && (
            <div className="p-2.5 bg-black/40 rounded-xs border border-white/10 text-xs font-mono text-white/80">
              <span className="text-[#a9a49a] block text-[10px] uppercase tracking-wider mb-0.5">Citation</span>
              {source.cite}
            </div>
          )}

          {/* Verbatim quote */}
          {source.paraText && (
            <div className="p-4 bg-[#181B26] rounded-xs border-l-2 border-[#D4AF37] text-sm font-serif italic text-white/90 leading-relaxed space-y-2">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#D4AF37] block not-italic">
                VERBATIM TEXT FROM CERTIFIED BENCH COPY
              </span>
              <p>"{source.paraText}"</p>
            </div>
          )}

          {/* Secondary details */}
          {isBlue && source.secondary && (
            <div className="p-3 bg-sky-950/30 rounded-xs border border-sky-500/20 text-xs text-sky-200/90 space-y-1">
              <div><strong>Publication:</strong> {source.secondary.publication}</div>
              <div><strong>Recorded Date:</strong> {source.secondary.date}</div>
            </div>
          )}
        </div>

        {/* Action Link to Indian Kanoon / Registry */}
        <div className="pt-5 mt-6 border-t border-white/10 space-y-3">
          {(source.secondary?.url || source.cite) && (
            <a
              href={source.secondary?.url || 'https://indiankanoon.org/'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs uppercase tracking-widest rounded-xs transition-all shadow-lg cursor-pointer"
            >
              <span>View Certified Source on Indian Kanoon</span>
              <span>↗</span>
            </a>
          )}
          <p className="text-[10px] text-center text-[#a9a49a] font-mono">
            Directly cross-referenced with Supreme Court & High Court digital archives.
          </p>
        </div>
      </aside>
    </div>
  );
}
