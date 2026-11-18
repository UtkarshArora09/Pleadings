'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CaseFile, Source } from '@/types/case';
import { SourcedBlock } from './SourcedBlock';
import { Exhibit } from './Exhibit';
import { CaseImage } from './CaseImage';
import { StatusBadge } from './StatusBadge';
import { ProvenanceStrip } from './ProvenanceStrip';
import { ParaSheet } from './ParaSheet';
import { VoteGate } from './VoteGate';
import { IfThisAffectsYou } from './IfThisAffectsYou';
import { WhatChangedSince } from './WhatChangedSince';
import { ReadNext } from './ReadNext';
import { SourcesAndCorrections } from './SourcesAndCorrections';
import { DailyCaseSubscribe } from './DailyCaseSubscribe';
import { SuggestCaseBanner } from '@/components/SuggestCaseBanner';
import { LegalDisclaimer } from '@/components/LegalDisclaimer';
import { GlossarySheet } from '@/components/GlossarySheet';
import { CharacterRoster } from '@/components/CharacterRoster';
import { hasPersonaFormat, extractPersonasFromText } from '@/lib/parsePersonas';
import { getCaseComplexity } from '@/lib/caseComplexity';
import { useApp } from '@/context/AppContext';

interface CaseViewerProps {
  caseData: CaseFile;
  nextSlug?: string;
  prevSlug?: string;
}

export function CaseViewer({ caseData, nextSlug, prevSlug }: CaseViewerProps) {
  const router = useRouter();
  const { language, toggleBookmark, isBookmarked } = useApp();

  // View Mode: Desktop & Laptop defaults to 'scroll', Mobile & Tablet defaults to 'slide'
  const [readingView, setReadingView] = useState<'slide' | 'scroll'>('scroll');
  const [userSelectedMode, setUserSelectedMode] = useState<boolean>(false);
  const hashHandledRef = useRef<boolean>(false);

  const changeReadingView = (mode: 'slide' | 'scroll') => {
    setReadingView(mode);
    setUserSelectedMode(true);
  };

  // Slide Index: 0 = Prologue Hero, 1..8 = Episodes 1..8, 9 = Dossier
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Sheet States
  const [activeSource, setActiveSource] = useState<Source | null>(null);
  const [activeTermSlug, setActiveTermSlug] = useState<string | null>(null);
  const [isVerdictUnlocked, setIsVerdictUnlocked] = useState<boolean>(false);

  // Scroll View active tracking
  const [activeSectionId, setActiveSectionId] = useState<string>('case-header');

  // Swipe Gesture Handling (Touch & Pointer)
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Localization resolution
  const activeContent = language === 'hi' && caseData.hi ? caseData.hi : caseData;
  const rawTitle = activeContent.title;
  const displayTitle =
    typeof rawTitle === 'string'
      ? rawTitle
      : (rawTitle as any)?.[language] || (rawTitle as any)?.en || caseData.slug;
  const rawHook = activeContent.hook;
  const displayHook =
    typeof rawHook === 'string'
      ? rawHook
      : (rawHook as any)?.[language] || (rawHook as any)?.en || '';
  const episodes = activeContent.episodes || [];
  const bookmarked = isBookmarked(caseData.slug);

  // Responsive device view mode default + initial URL hash jump (#episode-2, #case-dossier)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobileOrTablet =
      window.innerWidth < 1024 ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches && window.innerWidth < 1280);

    if (!userSelectedMode) {
      setReadingView(isMobileOrTablet ? 'slide' : 'scroll');
    }

    if (!hashHandledRef.current && window.location.hash) {
      hashHandledRef.current = true;
      const hash = window.location.hash;
      const epMatch = hash.match(/^#episode-(\d+)$/);
      if (isMobileOrTablet) {
        if (epMatch) {
          const epIndex = parseInt(epMatch[1], 10);
          if (epIndex >= 1 && epIndex <= episodes.length) {
            setCurrentSlide(epIndex);
          }
        } else if (hash === '#case-dossier') {
          setCurrentSlide(episodes.length + 1);
        }
      } else {
        setTimeout(() => {
          const target = document.getElementById(hash.slice(1));
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [userSelectedMode, episodes.length]);

  // Deduplicate images across the case post so the hero poster or any earlier episode/exhibit image never repeats
  const normalizeImgKey = (src?: string) => {
    if (!src) return '';
    const trimmed = src.trim();
    return trimmed.startsWith('data:') ? trimmed : trimmed.split('?')[0];
  };
  const { showEpisodeImage, cleanExhibits } = (() => {
    const seen = new Set<string>();
    const posterKey = normalizeImgKey(caseData.poster?.src);
    if (posterKey) seen.add(posterKey);

    const showImg: boolean[] = [];
    const exhibits = episodes.map((ep) => {
      const epKey = normalizeImgKey(ep.image?.src);
      const exhibitKey = normalizeImgKey(ep.exhibit?.image?.src);

      let cleanedExhibit = ep.exhibit;
      if (ep.exhibit && exhibitKey) {
        if (seen.has(exhibitKey)) {
          cleanedExhibit = { ...ep.exhibit, image: undefined };
        } else {
          seen.add(exhibitKey);
        }
      }

      const shouldShow = Boolean(epKey) && (!exhibitKey || epKey !== exhibitKey) && !seen.has(epKey);
      if (shouldShow) seen.add(epKey);
      showImg.push(shouldShow);

      return cleanedExhibit;
    });

    return { showEpisodeImage: showImg, cleanExhibits: exhibits };
  })();

  // Total slides: Prologue (1) + Episodes (N) + Dossier (1)
  const totalSlides = episodes.length + 2;

  // Complexity & Read-time Badge
  const complexityInfo = getCaseComplexity(caseData, language);

  // Calculate total paragraphs cited in Story mode
  const totalParasCited =
    episodes.reduce((acc, ep) => {
      const blocks = ep.layers?.story?.blocks || [];
      const count = blocks.filter((b) => b?.source?.tier === 'BLACK').length;
      return acc + count;
    }, 0) || 12;

  // Slide Navigation Helper with bounds checking
  const goToSlide = (slideIdx: number) => {
    if (slideIdx < 0) {
      if (prevSlug) router.push(`/case/${prevSlug}`);
      return;
    }
    if (slideIdx >= totalSlides) {
      if (nextSlug) router.push(`/case/${nextSlug}`);
      return;
    }
    setCurrentSlide(slideIdx);
    // Scroll window to top of slide container smoothly
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Preload next case on idle
  useEffect(() => {
    if (!nextSlug) return;
    const preloadNext = () => {
      router.prefetch(`/case/${nextSlug}`);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (
        window as unknown as { requestIdleCallback: (cb: () => void) => number }
      ).requestIdleCallback(preloadNext);
      return () => {
        if ('cancelIdleCallback' in window) {
          (
            window as unknown as { cancelIdleCallback: (id: number) => void }
          ).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(preloadNext, 2000);
      return () => clearTimeout(timer);
    }
  }, [nextSlug, router]);

  // Keyboard navigation: ArrowLeft/ArrowRight for slides, ArrowUp/ArrowDown for continuous
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (readingView === 'slide') {
        if (e.key === 'ArrowRight' || (e.key === ' ' && !e.shiftKey)) {
          e.preventDefault();
          goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowLeft' || (e.key === ' ' && e.shiftKey)) {
          e.preventDefault();
          goToSlide(currentSlide - 1);
        }
      } else {
        // Continuous scroll mode
        const allIds = [
          'case-header',
          ...Array.from({ length: episodes.length }, (_, i) => `episode-${i + 1}`),
          'case-dossier',
        ];
        const currentIdx = allIds.indexOf(activeSectionId);

        if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
          if (currentIdx >= 0 && currentIdx < allIds.length - 1) {
            e.preventDefault();
            const targetEl = document.getElementById(allIds[currentIdx + 1]);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
          if (currentIdx > 0) {
            e.preventDefault();
            const targetEl = document.getElementById(allIds[currentIdx - 1]);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [readingView, currentSlide, totalSlides, activeSectionId, episodes.length]);

  // Touch Swipe Gesture for Slide Navigation
  // Swipe Left -> next slide (increases episode)
  // Swipe Right -> previous slide (decreases episode)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Detect horizontal swipe (> 45px, predominantly horizontal, < 500ms)
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && deltaTime < 500) {
      if (deltaX < 0) {
        // Swiped Left -> Advance to next slide
        goToSlide(currentSlide + 1);
      } else if (deltaX > 0) {
        // Swiped Right -> Go to previous slide
        goToSlide(currentSlide - 1);
      }
    }
    touchStartRef.current = null;
  };

  // Continuous scroll active observer
  useEffect(() => {
    if (readingView !== 'scroll') return;

    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      const allIds = [
        'case-header',
        ...Array.from({ length: episodes.length }, (_, i) => `episode-${i + 1}`),
        'case-dossier',
      ];

      for (let i = allIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(allIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(allIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [readingView, episodes.length]);

  const scrollToEpisode = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative overflow-x-hidden font-sans select-none"
    >
      {/* Sticky Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-[#0E1016]/95 backdrop-blur-md border-b border-white/10 px-2.5 sm:px-6 py-2 flex items-center justify-between gap-1.5 sm:gap-4 transition-all">
        {/* Left: Library Back & Case Title */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 flex-1 mr-1">
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] sm:text-xs font-mono font-bold text-[#D4AF37] hover:text-white transition-colors shrink-0 py-1"
            title="Back to Library"
          >
            <span>←</span>
            <span className="tracking-wider">LIBRARY</span>
          </Link>

          <span className="text-white/20 shrink-0 select-none">|</span>

          <span className="text-xs sm:text-sm font-serif font-bold text-white/90 truncate min-w-0">
            {displayTitle}
          </span>
        </div>

        {/* Right Actions: Reading Mode Toggle, Disclaimer Pill & Save */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Mode Switcher: Slide vs Continuous (Desktop default: Scroll, Mobile default: Slides) */}
          <div className="inline-flex items-center p-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono">
            <button
              type="button"
              onClick={() => changeReadingView('slide')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold uppercase transition-all cursor-pointer ${
                readingView === 'slide'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Interactive Slide-by-Slide Story Arc"
            >
              <span>Slides</span>
            </button>
            <button
              type="button"
              onClick={() => changeReadingView('scroll')}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-bold uppercase transition-all cursor-pointer ${
                readingView === 'scroll'
                  ? 'bg-[#D4AF37] text-black shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
              title="Continuous Vertical Reading"
            >
              <span>Scroll</span>
            </button>
          </div>

          <LegalDisclaimer variant="pill" lang={language} compactOnMobile={true} />

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(caseData.slug)}
            className={`px-2 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs rounded-xs border font-mono font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
              bookmarked
                ? 'bg-[#E50914] text-white border-[#E50914]'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/15'
            }`}
            title={bookmarked ? 'Saved in library' : 'Save case'}
          >
            <span>{bookmarked ? '✓' : '+'}</span>
            <span className="hidden xs:inline">{bookmarked ? 'SAVED' : 'SAVE'}</span>
          </button>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 1. SLIDE-WISE INTERACTIVE STORY ARC (DEFAULT EXPERIENCE) */}
      {/* ======================================================== */}
      {readingView === 'slide' ? (
        <div
          ref={slideContainerRef}
          className="relative min-h-[calc(100vh-100px)] flex flex-col justify-between"
        >
          {/* Floating On-Screen Navigation Arrows */}
          {currentSlide > 0 && (
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              className="fixed left-1.5 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/80 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] transition-all flex items-center justify-center text-xs sm:text-base font-bold shadow-2xl cursor-pointer backdrop-blur-md opacity-80 hover:opacity-100"
              title="Previous Slide (Swipe Right or Left Arrow)"
              aria-label="Previous Slide"
            >
              ←
            </button>
          )}

          {currentSlide < totalSlides - 1 && (
            <button
              onClick={() => goToSlide(currentSlide + 1)}
              className="fixed right-1.5 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-[#D4AF37] hover:bg-white text-black border border-[#D4AF37] transition-all flex items-center justify-center text-xs sm:text-base font-bold shadow-2xl cursor-pointer backdrop-blur-md opacity-85 hover:opacity-100"
              title="Next Slide (Swipe Left or Right Arrow)"
              aria-label="Next Slide"
            >
              →
            </button>
          )}

          {/* Slide Content Area */}
          <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full flex flex-col justify-center animate-fadeIn select-text">
            {/* SLIDE 0: CASE HERO PROLOGUE */}
            {currentSlide === 0 && (
              <div className="space-y-5 animate-slideUp">
                {/* Status, Complexity Badge & Court */}
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={caseData.status} size="md" />

                  <span className="px-2.5 py-0.5 rounded-2xs text-[10px] font-mono font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37] flex items-center shadow-sm">
                    <span>{complexityInfo.badge}</span>
                  </span>

                  <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                    {caseData.court} · {caseData.year}
                  </span>
                </div>

                {/* Headline Title in Netflix Anton Style (fixed line height to prevent line collision) */}
                <h1 className="font-anton text-3xl sm:text-5xl md:text-7xl text-white uppercase tracking-tight leading-[1.08] sm:leading-[0.98] drop-shadow-xl break-words">
                  {displayTitle}
                </h1>

                {/* Hook in Clean Sans */}
                <p className="text-sm sm:text-base md:text-lg text-[#c9c5bc] leading-relaxed font-sans">
                  "{displayHook}"
                </p>

                {/* Provenance Strip */}
                <ProvenanceStrip
                  citation={
                    caseData.citations?.primary ||
                    (caseData as any).citation ||
                    'Official Citation'
                  }
                  paragraphsCitedCount={totalParasCited}
                  reviewer={
                    caseData.review?.reviewer ||
                    (caseData as any).reviewer ||
                    'Adv. Girish Kr. Srivastava'
                  }
                  lastVerifiedDate={
                    caseData.review?.reviewedOn ||
                    (caseData as any).reviewedOn ||
                    caseData.decidedOn ||
                    'Verified'
                  }
                />

                {/* Legal Disclaimer Pill */}
                <LegalDisclaimer variant="banner" lang={language} />

                {/* Poster Cover Art */}
                {caseData.poster?.src && (
                  <div className="pt-2">
                    <CaseImage
                      src={caseData.poster.src}
                      alt={caseData.poster.alt || displayTitle}
                      provenance={caseData.poster.provenance || 'illustration'}
                      aspectRatio="aspect-[21/9]"
                      priority
                    />
                  </div>
                )}

                {/* Big Swipe / Begin CTA */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 text-xs font-mono">
                  <div className="flex items-center gap-2 text-white/50">
                    <span className="text-[#D4AF37]">← Swipe Left</span>
                    <span>or use keyboard arrows to advance</span>
                  </div>

                  <button
                    onClick={() => goToSlide(1)}
                    className="w-full sm:w-auto px-7 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest rounded-xs transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <span>Begin Episode 1</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* SLIDES 1 TO 8: CHRONOLOGICAL EPISODES */}
            {currentSlide >= 1 && currentSlide <= episodes.length && (
              (() => {
                const epIdx = currentSlide - 1;
                const ep = episodes[epIdx];
                const epNum = ep.n || epIdx + 1;
                const currentLayer = ep.layers?.story || { blocks: [] };
                const isVerdictEpisode = epNum === 7;
                const isLocked = isVerdictEpisode && !isVerdictUnlocked;
                const isFinalEpisode = epIdx === episodes.length - 1;

                return (
                  <div className="space-y-5 animate-slideUp">
                    {/* Episode Top Bar */}
                    <div className="space-y-1.5 pb-2 border-b border-white/10">
                      <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                        <span>{ep.kicker}</span>
                        <span className="text-white/40">
                          Episode {epNum} of {episodes.length}
                        </span>
                      </div>
                      <h2 className="font-anton text-2xl sm:text-4xl text-white uppercase tracking-tight leading-tight sm:leading-snug break-words">
                        {ep.title}
                      </h2>
                    </div>

                    {/* Optional Episode Visual Image (deduplicated against Hero Poster & earlier episodes) */}
                    {ep.image && showEpisodeImage[epIdx] && (
                      <CaseImage
                        src={ep.image.src}
                        alt={ep.image.alt}
                        provenance={ep.image.provenance}
                        aspectRatio="aspect-[16/9]"
                      />
                    )}

                    {/* Episode 7: Interactive Vote Gate */}
                    {isVerdictEpisode && (
                      <VoteGate
                        slug={caseData.slug}
                        caseTitle={displayTitle}
                        question={
                          caseData.vote?.question ||
                          `How should the Court decide regarding ${displayTitle}?`
                        }
                        context={
                          caseData.vote?.context ||
                          'Balancing fundamental constitutional rights against statutory state action.'
                        }
                        options={
                          caseData.vote?.options &&
                          Array.isArray(caseData.vote.options) &&
                          caseData.vote.options.length >= 2
                            ? [caseData.vote.options[0], caseData.vote.options[1]]
                            : [
                                {
                                  id: 'petitioner',
                                  label: 'In Favor of Petitioner',
                                  argument: 'Uphold fundamental constitutional liberties',
                                },
                                {
                                  id: 'respondent',
                                  label: 'In Favor of Respondent',
                                  argument: 'Uphold statutory compliance and state interest',
                                },
                              ]
                        }
                        courtChoseOptionId={caseData.vote?.courtChoseOptionId || 'petitioner'}
                        onUnlocked={() => setIsVerdictUnlocked(true)}
                        lang={language}
                      />
                    )}

                    {/* Episode Narrative Content (With Plain-English Tap-To-Define on tricky terms) */}
                    <div
                      className={`space-y-4 ${
                        isLocked ? 'blur-md pointer-events-none select-none opacity-40' : ''
                      }`}
                    >
                      {(() => {
                        const explicitPersonas =
                          ep.personas && ep.personas.length > 0
                            ? ep.personas
                            : ep.characters && ep.characters.length > 0
                            ? ep.characters
                            : null;

                        let hasRenderedPersonas = false;

                        const renderedBlocks = (currentLayer.blocks || []).map((block, bIdx) => {
                          if (hasPersonaFormat(block.text)) {
                            hasRenderedPersonas = true;
                            const parsed = extractPersonasFromText(block.text);
                            return <CharacterRoster key={bIdx} personas={parsed} />;
                          }

                          return (
                            <SourcedBlock
                              key={bIdx}
                              block={block}
                              onOpenSource={(src) => setActiveSource(src)}
                              onOpenTerm={(term) => setActiveTermSlug(term)}
                            />
                          );
                        });

                        const explicitPersonaRoster =
                          !hasRenderedPersonas && explicitPersonas ? (
                            <CharacterRoster key="explicit-personas" personas={explicitPersonas} />
                          ) : null;

                        return (
                          <>
                            {renderedBlocks}
                            {explicitPersonaRoster}
                          </>
                        );
                      })()}

                      {/* Exhibit Card (if present) */}
                      {cleanExhibits[epIdx] && <Exhibit exhibit={cleanExhibits[epIdx]!} />}

                      {/* End Hook */}
                      {!isFinalEpisode && ep.endHook && (
                        <div className="pt-3 text-xs sm:text-sm font-mono text-[#D4AF37] italic border-t border-white/5">
                          ↳ {ep.endHook}
                        </div>
                      )}
                    </div>

                    {/* FINAL EPISODE SPECIAL: WhatsApp/Email Daily 3-Min Case Box */}
                    {isFinalEpisode && (
                      <div className="pt-6 border-t border-white/10">
                        <DailyCaseSubscribe caseSlug={caseData.slug} lang={language} />
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {/* SLIDE 9: CERTIFIED CASE DOSSIER */}
            {currentSlide === totalSlides - 1 && (
              <div className="space-y-8 animate-slideUp">
                <div className="space-y-1 pb-3 border-b border-white/10">
                  <div className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    FINAL DOSSIER · JUDICIAL IMPACT & CITATOR
                  </div>
                  <h2 className="font-anton text-3xl sm:text-4xl text-white uppercase tracking-tight">
                    Case Summary & Precedential Legacy
                  </h2>
                </div>

                {/* 1. If This Affects You */}
                <IfThisAffectsYou affectsYou={caseData.affectsYou} lang={language} />

                {/* 2. What Changed Since (Timeline) */}
                <WhatChangedSince timeline={caseData.timeline} lang={language} />

                {/* 3. Daily 3-Min Case WhatsApp / Email Opt-in Box */}
                <DailyCaseSubscribe caseSlug={caseData.slug} lang={language} />

                {/* 4. Suggest A Case Banner for Readers */}
                <SuggestCaseBanner lang={language} />

                {/* 5. Read Next Landmark Precedents */}
                <ReadNext relatedSlugs={caseData.relatedSlugs} currentSlug={caseData.slug} lang={language} />

                {/* 6. Sources & Editorial Review */}
                <SourcesAndCorrections
                  caseSlug={caseData.slug}
                  sourceUrl={caseData.sourceUrl}
                  citations={caseData.citations}
                  sources={caseData.sources}
                  review={caseData.review}
                  lang={language}
                />

                {/* 7. Legal Disclaimer */}
                <LegalDisclaimer variant="footer" lang={language} />

                {/* Next Case Link */}
                <div className="py-6 text-center border-t border-white/10 text-xs font-mono text-white/40 space-y-2">
                  {nextSlug ? (
                    <Link
                      href={`/case/${nextSlug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase rounded-xs transition-all cursor-pointer shadow-lg"
                    >
                      <span>Swipe or Tap for Next Case</span>
                      <span>→</span>
                    </Link>
                  ) : (
                    <span>You have reached the end of this case dossier.</span>
                  )}
                </div>
              </div>
            )}
          </main>

          {/* Sticky Slide Bottom Action Dock */}
          <footer className="sticky bottom-0 z-40 bg-[#0E1016]/95 backdrop-blur-md border-t border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between text-xs font-mono">
            {/* Prev Button */}
            <button
              onClick={() => goToSlide(currentSlide - 1)}
              disabled={currentSlide === 0 && !prevSlug}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>←</span>
              <span>
                {currentSlide === 0
                  ? prevSlug
                    ? 'Prev Case'
                    : 'Beginning'
                  : currentSlide === 1
                  ? 'Prologue'
                  : `Episode 0${currentSlide - 1}`}
              </span>
            </button>

            {/* Slide Index Dot Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-[#a9a49a] text-[11px]">
              <span>Slide {currentSlide + 1} of {totalSlides}</span>
              <span>·</span>
              <span className="text-[#D4AF37]">
                {currentSlide === 0
                  ? 'Prologue'
                  : currentSlide === totalSlides - 1
                  ? 'Dossier'
                  : `Episode ${currentSlide}`}
              </span>
            </div>

            {/* Next Button */}
            <button
              onClick={() => goToSlide(currentSlide + 1)}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xs bg-[#D4AF37] hover:bg-white text-black font-bold uppercase transition-all shadow-md cursor-pointer"
            >
              <span>
                {currentSlide === 0
                  ? 'Episode 01'
                  : currentSlide < episodes.length
                  ? `Episode 0${currentSlide + 1}`
                  : currentSlide === episodes.length
                  ? 'View Ratio & Dossier'
                  : nextSlug
                  ? 'Next Case'
                  : 'Complete'}
              </span>
              <span>→</span>
            </button>
          </footer>
        </div>
      ) : (
        /* ======================================================== */
        /* 2. CONTINUOUS SCROLL VIEW (ACCESSIBLE VIA TOP TOGGLE)    */
        /* ======================================================== */
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          {/* Section 0: Case Header Hero Section */}
          <section
            id="case-header"
            className="py-6 sm:py-10 border-b border-white/10 space-y-4"
          >
            <div className="flex flex-wrap items-center gap-2.5">
              <StatusBadge status={caseData.status} size="md" />
              <span className="px-2 py-0.5 rounded-2xs text-[9px] font-mono font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md border border-[#D4AF37]/50 text-[#D4AF37]">
                {complexityInfo.badge}
              </span>
              <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
                {caseData.court} · {caseData.year}
              </span>
            </div>

            <h1 className="font-anton text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-[1.08] sm:leading-[0.98] break-words">
              {displayTitle}
            </h1>

            <p className="text-sm sm:text-base text-[#c9c5bc] leading-relaxed">
              "{displayHook}"
            </p>

            <ProvenanceStrip
              citation={
                caseData.citations?.primary ||
                (caseData as any).citation ||
                'Official Citation'
              }
              paragraphsCitedCount={totalParasCited}
              reviewer={
                caseData.review?.reviewer ||
                (caseData as any).reviewer ||
                'Adv. Girish Kr. Srivastava'
              }
              lastVerifiedDate={
                caseData.review?.reviewedOn ||
                (caseData as any).reviewedOn ||
                caseData.decidedOn ||
                'Verified'
              }
            />

            <LegalDisclaimer variant="banner" lang={language} />

            {caseData.poster?.src && (
              <div className="pt-2">
                <CaseImage
                  src={caseData.poster.src}
                  alt={caseData.poster.alt || displayTitle}
                  provenance={caseData.poster.provenance || 'illustration'}
                  aspectRatio="aspect-[21/9]"
                  priority
                />
              </div>
            )}
          </section>

          {/* Continuous Episodes Stack */}
          <div className="space-y-0">
            {episodes.map((ep, epIdx) => {
              const epNum = ep.n || epIdx + 1;
              const currentLayer = ep.layers?.story || { blocks: [] };
              const isVerdictEpisode = epNum === 7;
              const isLocked = isVerdictEpisode && !isVerdictUnlocked;
              const nextEpId =
                epNum < episodes.length ? `episode-${epNum + 1}` : 'case-dossier';

              return (
                <article
                  key={epNum}
                  id={`episode-${epNum}`}
                  className="py-10 sm:py-14 border-t border-white/10 space-y-5 scroll-mt-16"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                      <span>{ep.kicker}</span>
                      <span className="text-white/40">
                        {epNum} / {episodes.length}
                      </span>
                    </div>
                    <h2 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
                      {ep.title}
                    </h2>
                  </div>

                  {ep.image && showEpisodeImage[epIdx] && (
                    <CaseImage
                      src={ep.image.src}
                      alt={ep.image.alt}
                      provenance={ep.image.provenance}
                      aspectRatio="aspect-[16/9]"
                    />
                  )}

                  {isVerdictEpisode && (
                    <VoteGate
                      slug={caseData.slug}
                      caseTitle={displayTitle}
                      question={
                        caseData.vote?.question ||
                        `How should the Court decide regarding ${displayTitle}?`
                      }
                      context={
                        caseData.vote?.context ||
                        'Balancing fundamental constitutional rights against state action.'
                      }
                      options={
                        caseData.vote?.options &&
                        Array.isArray(caseData.vote.options) &&
                        caseData.vote.options.length >= 2
                          ? [caseData.vote.options[0], caseData.vote.options[1]]
                          : [
                              {
                                id: 'petitioner',
                                label: 'In Favor of Petitioner',
                                argument: 'Uphold fundamental constitutional liberties',
                              },
                              {
                                id: 'respondent',
                                label: 'In Favor of Respondent',
                                argument: 'Uphold statutory compliance and state interest',
                              },
                            ]
                      }
                      courtChoseOptionId={caseData.vote?.courtChoseOptionId || 'petitioner'}
                      onUnlocked={() => setIsVerdictUnlocked(true)}
                      lang={language}
                    />
                  )}

                  <div
                    className={`space-y-4 ${
                      isLocked ? 'blur-md pointer-events-none select-none opacity-40' : ''
                    }`}
                  >
                    {(() => {
                      const explicitPersonas =
                        ep.personas && ep.personas.length > 0
                          ? ep.personas
                          : ep.characters && ep.characters.length > 0
                          ? ep.characters
                          : null;

                      let hasRenderedPersonas = false;

                      const renderedBlocks = (currentLayer.blocks || []).map((block, bIdx) => {
                        if (hasPersonaFormat(block.text)) {
                          hasRenderedPersonas = true;
                          const parsed = extractPersonasFromText(block.text);
                          return <CharacterRoster key={bIdx} personas={parsed} />;
                        }

                        return (
                          <SourcedBlock
                            key={bIdx}
                            block={block}
                            onOpenSource={(src) => setActiveSource(src)}
                            onOpenTerm={(term) => setActiveTermSlug(term)}
                          />
                        );
                      });

                      const explicitPersonaRoster =
                        !hasRenderedPersonas && explicitPersonas ? (
                          <CharacterRoster key="explicit-personas" personas={explicitPersonas} />
                        ) : null;

                      return (
                        <>
                          {renderedBlocks}
                          {explicitPersonaRoster}
                        </>
                      );
                    })()}

                    {cleanExhibits[epIdx] && <Exhibit exhibit={cleanExhibits[epIdx]!} />}

                    {epIdx < episodes.length - 1 && ep.endHook && (
                      <div className="pt-3 text-xs sm:text-sm font-mono text-[#D4AF37] italic border-t border-white/5">
                        ↳ {ep.endHook}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 flex items-center justify-between border-t border-white/5 text-xs font-mono">
                    <span className="text-white/40">
                      Episode {epNum} of {episodes.length}
                    </span>
                    <button
                      onClick={() => scrollToEpisode(nextEpId)}
                      className="flex items-center gap-1.5 text-[#D4AF37] hover:text-white font-bold uppercase transition-colors cursor-pointer"
                    >
                      <span>
                        {epNum < episodes.length
                          ? `Continue to Episode ${epNum + 1}`
                          : 'View Ratio & Impact'}
                      </span>
                      <span>↓</span>
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Continuous Dossier */}
          <section id="case-dossier" className="py-12 border-t border-white/10 space-y-8">
            <IfThisAffectsYou affectsYou={caseData.affectsYou} lang={language} />
            <WhatChangedSince timeline={caseData.timeline} lang={language} />
            <DailyCaseSubscribe caseSlug={caseData.slug} lang={language} />
            <SuggestCaseBanner lang={language} />
            <ReadNext relatedSlugs={caseData.relatedSlugs} currentSlug={caseData.slug} lang={language} />
            <SourcesAndCorrections
              caseSlug={caseData.slug}
              sourceUrl={caseData.sourceUrl}
              citations={caseData.citations}
              sources={caseData.sources}
              review={caseData.review}
              lang={language}
            />
            <LegalDisclaimer variant="footer" lang={language} />
          </section>
        </main>
      )}

      {/* ParaSheet for Verbatim Judgment Text */}
      <ParaSheet
        source={activeSource}
        isOpen={Boolean(activeSource)}
        onClose={() => setActiveSource(null)}
        caseTitle={displayTitle}
      />

      {/* Glossary Sheet */}
      <GlossarySheet
        termSlug={activeTermSlug}
        caseInThisCase={
          caseData.glossary?.find((g) => g?.slug === activeTermSlug)?.inThisCase
        }
        isOpen={Boolean(activeTermSlug)}
        onClose={() => setActiveTermSlug(null)}
        lang={language}
      />
    </div>
  );
}
