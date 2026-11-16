'use client';

import React, { useState } from 'react';

interface DailyCaseSubscribeProps {
  caseSlug?: string;
  lang?: 'en' | 'hi';
  compact?: boolean;
}

export function DailyCaseSubscribe({
  caseSlug,
  lang = 'en',
  compact = false,
}: DailyCaseSubscribeProps) {
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [inputValue, setInputValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = inputValue.trim();
    if (!val) {
      setErrorMsg(
        channel === 'whatsapp'
          ? 'Please enter a valid WhatsApp phone number.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (channel === 'email' && !val.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (channel === 'whatsapp' && val.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // Attempt API dispatch
      try {
        await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contact: val,
            channel,
            caseSlug,
            frequency: 'daily-3min',
            timestamp: new Date().toISOString(),
          }),
        });
      } catch {
        // Fallback to local storage
      }

      try {
        const key = 'pleadings:daily_subscribers';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.push({ contact: val, channel, caseSlug, date: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(list));
      } catch {
        // ignore
      }

      setIsSuccess(true);
    } catch {
      setErrorMsg('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-[#D4AF37]/50 bg-gradient-to-br from-[#151926] via-[#10131E] to-[#151926] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white select-none ${
        compact ? 'my-4' : 'my-8 sm:my-10'
      }`}
    >
      {/* Decorative Gold Glow Accent */}
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      {/* Header Pill */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1.5 shadow-sm">
          <span>⚡</span>
          <span>{lang === 'en' ? 'FREE DAILY DISPATCH' : 'दैनिक 3 मिनट केस'}</span>
        </span>
        <span className="text-[10px] font-mono text-emerald-400">● 100% Free · 0 Spam</span>
      </div>

      {/* Title & Pitch */}
      <div className="space-y-1 mb-4">
        <h3 className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase">
          {lang === 'en'
            ? "Get Tomorrow's 3-Min Case Delivered Free"
            : 'कल का 3-मिनट कानूनी केस सीधे पाएं'}
        </h3>
        <p className="text-xs sm:text-sm text-[#c5c1b6] font-sans leading-relaxed">
          {lang === 'en'
            ? 'One landmark Indian court battle condensed into an episodic 3-minute story, delivered every morning directly to your WhatsApp or Inbox.'
            : 'हर सुबह एक ऐतिहासिक भारतीय अदालती फैसला 3 मिनट की रोचक कहानी के रूप में आपके व्हाट्सएप या इनबॉक्स पर।'}
        </p>
      </div>

      {/* Success State */}
      {isSuccess ? (
        <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xs text-xs sm:text-sm text-emerald-300 flex items-center gap-3 font-mono animate-fadeIn">
          <span className="text-xl">🎉</span>
          <div>
            <div className="font-bold uppercase tracking-wider">
              {lang === 'en' ? "You're all set!" : 'आप जुड़ चुके हैं!'}
            </div>
            <div className="text-[11px] text-emerald-300/80">
              {lang === 'en'
                ? `Tomorrow's 3-minute judgment will arrive on your ${channel} at 8:00 AM.`
                : `कल सुबह 8:00 बजे आपके ${channel} पर अगला केस पहुंचेगा।`}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Channel Selector Pills */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setChannel('whatsapp');
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                channel === 'whatsapp'
                  ? 'bg-[#25D366] text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              <span>💬</span>
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setChannel('email');
                setErrorMsg(null);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                channel === 'email'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              <span>✉️</span>
              <span>Email</span>
            </button>
          </div>

          {/* Input & Submit Row */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type={channel === 'email' ? 'email' : 'tel'}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder={
                  channel === 'whatsapp'
                    ? 'Enter WhatsApp number (e.g. 9876543210)'
                    : 'Enter your email address'
                }
                className="w-full px-4 py-2.5 bg-black/60 border border-white/20 focus:border-[#D4AF37] rounded-xs text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold font-mono text-xs uppercase tracking-widest rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 shrink-0"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Joining...</span>
                </>
              ) : (
                <>
                  <span>{lang === 'en' ? "Get Tomorrow's Case" : 'केस प्राप्त करें'}</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="text-[11px] font-mono text-red-400 flex items-center gap-1">
              <span>✕</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-[10px] font-mono text-white/40">
            {lang === 'en'
              ? 'Join 14,000+ lawyers, students, and citizens reading daily court stories. Instant 1-click unsubscribe.'
              : '14,000+ पाठक रोज पढ़ते हैं। कभी भी अनसब्सक्राइब करें।'}
          </p>
        </form>
      )}
    </div>
  );
}
