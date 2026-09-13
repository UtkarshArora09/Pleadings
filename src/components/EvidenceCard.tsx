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
  const archiveType = evidence.archiveType || 'newspaper';

  // Helper to split snippet and render highlighted text
  const renderSnippetWithHighlight = (highlightBg = 'bg-[#1fe4d0]', highlightText = 'text-[#0E1016]') => {
    if (!highlightedPhrase || !snippet.includes(highlightedPhrase)) {
      return <span>{snippet}</span>;
    }

    const parts = snippet.split(highlightedPhrase);
    return (
      <>
        {parts[0]}
        <mark className={`${highlightBg} ${highlightText} font-semibold px-1.5 py-0.5 rounded-xs shadow-xs inline-block my-0.5`}>
          {highlightedPhrase}
        </mark>
        {parts.slice(1).join(highlightedPhrase)}
      </>
    );
  };

  // Render variant based on archiveType
  const renderCardContent = () => {
    switch (archiveType) {
      case 'police_record':
        return (
          <div
            className="relative bg-[#E8DCB8] text-[#1e1c18] p-6 sm:p-7 rounded-sm shadow-2xl overflow-hidden font-mono"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(180,140,80,0.3)',
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(160,130,90,0.15) 28px)',
            }}
          >
            {/* Red Rubber Stamp */}
            <div className="absolute top-3 right-3 z-10 transform rotate-12 border-2 border-[#B23A2E] text-[#B23A2E] px-2 py-0.5 text-[10px] font-black uppercase tracking-widest bg-[#B23A2E]/5 rounded-xs">
              POLICE CASE DIARY
            </div>

            {/* Station Header */}
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#705838] uppercase pb-2 mb-3 border-b border-[#a89070]/40">
              <span className="text-[#B23A2E]">●</span>
              <span>{evidence.date}</span>
              <span className="text-stone-400">|</span>
              <span>FIR / STATION LOG</span>
            </div>

            {/* Headline */}
            <h3 className="font-sans font-black text-lg sm:text-xl text-[#1a140e] leading-snug tracking-tight mb-3">
              {headline}
            </h3>

            {/* Body */}
            <div className="text-xs sm:text-sm font-mono text-[#2c241b] leading-relaxed mb-4 bg-white/30 p-3 rounded-xs border border-[#a89070]/30">
              {renderSnippetWithHighlight('bg-[#B23A2E]/20 text-[#8B0000] border-b border-[#B23A2E]')}
            </div>

            {/* Police Stamp Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#a89070]/40 text-[10px] text-[#5a4830] font-bold tracking-widest uppercase">
              <span>{evidence.masthead}</span>
              <span className="text-[9px] font-mono text-stone-500">SEALED EXHIBIT</span>
            </div>
          </div>
        );

      case 'forensic':
        return (
          <div
            className="relative bg-[#151b24] text-[#E0E6ED] p-6 sm:p-7 rounded-sm shadow-2xl overflow-hidden font-sans border border-[#3A4B5F]"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(70,130,180,0.3)',
              backgroundImage: 'linear-gradient(rgba(30, 42, 56, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(30, 42, 56, 0.4) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            {/* Tech Badge */}
            <div className="absolute top-3 right-3 z-10 text-[9px] font-mono text-[#38bdf8] bg-[#38bdf8]/10 border border-[#38bdf8]/30 px-2 py-0.5 rounded-xs tracking-widest uppercase">
              LAB REPORT
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#94a3b8] uppercase pb-2 mb-3 border-b border-[#334155]">
              <span className="text-[#38bdf8]">⌖</span>
              <span>{evidence.date}</span>
              <span>·</span>
              <span>FORENSIC EXAMINATION</span>
            </div>

            {/* Headline */}
            <h3 className="font-sans font-bold text-lg sm:text-xl text-white leading-snug tracking-tight mb-3">
              {headline}
            </h3>

            {/* Body */}
            <div className="text-xs sm:text-sm text-[#cbd5e1] leading-relaxed mb-4 bg-[#0d131a] p-3 rounded-xs border border-[#1e293b]">
              {renderSnippetWithHighlight('bg-[#38bdf8] text-[#082f49] font-bold')}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#334155] text-[10px] font-mono text-[#38bdf8] tracking-widest uppercase">
              <span>{evidence.masthead}</span>
              <span className="text-emerald-400">VERIFIED SPECIMEN</span>
            </div>
          </div>
        );

      case 'court_decree':
        return (
          <div
            className="relative bg-[#FAF6EC] text-[#1c1b18] p-6 sm:p-7 rounded-sm shadow-2xl overflow-hidden font-serif border-2 border-[#D4AF37]/40"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.4)',
            }}
          >
            {/* Judicial Seal Watermark */}
            <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none rounded-full border-4 border-[#1c1b18] flex items-center justify-center font-bold text-4xl">
              ⚖
            </div>

            {/* Header */}
            <div className="flex items-center justify-between text-[10px] font-sans font-bold tracking-[0.2em] text-[#8C7335] uppercase pb-2 mb-3 border-b border-[#D4AF37]/30">
              <span className="flex items-center gap-1">
                <span>⚖</span>
                <span>{evidence.date}</span>
              </span>
              <span>SESSIONS COURT DOCKET</span>
            </div>

            {/* Headline */}
            <h3 className="font-serif font-black text-lg sm:text-xl text-[#121316] leading-tight tracking-tight mb-3">
              {headline}
            </h3>

            {/* Body */}
            <div className="text-xs sm:text-[14px] font-serif text-[#2a2924] leading-relaxed mb-4 italic pl-3 border-l-2 border-[#D4AF37]">
              {renderSnippetWithHighlight('bg-[#D4AF37] text-black font-semibold')}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/30 text-[10px] font-sans font-bold tracking-widest uppercase text-[#5a5240]">
              <span>{evidence.masthead}</span>
              <span className="text-[#8C7335]">RECORD OF PROCEEDINGS</span>
            </div>
          </div>
        );

      case 'verdict_decree':
        return (
          <div
            className="relative bg-[#0F141C] text-[#F3EFE6] p-6 sm:p-7 rounded-sm shadow-2xl overflow-hidden border border-[#D4AF37]/60"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.6)',
              backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)',
            }}
          >
            {/* Gold Ratio Stamp */}
            <div className="absolute top-3 right-3 z-10 border border-[#D4AF37] text-[#D4AF37] px-2 py-0.5 text-[9px] font-mono uppercase tracking-widest bg-[#D4AF37]/10 rounded-xs">
              RATIO DECIDENDI
            </div>

            {/* Header */}
            <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-[0.2em] text-[#D4AF37] uppercase pb-2 mb-3 border-b border-[#D4AF37]/30">
              <span>🏛</span>
              <span>{evidence.date}</span>
              <span>·</span>
              <span>CERTIFIED DECREE</span>
            </div>

            {/* Headline */}
            <h3 className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase leading-tight mb-3">
              {headline}
            </h3>

            {/* Body */}
            <div className="text-xs sm:text-sm font-sans text-[#d0cbc0] leading-relaxed mb-4 bg-white/5 p-3.5 rounded-xs border border-white/10">
              {renderSnippetWithHighlight('bg-[#E50914] text-white font-bold')}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/30 text-[10px] font-mono text-[#D4AF37] tracking-widest uppercase">
              <span>{evidence.masthead}</span>
              <span className="text-emerald-400">FINAL & BINDING</span>
            </div>
          </div>
        );

      case 'dossier':
        return (
          <div
            className="relative bg-[#E3DAC9] text-[#1c1a17] p-6 sm:p-7 rounded-sm shadow-2xl overflow-hidden font-sans border border-[#9c8b74]/40"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7)',
            }}
          >
            {/* Top Tape Graphic */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-20 h-5 bg-[#c5b89a]/70 border border-white/30 backdrop-blur-xs transform -rotate-1 shadow-xs pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-[#6b5d4b] uppercase pb-2 mb-3 border-b border-[#9c8b74]/40">
              <span>{evidence.date}</span>
              <span className="text-[#B23A2E] font-black">CASE DOSSIER FILE</span>
            </div>

            {/* Headline */}
            <h3 className="font-bold text-lg sm:text-xl text-[#1a1815] leading-snug tracking-tight mb-3">
              {headline}
            </h3>

            {/* Body */}
            <div className="text-xs sm:text-sm text-[#302c25] leading-relaxed mb-4 bg-white/40 p-3 rounded-xs border border-[#9c8b74]/30">
              {renderSnippetWithHighlight('bg-[#1fe4d0] text-[#0E1016] font-bold')}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-[#9c8b74]/40 text-[10px] font-bold tracking-widest uppercase text-[#524637]">
              <span>{evidence.masthead}</span>
              <span className="text-stone-500">JUDICIAL ARCHIVE</span>
            </div>
          </div>
        );

      case 'newspaper':
      default:
        return (
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
              {renderSnippetWithHighlight('bg-[#1fe4d0] text-[#0E1016]')}
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
        );
    }
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

      {/* Render selected documentary archive style */}
      {renderCardContent()}

      {/* Caption beneath */}
      {evidence.caption && (
        <p className="text-[10px] italic text-[#a9a49a] text-center mt-2.5 tracking-wide">
          {evidence.caption[language]}
        </p>
      )}
    </div>
  );
}
