import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { CaseCard } from '@/components/CaseCard';
import { CourtroomExperienceShowcase } from '@/components/CourtroomExperienceShowcase';
import { getAllCases, getFeaturedCases } from '@/lib/cases';
import { getVisibleHomepageRows } from '@/config/homepage';
import Link from 'next/link';

export const metadata = {
  title: 'Pleadings — Landmark Indian Court Judgments as Verified Stories',
  description: 'Certified Indian legal precedents transformed into transparent, episodic, source-tiered stories with bilingual support.'
};

export default function HomePage() {
  const allCases = getAllCases();
  const featuredCase = getFeaturedCases()[0] || allCases[0];
  const visibleRows = getVisibleHomepageRows(allCases);

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative overflow-x-hidden select-none">
      <Header />
      <Hero featuredCase={featuredCase} casesList={allCases} />

      {/* Structured 2-Row Layout Driven by Config */}
      <div className="relative z-20 pb-16 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-6">
        {visibleRows.map(({ row, cases }) => (
          <section key={row.id} className="space-y-4">
            {/* Row Title & Description */}
            <div className="flex flex-wrap items-end justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>{row.title.en}</span>
                </h2>
                <p className="text-xs sm:text-sm text-[#a9a49a] font-sans mt-0.5">
                  {row.subtitle.en}
                </p>
              </div>

              <Link
                href="/browse"
                className="text-xs font-mono font-bold text-[#D4AF37] hover:underline"
              >
                Browse All 10 Cases →
              </Link>
            </div>

            {/* Grid of 5 Sized Case Cards (Mobile-first responsive grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {cases.map((caseItem, idx) => (
                <CaseCard
                  key={caseItem.slug}
                  caseData={caseItem}
                  priority={idx < 2}
                />
              ))}
            </div>
          </section>
        ))}

        {/* Explore All Link Banner */}
        <div className="p-6 bg-[#12141C] border border-white/10 rounded-xs flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-white">Looking for a specific doctrine or court?</h3>
            <p className="text-xs text-[#a9a49a]">
              Filter by Supreme Court benches, High Courts, IPC→BNS statutes, or constitutional topics.
            </p>
          </div>
          <Link
            href="/browse"
            className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xs transition-all shadow-md"
          >
            Open Case Dossier Directory →
          </Link>
        </div>
      </div>

      {/* Credibility & Experience Showcase with Replaced Credibility Line */}
      <CourtroomExperienceShowcase />
    </main>
  );
}
