'use client';

import React from 'react';
import { LawTerm } from '@/types';
import { GLOSSARY_TERMS, GlossaryTerm } from '@/data/glossary';
import { useApp } from '@/context/AppContext';

interface RichTextProps {
  content: string;
  terms?: LawTerm[];
  className?: string;
}

// Helper: map a GlossaryTerm to a LawTerm
function glossaryToLawTerm(gt: GlossaryTerm): LawTerm {
  return {
    id: gt.id,
    term: gt.term,
    code: gt.code,
    definition: gt.definition,
  };
}

// Pre-compiled keyword regex map at module level (computed once, zero render lag)
const KEYWORD_MAP: { patterns: string[]; glossaryId: string }[] = [
  {
    patterns: [
      'Ignorantia facti excusat',
      'mistake of fact',
      'honest mistake of fact',
      'तथ्य की भूल',
      'Section 79 IPC',
      'Section 79',
      'धारा 79 आईपीसी',
      'धारा 79',
      'due care and attention',
    ],
    glossaryId: 'mistake-of-fact',
  },
  {
    patterns: ['bona fide belief', 'bona fide', 'सद्भावपूर्वक', 'सच्चा विश्वास'],
    glossaryId: 'bona-fide',
  },
  {
    patterns: ['acquittal', 'दोषमुक्ति', 'बरी किया'],
    glossaryId: 'acquittal',
  },
  {
    patterns: [
      'grave and sudden provocation',
      'grave & sudden provocation',
      'गंभीर और अचानक प्रकोपन',
      'Section 300 IPC',
      'Section 300',
      'धारा 300 आईपीसी',
      'धारा 300',
    ],
    glossaryId: 'grave-sudden-provocation',
  },
  {
    patterns: ['deficiency in service', 'deficiency of service', 'सेवा में कमी'],
    glossaryId: 'deficiency-in-service',
  },
  {
    patterns: [
      'Section 66A IT Act',
      'Section 66A',
      'धारा 66A',
      'chilling effect',
      'vagueness doctrine',
    ],
    glossaryId: 'chilling-effect',
  },
  {
    patterns: [
      'absolute liability doctrine',
      'absolute liability',
      'पूर्ण दायित्व का सिद्धांत',
      'पूर्ण दायित्व',
      'enterprise liability',
    ],
    glossaryId: 'absolute-liability',
  },
  {
    patterns: [
      'Basic Structure Doctrine',
      'Basic Structure',
      'बुनियादी ढांचे',
      'मूल ढांचे',
      'Article 368',
    ],
    glossaryId: 'basic-structure-doctrine',
  },
  {
    patterns: [
      'Section 125 CrPC',
      'Section 125',
      'धारा 125 सीआरपीसी',
      'धारा 125',
    ],
    glossaryId: 'section-125-crpc',
  },
  {
    patterns: [
      'Vishaka Guidelines',
      'विशाखा गाइडलाइंस',
      'विशाखा दिशानिर्देश',
      'POSH Act',
      'Internal Complaints Committee',
    ],
    glossaryId: 'vishaka-guidelines',
  },
  {
    patterns: [
      'due process of law',
      'Due Process',
      'विधि की सम्यक प्रक्रिया',
      'Article 21',
      'अनुच्छेद 21',
    ],
    glossaryId: 'due-process-of-law',
  },
  {
    patterns: ['Golden Triangle', 'स्वर्ण त्रिकोण'],
    glossaryId: 'golden-triangle',
  },
  {
    patterns: ['constitutional morality', 'संवैधानिक नैतिकता'],
    glossaryId: 'constitutional-morality',
  },
  {
    patterns: ['Section 377 IPC', 'Section 377', 'धारा 377 आईपीसी', 'धारा 377'],
    glossaryId: 'section-377-ipc',
  },
  {
    patterns: ['Ratio Decidendi', 'विधिक सार'],
    glossaryId: 'ratio-decidendi',
  },
  {
    patterns: ['Mens Rea', 'मेन्स रिया'],
    glossaryId: 'mens-rea',
  },
  {
    patterns: ['Public Interest Litigation', 'PIL', 'जनहित याचिका'],
    glossaryId: 'public-interest-litigation',
  },
];

const STATIC_TERM_LIST: { regex: RegExp; termData: LawTerm }[] = [];
KEYWORD_MAP.forEach(({ patterns, glossaryId }) => {
  const gt = GLOSSARY_TERMS.find((t) => t.id === glossaryId);
  if (gt) {
    const lawTerm = glossaryToLawTerm(gt);
    patterns.forEach((pat) => {
      STATIC_TERM_LIST.push({
        regex: new RegExp(
          `\\b${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b|${pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
          'i'
        ),
        termData: lawTerm,
      });
    });
  }
});

export function RichText({ content, terms, className = '' }: RichTextProps) {
  const { openTermModal } = useApp();

  // Combine static terms with any custom terms passed directly
  const termDefinitions = React.useMemo(() => {
    if (!terms || terms.length === 0) {
      return STATIC_TERM_LIST;
    }
    const customList = terms.map((t) => ({
      regex: new RegExp(
        `\\b${t.term.en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b|${t.term.hi.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`,
        'i'
      ),
      termData: t,
    }));
    return [...STATIC_TERM_LIST, ...customList];
  }, [terms]);

  if (!content) return null;

  // Clean any literal \\n or \n string representations and normalize into clean paragraph blocks
  const normalizedContent = content
    .replace(/\\n\\n/g, '\n\n')
    .replace(/\\n/g, '\n');

  const paragraphs = normalizedContent.split(/\n\s*\n|\n/);

  return (
    <div className={`space-y-3.5 ${className}`}>
      {paragraphs.map((paraText, pIdx) => {
        if (!paraText.trim()) return null;

        // Parse **bold text** and legal terms inside each paragraph
        const boldSegments = paraText.split(/(\*\*[^*]+\*\*)/g);

        const renderedSegments = boldSegments.map((segment, segIdx) => {
          if (segment.startsWith('**') && segment.endsWith('**')) {
            const innerText = segment.slice(2, -2);
            return (
              <strong key={`bold-${pIdx}-${segIdx}`} className="font-bold text-[#F3EFE6]">
                {innerText}
              </strong>
            );
          }

          // Check for legal term patterns in normal text
          const termMatches: { start: number; end: number; matchText: string; termData: LawTerm }[] = [];

          termDefinitions.forEach(({ regex, termData }) => {
            let m: RegExpExecArray | null;
            const gRegex = new RegExp(regex.source, 'gi');
            while ((m = gRegex.exec(segment)) !== null) {
              const matchStart = m.index;
              const matchEnd = m.index + m[0].length;

              // Ensure no overlap with existing found terms
              const isOverlapping = termMatches.some(
                (t) => (matchStart >= t.start && matchStart < t.end) || (matchEnd > t.start && matchEnd <= t.end)
              );

              if (!isOverlapping) {
                termMatches.push({
                  start: matchStart,
                  end: matchEnd,
                  matchText: m[0],
                  termData,
                });
              }
            }
          });

          if (termMatches.length === 0) {
            return <React.Fragment key={`plain-${pIdx}-${segIdx}`}>{segment}</React.Fragment>;
          }

          // Sort matches by start index
          termMatches.sort((a, b) => a.start - b.start);

          const segmentNodes: React.ReactNode[] = [];
          let cursor = 0;

          termMatches.forEach((tm, matchIdx) => {
            if (tm.start > cursor) {
              segmentNodes.push(segment.substring(cursor, tm.start));
            }

            segmentNodes.push(
              <button
                key={`term-${pIdx}-${segIdx}-${matchIdx}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openTermModal(tm.termData);
                }}
                className="border-b-2 border-dashed border-[#D4AF37] hover:border-white text-[#D4AF37] hover:text-white font-semibold cursor-pointer pb-0.5 transition-all inline-block mx-0.5 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] rounded-xs"
                title={`Click to view legal meaning: ${tm.termData.term.en}`}
              >
                {tm.matchText}
              </button>
            );

            cursor = tm.end;
          });

          if (cursor < segment.length) {
            segmentNodes.push(segment.substring(cursor));
          }

          return <React.Fragment key={`frag-${pIdx}-${segIdx}`}>{segmentNodes}</React.Fragment>;
        });

        return (
          <p key={`p-${pIdx}`} className="leading-relaxed">
            {renderedSegments}
          </p>
        );
      })}
    </div>
  );
}
