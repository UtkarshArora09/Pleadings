'use client';

import React, { useState } from 'react';
import { CaseStatus, CaseStatusCode } from '@/types/case';

interface StatusBadgeProps {
  status: CaseStatus;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  className?: string;
}

const statusConfig: Record<
  CaseStatusCode,
  {
    label: string;
    bg: string;
    text: string;
    border: string;
    dotColor: string;
    icon: string;
  }
> = {
  GOOD_LAW: {
    label: 'Still good law',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40',
    dotColor: 'bg-emerald-400',
    icon: '✓'
  },
  PARTLY_SUPERSEDED: {
    label: 'Partly superseded',
    bg: 'bg-amber-950/80',
    text: 'text-amber-300',
    border: 'border-amber-500/40',
    dotColor: 'bg-amber-400',
    icon: '!'
  },
  OVERRULED: {
    label: 'Overruled',
    bg: 'bg-rose-950/80',
    text: 'text-rose-300',
    border: 'border-rose-500/40',
    dotColor: 'bg-rose-400',
    icon: '✕'
  },
  STATUTE_REPLACED: {
    label: 'Statute replaced',
    bg: 'bg-sky-950/80',
    text: 'text-sky-300',
    border: 'border-sky-500/40',
    dotColor: 'bg-sky-400',
    icon: '§'
  }
};

export function StatusBadge({
  status,
  size = 'md',
  interactive = true,
  className = ''
}: StatusBadgeProps) {
  const [showModal, setShowModal] = useState(false);
  const statusCode = (typeof status === 'object' && status?.code) ? status.code : 'GOOD_LAW';
  const cfg = statusConfig[statusCode] || statusConfig.GOOD_LAW;
  const explainText = (typeof status === 'object' && status?.explain)
    ? status.explain
    : 'This landmark ruling remains authoritative and governing law.';
  const chainList = (typeof status === 'object' && Array.isArray(status?.chain)) ? status.chain : [];

  const sizeClasses = {
    sm: 'text-[9px] px-1.5 py-0.5 gap-1',
    md: 'text-[10px] sm:text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs sm:text-sm px-3 py-1.5 gap-2'
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <>
      <span
        onClick={interactive ? handleClick : undefined}
        role={interactive ? 'button' : undefined}
        tabIndex={interactive ? 0 : undefined}
        onKeyDown={(e) => {
          if (interactive && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setShowModal(true);
          }
        }}
        className={`inline-flex items-center font-mono font-bold uppercase tracking-wider rounded-xs border transition-all ${
          cfg.bg
        } ${cfg.text} ${cfg.border} ${sizeClasses} ${
          interactive
            ? 'hover:brightness-125 cursor-pointer shadow-sm hover:scale-[1.02]'
            : 'select-none'
        } ${className}`}
        title={interactive ? 'Click to see how this precedent changed over time' : cfg.label}
        data-status-code={statusCode}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dotColor} animate-pulse`} />
        <span>{cfg.label}</span>
        {interactive && <span className="opacity-70 text-[9px] font-mono">?</span>}
      </span>

      {/* Explanatory Chain Sheet */}
      {showModal && (
        <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />

          <div
            className="relative z-10 w-full max-w-lg bg-[#12141C] text-[#F3EFE6] border border-[#D4AF37]/40 rounded-xl p-5 sm:p-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-slideUp sm:animate-scaleUp"
            role="dialog"
            aria-modal="true"
            aria-labelledby="status-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-xs border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                >
                  <span>{cfg.icon}</span>
                  <span>{cfg.label}</span>
                </span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white p-1 text-lg leading-none cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Explanation */}
            <div className="space-y-4 font-sans">
              <div>
                <h3 id="status-title" className="font-serif font-bold text-base sm:text-lg text-white mb-1">
                  How This Law Stands Today
                </h3>
                <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed">
                  {explainText}
                </p>
              </div>

              {/* Chain of Events Timeline */}
              {chainList.length > 0 && (
                <div className="pt-3 border-t border-white/10">
                  <h4 className="text-[11px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold mb-3">
                    Precedent & Statutory Chain of Events
                  </h4>
                  <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D4AF37]/30">
                    {chainList.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-[#D4AF37] border-2 border-[#12141C]" />
                        <div className="font-mono text-xs font-bold text-[#D4AF37]">
                          {item.year}
                        </div>
                        <p className="text-xs text-white/90 leading-relaxed mt-0.5">
                          {item.event}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="mt-6 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f27] text-black text-xs font-bold uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
