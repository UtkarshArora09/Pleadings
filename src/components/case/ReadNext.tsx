import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { StatusBadge } from './StatusBadge';
import { getCaseBySlug } from '@/lib/cases';

interface ReadNextProps {
  relatedSlugs: string[];
  lang?: 'en' | 'hi';
}

export function ReadNext({ relatedSlugs, lang = 'en' }: ReadNextProps) {
  if (!relatedSlugs || relatedSlugs.length === 0) return null;

  const cases = relatedSlugs
    .map((slug) => getCaseBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .slice(0, 2);

  if (cases.length === 0) return null;

  return (
    <section className="my-10 space-y-4 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
          📚 {lang === 'en' ? 'READ NEXT · RELATED BY DOCTRINE' : 'आगे पढ़ें · संबंधित दृष्टांत'}
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cases.map((c) => {
          const displayTitle = lang === 'hi' && c.hi ? c.hi.title : c.title;
          const displayHook = lang === 'hi' && c.hi ? c.hi.hook : c.hook;

          return (
            <Link
              key={c.slug}
              href={`/case/${c.slug}`}
              className="p-4 bg-[#141824] hover:bg-[#1a2030] border border-white/10 hover:border-[#D4AF37] rounded-xs transition-all shadow-lg flex gap-4 group cursor-pointer"
            >
              <div className="relative w-20 h-28 flex-shrink-0 rounded-2xs overflow-hidden border border-white/15 bg-black">
                <Image
                  src={c.poster.src}
                  alt={c.poster.alt}
                  fill
                  sizes="80px"
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <StatusBadge status={c.status} size="sm" interactive={false} />
                    <span className="text-[10px] font-mono text-white/50">
                      {c.court} · {c.year}
                    </span>
                  </div>

                  <h4 className="font-serif font-bold text-sm text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {displayTitle}
                  </h4>

                  <p className="text-[11px] text-[#a9a49a] line-clamp-2 font-sans">
                    {displayHook}
                  </p>
                </div>

                <div className="text-[10px] font-mono text-[#D4AF37] font-bold pt-2">
                  {lang === 'en' ? 'Read Case →' : 'केस पढ़ें →'}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
