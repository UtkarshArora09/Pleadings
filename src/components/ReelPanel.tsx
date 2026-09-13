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
}

export function ReelPanel({
  panel,
  panelIndex,
  totalPanels,
  caseData,
  onAdvancePanel,
}: ReelPanelProps) {
  const { language, openBriefModal } = useApp();
  const isVerdict = panel.type === 'VERDICT';
  const isLastPanel = panelIndex === totalPanels - 1;

  // Determine what visual element to show on the RIGHT side (Matching User Sketch!)
  const hasEvidence = Boolean(panel.evidence);
  const hasPhoto = Boolean(panel.photoExhibitSrc || (!hasEvidence && caseData.bannerImage));
  const photoSrc = panel.photoExhibitSrc || caseData.bannerImage;
  const photoCaption = panel.photoExhibitCaption?.[language] || caseData.title[language];

  return (
    <div className="w-full h-full min-h-screen snap-start snap-always flex items-center justify-center px-4 sm:px-8 md:px-12 lg:px-16 bg-[#0B0C10] text-[#F3EFE6] relative overflow-y-auto overflow-x-hidden">
      {/* Background cinematic vignette & subtle atmospheric glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 75% 50%, rgba(229,9,20,0.06) 0%, rgba(212,175,55,0.04) 40%, transparent 80%)',
        }}
      />

      {/* Top spacer for navigation bar */}
      <div className="h-16 md:h-20 flex-shrink-0" />

      {/* Widescreen Container: 2-Column Split matching User Sketch! */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12 py-8 my-auto">
        
        {/* LEFT COLUMN: Case Details (Story, Arguments, Judge Poll, Text) */}
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
          <h2 className="font-anton text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase leading-[1.1] mb-3 max-w-xl">
            {panel.headline[language]}
          </h2>

          {/* Red/Gold Accent line */}
          <div className="w-14 h-1 bg-gradient-to-r from-[#E50914] to-[#D4AF37] mb-4 rounded-full" />

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

          {/* First panel scroll hint */}
          {panelIndex === 0 && (
            <div className="mt-3 flex items-center gap-2 text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase opacity-90 animate-pulse">
              <span className="animate-bounce text-sm">↓</span>
              <span>
                {language === 'en'
                  ? 'Scroll down for Episode 2 (Evidence & Characters)'
                  : 'अगले एपिसोड और साक्ष्य के लिए नीचे स्क्रॉल करें'}
              </span>
            </div>
          )}

          {/* Last panel judgment actions */}
          {isLastPanel && (
            <div className="mt-6 pt-5 flex flex-wrap items-center gap-3 border-t border-white/10">
              <button
                onClick={openBriefModal}
                className="px-5 py-3 bg-white hover:bg-white/90 text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg rounded-xs flex items-center gap-2"
              >
                <span>📋</span>
                <span>{language === 'en' ? 'Open Full Legal Brief' : 'पूरा केस ब्रीफ खोलें'}</span>
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
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Visual Exhibit & Photo Card (Matching User's Sketch!) */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center">
          {hasEvidence ? (
            /* Vintage Newspaper Clipping Exhibit */
            <div className="w-full transform lg:rotate-1 hover:rotate-0 transition-transform duration-300">
              <EvidenceCard evidence={panel.evidence!} />
            </div>
          ) : hasPhoto ? (
            /* Cinematic Photo & Evidence Dossier Card */
            <div className="w-full max-w-lg mx-auto transform lg:-rotate-1 hover:rotate-0 transition-transform duration-300">
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

                  {/* Red Live / Archival Badge */}
                  <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5 bg-black/75 px-2 py-0.5 rounded-xs border border-white/10 text-[9px] font-bold uppercase tracking-wider text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E50914] animate-pulse" />
                    <span>{caseData.year} · RECORD</span>
                  </div>
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
      <div className="h-16 md:h-20 flex-shrink-0" />
    </div>
  );
}
