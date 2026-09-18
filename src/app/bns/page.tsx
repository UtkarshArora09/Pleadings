'use client';

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import Link from 'next/link';
import statuteMapData from '@/content/statute-map.json';
import { getAllCases } from '@/lib/cases';

export default function BnsMapperPage() {
  const [query, setQuery] = useState('');
  const [filterChangedOnly, setFilterChangedOnly] = useState(false);
  const allCases = useMemo(() => getAllCases(), []);

  // Find cases citing a statute
  const findCasesForStatute = (oldSec: string, newSec: string | null) => {
    return allCases.filter((c) => {
      const oldClean = oldSec.toLowerCase().replace(/\s+/g, '');
      const newClean = newSec ? newSec.toLowerCase().replace(/\s+/g, '') : '';
      return (
        c.statuteMap.some((sm) => sm.old.toLowerCase().replace(/\s+/g, '').includes(oldClean)) ||
        c.citations.primary.toLowerCase().includes(oldClean) ||
        (newClean && c.statuteMap.some((sm) => sm.new && sm.new.toLowerCase().replace(/\s+/g, '').includes(newClean))) ||
        (c.doctrines && c.doctrines.some((d) => d.toLowerCase().includes(oldClean)))
      );
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/[§#]/g, '');

    return statuteMapData.filter((item) => {
      if (filterChangedOnly && !item.changed) return false;
      if (!q) return true;

      const matchOld = item.old.toLowerCase().replace(/[§#]/g, '').includes(q);
      const matchNew = item.new ? item.new.toLowerCase().replace(/[§#]/g, '').includes(q) : false;
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchNote = item.note.toLowerCase().includes(q);

      return matchOld || matchNew || matchSubject || matchNote;
    });
  }, [query, filterChangedOnly]);

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] select-none font-sans pb-24">
      <Header />

      <div className="pt-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto space-y-10">
        {/* Header Hero */}
        <div className="space-y-4 border-b border-white/10 pb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/30 rounded-xs text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            <span>CRIMINAL CODE TRANSITION CONCORDANCE</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            IPC → BNS Statutory Concordance
          </h1>

          <p className="text-sm sm:text-base text-[#a9a49a] max-w-3xl leading-relaxed">
            Instant bi-directional legal mapping between repealed colonial statutes (IPC, CrPC, IEA) and the new Bharatiya criminal codes (BNS, BNSS, BSA), cross-referenced with certified Pleadings court records.
          </p>

          {/* Search Box */}
          <div className="pt-3 max-w-2xl">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37] font-mono text-sm font-bold">
                §
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by section (e.g. IPC 302, BNS 103) or offence (e.g. Murder, Defamation)..."
                className="w-full bg-[#141824] border border-[#D4AF37]/40 rounded-xs pl-10 pr-4 py-3.5 text-sm sm:text-base text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden shadow-xl"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 text-xs font-mono">
              <label className="flex items-center gap-2 cursor-pointer text-white/80 hover:text-white">
                <input
                  type="checkbox"
                  checked={filterChangedOnly}
                  onChange={(e) => setFilterChangedOnly(e.target.checked)}
                  className="rounded-2xs accent-[#D4AF37]"
                />
                <span>Show only substantively modified provisions</span>
              </label>

              <span className="text-white/40">
                {results.length} provisions indexed
              </span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="py-16 text-center bg-[#12141C] border border-white/10 rounded-xs space-y-3">
              <div className="text-3xl">⚖</div>
              <h3 className="font-serif font-bold text-lg text-white">No statute matching "{query}"</h3>
              <p className="text-xs text-[#a9a49a]">
                Try searching without the section symbol or search by legal subject (e.g. "Arrest", "Bail", "Modesty").
              </p>
            </div>
          ) : (
            results.map((stat, idx) => {
              const matchedCases = findCasesForStatute(stat.old, stat.new);

              return (
                <article
                  key={idx}
                  className="p-5 sm:p-6 bg-[#12141C] border border-white/10 hover:border-[#D4AF37]/50 rounded-xs shadow-xl transition-all space-y-4"
                >
                  {/* Section Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base sm:text-lg font-bold text-[#D4AF37] bg-black/50 px-3 py-1 rounded-xs border border-[#D4AF37]/30">
                        {stat.old}
                      </span>
                      <span className="text-white/40 text-base">➔</span>
                      <span className={`font-mono text-base sm:text-lg font-bold px-3 py-1 rounded-xs border ${
                        stat.new
                          ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                          : 'text-rose-400 bg-rose-950/60 border-rose-500/40'
                      }`}>
                        {stat.new || 'REPEALED / NO DIRECT EQUIVALENT'}
                      </span>
                    </div>

                    {stat.changed && (
                      <span className="text-[10px] font-mono uppercase font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 border border-amber-600/40 rounded-2xs">
                        ⚠️ SUBSTANTIVE REFORM
                      </span>
                    )}
                  </div>

                  {/* Subject & Analysis */}
                  <div className="space-y-1.5">
                    <h2 className="font-serif text-base sm:text-lg font-bold text-white">
                      {stat.subject}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed">
                      {stat.note}
                    </p>
                  </div>

                  {/* Pleadings Cases Using This Statute */}
                  {matchedCases.length > 0 && (
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
                        Pleadings Cases Interpreting This Provision:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {matchedCases.map((c) => {
                          const displayTitle = typeof c.title === 'string' ? c.title : ((c.title as any)?.en || c.slug);
                          return (
                            <Link
                              key={c.slug}
                              href={`/case/${c.slug}`}
                              className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4AF37] hover:text-white px-2.5 py-1 bg-black/40 border border-[#D4AF37]/30 hover:border-[#D4AF37] rounded-xs transition-colors"
                            >
                              <span>📖 {displayTitle} ({c.year})</span>
                              <span>→</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}
