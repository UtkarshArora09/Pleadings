'use client';

import React, { useState } from 'react';

interface ReportErrorButtonProps {
  caseSlug: string;
  episodeNumber?: number;
  className?: string;
}

export function ReportErrorButton({
  caseSlug,
  episodeNumber,
  className = ''
}: ReportErrorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/report-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: caseSlug,
          episode: episodeNumber,
          description,
          reporterEmail
        })
      });

      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setTimeout(() => {
          setIsOpen(false);
          setSubmitted(false);
          setDescription('');
        }, 2000);
      } else {
        setErrorMsg(data.error || 'Failed to submit report.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`inline-flex items-center gap-1.5 text-[11px] font-mono text-white/50 hover:text-[#D4AF37] border-b border-dotted border-white/20 hover:border-[#D4AF37] pb-0.5 transition-all cursor-pointer ${className}`}
      >
        <span className="text-[#D4AF37] font-bold">!</span>
        <span>Report an error in this record</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs cursor-pointer"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          <div
            className="relative z-10 w-full max-w-md bg-[#12141C] text-[#F3EFE6] border border-[#D4AF37]/40 rounded-xl p-5 sm:p-6 shadow-2xl animate-scaleUp"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
                EDITORIAL CORRECTION & VERIFICATION
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-6 text-center space-y-2 text-emerald-400">
                <div className="text-3xl">✓</div>
                <div className="font-bold text-sm">Correction Logged</div>
                <p className="text-xs text-white/70">
                  Our reviewing advocate will verify against the original/officially published judgment and update the corrections log.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-[#E0DCD3] leading-relaxed">
                  Notice a typo, a statute discrepancy, or a misattributed holding in <strong>{caseSlug}</strong>
                  {episodeNumber ? ` (Episode ${episodeNumber})` : ''}? Let us know.
                </p>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/70 mb-1">
                    What is incorrect?
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Paragraph ¶14 quotes Section 300 Exception 2 instead of Exception 1..."
                    className="w-full bg-black/40 border border-white/20 rounded-xs p-2.5 text-xs text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/70 mb-1">
                    Your Email (Optional, for attribution)
                  </label>
                  <input
                    type="email"
                    value={reporterEmail}
                    onChange={(e) => setReporterEmail(e.target.value)}
                    placeholder="advocate@example.com"
                    className="w-full bg-black/40 border border-white/20 rounded-xs p-2 text-xs text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden"
                  />
                </div>

                {errorMsg && (
                  <div className="text-xs text-rose-400 bg-rose-950/40 p-2 rounded-xs border border-rose-500/30">
                    {errorMsg}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1.5 text-xs text-white/70 hover:text-white rounded-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs uppercase tracking-wider rounded-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
