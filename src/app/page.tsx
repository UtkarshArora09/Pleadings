import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Top10Carousel } from '@/components/Top10Carousel';
import { PosterCard } from '@/components/PosterCard';
import { CourtroomExperienceShowcase } from '@/components/CourtroomExperienceShowcase';
import { HomeSectionNav } from '@/components/HomeSectionNav';
import { getAllCases, getPublishedCases, getPublishedCasesAsync, getFeaturedCases, getTop10Cases } from '@/lib/cases';
import Link from 'next/link';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Pleadings — Landmark Indian Court Judgments as Verified Stories',
  description:
    'Certified Indian legal precedents transformed into transparent, episodic courtroom thrillers, evidence reels, and law student briefs.',
  alternates: {
    canonical: 'https://pleadings.in',
  },
};

export default async function HomePage() {
  const allCases = await getPublishedCasesAsync();
  const top10Cases = [...allCases]
    .filter((c) => {
      const r = (c as any).rank;
      if (typeof r === 'number' && r > 10) return false;
      return true;
    })
    .sort((a, b) => {
      const rankA = typeof (a as any).rank === 'number' ? (a as any).rank : 100;
      const rankB = typeof (b as any).rank === 'number' ? (b as any).rank : 100;
      return rankA - rankB;
    })
    .slice(0, 10);
  const featuredCase = allCases.find((c) => c.featured) || allCases[0];

  return (
    <main className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#0E1016] text-[#F3EFE6] relative md:snap-y md:snap-proximity scroll-smooth">
      <Header />
      <HomeSectionNav />

      {/* Section 1: Hero Billboard */}
      <Hero featuredCase={featuredCase} casesList={allCases} />

      {/* Section 2: Top 10 Landmark Precedents in India */}
      <section
        id="section-top10"
        className="mt-6 sm:mt-0 pt-8 sm:pt-10 pb-6 sm:pb-12 md:py-16 md:min-h-[80vh] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-20 md:snap-start w-full overflow-hidden"
      >
        <Top10Carousel cases={top10Cases} />
      </section>

      {/* Section 3: Start Here: Essential Precedents */}
      <section
        id="section-essential"
        className="py-8 sm:py-10 md:py-16 md:min-h-[80vh] flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 md:px-12 space-y-6 sm:space-y-8 relative z-20 md:snap-start w-full overflow-hidden"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
                START HERE: ESSENTIAL PRECEDENTS
              </h2>
              <p className="text-xs sm:text-sm text-[#a9a49a] font-sans mt-0.5">
                Foundational criminal, constitutional, and civil doctrines that established Indian jurisprudence.
              </p>
            </div>

            <Link
              href="/browse"
              className="text-xs font-mono font-bold text-[#D4AF37] hover:underline"
            >
              Browse Cases →
            </Link>
          </div>

          {/* Grid of Poster Cards */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
            {allCases.map((caseItem: any) => (
              <PosterCard key={caseItem.slug} caseData={caseItem} />
            ))}
          </div>
        </div>

        {/* Explore All Link Banner */}
        <div className="p-4 sm:p-6 bg-[#12141C] border border-white/10 rounded-xs flex flex-wrap items-center justify-between gap-4 shadow-xl w-full overflow-hidden">
          <div className="space-y-1 max-w-full">
            <h3 className="font-anton text-base sm:text-xl text-white uppercase tracking-tight break-words">
              Looking for a specific doctrine or court?
            </h3>
            <p className="text-xs text-[#a9a49a] font-sans">
              Filter by Supreme Court benches, High Courts, IPC→BNS statutes, or constitutional topics.
            </p>
          </div>
          <Link
            href="/browse"
            className="w-full sm:w-auto text-center px-5 sm:px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xs transition-all shadow-md"
          >
            Open Case Dossier Directory →
          </Link>
        </div>
      </section>

      {/* Section 4: The Advocate Toolkit & Courtroom Showcase */}
      <section
        id="section-toolkit"
        className="py-8 sm:py-10 md:py-16 md:min-h-[80vh] flex flex-col justify-center relative z-20 md:snap-start w-full overflow-hidden"
      >
        <CourtroomExperienceShowcase />
      </section>

      {/* Section 5: Comprehensive Editorial Footer */}
      <footer
        id="section-footer"
        className="border-t border-white/10 bg-[#0A0C10] py-10 sm:py-14 px-4 sm:px-6 md:px-12 text-[#a9a49a] text-xs font-mono md:snap-start"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-anton text-lg text-white uppercase tracking-wider">
              PLEADINGS · LEGAL MEDIA
            </div>
            <p className="text-[11px] text-[#7a766e]">
              Verified against the original/officially published judgment.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
            <Link href="/contribute" className="text-[#D4AF37] hover:text-white transition-colors font-bold">
              + Contribute Case
            </Link>
            <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
              Editorial Masthead
            </Link>
            <Link href="/corrections" className="hover:text-[#D4AF37] transition-colors">
              Corrections Log
            </Link>
            <Link href="/glossary" className="hover:text-[#D4AF37] transition-colors">
              Legal Glossary
            </Link>
            <Link href="/bns" className="hover:text-[#D4AF37] transition-colors">
              IPC → BNS Concordance
            </Link>
            <Link href="/browse" className="hover:text-[#D4AF37] transition-colors">
              Browse Precedents
            </Link>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-white/40">
          <div>© {new Date().getFullYear()} Pleadings. All rights reserved. Verified against the original/officially published judgment.</div>
          <div>Transforming verified Indian judgments into transparent legal media.</div>
        </div>
      </footer>
    </main>
  );
}

