'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { findLegalDefinition, LegalDefinition } from '@/lib/legalDictionary';

interface TapToDefineProps {
  term: string;
  display?: string;
  lang?: 'en' | 'hi';
}

export function TapToDefine({ term, display, lang = 'en' }: TapToDefineProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number; placeBelow: boolean }>({
    top: 0,
    left: 16,
    width: 300,
    placeBelow: false,
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const displayText = display || term;
  const defInfo: LegalDefinition | null = findLegalDefinition(term);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Viewport-clamped positioning so tooltip NEVER clips off left/right edges on mobile
  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const margin = 16;
    const vw = window.innerWidth;
    const width = Math.min(320, vw - margin * 2);
    const center = rect.left + rect.width / 2;
    const left = Math.max(margin, Math.min(vw - width - margin, center - width / 2));
    const placeBelow = rect.top < 190;
    const top = placeBelow ? rect.bottom + 8 : rect.top - 8;

    setCoords({ top, left, width, placeBelow });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => updatePosition();
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

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  if (!defInfo) {
    return <span className="font-medium text-[#F3EFE6]">{displayText}</span>;
  }

  const definition = lang === 'hi' ? defInfo.definitionHi : defInfo.definition;

  return (
    <span className="relative inline">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
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

      {isOpen && mounted && typeof document !== 'undefined' && createPortal(
        <div
          ref={tooltipRef}
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            transform: coords.placeBelow ? 'none' : 'translateY(-100%)',
          }}
          className="z-[9999] p-3.5 rounded-sm bg-[#151924] border border-[#D4AF37] shadow-[0_15px_35px_rgba(0,0,0,0.9)] text-left font-sans select-text"
        >
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

          <p className="text-xs text-[#E3DFD5] leading-relaxed pt-2">
            {definition}
          </p>

          <div className="mt-2.5 pt-1.5 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/40 uppercase tracking-wider">
            <span>Plain-English Legal Dictionary</span>
            <span>Tap anywhere to dismiss</span>
          </div>
        </div>,
        document.body
      )}
    </span>
  );
}
