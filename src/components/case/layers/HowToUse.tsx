import React from 'react';

interface HowToUseProps {
  propositions?: string[];
  pinpoints?: { proposition: string; para: number }[];
  lang?: 'en' | 'hi';
}

export function HowToUse({ propositions, pinpoints, lang = 'en' }: HowToUseProps) {
  if ((!propositions || propositions.length === 0) && (!pinpoints || pinpoints.length === 0)) return null;

  return (
    <div className="my-5 p-4 sm:p-5 bg-[#121A16] border-l-4 border-emerald-500 border-y border-r border-emerald-500/20 rounded-r-xs shadow-md space-y-3 select-none">
      <div className="flex items-center gap-2 pb-2 border-b border-emerald-500/20">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-2xs border border-emerald-600/30">
          📜 {lang === 'en' ? 'HOW TO CITE THIS PRECEDENT (FOR COUNSEL)' : 'दलीलों में कैसे उद्धृत करें'}
        </span>
      </div>

      {pinpoints && pinpoints.length > 0 && (
        <div className="space-y-2">
          <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            {lang === 'en' ? 'Paragraph Pinpoint Rules:' : 'अनुच्छेद पिनपॉइंट नियम:'}
          </div>
          <div className="space-y-1.5">
            {pinpoints.map((p, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-emerald-100/90 font-sans">
                <span className="font-mono font-bold text-[#D4AF37] px-1.5 py-0.2 bg-black/40 rounded-2xs border border-[#D4AF37]/30">
                  ¶{p.para}
                </span>
                <span>{p.proposition}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {propositions && propositions.length > 0 && (
        <ul className="space-y-1.5 text-xs text-emerald-100/90 font-sans list-disc list-inside">
          {propositions.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
