import React from 'react';

interface ExamAngleProps {
  examAngle?: string;
  lang?: 'en' | 'hi';
}

export function ExamAngle({ examAngle, lang = 'en' }: ExamAngleProps) {
  if (!examAngle) return null;

  return (
    <div className="my-4 p-4 bg-[#141A28] border border-sky-500/30 rounded-xs space-y-2 select-none shadow-md">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-sky-300 bg-sky-950 px-2 py-0.5 rounded-2xs border border-sky-600/40">
          🎓 {lang === 'en' ? 'EXAM ANGLE (CLAT / JUDICIARY / AIBE)' : 'परीक्षा दृष्टिकोण (न्यायिक सेवा / AIBE)'}
        </span>
      </div>
      <p className="text-xs sm:text-sm text-sky-100/90 leading-relaxed font-sans">
        {examAngle}
      </p>
    </div>
  );
}
