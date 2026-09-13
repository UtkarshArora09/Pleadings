'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { PosterCard } from '@/components/PosterCard';
import { CASES_DATA } from '@/data/cases';
import { LawTermModal } from '@/components/LawTermModal';
import { Toast } from '@/components/Toast';
import { useApp } from '@/context/AppContext';

function BrowseContent() {
  const { language, bookmarkedSlugs } = useApp();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') === 'saved' ? 'SAVED' : 'ALL';

  const [selectedFilter, setSelectedFilter] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState<string>('');

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
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2 inline-block">
            {language === 'en' ? 'Verified Legal Database' : 'सत्यापित कानूनी डेटाबेस'}
          </span>
          <h1 className="font-anton text-4xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            {language === 'en' ? 'Browse Legal Cases' : 'अदالती मामले खोजें'}
          </h1>
          <p className="text-sm text-[#a9a49a] max-w-2xl leading-relaxed mb-6">
            {language === 'en'
              ? 'Search landmark Indian court precedents by section, statute, keyword, or courtroom thriller theme.'
              : 'आईपीसी धाराओं, कानूनी उपबंधों, कीवर्ड्स या केस श्रेणियों के आधार पर भारतीय कोर्ट रिकॉर्ड्स खोजें।'}
          </p>

          {/* Live Search Input Bar */}
          <div className="relative max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search by case name, section (e.g. IPC 79, 66A), keyword, court...'
                  : 'केस का नाम, धारा (जैसे IPC 79, 66A), कीवर्ड या अदालत खोजें...'
              }
              className="w-full bg-[#141722] border border-white/20 focus:border-[#D4AF37] text-sm text-[#F3EFE6] px-4 py-3.5 pl-11 rounded-xs focus:outline-none transition-all placeholder:text-[#a9a49a]/60 shadow-lg"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono opacity-50 uppercase tracking-widest">
              FIND
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-[#a9a49a] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills / Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {/* All */}
          <button
            onClick={() => setSelectedFilter('ALL')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
              selectedFilter === 'ALL'
                ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
                : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
            }`}
          >
            {language === 'en' ? `All Cases (${CASES_DATA.length})` : `सभी मामले (${CASES_DATA.length})`}
          </button>

          {/* Saved Cases */}
          <button
            onClick={() => setSelectedFilter('SAVED')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs flex items-center gap-1.5 ${
              selectedFilter === 'SAVED'
                ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
                : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
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
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
              selectedFilter === 'JUDGE'
                ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
                : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
            }`}
          >
            {language === 'en' ? 'Interactive Decisions' : 'आप हैं जज'}
          </button>

          {/* Dynamic Statute Tags */}
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilter(tag)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
                selectedFilter === tag
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
                  : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-[#a9a49a] mb-6">
          <span>
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
              className="text-[#D4AF37] hover:underline font-semibold cursor-pointer"
            >
              {language === 'en' ? 'Clear all filters' : 'सभी फ़िल्टर साफ़ करें'}
            </button>
          )}
        </div>

        {/* Grid of Case Cards */}
        {filteredCases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCases.map((caseItem) => (
              <div key={caseItem.slug} className="flex justify-center sm:justify-start">
                <PosterCard caseData={caseItem} />
              </div>
            ))}
          </div>
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
                  ? 'Click the star icon (★) on any case card or brief to save it for quick reference.'
                  : 'किसी भी मामले को सहेजने के लिए स्टार आइकन (★) पर क्लिक करें।'
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
              {language === 'en' ? 'View All 6 Landmark Cases' : 'सभी 6 ऐतिहासिक मामले देखें'}
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
