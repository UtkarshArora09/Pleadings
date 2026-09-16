import React from 'react';
import { Header } from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Public Corrections Log | Pleadings',
  description: 'A transparent, dated record of all corrections, clarifications, and citation updates made to Pleadings cases.'
};

const CORRECTIONS_LOG = [
  {
    date: '2026-03-10',
    caseTitle: 'The Ghost Case (State of Orissa v. Ram Bahadur Thapa)',
    slug: 'ghost-case',
    type: 'CITATION CLARIFICATION',
    details: 'Clarified footnote in Episode 04 distinguishing IPC §79 (mistake of fact) from IPC §76 (act done by person bound by law). Added BNS §17 statutory cross-reference.'
  },
  {
    date: '2026-02-18',
    caseTitle: 'The Luxury Haircut Case (ITC v. Aashna Roy)',
    slug: 'haircut-case',
    type: 'STATUTORY AMENDMENT',
    details: 'Updated consumer jurisdiction limits in the "If This Affects You" panel following the revised Consumer Protection (Jurisdiction of District Commission, State Commission and National Commission) Rules.'
  },
  {
    date: '2026-01-25',
    caseTitle: 'Shah Bano (Mohd. Ahmed Khan v. Shah Bano Begum)',
    slug: 'shah-bano',
    type: 'HISTORICAL CHRONOLOGY',
    details: 'Refined chronology in the precedent chain explaining the harmonious construction in Danial Latifi (2001) regarding fair and reasonable provision within the iddat period.'
  }
];

export default function CorrectionsPage() {
  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] select-none">
      <Header />

      <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        {/* Title */}
        <div className="space-y-3 border-b border-white/10 pb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block font-bold">
            PUBLIC RECORD OF INTEGRITY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            Corrections & Clarifications Log
          </h1>
          <p className="text-sm sm:text-base text-[#a9a49a] font-sans leading-relaxed">
            Pleadings upholds an open corrections policy. Whenever a typo, legal citation, or factual error is reported and verified against certified court records, it is documented here with the date and exact nature of the change.
          </p>
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          {CORRECTIONS_LOG.map((item, idx) => (
            <article
              key={idx}
              className="p-5 sm:p-6 bg-[#12141C] border border-white/10 rounded-xs space-y-3 relative group hover:border-[#D4AF37]/50 transition-colors"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-2xs uppercase">
                    {item.type}
                  </span>
                  <time className="text-xs font-mono text-white/50">{item.date}</time>
                </div>
                <Link
                  href={`/case/${item.slug}`}
                  className="text-xs font-mono text-[#D4AF37] hover:underline"
                >
                  View Case →
                </Link>
              </div>

              <h2 className="font-serif font-bold text-lg text-white">
                {item.caseTitle}
              </h2>

              <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed">
                {item.details}
              </p>
            </article>
          ))}
        </div>

        {/* Footnote on how to report */}
        <div className="p-6 bg-black/40 border border-dashed border-white/20 rounded-xs text-center space-y-2">
          <h3 className="text-sm font-bold text-white font-serif">Spotted an inconsistency in any of our cases?</h3>
          <p className="text-xs text-[#a9a49a]">
            Use the "Report an error in this record" button at the foot of any case, or email our editorial desk directly.
          </p>
        </div>
      </div>
    </main>
  );
}
