import React from 'react';

interface ProvenanceStripProps {
  citation: string;
  paragraphsCitedCount: number;
  reviewer: string;
  lastVerifiedDate: string;
  className?: string;
}

export function ProvenanceStrip({
  citation,
  paragraphsCitedCount,
  reviewer,
  lastVerifiedDate,
  className = ''
}: ProvenanceStripProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] sm:text-xs font-mono text-[#a9a49a] border border-white/10 rounded-xs py-2.5 px-3.5 bg-[#12141C]/80 backdrop-blur-md shadow-lg select-none ${className}`}
    >
      {/* Primary Citation & Scale Icon */}
      <div className="flex items-center gap-2 text-white/95">
        <span className="text-[#D4AF37] text-sm leading-none">⚖</span>
        <span className="font-serif text-xs sm:text-sm text-[#E0DCD3]">
          Built from <strong className="text-white font-semibold underline decoration-[#D4AF37]/40 decoration-1 underline-offset-2">{citation}</strong>
        </span>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap items-center gap-2 text-[10px] sm:text-[11px] text-white/70">
        <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded-2xs font-semibold">
          <strong className="text-[#D4AF37]">{paragraphsCitedCount}</strong> cited ¶
        </span>
        <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded-2xs text-white/80">
          Reviewed by <strong className="text-white">{reviewer}</strong>
        </span>
        <span className="px-2 py-0.5 bg-black/60 border border-white/10 rounded-2xs text-white/60">
          Verified <time className="text-white/80">{lastVerifiedDate}</time>
        </span>
      </div>
    </div>
  );
}
