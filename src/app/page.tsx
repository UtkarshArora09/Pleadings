import React from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { Top10Carousel } from '@/components/Top10Carousel';
import { PosterCard } from '@/components/PosterCard';
import { CourtroomExperienceShowcase } from '@/components/CourtroomExperienceShowcase';
import { getAllCases, getFeaturedCases } from '@/lib/cases';
import Link from 'next/link';

export const metadata = {
  title: 'Pleadings — Landmark Indian Court Judgments as Verified Stories',
  description: 'Certified Indian legal precedents transformed into transparent, episodic, source-tiered stories with bilingual support.'
};

export default function HomePage() {
  const allCases = getAllCases();
  const featuredCase = getFeaturedCases()[0] || allCases[0];

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative overflow-x-hidden select-none">
      <Header />
      <Hero featuredCase={featuredCase} casesList={allCases} />

      {/* Main Rows Layout */}
      <div className="relative z-20 pb-12 space-y-14 max-w-7xl mx-auto px-4 sm:px-6 md:px-12 -mt-4">
        {/* Row 1: TOP 10 LANDMARK PRECEDENTS IN INDIA Carousel */}
        <Top10Carousel cases={allCases} />

        {/* Row 2: START HERE: ESSENTIAL PRECEDENTS */}
        <section className="space-y-4">
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
              Browse All 10 Cases →
            </Link>
          </div>

          {/* Grid of Poster Cards */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none">
            {allCases.map((caseItem) => (
              <PosterCard
                key={caseItem.slug}
                caseData={caseItem}
              />
            ))}
          </div>
        </section>

        {/* Explore All Link Banner */}
        <div className="p-6 bg-[#12141C] border border-white/10 rounded-xs flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <h3 className="font-anton text-xl text-white uppercase tracking-tight">
              Looking for a specific doctrine or court?
            </h3>
            <p className="text-xs text-[#a9a49a] font-sans">
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

      {/* The Pleadings Interactive Experience Showcase */}
      <CourtroomExperienceShowcase />

      {/* Comprehensive Editorial Footer */}
      <footer className="border-t border-white/10 bg-[#0A0C10] py-12 px-4 sm:px-6 md:px-12 text-[#a9a49a] text-xs font-mono select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-anton text-lg text-white uppercase tracking-wider">
              PLEADINGS · LEGAL MEDIA
            </div>
            <p className="text-[11px] text-[#7a766e]">
              Certified Indian Court Judgments as Verified, Episodic Courtroom Experiences.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/70">
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
          <div>© {new Date().getFullYear()} Pleadings. All rights reserved. Sourced from certified public court records.</div>
          <div>Transforming certified Indian judgments into transparent legal media.</div>
        </div>
      </footer>
    </main>
  );
}
