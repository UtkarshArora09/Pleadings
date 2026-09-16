'use client';

import React, { useState } from 'react';
import statuteMapData from '@/content/statute-map.json';

interface StatuteRefInlineProps {
  oldSec: string;
  newSec?: string;
  onClick?: () => void;
}

export function StatuteRefInline({ oldSec, newSec, onClick }: StatuteRefInlineProps) {
  // Find matching statute info from statute-map.json
  const match = statuteMapData.find(
    (s) => s.old.toLowerCase() === oldSec.toLowerCase() || s.old.replace(/\s+/g, '') === oldSec.replace(/\s+/g, '')
  );

  const displayNew = newSec || (match ? match.new : null);
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1 font-mono text-[11px] sm:text-xs px-1.5 py-0.5 rounded-xs bg-[#1E2230] text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] hover:bg-[#252a3d] transition-all cursor-pointer select-none mx-1 align-baseline"
        title={`Click to view IPC to BNS transition details for ${oldSec}`}
      >
        <span>{oldSec}</span>
        {displayNew && (
          <>
            <span className="text-white/50">→</span>
            <span className="text-emerald-400 font-semibold">{displayNew}</span>
          </>
        )}
      </button>

      {/* Inline Modal if no parent handler */}
      {showModal && (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-xs cursor-pointer"
            onClick={() => setShowModal(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md bg-[#12141C] text-[#F3EFE6] border border-[#D4AF37]/40 rounded-xl p-5 sm:p-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
                STATUTORY CODE TRANSITION
              </span>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-white p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 py-3 px-4 bg-black/40 rounded-xs border border-white/10 mb-4">
              <div className="text-center">
                <div className="text-[10px] text-white/50 uppercase font-mono">Repealed Law</div>
                <div className="text-base font-mono font-bold text-[#D4AF37]">{oldSec}</div>
              </div>
              <div className="text-white/40 text-lg">➔</div>
              <div className="text-center">
                <div className="text-[10px] text-white/50 uppercase font-mono">Current Law</div>
                <div className="text-base font-mono font-bold text-emerald-400">{displayNew || 'No Equivalent'}</div>
              </div>
            </div>

            <div className="space-y-2 text-xs leading-relaxed text-white/80 font-sans">
              <p><strong>Subject:</strong> {match?.subject || 'Statutory Offence / Provision'}</p>
              <p><strong>Legislative Note:</strong> {match?.note || 'Provision updated under the new Bharatiya criminal code framework.'}</p>
              {match?.changed && (
                <div className="p-2 bg-amber-950/40 border border-amber-600/30 rounded-xs text-[11px] text-amber-300">
                  ⚠️ Note: Significant statutory or constitutional change occurred in this section.
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
