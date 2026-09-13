'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { PosterCard } from '@/components/PosterCard';
import { CASES_DATA } from '@/data/cases';
import { LawTermModal } from '@/components/LawTermModal';
import { Toast } from '@/components/Toast';
import { useApp } from '@/context/AppContext';

function BrowseContent() {
  const { language, bookmarkedSlugs, toggleBookmark, isBookmarked } = useApp();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'saved' ? 'SAVED' : 'ALL';

  const [selectedFilter, setSelectedFilter] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'dossier'>('grid');

  useEffect(() => {
    if (searchParams.get('tab') === 'saved') {
      setSelectedFilter('SAVED');
    }
  }, [searchParams]);

  // Extract all unique category tags
  const availableTags = useMemo(() => {
    const tagsSet = new Set<string>();
    CASES_DATA.forEach((c) => {
      if (c.categoryTag) tagsSet.add(c.categoryTag);
    });
    return Array.from(tagsSet);
  }, []);

  // Filter cases by search query and category tag / tab
  const filteredCases = useMemo(() => {
    return CASES_DATA.filter((caseItem) => {
      // Filter by category / tab
      if (selectedFilter === 'SAVED') {
        if (!bookmarkedSlugs.includes(caseItem.slug)) return false;
      } else if (selectedFilter === 'JUDGE') {
        if (!caseItem.hasJudgeDecision) return false;
      } else if (selectedFilter !== 'ALL') {
        if (caseItem.categoryTag !== selectedFilter && caseItem.genre !== selectedFilter) {
          return false;
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle =
          caseItem.title.en.toLowerCase().includes(query) ||
          caseItem.title.hi.toLowerCase().includes(query);
        const matchBlurb =
          caseItem.blurb.en.toLowerCase().includes(query) ||
          caseItem.blurb.hi.toLowerCase().includes(query);
        const matchTag =
          caseItem.tag.en.toLowerCase().includes(query) ||
          caseItem.tag.hi.toLowerCase().includes(query) ||
          caseItem.categoryTag.toLowerCase().includes(query);
        const matchCitation = caseItem.citation.toLowerCase().includes(query);
        const matchCourt = caseItem.court.toLowerCase().includes(query);

        return matchTitle || matchBlurb || matchTag || matchCitation || matchCourt;
      }

      return true;
    });
  }, [selectedFilter, searchQuery, bookmarkedSlugs]);

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative pb-20 select-none">
      <Header />

      <div className="pt-28 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Page Title & Search Bar */}
        <div className="pb-8 mb-8 border-b border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37] inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span>
                {language === 'en'
                  ? 'Verified Supreme Court & High Court Database'
                  : 'सत्यापित सुप्रीम कोर्ट व हाई कोर्ट डेटाबेस'}
              </span>
            </span>

            <span className="text-xs font-mono text-[#8c887e]">
              {CASES_DATA.length} {language === 'en' ? 'Landmark Cases Available' : 'ऐतिहासिक मामले उपलब्ध'}
            </span>
          </div>

          <h1 className="font-anton text-4xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            {language === 'en' ? 'Browse Legal Cases' : 'अदालती मामले खोजें'}
          </h1>
          <p className="text-sm text-[#a9a49a] max-w-2xl leading-relaxed mb-6">
            {language === 'en'
              ? 'Search landmark Indian court precedents by section, statute, keyword, or courtroom thriller theme.'
              : 'आईपीसी धाराओं, कानूनी उपबंधों, कीवर्ड्स या केस श्रेणियों के आधार पर भारतीय कोर्ट रिकॉर्ड्स खोजें।'}
          </p>

          {/* Live Search Input Bar (Clean SVG Icon, No Overlap Bug) */}
          <div className="relative max-w-xl">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a9a49a] pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search by case name, section (e.g. IPC 79, 66A, Art 21), court...'
                  : 'केस का नाम, धारा (जैसे IPC 79, 66A, अनुच्छेद 21) या अदालत खोजें...'
              }
              className="w-full bg-[#141722] border border-white/20 focus:border-[#D4AF37] text-sm text-[#F3EFE6] px-4 py-3.5 pl-10 rounded-xs focus:outline-none transition-all placeholder:text-[#a9a49a]/60 shadow-lg"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono px-1.5 py-0.5 rounded-xs bg-white/10 text-[#a9a49a] hover:text-white cursor-pointer"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills / Tabs & View Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          {/* Scrollable Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {/* All */}
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
                selectedFilter === 'ALL'
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                  : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10 hover:border-white/25'
              }`}
            >
              {language === 'en' ? `All Cases (${CASES_DATA.length})` : `सभी मामले (${CASES_DATA.length})`}
            </button>

            {/* Saved Cases */}
            <button
              onClick={() => setSelectedFilter('SAVED')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs flex items-center gap-1.5 ${
                selectedFilter === 'SAVED'
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                  : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10 hover:border-white/25'
              }`}
            >
              <span>{language === 'en' ? 'Saved Library' : 'सहेजे गए'}</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full font-bold font-mono">
                {bookmarkedSlugs.length}
              </span>
            </button>

            {/* You Are The Judge */}
            <button
              onClick={() => setSelectedFilter('JUDGE')}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs flex items-center gap-1 ${
                selectedFilter === 'JUDGE'
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                  : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10 hover:border-white/25'
              }`}
            >
              <span>⚡</span>
              <span>{language === 'en' ? 'Interactive Decisions' : 'आप हैं जज'}</span>
            </button>

            {/* Dynamic Statute Tags */}
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedFilter(tag)}
                className={`px-3.5 py-2 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
                  selectedFilter === tag
                    ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow-md'
                    : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10 hover:border-white/25'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (Posters vs Dossier List) */}
          <div className="flex items-center gap-1 bg-[#141722] p-1 rounded-xs border border-white/10 self-start lg:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-xs cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold'
                  : 'text-[#a9a49a] hover:text-white'
              }`}
              title="Cinematic Posters Grid"
            >
              <span>⊞</span>
              <span>{language === 'en' ? 'Posters' : 'पोस्टर'}</span>
            </button>

            <button
              onClick={() => setViewMode('dossier')}
              className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider transition-all rounded-xs cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'dossier'
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold'
                  : 'text-[#a9a49a] hover:text-white'
              }`}
              title="Detailed Legal Briefs Dossier"
            >
              <span>☰</span>
              <span>{language === 'en' ? 'Dossiers' : 'डॉक्यूमेंट'}</span>
            </button>
          </div>
        </div>

        {/* Results Counter & Quick Reset */}
        <div className="flex items-center justify-between text-xs text-[#a9a49a] mb-6">
          <span className="font-mono">
            {language === 'en'
              ? `Showing ${filteredCases.length} verified case ${filteredCases.length === 1 ? 'file' : 'files'}`
              : `${filteredCases.length} सत्यापित अदालती मामले प्रदर्शित`}
          </span>

          {(selectedFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[#D4AF37] hover:underline font-semibold cursor-pointer text-xs font-mono"
            >
              {language === 'en' ? 'Clear all filters ✕' : 'सभी फ़िल्टर साफ़ करें ✕'}
            </button>
          )}
        </div>

        {/* Display: Grid View or Dossier List View */}
        {filteredCases.length > 0 ? (
          viewMode === 'grid' ? (
            /* Cinematic Poster Cards Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCases.map((caseItem) => (
                <div key={caseItem.slug} className="flex justify-center sm:justify-start">
                  <PosterCard caseData={caseItem} />
                </div>
              ))}
            </div>
          ) : (
            /* Detailed Courtroom Dossier List View */
            <div className="space-y-4">
              {filteredCases.map((caseItem) => {
                const bookmarked = isBookmarked(caseItem.slug);
                return (
                  <div
                    key={caseItem.slug}
                    className="p-5 sm:p-6 rounded-md bg-[#131622] hover:bg-[#181C2B] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs bg-[#D4AF37] text-[#0E1016]">
                          {caseItem.categoryTag || caseItem.tag[language]}
                        </span>
                        <span className="text-xs font-mono text-[#8c887e]">
                          {caseItem.court} · {caseItem.year}
                        </span>
                        {caseItem.hasJudgeDecision && (
                          <span className="text-[9px] font-mono text-[#38bdf8] border border-[#38bdf8]/30 px-1.5 py-0.5 rounded-xs">
                            ⚡ Interactive Deliberation
                          </span>
                        )}
                      </div>

                      <h3 className="font-anton text-2xl text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">
                        <Link href={`/case/${caseItem.slug}`}>{caseItem.title[language]}</Link>
                      </h3>

                      <p className="text-xs text-[#c9c5bc] leading-relaxed max-w-3xl">
                        {caseItem.blurb[language]}
                      </p>

                      <div className="text-[10px] font-mono text-[#8c887e]">
                        <span className="text-white/40 uppercase">CITATION:</span> {caseItem.citation}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center flex-shrink-0">
                      <button
                        onClick={() => toggleBookmark(caseItem.slug)}
                        className={`px-3 py-2 text-xs font-mono rounded-xs border transition-all cursor-pointer ${
                          bookmarked
                            ? 'bg-[#E50914] text-white border-[#E50914]'
                            : 'bg-white/5 text-[#a9a49a] hover:text-white border-white/10'
                        }`}
                        title={bookmarked ? 'Saved' : 'Save'}
                      >
                        {bookmarked ? '✓ Saved' : '+ Save'}
                      </button>

                      <Link
                        href={`/case/${caseItem.slug}`}
                        className="px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-[#0E1016] font-bold text-xs uppercase font-mono tracking-wider transition-colors rounded-xs shadow-md"
                      >
                        {language === 'en' ? 'Review Case →' : 'केस देखें →'}
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="p-12 text-center max-w-xl mx-auto my-12 bg-[#12151e] border border-white/10 rounded-xs">
            <div className="text-4xl mb-4 opacity-50">⚖️</div>
            <h3 className="font-anton text-2xl text-white uppercase mb-2 tracking-wide">
              {selectedFilter === 'SAVED'
                ? language === 'en'
                  ? 'No bookmarked cases in your library yet'
                  : 'आपकी लाइब्रेरी में अभी कोई सहेजा गया मामला नहीं है'
                : language === 'en'
                ? 'No matching court records found'
                : 'कोई मेल खाता मामला नहीं मिला'}
            </h3>
            <p className="text-xs text-[#a9a49a] mb-6 leading-relaxed">
              {selectedFilter === 'SAVED'
                ? language === 'en'
                  ? 'Click the bookmark icon (+) on any case card to save it for quick reference.'
                  : 'किसी भी मामले को सहेजने के लिए बुकमार्क (+) आइकन पर क्लिक करें।'
                : language === 'en'
                ? 'Try adjusting your search query or reset the statute filter.'
                : 'कृपया खोज शब्द बदलें या फ़िल्टर रीसेट करें।'}
            </p>
            <button
              onClick={() => {
                setSelectedFilter('ALL');
                setSearchQuery('');
              }}
              className="px-6 py-3 bg-[#D4AF37] text-[#0E1016] font-bold text-xs uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              {language === 'en' ? `View All ${CASES_DATA.length} Landmark Cases` : `सभी ${CASES_DATA.length} ऐतिहासिक मामले देखें`}
            </button>
          </div>
        )}
      </div>

      <LawTermModal />
      <Toast />
    </main>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0E1016] text-[#F3EFE6] pt-32 text-center">Loading...</div>}>
      <BrowseContent />
    </Suspense>
  );
}
