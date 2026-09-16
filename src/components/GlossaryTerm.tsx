'use client';

import React from 'react';

interface GlossaryTermInlineProps {
  slug: string;
  display: string;
  onClick?: () => void;
}

export function GlossaryTermInline({ slug, display, onClick }: GlossaryTermInlineProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline font-medium text-inherit border-b border-dotted border-[#D4AF37] hover:border-solid hover:text-[#D4AF37] transition-all cursor-pointer select-text px-0.5 bg-transparent"
      title={`View plain legal meaning of "${display}"`}
      data-term-slug={slug}
    >
      {display}
    </button>
  );
}
