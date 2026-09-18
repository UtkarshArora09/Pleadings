'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import statuteMap from '@/content/statute-map.json';

export function AdvocateQuickToolkit() {
  const [selectedOld, setSelectedOld] = useState<string>('IPC §79');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const activeStatute = useMemo(() => {
    return (
      statuteMap.find((s) => s.old === selectedOld) ||
      statuteMap.find((s) => s.old.toLowerCase().includes(searchQuery.toLowerCase()) || (s.new && s.new.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      statuteMap[3]
    );
  }, [selectedOld, searchQuery]);

  const handleCopy = () => {
    if (!activeStatute) return;
    const textToCopy = `${activeStatute.old} corresponds to ${activeStatute.new || 'Repealed/Omitted'} (${activeStatute.subject}). Judicial Note: ${activeStatute.note}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const popularPills = ['IPC §79', 'IPC §300', 'IPC §302', 'CrPC §154', 'IEA §27', 'IEA §65B', 'IPC §499'];

  return (
    <div className="mt-12 sm:mt-20 pt-8 sm:pt-10 border-t border-white/10 select-none overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 sm:mb-8">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono font-bold uppercase rounded-2xs tracking-wider">
              LITIGATION & TRIAL ADVOCACY
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">
              ● Live 2026 Concordance
            </span>
          </div>
          <h3 className="font-anton text-xl sm:text-3xl lg:text-4xl text-white uppercase tracking-tight break-words">
            IPC → BNS Rapid Concordance & Courtroom Precedent
          </h3>
          <p className="text-xs sm:text-sm text-[#a9a49a] font-sans">
            Instant cross-statute mapping for drafting plaints, bail applications, and framing trial arguments.
          </p>
        </div>

        <Link
          href="/bns"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xs border border-white/15 transition-all self-start md:self-auto cursor-pointer flex-shrink-0"
        >
          <span>Full Statute Matrix</span>
          <span>→</span>
        </Link>
      </div>

      {/* Quick Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none w-full">
        <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 flex-shrink-0">
          Quick Lookup:
        </span>
        {popularPills.map((pill) => {
          const isSelected = activeStatute?.old === pill;
          return (
            <button
              key={pill}
              onClick={() => {
                setSelectedOld(pill);
                setSearchQuery('');
              }}
              className={`px-2.5 sm:px-3 py-1 text-xs font-mono font-bold rounded-xs transition-all flex-shrink-0 cursor-pointer border ${
                isSelected
                  ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-md scale-105'
                  : 'bg-[#151824] text-white/70 hover:text-white border-white/10 hover:bg-white/10'
              }`}
            >
              {pill}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Tool Card */}
      <div className="p-4 sm:p-8 bg-gradient-to-br from-[#12141F] to-[#0D0F17] border border-[#D4AF37]/30 rounded-sm shadow-2xl space-y-6 w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left Column: Old vs New Statute Box */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-2 sm:gap-4 p-3.5 sm:p-4 bg-black/60 border border-white/10 rounded-xs">
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-white/50 uppercase block truncate">
                  Colonial Statute
                </span>
                <span className="font-anton text-xl sm:text-2xl md:text-3xl text-[#E50914] tracking-tight block">
                  {activeStatute.old}
                </span>
              </div>

              <span className="text-xl sm:text-2xl text-[#D4AF37] font-bold flex-shrink-0 px-1">→</span>

              <div className="text-right min-w-0">
                <span className="text-[10px] font-mono text-white/50 uppercase block truncate">
                  New Code (2024–2026)
                </span>
                <span className="font-anton text-xl sm:text-2xl md:text-3xl text-emerald-400 tracking-tight block">
                  {activeStatute.new || 'REPEALED'}
                </span>
              </div>
            </div>

            {/* Subject Title */}
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block mb-1">
                LEGAL SUBJECT MATTER
              </span>
              <h4 className="font-serif font-bold text-sm sm:text-base md:text-lg text-white leading-snug break-words">
                {activeStatute.subject}
              </h4>
            </div>
          </div>

          {/* Right Column: Judicial Note & Practical Court Application */}
          <div className="lg:col-span-7 space-y-4 lg:border-l lg:border-white/10 lg:pl-6 min-w-0">
            <div className="p-3.5 sm:p-4 bg-black/40 border border-white/10 rounded-xs space-y-2">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                SUBSTANTIVE LITIGATION NUANCE & STATUTORY HOLDING
              </span>
              <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed font-sans break-words">
                {activeStatute.note}
              </p>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold uppercase rounded-xs transition-all border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{copied ? '✓ COPIED TO CLIPBOARD' : 'COPY CITATION NOTE'}</span>
              </button>

              <div className="flex items-center gap-4">
                <Link
                  href="/contribute"
                  className="text-xs font-mono font-bold text-[#D4AF37] hover:underline flex items-center justify-center sm:justify-start gap-1 py-1"
                >
                  <span>+ Submit A Case</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/browse"
                  className="text-xs font-mono font-bold text-white/70 hover:text-white hover:underline flex items-center justify-center sm:justify-start gap-1 py-1"
                >
                  <span>Browse Judgments</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
