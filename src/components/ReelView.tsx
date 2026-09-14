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
  const { openBriefModal, language } = useApp();

  const getIndexFromSlug = useCallback(
    (slug?: string) => {
      const idx = cases.findIndex((c) => c.slug === slug);
      return idx >= 0 ? idx : 0;
    },
    [cases]
  );

  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(() =>
    getIndexFromSlug(initialCaseSlug)
  );
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  const verticalScrollRef = useRef<HTMLDivElement>(null);

  // Sync if initialCaseSlug changes externally (e.g. initial load or direct navigation)
  useEffect(() => {
    const targetIndex = getIndexFromSlug(initialCaseSlug);
    if (targetIndex !== activeCaseIndex) {
      setActiveCaseIndex(targetIndex);
      setActivePanelIndex(0);
      if (verticalScrollRef.current) {
        verticalScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
      }
    }
  }, [initialCaseSlug, getIndexFromSlug, activeCaseIndex]);

  // Support browser Back/Forward buttons without re-mounting
  useEffect(() => {
    const handlePopState = () => {
      const pathSegments = window.location.pathname.split('/');
      const slug = pathSegments[pathSegments.length - 1];
      const targetIndex = cases.findIndex((c) => c.slug === slug);
      if (targetIndex >= 0 && targetIndex !== activeCaseIndex) {
        setActiveCaseIndex(targetIndex);
        setActivePanelIndex(0);
        if (verticalScrollRef.current) {
          verticalScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [cases, activeCaseIndex]);

  // Navigate cleanly to another case instantly without triggering server re-renders or text flicker
  const navigateToCase = useCallback(
    (newIndex: number) => {
      if (newIndex >= 0 && newIndex < cases.length && newIndex !== activeCaseIndex) {
        setActiveCaseIndex(newIndex);
        setActivePanelIndex(0);
        if (verticalScrollRef.current) {
          verticalScrollRef.current.scrollTo({ top: 0, behavior: 'instant' });
        }
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `/case/${cases[newIndex].slug}`);
        }
      }
    },
    [cases, activeCaseIndex]
  );

  // Scroll to active panel vertically within current case
  const scrollVerticalToPanel = useCallback((panelIndex: number) => {
    if (verticalScrollRef.current) {
      const targetHeight = verticalScrollRef.current.clientHeight;
      verticalScrollRef.current.scrollTo({
        top: targetHeight * panelIndex,
        behavior: 'smooth',
      });
    }
  }, []);

  // Vertical scroll listener to update active panel dot & progress
  const handleVerticalScroll = useCallback(() => {
    if (verticalScrollRef.current) {
      const scrollTop = verticalScrollRef.current.scrollTop;
      const height = verticalScrollRef.current.clientHeight;
      if (height === 0) return;
      const newPanelIndex = Math.round(scrollTop / height);
      if (newPanelIndex !== activePanelIndex && newPanelIndex >= 0) {
        setActivePanelIndex(newPanelIndex);
      }
    }
  }, [activePanelIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (activeCaseIndex < cases.length - 1) {
          navigateToCase(activeCaseIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeCaseIndex > 0) {
          navigateToCase(activeCaseIndex - 1);
        }
      } else if (e.key === 'ArrowDown') {
        const currentCasePanels = cases[activeCaseIndex].panels.length;
        if (activePanelIndex < currentCasePanels - 1) {
          const nextPanel = activePanelIndex + 1;
          setActivePanelIndex(nextPanel);
          scrollVerticalToPanel(nextPanel);
        }
      } else if (e.key === 'ArrowUp') {
        if (activePanelIndex > 0) {
          const prevPanel = activePanelIndex - 1;
          setActivePanelIndex(prevPanel);
          scrollVerticalToPanel(prevPanel);
        }
      } else if (e.key === 'Escape') {
        router.push('/');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCaseIndex, activePanelIndex, cases, navigateToCase, router, scrollVerticalToPanel]);

  const activeCase = cases[activeCaseIndex] || cases[0];
  const totalPanels = activeCase.panels.length;
  const nextCase = activeCaseIndex < cases.length - 1 ? cases[activeCaseIndex + 1] : null;

  const handleAdvanceToNextPanel = () => {
    if (activePanelIndex < totalPanels - 1) {
      const nextP = activePanelIndex + 1;
      setActivePanelIndex(nextP);
      scrollVerticalToPanel(nextP);
    }
  };

  // Touch swipe handling for mobile left/right case transitions
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      };
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartRef.current.x;
    const diffY = touchEndY - touchStartRef.current.y;
    const elapsedTime = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Detect intentional horizontal swipe (at least 40px and more horizontal than vertical)
    if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY) * 1.1 && elapsedTime < 800) {
      if (diffX < -40) {
        // Swiped Left -> Next Case
        if (activeCaseIndex < cases.length - 1) {
          navigateToCase(activeCaseIndex + 1);
        }
      } else if (diffX > 40) {
        // Swiped Right -> Prev Case
        if (activeCaseIndex > 0) {
          navigateToCase(activeCaseIndex - 1);
        }
      }
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen bg-[#0E1016] overflow-hidden select-none"
    >
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
        <div
          className="h-full bg-[#D4AF37] transition-all duration-300"
          style={{ width: `${((activePanelIndex + 1) / totalPanels) * 100}%` }}
        />
      </div>

      {/* Top Control Navigation Header */}
      <div
        className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 md:px-8 py-3.5 sm:py-4 flex items-center justify-between pointer-events-auto"
        style={{
          background:
            'linear-gradient(to bottom, rgba(14,16,22,0.96) 0%, rgba(14,16,22,0.7) 70%, transparent 100%)',
        }}
      >
        {/* Left: Home link, Case genre badge & Case Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[#F3EFE6] hover:text-[#D4AF37] transition-colors text-xs font-semibold uppercase tracking-wider"
            title="Return to Home"
          >
            <span className="text-base leading-none">←</span>
            <span className="hidden sm:inline">{language === 'en' ? 'Pleadings' : 'होम'}</span>
          </Link>

          <span className="hidden md:inline-block text-[9px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 bg-white/5 border border-white/10 text-[#D4AF37] rounded-xs">
            {activeCase.tag[language]}
          </span>

          {/* Mobile & Desktop Interactive Case Switcher Controls */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xs">
            {activeCaseIndex > 0 ? (
              <button
                onClick={() => navigateToCase(activeCaseIndex - 1)}
                className="text-xs text-[#D4AF37] hover:text-white px-1 py-0.5 cursor-pointer"
                title="Previous Case (Swipe Right)"
                aria-label="Previous Case"
              >
                ◀
              </button>
            ) : (
              <span className="text-xs text-white/20 px-1 py-0.5 select-none">◀</span>
            )}

            <span className="text-[10px] font-mono text-[#a9a49a] uppercase tracking-wider px-1">
              {activeCaseIndex + 1}/{cases.length}
            </span>

            {activeCaseIndex < cases.length - 1 ? (
              <button
                onClick={() => navigateToCase(activeCaseIndex + 1)}
                className="text-xs text-[#D4AF37] hover:text-white px-1 py-0.5 cursor-pointer"
                title="Next Case (Swipe Left)"
                aria-label="Next Case"
              >
                ▶
              </button>
            ) : (
              <span className="text-xs text-white/20 px-1 py-0.5 select-none">▶</span>
            )}
          </div>
        </div>

        {/* Right: Actions (Brief, Language, Share) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Case Brief Modal Trigger */}
          <button
            onClick={openBriefModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-[#D4AF37] text-[#0E1016] font-bold hover:bg-white transition-colors text-[10px] tracking-widest uppercase cursor-pointer rounded-xs shadow-sm"
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
              scrollVerticalToPanel(pIndex);
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

      {/* Horizontal Desktop Case Navigation Arrows (Glitch-Free) */}
      {activeCaseIndex > 0 && (
        <button
          onClick={() => navigateToCase(activeCaseIndex - 1)}
          className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/70 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6] items-center justify-center transition-all cursor-pointer text-lg rounded-full border border-white/15 shadow-xl"
          aria-label="Previous Case"
          title={`Previous Case: ${cases[activeCaseIndex - 1].title[language]} (←)`}
        >
          ←
        </button>
      )}

      {activeCaseIndex < cases.length - 1 && (
        <button
          onClick={() => navigateToCase(activeCaseIndex + 1)}
          className="hidden md:flex fixed right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/70 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6] items-center justify-center transition-all cursor-pointer text-lg rounded-full border border-white/15 shadow-xl"
          aria-label="Next Case"
          title={`Next Case: ${cases[activeCaseIndex + 1].title[language]} (→)`}
        >
          →
        </button>
      )}

      {/* Vertical Reel of Active Case */}
      <div
        ref={verticalScrollRef}
        onScroll={handleVerticalScroll}
        className="w-full h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollBehavior: 'smooth' }}
      >
        {activeCase.panels.map((panel, pIndex) => (
          <ReelPanel
            key={`${activeCase.slug}-${panel.id}`}
            panel={panel}
            panelIndex={pIndex}
            totalPanels={totalPanels}
            caseData={activeCase}
            onAdvancePanel={handleAdvanceToNextPanel}
            onNextCase={nextCase ? () => navigateToCase(activeCaseIndex + 1) : undefined}
            nextCaseTitle={nextCase ? nextCase.title[language] : undefined}
          />
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

