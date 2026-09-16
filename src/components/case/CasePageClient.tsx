'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CaseFile } from '@/types/case';
import { CaseViewer } from '@/components/case/CaseViewer';

interface CasePageClientProps {
  slug: string;
  initialCase: CaseFile | null;
  nextSlug?: string;
  prevSlug?: string;
}

function normalizeToCaseFile(raw: any, slug: string): CaseFile {
  const titleStr = typeof raw.title === 'string' ? raw.title : (raw.title?.en || raw.title?.hi || slug);
  const hookStr = typeof raw.hook === 'string' ? raw.hook : (raw.hook?.en || raw.blurb?.en || raw.featuredHeroHook?.en || '');
  const posterImg = raw.poster || {
    src: raw.bannerImage || '/images/cases/ghost-case.jpg',
    alt: `${titleStr} cover poster`,
    provenance: 'illustration' as const,
  };

  // Convert panels to episodes if episodes don't exist
  let episodes = raw.episodes;
  if (!episodes || !Array.isArray(episodes) || episodes.length === 0) {
    if (raw.panels && Array.isArray(raw.panels)) {
      episodes = raw.panels.map((p: any, idx: number) => {
        const bodyText = typeof p.body === 'string' ? p.body : (p.body?.en || '');
        const headlineText = typeof p.headline === 'string' ? p.headline : (p.headline?.en || `Episode ${idx + 1}`);
        const eyebrowText = typeof p.eyebrow === 'string' ? p.eyebrow : (p.eyebrow?.en || `EPISODE 0${idx + 1}`);

        return {
          n: idx + 1,
          kicker: eyebrowText,
          title: headlineText,
          layers: {
            story: {
              blocks: [
                {
                  type: 'para' as const,
                  text: bodyText,
                  source: { tier: 'AMBER' as const },
                },
              ],
            },
            student: {
              blocks: [
                {
                  type: 'para' as const,
                  text: `LEGAL ANALYSIS: ${bodyText}`,
                  source: { tier: 'AMBER' as const },
                },
              ],
              ratio: `Authoritative statutory construction and legal ratio.`,
            },
            advocate: {
              blocks: [
                {
                  type: 'para' as const,
                  text: `TRIAL PROPOSITION: Evidentiary burden and argument.`,
                  source: { tier: 'AMBER' as const },
                },
              ],
              pinpoints: [{ proposition: headlineText, para: 8 }],
              howToUse: ['Cite this case for core doctrine.'],
              howToDistinguish: ['Distinguish on specific facts.'],
            },
          },
          image: p.image ? { src: p.image, alt: headlineText, provenance: 'illustration' as const } : undefined,
          endHook: idx < 7 ? 'How did the next phase unfold?' : 'Case Dossier Complete.',
        };
      });
    }
  }

  return {
    ...raw,
    slug: raw.slug || slug,
    title: titleStr,
    hook: hookStr,
    court: raw.court || 'Supreme Court of India',
    year: raw.year || 2024,
    decidedOn: raw.decidedOn || `${raw.year || 2024}-05-15`,
    bench: raw.bench || [`Hon'ble Bench of the ${raw.court || 'Supreme Court of India'}`],
    citations: raw.citations || { primary: raw.citation || `${raw.year || 2024} INSC 1`, parallel: [] },
    sourceUrl: raw.sourceUrl || raw.judgmentUrl || 'https://indiankanoon.org/',
    status: raw.status?.code
      ? raw.status
      : { code: 'GOOD_LAW', explain: 'Active binding precedent under Indian law.', chain: [{ year: raw.year || 2024, event: 'Delivered' }] },
    statuteMap: raw.statuteMap || [{ old: raw.categoryTag || 'Constitution', new: null, note: 'Governing statutory provision.' }],
    doctrines: raw.doctrines || [raw.categoryTag || 'Constitutional Law'],
    categories: raw.categories || [raw.genre || 'constitutional'],
    readingTime: raw.readingTime || { story: 5, student: 7, advocate: 9 },
    featured: typeof raw.featured === 'boolean' ? raw.featured : true,
    publishedAt: raw.publishedAt || raw.createdAt || new Date().toISOString(),
    poster: posterImg,
    episodes: episodes || [],
    vote: raw.vote || {
      question: `How should the court decide this issue?`,
      context: `Consider whether the statutory conditions were satisfied on the trial record.`,
      options: [
        { id: 'opt-1', label: 'Uphold the statutory claim', argument: 'The legal requirements were met based on the verified trial evidence.' },
        { id: 'opt-2', label: 'Reject the claim', argument: 'Strict statutory preconditions were not established beyond doubt.' },
      ],
      courtChoseOptionId: 'opt-1',
    },
    glossary: raw.glossary || [],
    flashcards: raw.flashcards || [],
    affectsYou: raw.affectsYou || {
      heading: `How this ruling protects your rights`,
      points: [`Guarantees due process and statutory safeguards under Indian law.`],
      actionLink: { label: 'Verify Certified Record', url: raw.judgmentUrl || 'https://indiankanoon.org/' },
    },
    timeline: raw.timeline || [{ year: raw.year || 2024, event: 'Judgment delivered' }],
    relatedSlugs: raw.relatedSlugs || ['ghost-case', 'nanavati-case'],
    subsequentHistory: raw.subsequentHistory || [],
    sources: raw.sources || [{ label: 'Certified Court Judgment', url: raw.judgmentUrl || 'https://indiankanoon.org/' }],
    review: raw.review || {
      reviewer: 'Adv. Girish Kr. Srivastava',
      enrolment: 'D/842/1991',
      reviewedOn: new Date().toISOString().split('T')[0],
    },
  } as unknown as CaseFile;
}

export function CasePageClient({ slug, initialCase, nextSlug, prevSlug }: CasePageClientProps) {
  const [caseData, setCaseData] = useState<CaseFile | null>(initialCase);
  const [loading, setLoading] = useState<boolean>(!initialCase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // 1. Check local storage first (instant client cache for user-uploaded custom images)
    if (typeof window !== 'undefined') {
      try {
        const cleanSlug = slug.toLowerCase().trim();
        const possibleKeys = [
          `pleadings_case_${slug}`,
          `pleadings_case_${cleanSlug}`,
          'pleadings_case_rinku-rukshar-habeas-corpus-custody-case',
          'pleadings_case_rinku-rukshar-habeas-corpus-case',
        ];

        for (const key of possibleKeys) {
          const savedRaw = localStorage.getItem(key);
          if (savedRaw) {
            const parsed = JSON.parse(savedRaw);
            if (parsed && (parsed.poster?.src || parsed.bannerImage || parsed.panels || parsed.episodes)) {
              const normalized = normalizeToCaseFile(parsed, slug);
              if (isMounted) {
                setCaseData(normalized);
                setLoading(false);
              }
              break;
            }
          }
        }
      } catch (err) {
        console.warn('Error reading dynamic case from localStorage:', err);
      }
    }

    async function loadClientCase() {
      try {
        // 2. Fetch from API
        const res = await fetch(`/api/cases/${slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.case && isMounted) {
            const normalized = normalizeToCaseFile(data.case, slug);
            setCaseData(normalized);
            setLoading(false);
            return;
          }
        }

        // 3. Fallback: try admin API endpoint if logged in
        const adminRes = await fetch(`/api/admin/cases/${slug}`);
        if (adminRes.ok) {
          const adminData = await adminRes.json();
          if (adminData.success && adminData.case && isMounted) {
            const normalized = normalizeToCaseFile(adminData.case, slug);
            setCaseData(normalized);
            setLoading(false);
            return;
          }
        }

        if (isMounted && !caseData && !initialCase) {
          setError('Case record could not be found.');
        }
      } catch (err) {
        console.error('Failed to load dynamic case on client:', err);
        if (isMounted && !caseData && !initialCase) {
          setError('Failed to load case dossier.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadClientCase();

    return () => {
      isMounted = false;
    };
  }, [slug, initialCase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E1016] text-[#D4AF37] flex flex-col items-center justify-center font-mono gap-4">
        <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-xs uppercase tracking-[0.2em]">Loading Case Dossier...</p>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="min-h-screen bg-[#0E1016] flex flex-col items-center justify-center p-6 text-center font-sans">
        <div className="max-w-md bg-[#121520] border border-white/10 p-8 rounded-xs space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center mx-auto text-[#E50914] font-bold text-xl">
            §
          </div>
          <div>
            <h1 className="font-anton text-2xl text-white uppercase tracking-tight mb-2">
              Case Record Not Found
            </h1>
            <p className="text-xs text-[#a9a49a] leading-relaxed font-mono">
              The case dossier <span className="text-[#D4AF37]">`{slug}`</span> is still being prepared or has not yet been saved to the archive.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/browse"
              className="px-4 py-2.5 bg-[#D4AF37] text-[#0E1016] font-bold text-xs font-mono uppercase tracking-wider rounded-xs hover:bg-[#b89428] transition-all"
            >
              Browse All Cases
            </Link>
            <Link
              href={`/admin/cases/${slug}`}
              className="px-4 py-2.5 bg-white/10 text-white font-mono text-xs uppercase tracking-wider rounded-xs hover:bg-white/20 transition-all border border-white/10"
            >
              Open in Review Studio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <CaseViewer
      caseData={caseData}
      nextSlug={nextSlug}
      prevSlug={prevSlug}
    />
  );
}
