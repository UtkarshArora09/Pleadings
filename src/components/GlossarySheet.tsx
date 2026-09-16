'use client';

import React from 'react';
import Link from 'next/link';
import glossaryData from '@/content/glossary.json';
import { StatuteRefInline } from '@/components/StatuteRef';

interface GlossarySheetProps {
  termSlug: string | null;
  caseInThisCase?: string;
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'hi';
}

export function GlossarySheet({
  termSlug,
  caseInThisCase,
  isOpen,
  onClose,
  lang = 'en'
}: GlossarySheetProps) {
  if (!isOpen || !termSlug) return null;

  const item = glossaryData.find(
    (g) => g.slug === termSlug || g.term.toLowerCase() === termSlug.toLowerCase()
  );

  const termTitle = item ? item.term : termSlug;
  const plain = item ? item.plainMeaning[lang] || item.plainMeaning.en : 'Legal doctrine and principle.';
  const statute = item ? item.statute : undefined;
  const related = item ? item.related : [];

  return (
    <div className="fixed inset-0 z-[140] flex items-end sm:items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div
        className="relative z-10 w-full max-w-lg bg-[#12141C] text-[#F3EFE6] border border-[#D4AF37]/50 rounded-xl p-5 sm:p-6 shadow-2xl animate-slideUp sm:animate-scaleUp font-sans"
        role="dialog"
        aria-modal="true"
        aria-labelledby="glossary-sheet-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/15 rounded-2xs border border-[#D4AF37]/30">
              LEGAL GLOSSARY
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 text-base cursor-pointer"
            aria-label="Close glossary"
          >
            ✕
          </button>
        </div>

        {/* Term Name */}
        <h3 id="glossary-sheet-title" className="font-serif text-xl sm:text-2xl font-bold text-white mb-4">
          {termTitle}
        </h3>

        {/* 4-Row Breakdown */}
        <div className="divide-y divide-white/10 text-xs sm:text-sm space-y-3">
          {/* Row 1: Plain Meaning */}
          <div className="pt-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1">
              Plain Meaning
            </span>
            <p className="text-white/90 leading-relaxed font-sans">
              {plain}
            </p>
          </div>

          {/* Row 2: In This Case */}
          {caseInThisCase && (
            <div className="pt-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] block mb-1 font-semibold">
                In This Case
              </span>
              <p className="text-white/95 italic font-serif leading-relaxed">
                "{caseInThisCase}"
              </p>
            </div>
          )}

          {/* Row 3: Statute Mapping */}
          {statute && (
            <div className="pt-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1">
                Statute Mapping (IPC → BNS)
              </span>
              <div className="inline-flex items-center mt-0.5">
                <StatuteRefInline oldSec={statute.split('→')[0].trim()} newSec={statute.split('→')[1]?.trim()} />
              </div>
            </div>
          )}

          {/* Row 4: Related Terms & Deep Link */}
          <div className="pt-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block mb-1.5">
              Related Doctrines
            </span>
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              {related.map((relSlug) => (
                <Link
                  key={relSlug}
                  href={`/glossary/${relSlug}`}
                  onClick={onClose}
                  className="font-mono text-[11px] text-white/70 hover:text-[#D4AF37] px-2 py-0.5 bg-black/40 border border-white/10 rounded-2xs hover:border-[#D4AF37]/40 transition-colors"
                >
                  {relSlug.replace(/-/g, ' ')}
                </Link>
              ))}
            </div>

            <Link
              href={`/glossary/${termSlug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4AF37] hover:underline"
            >
              <span>See all cases using this term</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Close Button */}
        <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
