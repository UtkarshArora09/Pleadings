'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ShareSheet } from './ShareSheet';

interface VoteOption {
  id: string;
  label: string;
  argument: string;
}

interface VoteGateProps {
  slug: string;
  caseTitle: string;
  question: string;
  context: string;
  options: [VoteOption, VoteOption];
  courtChoseOptionId: string;
  onUnlocked?: () => void;
  lang?: 'en' | 'hi';
}

function getOrCreateAnonId(): string {
  if (typeof window === 'undefined') return 'server-anon';
  let id = localStorage.getItem('pleadings:anonId');
  if (!id) {
    id = 'anon-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
    localStorage.setItem('pleadings:anonId', id);
  }
  return id;
}

export function VoteGate({
  slug,
  caseTitle,
  question,
  context,
  options,
  courtChoseOptionId,
  onUnlocked,
  lang = 'en'
}: VoteGateProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [totalVotes, setTotalVotes] = useState<number>(0);
  const [isThresholdMet, setIsThresholdMet] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const fetchVoteData = useCallback(async () => {
    try {
      const anonId = getOrCreateAnonId();
      const res = await fetch(`/api/vote/${slug}?anonId=${anonId}`);
      const data = await res.json();
      if (data.success) {
        setTotalVotes(data.totalVotes || 0);
        setIsThresholdMet(Boolean(data.isThresholdMet));
        if (data.percentages) {
          setPercentages(data.percentages);
        }
        if (data.userVote) {
          setSelectedOption(data.userVote);
          setHasVoted(true);
          if (onUnlocked) onUnlocked();
        }
      }
    } catch (e) {
      console.error('Failed to load vote stats:', e);
    }
  }, [slug, onUnlocked]);

  useEffect(() => {
    // Check local storage for previous vote
    const savedVotes = localStorage.getItem('pleadings:votes');
    if (savedVotes) {
      try {
        const parsed = JSON.parse(savedVotes);
        if (parsed[slug]) {
          setSelectedOption(parsed[slug]);
          setHasVoted(true);
          if (onUnlocked) onUnlocked();
        }
      } catch (e) {
        console.error(e);
      }
    }
    fetchVoteData();
  }, [slug, fetchVoteData, onUnlocked]);

  const handleCastVote = async (optionId: string) => {
    if (hasVoted) return;
    setSelectedOption(optionId);
    setIsSubmitting(true);

    try {
      const anonId = getOrCreateAnonId();
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          optionId,
          anonId
        })
      });

      const data = await res.json();
      if (data.success) {
        setHasVoted(true);
        setTotalVotes(data.totalVotes || 1);
        setIsThresholdMet(Boolean(data.isThresholdMet));
        if (data.percentages) {
          setPercentages(data.percentages);
        }

        // Save locally
        const saved = localStorage.getItem('pleadings:votes');
        const parsed = saved ? JSON.parse(saved) : {};
        parsed[slug] = optionId;
        localStorage.setItem('pleadings:votes', JSON.stringify(parsed));

        if (onUnlocked) onUnlocked();
      }
    } catch (e) {
      console.error('Error submitting vote:', e);
      setHasVoted(true);
      if (onUnlocked) onUnlocked();
    } finally {
      setIsSubmitting(false);
    }
  };

  const didAgree = selectedOption === courtChoseOptionId;

  return (
    <div className="my-8 p-5 sm:p-6 bg-[#141824] border border-[#D4AF37]/50 rounded-xs shadow-2xl space-y-5 select-none relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] px-2.5 py-0.5 bg-[#D4AF37]/15 rounded-2xs border border-[#D4AF37]/30">
            ⚖ {lang === 'en' ? 'YOU ARE THE JUDGE' : 'आप हैं जज'}
          </span>
        </div>
        <span className="text-xs font-mono text-white/60">
          {hasVoted ? (lang === 'en' ? 'Verdict Unlocked ✓' : 'फैसले का खुलासा ✓') : (lang === 'en' ? 'Locked' : 'लॉक है')}
        </span>
      </div>

      {/* Dilemma Question & Context */}
      <div className="space-y-2">
        <h3 className="font-serif text-lg sm:text-xl font-bold text-white leading-snug">
          {question}
        </h3>
        <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed font-sans">
          {context}
        </p>
      </div>

      {/* Options Grid */}
      <div className="grid gap-3 sm:grid-cols-2 pt-1">
        {options.map((opt) => {
          const isChosen = selectedOption === opt.id;
          const isCourtChoice = opt.id === courtChoseOptionId;
          const percent = percentages[opt.id] ?? 50;

          return (
            <button
              key={opt.id}
              onClick={() => handleCastVote(opt.id)}
              disabled={hasVoted || isSubmitting}
              className={`p-4 rounded-xs border text-left flex flex-col justify-between transition-all cursor-pointer ${
                hasVoted
                  ? isChosen
                    ? isCourtChoice
                      ? 'bg-emerald-950/80 border-emerald-500 text-white'
                      : 'bg-rose-950/80 border-rose-500 text-white'
                    : isCourtChoice
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-white/90'
                    : 'bg-black/30 border-white/10 text-white/60'
                  : 'bg-[#181D2D] hover:bg-[#20263a] border-white/15 hover:border-[#D4AF37] text-white hover:scale-[1.01]'
              }`}
            >
              <div className="space-y-1.5 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-sans">{opt.label}</span>
                  {hasVoted && isChosen && (
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37]">
                      YOUR VOTE ✓
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  {opt.argument}
                </p>
              </div>

              {/* Vote result indicator */}
              {hasVoted && (
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-mono">
                  {isCourtChoice ? (
                    <span className="text-emerald-400 font-bold">
                      ⚖ {lang === 'en' ? 'Court Ruling' : 'अदालत का फैसला'}
                    </span>
                  ) : (
                    <span className="text-white/40">
                      {lang === 'en' ? 'Rejected by Court' : 'अदालत ने खारिज किया'}
                    </span>
                  )}

                  <span className="font-bold text-white">
                    {isThresholdMet ? `${percent}%` : (lang === 'en' ? 'Decided' : 'निर्णय दिया')}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status / Reveal Notice */}
      {!hasVoted ? (
        <div className="p-3 bg-black/40 border border-white/10 rounded-xs text-center text-xs font-mono text-[#D4AF37]">
          🔒 {lang === 'en' ? 'Cast your decision above to unlock the court\'s actual ruling.' : 'अदालत का फैसला जानने के लिए ऊपर अपना निर्णय चुनें।'}
        </div>
      ) : (
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono space-y-0.5">
            <div className={didAgree ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {didAgree
                ? (lang === 'en' ? '✓ You agreed with the court\'s holding.' : '✓ आप अदालत के फैसले से सहमत रहे।')
                : (lang === 'en' ? '⚖ You dissented from the court\'s ratio.' : '⚖ आपकी राय अदालत से भिन्न रही।')}
            </div>
            <div className="text-white/70 text-[11px]">
              {isThresholdMet ? (
                <span>
                  {totalVotes} {lang === 'en' ? 'readers have weighed this evidence.' : 'पाठकों ने अपना फैसला दिया।'}
                </span>
              ) : (
                <span className="text-[#D4AF37]">
                  ★ {lang === 'en' ? 'You are one of the first readers to decide this case.' : 'आप इस मामले में निर्णय देने वाले शुरुआती पाठकों में हैं।'}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>Share Verdict Card</span>
            <span>↗</span>
          </button>
        </div>
      )}

      {/* Share Modal */}
      <ShareSheet
        slug={slug}
        caseTitle={caseTitle}
        userVotedOptionId={selectedOption || undefined}
        courtOptionId={courtChoseOptionId}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        lang={lang}
      />
    </div>
  );
}
