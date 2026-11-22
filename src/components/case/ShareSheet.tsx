'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useAccessibleModal } from '@/hooks/useAccessibleModal';

export interface ShareSheetProps {
  slug: string;
  caseTitle: string;
  court?: string;
  year?: number | string;
  citation?: string;
  posterSrc?: string;
  userVotedOptionId?: string;
  courtOptionId?: string;
  isOpen: boolean;
  onClose: () => void;
  lang?: 'en' | 'hi';
}

export function ShareSheet({
  slug,
  caseTitle,
  court,
  year,
  citation,
  posterSrc,
  isOpen,
  onClose,
  lang = 'en',
}: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const mounted = useAccessibleModal(isOpen, onClose);

  if (!isOpen || !mounted || typeof document === 'undefined') return null;

  const currentOrigin =
    typeof window !== 'undefined' ? window.location.origin : 'https://pleadings.in';
  const caseUrl = `${currentOrigin}/case/${slug}`;
  const shareImageUrl = `${currentOrigin}/api/share/${slug}`;

  const courtLabel = court || 'Supreme Court of India';
  const yearLabel = year ? String(year) : '';
  const metaLine = [courtLabel, yearLabel, citation].filter(Boolean).join(' · ');

  const whatsappMsg =
    lang === 'hi'
      ? `🏛️ Pleadings: "${caseTitle}" (${metaLine}) के ऐतिहासिक निर्णय को 8 चित्रों और कड़ियों में पढ़ें:\n${caseUrl}`
      : `🏛️ Pleadings: Read the landmark court judgment "${caseTitle}" (${metaLine}) in 8 visual episodes:\n${caseUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMsg)}`;
  const twitterText = `Explore "${caseTitle}" on @pleadings_in — landmark court jurisprudence in 8 visual episodes.`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(caseUrl)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(caseUrl)}`;

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: `${caseTitle} — Pleadings`,
          text: whatsappMsg,
          url: caseUrl,
        });
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(caseUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownloadStoryImage = async () => {
    try {
      const res = await fetch(shareImageUrl);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pleadings-${slug}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch {
      window.open(shareImageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const canNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-xs cursor-pointer transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        className="relative z-10 w-full max-w-md bg-[#121520] text-[#F3EFE6] border border-[#D4AF37]/50 rounded-2xl p-5 sm:p-6 shadow-2xl animate-slideUp sm:animate-scaleUp space-y-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-sheet-title"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span
              id="share-sheet-title"
              className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4AF37]"
            >
              {lang === 'hi' ? 'निर्णय साझा करें' : 'SHARE LANDMARK CASE'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share dialog"
            className="text-white/60 hover:text-white p-1 text-base rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Presentable Case Card Preview */}
        <div className="p-3.5 bg-[#181D2C] rounded-xl border border-white/10 flex gap-3.5 items-center">
          {posterSrc && (
            <div className="relative w-16 h-20 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black/50">
              <Image
                src={posterSrc}
                alt={caseTitle}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="text-[10px] font-mono text-[#D4AF37] uppercase font-bold tracking-wider truncate">
              {courtLabel} {yearLabel ? `· ${yearLabel}` : ''}
            </div>
            <h3 className="font-serif font-bold text-sm text-white line-clamp-2 leading-snug">
              {caseTitle}
            </h3>
            {citation && (
              <p className="text-[10px] font-mono text-white/50 truncate">
                {citation}
              </p>
            )}
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5">
          {canNativeShare && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg cursor-pointer hover:scale-[1.01]"
            >
              <span>📲</span>
              <span>{lang === 'hi' ? 'डिवाइस से साझा करें' : 'Share via Device (WhatsApp, AirDrop, etc.)'}</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2.5 w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba5a] text-black font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.01]"
          >
            <span>💬</span>
            <span>{lang === 'hi' ? 'व्हाट्सएप पर शेयर करें' : 'Share to WhatsApp'}</span>
          </a>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/15 transition-all cursor-pointer"
          >
            <span>{copied ? '✓' : '🔗'}</span>
            <span>
              {copied
                ? lang === 'hi'
                  ? 'लिंक कॉपी हो गया! ✓'
                  : 'Link Copied to Clipboard! ✓'
                : lang === 'hi'
                ? 'डायरेक्ट लिंक कॉपी करें'
                : 'Copy Direct Link'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleDownloadStoryImage}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-gradient-to-r from-[#833ab4]/80 via-[#fd1d1d]/80 to-[#fcb045]/80 hover:from-[#833ab4] hover:to-[#fcb045] text-white font-semibold text-[11px] uppercase tracking-wider rounded-xl transition-all shadow-xs cursor-pointer"
          >
            <span>📷</span>
            <span>{lang === 'hi' ? 'सोशल स्टोरी कार्ड डाउनलोड करें' : 'Download Social Story Card (1080×1350)'}</span>
          </button>

          {/* Social Row: X / Twitter & LinkedIn */}
          <div className="flex gap-2 pt-0.5">
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
    </div>,
    document.body
  );
}
