import React from 'react';

interface RatioObiterSplitProps {
  ratio?: string;
  obiter?: string[];
  lang?: 'en' | 'hi';
}

export function RatioObiterSplit({ ratio, obiter, lang = 'en' }: RatioObiterSplitProps) {
  if (!ratio && (!obiter || obiter.length === 0)) return null;

  return (
    <div className="my-5 grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
      {/* Ratio Decidendi */}
      {ratio && (
        <div className="p-4 sm:p-5 bg-[#171B26] border-2 border-[#D4AF37]/60 rounded-xs shadow-xl space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/15 rounded-2xs">
              RATIO DECIDENDI
            </span>
            <span className="text-[9px] font-mono text-white/50 uppercase">
              {lang === 'en' ? 'Binding Precedent' : 'बाध्यकारी विधिक आधार'}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-serif italic text-white/95 leading-relaxed">
            "{ratio}"
          </p>
          <div className="text-[10px] font-mono text-white/50 pt-1">
            {lang === 'en' ? 'Binding on all subordinate courts under Art. 141' : 'अनुच्छेद 141 के तहत सभी निचली अदालतों पर बाध्यकारी'}
          </div>
        </div>
      )}

      {/* Obiter Dicta */}
      {obiter && obiter.length > 0 && (
        <div className="p-4 sm:p-5 bg-[#141620] border border-white/15 rounded-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-400 px-2 py-0.5 bg-sky-950/60 rounded-2xs border border-sky-600/30">
              OBITER DICTA
            </span>
            <span className="text-[9px] font-mono text-white/50 uppercase">
              {lang === 'en' ? 'Persuasive Only' : 'प्रसंगवश टिप्पणियां'}
            </span>
          </div>
          <ul className="space-y-1.5 text-xs text-white/80 leading-relaxed list-disc list-inside">
            {obiter.map((item, idx) => (
              <li key={idx} className="font-sans">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
