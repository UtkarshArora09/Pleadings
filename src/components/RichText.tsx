'use client';

import React from 'react';
import { LawTerm } from '@/types';
import { GLOSSARY_TERMS } from '@/data/glossary';
import { useApp } from '@/context/AppContext';

interface RichTextProps {
  content: string;
  terms?: LawTerm[];
  className?: string;
}

export function RichText({ content, terms = [], className = '' }: RichTextProps) {
  const { openTermModal } = useApp();

  // Combine custom terms with global glossary terms for comprehensive legal recognition
  const allTermsMap = React.useMemo(() => {
    const map = new Map<string, LawTerm>();
    
    // Add glossary terms
    GLOSSARY_TERMS.forEach((gt) => {
      map.set(gt.id, {
        id: gt.id,
        term: gt.term,
        code: gt.code,
        definition: gt.definition,
      });
    });

    // Add case specific terms
    terms.forEach((t) => {
      map.set(t.id, t);
    });

    return map;
  }, [terms]);

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
      const termData = allTermsMap.get(termId);
      parts.push(
        <button
          key={`term-${match.index}`}
          onClick={(e) => {
            e.stopPropagation();
            if (termData) {
              openTermModal(termData);
            }
          }}
          className="border-b-2 border-dashed border-[#D4AF37] hover:border-white text-[#D4AF37] hover:text-white font-medium cursor-pointer pb-0.5 transition-all inline-block mx-0.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xs"
          title="Click to view legal meaning"
        >
          {termLabel}
        </button>
      );
    } else if (boldText) {
      // Check if bold text matches a known term by ID or name
      const matchingTerm = Array.from(allTermsMap.values()).find(
        (t) =>
          t.term.en.toLowerCase() === boldText.toLowerCase() ||
          t.term.hi === boldText ||
          boldText.toLowerCase().includes(t.id.replace(/-/g, ' '))
      );

      if (matchingTerm) {
        parts.push(
          <button
            key={`bold-term-${match.index}`}
            onClick={(e) => {
              e.stopPropagation();
              openTermModal(matchingTerm);
            }}
            className="border-b-2 border-dashed border-[#D4AF37] hover:border-white text-[#D4AF37] hover:text-white font-bold cursor-pointer pb-0.5 transition-all inline-block mx-0.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xs"
            title="Click to view legal meaning"
          >
            {boldText}
          </button>
        );
      } else {
        parts.push(
          <strong key={`bold-${match.index}`} className="font-bold text-[#F3EFE6]">
            {boldText}
          </strong>
        );
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
