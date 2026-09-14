'use client';

import React from 'react';
import Image from 'next/image';
import { StoryPanel, CaseData } from '@/types';
import { RichText } from './RichText';
import { EvidenceCard } from './EvidenceCard';
import { CharacterRoster } from './CharacterRoster';
import { ArgumentsGrid } from './ArgumentsGrid';
import { JudgePoll } from './JudgePoll';
import { AudioNarrator } from './AudioNarrator';
import { useApp } from '@/context/AppContext';

interface ReelPanelProps {
  panel: StoryPanel;
  panelIndex: number;
  totalPanels: number;
  caseData: CaseData;
  onAdvancePanel?: () => void;
  onNextCase?: () => void;
  nextCaseTitle?: string;
}

export function ReelPanel({
  panel,
  panelIndex,
  totalPanels,
  caseData,
  onAdvancePanel,
  onNextCase,
  nextCaseTitle,
}: ReelPanelProps) {
  const { language, openBriefModal } = useApp();
  const isVerdict = panel.type === 'VERDICT';
  const isLastPanel = panelIndex === totalPanels - 1;

  // Determine visual elements
  const hasEvidence = Boolean(panel.evidence);
  const isNewspaper =
    panel.evidence?.archiveType === 'newspaper' ||
    (hasEvidence && (!panel.evidence?.archiveType || panel.type === 'EVIDENCE'));
  const hasPhoto = Boolean(panel.photoExhibitSrc || (!hasEvidence && caseData.bannerImage));
  const photoSrc = panel.photoExhibitSrc || caseData.bannerImage;
  const photoCaption = panel.photoExhibitCaption?.[language] || caseData.title[language];

  // Mobile layout optimization:
  // Show ONLY authentic newspaper cuttings on mobile, limited to maximum 1 or 2 per case.
  // All repetitive photo frames and non-newspaper exhibits are hidden on mobile (< lg).
  const newspaperPanelIndices = caseData.panels
    .map((p, idx) => ({ p, idx }))
    .filter(
      ({ p }) =>
        p.evidence &&
        (p.evidence.archiveType === 'newspaper' ||
          (!p.evidence.archiveType && p.type === 'EVIDENCE'))
    )
    .map(({ idx }) => idx);

  const allowedMobileIndices = newspaperPanelIndices.slice(0, 2);
  const isVisibleOnMobile = hasEvidence && isNewspaper && allowedMobileIndices.includes(panelIndex);

  return (
    <div className="w-full h-full min-h-screen snap-start snap-always flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 bg-[#0B0C10] text-[#F3EFE6] relative overflow-visible">
      {/* Background cinematic vignette & subtle atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 75% 50%, rgba(229,9,20,0.06) 0%, rgba(212,175,55,0.04) 40%, transparent 80%)',
        }}
      />

      {/* Top spacer for navigation bar */}
      <div className="h-14 sm:h-16 md:h-20 flex-shrink-0" />

      {/* Container: 2-Column Split on Desktop, Clean 1-Column on Mobile */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12 py-6 sm:py-8 my-auto">
        
        {/* LEFT COLUMN: Story, Dialogue, Arguments, Poll, Actions */}
        <div className="w-full lg:w-[55%] flex flex-col justify-center">
          {/* Top Series & Episode Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-xs shadow-md">
                PLEADINGS
              </span>
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                {panel.eyebrow[language]}
              </span>
            </div>

            <AudioNarrator textToRead={`${panel.headline[language]}. ${panel.body[language]}`} />
          </div>

          {/* Verdict Stamp */}
          {isVerdict && panel.stamp && (
            <div className="mb-4 inline-block transform -rotate-2 origin-left">
              <div className="border-2 border-[#E50914] text-[#E50914] font-anton text-lg sm:text-2xl uppercase px-4 py-1 tracking-widest bg-[#E50914]/10 inline-block shadow-lg">
                {panel.stamp[language]}
              </div>
            </div>
          )}

          {/* Panel Headline */}
          <h2 className="font-anton text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-[1.1] mb-3 sm:mb-4 max-w-xl">
            {panel.headline[language]}
          </h2>

          {/* Story Body with Tappable Terms */}
          {panel.body[language] && (
            <div className="text-sm sm:text-base text-[#c9c5bc] leading-[1.8] font-normal mb-4 whitespace-pre-line max-w-xl">
              <RichText content={panel.body[language]} terms={panel.tappableTerms} />
            </div>
          )}

          {/* Dynamic Content: Character Roster */}
          {panel.characters && <CharacterRoster characters={panel.characters} />}

          {/* Dynamic Content: Arguments Grid */}
          {(panel.prosecutionArgs || panel.defenceArgs) && (
            <ArgumentsGrid
              prosecutionArgs={panel.prosecutionArgs}
              defenceArgs={panel.defenceArgs}
            />
          )}

          {/* Dynamic Content: "You Are The Judge" Poll */}
          {panel.judgeDecision && (
            <JudgePoll
              caseSlug={caseData.slug}
              judgeDecision={panel.judgeDecision}
              onAdvanceToVerdict={onAdvancePanel}
            />
          )}

          {/* Last panel judgment actions */}
          {isLastPanel && (
            <div className="mt-6 pt-5 flex flex-wrap items-center gap-3 border-t border-white/10">
              <button
                onClick={openBriefModal}
                className="px-5 py-3 bg-white hover:bg-white/90 text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg rounded-xs flex items-center gap-2"
              >
                <span>{language === 'en' ? 'Open Full Legal Brief' : 'पूरा केस ब्रीफ खोलें'}</span>
                <span>→</span>
              </button>

              <a
                href={panel.judgmentUrl || caseData.judgmentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#E50914] hover:bg-[#b80710] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer shadow-lg rounded-xs"
              >
                <span>{language === 'en' ? 'Certified Judgment' : 'मूल प्रमाणित फैसला'}</span>
                <span>↗</span>
              </a>

              {onNextCase && nextCaseTitle && (
                <button
                  onClick={onNextCase}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/50 text-[#D4AF37] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md rounded-xs"
                  title="Proceed to next landmark case"
                >
                  <span>{language === 'en' ? `Next Case: ${nextCaseTitle}` : `अगला केस: ${nextCaseTitle}`}</span>
                  <span>→</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Visual Exhibit & Photo Card */}
        {/* On desktop: always visible (EvidenceCard or Photo Dossier). */}
        {/* On mobile: visible ONLY if this panel is an allowed Newspaper Cutting (1 or max 2 per case). */}
        <div
          className={`w-full lg:w-[45%] flex-col items-center justify-center ${
            isVisibleOnMobile ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {hasEvidence ? (
            /* Vintage Newspaper Clipping / Documentary Exhibit */
            <div
              className={`w-full transform lg:rotate-1 hover:rotate-0 transition-transform duration-300 ${
                !isNewspaper ? 'hidden lg:block' : ''
              }`}
            >
              <EvidenceCard evidence={panel.evidence!} />
            </div>
          ) : hasPhoto ? (
            /* Cinematic Photo & Evidence Dossier Card (Desktop only, hidden on mobile) */
            <div className="hidden lg:block w-full max-w-lg mx-auto transform lg:-rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Evidence Dossier Frame */}
              <div
                className="relative bg-[#171922] p-3.5 sm:p-4 rounded-sm border border-white/15 shadow-2xl overflow-hidden"
                style={{
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(212,175,55,0.2)',
                }}
              >
                {/* Vintage Tape Accent on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-[#d8d0bf]/50 border border-white/20 backdrop-blur-xs transform rotate-[-2deg] shadow-sm pointer-events-none" />

                {/* Exhibit Stamp Badge */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-[9px] font-mono tracking-widest uppercase text-[#a9a49a]">
                  <span className="text-[#E50914] font-bold">CASE ARCHIVE #{panelIndex + 1}</span>
                  <span>{caseData.court}</span>
                </div>

                {/* Cinematic Image Container */}
                <div className="relative w-full aspect-video rounded-xs overflow-hidden bg-black/60 group">
                  <Image
                    src={photoSrc}
                    alt={photoCaption}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                    priority={panelIndex === 0}
                  />

                  {/* Dark gradient overlay at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Archival Photo Caption */}
                <div className="pt-3">
                  <p className="text-xs text-[#c9c5bc] leading-relaxed font-sans italic">
                    "{photoCaption}"
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

      </div>

      {/* Bottom spacer */}
      <div className="h-14 sm:h-16 md:h-20 flex-shrink-0" />
    </div>
  );
}

