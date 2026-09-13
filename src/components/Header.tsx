'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { LanguageToggle } from './LanguageToggle';
import { useApp } from '@/context/AppContext';

export function Header() {
  const { language, bookmarkedSlugs } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-3.5 flex items-center justify-between transition-all"
      style={{
        background:
          'linear-gradient(to bottom, rgba(14,16,22,0.98) 0%, rgba(14,16,22,0.85) 75%, transparent 100%)',
        borderBottom: '1px solid rgba(243,239,230,0.06)',
      }}
    >
      {/* Brand Logo & Desktop Nav */}
      <div className="flex items-center gap-8">
        <Logo size="medium" />

        <nav className="hidden lg:flex items-center gap-6 text-[11px] tracking-widest uppercase font-semibold">
          <Link
            href="/browse"
            className="text-[#a9a49a] hover:text-[#D4AF37] transition-colors"
          >
            {language === 'en' ? 'Browse Cases' : 'मामले खोजें'}
          </Link>

          <Link
            href="/glossary"
            className="text-[#a9a49a] hover:text-[#D4AF37] transition-colors"
          >
            {language === 'en' ? 'Legal Glossary' : 'शब्दावली'}
          </Link>

          <Link
            href="/browse?tab=saved"
            className="text-[#a9a49a] hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
          >
            <span>{language === 'en' ? 'Saved' : 'सहेजे गए'}</span>
            {bookmarkedSlugs.length > 0 && (
              <span className="bg-[#D4AF37] text-[#0E1016] text-[9px] px-1.5 py-0.2 rounded-full font-bold">
                {bookmarkedSlugs.length}
              </span>
            )}
          </Link>
        </nav>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        <span
          className="hidden md:inline-block text-[10px] tracking-wider text-[#a9a49a]/70 uppercase pr-4 border-r border-white/10"
        >
          {language === 'en'
            ? 'Courtroom Stories · Verified Judgments'
            : 'अदालती कहानियां · सत्यापित फैसले'}
        </span>

        <LanguageToggle />

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-[#F3EFE6] hover:text-[#D4AF37] text-lg focus:outline-none cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[58px] bg-[#0E1016]/98 border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden shadow-2xl animate-fadeIn backdrop-blur-md">
          <Link
            href="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold tracking-wider uppercase text-[#F3EFE6] hover:text-[#D4AF37] py-2 border-b border-white/5"
          >
            {language === 'en' ? 'Browse by Section & Genre' : 'धाराओं और श्रेणियों के अनुसार खोजें'}
          </Link>

          <Link
            href="/glossary"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold tracking-wider uppercase text-[#F3EFE6] hover:text-[#D4AF37] py-2 border-b border-white/5"
          >
            {language === 'en' ? 'Legal Terms & Doctrines Glossary' : 'कानूनी शब्दावली और सिद्धांत'}
          </Link>

          <Link
            href="/browse?tab=saved"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold tracking-wider uppercase text-[#F3EFE6] hover:text-[#D4AF37] py-2 flex items-center justify-between"
          >
            <span>{language === 'en' ? 'My Saved Cases' : 'मेरे सहेजे गए मामले'}</span>
            {bookmarkedSlugs.length > 0 && (
              <span className="bg-[#D4AF37] text-[#0E1016] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {bookmarkedSlugs.length}
              </span>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}
