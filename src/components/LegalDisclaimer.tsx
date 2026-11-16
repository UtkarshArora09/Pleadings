'use client';

import React, { useState } from 'react';

interface LegalDisclaimerProps {
  lang?: 'en' | 'hi';
  variant?: 'banner' | 'footer' | 'pill';
  compactOnMobile?: boolean;
  className?: string;
}

export function LegalDisclaimer({
  lang = 'en',
  variant = 'banner',
  compactOnMobile = false,
  className = '',
}: LegalDisclaimerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  if (variant === 'pill') {
    return (
      <>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-[10px] font-mono text-[#D4AF37] hover:text-white bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 transition-all cursor-pointer select-none shrink-0 ${className}`}
          title="Read legal disclaimer"
        >
          <span>⚖️</span>
          {compactOnMobile ? (
            <>
              <span className="hidden md:inline">
                {lang === 'en' ? 'Educational Disclaimer: Not Legal Advice' : 'अस्वीकरण: विधिक सलाह नहीं'}
              </span>
              <span className="hidden xs:inline md:hidden">
                {lang === 'en' ? 'Disclaimer' : 'अस्वीकरण'}
              </span>
            </>
          ) : (
            <span>
              {lang === 'en' ? 'Educational Disclaimer: Not Legal Advice' : 'अस्वीकरण: विधिक सलाह नहीं'}
            </span>
          )}
        </button>

        {modalOpen && (
          <DisclaimerModal lang={lang} onClose={() => setModalOpen(false)} />
        )}
      </>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={`p-4 rounded-xs bg-[#0C0E14] border border-white/10 text-white/50 text-[11px] font-mono leading-relaxed space-y-1.5 ${className}`}>
        <div className="flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-wider text-[10px]">
          <span>⚖️</span>
          <span>{lang === 'en' ? 'LEGAL & EDITORIAL DISCLAIMER' : 'विधिक एवं संपादकीय अस्वीकरण'}</span>
        </div>
        <p>
          {lang === 'en'
            ? 'Content published on Pleadings is strictly for educational, historical, and storytelling purposes derived from certified public court records and official judicial registries. Pleadings does not provide legal advice, representation, or formal counsel. Reading these cases does not form an attorney-client relationship. If you are involved in an active dispute, please consult an enrolled advocate or qualified legal practitioner.'
            : 'Pleadings पर प्रकाशित सामग्री केवल शैक्षिक, ऐतिहासिक एवं कथात्मक उद्देश्यों हेतु आधिकारिक अदालती रिकॉर्ड्स पर आधारित है। यह कानूनी सलाह या प्रतिनिधित्व नहीं है। किसी भी कानूनी विवाद के समाधान के लिए योग्य अधिवक्ता से संपर्क करें।'}
        </p>
      </div>
    );
  }

  // Default: banner style
  return (
    <>
      <div className={`p-3.5 sm:p-4 rounded-xs bg-[#121520] border border-[#D4AF37]/30 text-xs font-mono text-[#c5c1b8] flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
        <div className="flex items-start sm:items-center gap-2.5">
          <span className="text-base text-[#D4AF37] shrink-0 mt-0.5 sm:mt-0">⚖️</span>
          <div>
            <strong className="text-white uppercase tracking-wider text-[10px] sm:text-[11px] block sm:inline mr-2">
              {lang === 'en' ? 'Educational Storytelling Precedent:' : 'शैक्षिक अदालती वृत्तांत:'}
            </strong>
            <span className="text-[11px] text-[#a9a49a]">
              {lang === 'en'
                ? 'Based on certified public court records. Does not constitute legal advice.'
                : 'सार्वजनिक न्यायिक फैसलों पर आधारित। यह कानूनी सलाह नहीं है।'}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="text-[10px] text-[#D4AF37] hover:text-white uppercase tracking-wider underline cursor-pointer shrink-0 self-start sm:self-auto font-bold"
        >
          {lang === 'en' ? 'Read Full Disclaimer' : 'पूर्ण अस्वीकरण पढ़ें'}
        </button>
      </div>

      {modalOpen && (
        <DisclaimerModal lang={lang} onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}

function DisclaimerModal({ lang, onClose }: { lang: 'en' | 'hi'; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md animate-fadeIn select-text p-3 sm:p-6 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg max-h-[90vh] flex flex-col bg-[#12151E] border border-[#D4AF37]/50 rounded-sm shadow-2xl p-5 sm:p-7 text-white my-auto overflow-hidden">
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#D4AF37] to-[#E50914]" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚖️</span>
            <h3 className="font-anton text-xl text-white uppercase tracking-wide">
              {lang === 'en' ? 'Legal Notice & Disclaimer' : 'कानूनी अस्वीकरण'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white text-lg font-mono p-1 cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Points (1, 2, 3, 4 clearly visible) */}
        <div className="space-y-3 py-3 text-xs sm:text-sm text-[#d4cfc5] font-sans leading-relaxed overflow-y-auto pr-2 flex-1 scrollbar-thin scrollbar-thumb-white/20">
          <div className="p-2.5 rounded-2xs bg-white/5 border border-white/5">
            <p className="font-bold text-[#D4AF37] text-xs uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Point 1 · Educational & Storytelling Media' : 'बिंदु 1 · शैक्षिक एवं कथात्मक माध्यम'}
            </p>
            <p>
              {lang === 'en'
                ? 'Pleadings is a digital legal journalism and storytelling platform dedicated to making closed, certified Indian judicial precedents transparent and accessible to citizens, students, and practitioners.'
                : 'Pleadings एक कानूनी पत्रकारिता और शैक्षिक मंच है जो भारतीय अदालती फैसलों को सरल भाषा में प्रस्तुत करता है।'}
            </p>
          </div>

          <div className="p-2.5 rounded-2xs bg-white/5 border border-white/5">
            <p className="font-bold text-[#D4AF37] text-xs uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Point 2 · No Legal Advice or Representation' : 'बिंदु 2 · विधिक सलाह या प्रतिनिधित्व नहीं'}
            </p>
            <p>
              {lang === 'en'
                ? 'Nothing on this website constitutes legal advice, formal consultation, or representation. The information is provided solely for educational, historical, and public interest purposes.'
                : 'विधिक सलाह नहीं: इस वेबसाइट की कोई भी सामग्री कानूनी सलाह या प्रतिनिधित्व नहीं है। यह केवल शैक्षिक और सामान्य जानकारी के लिए है।'}
            </p>
          </div>

          <div className="p-2.5 rounded-2xs bg-white/5 border border-white/5">
            <p className="font-bold text-[#D4AF37] text-xs uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Point 3 · Certified Public Court Records' : 'बिंदु 3 · सार्वजनिक अदालती रिकॉर्ड'}
            </p>
            <p>
              {lang === 'en'
                ? 'Case narratives, quotations, and statutory mappings are drawn directly from publicly published records of the Supreme Court of India, High Courts, and district consumer forums.'
                : 'सार्वजनिक रिकॉर्ड: सभी मामले सुप्रीम कोर्ट और हाई कोर्ट के आधिकारिक रिकॉर्ड्स से संकलित किए गए हैं।'}
            </p>
          </div>

          <div className="p-2.5 rounded-2xs bg-white/5 border border-white/5">
            <p className="font-bold text-[#D4AF37] text-xs uppercase tracking-wider mb-1">
              {lang === 'en' ? 'Point 4 · Professional Legal Counsel' : 'बिंदु 4 · पेशेवर विधिक परामर्श'}
            </p>
            <p>
              {lang === 'en'
                ? 'If you require legal assistance for an active dispute, bail application, or litigation, please consult an advocate enrolled with the Bar Council of India or reach out to the National Legal Services Authority (NALSA).'
                : 'किसी भी कानूनी विवाद के लिए बार काउंसिल ऑफ इंडिया में पंजीकृत अधिवक्ता या विधिक सेवा प्राधिकरण (NALSA) से संपर्क करें।'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/10 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#D4AF37] text-black font-bold font-mono text-xs uppercase tracking-wider rounded-xs hover:bg-white transition-all cursor-pointer shadow-md"
          >
            {lang === 'en' ? 'Understood' : 'स्वीकार है'}
          </button>
        </div>
      </div>
    </div>
  );
}
