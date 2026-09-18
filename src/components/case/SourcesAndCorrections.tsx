import React from 'react';
import { ReportErrorButton } from '@/components/ReportErrorButton';

interface SourcesAndCorrectionsProps {
  caseSlug: string;
  sourceUrl: string;
  citations: { primary: string; parallel: string[]; neutral?: string };
  sources: { label: string; url: string }[];
  review: { reviewer: string; enrolment: string; reviewedOn: string };
  lang?: 'en' | 'hi';
}

export function SourcesAndCorrections({
  caseSlug,
  sourceUrl,
  citations,
  sources,
  review,
  lang = 'en'
}: SourcesAndCorrectionsProps) {
  return (
    <section className="my-12 p-5 sm:p-7 bg-[#0E1118] border border-white/10 rounded-xs shadow-xl space-y-6 select-none font-sans">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
          {lang === 'en' ? 'SOURCES, CITATIONS & EDITORIAL REVIEW' : 'स्रोत, साइटेशन और कानूनी समीक्षा'}
        </span>
      </div>

      {/* Citations Grid */}
      <div className="grid gap-4 sm:grid-cols-2 text-xs">
        <div className="p-3 bg-black/40 border border-white/5 rounded-xs space-y-1">
          <div className="text-[10px] font-mono text-white/50 uppercase">Primary Law Report</div>
          <div className="font-mono font-bold text-white text-sm">{citations.primary}</div>
          {citations.parallel && citations.parallel.length > 0 && (
            <div className="text-[11px] font-mono text-[#D4AF37] pt-0.5">
              Parallel: {citations.parallel.join(' · ')}
            </div>
          )}
        </div>

        <div className="p-3 bg-black/40 border border-white/5 rounded-xs space-y-1">
          <div className="text-[10px] font-mono text-white/50 uppercase">Reviewing Advocate & Enrolment</div>
          <div className="font-semibold text-white">{review.reviewer}</div>
          <div className="text-[11px] font-mono text-emerald-400">
            Enrolment: {review.enrolment} · Verified {review.reviewedOn}
          </div>
        </div>
      </div>

      {/* Primary Links */}
      <div className="space-y-2">
        <div className="text-[10px] font-mono uppercase text-white/50">
          {lang === 'en' ? 'Certified Judgment Sources:' : 'प्रमाणित अदालती स्रोत:'}
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 rounded-xs text-xs font-mono font-bold transition-all"
          >
            <span>Indian Kanoon Copy</span>
            <span>↗</span>
          </a>
          {sources.map((s, idx) => (
            <a
              key={idx}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 rounded-xs text-xs font-mono transition-all"
            >
              <span>{s.label}</span>
              <span>↗</span>
            </a>
          ))}
        </div>
      </div>

      {/* Error Report Trigger */}
      <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#a9a49a]">
          {lang === 'en'
            ? 'Pleadings is dedicated to 100% legal accuracy. Found an error in this case record?'
            : 'क्या आपको इस केस में कोई त्रुटि या अशुद्धि मिली है?'}
        </p>
        <ReportErrorButton caseSlug={caseSlug} />
      </div>
    </section>
  );
}
