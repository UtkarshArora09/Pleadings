'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CaseFile, Source } from '@/types/case';
import { DepthToggle, DepthLayer } from './DepthToggle';
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
import { NewsletterCapture } from './NewsletterCapture';
import { GlossarySheet } from '@/components/GlossarySheet';
import { RatioObiterSplit } from './layers/RatioObiterSplit';
import { DissentPanel } from './layers/DissentPanel';
import { ExamAngle } from './layers/ExamAngle';
import { Flashcards } from './layers/Flashcards';
import { SubsequentHistory } from './layers/SubsequentHistory';
import { HowToUse } from './layers/HowToUse';
import { HowToDistinguish } from './layers/HowToDistinguish';
import { useApp } from '@/context/AppContext';

interface CaseViewerProps {
  caseData: CaseFile;
  nextSlug?: string;
  prevSlug?: string;
}

export function CaseViewer({ caseData, nextSlug, prevSlug }: CaseViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, toggleBookmark, isBookmarked } = useApp();

  // Depth Layer State: sync with ?depth= query and localStorage
  const initialDepth = (searchParams.get('depth') as DepthLayer) || 'story';
  const [depth, setDepth] = useState<DepthLayer>(initialDepth);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Sheet States
  const [activeSource, setActiveSource] = useState<Source | null>(null);
  const [activeTermSlug, setActiveTermSlug] = useState<string | null>(null);
  const [activeEpisodeAnchor, setActiveEpisodeAnchor] = useState<number>(1);
  const [activeSectionId, setActiveSectionId] = useState<string>('case-header');
  const [isVerdictUnlocked, setIsVerdictUnlocked] = useState<boolean>(false);

  // Swipe Gesture Handling
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const episodeRefs = useRef<(HTMLElement | null)[]>([]);

  // Preload next case on idle
  useEffect(() => {
    if (!nextSlug) return;
    const preloadNext = () => {
      router.prefetch(`/case/${nextSlug}`);
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(preloadNext);
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(preloadNext, 2000);
      return () => clearTimeout(timer);
    }
  }, [nextSlug, router]);

  // Load saved depth from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pleadings:depth') as DepthLayer;
    if (saved && ['story', 'student', 'advocate'].includes(saved)) {
      setDepth(saved);
    }
  }, []);

  // Track active section and episode on scroll for floating rail
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      const allIds = ['case-header', ...Array.from({ length: 8 }, (_, i) => `episode-${i + 1}`), 'case-dossier'];

      for (let i = allIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(allIds[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSectionId(allIds[i]);
          if (allIds[i].startsWith('episode-')) {
            const num = parseInt(allIds[i].replace('episode-', ''));
            if (!isNaN(num)) setActiveEpisodeAnchor(num);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard navigation between episodes (ArrowDown, ArrowUp, Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const allIds = ['case-header', ...Array.from({ length: 8 }, (_, i) => `episode-${i + 1}`), 'case-dossier'];
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionId]);

  // Handle Depth Change with 180ms crossfade and anchor preservation
  const handleDepthChange = (newDepth: DepthLayer) => {
    if (newDepth === depth) return;
    setIsCrossfading(true);
    localStorage.setItem('pleadings:depth', newDepth);

    // Update URL query without full reload
    const url = new URL(window.location.href);
    url.searchParams.set('depth', newDepth);
    window.history.replaceState(null, '', url.toString());

    setTimeout(() => {
      setDepth(newDepth);
      setIsCrossfading(false);
      // Restore scroll anchor
      const targetEl = episodeRefs.current[activeEpisodeAnchor - 1];
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 180);
  };

  // Touch Swipe for Horizontal Navigation to Next Case
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

    // Detect fast horizontal swipe (> 100px, angle predominantly horizontal, < 350ms)
    if (Math.abs(deltaX) > 100 && Math.abs(deltaX) > Math.abs(deltaY) * 2.5 && deltaTime < 350) {
      if (deltaX < 0 && nextSlug) {
        router.push(`/case/${nextSlug}?depth=${depth}`);
      } else if (deltaX > 0 && prevSlug) {
        router.push(`/case/${prevSlug}?depth=${depth}`);
      }
    }
    touchStartRef.current = null;
  };

  const scrollToEpisode = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hindi localization resolution
  const activeContent = language === 'hi' && caseData.hi ? caseData.hi : caseData;
  const rawTitle = activeContent.title;
  const displayTitle = typeof rawTitle === 'string' ? rawTitle : ((rawTitle as any)?.[language] || (rawTitle as any)?.en || caseData.slug);
  const rawHook = activeContent.hook;
  const displayHook = typeof rawHook === 'string' ? rawHook : ((rawHook as any)?.[language] || (rawHook as any)?.en || '');
  const episodes = activeContent.episodes;
  const bookmarked = isBookmarked(caseData.slug);

  // Calculate total paragraphs cited
  const totalParasCited = episodes.reduce((acc, ep) => {
    const blocks = ep.layers.story.blocks.concat(ep.layers.advocate.blocks);
    const count = blocks.filter((b) => b.source.tier === 'BLACK').length;
    return acc + count;
  }, 0) || 12;

  // Track first AMBER block
  let hasFoundAmber = false;

  const episodeRailItems = [
    { id: 'case-header', label: 'BRIEF', epNumber: '00' },
    ...episodes.map((_, i) => ({
      id: `episode-${i + 1}`,
      label: `EP ${i + 1}`,
      epNumber: `0${i + 1}`,
    })),
    { id: 'case-dossier', label: 'RATIO', epNumber: '09' },
  ];

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative overflow-x-hidden font-sans md:snap-y md:snap-proximity scroll-smooth"
    >
      {/* Sticky Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#0E1016]/95 backdrop-blur-md border-b border-white/10 px-3 sm:px-6 py-2.5 flex items-center justify-between transition-all">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D4AF37] hover:text-white transition-colors"
          >
            <span>←</span>
            <span className="hidden sm:inline">LIBRARY</span>
          </Link>

          <span className="text-white/20 hidden sm:inline">|</span>

          <span className="text-xs font-serif font-bold text-white truncate max-w-[140px] sm:max-w-[280px]">
            {displayTitle}
          </span>
        </div>

        {/* Center: Depth Toggle (Story / Student / Advocate) */}
        <div className="flex items-center">
          <DepthToggle
            currentDepth={depth}
            onChangeDepth={handleDepthChange}
            lang={language}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleBookmark(caseData.slug)}
            className={`px-2.5 py-1 text-xs rounded-xs border font-mono transition-all cursor-pointer ${
              bookmarked
                ? 'bg-[#E50914] text-white border-[#E50914]'
                : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/15'
            }`}
            title={bookmarked ? 'Saved in library' : 'Save case'}
          >
            {bookmarked ? '✓ SAVED' : '+ SAVE'}
          </button>
        </div>
      </header>

      {/* Floating Episode Navigation Rail on Desktop */}
      <nav
        aria-label="Episode Navigation Rail"
        className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-2 pointer-events-auto"
      >
        {episodeRailItems.map((item) => {
          const isActive = activeSectionId === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollToEpisode(item.id)}
              className="p-1 focus:outline-none cursor-pointer"
              aria-label={item.label}
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-1.5 h-4 bg-white/80'
                    : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Section 0: Case Header Hero Section */}
        <section
          id="case-header"
          className="py-6 sm:py-10 md:py-14 md:min-h-[calc(100vh-64px)] md:snap-start flex flex-col justify-center border-b border-white/10 animate-fadeIn space-y-4"
        >
          {/* Status Badge & Court Info */}
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={caseData.status} size="md" />
            <span className="text-xs font-mono font-bold text-[#D4AF37] uppercase tracking-wider">
              {caseData.court} · {caseData.year}
            </span>
          </div>

          {/* Headline Title in Netflix Anton Style */}
          <h1 className="font-anton text-4xl sm:text-6xl md:text-7xl text-white uppercase tracking-tight leading-[0.95] drop-shadow-xl">
            {displayTitle}
          </h1>

          {/* Hook in Clean Sans */}
          <p className="text-sm sm:text-base md:text-lg text-[#c9c5bc] leading-relaxed font-sans">
            "{displayHook}"
          </p>

          {/* Provenance Strip */}
          <div className="pt-2">
            <ProvenanceStrip
              citation={caseData.citations.primary}
              paragraphsCitedCount={totalParasCited}
              reviewer={caseData.review.reviewer}
              lastVerifiedDate={caseData.review.reviewedOn}
            />
          </div>

          {/* Poster Image */}
          <div className="pt-2">
            <CaseImage
              src={caseData.poster.src}
              alt={caseData.poster.alt}
              provenance={caseData.poster.provenance}
              aspectRatio="aspect-[21/9]"
              priority
            />
          </div>

          {/* Quick Scroll Indicator to Episode 1 */}
          <div className="pt-4 flex justify-center">
            <button
              onClick={() => scrollToEpisode('episode-1')}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-[#D4AF37] hover:text-black font-bold text-xs uppercase tracking-widest rounded-xs transition-all cursor-pointer text-white"
            >
              <span>Begin Episode 1</span>
              <span>↓</span>
            </button>
          </div>
        </section>

        {/* Episodes 1 through 8 Container with 180ms Crossfade */}
        <div
          className={`transition-opacity duration-180 ${
            isCrossfading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {episodes.map((ep, epIdx) => {
            const epNum = ep.n || epIdx + 1;
            const currentLayer = ep.layers[depth] || ep.layers.story;
            const isVerdictEpisode = epNum === 7;
            const isLocked = isVerdictEpisode && !isVerdictUnlocked;
            const nextEpId = epNum < 8 ? `episode-${epNum + 1}` : 'case-dossier';

            return (
              <article
                key={epNum}
                ref={(el) => {
                  episodeRefs.current[epIdx] = el;
                }}
                onMouseEnter={() => setActiveEpisodeAnchor(epNum)}
                className="py-8 sm:py-12 md:py-16 md:min-h-[calc(100vh-64px)] md:snap-start flex flex-col justify-center border-t border-white/10 space-y-5 relative scroll-mt-16"
                id={`episode-${epNum}`}
              >
                {/* Episode Kicker & Title */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
                    <span>{ep.kicker}</span>
                    <span className="text-white/40">{epNum} / 8</span>
                  </div>
                  <h2 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight leading-snug">
                    {ep.title}
                  </h2>
                </div>

                {/* Optional Episode Visual Image (only if not identical to exhibit image below) */}
                {ep.image && epIdx !== 0 && (!ep.exhibit?.image || ep.exhibit.image.src !== ep.image.src) && (
                  <CaseImage
                    src={ep.image.src}
                    alt={ep.image.alt}
                    provenance={ep.image.provenance}
                    aspectRatio="aspect-[16/9]"
                  />
                )}

                {/* Episode 7: Vote Gate */}
                {isVerdictEpisode && (
                  <VoteGate
                    slug={caseData.slug}
                    caseTitle={displayTitle}
                    question={caseData.vote.question}
                    context={caseData.vote.context}
                    options={caseData.vote.options}
                    courtChoseOptionId={caseData.vote.courtChoseOptionId}
                    onUnlocked={() => setIsVerdictUnlocked(true)}
                    lang={language}
                  />
                )}

                {/* Episode Content with Blur Gate for Locked Verdict */}
                <div className={`space-y-4 ${isLocked ? 'blur-md pointer-events-none select-none opacity-40' : ''}`}>
                  {/* Sourced Blocks */}
                  {currentLayer.blocks.map((block, bIdx) => {
                    const isAmber = block.source.tier === 'AMBER';
                    let isFirstAmber = false;
                    if (isAmber && !hasFoundAmber) {
                      hasFoundAmber = true;
                      isFirstAmber = true;
                    }

                    return (
                      <SourcedBlock
                        key={bIdx}
                        block={block}
                        isFirstAmber={isFirstAmber}
                        onOpenSource={(src) => setActiveSource(src)}
                        onOpenTerm={(term) => setActiveTermSlug(term)}
                      />
                    );
                  })}

                  {/* Student Layer: Ratio / Obiter / Dissent / Exam Angle */}
                  {depth === 'student' && (
                    <div className="space-y-4 pt-2">
                      <RatioObiterSplit
                        ratio={currentLayer.ratio}
                        obiter={currentLayer.obiter}
                        lang={language}
                      />
                      <DissentPanel dissent={currentLayer.dissent} lang={language} />
                      <ExamAngle examAngle={currentLayer.examAngle} lang={language} />
                    </div>
                  )}

                  {/* Advocate Layer: Pinpoints / HowToUse / HowToDistinguish */}
                  {depth === 'advocate' && (
                    <div className="space-y-4 pt-2">
                      <HowToUse
                        pinpoints={currentLayer.pinpoints}
                        propositions={currentLayer.howToUse}
                        lang={language}
                      />
                      <HowToDistinguish
                        distinctions={currentLayer.howToDistinguish}
                        lang={language}
                      />
                    </div>
                  )}

                  {/* Exhibit Card (if any in this episode) */}
                  {ep.exhibit && <Exhibit exhibit={ep.exhibit} />}

                  {/* End Hook */}
                  {epIdx < 7 && ep.endHook && (
                    <div className="pt-3 text-xs sm:text-sm font-mono text-[#D4AF37] italic border-t border-white/5">
                      ↳ {ep.endHook}
                    </div>
                  )}
                </div>

                {/* Quick Continue to Next Episode Button */}
                <div className="pt-3 flex items-center justify-between border-t border-white/5 text-xs font-mono">
                  <span className="text-white/40">Episode {epNum} of 8</span>
                  <button
                    onClick={() => scrollToEpisode(nextEpId)}
                    className="flex items-center gap-1.5 text-[#D4AF37] hover:text-white font-bold uppercase transition-colors cursor-pointer"
                  >
                    <span>{epNum < 8 ? `Continue to Episode ${epNum + 1}` : 'View Ratio & Impact'}</span>
                    <span>↓</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Section 9: End-of-Case Dossier Snap Section */}
        <section
          id="case-dossier"
          className="py-8 sm:py-12 md:py-16 md:min-h-[calc(100vh-64px)] md:snap-start flex flex-col justify-center border-t border-white/10 space-y-8"
        >
          {/* Student Mode End: Flashcards */}
          {depth === 'student' && caseData.flashcards && (
            <Flashcards flashcards={caseData.flashcards} lang={language} />
          )}

          {/* Advocate Mode End: Subsequent History */}
          {depth === 'advocate' && caseData.subsequentHistory && (
            <SubsequentHistory history={caseData.subsequentHistory} lang={language} />
          )}

          {/* 1. If This Affects You */}
          <IfThisAffectsYou affectsYou={caseData.affectsYou} lang={language} />

          {/* 2. What Changed Since (Timeline) */}
          <WhatChangedSince timeline={caseData.timeline} lang={language} />

          {/* Newsletter / WhatsApp Capture */}
          <NewsletterCapture lang={language} />

          {/* 3. Read Next (2 related cases by doctrine) */}
          <ReadNext relatedSlugs={caseData.relatedSlugs} lang={language} />

          {/* 4. Sources & Editorial Review */}
          <SourcesAndCorrections
            caseSlug={caseData.slug}
            sourceUrl={caseData.sourceUrl}
            citations={caseData.citations}
            sources={caseData.sources}
            review={caseData.review}
            lang={language}
          />

          {/* Next Case Link */}
          <div className="py-6 text-center border-t border-white/10 text-xs font-mono text-white/40 space-y-2">
            {nextSlug ? (
              <Link
                href={`/case/${nextSlug}?depth=${depth}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase rounded-xs transition-all cursor-pointer shadow-lg"
              >
                <span>Swipe or Tap for Next Case</span>
                <span>→</span>
              </Link>
            ) : (
              <span>You have completed all cases in this dossier.</span>
            )}
          </div>
        </section>
      </main>

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
          caseData.glossary.find((g) => g.slug === activeTermSlug)?.inThisCase
        }
        isOpen={Boolean(activeTermSlug)}
        onClose={() => setActiveTermSlug(null)}
        lang={language}
      />
    </div>
  );
}

