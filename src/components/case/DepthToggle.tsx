'use client';

import React from 'react';

export type DepthLayer = 'story' | 'student' | 'advocate';

interface DepthToggleProps {
  currentDepth: DepthLayer;
  onChangeDepth: (depth: DepthLayer) => void;
  className?: string;
  lang?: 'en' | 'hi';
}

export function DepthToggle({
  currentDepth,
  onChangeDepth,
  className = '',
  lang = 'en'
}: DepthToggleProps) {
  const options: { id: DepthLayer; label: string; shortBadge?: string }[] = [
    {
      id: 'story',
      label: lang === 'en' ? 'Story' : 'कथा'
    },
    {
      id: 'student',
      label: lang === 'en' ? 'Student' : 'छात्र'
    },
    {
      id: 'advocate',
      label: lang === 'en' ? 'Advocate' : 'अधिवक्ता'
    }
  ];

  return (
    <div
      className={`inline-flex items-center p-1 bg-[#12141C]/90 backdrop-blur-md rounded-full border border-white/15 shadow-xl select-none ${className}`}
      role="tablist"
      aria-label="Content Depth Layer"
    >
      {options.map((opt) => {
        const isActive = currentDepth === opt.id;
        return (
          <button
            key={opt.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeDepth(opt.id)}
            className={`flex items-center justify-center px-3.5 py-1 sm:py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-[#D4AF37] text-black shadow-md'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
