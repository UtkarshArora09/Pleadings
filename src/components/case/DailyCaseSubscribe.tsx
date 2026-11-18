'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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
  const [website, setWebsite] = useState(''); // honeypot
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

    if (channel === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
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

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: val,
          channel,
          caseSlug: caseSlug || 'general',
          frequency: 'daily-3min',
          website,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setErrorMsg(data?.error || 'Could not save your subscription right now. Please try again.');
        return;
      }

      setIsSuccess(true);
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-[#D4AF37]/50 bg-gradient-to-br from-[#151926] via-[#10131E] to-[#151926] p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-white ${
        compact ? 'my-4' : 'my-8 sm:my-10'
      }`}
    >
      <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-[#D4AF37]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />

      <div className="flex items-center gap-2 mb-2.5">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1.5 shadow-sm">
          <span>{lang === 'en' ? 'FREE DAILY DISPATCH' : 'दैनिक 3 मिनट केस'}</span>
        </span>
        <span className="text-[10px] font-mono text-emerald-400">● 100% Free · 0 Spam</span>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className="font-anton text-xl sm:text-2xl text-white tracking-wide uppercase">
          {lang === 'en'
            ? 'Join the 3-Min Landmark Case Dispatch'
            : '3-मिनट ऐतिहासिक कानूनी केस अपडेट से जुड़ें'}
        </h3>
        <p className="text-xs sm:text-sm text-[#c5c1b6] font-sans leading-relaxed">
          {lang === 'en'
            ? 'Receive curated landmark Indian court battles condensed into verified 3-minute courtroom stories on WhatsApp or Email.'
            : 'ऐतिहासिक भारतीय अदालती फैसले 3 मिनट की सत्यापित कहानी के रूप में अपने व्हाट्सएप या ईमेल पर पाएं।'}
        </p>
      </div>

      {isSuccess ? (
        <div
          role="status"
          className="p-4 bg-emerald-950/80 border border-emerald-500/50 rounded-xs text-xs sm:text-sm text-emerald-300 flex items-center gap-3 font-mono animate-fadeIn"
        >
          <span className="text-lg font-bold">✓</span>
          <div>
            <div className="font-bold uppercase tracking-wider">
              {lang === 'en' ? 'Subscription Request Registered!' : 'आपका अनुरोध दर्ज हो गया!'}
            </div>
            <div className="text-[11px] text-emerald-300/80">
              {lang === 'en'
                ? `Your ${channel} contact has been privately added to our editorial dispatch list.`
                : `आपका ${channel} विवरण हमारी संपादकीय सूची में सुरक्षित दर्ज कर लिया गया है।`}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Honeypot field hidden from human readers */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="subscribe-website-hp">Website</label>
            <input
              id="subscribe-website-hp"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setChannel('whatsapp');
                setErrorMsg(null);
              }}
              aria-pressed={channel === 'whatsapp'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                channel === 'whatsapp'
                  ? 'bg-[#25D366] text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              <span>WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setChannel('email');
                setErrorMsg(null);
              }}
              aria-pressed={channel === 'email'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xs text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                channel === 'email'
                  ? 'bg-[#D4AF37] text-black shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/70 border border-white/10'
              }`}
            >
              <span>Email</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <label htmlFor={`daily-sub-input-${caseSlug || 'global'}`} className="sr-only">
                {channel === 'whatsapp' ? 'WhatsApp phone number' : 'Email address'}
              </label>
              <input
                id={`daily-sub-input-${caseSlug || 'global'}`}
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
                  <span>{lang === 'en' ? 'Join Case Dispatch' : 'जुड़ें'}</span>
                  <span>→</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div role="alert" className="text-[11px] font-mono text-red-400 flex items-center gap-1">
              <span>✕</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <p className="text-[10px] font-mono text-white/45">
            {lang === 'en' ? (
              <>
                Stored privately under our{' '}
                <Link href="/privacy" className="text-[#D4AF37] underline">
                  Privacy Policy
                </Link>
                . Opt out anytime by replying STOP.
              </>
            ) : (
              <>
                आपका विवरण हमारी{' '}
                <Link href="/privacy" className="text-[#D4AF37] underline">
                  गोपनीयता नीति
                </Link>{' '}
                के तहत सुरक्षित रहता है। कभी भी STOP लिखकर बाहर निकलें।
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
