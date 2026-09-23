'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { CaseCard } from '@/components/CaseCard';
import { getPublishedCases } from '@/lib/cases';
import { useApp } from '@/context/AppContext';
import { CaseFile } from '@/types/case';

function BrowseContent() {
  const { bookmarkedSlugs } = useApp();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'saved' ? 'SAVED' : 'ALL';

  const [allCases, setAllCases] = useState<any[]>(() => {
    try {
      return getPublishedCases();
    } catch {
      return [];
    }
  });

  useEffect(() => {
    let isMounted = true;
    async function loadFreshCases() {
      try {
        const res = await fetch(`/api/cases?_t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.cases) && isMounted) {
            setAllCases(data.cases);
          }
        }
      } catch (err) {
        console.warn('Failed to load fresh cases on browse:', err);
      }
    }
    loadFreshCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter States
  const [selectedTab, setSelectedTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCourt, setSelectedCourt] = useState<string>('ALL');
  const [selectedDecade, setSelectedDecade] = useState<string>('ALL');
  const [selectedDoctrine, setSelectedDoctrine] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedReadTime, setSelectedReadTime] = useState<string>('ALL');

  // Extract filter options dynamically from data
  const courts = useMemo(() => {
    const set = new Set<string>();
    allCases.forEach((c) => {
      const courtName = typeof c.court === 'string' ? c.court : (c.court?.en || '');
      if (courtName) set.add(courtName);
    });
    return Array.from(set);
  }, [allCases]);

  const doctrines = useMemo(() => {
    const set = new Set<string>();
    allCases.forEach((c) => {
      const docs = c.doctrines || (c.categoryTag ? [c.categoryTag] : (c.tag?.en ? [c.tag.en] : []));
      docs.forEach((d: string) => {
        if (d && typeof d === 'string') set.add(d.trim());
      });
    });
    return Array.from(set).filter(Boolean);
  }, [allCases]);

  // Filtering Logic
  const filteredCases = useMemo(() => {
    return allCases.filter((caseItem) => {
      const itemDocs = caseItem.doctrines || (caseItem.categoryTag ? [caseItem.categoryTag] : (caseItem.tag?.en ? [caseItem.tag.en] : []));
      const titleStr = typeof caseItem.title === 'string' ? caseItem.title : (caseItem.title?.en || caseItem.slug);
      const hookStr = typeof caseItem.hook === 'string' ? caseItem.hook : (caseItem.hook?.en || caseItem.blurb?.en || caseItem.featuredHeroHook?.en || '');
      const courtStr = typeof caseItem.court === 'string' ? caseItem.court : (caseItem.court?.en || 'Supreme Court of India');
      const primaryCitation = caseItem.citations?.primary || caseItem.citation || '';
      const statusCode = caseItem.status?.code || (caseItem.status === 'PUBLISHED' ? 'GOOD_LAW' : (typeof caseItem.status === 'string' ? caseItem.status : 'GOOD_LAW'));

      // Tab filter
      if (selectedTab === 'SAVED') {
        if (!bookmarkedSlugs.includes(caseItem.slug)) return false;
      }

      // Court filter
      if (selectedCourt !== 'ALL' && courtStr !== selectedCourt) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'ALL' && statusCode !== selectedStatus) {
        return false;
      }

      // Decade filter
      if (selectedDecade !== 'ALL') {
        const decadeNum = parseInt(selectedDecade, 10);
        const yr = caseItem.year || 2020;
        if (yr < decadeNum || yr >= decadeNum + 10) {
          return false;
        }
      }

      // Doctrine filter
      if (selectedDoctrine !== 'ALL' && !itemDocs.some((d: string) => d.toLowerCase() === selectedDoctrine.toLowerCase())) {
        return false;
      }

      // Reading time filter
      const readTimeNum = caseItem.readingTime?.story || (typeof caseItem.readTime === 'number' ? caseItem.readTime : 5);
      if (selectedReadTime === 'SHORT' && readTimeNum > 5) {
        return false;
      }
      if (selectedReadTime === 'LONG' && readTimeNum <= 5) {
        return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle =
          titleStr.toLowerCase().includes(q) ||
          (caseItem.hi?.title && String(caseItem.hi.title).toLowerCase().includes(q));
        const matchHook =
          hookStr.toLowerCase().includes(q) ||
          (caseItem.hi?.hook && String(caseItem.hi.hook).toLowerCase().includes(q));
        const matchCourt = courtStr.toLowerCase().includes(q);
        const matchCitation = primaryCitation.toLowerCase().includes(q);
        const matchDoctrines = itemDocs.some((d: string) => d.toLowerCase().includes(q));

        return matchTitle || matchHook || matchCourt || matchCitation || matchDoctrines;
      }

      return true;
    });
  }, [
    allCases,
    selectedTab,
    selectedCourt,
    selectedStatus,
    selectedDecade,
    selectedDoctrine,
    selectedReadTime,
    searchQuery,
    bookmarkedSlugs
  ]);

  const resetFilters = () => {
    setSelectedCourt('ALL');
    setSelectedDecade('ALL');
    setSelectedDoctrine('ALL');
    setSelectedStatus('ALL');
    setSelectedReadTime('ALL');
    setSearchQuery('');
    setSelectedTab('ALL');
  };

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative pb-20 select-none font-sans">
      <Header />

      <div className="pt-28 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        {/* Page Title & Search Bar */}
        <div className="pb-6 border-b border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37] block">
                COMPREHENSIVE CASE DIRECTORY
              </span>
              <h1 className="font-anton text-3xl sm:text-5xl text-white uppercase tracking-tight mt-1">
                Browse Precedents
              </h1>
            </div>

            {/* Tab: All vs Saved */}
            <div className="flex items-center p-1 bg-black/60 rounded-full border border-white/15">
              <button
                onClick={() => setSelectedTab('ALL')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedTab === 'ALL'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                All Cases ({allCases.length})
              </button>
              <button
                onClick={() => setSelectedTab('SAVED')}
                className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer ${
                  selectedTab === 'SAVED'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                Saved ({bookmarkedSlugs.length})
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative max-w-xl">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] font-mono text-xs font-bold">
              §
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by case title, citation (e.g. AIR 1960), court, or statute..."
              className="w-full bg-[#12141C] border border-white/20 rounded-xs pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Chips Bar (Court · Decade · Doctrine · Status · Reading time) */}
        <div className="p-4 bg-[#12141C] border border-white/10 rounded-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] font-bold">
              FILTER PRECEDENTS
            </span>
            <button
              onClick={resetFilters}
              className="text-[10px] font-mono text-white/50 hover:text-[#D4AF37] transition-colors cursor-pointer"
            >
              Reset All Filters ↺
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs font-mono">
            {/* 1. Court Filter */}
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Court</label>
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xs p-1.5 text-white focus:border-[#D4AF37] focus:outline-hidden"
              >
                <option value="ALL">All Courts</option>
                {courts.map((court) => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>

            {/* 2. Decade Filter */}
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Decade</label>
              <select
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xs p-1.5 text-white focus:border-[#D4AF37] focus:outline-hidden"
              >
                <option value="ALL">All Decades</option>
                <option value="1950">1950s</option>
                <option value="1960">1960s</option>
                <option value="1970">1970s</option>
                <option value="1980">1980s</option>
                <option value="1990">1990s</option>
                <option value="2010">2010s</option>
                <option value="2020">2020s</option>
              </select>
            </div>

            {/* 3. Doctrine Filter */}
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Doctrine</label>
              <select
                value={selectedDoctrine}
                onChange={(e) => setSelectedDoctrine(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xs p-1.5 text-white focus:border-[#D4AF37] focus:outline-hidden"
              >
                <option value="ALL">All Doctrines</option>
                {doctrines.map((doc) => (
                  <option key={doc} value={doc}>{doc}</option>
                ))}
              </select>
            </div>

            {/* 4. Status Filter */}
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xs p-1.5 text-white focus:border-[#D4AF37] focus:outline-hidden"
              >
                <option value="ALL">All Statuses</option>
                <option value="GOOD_LAW">Still Good Law</option>
                <option value="PARTLY_SUPERSEDED">Partly Superseded</option>
                <option value="STATUTE_REPLACED">Statute Replaced</option>
                <option value="OVERRULED">Overruled</option>
              </select>
            </div>

            {/* 5. Reading Time Filter */}
            <div>
              <label className="block text-[10px] uppercase text-white/50 mb-1">Reading Time</label>
              <select
                value={selectedReadTime}
                onChange={(e) => setSelectedReadTime(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xs p-1.5 text-white focus:border-[#D4AF37] focus:outline-hidden"
              >
                <option value="ALL">Any Length</option>
                <option value="SHORT">≤ 5 minutes</option>
                <option value="LONG">&gt; 5 minutes</option>
              </select>
            </div>
          </div>
        </div>

        {/* Advocate Contribution Banner */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#171924] to-[#12141F] border border-[#D4AF37]/30 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
              ADVOCATE & SCHOLAR NETWORK
            </span>
            <h3 className="font-anton text-lg sm:text-xl text-white uppercase tracking-tight">
              Know a landmark case that should be here?
            </h3>
            <p className="text-xs text-[#cbd5e1] font-sans">
              Contribute case details, factual arguments, and ratio decidendi. Published with full advocate attribution after registry verification.
            </p>
          </div>
          <Link
            href="/contribute"
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xs transition-all shadow-md flex-shrink-0"
          >
            + Submit A Case →
          </Link>
        </div>

        {/* Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span>Showing {filteredCases.length} of {allCases.length} landmark cases</span>
          </div>

          {filteredCases.length === 0 ? (
            <div className="py-16 text-center bg-[#12141C] border border-white/10 rounded-xs space-y-3">
              <div className="text-2xl font-mono text-[#D4AF37]">§</div>
              <h3 className="font-serif font-bold text-lg text-white">No cases match your filters</h3>
              <p className="text-xs text-[#a9a49a]">
                Try adjusting your search terms or clearing the active filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs uppercase font-mono rounded-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredCases.map((caseItem) => (
                <CaseCard key={caseItem.slug} caseData={caseItem} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E1016] text-[#D4AF37] flex items-center justify-center font-mono">Loading directory...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
