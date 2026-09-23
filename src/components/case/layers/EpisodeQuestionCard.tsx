'use client';

import React, { useState } from 'react';
import { StudentQuestion } from '@/types/case';

interface EpisodeQuestionCardProps {
  questions: StudentQuestion[];
  episodeNum: number;
}

export function EpisodeQuestionCard({ questions, episodeNum }: EpisodeQuestionCardProps) {
  const [revealedIdxs, setRevealedIdxs] = useState<{ [key: number]: boolean }>({});
  const [selectedOption, setSelectedOption] = useState<{ [key: number]: number }>({});

  if (!questions || questions.length === 0) return null;

  const toggleReveal = (idx: number) => {
    setRevealedIdxs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="mt-4 p-4 bg-[#0A0D14] border border-sky-500/30 rounded-xs space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-sky-500/20">
        <div className="flex items-center gap-2">
          <span className="text-sky-400 font-mono text-xs">🎓</span>
          <h4 className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">
            Episode {episodeNum} · Student Check Questions ({questions.length})
          </h4>
        </div>
        <span className="text-[10px] font-mono text-sky-400/60 uppercase">Interactive Practice</span>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => {
          const isRevealed = revealedIdxs[idx] || false;
          const chosenOpt = selectedOption[idx];

          return (
            <div
              key={idx}
              className="p-3.5 bg-black/40 border border-sky-500/15 rounded-xs space-y-2.5 transition-all hover:border-sky-500/30"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-mono font-bold text-sky-400 shrink-0">
                  Q{idx + 1}:
                </span>
                <p className="text-xs sm:text-sm text-white font-medium flex-1 leading-relaxed">
                  {q.q}
                </p>
              </div>

              {/* Multiple choice options if provided */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = chosenOpt === optIdx;
                    const isCorrect = q.correctOptionIdx === optIdx;

                    let optStyle = 'bg-[#121520] border-white/10 text-white/80 hover:border-sky-400/50';
                    if (isRevealed) {
                      if (isCorrect) optStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold';
                      else if (isSelected && !isCorrect) optStyle = 'bg-red-500/20 border-red-500/50 text-red-300';
                    } else if (isSelected) {
                      optStyle = 'bg-sky-500/20 border-sky-400 text-sky-200';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => {
                          if (!isRevealed) {
                            setSelectedOption((prev) => ({ ...prev, [idx]: optIdx }));
                          }
                        }}
                        className={`w-full text-left p-2 rounded-xs border text-xs font-mono transition-all flex items-center justify-between ${optStyle}`}
                      >
                        <span>{opt}</span>
                        {isRevealed && isCorrect && <span className="text-emerald-400 font-bold">✓ Correct</span>}
                        {isRevealed && isSelected && !isCorrect && <span className="text-red-400 font-bold">✕</span>}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Reveal Answer Toggle */}
              <div className="pt-1 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => toggleReveal(idx)}
                  className="text-[11px] font-mono font-bold text-sky-400 hover:text-white uppercase transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>{isRevealed ? '▲ Hide Answer & Rule' : '▼ Reveal Answer & Legal Reason'}</span>
                </button>
              </div>

              {/* Answer Box */}
              {isRevealed && (
                <div className="p-3 bg-sky-950/40 border border-sky-500/30 rounded-xs space-y-1 animate-fadeIn">
                  <div className="text-[10px] font-mono font-bold text-sky-300 uppercase">
                    Answer & Legal Principle:
                  </div>
                  <p className="text-xs text-[#E0E7FF] leading-relaxed">
                    {q.a}
                  </p>
                  {q.explanation && (
                    <p className="text-[11px] text-sky-300/80 italic font-mono pt-1 border-t border-sky-500/20">
                      Rationale: {q.explanation}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
