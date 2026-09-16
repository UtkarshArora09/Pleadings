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
      time: Date.now()
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;

    // Detect fast horizontal swipe (> 75px, angle predominantly horizontal, < 350ms)
    if (Math.abs(deltaX) > 75 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5 && deltaTime < 400) {
      if (deltaX < 0 && nextSlug) {
        // Swiped Left -> Go to Next Case
        router.push(`/case/${nextSlug}?depth=${depth}`);
      } else if (deltaX > 0 && prevSlug) {
        // Swiped Right -> Go to Prev Case
        router.push(`/case/${prevSlug}?depth=${depth}`);
      }
    }
    touchStartRef.current = null;
  };

  // Hindi localization resolution
  const activeContent = language === 'hi' && caseData.hi ? caseData.hi : caseData;
  const displayTitle = activeContent.title;
  const displayHook = activeContent.hook;
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

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="min-h-screen bg-[#0E1016] text-[#F3EFE6] select-none relative overflow-x-hidden font-sans"
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

      {/* Main Container */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* Case Header Hero Section */}
        <section className="space-y-4 border-b border-white/10 pb-8 animate-fadeIn">
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
          <div className="pt-4">
            <CaseImage
              src={caseData.poster.src}
              alt={caseData.poster.alt}
              provenance={caseData.poster.provenance}
              aspectRatio="aspect-[21/9]"
              priority
            />
          </div>
        </section>

        {/* Episodes 1 through 8 Container with 180ms Crossfade */}
        <div
          className={`space-y-16 transition-opacity duration-180 ${
            isCrossfading ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {episodes.map((ep, epIdx) => {
            const epNum = ep.n || epIdx + 1;
            const currentLayer = ep.layers[depth] || ep.layers.story;
            const isVerdictEpisode = epNum === 7;
            const isLocked = isVerdictEpisode && !isVerdictUnlocked;

            return (
              <article
                key={epNum}
                ref={(el) => { episodeRefs.current[epIdx] = el; }}
                onMouseEnter={() => setActiveEpisodeAnchor(epNum)}
                className="pt-6 border-t border-white/10 space-y-5 relative scroll-mt-20"
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
                  {ep.exhibit && (
                    <Exhibit exhibit={ep.exhibit} />
                  )}

                  {/* End Hook */}
                  {epIdx < 7 && ep.endHook && (
                    <div className="pt-3 text-xs sm:text-sm font-mono text-[#D4AF37] italic border-t border-white/5">
                      ↳ {ep.endHook}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Student Mode End: Flashcards */}
        {depth === 'student' && caseData.flashcards && (
          <Flashcards flashcards={caseData.flashcards} lang={language} />
        )}

        {/* Advocate Mode End: Subsequent History */}
        {depth === 'advocate' && caseData.subsequentHistory && (
          <SubsequentHistory history={caseData.subsequentHistory} lang={language} />
        )}

        {/* Phase 7: End-of-Case Block in Exact Required Order */}
        <div className="pt-8 border-t border-white/10 space-y-8">
          {/* 1. If This Affects You */}
          <IfThisAffectsYou affectsYou={caseData.affectsYou} lang={language} />

          {/* 2. What Changed Since (Timeline) */}
          <WhatChangedSince timeline={caseData.timeline} lang={language} />

          {/* Newsletter / WhatsApp Capture */}
          <NewsletterCapture lang={language} />

          {/* 3. Read Next (2 related cases by doctrine) */}
          <ReadNext relatedSlugs={caseData.relatedSlugs} lang={language} />

          {/* 4. Sources & Editorial Review + Report Error Button */}
          <SourcesAndCorrections
            caseSlug={caseData.slug}
            sourceUrl={caseData.sourceUrl}
            citations={caseData.citations}
            sources={caseData.sources}
            review={caseData.review}
            lang={language}
          />
        </div>

        {/* Swipe Hint Footer */}
        <div className="py-8 text-center border-t border-white/10 text-xs font-mono text-white/40 space-y-2">
          {nextSlug ? (
            <Link
              href={`/case/${nextSlug}?depth=${depth}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-[#D4AF37] hover:text-black font-bold uppercase rounded-xs transition-all cursor-pointer text-white"
            >
              <span>Swipe or Tap for Next Case</span>
              <span>→</span>
            </Link>
          ) : (
            <span>You have completed all cases in this dossier.</span>
          )}
        </div>
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
