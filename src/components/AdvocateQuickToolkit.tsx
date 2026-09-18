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
    <div className="mt-8 sm:mt-16 pt-6 sm:pt-10 border-t border-white/10 select-none w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-8 w-full min-w-0">
        <div className="space-y-1.5 w-full min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[9px] sm:text-[10px] font-mono font-bold uppercase rounded-2xs tracking-wider break-words">
              LITIGATION & TRIAL ADVOCACY
            </span>
            <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-semibold uppercase">
              ● Live 2026 Concordance
            </span>
          </div>
          <h3 className="font-anton text-lg sm:text-2xl lg:text-3xl text-white uppercase tracking-tight break-words leading-tight">
            IPC → BNS Rapid Concordance & Precedent
          </h3>
          <p className="text-xs sm:text-sm text-[#a9a49a] font-sans break-words">
            Instant cross-statute mapping for drafting plaints, bail applications, and framing trial arguments.
          </p>
        </div>

        <Link
          href="/bns"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-white/10 hover:bg-[#D4AF37] hover:text-black text-white text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider rounded-xs border border-white/15 transition-all self-start md:self-auto cursor-pointer flex-shrink-0"
        >
          <span>Full Statute Matrix</span>
          <span>→</span>
        </Link>
      </div>

      {/* Quick Pills Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 mb-3.5 scrollbar-none w-full max-w-full">
        <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/50 flex-shrink-0">
          Quick:
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
              className={`px-2 sm:px-3 py-1 text-[11px] sm:text-xs font-mono font-bold rounded-xs transition-all flex-shrink-0 cursor-pointer border ${
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
      <div className="p-3.5 sm:p-7 bg-gradient-to-br from-[#12141F] to-[#0D0F17] border border-[#D4AF37]/30 rounded-sm shadow-2xl space-y-4 sm:space-y-6 w-full overflow-hidden min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center w-full min-w-0">
          
          {/* Left Column: Old vs New Statute Box */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4 w-full min-w-0">
            <div className="flex items-center justify-between gap-2 p-3 sm:p-4 bg-black/60 border border-white/10 rounded-xs w-full min-w-0">
              <div className="min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-white/50 uppercase block truncate">
                  Colonial Code
                </span>
                <span className="font-anton text-lg sm:text-2xl md:text-3xl text-[#E50914] tracking-tight block truncate">
                  {activeStatute.old}
                </span>
              </div>

              <span className="text-lg sm:text-2xl text-[#D4AF37] font-bold flex-shrink-0 px-1">→</span>

              <div className="text-right min-w-0 flex-1">
                <span className="text-[9px] sm:text-[10px] font-mono text-white/50 uppercase block truncate">
                  New Code (BNS)
                </span>
                <span className="font-anton text-lg sm:text-2xl md:text-3xl text-emerald-400 tracking-tight block truncate">
                  {activeStatute.new || 'REPEALED'}
                </span>
              </div>
            </div>

            {/* Subject Title */}
            <div className="w-full min-w-0">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold block mb-0.5">
                LEGAL SUBJECT MATTER
              </span>
              <h4 className="font-serif font-bold text-xs sm:text-base md:text-lg text-white leading-snug break-words">
                {activeStatute.subject}
              </h4>
            </div>
          </div>

          {/* Right Column: Judicial Note & Practical Court Application */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:border-l lg:border-white/10 lg:pl-6 w-full min-w-0">
            <div className="p-3 sm:p-4 bg-black/40 border border-white/10 rounded-xs space-y-1.5 w-full min-w-0 overflow-hidden">
              <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block break-words">
                SUBSTANTIVE TRIAL NUANCE & JUDICIAL HOLDING
              </span>
              <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed font-sans break-words">
                {activeStatute.note}
              </p>
            </div>

            {/* Action Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1 w-full min-w-0">
              <button
                onClick={handleCopy}
                className="w-full sm:w-auto px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-xs font-mono font-bold uppercase rounded-xs transition-all border border-white/15 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{copied ? '✓ COPIED TO CLIPBOARD' : 'COPY CITATION NOTE'}</span>
              </button>

              <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0">
                <Link
                  href="/contribute"
                  className="text-xs font-mono font-bold text-[#D4AF37] hover:underline flex items-center gap-1 py-1"
                >
                  <span>+ Submit Case</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/browse"
                  className="text-xs font-mono font-bold text-white/70 hover:text-white hover:underline flex items-center gap-1 py-1"
                >
                  <span>Browse Directory</span>
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
