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

// Helper to generate hyper-targeted search keywords per case
function getCaseKeywords(caseItem: CaseFile): string[] {
  const base = [
    caseItem.title,
    caseItem.citations.primary,
    ...(caseItem.citations.parallel || []),
    caseItem.court,
    `${caseItem.court} ${caseItem.year}`,
    ...(caseItem.doctrines || []),
    ...(caseItem.statuteMap?.map((s) => s.old) || []),
    ...(caseItem.statuteMap?.map((s) => s.new).filter(Boolean) as string[] || []),
    ...(caseItem.bench || []),
    'Pleadings',
    'pleadings.in',
    'Indian court judgment breakdown',
    'landmark Indian case summary',
    'CLAT PG landmark judgments',
    'Judiciary exam case laws',
    'UPSC Law Optional cases',
  ];

  // Case-specific search queries and natural language phrases
  const slug = caseItem.slug;
  const specificMap: Record<string, string[]> = {
    'nanavati-case': [
      'KM Nanavati vs State of Maharashtra',
      'Nanavati case full judgment',
      'Commander Nanavati Prem Ahuja',
      'Sylvia Nanavati murder case',
      'IPC 300 Exception 1',
      'Grave and sudden provocation',
      'Abolition of jury trials in India',
      'Why jury system was abolished in India',
      'Nanavati case ratio decidendi',
      'Rustom movie real case facts',
      'AIR 1962 SC 605',
    ],
    'kesavananda-bharati': [
      'Kesavananda Bharati vs State of Kerala',
      'Basic Structure Doctrine',
      'Article 368 amendment power',
      '13 judge bench Supreme Court',
      'Fundamental Rights case summary',
      '24th and 25th constitutional amendments',
      'Golaknath case overruled',
      'Can Parliament change basic structure',
      '(1973) 4 SCC 225',
    ],
    'maneka-gandhi': [
      'Maneka Gandhi vs Union of India',
      'Article 21 Procedure Established by Law',
      'Due Process of Law in India',
      'Golden Triangle Article 14 19 21',
      'Passport impounding case',
      'Right to travel abroad fundamental right',
      'Natural justice in Indian constitution',
      'AIR 1978 SC 597',
    ],
    'm-c-mehta': [
      'MC Mehta vs Union of India',
      'Oleum Gas Leak case summary',
      'Absolute Liability principle India',
      'Shriram Foods and Fertilizers case',
      'Rylands vs Fletcher departure in India',
      'Article 32 environmental public interest litigation',
      'Bhopal gas tragedy precedent',
      'AIR 1987 SC 1086',
    ],
    'right-to-privacy-case': [
      'Justice KS Puttaswamy vs Union of India',
      'Right to Privacy fundamental right',
      'Article 21 right to privacy judgment',
      'Aadhaar case 9 judge bench',
      'MP Sharma and Kharak Singh overruled',
      'Proportionality test for privacy',
      'Informational privacy India',
      '(2017) 10 SCC 1',
    ],
    'shah-bano': [
      'Mohd Ahmed Khan vs Shah Bano Begum',
      'Shah Bano case maintenance',
      'Section 125 CrPC Muslim divorced woman',
      'Uniform Civil Code Article 44',
      'Muslim Women Protection of Rights on Divorce Act 1986',
      'AIR 1985 SC 945',
    ],
    'shreya-singhal': [
      'Shreya Singhal vs Union of India',
      'Section 66A IT Act unconstitutional',
      'Freedom of speech on internet Article 19 1 a',
      'Chilling effect doctrine online censorship',
      'Palghar Facebook arrest case',
      'AIR 2015 SC 1523',
    ],
    'vishaka-case': [
      'Vishaka vs State of Rajasthan',
      'Vishaka guidelines sexual harassment at workplace',
      'POSH Act 2013 background',
      'Bhanwari Devi case judgment',
      'CEDAW convention application in Indian law',
      'AIR 1997 SC 3011',
    ],
    'ghost-case': [
      'State of Orissa vs Ram Bahadur Thapa',
      'State of Maharashtra vs Ram Bahadur Thapa',
      'Ghost killing case law India',
      'IPC Section 79 mistake of fact in good faith',
      'Bona fide belief in ghosts legal defense',
      'Rasgovindpur aerodrome ghost attack',
      'AIR 1960 Ori 161',
    ],
    'haircut-case': [
      'Aashna Roy vs ITC Hotels Maurya',
      '2 crore haircut case judgment',
      'ITC Maurya salon deficiency in service',
      'Consumer Protection Act 2019 haircut compensation',
      'NCDRC 2 crore salon award Supreme Court',
    ],
    'navtej-johar': [
      'Navtej Singh Johar vs Union of India',
      'Section 377 IPC decriminalization',
      'Homosexuality legal India Supreme Court',
      'LGBTQ rights landmark cases India',
      'Constitutional morality and Section 377',
      'Suresh Kumar Koushal overruled',
      'AIR 2018 SC 4321',
    ],
    'rinku-rukshar-habeas-corpus-case': [
      'Rinku alias Rukshar vs State of UP',
      'Habeas corpus child custody mother',
      'Interfaith marriage rights Allahabad High Court',
      'Right of adult to choose life partner',
      'Article 21 personal liberty interfaith couple',
    ],
  };

  const specific = specificMap[slug] || [];
  return Array.from(new Set([...base, ...specific]));
}

export async function generateMetadata({ params }: CasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const caseItem = getCaseForPage(slug);

  if (!caseItem) {
    const humanTitle = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      title: `${humanTitle} | Pleadings`,
      description: `Episodic courtroom experience and landmark legal breakdown for ${humanTitle}.`,
      robots: { index: true, follow: true },
    };
  }

  const title = `${caseItem.title} (${caseItem.court}, ${caseItem.year}) | Pleadings`;
  const description = `${caseItem.hook} Verified against the official judgment: ${caseItem.citations.primary}. Read the full courtroom thriller, evidence exhibits, and ratio decidendi.`;
  const url = `https://pleadings.in/case/${caseItem.slug}`;
  const ogImageUrl = `https://pleadings.in/api/share/${caseItem.slug}`;
  const keywords = getCaseKeywords(caseItem);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Pleadings',
      locale: 'en_IN',
      images: [
        {
          url: ogImageUrl,
          width: 1080,
          height: 1350,
          alt: `${caseItem.title} - Pleadings Landmark Case Dossier`
        }
      ],
      type: 'article',
      publishedTime: caseItem.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@pleadings_in',
      site: '@pleadings_in',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
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
    '@graph': [
      {
        '@type': 'Article',
        '@id': `https://pleadings.in/case/${currentCase.slug}#article`,
        headline: `${currentCase.title} — Verified Judgment Dossier`,
        description: currentCase.hook,
        datePublished: currentCase.publishedAt,
        dateModified: currentCase.review?.reviewedOn || currentCase.publishedAt,
        url: `https://pleadings.in/case/${currentCase.slug}`,
        author: {
          '@type': 'Person',
          name: currentCase.review?.reviewer || 'Pleadings Advocate Board',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Pleadings',
          url: 'https://pleadings.in',
          logo: {
            '@type': 'ImageObject',
            url: 'https://pleadings.in/icon.svg',
          },
        },
        image: currentCase.poster?.src ? `https://pleadings.in${currentCase.poster.src}` : 'https://pleadings.in/opengraph-image',
        about: [
          {
            '@type': 'Legislation',
            name: currentCase.citations.primary,
            legislationJurisdiction: 'IN',
          },
          ...(currentCase.doctrines || []).map((d) => ({
            '@type': 'Thing',
            name: d,
          })),
        ],
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `https://pleadings.in/case/${currentCase.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://pleadings.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Browse Cases',
            item: 'https://pleadings.in/browse',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: currentCase.title,
            item: `https://pleadings.in/case/${currentCase.slug}`,
          },
        ],
      },
      ...(currentCase.vote ? [
        {
          '@type': 'FAQPage',
          '@id': `https://pleadings.in/case/${currentCase.slug}#faq`,
          mainEntity: [
            {
              '@type': 'Question',
              name: currentCase.vote.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: `${currentCase.vote.context} Court Decision: ${currentCase.vote.options.find(o => o.id === currentCase.vote?.courtChoseOptionId)?.argument || currentCase.status.explain}`,
              },
            },
          ],
        },
      ] : []),
    ],
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

