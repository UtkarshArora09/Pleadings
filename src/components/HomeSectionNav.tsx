'use client';

import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'section-hero', label: 'HERO BILLBOARD' },
  { id: 'section-top10', label: 'TOP 10 LANDMARKS' },
  { id: 'section-essential', label: 'ESSENTIAL PRECEDENTS' },
  { id: 'section-toolkit', label: 'ADVOCATE TOOLKIT' },
  { id: 'section-footer', label: 'LIBRARY FOOTER' },
];

export function HomeSectionNav() {
  const [activeSection, setActiveSection] = useState<string>('section-hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Section Navigation"
      className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-2.5 pointer-events-auto"
    >
      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollTo(sec.id)}
            className="p-1 focus:outline-none cursor-pointer"
            aria-label={sec.label}
          >
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? 'w-1.5 h-4 bg-white/80'
                  : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
