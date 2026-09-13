'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { GLOSSARY_TERMS, GlossaryTerm } from '@/data/glossary';
import { CASES_DATA } from '@/data/cases';
import { LawTermModal } from '@/components/LawTermModal';
import { Toast } from '@/components/Toast';
import { useApp } from '@/context/AppContext';

export default function GlossaryPage() {
  const { language } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    GLOSSARY_TERMS.forEach((t) => cats.add(t.category));
    return Array.from(cats);
  }, []);

  const filteredTerms = useMemo(() => {
    return GLOSSARY_TERMS.filter((item) => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchTerm =
          item.term.en.toLowerCase().includes(query) ||
          item.term.hi.toLowerCase().includes(query);
        const matchDef =
          item.definition.en.toLowerCase().includes(query) ||
          item.definition.hi.toLowerCase().includes(query);
        const matchCode = item.code.toLowerCase().includes(query);

        return matchTerm || matchDef || matchCode;
      }

      return true;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative pb-20 select-none">
      <Header />

      <div className="pt-28 px-4 md:px-12 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="pb-8 mb-8 border-b border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37] mb-2 inline-block">
            {language === 'en' ? 'Law Student Knowledge Hub' : 'कानूनी शब्दावली और सिद्धांत'}
          </span>
          <h1 className="font-anton text-4xl md:text-6xl text-white uppercase tracking-tight leading-none mb-3">
            {language === 'en' ? 'Legal Terms & Doctrines' : 'कानूनी शब्दकोश'}
          </h1>
          <p className="text-sm text-[#a9a49a] max-w-2xl leading-relaxed mb-6">
            {language === 'en'
              ? 'Master the core Latin maxims, criminal law defenses, and constitutional doctrines that define Indian jurisprudence — with real case examples.'
              : 'भारतीय न्यायशास्त्र के प्रमुख लैटिन सूत्रों, आपराधिक बचावों और संवैधानिक सिद्धांतों को सरल भाषा और वास्तविक केस उदाहरणों के साथ समझें।'}
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'en'
                  ? 'Search legal terms, maxims, Latin phrases, sections...'
                  : 'कानूनी शब्द, लैटिन सूत्र या धाराएं खोजें...'
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

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
              selectedCategory === 'ALL'
                ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
                : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
            }`}
          >
            {language === 'en' ? 'All Doctrines' : 'सभी सिद्धांत'}
          </button>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer rounded-xs ${
                selectedCategory === cat
                  ? 'bg-[#D4AF37] text-[#0E1016] font-bold shadow'
                  : 'bg-white/5 text-[#a9a49a] hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Terms Grid */}
        <div className="space-y-4">
          {filteredTerms.map((item: GlossaryTerm) => (
            <div
              key={item.id}
              className="bg-[#12151e] border border-white/10 hover:border-[#D4AF37]/50 p-6 sm:p-8 rounded-xs transition-all duration-300 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-1 rounded-xs border border-[#D4AF37]/30">
                    {item.code}
                  </span>
                  {item.pronunciation && (
                    <span className="text-xs italic text-[#a9a49a] font-serif">
                      /{item.pronunciation}/
                    </span>
                  )}
                </div>

                <span className="text-[10px] font-semibold text-[#8a712a] uppercase tracking-wider">
                  {item.category}
                </span>
              </div>

              {/* Term Title */}
              <h3 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-wide mb-3">
                {item.term[language]}
              </h3>

              {/* Formal Legal Definition */}
              <div className="mb-4">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8a712a] block mb-1">
                  {language === 'en' ? 'Legal Definition' : 'कानूनी परिभाषा'}
                </span>
                <p className="text-sm text-[#d6d2c8] leading-[1.75]">
                  {item.definition[language]}
                </p>
              </div>

              {/* Plain English/Hindi Explanation */}
              <div className="bg-[#0E1016] p-4 border-l-2 border-[#D4AF37] mb-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37] block mb-1">
                  {language === 'en' ? 'In Plain Words (For Everyone)' : 'सरल शब्दों में'}
                </span>
                <p className="text-xs sm:text-sm text-[#a9a49a] leading-relaxed">
                  {item.plainExplanation[language]}
                </p>
              </div>

              {/* Related Cases Links */}
              {item.relatedCaseSlugs.length > 0 && (
                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#a9a49a]">
                    {language === 'en' ? 'Illustrated in Case Stories:' : 'इस केस स्टोरी में देखें:'}
                  </span>
                  {item.relatedCaseSlugs.map((slug) => {
                    const cData = CASES_DATA.find((c) => c.slug === slug);
                    if (!cData) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/case/${slug}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-[#D4AF37] hover:text-[#0E1016] text-[#F3EFE6] text-xs font-semibold tracking-wider uppercase transition-all rounded-xs border border-white/10"
                      >
                        <span>▶</span>
                        <span>{cData.title[language]}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <LawTermModal />
      <Toast />
    </main>
  );
}
