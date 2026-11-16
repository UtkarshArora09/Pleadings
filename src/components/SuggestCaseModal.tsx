'use client';

import React, { useState } from 'react';

interface SuggestCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'hi';
}

export function SuggestCaseModal({ isOpen, onClose, lang = 'en' }: SuggestCaseModalProps) {
  const [caseName, setCaseName] = useState('');
  const [courtOrCity, setCourtOrCity] = useState('');
  const [year, setYear] = useState('');
  const [storySynopsis, setStorySynopsis] = useState('');
  const [contributorName, setContributorName] = useState('');
  const [contributorContact, setContributorContact] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseName.trim() || !storySynopsis.trim()) {
      setErrorMsg('Please tell us the case name or topic, and what happened.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      const res = await fetch('/api/suggest-case', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseName: caseName.trim(),
          courtOrCity: courtOrCity.trim(),
          year: year.trim(),
          storySynopsis: storySynopsis.trim(),
          contributorName: contributorName.trim(),
          contributorContact: contributorContact.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit case suggestion.');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setCaseName('');
        setCourtOrCity('');
        setYear('');
        setStorySynopsis('');
        setContributorName('');
        setContributorContact('');
        onClose();
      }, 2500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn select-text">
      <div className="relative w-full max-w-xl bg-[#12151E] border border-[#D4AF37]/40 rounded-sm shadow-2xl p-6 sm:p-8 text-white">
        {/* Top Gold Bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E50914] via-[#D4AF37] to-[#E50914]" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white text-lg font-mono p-1 cursor-pointer transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-6 space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30 text-[10px] font-mono font-bold uppercase tracking-widest rounded-2xs">
            <span>{lang === 'en' ? 'READER STORY ROOM' : 'केस सुझाव'}</span>
          </div>
          <h2 className="font-anton text-2xl sm:text-3xl text-white tracking-wide uppercase">
            {lang === 'en' ? 'Suggest a Courtroom Story' : 'किसी केस का सुझाव दें'}
          </h2>
          <p className="text-xs text-[#a9a49a] font-sans leading-relaxed">
            {lang === 'en'
              ? 'Know a famous local controversy, a bizarre consumer battle, or an unforgettable high court judgment from your city? Tell us about it, and our legal writers will turn it into a slide episode!'
              : 'क्या आपके शहर या हाई कोर्ट का कोई दिलचस्प, विचित्र या ऐतिहासिक फैसला है? हमें बताएं, हम उसे एक रोचक स्लाइड एपिसोड में बदलेंगे!'}
          </p>
        </div>

        {/* Success Message */}
        {isSuccess ? (
          <div className="p-6 bg-emerald-950/70 border border-emerald-500/50 rounded-xs text-center space-y-2 animate-fadeIn font-mono">
            <span className="text-2xl text-emerald-400 font-bold block">✓</span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              {lang === 'en' ? 'Suggestion Received!' : 'सुझाव प्राप्त हुआ!'}
            </h3>
            <p className="text-xs text-emerald-200/80">
              {lang === 'en'
                ? 'Our legal editorial desk will pull the court docket, verify the records, and adapt it into a Pleadings episode.'
                : 'हमारी कानूनी टीम रिकॉर्ड की जांच कर इसे जल्द ही एक एपिसोड में बदलेगी।'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
            {/* Case Name / Topic */}
            <div className="space-y-1">
              <label className="block text-white/80 uppercase font-bold tracking-wider">
                1. Case Name or Headline Topic <span className="text-[#E50914]">*</span>
              </label>
              <input
                type="text"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder="e.g. Cinema Hall Overcharging on Popcorn or State of UP v. XYZ"
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-xs text-white placeholder-white/30 focus:outline-none"
                required
              />
            </div>

            {/* Court / City & Year (2 Columns) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-white/80 uppercase font-bold tracking-wider">
                  2. Court / City / District
                </label>
                <input
                  type="text"
                  value={courtOrCity}
                  onChange={(e) => setCourtOrCity(e.target.value)}
                  placeholder="e.g. Delhi High Court / Consumer Forum"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-xs text-white placeholder-white/30 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-white/80 uppercase font-bold tracking-wider">
                  3. Year / Approximate Era
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2022 or 1990s"
                  className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-xs text-white placeholder-white/30 focus:outline-none"
                />
              </div>
            </div>

            {/* What Happened / Why It's Interesting */}
            <div className="space-y-1">
              <label className="block text-white/80 uppercase font-bold tracking-wider">
                4. What Happened? (The Conflict, The Twist, The Ruling) <span className="text-[#E50914]">*</span>
              </label>
              <textarea
                rows={4}
                value={storySynopsis}
                onChange={(e) => setStorySynopsis(e.target.value)}
                placeholder="Tell us what the fight was about, who the parties were, and what the court finally held..."
                className="w-full px-3.5 py-2.5 bg-black/60 border border-white/15 focus:border-[#D4AF37] rounded-xs text-white placeholder-white/30 focus:outline-none font-sans"
                required
              />
            </div>

            {/* Optional Contributor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1">
                <label className="block text-white/60 uppercase text-[10px]">
                  Your Name (Optional - for story attribution)
                </label>
                <input
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-[#D4AF37] rounded-xs text-white placeholder-white/30 focus:outline-none text-[11px]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-white/60 uppercase text-[10px]">
                  WhatsApp or Email (Optional)
                </label>
                <input
                  type="text"
                  value={contributorContact}
                  onChange={(e) => setContributorContact(e.target.value)}
                  placeholder="To notify when episode goes live"
                  className="w-full px-3.5 py-2 bg-black/60 border border-white/10 focus:border-[#D4AF37] rounded-xs text-white placeholder-white/30 focus:outline-none text-[11px]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="text-red-400 text-xs flex items-center gap-1.5">
                <span>✕</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-white/60 hover:text-white uppercase tracking-wider text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-wider text-xs rounded-xs transition-all cursor-pointer flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Case Suggestion</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
