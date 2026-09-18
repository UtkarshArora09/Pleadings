import React from 'react';

interface SubsequentItem {
  type: 'followed' | 'distinguished' | 'doubted' | 'overruled' | 'statute';
  case: string;
  year: number;
  note: string;
}

interface SubsequentHistoryProps {
  history: SubsequentItem[];
  lang?: 'en' | 'hi';
}

const typeStyles: Record<
  SubsequentItem['type'],
  { label: string; bg: string; text: string; border: string }
> = {
  followed: {
    label: 'FOLLOWED IN',
    bg: 'bg-emerald-950/80',
    text: 'text-emerald-300',
    border: 'border-emerald-500/40'
  },
  distinguished: {
    label: 'DISTINGUISHED IN',
    bg: 'bg-amber-950/80',
    text: 'text-amber-300',
    border: 'border-amber-500/40'
  },
  doubted: {
    label: 'DOUBTED IN',
    bg: 'bg-purple-950/80',
    text: 'text-purple-300',
    border: 'border-purple-500/40'
  },
  overruled: {
    label: 'OVERRULED BY',
    bg: 'bg-rose-950/80',
    text: 'text-rose-300',
    border: 'border-rose-500/40'
  },
  statute: {
    label: 'STATUTE MODIFIED',
    bg: 'bg-sky-950/80',
    text: 'text-sky-300',
    border: 'border-sky-500/40'
  }
};

export function SubsequentHistory({ history, lang = 'en' }: SubsequentHistoryProps) {
  if (!history || history.length === 0) return null;

  return (
    <div className="my-6 p-4 sm:p-5 bg-[#12141C] border border-white/15 rounded-xs space-y-3 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
          {lang === 'en' ? 'SUBSEQUENT JUDICIAL HISTORY' : 'उत्तरवर्ती न्यायिक इतिहास'}
        </span>
        <span className="text-[10px] font-mono text-white/50">
          {history.length} {lang === 'en' ? 'Direct Citations' : 'उल्लेख'}
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item, idx) => {
          const style = typeStyles[item.type] || typeStyles.followed;
          return (
            <div
              key={idx}
              className="p-3 bg-black/40 border border-white/5 rounded-xs space-y-1.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-2xs border ${style.bg} ${style.text} ${style.border}`}
                >
                  {style.label}
                </span>
                <span className="text-xs font-mono text-[#D4AF37] font-bold">
                  {item.year}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-semibold text-white font-sans">
                {item.case}
              </h4>
              <p className="text-xs text-white/75 font-sans leading-relaxed">
                {item.note}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
