'use client';

import React, { useState } from 'react';
import { JudgeDecision } from '@/types';
import { useApp } from '@/context/AppContext';

interface JudgePollProps {
  caseSlug: string;
  judgeDecision: JudgeDecision;
  onAdvanceToVerdict?: () => void;
}

export function JudgePoll({ caseSlug, judgeDecision, onAdvanceToVerdict }: JudgePollProps) {
  const { language, userDecisions, setUserDecision } = useApp();
  const userSelectedOptionId = userDecisions[caseSlug];
  const [selectedId, setSelectedId] = useState<string | null>(userSelectedOptionId || null);
  const [showRationale, setShowRationale] = useState<boolean>(Boolean(userSelectedOptionId));

  const handleVote = (optionId: string) => {
    setSelectedId(optionId);
    setUserDecision(caseSlug, optionId);
    setShowRationale(true);
  };

  const hasVoted = Boolean(selectedId);
  const chosenOption = judgeDecision.options.find((opt) => opt.id === selectedId);

  return (
    <div className="w-full max-w-xl mx-auto my-4 bg-[#141722]/95 border border-[#D4AF37]/30 p-5 sm:p-7 shadow-2xl rounded-sm backdrop-blur-sm">
      {/* Header Gavel Icon */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
            {language === 'en' ? 'Interactive Judicial Decision' : 'न्यायिक निर्णय सिमुलेटर'}
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-[#a9a49a] font-mono">
          {hasVoted ? (language === 'en' ? 'VERDICT RECORDED' : 'फैसला दर्ज') : (language === 'en' ? 'VOTE REQUIRED' : 'मतदान आवश्यक')}
        </span>
      </div>

      {/* Main Question */}
      <h3 className="font-anton text-xl sm:text-2xl text-white uppercase tracking-tight leading-tight mb-2">
        {judgeDecision.question[language]}
      </h3>

      <p className="text-xs text-[#a9a49a] mb-5 leading-relaxed">
        {judgeDecision.subtext[language]}
      </p>

      {/* Options List */}
      <div className="space-y-3 mb-6">
        {judgeDecision.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrectVerdict = option.isActualVerdict;

          return (
            <button
              key={option.id}
              onClick={() => handleVote(option.id)}
              disabled={hasVoted}
              className={`w-full text-left p-4 rounded-xs border transition-all duration-300 relative overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                  : hasVoted
                  ? 'border-white/10 bg-white/5 opacity-80 cursor-default'
                  : 'border-white/15 bg-white/5 hover:border-[#D4AF37]/70 hover:bg-white/10'
              }`}
            >
              {/* Animated Progress Bar when voted */}
              {hasVoted && (
                <div
                  className={`absolute left-0 top-0 bottom-0 opacity-20 transition-all duration-700 ${
                    isCorrectVerdict ? 'bg-[#D4AF37]' : 'bg-[#B23A2E]'
                  }`}
                  style={{ width: `${option.simulatedVotesPercent}%` }}
                />
              )}

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs sm:text-sm text-[#F3EFE6] tracking-wide uppercase">
                      {option.title[language]}
                    </span>
                    {hasVoted && isCorrectVerdict && (
                      <span className="text-[9px] font-bold bg-[#D4AF37] text-[#0E1016] px-1.5 py-0.5 uppercase tracking-wider rounded-xs">
                        {language === 'en' ? 'Court Held This' : 'अदालत का फैसला'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#c9c5bc] leading-relaxed font-normal">
                    {option.reason[language]}
                  </p>
                </div>

                {hasVoted && (
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-anton text-[#D4AF37]">
                      {option.simulatedVotesPercent}%
                    </span>
                    <span className="block text-[9px] text-[#a9a49a] uppercase tracking-wider">
                      {language === 'en' ? 'Law Students' : 'छात्र मत'}
                    </span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Rationale & Advance Button */}
      {showRationale && (
        <div className="pt-4 border-t border-white/10 animate-fadeIn">
          <div className="bg-[#0E1016]/90 p-4 border-l-2 border-[#D4AF37] mb-4">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
              {language === 'en' ? 'Bench Analysis' : 'न्यायिक विश्लेषण'}
            </span>
            <p className="text-xs text-[#d1cdc4] leading-relaxed">
              {judgeDecision.judicialRationale[language]}
            </p>
          </div>

          {onAdvanceToVerdict && (
            <button
              onClick={onAdvanceToVerdict}
              className="w-full py-3 bg-[#D4AF37] hover:bg-white text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{language === 'en' ? 'Read Actual Judgment & Ratio' : 'आधिकारिक फैसला और कानूनी तर्क पढ़ें'}</span>
              <span>→</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
