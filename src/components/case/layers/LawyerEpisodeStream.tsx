'use client';

import React, { useState } from 'react';
import { LawyerEpisode, AdvocateReference } from '@/types/case';

interface LawyerEpisodeStreamProps {
  lawyerEpisodes?: LawyerEpisode[];
  advocateReference?: AdvocateReference;
  subsequentHistory?: { type: string; case: string; year: number; note: string }[];
  primaryCitation?: string;
  parallelCitations?: string[];
  lang?: 'en' | 'hi';
}

export function LawyerEpisodeStream({
  lawyerEpisodes,
  advocateReference,
  primaryCitation,
  parallelCitations = [],
}: LawyerEpisodeStreamProps) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Build the list of lawyer episodes from props or fallback to advocateReference
  const episodes: LawyerEpisode[] = (lawyerEpisodes && lawyerEpisodes.length > 0)
    ? lawyerEpisodes
    : [
        {
          id: 'lawyer-ep-1',
          n: 1,
          type: 'STATUTORY_TEXT',
          kicker: 'LAWYER EPISODE 01 · STATUTORY TEXT',
          title: 'Statutory Text As Reproduced In The Judgment',
          description: 'Verbatim statutory provisions and sections reproduced in full by the court.',
          statutoryText: advocateReference?.statutoryText || [],
        },
        {
          id: 'lawyer-ep-2',
          n: 2,
          type: 'ENUMERATED_HOLDINGS',
          kicker: 'LAWYER EPISODE 02 · COURT HOLDINGS',
          title: "The Court's Enumerated Holdings",
          description: "Operative conclusions and findings of law with precise pinpoint citations.",
          holdings: advocateReference?.holdings || [],
        },
        {
          id: 'lawyer-ep-3',
          n: 3,
          type: 'PRECEDENTS_DISCUSSED',
          kicker: 'LAWYER EPISODE 03 · PRECEDENT TREATMENT',
          title: 'Precedents Discussed In This Judgment',
          description: 'Prior authorities cited and their specific judicial treatment by the bench.',
          precedents: advocateReference?.precedents || [],
        },
        {
          id: 'lawyer-ep-4',
          n: 4,
          type: 'CITATOR_HISTORY',
          kicker: 'LAWYER EPISODE 04 · CITATOR HISTORY',
          title: 'Subsequent Citator History',
          description: 'Recorded citator history entries and subsequent judicial references.',
          citatorHistory: advocateReference?.citatorHistory || [],
          citatorDisclaimer: advocateReference?.citatorDisclaimer ||
            "These are the citator entries recorded in this report and may not be complete or current. Verify this case's present status through a live citator (SCC Online, Manupatra, or equivalent) before relying on it in an active matter.",
        },
        {
          id: 'lawyer-ep-5',
          n: 5,
          type: 'PARALLEL_CITATIONS',
          kicker: 'LAWYER EPISODE 05 · PARALLEL CITATIONS',
          title: 'Full Parallel Citation Index',
          description: 'Cross-reporter citations across AIR, SCC, SCR, SCALE, Cri LJ, and High Court reporters.',
          parallelCitations: advocateReference?.parallelCitations || parallelCitations,
        },
      ];

  return (
    <div className="space-y-12 animate-fadeIn">
      {episodes.map((ep, idx) => {
        const epNum = ep.n || idx + 1;

        return (
          <article
            key={ep.id || idx}
            id={`episode-${epNum}`}
            className="py-8 sm:py-12 md:py-16 md:min-h-[calc(100vh-64px)] md:snap-start flex flex-col justify-center border-t border-emerald-500/20 space-y-6 relative scroll-mt-16"
          >
            {/* Episode Header */}
            <div className="space-y-1.5 pb-2 border-b border-emerald-500/20">
              <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-emerald-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{ep.kicker || `LAWYER EPISODE 0${epNum}`}</span>
                </div>
                <span className="text-white/40">{epNum} / {episodes.length}</span>
              </div>
              <h2 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight leading-snug">
                {ep.title}
              </h2>
              {ep.description && (
                <p className="text-xs text-[#a9a49a] font-sans">
                  {ep.description}
                </p>
              )}
            </div>

            {/* Content per episode type */}
            <div className="space-y-4">
              {/* 1. STATUTORY TEXT */}
              {ep.type === 'STATUTORY_TEXT' && (
                <div className="space-y-4">
                  {(!ep.statutoryText || ep.statutoryText.length === 0) ? (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-xs text-xs font-mono text-[#a9a49a] italic">
                      No statutory text reproduced directly in this report.
                    </div>
                  ) : (
                    ep.statutoryText.map((item, stIdx) => (
                      <div
                        key={stIdx}
                        className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2">
                          <span className="font-mono text-xs font-bold text-emerald-300">
                            {item.statute}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(item.text, `statute-${stIdx}`)}
                            className="text-[10px] font-mono text-emerald-400 hover:text-white uppercase px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xs transition-colors cursor-pointer"
                          >
                            {copiedText === `statute-${stIdx}` ? '✓ Copied' : 'Copy Quote'}
                          </button>
                        </div>
                        <blockquote className="text-xs sm:text-sm text-emerald-50/90 italic font-serif leading-relaxed pl-3 border-l-2 border-emerald-400/60 whitespace-pre-wrap">
                          {item.text}
                        </blockquote>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 2. ENUMERATED HOLDINGS */}
              {ep.type === 'ENUMERATED_HOLDINGS' && (
                <div className="space-y-3">
                  {(!ep.holdings || ep.holdings.length === 0) ? (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-xs text-xs font-mono text-[#a9a49a] italic">
                      No enumerated holdings recorded for this report.
                    </div>
                  ) : (
                    ep.holdings.map((h, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-4 bg-black/40 border border-emerald-500/20 rounded-xs flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-xs shrink-0">
                            #{h.number}
                          </span>
                          <p className="text-xs sm:text-sm text-white font-medium leading-relaxed">
                            {h.holding}
                          </p>
                        </div>
                        {h.pinpoint && (
                          <span className="font-mono text-[11px] text-emerald-300/80 bg-[#0A0C10] border border-white/10 px-2 py-1 rounded-xs shrink-0 self-start sm:self-auto">
                            ¶ {h.pinpoint}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. PRECEDENTS DISCUSSED */}
              {ep.type === 'PRECEDENTS_DISCUSSED' && (
                <div className="space-y-3">
                  {(!ep.precedents || ep.precedents.length === 0) ? (
                    <div className="p-5 bg-black/40 border border-white/10 rounded-xs text-xs font-mono text-[#a9a49a] italic">
                      No prior precedents discussed in this report.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-emerald-500/20 rounded-xs">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#0A0C10] text-[#a9a49a] uppercase text-[10px] border-b border-white/10">
                          <tr>
                            <th className="p-3">Case Authority</th>
                            <th className="p-3">Citation</th>
                            <th className="p-3">Judicial Treatment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/40">
                          {ep.precedents.map((p, pIdx) => (
                            <tr key={pIdx} className="hover:bg-emerald-500/5 transition-colors">
                              <td className="p-3 text-white font-bold">{p.caseName}</td>
                              <td className="p-3 text-emerald-300">{p.citation}</td>
                              <td className="p-3">
                                <span className="inline-block px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 rounded-xs text-[10px]">
                                  {p.treatment}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 4. SUBSEQUENT CITATOR HISTORY */}
              {ep.type === 'CITATOR_HISTORY' && (
                <div className="space-y-4">
                  {/* Mandatory Amber Disclaimer */}
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xs text-xs font-mono leading-relaxed">
                    <span className="font-bold text-amber-400 mr-1.5">⚠ NOTICE:</span>
                    {ep.citatorDisclaimer ||
                      "These are the citator entries recorded in this report and may not be complete or current. Verify this case's present status through a live citator (SCC Online, Manupatra, or equivalent) before relying on it in an active matter."}
                  </div>

                  {(!ep.citatorHistory || ep.citatorHistory.length === 0) ? (
                    <div className="p-4 bg-black/40 border border-white/10 rounded-xs text-xs font-mono text-[#a9a49a] italic">
                      No subsequent citator entries recorded in this report.
                    </div>
                  ) : (
                    <div className="overflow-x-auto border border-emerald-500/20 rounded-xs">
                      <table className="w-full text-left text-xs font-mono">
                        <thead className="bg-[#0A0C10] text-[#a9a49a] uppercase text-[10px] border-b border-white/10">
                          <tr>
                            <th className="p-3">Citator Code</th>
                            <th className="p-3">Subsequent Citation</th>
                            <th className="p-3">Point(s)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-black/40">
                          {ep.citatorHistory.map((c, cIdx) => (
                            <tr key={cIdx} className="hover:bg-emerald-500/5 transition-colors">
                              <td className="p-3 text-emerald-400 font-bold">{c.code}</td>
                              <td className="p-3 text-white">{c.citation}</td>
                              <td className="p-3 text-[#a9a49a]">{c.points || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* 5. FULL PARALLEL CITATION INDEX */}
              {ep.type === 'PARALLEL_CITATIONS' && (
                <div className="space-y-4">
                  {primaryCitation && (
                    <div className="p-3.5 bg-black/40 border border-emerald-500/30 rounded-xs flex items-center justify-between gap-3">
                      <div>
                        <div className="text-[10px] font-mono uppercase text-[#a9a49a]">Primary Report Citation:</div>
                        <div className="text-sm font-mono text-emerald-300 font-bold">{primaryCitation}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(primaryCitation, 'primary')}
                        className="text-xs font-mono text-emerald-400 hover:text-white uppercase px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xs cursor-pointer"
                      >
                        {copiedText === 'primary' ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {ep.parallelCitations && ep.parallelCitations.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-[11px] font-mono text-[#a9a49a] uppercase font-bold">
                        Parallel Law Report Citations ({ep.parallelCitations.length}):
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ep.parallelCitations.map((cite, cIdx) => (
                          <div
                            key={cIdx}
                            className="p-3 bg-black/40 border border-white/10 rounded-xs flex items-center justify-between gap-2 hover:border-emerald-500/30 transition-colors"
                          >
                            <span className="text-xs font-mono text-emerald-200">{cite}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(cite, `cite-${cIdx}`)}
                              className="text-[10px] font-mono text-emerald-400 hover:text-white uppercase px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-xs cursor-pointer"
                            >
                              {copiedText === `cite-${cIdx}` ? '✓' : 'Copy'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. CUSTOM LAWYER EPISODES (IF ANY ADDED BY ADMIN) */}
              {ep.type === 'CUSTOM' && ep.blocks && (
                <div className="p-5 bg-black/40 border border-emerald-500/20 rounded-xs space-y-3">
                  {ep.blocks.map((b, bIdx) => (
                    <p key={bIdx} className="text-xs sm:text-sm text-white/90 leading-relaxed font-sans">
                      {b.text}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Quick Navigation */}
            <div className="pt-3 flex items-center justify-between border-t border-emerald-500/20 text-xs font-mono">
              <span className="text-white/40">Lawyer Section {epNum} of {episodes.length}</span>
              {epNum < episodes.length && (
                <button
                  type="button"
                  onClick={() => {
                    const nextEl = document.getElementById(`episode-${epNum + 1}`);
                    if (nextEl) nextEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-white font-bold uppercase transition-colors cursor-pointer"
                >
                  <span>Continue to Section {epNum + 1}</span>
                  <span>↓</span>
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
