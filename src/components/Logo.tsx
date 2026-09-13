'use client';

import React from 'react';
import Link from 'next/link';

export function MonogramP({ className = 'w-7 h-7' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Pleadings Logo Monogram"
    >
      {/* Vertical thick pillar / stem with rounded bottom */}
      <path
        d="M22 18 C22 13 26 9 31 9 H38 V92 C38 97 34 101 29 101 C25 101 22 97 22 92 V18 Z"
        fill="#F3EFE6"
      />
      {/* Bottom dot below stem */}
      <circle cx="30" cy="112" r="5" fill="#D4AF37" />
      {/* Folded paper document bowl */}
      <path
        d="M38 9 H72 L86 23 V76 C86 82 81 87 75 87 H38 V9 Z"
        fill="#F3EFE6"
      />
      {/* Folded dog-ear corner triangle cutout */}
      <path
        d="M72 9 L86 23 H72 V9 Z"
        fill="#0E1016"
      />
      <path
        d="M72 9 L86 23"
        stroke="#D4AF37"
        strokeWidth="2.5"
      />
    </svg>
  );
}

export function Logo({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  const textSize = size === 'small' ? 'text-lg' : size === 'large' ? 'text-3xl' : 'text-xl';
  const iconSize = size === 'small' ? 'w-6 h-7' : size === 'large' ? 'w-9 h-11' : 'w-7 h-9';

  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2.5 group focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-md p-1 transition-transform hover:scale-[1.02]"
    >
      <MonogramP className={`${iconSize} transition-transform group-hover:rotate-[-2deg]`} />
      <span
        className={`font-anton tracking-[0.14em] text-[#F3EFE6] group-hover:text-white uppercase ${textSize} select-none leading-none`}
        style={{ fontFamily: 'var(--font-anton), sans-serif' }}
      >
        PLEADINGS
      </span>
    </Link>
  );
}
