import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'Privacy Policy & Data Protection Notice | Pleadings',
  description:
    'How Pleadings collects, protects, and manages contributor and reader information in alignment with India’s Digital Personal Data Protection (DPDP) Act, 2023.',
  alternates: {
    canonical: 'https://pleadings.in/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] font-sans">
      <Header />
      <div className="pt-28 pb-20 px-4 sm:px-6 md:px-12 max-w-4xl mx-auto space-y-10">
        <div className="space-y-3 border-b border-white/10 pb-8">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] block font-bold">
            DATA PROTECTION &amp; PRIVACY NOTICE
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[#a9a49a] leading-relaxed">
            Pleadings respects your privacy and handles personal data transparently in alignment with the Digital Personal Data Protection (DPDP) Act, 2023.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">1. Information You Choose to Provide</h2>
          <ul className="list-disc pl-5 text-sm text-[#E0DCD3] space-y-2 leading-relaxed">
            <li>
              <strong>Advocate Contributions:</strong> Name, Bar Council enrolment number, email address, and phone number submitted via <Link href="/contribute" className="text-[#D4AF37] underline">/contribute</Link> are used strictly to verify case submissions and provide editorial attribution.
            </li>
            <li>
              <strong>Case Suggestions &amp; Error Reports:</strong> Optional contact details are used solely to clarify legal citations or notify you when a correction/case is published.
            </li>
            <li>
              <strong>Daily Dispatch Opt-In:</strong> Email addresses or WhatsApp numbers submitted voluntarily are used only for legal story updates.
            </li>
            <li>
              <strong>Browser Storage:</strong> Saved bookmarks, language preferences (`EN`/`हिं`), and anonymous poll IDs are stored locally on your own device via `localStorage`.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">2. Storage &amp; Security Safeguards</h2>
          <p className="text-sm text-[#E0DCD3] leading-relaxed">
            Personal submissions are stored in private, access-controlled server databases protected by Row-Level Security (RLS) and are never published in public buckets or sold to third parties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-white">3. Unsubscribe, Correction &amp; Erasure Rights</h2>
          <p className="text-sm text-[#E0DCD3] leading-relaxed">
            You may request access, correction, unsubscribe, or complete deletion of your contact details at any time by contacting our editorial desk via the corrections log or replying STOP to any future dispatch.
          </p>
        </section>
      </div>
    </main>
  );
}
