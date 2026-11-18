'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import glossaryData from '@/content/glossary.json';
import { useApp } from '@/context/AppContext';
import { StatuteRefInline } from '@/components/StatuteRef';

export default function GlossaryPage() {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTerms = useMemo(() => {
    if (!searchQuery.trim()) return glossaryData;
    const q = searchQuery.toLowerCase().trim();

    return glossaryData.filter((item) => {
      const matchTerm = item.term.toLowerCase().includes(q);
      const matchPlainEn = item.plainMeaning.en.toLowerCase().includes(q);
      const matchPlainHi = item.plainMeaning.hi.toLowerCase().includes(q);
      const matchStatute = item.statute ? item.statute.toLowerCase().includes(q) : false;

      return matchTerm || matchPlainEn || matchPlainHi || matchStatute;
    });
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative pb-24 font-sans">
      <Header />

      <div className="pt-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="pb-6 border-b border-white/10 space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37] block">
            {language === 'en' ? 'LEGAL VOCABULARY & DOCTRINES' : 'कानूनी शब्दकोश और सिद्धांत'}
          </span>
          <h1 className="font-anton text-3xl sm:text-5xl text-white uppercase tracking-tight">
            {language === 'en' ? 'Plain-English Legal Glossary' : 'सरल कानूनी शब्दावली'}
          </h1>
          <p className="text-sm sm:text-base text-[#a9a49a] max-w-3xl leading-relaxed">
            {language === 'en'
              ? 'Master the core legal doctrines and Latin maxims that determine Indian court rulings. Every term links to its statutory basis and certified Pleadings precedents.'
              : 'भारतीय अदालती फैसलों में इस्तेमाल होने वाले प्रमुख कानूनी शब्दों और सिद्धांतों के आसान अर्थ।'}
          </p>

          {/* Search Box */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <label htmlFor="glossary-search-input" className="sr-only">
                {language === 'en' ? 'Search legal glossary terms' : 'कानूनी शब्दावली खोजें'}
              </label>
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D4AF37] font-mono text-xs font-bold" aria-hidden="true">
                §
              </span>
              <input
                id="glossary-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search legal doctrines (e.g. Mens Rea, Basic Structure, Due Process)...'
                    : 'कानूनी सिद्धांत या शब्द खोजें (जैसे Mens Rea, Basic Structure)...'
                }
                className="w-full bg-[#12141C] border border-white/20 rounded-xs pl-9 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Terms Grid or Empty State */}
        {filteredTerms.length === 0 ? (
          <div className="py-16 text-center bg-[#12141C] border border-white/10 rounded-xs space-y-3">
            <div className="text-2xl font-mono text-[#D4AF37]">§</div>
            <h2 className="font-serif font-bold text-lg text-white">
              {language === 'en'
                ? `No legal term matching "${searchQuery}"`
                : `"${searchQuery}" से मिलता कोई कानूनी शब्द नहीं मिला`}
            </h2>
            <p className="text-xs text-[#a9a49a]">
              {language === 'en'
                ? 'Try searching for doctrines like Mens Rea, Basic Structure, Ratio Decidendi, or Article 21.'
                : 'अन्य कानूनी शब्दों जैसे Mens Rea, Basic Structure या Ratio Decidendi के साथ खोजें।'}
            </p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 bg-[#D4AF37] text-black font-bold text-xs uppercase font-mono rounded-xs cursor-pointer"
            >
              {language === 'en' ? 'Show All Terms' : 'सभी शब्द देखें'}
            </button>
          </div>
        ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredTerms.map((item) => {
            const plain = language === 'hi' ? item.plainMeaning.hi : item.plainMeaning.en;

            return (
              <article
                key={item.slug}
                className="p-5 bg-[#12141C] hover:bg-[#181C26] border border-white/10 hover:border-[#D4AF37]/50 rounded-xs shadow-xl transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="font-anton text-lg sm:text-xl text-white uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">
                      {item.term}
                    </h2>
                  </div>

                  <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed font-sans line-clamp-3">
                    {plain}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  {item.statute ? (
                    <StatuteRefInline
                      oldSec={item.statute.split('→')[0].trim()}
                      newSec={item.statute.split('→')[1]?.trim()}
                    />
                  ) : (
                    <span className="text-white/40 text-[10px]">Constitutional Doctrine</span>
                  )}

                  <Link
                    href={`/glossary/${item.slug}`}
                    className="text-[#D4AF37] font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Cases</span>
                    <span>→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </div>
    </main>
  );
}
