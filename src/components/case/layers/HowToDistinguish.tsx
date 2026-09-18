import React from 'react';

interface HowToDistinguishProps {
  distinctions?: string[];
  lang?: 'en' | 'hi';
}

export function HowToDistinguish({ distinctions, lang = 'en' }: HowToDistinguishProps) {
  if (!distinctions || distinctions.length === 0) return null;

  return (
    <div className="my-5 p-4 sm:p-5 bg-[#1C1614] border-l-4 border-amber-500 border-y border-r border-amber-500/20 rounded-r-xs shadow-md space-y-3 select-none">
      <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-950 px-2 py-0.5 rounded-2xs border border-amber-600/30">
          {lang === 'en' ? 'HOW OPPOSING COUNSEL WILL DISTINGUISH' : 'विरोधी पक्ष कैसे अंतर कर सकता है'}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] font-mono text-amber-200/80">
          {lang === 'en'
            ? 'Factual hooks and evidentiary thresholds used to resist this citation:'
            : 'इस दृष्टांत का विरोध करने के लिए उपयोग किए जाने वाले तथ्यात्मक बिंदु:'}
        </p>
        <ul className="space-y-1.5 text-xs text-[#E0DCD3] font-sans list-disc list-inside">
          {distinctions.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
