import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCaseBySlug, getAllCases, getAllCaseSlugs } from '@/lib/cases';
import { CaseViewer } from '@/components/case/CaseViewer';

interface CasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = getAllCaseSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCaseBySlug(slug);

  if (!caseItem) {
    return {
      title: 'Case Not Found | Pleadings',
      description: 'The requested landmark case record was not found.'
    };
  }

  const title = `${caseItem.title} (${caseItem.court}, ${caseItem.year}) | Pleadings`;
  const description = `${caseItem.hook} Sourced from certified judgment ${caseItem.citations.primary}.`;
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
  const currentCase = getCaseBySlug(slug);

  if (!currentCase) {
    notFound();
  }

  const allCases = getAllCases();
  const currentIndex = allCases.findIndex((c) => c.slug === currentCase.slug);
  const nextSlug = currentIndex >= 0 && currentIndex < allCases.length - 1
    ? allCases[currentIndex + 1].slug
    : allCases[0]?.slug;
  const prevSlug = currentIndex > 0
    ? allCases[currentIndex - 1].slug
    : allCases[allCases.length - 1]?.slug;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: currentCase.title,
    description: currentCase.hook,
    datePublished: currentCase.publishedAt,
    dateModified: currentCase.review.reviewedOn,
    url: `https://pleadings.in/case/${currentCase.slug}`,
    author: {
      '@type': 'Person',
      name: currentCase.review.reviewer
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <React.Suspense fallback={<div className="min-h-screen bg-[#0E1016] text-[#D4AF37] flex items-center justify-center font-mono">Loading case dossier...</div>}>
        <CaseViewer
          caseData={currentCase}
          nextSlug={nextSlug}
          prevSlug={prevSlug}
        />
      </React.Suspense>
    </>
  );
}
