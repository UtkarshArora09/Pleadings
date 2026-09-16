import React from 'react';

interface DissentPanelProps {
  dissent?: {
    judge: string;
    ground: string;
    text: string;
  };
  lang?: 'en' | 'hi';
}

export function DissentPanel({ dissent, lang = 'en' }: DissentPanelProps) {
  if (!dissent) return null;

  return (
    <div className="my-5 p-4 sm:p-5 bg-[#1C1418] border-l-4 border-rose-500 border-y border-r border-rose-500/20 rounded-r-xs shadow-lg space-y-3 select-none">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-rose-500/20">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-400 bg-rose-950/80 px-2.5 py-0.5 rounded-2xs border border-rose-600/30">
          {lang === 'en' ? 'MINORITY DISSENT' : 'अल्पमत असहमति'}
        </span>
        <span className="text-xs font-mono font-bold text-white/90">
          {dissent.judge}
        </span>
      </div>

      <div>
        <div className="text-[11px] font-mono uppercase text-rose-300 font-bold mb-1">
          {lang === 'en' ? 'Core Ground of Dissent:' : 'असहमति का मुख्य आधार:'} {dissent.ground}
        </div>
        <p className="text-xs sm:text-sm font-serif italic text-white/90 leading-relaxed">
          "{dissent.text}"
        </p>
      </div>

      <div className="text-[10px] font-mono text-white/50 pt-1 border-t border-rose-500/10">
        {lang === 'en'
          ? 'Historical Note: Dissents often form the constitutional basis of future overrulings and parliamentary reforms.'
          : 'ऐतिहासिक महत्व: असहमति के विचार अक्सर भविष्य के नए कानूनों और संशोधनों का आधार बनते हैं।'}
      </div>
    </div>
  );
}
