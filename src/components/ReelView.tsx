'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CaseData } from '@/types';
import { ReelPanel } from './ReelPanel';
import { LanguageToggle } from './LanguageToggle';
import { CaseBriefModal } from './CaseBriefModal';
import { LawTermModal } from './LawTermModal';
import { ShareModal } from './ShareModal';
import { Toast } from './Toast';
import { useApp } from '@/context/AppContext';

interface ReelViewProps {
  cases: CaseData[];
  initialCaseSlug?: string;
}

export function ReelView({ cases, initialCaseSlug }: ReelViewProps) {
  const router = useRouter();
  const {
    openBriefModal,
    openShareModal,
    toggleBookmark,
    isBookmarked,
    language,
  } = useApp();

  const initialIndex = Math.max(
    0,
    cases.findIndex((c) => c.slug === initialCaseSlug)
  );

  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(initialIndex);
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const verticalScrollRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Scroll to active case horizontally
  const scrollHorizontalToCase = useCallback((index: number) => {
    if (horizontalScrollRef.current) {
      const targetWidth = horizontalScrollRef.current.clientWidth;
      horizontalScrollRef.current.scrollTo({
        left: targetWidth * index,
        behavior: 'smooth',
      });
    }
  }, []);

  // Scroll to active panel vertically
  const scrollVerticalToPanel = useCallback((caseIndex: number, panelIndex: number) => {
    const verticalContainer = verticalScrollRefs.current[caseIndex];
    if (verticalContainer) {
      const targetHeight = verticalContainer.clientHeight;
      verticalContainer.scrollTo({
        top: targetHeight * panelIndex,
        behavior: 'smooth',
      });
    }
  }, []);

  // Debounced horizontal scroll listener
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHorizontalScroll = useCallback(() => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (horizontalScrollRef.current) {
        const scrollLeft = horizontalScrollRef.current.scrollLeft;
        const width = horizontalScrollRef.current.clientWidth;
        if (width === 0) return;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex !== activeCaseIndex && newIndex >= 0 && newIndex < cases.length) {
          setActiveCaseIndex(newIndex);
          setActivePanelIndex(0);
          const verticalContainer = verticalScrollRefs.current[newIndex];
          if (verticalContainer) {
            verticalContainer.scrollTo({ top: 0, behavior: 'instant' });
          }
          router.replace(`/case/${cases[newIndex].slug}`, { scroll: false });
        }
      }
    }, 80);
  }, [activeCaseIndex, cases, router]);

  // Vertical scroll listener
  const handleVerticalScroll = useCallback((caseIndex: number) => {
    const verticalContainer = verticalScrollRefs.current[caseIndex];
    if (verticalContainer && caseIndex === activeCaseIndex) {
      const scrollTop = verticalContainer.scrollTop;
      const height = verticalContainer.clientHeight;
      if (height === 0) return;
      const newPanelIndex = Math.round(scrollTop / height);
      if (newPanelIndex !== activePanelIndex && newPanelIndex >= 0) {
        setActivePanelIndex(newPanelIndex);
      }
    }
  }, [activeCaseIndex, activePanelIndex]);

  // Initial scroll position
  useEffect(() => {
    if (initialIndex > 0) {
      const t = setTimeout(() => scrollHorizontalToCase(initialIndex), 50);
      return () => clearTimeout(t);
    }
  }, [initialIndex, scrollHorizontalToCase]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (activeCaseIndex < cases.length - 1) {
          const nextIndex = activeCaseIndex + 1;
          setActiveCaseIndex(nextIndex);
          setActivePanelIndex(0);
          scrollHorizontalToCase(nextIndex);
          router.replace(`/case/${cases[nextIndex].slug}`, { scroll: false });
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeCaseIndex > 0) {
          const prevIndex = activeCaseIndex - 1;
          setActiveCaseIndex(prevIndex);
          setActivePanelIndex(0);
          scrollHorizontalToCase(prevIndex);
          router.replace(`/case/${cases[prevIndex].slug}`, { scroll: false });
        }
      } else if (e.key === 'ArrowDown') {
        const currentCasePanels = cases[activeCaseIndex].panels.length;
        if (activePanelIndex < currentCasePanels - 1) {
          const nextPanel = activePanelIndex + 1;
          setActivePanelIndex(nextPanel);
          scrollVerticalToPanel(activeCaseIndex, nextPanel);
        }
      } else if (e.key === 'ArrowUp') {
        if (activePanelIndex > 0) {
          const prevPanel = activePanelIndex - 1;
          setActivePanelIndex(prevPanel);
          scrollVerticalToPanel(activeCaseIndex, prevPanel);
        }
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCaseIndex, activePanelIndex, cases, router, scrollHorizontalToCase, scrollVerticalToPanel]);

  const activeCase = cases[activeCaseIndex] || cases[0];
  const totalPanels = activeCase.panels.length;
  const bookmarked = isBookmarked(activeCase.slug);

  const handleAdvanceToNextPanel = () => {
    if (activePanelIndex < totalPanels - 1) {
      const nextP = activePanelIndex + 1;
      setActivePanelIndex(nextP);
      scrollVerticalToPanel(activeCaseIndex, nextP);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#0E1016] overflow-hidden select-none">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-[#D4AF37] transition-all duration-300"
          style={{ width: `${((activePanelIndex + 1) / totalPanels) * 100}%` }}
        />
      </div>

      {/* Top Control Navigation Header */}
      <div
        className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4 flex items-center justify-between pointer-events-auto"
        style={{
          background:
            'linear-gradient(to bottom, rgba(14,16,22,0.96) 0%, rgba(14,16,22,0.7) 70%, transparent 100%)',
        }}
      >
        {/* Left: Home link & Case genre badge */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#F3EFE6] hover:text-[#D4AF37] transition-colors text-xs font-semibold uppercase tracking-wider"
            title="Return to Home"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">{language === 'en' ? 'Pleadings' : 'होम'}</span>
          </Link>

          <span className="hidden md:inline-block text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 bg-white/5 border border-white/10 text-[#D4AF37] rounded-xs">
            {activeCase.tag[language]}
          </span>
        </div>

        {/* Center: Case Indicator Pills */}
        <div className="flex items-center gap-1.5">
          {cases.map((c, i) => (
            <button
              key={c.slug}
              onClick={() => {
                setActiveCaseIndex(i);
                setActivePanelIndex(0);
                scrollHorizontalToCase(i);
                router.replace(`/case/${c.slug}`, { scroll: false });
              }}
              className={`rounded-full transition-all duration-300 cursor-pointer ${
                i === activeCaseIndex
                  ? 'w-7 h-2 bg-[#D4AF37]'
                  : 'w-2 h-2 bg-[#F3EFE6]/25 hover:bg-[#F3EFE6]/50'
              }`}
              title={`Switch to ${c.title[language]}`}
            />
          ))}
        </div>

        {/* Right: Actions (Bookmark, Share, Brief, Language) */}
        <div className="flex items-center gap-2.5">
          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(activeCase.slug)}
            className={`p-2 rounded-xs border transition-all cursor-pointer text-xs ${
              bookmarked
                ? 'bg-[#D4AF37] text-[#0E1016] border-[#D4AF37]'
                : 'bg-white/5 hover:bg-white/15 text-[#F3EFE6] border-white/15'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Save to My Library'}
          >
            {bookmarked ? '★' : '☆'}
          </button>

          {/* Share Button */}
          <button
            onClick={() =>
              openShareModal({
                title: activeCase.title[language],
                url: typeof window !== 'undefined' ? window.location.href : '',
                citation: activeCase.citation,
              })
            }
            className="p-2 rounded-xs bg-white/5 hover:bg-white/15 text-[#F3EFE6] border border-white/15 transition-all cursor-pointer text-xs"
            title="Share Case"
          >
            ↗
          </button>

          {/* Case Brief Modal Trigger */}
          <button
            onClick={openBriefModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4AF37] text-[#0E1016] font-bold hover:bg-white transition-colors text-[10px] tracking-widest uppercase cursor-pointer rounded-xs"
          >
            <span className="hidden sm:inline">{language === 'en' ? 'Law Brief' : 'केस ब्रीफ'}</span>
            <span className="sm:hidden">Brief</span>
          </button>

          <LanguageToggle />
        </div>
      </div>

      {/* Right Edge Panel Progress Indicators */}
      <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2.5">
        {Array.from({ length: totalPanels }).map((_, pIndex) => (
          <button
            key={pIndex}
            onClick={() => {
              setActivePanelIndex(pIndex);
              scrollVerticalToPanel(activeCaseIndex, pIndex);
            }}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              pIndex === activePanelIndex
                ? 'h-6 w-1.5 bg-[#D4AF37]'
                : 'h-1.5 w-1.5 bg-[#F3EFE6]/25 hover:bg-[#F3EFE6]/60'
            }`}
            title={`Go to panel ${pIndex + 1}`}
          />
        ))}
      </div>

      {/* Horizontal Desktop Case Navigation Arrows */}
      {activeCaseIndex > 0 && (
        <button
          onClick={() => {
            const prev = activeCaseIndex - 1;
            setActiveCaseIndex(prev);
            setActivePanelIndex(0);
            scrollHorizontalToCase(prev);
            router.replace(`/case/${cases[prev].slug}`, { scroll: false });
          }}
          className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/60 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6] items-center justify-center transition-all cursor-pointer text-lg rounded-full border border-white/10"
          aria-label="Previous Case"
          title="Previous Case (←)"
        >
          ←
        </button>
      )}

      {activeCaseIndex < cases.length - 1 && (
        <button
          onClick={() => {
            const next = activeCaseIndex + 1;
            setActiveCaseIndex(next);
            setActivePanelIndex(0);
            scrollHorizontalToCase(next);
            router.replace(`/case/${cases[next].slug}`, { scroll: false });
          }}
          className="hidden md:flex fixed right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/60 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6] items-center justify-center transition-all cursor-pointer text-lg rounded-full border border-white/10"
          aria-label="Next Case"
          title="Next Case (→)"
        >
          →
        </button>
      )}

      {/* Horizontal Cases Container */}
      <div
        ref={horizontalScrollRef}
        onScroll={handleHorizontalScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {cases.map((caseItem, cIndex) => (
          <div
            key={caseItem.slug}
            ref={(el) => {
              verticalScrollRefs.current[cIndex] = el;
            }}
            onScroll={() => handleVerticalScroll(cIndex)}
            className="w-screen h-screen flex-shrink-0 snap-start overflow-y-auto snap-y snap-mandatory scrollbar-none"
            style={{ scrollBehavior: 'smooth' }}
          >
            {caseItem.panels.map((panel, pIndex) => (
              <ReelPanel
                key={panel.id}
                panel={panel}
                panelIndex={pIndex}
                totalPanels={caseItem.panels.length}
                caseData={caseItem}
                onAdvancePanel={handleAdvanceToNextPanel}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Case Brief Modal */}
      <CaseBriefModal caseData={activeCase} />

      {/* Law Term Definitions Modal */}
      <LawTermModal />

      {/* Share Modal */}
      <ShareModal />

      {/* Toast notifications */}
      <Toast />
    </div>
  );
}
