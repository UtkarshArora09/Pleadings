import React from 'react';
import { Exhibit as ExhibitType } from '@/types/case';
import { CaseImage } from './CaseImage';

interface ExhibitProps {
  exhibit: ExhibitType;
}

export function Exhibit({ exhibit }: ExhibitProps) {
  const { kind, label, headline, body, meta, docNumber, sourceUrl, para, image } = exhibit;

  // Enforce runtime safety assertions matching the build validator
  if (kind === 'reconstruction' && docNumber) {
    throw new Error(`Invalid Exhibit: Reconstruction exhibits cannot contain fabricated docNumber '${docNumber}'.`);
  }
  if (kind === 'record' && !sourceUrl) {
    throw new Error(`Invalid Exhibit: Record exhibit '${headline}' must have a sourceUrl.`);
  }
  if (kind === 'quote' && typeof para !== 'number') {
    throw new Error(`Invalid Exhibit: Quote exhibit '${headline}' must specify a para number.`);
  }

  const isRecord = kind === 'record';
  const isQuote = kind === 'quote';
  const isReconstruction = kind === 'reconstruction';

  const isNewspaper = isRecord && (
    label.includes('NEWSPAPER') ||
    label.includes('PRESS') ||
    label.includes('STATESMAN') ||
    label.includes('TIMES') ||
    label.includes('BLITZ') ||
    label.includes('EXPRESS') ||
    label.includes('HINDU') ||
    label.includes('TRIBUNE')
  );

  const isPolice = isRecord && !isNewspaper && (
    label.includes('POLICE') ||
    label.includes('THANA') ||
    label.includes('DIARY') ||
    label.includes('FIR') ||
    label.includes('MEMO') ||
    label.includes('ENQUIRY')
  );

  // 1. Vintage Newspaper Cutting Exhibit
  if (isNewspaper) {
    return (
      <div className="my-6 relative bg-[#ECE6D8] text-[#1a1b1f] p-5 sm:p-7 rounded-xs shadow-2xl border border-[#d8d0bf] font-serif select-none">
        {/* Newspaper Top Bar */}
        <div className="flex flex-wrap items-center justify-between text-[10px] font-sans font-bold tracking-widest text-[#5c564b] uppercase pb-2.5 mb-3 border-b-2 border-[#1a1b1f]/30">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono text-[9px] rounded-2xs font-bold">
              RECORD · VERIFIED
            </span>
            <span className="font-serif tracking-wider text-sm font-black text-[#1a1b1f]">{label}</span>
          </div>
          <span>{meta}</span>
        </div>

        {/* Optional Embedded Archival Photo */}
        {image && (
          <div className="mb-4 grayscale contrast-125 border border-[#1a1b1f]/20">
            <CaseImage
              src={image.src}
              alt={image.alt}
              provenance={image.provenance}
              aspectRatio="aspect-[16/9]"
            />
          </div>
        )}

        {/* Newspaper Headline */}
        <h4 className="font-sans font-black text-base sm:text-xl text-[#121316] leading-tight mb-3 tracking-tight">
          {headline}
        </h4>

        {/* Newspaper Snippet / Body */}
        <p className="text-xs sm:text-sm font-serif text-[#24262c] leading-relaxed mb-4 bg-black/5 p-3 rounded-2xs border-l-3 border-[#1a1b1f]">
          "{body}"
        </p>

        {/* Footer with Outbound Verification */}
        <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-[#1a1b1f]/20 text-[10px] font-mono text-[#5c564b]">
          <span className="text-[#B23A2E] font-bold">ARCHIVAL PRESS DISPATCH</span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold transition-colors"
            >
              <span>Verify Primary Document</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // 2. Vintage Police Record / Station Case Diary
  if (isPolice) {
    return (
      <div
        className="my-6 relative bg-[#E8DCB8] text-[#1e1c18] p-5 sm:p-7 rounded-xs shadow-2xl border border-[#c4b38d] font-mono select-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 27px, rgba(160,130,90,0.12) 28px)',
        }}
      >
        {/* Red Rubber Stamp */}
        <div className="absolute top-4 right-4 z-10 transform rotate-6 border-2 border-[#B23A2E] text-[#B23A2E] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest bg-[#B23A2E]/5 rounded-xs pointer-events-none">
          OFFICIAL POLICE RECORD
        </div>

        {/* Header */}
        <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#705838] uppercase pb-2 mb-3 border-b border-[#a89070]/40">
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 font-mono text-[9px] rounded-2xs font-bold">
            RECORD · VERIFIED
          </span>
          <span>{label}</span>
        </div>

        {/* Headline */}
        <h4 className="font-sans font-black text-base sm:text-lg text-[#1a140e] leading-snug tracking-tight mb-2.5">
          {headline}
        </h4>

        {/* Typewritten Snippet */}
        <div className="text-xs sm:text-sm font-mono text-[#2c241b] leading-relaxed mb-4 bg-white/40 p-3 rounded-xs border border-[#a89070]/30">
          {body}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between pt-2.5 border-t border-[#a89070]/40 text-[10px] text-[#5a4830] font-bold tracking-widest uppercase">
          <span>{meta}</span>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold transition-colors"
            >
              <span>Verify Case Docket</span>
              <span>↗</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // 3. Quote or Reconstruction
  return (
    <div
      className={`my-6 relative rounded-xs p-5 sm:p-6 transition-all select-none ${
        isRecord
          ? 'bg-[#151922] border border-emerald-500/30 shadow-lg text-[#E6ECE8]'
          : isQuote
          ? 'bg-[#191C28] border-l-4 border-[#D4AF37] border-y border-r border-white/10 shadow-lg text-[#F3EFE6]'
          : 'bg-[#1C1814] border border-[#D4AF37]/50 shadow-xl text-[#F5EBE1] saturate-[0.92]'
      }`}
    >
      {/* Reconstruction Grain Effect */}
      {isReconstruction && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-25 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:6px_6px] rounded-xs"
          aria-hidden="true"
        />
      )}

      {/* Header Badge Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10 mb-3 text-[10px] font-mono uppercase tracking-wider">
        <div className="flex items-center gap-2">
          {isRecord && (
            <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-300 border border-emerald-600/40 rounded-2xs font-bold">
              RECORD · VERIFIED
            </span>
          )}
          {isQuote && (
            <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 rounded-2xs font-bold">
              FROM THE JUDGMENT · ¶{para}
            </span>
          )}
          {isReconstruction && (
            <span className="px-2 py-0.5 bg-amber-950/90 text-amber-300 border border-amber-600/50 rounded-2xs font-bold">
              RECONSTRUCTION · ILLUSTRATED
            </span>
          )}
          <span className="text-white/60 font-semibold">{label}</span>
        </div>

        {/* Right Corner Indicator */}
        {isReconstruction && (
          <span className="text-[#D4AF37] font-bold text-[9px] bg-black/60 px-1.5 py-0.5 border border-[#D4AF37]/30 rounded-2xs">
            ILLUSTRATION
          </span>
        )}
      </div>

      {/* Optional Embedded Image */}
      {image && (
        <div className="mb-3">
          <CaseImage
            src={image.src}
            alt={image.alt}
            provenance={image.provenance}
            aspectRatio="aspect-[16/9]"
          />
        </div>
      )}

      {/* Headline */}
      <h4 className="font-serif font-bold text-sm sm:text-base text-white leading-snug mb-2">
        {headline}
      </h4>

      {/* Body */}
      <p
        className={`text-xs sm:text-sm leading-relaxed mb-3 ${
          isQuote ? 'font-serif italic text-white/95' : 'text-[#E0DCD3] font-sans'
        }`}
      >
        {body}
      </p>

      {/* Metadata & Outbound Source Link */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono text-white/60">
        <span>{meta}</span>
        {isRecord && sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-colors"
          >
            <span>Verify Primary Record</span>
            <span>↗</span>
          </a>
        )}
      </div>
    </div>
  );
}
