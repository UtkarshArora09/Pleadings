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

  const [caseList, setCaseList] = useState<CaseData[]>(cases);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const merged = cases.map((c) => {
          const cleanSlug = c.slug.toLowerCase().trim();
          const savedRaw = localStorage.getItem(`pleadings_case_${c.slug}`) || localStorage.getItem(`pleadings_case_${cleanSlug}`);
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw);
            if (parsed && (parsed.slug === c.slug || parsed.slug === cleanSlug)) {
              const updated = { ...c };
              if (parsed.bannerImage || parsed.poster?.src) {
                updated.bannerImage = parsed.poster?.src || parsed.bannerImage;
              }
              if (parsed.panels && Array.isArray(parsed.panels)) {
                updated.panels = updated.panels.map((p, pIdx) => {
                  const customP = parsed.panels[pIdx];
                  if (customP && customP.photoExhibitSrc) {
                    return { ...p, photoExhibitSrc: customP.photoExhibitSrc };
                  }
                  return p;
                });
              }
              return updated;
            }
          }
          return c;
        });
        setCaseList(merged);
      } catch {}
    }
  }, [cases]);

  const getIndexFromSlug = useCallback(
    (slug?: string) => {
      const idx = caseList.findIndex((c) => c.slug === slug);
      return idx >= 0 ? idx : 0;
    },
    [caseList]
  );

  const initialIndex = getIndexFromSlug(initialCaseSlug);
  const [activeCaseIndex, setActiveCaseIndex] = useState<number>(initialIndex);
  const [activePanelIndex, setActivePanelIndex] = useState<number>(0);

  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const verticalScrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isInitialPositioned = useRef<boolean>(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Instant scroll to initial case on first mount (ZERO travelling animation)
  useEffect(() => {
    const el = horizontalScrollRef.current;
    if (!el) return;

    const setInitialPos = () => {
      const width = el.clientWidth || window.innerWidth;
      if (initialIndex > 0) {
        el.scrollLeft = width * initialIndex;
      }
      isInitialPositioned.current = true;
    };

    setInitialPos();
    const raf = requestAnimationFrame(setInitialPos);
    return () => cancelAnimationFrame(raf);
  }, [initialIndex]);

  // Smooth scroll horizontally to a case
  const scrollToCase = useCallback(
    (index: number) => {
      if (index < 0 || index >= cases.length) return;

      setActiveCaseIndex(index);
      setActivePanelIndex(0);

      const targetCase = cases[index];
      if (targetCase && typeof window !== 'undefined') {
        window.history.replaceState(null, '', `/case/${targetCase.slug}`);
      }

      const el = horizontalScrollRef.current;
      if (el) {
        const width = el.clientWidth || window.innerWidth;
        el.scrollTo({
          left: width * index,
          behavior: 'smooth',
        });
      }

      // Reset vertical scroll of target case to top panel
      const targetVertical = verticalScrollRefs.current[index];
      if (targetVertical) {
        targetVertical.scrollTo({ top: 0, behavior: 'instant' });
      }
    },
    [cases]
  );

  // Smooth scroll vertically to a panel within a case using exact DOM offsetTop
  const scrollVerticalToPanel = useCallback((caseIndex: number, panelIndex: number) => {
    const verticalContainer = verticalScrollRefs.current[caseIndex];
    if (verticalContainer && verticalContainer.children[panelIndex]) {
      const targetElement = verticalContainer.children[panelIndex] as HTMLElement;
      if (targetElement) {
        verticalContainer.scrollTo({
          top: targetElement.offsetTop,
          behavior: 'smooth',
        });
      }
    }
  }, []);

  // Touch swipe detection for mobile phones (Swipe Left -> Next Case, Swipe Right -> Prev Case)
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
    if (!touchStartRef.current || e.changedTouches.length === 0) return;
    const touchEnd = e.changedTouches[0];
    const deltaX = touchEnd.clientX - touchStartRef.current.x;
    const deltaY = touchEnd.clientY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;
    touchStartRef.current = null;

    // Trigger swipe if horizontal delta is significant (> 45px) and predominantly horizontal
    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15 && duration < 650) {
      if (deltaX < 0) {
        // Swiped Left -> Move to Next Case
        if (activeCaseIndex < cases.length - 1) {
          scrollToCase(activeCaseIndex + 1);
        }
      } else {
        // Swiped Right -> Move to Previous Case
        if (activeCaseIndex > 0) {
          scrollToCase(activeCaseIndex - 1);
        }
      }
    }
  };

  // Debounced horizontal scroll listener (Silent URL update without flicker)
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleHorizontalScroll = useCallback(() => {
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      if (horizontalScrollRef.current) {
        const scrollLeft = horizontalScrollRef.current.scrollLeft;
        const width = horizontalScrollRef.current.clientWidth || window.innerWidth;
        if (width === 0) return;
        const newIndex = Math.round(scrollLeft / width);
        if (newIndex >= 0 && newIndex < cases.length && newIndex !== activeCaseIndex) {
          setActiveCaseIndex(newIndex);
          setActivePanelIndex(0);
          if (typeof window !== 'undefined') {
            window.history.replaceState(null, '', `/case/${cases[newIndex].slug}`);
          }
        }
      }
    }, 50);
  }, [activeCaseIndex, cases]);

  // Vertical scroll listener to update progress bar and dots with accurate offsetTop matching
  const handleVerticalScroll = useCallback(
    (caseIndex: number) => {
      const verticalContainer = verticalScrollRefs.current[caseIndex];
      if (verticalContainer && caseIndex === activeCaseIndex) {
        const scrollTop = verticalContainer.scrollTop;
        const children = Array.from(verticalContainer.children) as HTMLElement[];
        if (children.length === 0) return;

        let closestIndex = 0;
        let minDiff = Infinity;
        children.forEach((child, idx) => {
          const diff = Math.abs(child.offsetTop - scrollTop);
          if (diff < minDiff) {
            minDiff = diff;
            closestIndex = idx;
          }
        });

        if (closestIndex !== activePanelIndex && closestIndex >= 0) {
          setActivePanelIndex(closestIndex);
        }
      }
    },
    [activeCaseIndex, activePanelIndex]
  );

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        if (activeCaseIndex < cases.length - 1) {
          scrollToCase(activeCaseIndex + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (activeCaseIndex > 0) {
          scrollToCase(activeCaseIndex - 1);
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
  }, [activeCaseIndex, activePanelIndex, cases, router, scrollToCase, scrollVerticalToPanel]);

  const activeCase = cases[activeCaseIndex] || cases[0];
  const totalPanels = activeCase.panels.length;

  const handleAdvanceToNextPanel = () => {
    if (activePanelIndex < totalPanels - 1) {
      const nextP = activePanelIndex + 1;
      setActivePanelIndex(nextP);
      scrollVerticalToPanel(activeCaseIndex, nextP);
    }
  };

  return (
    <div
      suppressHydrationWarning
      className="relative w-screen h-screen bg-[#0E1016] overflow-hidden select-none touch-pan-y touch-pan-x"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
        {/* Left: Home link, Case genre badge & Case Switcher Controls */}
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

          {/* Interactive Case Switcher Controls */}
          <div className="flex items-center gap-1 bg-white/5 border border-white/10 px-2 py-0.5 rounded-xs">
            {activeCaseIndex > 0 ? (
              <button
                onClick={() => scrollToCase(activeCaseIndex - 1)}
                className="text-xs text-[#D4AF37] hover:text-white px-1.5 py-0.5 cursor-pointer touch-manipulation"
                title="Previous Case (Scroll/Swipe Right)"
                aria-label="Previous Case"
              >
                ◀
              </button>
            ) : (
              <span className="text-xs text-white/20 px-1.5 py-0.5 select-none">◀</span>
            )}

            <span className="text-[10px] font-mono text-[#a9a49a] uppercase tracking-wider px-1">
              {activeCaseIndex + 1}/{cases.length}
            </span>

            {activeCaseIndex < cases.length - 1 ? (
              <button
                onClick={() => scrollToCase(activeCaseIndex + 1)}
                className="text-xs text-[#D4AF37] hover:text-white px-1.5 py-0.5 cursor-pointer touch-manipulation"
                title="Next Case (Scroll/Swipe Left)"
                aria-label="Next Case"
              >
                ▶
              </button>
            ) : (
              <span className="text-xs text-white/20 px-1.5 py-0.5 select-none">▶</span>
            )}
          </div>
        </div>

        {/* Right: Actions (Brief, Language) */}
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
      <div className="fixed right-2 sm:right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 opacity-50 hover:opacity-100 transition-opacity">
        {Array.from({ length: totalPanels }).map((_, pIndex) => (
          <button
            key={pIndex}
            onClick={() => {
              setActivePanelIndex(pIndex);
              scrollVerticalToPanel(activeCaseIndex, pIndex);
            }}
            className={`rounded-full transition-all duration-300 cursor-pointer ${
              pIndex === activePanelIndex
                ? 'h-5 sm:h-6 w-1 sm:w-1.5 bg-[#D4AF37]'
                : 'h-1 sm:h-1.5 w-1 sm:w-1.5 bg-[#F3EFE6]/25 hover:bg-[#F3EFE6]/60'
            }`}
            title={`Go to panel ${pIndex + 1}`}
          />
        ))}
      </div>

      {/* Screen Side Case Navigation Arrows (Desktop only, avoiding mobile text overlap) */}
      {activeCaseIndex > 0 && (
        <button
          onClick={() => scrollToCase(activeCaseIndex - 1)}
          className="hidden md:flex fixed left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6]/70 hover:text-white items-center justify-center transition-all cursor-pointer text-lg rounded-full border border-white/10 shadow-lg backdrop-blur-xs"
          aria-label="Previous Case"
          title={`Previous Case: ${caseList[activeCaseIndex - 1]?.title[language]} (←)`}
        >
          ←
        </button>
      )}

      {activeCaseIndex < caseList.length - 1 && (
        <button
          onClick={() => scrollToCase(activeCaseIndex + 1)}
          className="hidden md:flex fixed right-14 top-1/2 -translate-y-1/2 z-30 w-11 h-11 bg-black/40 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6]/70 hover:text-white items-center justify-center transition-all cursor-pointer text-lg rounded-full border border-white/10 shadow-lg backdrop-blur-xs"
          aria-label="Next Case"
          title={`Next Case: ${caseList[activeCaseIndex + 1]?.title[language]} (→)`}
        >
          →
        </button>
      )}

      {/* 2D Reel: Native Horizontal Scroll across Cases, Native Vertical Scroll within Panels */}
      <div
        ref={horizontalScrollRef}
        onScroll={handleHorizontalScroll}
        className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-none touch-pan-x touch-pan-y"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {caseList.map((caseItem, cIndex) => (
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
                key={`${caseItem.slug}-${panel.id}`}
                panel={panel}
                panelIndex={pIndex}
                totalPanels={caseItem.panels.length}
                caseData={caseItem}
                onAdvancePanel={handleAdvanceToNextPanel}
                onNextCase={cIndex < cases.length - 1 ? () => scrollToCase(cIndex + 1) : undefined}
                nextCaseTitle={cIndex < cases.length - 1 ? cases[cIndex + 1].title[language] : undefined}
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


