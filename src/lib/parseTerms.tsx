import React from 'react';
import { GlossaryTermInline } from '@/components/GlossaryTerm';
import { StatuteRefInline } from '@/components/StatuteRef';

/**
 * Parses strings containing:
 * - {{term:slug|display}} -> <GlossaryTermInline slug="slug" display="display" />
 * - {{stat:IPC §302}} or {{stat:IPC §302|BNS §103}} -> <StatuteRefInline oldSec="IPC §302" newSec="BNS §103" />
 */
export function parseRichText(
  text: string,
  onOpenTerm?: (slug: string) => void,
  onOpenStatute?: (oldSec: string) => void
): React.ReactNode {
  if (!text) return null;

  // Regex matches {{term:...}} or {{stat:...}}
  const regex = /\{\{(term|stat):([^}]+)\}\}/g;
  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchStart = match.index;
    const matchEnd = regex.lastIndex;

    // Push preceding plain text
    if (matchStart > lastIndex) {
      elements.push(text.substring(lastIndex, matchStart));
    }

    const type = match[1];
    const payload = match[2];

    if (type === 'term') {
      const parts = payload.split('|');
      const slug = parts[0].trim();
      const display = parts[1] ? parts[1].trim() : slug;
      elements.push(
        <GlossaryTermInline
          key={`term-${matchStart}-${slug}`}
          slug={slug}
          display={display}
          onClick={() => onOpenTerm && onOpenTerm(slug)}
        />
      );
    } else if (type === 'stat') {
      const parts = payload.split('|');
      const oldSec = parts[0].trim();
      const newSec = parts[1] ? parts[1].trim() : undefined;
      elements.push(
        <StatuteRefInline
          key={`stat-${matchStart}-${oldSec}`}
          oldSec={oldSec}
          newSec={newSec}
          onClick={() => onOpenStatute && onOpenStatute(oldSec)}
        />
      );
    }

    lastIndex = matchEnd;
  }

  // Push remaining plain text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : text;
}
