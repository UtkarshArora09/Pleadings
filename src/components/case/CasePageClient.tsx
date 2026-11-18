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

export function CasePageClient({ slug, initialCase, nextSlug, prevSlug }: CasePageClientProps) {
  const [caseData, setCaseData] = useState<CaseFile | null>(initialCase);
  const [loading, setLoading] = useState<boolean>(!initialCase);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCaseData(initialCase);
    setLoading(!initialCase);
    setError(null);
  }, [initialCase]);

  useEffect(() => {
    let isMounted = true;

    // Record real view on case load (server-deduplicated atomic counter)
    try {
      const cleanSlug = decodeURIComponent(slug).trim();
      fetch(`/api/cases/${encodeURIComponent(cleanSlug)}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success) {
            const viewsCount = typeof data.views === 'number' ? data.views : undefined;
            if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
              try {
                const bc = new BroadcastChannel('pleadings_case_events');
                bc.postMessage({ type: 'CASE_VIEW', slug: cleanSlug, views: viewsCount, time: Date.now() });
                bc.close();
              } catch {
                // ignore BroadcastChannel failures
              }
            }
            try {
              localStorage.setItem(
                'pleadings_last_view_event',
                JSON.stringify({ slug: cleanSlug, views: viewsCount, time: Date.now() })
              );
            } catch {
              // ignore storage failures
            }
          }
        })
        .catch(() => {});
    } catch {
      // ignore invalid slug URI
    }

    // Avoid redundant network roundtrip when SSR already delivered `initialCase` (BUG-007)
    if (initialCase) {
      return () => {
        isMounted = false;
      };
    }

    async function loadPublicCase() {
      try {
        const res = await fetch(`/api/cases/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.case && isMounted) {
            setCaseData(data.case as CaseFile);
            setLoading(false);
            return;
          }
        }

        if (isMounted) {
          setError('Case record could not be found.');
        }
      } catch {
        if (isMounted) {
          setError('Failed to load case dossier.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPublicCase();

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
              The requested case dossier is not available in the published Pleadings archive.
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
              href="/"
              className="px-4 py-2.5 bg-white/10 text-white font-mono text-xs uppercase tracking-wider rounded-xs hover:bg-white/20 transition-all border border-white/10"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CaseViewer caseData={caseData} nextSlug={nextSlug} prevSlug={prevSlug} />;
}
