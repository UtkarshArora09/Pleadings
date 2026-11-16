'use client';

import React, { useState } from 'react';
import { SuggestCaseModal } from './SuggestCaseModal';

interface SuggestCaseBannerProps {
  lang?: 'en' | 'hi';
  compact?: boolean;
}

export function SuggestCaseBanner({ lang = 'en', compact = false }: SuggestCaseBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-md border border-white/10 bg-gradient-to-r from-[#141824] via-[#10131E] to-[#141824] p-5 sm:p-7 shadow-xl select-none ${
          compact ? 'my-4' : 'my-8 sm:my-10'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] px-2.5 py-0.5 bg-[#D4AF37]/15 rounded-2xs border border-[#D4AF37]/30 flex items-center gap-1">
                <span>💡</span>
                <span>{lang === 'en' ? 'SUGGEST A CASE' : 'केस सुझाएं'}</span>
              </span>
              <span className="text-[10px] font-mono text-white/50">For Readers & Advocates</span>
            </div>

            <h3 className="font-anton text-lg sm:text-xl text-white tracking-wide uppercase">
              {lang === 'en'
                ? 'Know a Crazy Local Battle or Unbelievable Precedent?'
                : 'क्या आप किसी विचित्र या ऐतिहासिक केस को जानते हैं?'}
            </h3>

            <p className="text-xs text-[#a9a49a] font-sans leading-relaxed">
              {lang === 'en'
                ? 'Submit disposed cases, consumer disputes, or landmark judgments from your city that you want adapted into a slide episode.'
                : 'अपने शहर या हाई कोर्ट का कोई दिलचस्प केस सुझाएं, हमारी टीम उसे एक रोचक स्लाइड एपिसोड बनाएगी।'}
            </p>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-5 py-3 bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black font-bold font-mono text-xs uppercase tracking-widest rounded-xs transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-white/20 hover:border-[#D4AF37] shadow-lg shrink-0"
          >
            <span>{lang === 'en' ? 'Suggest a Case' : 'केस का सुझाव दें'}</span>
            <span>+</span>
          </button>
        </div>
      </div>

      <SuggestCaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        lang={lang}
      />
    </>
  );
}
