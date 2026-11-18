'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StatusBadge } from './StatusBadge';

interface ReadNextProps {
  relatedSlugs: string[];
  currentSlug?: string;
  lang?: 'en' | 'hi';
}

function ReadNextPoster({ src, alt }: { src: string; alt: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="relative w-20 h-28 flex-shrink-0 rounded-2xs overflow-hidden border border-white/15 bg-[#121520] flex flex-col items-center justify-center p-1 text-center">
        <span className="text-[#D4AF37] font-mono text-base font-bold">§</span>
      </div>
    );
  }

  return (
    <div className="relative w-20 h-28 flex-shrink-0 rounded-2xs overflow-hidden border border-white/15 bg-black">
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={typeof src === 'string' && (src.startsWith('data:') || src.startsWith('blob:') || src.startsWith('http'))}
        sizes="80px"
        onError={() => setHasError(true)}
        className="object-cover group-hover:scale-105 transition-transform"
      />
    </div>
  );
}

export function ReadNext({ relatedSlugs, currentSlug, lang = 'en' }: ReadNextProps) {
  const [cases, setCases] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch('/api/cases')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data?.success || !Array.isArray(data.cases)) return;
        const pool = data.cases.filter((c: any) => c.slug && c.slug !== currentSlug);

        // Prefer explicitly listed relatedSlugs first, then backfill from other published cases
        const matched: any[] = [];
        const usedSlugs = new Set<string>();

        if (Array.isArray(relatedSlugs)) {
          for (const rel of relatedSlugs) {
            const found = pool.find((c: any) => c.slug === rel);
            if (found && !usedSlugs.has(found.slug)) {
              matched.push(found);
              usedSlugs.add(found.slug);
            }
          }
        }

        for (const c of pool) {
          if (matched.length >= 2) break;
          if (!usedSlugs.has(c.slug)) {
            matched.push(c);
            usedSlugs.add(c.slug);
          }
        }

        setCases(matched.slice(0, 2));
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, [relatedSlugs, currentSlug]);

  if (cases.length === 0) return null;

  return (
    <section className="my-10 space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
          {lang === 'en' ? 'READ NEXT · RELATED BY DOCTRINE' : 'आगे पढ़ें · संबंधित दृष्टांत'}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cases.map((c) => {
          const rawTitle = lang === 'hi' && c.hi ? c.hi.title : c.title;
          const displayTitle =
            typeof rawTitle === 'string'
              ? rawTitle
              : rawTitle?.[lang] || rawTitle?.en || c.slug;
          const rawHook = lang === 'hi' && c.hi ? c.hi.hook : c.hook || c.blurb;
          const displayHook =
            typeof rawHook === 'string'
              ? rawHook
              : rawHook?.[lang] || rawHook?.en || '';
          const posterSrc = c.poster?.src || c.bannerImage || '';

          return (
            <Link
              key={c.slug}
              href={`/case/${c.slug}`}
              className="p-4 bg-[#141824] hover:bg-[#1a2030] border border-white/10 hover:border-[#D4AF37] rounded-xs transition-all shadow-lg flex gap-4 group cursor-pointer"
            >
              <ReadNextPoster src={posterSrc} alt={displayTitle} />

              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={c.status} size="sm" interactive={false} />
                    <span className="text-[10px] font-mono text-white/50">
                      {c.court} · {c.year}
                    </span>
                  </div>

                  <h4 className="font-anton text-base sm:text-lg text-white group-hover:text-[#D4AF37] uppercase tracking-tight transition-colors line-clamp-2">
                    {displayTitle}
                  </h4>

                  <p className="text-[11px] text-[#a9a49a] line-clamp-2 font-sans">
                    {displayHook}
                  </p>
                </div>

                <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-wider pt-2">
                  {lang === 'en' ? 'Read Story →' : 'पूरी कहानी पढ़ें →'}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
