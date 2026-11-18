import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';

export const metadata = {
  title: 'Page Not Found | Pleadings',
  description: 'The requested legal dossier or page could not be found in the Pleadings archive.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] flex flex-col font-sans">
      <Header />
      <div className="flex-1 flex items-center justify-center px-6 pt-24 pb-16">
        <div className="max-w-lg w-full bg-[#121520] border border-white/10 rounded-xs p-8 sm:p-10 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold text-2xl">
            404
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block">
              RECORD NOT IN ARCHIVE
            </span>
            <h1 className="font-anton text-3xl sm:text-4xl text-white uppercase tracking-tight">
              Case or Page Not Found
            </h1>
            <p className="text-xs sm:text-sm text-[#a9a49a] leading-relaxed">
              The judgment dossier or route you requested does not exist, has moved, or is not yet published.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/browse"
              className="px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold text-xs font-mono uppercase tracking-wider rounded-xs transition-colors"
            >
              Browse Landmark Cases
            </Link>
            <Link
              href="/"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider rounded-xs border border-white/15 transition-colors"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
