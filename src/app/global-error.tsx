'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0E1016] text-[#F3EFE6] flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full bg-[#121520] border border-[#D4AF37]/40 rounded-xs p-8 text-center space-y-5 shadow-2xl">
          <div className="text-2xl font-mono font-bold text-[#D4AF37]">§ PLEADINGS</div>
          <h1 className="text-2xl font-bold text-white uppercase">Unexpected Application Error</h1>
          <p className="text-xs text-[#a9a49a] leading-relaxed">
            An unrecoverable rendering error occurred. Please refresh or try again.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-[#D4AF37] text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xs cursor-pointer"
          >
            Reload Application
          </button>
        </div>
      </body>
    </html>
  );
}
