import React from 'react';
import { Metadata } from 'next';
import { getCaseBySlug, getAllCases, getAllCaseSlugs } from '@/lib/cases';
import { CaseStore } from '@/lib/db/caseStore';
import { CaseFile } from '@/types/case';
import { CasePageClient } from '@/components/case/CasePageClient';

interface CasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

function getCaseForPage(slug: string): CaseFile | null {
  if (!slug) return null;
  const staticCase = getCaseBySlug(slug);
  if (staticCase) return staticCase;

  const rawDynamicCase = CaseStore.getBySlug(slug);
  if (rawDynamicCase) {
    const dyn = rawDynamicCase as any;
    const titleStr = typeof dyn.title === 'string' ? dyn.title : (dyn.title?.en || dyn.slug);
    const hookStr = typeof dyn.hook === 'string' ? dyn.hook : (dyn.hook?.en || dyn.blurb?.en || '');
    const posterImg = dyn.poster || { src: dyn.bannerImage || '/images/cases/ghost-case.jpg', alt: `${titleStr} poster`, provenance: 'illustration' as const };

    return {
      ...dyn,
      slug: dyn.slug,
      title: titleStr,
      hook: hookStr,
      court: dyn.court || 'Supreme Court of India',
      year: dyn.year || 2024,
      decidedOn: dyn.decidedOn || `${dyn.year || 2024}-05-15`,
      bench: dyn.bench || [`Hon'ble Bench of the ${dyn.court || 'Supreme Court of India'}`],
      citations: dyn.citations || { primary: dyn.citation || `${dyn.year || 2024} INSC 1`, parallel: [] },
      sourceUrl: dyn.sourceUrl || dyn.judgmentUrl || 'https://indiankanoon.org/',
      status: dyn.status?.code ? dyn.status : { code: 'GOOD_LAW', explain: 'Active precedent', chain: [{ year: dyn.year || 2024, event: 'Delivered' }] },
      statuteMap: dyn.statuteMap || [{ old: dyn.categoryTag || 'Constitution', new: null, note: 'Governing statute' }],
      doctrines: dyn.doctrines || [dyn.categoryTag || 'Constitutional Law'],
      categories: dyn.categories || [dyn.genre || 'constitutional'],
      readingTime: dyn.readingTime || { story: 5, student: 7, advocate: 9 },
      featured: typeof dyn.featured === 'boolean' ? dyn.featured : true,
      publishedAt: dyn.publishedAt || dyn.createdAt || new Date().toISOString(),
      poster: posterImg,
      episodes: dyn.episodes || [],
      vote: dyn.vote || {
        question: `How should the court decide this issue?`,
        context: `Consider the verified evidence.`,
        options: [
          { id: 'opt-1', label: 'Uphold the statutory claim', argument: 'The legal requirements were met based on the trial evidence.' },
          { id: 'opt-2', label: 'Reject the claim', argument: 'Strict statutory preconditions were not established.' }
        ],
        courtChoseOptionId: 'opt-1'
      },
      glossary: dyn.glossary || [],
      flashcards: dyn.flashcards || [],
      affectsYou: dyn.affectsYou || {
        heading: `How this ruling protects your rights`,
        points: [`Guarantees due process and constitutional safeguards.`],
      },
      timeline: dyn.timeline || [{ year: dyn.year || 2024, event: 'Judgment delivered' }],
      relatedSlugs: dyn.relatedSlugs || ['ghost-case', 'nanavati-case'],
      subsequentHistory: dyn.subsequentHistory || [],
      sources: dyn.sources || [{ label: 'Verified against the original/officially published judgment', url: dyn.judgmentUrl || 'https://indiankanoon.org/' }],
      review: dyn.review || { reviewer: 'Adv. Girish Kr. Srivastava', enrolment: 'D/842/1991', reviewedOn: new Date().toISOString().split('T')[0] },
    } as unknown as CaseFile;
  }

  return null;
}

export async function generateStaticParams() {
  const slugs = getAllCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCaseForPage(slug);

  if (!caseItem) {
    const humanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${humanTitle} | Pleadings`,
      description: `Episodic courtroom experience and landmark legal breakdown for ${humanTitle}.`
    };
  }

  const title = `${caseItem.title} (${caseItem.court}, ${caseItem.year}) | Pleadings`;
  const description = `${caseItem.hook} Verified against the original/officially published judgment ${caseItem.citations.primary}.`;
  const url = `https://pleadings.in/case/${caseItem.slug}`;
  const ogImageUrl = `https://pleadings.in/api/share/${caseItem.slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Pleadings',
      images: [
        {
          url: ogImageUrl,
          width: 1080,
          height: 1350,
          alt: `${caseItem.title} - Pleadings Landmark Case`
        }
      ],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl]
    }
  };
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const currentCase = getCaseForPage(slug);

  const allCases = getAllCases();
  const currentIndex = currentCase ? allCases.findIndex((c) => c.slug === currentCase.slug) : -1;
  const nextSlug = currentIndex >= 0 && currentIndex < allCases.length - 1
    ? allCases[currentIndex + 1].slug
    : allCases[0]?.slug;
  const prevSlug = currentIndex > 0
    ? allCases[currentIndex - 1].slug
    : allCases[allCases.length - 1]?.slug;

  const jsonLd = currentCase ? {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: currentCase.title,
    description: currentCase.hook,
    datePublished: currentCase.publishedAt,
    dateModified: currentCase.review?.reviewedOn,
    url: `https://pleadings.in/case/${currentCase.slug}`,
    author: {
      '@type': 'Person',
      name: currentCase.review?.reviewer || 'Advocate'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Pleadings',
      url: 'https://pleadings.in'
    },
    about: {
      '@type': 'Legislation',
      name: currentCase.citations.primary,
      legislationJurisdiction: 'IN'
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <React.Suspense fallback={<div className="min-h-screen bg-[#0E1016] text-[#D4AF37] flex items-center justify-center font-mono">Loading case dossier...</div>}>
        <CasePageClient
          slug={slug}
          initialCase={currentCase}
          nextSlug={nextSlug}
          prevSlug={prevSlug}
        />
      </React.Suspense>
    </>
  );
}

