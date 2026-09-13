'use client';

import React from 'react';
import { EvidenceItem } from '@/types';
import { useApp } from '@/context/AppContext';

interface EvidenceCardProps {
  evidence: EvidenceItem;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const { language } = useApp();
  const headline = evidence.headline[language];
  const snippet = evidence.snippet[language];
  const highlightedPhrase = evidence.highlightedPhrase?.[language];

  // Helper to split snippet and render highlighted text
  const renderSnippetWithHighlight = () => {
    if (!highlightedPhrase || !snippet.includes(highlightedPhrase)) {
      return <span>{snippet}</span>;
    }

    const parts = snippet.split(highlightedPhrase);
    return (
      <>
        {parts[0]}
        <mark className="bg-[#1fe4d0] text-[#0E1016] font-semibold px-1.5 py-0.5 rounded-xs shadow-xs inline-block my-0.5">
          {highlightedPhrase}
        </mark>
        {parts.slice(1).join(highlightedPhrase)}
      </>
    );
  };

  return (
    <div className="relative my-4 max-w-lg mx-auto w-full transition-all duration-300 transform hover:scale-[1.01]">
      {/* Exhibit badge at top right */}
      {evidence.exhibitNumber && (
        <div className="absolute -top-3.5 right-4 z-20">
          <span className="bg-[#B23A2E] text-white text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 shadow-md border border-[#F3EFE6]/20">
            {evidence.exhibitNumber}
          </span>
        </div>
      )}

      {/* Parchment clipping container */}
      <div
        className="relative bg-[#ECE6D8] text-[#1a1b1f] p-6 sm:p-8 rounded-sm shadow-2xl overflow-hidden font-serif"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(243,239,230,0.15)',
          backgroundImage:
            'radial-gradient(#d8d0bf 0.8px, transparent 0.8px), radial-gradient(#d8d0bf 0.8px, #ECE6D8 0.8px)',
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 16px 16px',
        }}
      >
        {/* Paper texture overlay & subtle grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* Date & Location Header */}
        <div className="flex items-center justify-between text-[10px] font-sans font-bold tracking-[0.18em] text-[#5c564b] uppercase pb-2 mb-3 border-b border-[#cfc8b8]">
          <span>{evidence.date}</span>
          <span>COURT EVIDENCE ARCHIVE</span>
        </div>

        {/* Newspaper Article Headline */}
        <h3 className="font-sans font-extrabold text-xl sm:text-2xl text-[#121316] leading-tight tracking-tight mb-4">
          {headline}
        </h3>

        {/* Article Body with Cyan Highlight */}
        <div className="text-sm sm:text-[15px] font-sans text-[#24262c] leading-[1.75] mb-6">
          {renderSnippetWithHighlight()}
        </div>

        {/* Bottom Vintage Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="w-full border-t border-[#121316]/40" />
          <div className="absolute w-2 h-2 rounded-full bg-[#121316]" />
        </div>

        {/* Newspaper Masthead */}
        <div className="text-center pt-1">
          <span
            className="font-serif font-black text-sm sm:text-base tracking-[0.25em] text-[#121316] uppercase select-none"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            {evidence.masthead}
          </span>
        </div>
      </div>

      {/* Caption beneath */}
      {evidence.caption && (
        <p className="text-[10px] italic text-[#a9a49a] text-center mt-2.5 tracking-wide">
          {evidence.caption[language]}
        </p>
      )}
    </div>
  );
}
