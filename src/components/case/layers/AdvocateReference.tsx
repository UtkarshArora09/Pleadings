'use client';

import React, { useState } from 'react';
import { AdvocateReference as AdvocateReferenceType } from '@/types';

interface AdvocateReferenceProps {
  reference?: AdvocateReferenceType;
  subsequentHistory?: { type: string; case: string; year: number; note: string }[];
  primaryCitation?: string;
  parallelCitations?: string[];
  lang?: 'en' | 'hi';
}

export function AdvocateReference({
  reference,
  subsequentHistory = [],
  primaryCitation,
  parallelCitations = [],
  lang = 'en',
}: AdvocateReferenceProps) {
  const [copied, setCopied] = useState(false);

  // Derive consolidated data from reference or fallbacks
  const statutoryText = reference?.statutoryText || [];
  const holdings = reference?.holdings || [];
  const precedents = reference?.precedents || [];
  const citatorHistory = reference?.citatorHistory || [];
  const parallelList = reference?.parallelCitations && reference.parallelCitations.length > 0
    ? reference.parallelCitations
    : parallelCitations;

  const disclaimerText = reference?.citatorDisclaimer ||
    "These are the citator entries recorded in this report and may not be complete or current. Verify this case's present status through a live citator (SCC Online, Manupatra, or equivalent) before relying on it in an active matter.";

  const hasContent =
    statutoryText.length > 0 ||
    holdings.length > 0 ||
    precedents.length > 0 ||
    citatorHistory.length > 0 ||
    subsequentHistory.length > 0 ||
    parallelList.length > 0;

  if (!hasContent) {
    return null;
  }

  const allParallelJoined = parallelList.join(' · ');

  const handleCopyParallel = () => {
    const textToCopy = primaryCitation
      ? `${primaryCitation} · ${allParallelJoined}`
      : allParallelJoined;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTreatmentBadgeClass = (treatment: string) => {
    const t = treatment.toLowerCase();
    if (t.includes('affirm') || t.includes('follow') || t.includes('appl')) {
      return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
    if (t.includes('distinguish')) {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
    if (t.includes('doubt') || t.includes('overrule')) {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
    return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
  };

  return (
    <div className="bg-[#0c0e14] border border-emerald-500/30 rounded-xs overflow-hidden shadow-2xl my-8">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-linear-to-r from-[#121520] to-[#0A0C10] border-b border-emerald-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              {lang === 'en' ? 'Consolidated Advocate Reference' : 'समेकित अधिवक्ता संदर्भ'}
            </span>
          </div>
          <h2 className="font-anton text-2xl sm:text-3xl text-white tracking-wide uppercase">
            ADVOCATE REFERENCE
          </h2>
          <p className="text-xs text-[#a9a49a] font-mono mt-0.5">
            {lang === 'en'
              ? 'Verbatim statutory extractions, numbered holdings, precedent treatment, and citator infrastructure.'
              : 'प्रामाणिक वैधानिक उद्धरण, निर्णित सिद्धांत, पूर्व-निर्णय विश्लेषण और साइटेटर तालिका।'}
          </p>
        </div>

        {parallelList.length > 0 && (
          <button
            onClick={handleCopyParallel}
            className="self-start sm:self-center px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>{copied ? '✓ Copied Citations' : '📋 Copy All Citations'}</span>
          </button>
        )}
      </div>

      <div className="p-5 sm:p-8 space-y-10 divide-y divide-white/5">
        {/* 1. STATUTORY TEXT AS REPRODUCED IN THE JUDGMENT */}
        {statutoryText.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-emerald-400">1 ·</span>
              <h3 className="font-anton text-lg sm:text-xl text-white tracking-wide uppercase">
                STATUTORY TEXT AS REPRODUCED IN THE JUDGMENT
              </h3>
            </div>

            <div className="space-y-4">
              {statutoryText.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#121520]/80 border border-emerald-500/20 rounded-xs p-4 sm:p-5 space-y-2 relative"
                >
                  <div className="text-xs font-mono font-bold text-emerald-300">
                    {item.statute} — <span className="text-white/60 font-normal italic">as quoted in the judgment:</span>
                  </div>
                  <blockquote className="border-l-2 border-emerald-400 pl-4 py-1 text-sm text-[#dedad2] font-serif leading-relaxed italic">
                    &ldquo;{item.text}&rdquo;
                  </blockquote>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 2. THE COURT'S ENUMERATED HOLDINGS */}
        {holdings.length > 0 && (
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-emerald-400">2 ·</span>
              <h3 className="font-anton text-lg sm:text-xl text-white tracking-wide uppercase">
                THE COURT&apos;S ENUMERATED HOLDINGS
              </h3>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-xs bg-[#121520]/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black/50 border-b border-white/10 text-[11px] font-mono text-[#a9a49a] uppercase">
                    <th className="py-3 px-4 w-16 text-center">#</th>
                    <th className="py-3 px-4">Holding</th>
                    <th className="py-3 px-4 w-40 font-mono text-emerald-300">Pinpoint</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {holdings.map((h, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-white/50 text-center font-bold align-top">
                        {h.number}
                      </td>
                      <td className="py-3 px-4 text-white font-medium leading-relaxed align-top">
                        {h.holding}
                      </td>
                      <td className="py-3 px-4 font-mono text-emerald-300 text-xs align-top whitespace-nowrap">
                        {h.pinpoint}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 3. PRECEDENTS DISCUSSED IN THIS JUDGMENT */}
        {precedents.length > 0 && (
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-emerald-400">3 ·</span>
              <h3 className="font-anton text-lg sm:text-xl text-white tracking-wide uppercase">
                PRECEDENTS DISCUSSED IN THIS JUDGMENT
              </h3>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-xs bg-[#121520]/60">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-black/50 border-b border-white/10 text-[11px] font-mono text-[#a9a49a] uppercase">
                    <th className="py-3 px-4">Case</th>
                    <th className="py-3 px-4 w-48 font-mono text-white/80">Citation</th>
                    <th className="py-3 px-4">Treatment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {precedents.map((p, idx) => (
                    <tr key={idx} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-white font-serif font-bold text-xs sm:text-sm align-top">
                        {p.caseName}
                      </td>
                      <td className="py-3 px-4 font-mono text-white/70 text-xs align-top whitespace-nowrap">
                        {p.citation}
                      </td>
                      <td className="py-3 px-4 align-top">
                        <span
                          className={`inline-block text-[11px] font-mono px-2.5 py-1 rounded-xs border font-bold ${getTreatmentBadgeClass(
                            p.treatment
                          )}`}
                        >
                          {p.treatment}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 4. SUBSEQUENT CITATOR HISTORY */}
        {(citatorHistory.length > 0 || subsequentHistory.length > 0) && (
          <section className="space-y-4 pt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-emerald-400">4 ·</span>
              <h3 className="font-anton text-lg sm:text-xl text-white tracking-wide uppercase">
                SUBSEQUENT CITATOR HISTORY
              </h3>
            </div>

            {citatorHistory.length > 0 ? (
              <div className="overflow-x-auto border border-white/10 rounded-xs bg-[#121520]/60">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-[11px] font-mono text-[#a9a49a] uppercase">
                      <th className="py-3 px-4 w-48 font-mono text-emerald-300">Code</th>
                      <th className="py-3 px-4 font-mono">Citation</th>
                      <th className="py-3 px-4 w-28 font-mono text-white/70">Point(s)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {citatorHistory.map((c, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono text-emerald-300 font-bold text-xs align-top">
                          {c.code}
                        </td>
                        <td className="py-3 px-4 font-mono text-white text-xs align-top">
                          {c.citation}
                        </td>
                        <td className="py-3 px-4 font-mono text-white/70 text-xs align-top">
                          {c.points || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto border border-white/10 rounded-xs bg-[#121520]/60">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-black/50 border-b border-white/10 text-[11px] font-mono text-[#a9a49a] uppercase">
                      <th className="py-3 px-4 w-48 font-mono text-emerald-300">Treatment</th>
                      <th className="py-3 px-4 font-mono">Case / Citation</th>
                      <th className="py-3 px-4">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {subsequentHistory.map((sh, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono text-emerald-300 font-bold text-xs uppercase align-top">
                          {sh.type}
                        </td>
                        <td className="py-3 px-4 font-mono text-white text-xs align-top">
                          {sh.case} ({sh.year})
                        </td>
                        <td className="py-3 px-4 text-white/80 text-xs align-top">
                          {sh.note}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Mandatory Citator Disclaimer */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xs text-xs font-mono text-amber-200/90 leading-relaxed italic flex items-start gap-3">
              <span className="text-base text-amber-400">⚠️</span>
              <div>
                <strong className="text-amber-300 not-italic uppercase font-bold mr-1">
                  Mandatory Citator Notice:
                </strong>
                {disclaimerText}
              </div>
            </div>
          </section>
        )}

        {/* 5. FULL PARALLEL CITATION INDEX */}
        {parallelList.length > 0 && (
          <section className="space-y-4 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-emerald-400">5 ·</span>
                <h3 className="font-anton text-lg sm:text-xl text-white tracking-wide uppercase">
                  FULL PARALLEL CITATION INDEX
                </h3>
              </div>
              <button
                onClick={handleCopyParallel}
                className="text-[11px] font-mono text-emerald-400 hover:text-white uppercase font-bold cursor-pointer transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy All'}
              </button>
            </div>

            <div className="p-4 sm:p-5 bg-[#121520] border border-white/10 rounded-xs">
              <div className="flex flex-wrap gap-2">
                {parallelList.map((cite, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 bg-[#0A0C10] border border-emerald-500/30 text-emerald-200 text-xs font-mono font-medium rounded-xs hover:border-emerald-400 transition-colors"
                  >
                    {cite}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
