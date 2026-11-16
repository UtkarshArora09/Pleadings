'use client';

import React, { useState, useRef, useEffect } from 'react';
import { findLegalDefinition, LegalDefinition } from '@/lib/legalDictionary';

interface TapToDefineProps {
  term: string;
  display?: string;
  lang?: 'en' | 'hi';
}

export function TapToDefine({ term, display, lang = 'en' }: TapToDefineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipPos, setTooltipPos] = useState<'top' | 'bottom'>('top');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const displayText = display || term;
  const defInfo: LegalDefinition | null = findLegalDefinition(term);

  // Position calculation
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      // If trigger is in the upper third of screen, show tooltip below
      if (rect.top < 180) {
        setTooltipPos('bottom');
      } else {
        setTooltipPos('top');
      }
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  if (!defInfo) {
    // If not in dictionary, render styled text
    return <span className="font-medium text-[#F3EFE6]">{displayText}</span>;
  }

  const definition = lang === 'hi' ? defInfo.definitionHi : defInfo.definition;

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className={`inline font-semibold transition-all cursor-pointer px-1 py-0.5 rounded-2xs border-b-2 border-dotted text-[#F3EFE6] select-text ${
          isOpen
            ? 'bg-[#D4AF37]/25 text-[#D4AF37] border-[#D4AF37]'
            : 'border-[#D4AF37]/80 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:bg-white/5'
        }`}
        title={`Tap to define: ${defInfo.term}`}
        aria-expanded={isOpen}
      >
        <span>{displayText}</span>
        <span className="text-[10px] text-[#D4AF37] ml-0.5 opacity-80">ℹ</span>
      </button>

      {/* Floating 1-Sentence Inline Popover Tooltip */}
      {isOpen && (
        <div
          ref={tooltipRef}
          onClick={(e) => e.stopPropagation()}
          className={`absolute left-1/2 -translate-x-1/2 z-50 w-72 sm:w-80 p-3.5 rounded-sm bg-[#151924] border border-[#D4AF37] shadow-[0_15px_35px_rgba(0,0,0,0.9)] text-left font-sans animate-fadeIn select-text ${
            tooltipPos === 'top'
              ? 'bottom-full mb-2 origin-bottom'
              : 'top-full mt-2 origin-top'
          }`}
          style={{ maxWidth: 'calc(100vw - 32px)' }}
        >
          {/* Top Header with term and close button */}
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10 gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#D4AF37]">
                {defInfo.term}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-white/50 hover:text-white text-xs px-1 font-mono cursor-pointer"
              aria-label="Close definition"
            >
              ✕
            </button>
          </div>

          {/* 1-Sentence Plain-English Definition */}
          <p className="text-xs text-[#E3DFD5] leading-relaxed pt-2">
            {definition}
          </p>

          <div className="pt-2 mt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40">
            <span>Plain-English Dictionary</span>
            <span className="text-[#D4AF37]/80">Tap anywhere to close</span>
          </div>

          {/* Caret Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#151924] border-[#D4AF37] transform rotate-45 ${
              tooltipPos === 'top'
                ? 'top-full -mt-1.5 border-r border-b'
                : 'bottom-full -mb-1.5 border-l border-t'
            }`}
          />
        </div>
      )}
    </span>
  );
}
