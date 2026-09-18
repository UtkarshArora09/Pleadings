'use client';

import React, { useState } from 'react';

interface NewsletterCaptureProps {
  lang?: 'en' | 'hi';
}

export function NewsletterCapture({ lang = 'en' }: NewsletterCaptureProps) {
  const [contact, setContact] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email'>('whatsapp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setIsSubmitting(true);
    // Simulate capture
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      try {
        const saved = localStorage.getItem('pleadings:subscribers') || '[]';
        const list = JSON.parse(saved);
        list.push({ contact, channel, date: new Date().toISOString() });
        localStorage.setItem('pleadings:subscribers', JSON.stringify(list));
      } catch {
        // ignore
      }
    }, 600);
  };

  return (
    <section className="my-10 p-6 sm:p-8 bg-[#12141C] border border-[#D4AF37]/30 rounded-xs shadow-xl space-y-4 select-none">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37] px-2.5 py-0.5 bg-[#D4AF37]/15 rounded-2xs border border-[#D4AF37]/30">
          {lang === 'en' ? 'EVERY TUESDAY' : 'हर मंगलवार'}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
          {lang === 'en' ? 'One landmark case in your inbox every Tuesday.' : 'हर मंगलवार एक नया ऐतिहासिक केस प्राप्त करें।'}
        </h3>
        <p className="text-xs sm:text-sm text-[#a9a49a] font-sans">
          {lang === 'en'
            ? 'Join 14,000+ advocates, law students, and curious citizens reading certified Indian court stories.'
            : '14,000+ वकीलों और छात्रों के साथ जुड़ें और सीधे व्हाट्सएप या ईमेल पर पढ़ें।'}
        </p>
      </div>

      {submitted ? (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/40 rounded-xs text-xs sm:text-sm text-emerald-300 flex items-center gap-2 font-mono">
          <span>✓</span>
          <span>{lang === 'en' ? 'You are subscribed! Next case drops Tuesday morning.' : 'आप जुड़ चुके हैं! अगला केस मंगलवार सुबह पहुंचेगा।'}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`px-3 py-1 rounded-xs text-xs font-mono transition-colors cursor-pointer ${
                channel === 'whatsapp'
                  ? 'bg-[#25D366] text-black font-bold'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setChannel('email')}
              className={`px-3 py-1 rounded-xs text-xs font-mono transition-colors cursor-pointer ${
                channel === 'email'
                  ? 'bg-[#D4AF37] text-black font-bold'
                  : 'bg-white/5 text-white/60 border border-white/10'
              }`}
            >
              Email
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type={channel === 'whatsapp' ? 'tel' : 'email'}
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={channel === 'whatsapp' ? '+91 98765 43210 (WhatsApp Number)' : 'advocate@example.com'}
              className="flex-1 bg-black/40 border border-white/20 rounded-xs px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#c49f27] text-black font-bold text-xs uppercase font-mono tracking-wider rounded-xs transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Joining...' : 'Subscribe Free →'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
