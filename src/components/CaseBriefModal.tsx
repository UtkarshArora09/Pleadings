'use client';

import React, { useEffect, useState } from 'react';
import { CaseData } from '@/types';
import { useApp } from '@/context/AppContext';

interface CaseBriefModalProps {
  caseData: CaseData;
}

export function CaseBriefModal({ caseData }: CaseBriefModalProps) {
  const {
    isBriefOpen,
    closeBriefModal,
    language,
    toggleBookmark,
    isBookmarked,
    showToast,
    openShareModal,
  } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeBriefModal();
      }
    };
    if (isBriefOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isBriefOpen, closeBriefModal]);

  if (!isBriefOpen) return null;

  const brief = caseData.brief;
  const bookmarked = isBookmarked(caseData.slug);

  const handleCopyFullBrief = () => {
    const textToCopy = `PLEADINGS CASE BRIEF
Title: ${caseData.title[language]}
Citation: ${caseData.citation}
Court: ${brief.courtAndYear[language]}

FACTS:
${brief.facts[language]}

ISSUES:
${brief.issues[language].map((iss, i) => `${i + 1}. ${iss}`).join('\n')}

STATUTES APPLIED:
${brief.chargesApplied.join(', ')}

COURT HOLDING:
${brief.held[language]}

RATIO DECIDENDI (LEGAL REASONING):
${brief.reasoning[language]}

WHY IT MATTERS:
${brief.whyItMatters[language]}

Official Judgment Link: ${caseData.judgmentUrl}
Sourced via Pleadings (Netflix for Indian Law)`;

    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      showToast(language === 'en' ? 'Complete Case Brief copied to clipboard!' : 'केस ब्रीफ कॉपी हो गया!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F5F2EC] text-[#0E1016] animate-slideUp font-sans">
      {/* Sticky top action bar */}
      <div
        className="sticky top-0 bg-[#F5F2EC]/98 backdrop-blur-md px-4 md:px-10 py-4 flex items-center justify-between z-20 border-b border-[#0E1016]/10"
      >
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#0E1016] bg-[#0E1016]/5 px-2.5 py-1 rounded-xs">
            {language === 'en' ? 'Law Student Brief' : 'केस ब्रीफ'}
          </span>
          <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a712a]">
            {caseData.court} · {caseData.year}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(caseData.slug)}
            className={`px-3 py-1.5 rounded-xs border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              bookmarked
                ? 'bg-[#0E1016] text-[#D4AF37] border-[#0E1016]'
                : 'bg-white border-[#0E1016]/20 text-[#0E1016] hover:bg-[#0E1016]/5'
            }`}
          >
            {bookmarked ? '★ Saved' : '☆ Save Brief'}
          </button>

          {/* Copy Brief Button */}
          <button
            onClick={handleCopyFullBrief}
            className="px-3 py-1.5 bg-white border border-[#0E1016]/20 text-[#0E1016] hover:bg-[#0E1016]/5 rounded-xs text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer hidden sm:inline-flex items-center gap-1.5"
          >
            <span>📋</span>
            <span>{copied ? (language === 'en' ? 'Copied!' : 'कॉपी हुआ!') : (language === 'en' ? 'Copy Brief' : 'ब्रीफ कॉपी')}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={closeBriefModal}
            className="px-3.5 py-1.5 bg-[#0E1016] text-white hover:bg-[#D4AF37] hover:text-[#0E1016] transition-all text-xs font-bold uppercase tracking-wider cursor-pointer rounded-xs"
            aria-label="Close Case Brief"
          >
            ✕ {language === 'en' ? 'Close' : 'बंद करें'}
          </button>
        </div>
      </div>

      {/* Main Document Content */}
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-10 md:py-14">
        {/* Document Header */}
        <div className="pb-8 mb-8 border-b-2 border-[#0E1016]/15">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a712a] mb-2">
            {brief.courtAndYear[language]}
          </div>

          <h1 className="font-anton text-3xl md:text-5xl text-[#0E1016] tracking-tight uppercase leading-tight mb-3">
            {caseData.title[language]}
          </h1>

          <div className="text-xs font-serif italic text-[#0E1016]/70 mb-4 font-semibold">
            {caseData.citation}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#0E1016] text-[#F3EFE6] text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              {caseData.categoryTag}
            </span>
            <span className="bg-[#8a712a]/15 text-[#8a712a] text-[10px] font-bold uppercase tracking-wider px-3 py-1">
              {caseData.genre.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Structured Sections */}
        <div className="space-y-6">
          {/* Statement of Facts */}
          <div className="pb-6 border-b border-[#0E1016]/10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E1016] mb-3">
              {language === 'en' ? 'I. Statement of Facts' : 'I. तथ्यों का विवरण'}
            </h3>
            <p className="text-sm md:text-base text-[#0E1016]/85 leading-[1.85]">
              {brief.facts[language]}
            </p>
          </div>

          {/* Issues Presented */}
          <div className="pb-6 border-b border-[#0E1016]/10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E1016] mb-3">
              {language === 'en' ? 'II. Legal Issues Presented' : 'II. कानूनी प्रश्न'}
            </h3>
            <ol className="space-y-2.5">
              {brief.issues[language].map((issue, idx) => (
                <li key={idx} className="flex gap-3 text-sm md:text-base text-[#0E1016]/85 leading-relaxed">
                  <span className="font-bold text-[#8a712a] text-xs mt-1 flex-shrink-0">
                    {idx + 1}.
                  </span>
                  <span>{issue}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Statutes & Provisions */}
          <div className="pb-6 border-b border-[#0E1016]/10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E1016] mb-3">
              {language === 'en' ? 'III. Statutes & Provisions Applied' : 'III. लागू धाराएं और कानून'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {brief.chargesApplied.map((charge, idx) => (
                <span
                  key={idx}
                  className="bg-[#0E1016] text-[#F3EFE6] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5"
                >
                  {charge}
                </span>
              ))}
            </div>
          </div>

          {/* Court Holding (Highlighted) */}
          <div className="p-6 md:p-8 bg-[#0E1016] text-[#F3EFE6] border-l-4 border-[#D4AF37] my-4 shadow-xl">
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-2">
              {language === 'en' ? 'IV. Court Holding & Verdict' : 'IV. अदालत का अंतिम निर्णय'}
            </div>
            <p className="text-base md:text-lg leading-[1.75] font-medium">
              {brief.held[language]}
            </p>
          </div>

          {/* Ratio Decidendi */}
          <div className="pb-6 border-b border-[#0E1016]/10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#0E1016] mb-3">
              {language === 'en' ? 'V. Ratio Decidendi (Legal Reasoning)' : 'V. कानूनी तर्क व सिद्धांत (विधिक सार)'}
            </h3>
            <p className="text-sm md:text-base text-[#0E1016]/85 leading-[1.85]">
              {brief.reasoning[language]}
            </p>
          </div>

          {/* Why It Matters */}
          <div className="pb-6 border-b border-[#0E1016]/10">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a712a] mb-3">
              {language === 'en' ? 'VI. Legal Significance & Impact' : 'VI. कानूनी महत्व व प्रभाव'}
            </h3>
            <p className="text-sm md:text-base text-[#0E1016]/85 leading-[1.85]">
              {brief.whyItMatters[language]}
            </p>
          </div>

          {/* Bottom links */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#0E1016]/60 italic font-mono">
              Verified record via Indian Kanoon & Supreme Court Registries
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  openShareModal({
                    title: caseData.title[language],
                    url: typeof window !== 'undefined' ? window.location.href : '',
                    citation: caseData.citation,
                  })
                }
                className="px-5 py-3 bg-white border border-[#0E1016]/20 hover:bg-[#0E1016]/5 text-[#0E1016] text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                ↗ {language === 'en' ? 'Share' : 'शेयर'}
              </button>

              <a
                href={caseData.judgmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#0E1016] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0E1016] transition-all font-bold text-xs uppercase tracking-widest cursor-pointer shadow-md"
              >
                <span>{language === 'en' ? 'Read Official Judgment' : 'मूल फैसला पढ़ें'}</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
