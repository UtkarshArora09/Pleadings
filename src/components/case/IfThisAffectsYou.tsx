import React from 'react';

interface IfThisAffectsYouProps {
  affectsYou?: {
    heading: string;
    points: string[];
    actionLink?: {
      label: string;
      url: string;
    };
  };
  lang?: 'en' | 'hi';
}

export function IfThisAffectsYou({ affectsYou, lang = 'en' }: IfThisAffectsYouProps) {
  if (!affectsYou) return null;

  return (
    <section className="my-10 p-5 sm:p-7 bg-[#131922] border border-emerald-500/30 rounded-xs shadow-xl space-y-4 select-none">
      <div className="flex items-center gap-2 pb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950 px-2.5 py-0.5 rounded-2xs border border-emerald-600/30">
          {lang === 'en' ? 'IF THIS AFFECTS YOU' : 'यदि आप पर यह लागू होता है'}
        </span>
      </div>

      <h3 className="font-anton text-xl sm:text-2xl text-white uppercase tracking-tight leading-snug">
        {affectsYou.heading}
      </h3>

      <ul className="space-y-2.5 text-xs sm:text-sm text-[#E0DCD3] font-sans">
        {affectsYou.points.map((point, idx) => (
          <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
            <span className="text-emerald-400 font-bold mt-0.5">✓</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {affectsYou.actionLink && (
        <div className="pt-3 border-t border-white/10">
          <a
            href={affectsYou.actionLink.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300 transition-colors uppercase tracking-wider"
          >
            <span>{affectsYou.actionLink.label}</span>
            <span>↗</span>
          </a>
        </div>
      )}
    </section>
  );
}
