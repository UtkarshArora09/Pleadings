'use client';

import React from 'react';
import Link from 'next/link';

/**
 * Classical Architectural Pillar "P" Monogram
 * As requested: Classical Column stem with crimson red top accent bar, crisp white body.
 */
export function MonogramP({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 90 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pleadings Monogram P"
    >
      {/* 1. Top Crimson Red Accent Bar */}
      <rect x="6" y="8" width="36" height="4.5" rx="1" fill="#E50914" />

      {/* 2. Top Capital Molding */}
      <rect x="9" y="12.5" width="30" height="3" rx="0.5" fill="#FFFFFF" />

      {/* 3. Pillar Shaft Base Body */}
      <rect x="13" y="15.5" width="22" height="63.5" fill="#FFFFFF" />

      {/* 4. Classical Fluting Grooves */}
      <line x1="17.5" y1="18.5" x2="17.5" y2="76" stroke="#0E1016" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="24" y1="18.5" x2="24" y2="76" stroke="#0E1016" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="30.5" y1="18.5" x2="30.5" y2="76" stroke="#0E1016" strokeWidth="1.8" strokeLinecap="round" />

      {/* 5. Lower Base Plinth */}
      <rect x="9" y="79" width="30" height="3" rx="0.5" fill="#FFFFFF" />
      <rect x="6" y="82" width="36" height="5" rx="1" fill="#FFFFFF" />

      {/* 6. Serif Bowl of P */}
      <path
        d="M35 12.5 C 56 12.5, 78 22, 78 43 C 78 63, 58 69.5, 35 69.5 V 59 C 50 59, 63 53.5, 63 43 C 63 32, 50 23, 35 23 Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Full "Pleadings" Brand Wordmark
 * First letter P with classical pillar & red accent, followed by elegant serif "leadings".
 */
export function Logo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const iconSize = size === 'small' ? 'w-6 h-7' : size === 'large' ? 'w-9 h-10' : 'w-7 h-8';
  const textClass = size === 'small' ? 'text-xl' : size === 'large' ? 'text-3xl' : 'text-2xl';

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1 group focus:outline-none rounded-xs transition-transform hover:scale-[1.02]"
    >
      <div className="flex items-center">
        <MonogramP className={`${iconSize} flex-shrink-0 transition-transform group-hover:scale-105`} />
        <span
          className={`font-serif font-bold text-white tracking-tight -ml-1 ${textClass} select-none leading-none`}
          style={{ fontFamily: 'var(--font-serif, "Playfair Display", "Times New Roman", serif)' }}
        >
          leadings
        </span>
      </div>
    </Link>
  );
}
