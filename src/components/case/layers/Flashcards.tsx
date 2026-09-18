'use client';

import React, { useState } from 'react';

interface Flashcard {
  q: string;
  a: string;
}

interface FlashcardsProps {
  flashcards: Flashcard[];
  lang?: 'en' | 'hi';
}

export function Flashcards({ flashcards, lang = 'en' }: FlashcardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!flashcards || flashcards.length === 0) return null;

  const current = flashcards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  return (
    <div className="my-8 p-5 sm:p-6 bg-[#12151E] border border-[#D4AF37]/30 rounded-xs shadow-2xl space-y-4 select-none">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] px-2.5 py-0.5 bg-[#D4AF37]/15 rounded-2xs border border-[#D4AF37]/30">
            {lang === 'en' ? 'REVISION FLASHCARDS' : 'रिवीजन फ्लैशकार्ड्स'}
          </span>
        </div>
        <span className="text-xs font-mono text-white/50">
          {currentIndex + 1} / {flashcards.length}
        </span>
      </div>

      {/* Interactive Flashcard with Flip */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[160px] sm:min-h-[180px] p-5 sm:p-6 bg-[#181C28] hover:bg-[#1c2130] border border-white/10 rounded-xs flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.01] shadow-inner"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsFlipped(!isFlipped);
          }
        }}
        aria-label="Flip flashcard"
      >
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/40">
          {isFlipped
            ? (lang === 'en' ? 'ANSWER · TAP TO FLIP BACK' : 'उत्तर · वापस पलटने के लिए टैप करें')
            : (lang === 'en' ? 'QUESTION · TAP TO REVEAL ANSWER' : 'प्रश्न · उत्तर देखने के लिए टैप करें')}
        </div>

        <div className="py-2 text-sm sm:text-base font-medium leading-relaxed">
          {isFlipped ? (
            <p className="text-emerald-300 font-serif italic animate-fadeIn">
              {current.a}
            </p>
          ) : (
            <p className="text-white font-sans animate-fadeIn">
              {current.q}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-[#D4AF37]">
          <span>{isFlipped ? '✓ Answer Verified' : 'Tap Card'}</span>
          <span className="text-white/40 text-xs">↻ Flip</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xs text-xs font-mono text-white/80 transition-colors cursor-pointer"
        >
          ← {lang === 'en' ? 'Prev' : 'पिछला'}
        </button>

        <div className="flex gap-1">
          {flashcards.map((_, idx) => (
            <span
              key={idx}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentIndex ? 'bg-[#D4AF37] scale-125' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="px-3 py-1.5 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold rounded-xs text-xs font-mono transition-colors cursor-pointer"
        >
          {lang === 'en' ? 'Next' : 'अगला'} →
        </button>
      </div>
    </div>
  );
}
