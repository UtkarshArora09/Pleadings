'use client';

import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';

export function Toast() {
  const { toastMessage, showToast } = useApp();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        showToast('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, showToast]);

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slideUp pointer-events-none">
      <div className="bg-[#171A24] text-[#F3EFE6] px-5 py-3 rounded-full border border-[#D4AF37]/50 shadow-2xl flex items-center gap-3 backdrop-blur-md">
        <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
        <span className="text-xs font-semibold tracking-wide uppercase font-sans">
          {toastMessage}
        </span>
      </div>
    </div>
  );
}
