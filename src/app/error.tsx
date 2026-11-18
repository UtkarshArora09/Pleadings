'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Route boundary caught an unexpected error:', error?.digest || 'unknown');
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full bg-[#121520] border border-[#D4AF37]/30 rounded-xs p-8 text-center space-y-5 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center mx-auto text-[#E50914] font-mono font-bold text-xl">
          §
        </div>
        <div className="space-y-2">
          <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37]">
            TEMPORARY COURTROOM INTERRUPTION
          </p>
          <h1 className="font-anton text-2xl sm:text-3xl text-white uppercase tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-[#a9a49a] leading-relaxed">
            We encountered an unexpected issue loading this legal record. Your saved cases are intact.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xs transition-colors cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xs border border-white/15 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}
