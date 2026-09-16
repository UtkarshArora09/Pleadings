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
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative pb-24 select-none font-sans">
      <Header />

      <div className="pt-28 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto space-y-10">
        {/* Page Header */}
        <div className="pb-6 border-b border-white/10 space-y-4">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37] block">
            {language === 'en' ? 'LEGAL VOCABULARY & DOCTRINES' : 'कानूनी शब्दकोश और सिद्धांत'}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
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
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                🔍
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search legal doctrines (e.g. Mens Rea, Basic Structure, Due Process)..."
                className="w-full bg-[#12141C] border border-white/20 rounded-xs pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden"
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
        </div>

        {/* Terms Grid */}
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
                    <h2 className="font-serif font-bold text-lg text-white group-hover:text-[#D4AF37] transition-colors">
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
      </div>
    </main>
  );
}
