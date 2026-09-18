'use client';

import React, { useState } from 'react';

interface ShareSheetProps {
  slug: string;
  caseTitle: string;
  userVotedOptionId?: string;
  courtOptionId?: string;
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'hi';
}

export function ShareSheet({
  slug,
  caseTitle,
  userVotedOptionId,
  courtOptionId,
  isOpen,
  onClose
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const didAgree = Boolean(userVotedOptionId && courtOptionId && userVotedOptionId === courtOptionId);
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://pleadings.in';
  const caseUrl = `${currentOrigin}/case/${slug}`;
  const shareImageUrl = `${currentOrigin}/api/share/${slug}?agree=${didAgree}&vote=${userVotedOptionId || 'voted'}`;

  // WhatsApp prefilled message
  const whatsappMsg = didAgree
    ? `I got this one right. Can you? ${caseTitle} on Pleadings: ${caseUrl}`
    : `I weighed the evidence differently from the court. How would you decide? ${caseTitle} on Pleadings: ${caseUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;

  // X / Twitter url
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(whatsappMsg)}`;

  // LinkedIn url
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(caseUrl)}`;

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(caseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadStoryImage = async () => {
    try {
      const res = await fetch(shareImageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pleadings-${slug}-verdict.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(shareImageUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-3 sm:p-4">
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xs cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative z-10 w-full max-w-md bg-[#12141C] text-[#F3EFE6] border border-[#D4AF37]/50 rounded-2xl p-6 shadow-2xl animate-slideUp sm:animate-scaleUp space-y-5"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            SHARE THE VERDICT CHALLENGE
          </span>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1 text-base cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Card Preview */}
        <div className="p-4 bg-[#181C28] rounded-xl border border-white/10 text-center space-y-1.5">
          <div className="text-[10px] font-mono uppercase text-[#D4AF37]">
            {didAgree ? '✓ YOU AGREED WITH THE BENCH' : 'YOU DISSENTED FROM THE BENCH'}
          </div>
          <h3 className="font-serif font-bold text-base text-white">
            {caseTitle}
          </h3>
          <p className="text-xs text-white/70">
            {didAgree
              ? 'Test if your friends can spot the legal ratio.'
              : 'See if your friends would have ruled like you or the judges.'}
          </p>
        </div>

        {/* Share Channels in order of prominence */}
        <div className="space-y-2.5">
          {/* 1. WHATSAPP (Largest) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer hover:scale-[1.02]"
          >
            <span>Share to WhatsApp</span>
          </a>

          {/* 2. INSTAGRAM STORY (Download image) */}
          <button
            onClick={handleDownloadStoryImage}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-90 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.01]"
          >
            <span>Download Instagram Story Card (1080×1350)</span>
          </button>

          {/* 3. COPY LINK */}
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all cursor-pointer"
          >
            <span>{copied ? 'Link Copied to Clipboard! ✓' : 'Copy Direct Link'}</span>
          </button>

          {/* 4. X / LINKEDIN (Smaller) */}
          <div className="flex gap-2 pt-1">
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg border border-white/10 text-[11px] font-mono transition-colors"
            >
              Post on X
            </a>
            <a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center py-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg border border-white/10 text-[11px] font-mono transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
