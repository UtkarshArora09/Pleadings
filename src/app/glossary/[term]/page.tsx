import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { CaseCard } from '@/components/CaseCard';
import glossaryData from '@/content/glossary.json';
import { getAllCases } from '@/lib/cases';
import { StatuteRefInline } from '@/components/StatuteRef';

interface TermPageProps {
  params: Promise<{
    term: string;
  }>;
}

export async function generateStaticParams() {
  return glossaryData.map((g) => ({ term: g.slug }));
}

export async function generateMetadata({ params }: TermPageProps): Promise<Metadata> {
  const { term } = await params;
  const item = glossaryData.find(
    (g) => g.slug === term || g.term.toLowerCase() === decodeURIComponent(term).toLowerCase()
  );

  if (!item) {
    return {
      title: 'Legal Term Not Found | Pleadings',
    };
  }

  const title = `${item.term} — Meaning, Statute & Landmark Case Applications | Pleadings`;
  const description = `${item.plainMeaning.en} Verified against official court judgments.`;
  const url = `https://pleadings.in/glossary/${item.slug}`;

  return {
    title,
    description,
    keywords: [
      item.term,
      `${item.term} legal meaning`,
      `${item.term} meaning in Hindi`,
      `${item.term} case laws`,
      item.statute ? item.statute : 'Indian law doctrine',
      ...(item.related || []).map((r) => `${r.replace(/-/g, ' ')} meaning`),
      'Pleadings legal glossary',
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Pleadings',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function TermPage({ params }: TermPageProps) {
  const { term } = await params;
  const decoded = decodeURIComponent(term).toLowerCase();

  const item = glossaryData.find(
    (g) => g.slug === decoded || g.term.toLowerCase() === decoded
  );

  if (!item) {
    notFound();
  }

  const allCases = getAllCases();
  // Find cases using this term either in glossary array or body
  const matchingCases = allCases.filter((c) => {
    return (
      c.glossary.some((g) => g.slug === item.slug || g.term.toLowerCase() === item.term.toLowerCase()) ||
      c.doctrines.some((d) => d.toLowerCase().includes(item.slug) || d.toLowerCase().includes(item.term.toLowerCase())) ||
      c.episodes.some((ep) =>
        ep.layers.story.blocks.some((b) => b.text.toLowerCase().includes(item.term.toLowerCase()))
      )
    );
  });

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] select-none font-sans pb-24">
      <Header />

      <div className="pt-28 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/glossary"
            className="text-xs font-mono font-bold text-[#D4AF37] hover:underline inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>BACK TO LEGAL GLOSSARY</span>
          </Link>
        </div>

        {/* Term Hero Card */}
        <section className="p-6 sm:p-8 bg-[#12141C] border border-[#D4AF37]/40 rounded-xs shadow-2xl space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              LEGAL DOCTRINE & PLAIN MEANING
            </span>
            <h1 className="font-anton text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight">
              {item.term}
            </h1>
          </div>

          <div className="p-4 sm:p-5 bg-black/50 border-l-3 border-[#D4AF37] rounded-r-xs space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
              English Plain Meaning
            </span>
            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-serif italic">
              "{item.plainMeaning.en}"
            </p>
          </div>

          <div className="p-4 sm:p-5 bg-black/30 border-l-3 border-emerald-500/50 rounded-r-xs space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-white/50 block">
              हिंदी सरल अर्थ
            </span>
            <p className="text-sm sm:text-base text-white/95 leading-relaxed font-serif italic">
              "{item.plainMeaning.hi}"
            </p>
          </div>

          {item.statute && (
            <div className="pt-3 border-t border-white/10 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-white/60">Statutory Mapping:</span>
              <StatuteRefInline oldSec={item.statute.split('→')[0].trim()} newSec={item.statute.split('→')[1]?.trim()} />
            </div>
          )}

          {item.related && item.related.length > 0 && (
            <div className="pt-3 border-t border-white/10 space-y-2">
              <span className="text-[10px] font-mono uppercase text-white/50 block">
                Related Doctrines:
              </span>
              <div className="flex flex-wrap gap-2">
                {item.related.map((rel) => (
                  <Link
                    key={rel}
                    href={`/glossary/${rel}`}
                    className="text-xs font-mono px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded-2xs text-[#D4AF37] transition-colors"
                  >
                    {rel.replace(/-/g, ' ')} →
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Pleadings Cases Interpreting This Term */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-3">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-white">
              Landmark Cases Applying "{item.term}"
            </h2>
            <p className="text-xs sm:text-sm text-[#a9a49a] mt-1">
              Real court decisions where the ratio decidendi hinged upon this principle.
            </p>
          </div>

          {matchingCases.length === 0 ? (
            <div className="p-6 bg-[#12141C] border border-white/10 rounded-xs text-center text-xs text-white/60">
              No specific case files currently linked. Check back as new precedents are published.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchingCases.map((caseItem) => (
                <CaseCard key={caseItem.slug} caseData={caseItem} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
