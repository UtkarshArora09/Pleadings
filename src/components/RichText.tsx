'use client';

import React from 'react';
import { LawTerm } from '@/types';
import { useApp } from '@/context/AppContext';

interface RichTextProps {
  content: string;
  terms?: LawTerm[];
  className?: string;
}

export function RichText({ content, terms = [], className = '' }: RichTextProps) {
  const { openTermModal } = useApp();

  // Pattern matches [label](term:id) or **bold text**
  const regex = /\[([^\]]+)\]\(term:([^)]+)\)|\*\*([^*]+)\*\*/g;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index));
    }

    const termLabel = match[1];
    const termId = match[2];
    const boldText = match[3];

    if (termId && termLabel) {
      const termData = terms.find((t) => t.id === termId);
      parts.push(
        <button
          key={`term-${match.index}`}
          onClick={(e) => {
            e.stopPropagation();
            if (termData) {
              openTermModal(termData);
            }
          }}
          className="text-[#D4AF37] font-semibold underline decoration-dotted decoration-[#D4AF37]/80 underline-offset-4 hover:text-white transition-colors inline-flex items-center gap-1 cursor-pointer mx-0.5 px-0.5 rounded focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          title="Click to view legal definition"
        >
          {termLabel}
        </button>
      );
    } else if (boldText) {
      parts.push(
        <strong key={`bold-${match.index}`} className="font-bold text-[#F3EFE6]">
          {boldText}
        </strong>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
