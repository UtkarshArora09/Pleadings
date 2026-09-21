import React from 'react';

interface TimelineEvent {
  year: number;
  event: string;
}

interface WhatChangedSinceProps {
  timeline: TimelineEvent[];
  lang?: 'en' | 'hi';
}

export function WhatChangedSince({ timeline, lang = 'en' }: WhatChangedSinceProps) {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) return null;

  return (
    <section className="my-10 p-5 sm:p-7 bg-[#12141C] border border-white/10 rounded-xs shadow-xl space-y-5 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
          ⏳ {lang === 'en' ? 'WHAT CHANGED SINCE' : 'फैसले के बाद क्या बदला'}
        </span>
        <span className="text-[10px] font-mono text-white/50">
          {lang === 'en' ? 'Chronological Evolution' : 'कालक्रम'}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#D4AF37]/30">
        {timeline.map((item, idx) => (
          <div key={idx} className="relative group">
            <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#D4AF37] border-2 border-[#12141C] shadow-sm" />
            <div className="font-mono text-sm font-bold text-[#D4AF37]">
              {item.year}
            </div>
            <p className="text-xs sm:text-sm text-[#E0DCD3] leading-relaxed mt-1 font-sans">
              {item.event}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
