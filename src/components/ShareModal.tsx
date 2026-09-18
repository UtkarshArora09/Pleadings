'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';

export function ShareModal() {
  const { isShareOpen, closeShareModal, shareData, showToast, language } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  if (!isShareOpen || !shareData) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareData.url || window.location.href);
      setCopied(true);
      showToast(language === 'en' ? 'Link copied to clipboard!' : 'लिंक कॉपी हो गया!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyCitation = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(shareData.citation);
      showToast(language === 'en' ? 'Citation copied to clipboard!' : 'साइटेशन कॉपी हो गया!');
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`Check out this Indian court case on Pleadings: "${shareData.title}"\n${shareData.url || window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`Fascinating Indian legal story on Pleadings: "${shareData.title}"`);
    const url = encodeURIComponent(shareData.url || window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={closeShareModal}
    >
      <div
        className="w-full max-w-md bg-[#141722] border border-[#D4AF37]/30 p-6 shadow-2xl text-[#F3EFE6] rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
          <span className="text-[10px] font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
            {language === 'en' ? 'Share Legal Case Story' : 'केस शेयर करें'}
          </span>
          <button
            onClick={closeShareModal}
            className="text-white/60 hover:text-white text-sm cursor-pointer p-1"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <h3 className="font-anton text-xl text-white uppercase tracking-tight mb-2">
          {shareData.title}
        </h3>

        <p className="text-xs text-[#a9a49a] italic mb-6">
          {shareData.citation}
        </p>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>{copied ? (language === 'en' ? '✓ Copied!' : '✓ कॉपी हुआ!') : (language === 'en' ? 'Copy Link' : 'लिंक कॉपी')}</span>
          </button>

          <button
            onClick={handleCopyCitation}
            className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>{language === 'en' ? 'Copy Citation' : 'साइटेशन कॉपी'}</span>
          </button>

          <button
            onClick={handleWhatsAppShare}
            className="flex items-center justify-center gap-2 p-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleTwitterShare}
            className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2]/15 hover:bg-[#1DA1F2]/25 border border-[#1DA1F2]/40 text-[#1DA1F2] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
          >
            <span>Twitter / X</span>
          </button>
        </div>

        <button
          onClick={closeShareModal}
          className="w-full py-2.5 bg-[#D4AF37] hover:bg-white text-[#0E1016] font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
        >
          {language === 'en' ? 'Close' : 'बंद करें'}
        </button>
      </div>
    </div>
  );
}
