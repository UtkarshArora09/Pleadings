import React from 'react';
import { Header } from '@/components/Header';
import Link from 'next/link';

export const metadata = {
  title: 'Editorial Method, Masthead & Fact-Checking Standard | Pleadings',
  description:
    'How Pleadings turns certified Indian judgments into transparent, three-tiered verifiable courtroom stories. Verified against official court reports.',
  keywords: [
    'Pleadings editorial method',
    'three-tier legal sourcing',
    'certified Indian judgments',
    'judicial fact checking',
    'Pleadings masthead',
    'legal journalism India',
  ],
  alternates: {
    canonical: 'https://pleadings.in/about',
  },
  openGraph: {
    title: 'Editorial Method & Masthead | Pleadings',
    description: 'How Pleadings turns certified Indian judgments into transparent, source-tiered episodic stories.',
    url: 'https://pleadings.in/about',
    siteName: 'Pleadings',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] select-none">
      <Header />

      <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <div className="space-y-3 border-b border-white/10 pb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block font-bold">
            TRANSPARENCY & EDITORIAL POLICY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
            How Pleadings Is Built
          </h1>
          <p className="text-base sm:text-lg text-[#a9a49a] font-sans leading-relaxed">
            Pleadings is a legal-media platform making real Indian court judgments readable, verifiable, and engaging without sacrificing legal rigor.
          </p>
        </div>

        {/* The 3-Tier Source System */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xs">
              CORE SYSTEM
            </span>
            <h2 className="font-serif text-2xl font-bold text-white">The Three-Tier Source System</h2>
          </div>
          <p className="text-sm sm:text-base text-[#E0DCD3] leading-relaxed">
            Every sentence on Pleadings carries an explicit source tier. We distinguish between certified judicial holding, verifiable historical journalism, and dramatized scene reconstructions:
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* BLACK */}
            <div className="p-5 bg-[#141824] border border-[#D4AF37]/40 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/20 px-2 py-0.5 rounded-2xs">
                  BLACK TIER · ¶
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">Taken From the Judgment</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Directly quotes or paraphrases certified judicial copies. Carries a clickable paragraph pinpoint (e.g. <code className="text-[#D4AF37] font-mono">¶12</code>) that opens the verbatim judgment text.
              </p>
            </div>

            {/* BLUE */}
            <div className="p-5 bg-[#101928] border border-sky-500/30 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded-2xs">
                  BLUE TIER · †
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">Verified Secondary Source</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Contemporary newspaper reports, official police dispatches, memoirs, or books recorded at the time. Carries publication details and dates.
              </p>
            </div>

            {/* AMBER */}
            <div className="p-5 bg-[#1c1712] border border-amber-600/40 rounded-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-300 bg-amber-950 px-2 py-0.5 rounded-2xs">
                  AMBER TIER
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">Atmospheric Reconstruction</h3>
              <p className="text-xs text-white/80 leading-relaxed">
                Scene-setting only to recreate historical atmosphere. Never used for a factual claim regarding a real person's acts, words, or state of mind.
              </p>
            </div>
          </div>
        </section>

        {/* Masthead & Reviewing Advocates */}
        <section className="space-y-6 pt-6 border-t border-white/10">
          <h2 className="font-serif text-2xl font-bold text-white">Editorial Board & Legal Review</h2>
          <div className="p-6 bg-[#12141C] border border-white/10 rounded-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-lg font-bold text-white">Adv. Girish Kr. Srivastava</h3>
                <p className="text-xs text-[#D4AF37] font-mono">Senior Legal Reviewer · Supreme Court of India</p>
              </div>
              <div className="font-mono text-xs px-2.5 py-1 bg-black/50 border border-white/15 rounded-xs text-white/80">
                Enrolment No: D/842/1991
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed">
              Every case published on Pleadings undergoes scrutiny by enrolled advocates to ensure paragraph pinpoints, statutory citations (including IPC→BNS concordance), and ratio-obiter demarcations strictly reflect and are verified against the original/officially published judgment.
            </p>
          </div>
        </section>

        {/* Corrections & Error Reporting */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <h2 className="font-serif text-2xl font-bold text-white">Commitment to Corrections</h2>
          <p className="text-sm text-[#E0DCD3] leading-relaxed">
            We maintain a public, immutable log of all editorial corrections. If you spot a factual error or misattributed citation, please notify us immediately.
          </p>
          <div className="flex gap-4 pt-2">
            <Link
              href="/corrections"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xs border border-white/15 transition-all"
            >
              View Corrections Log →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
