'use client';

import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { BrowseRow } from '@/components/BrowseRow';
import { Top10Card } from '@/components/Top10Card';
import { JudgeShowdownCard } from '@/components/JudgeShowdownCard';
import { EvidenceDossierCard } from '@/components/EvidenceDossierCard';
import { ConstitutionalWideCard } from '@/components/ConstitutionalWideCard';
import { PosterCard } from '@/components/PosterCard';
import { CASES_DATA } from '@/data/cases';
import { LawTermModal } from '@/components/LawTermModal';
import { Toast } from '@/components/Toast';
import { CourtroomExperienceShowcase } from '@/components/CourtroomExperienceShowcase';
import { useApp } from '@/context/AppContext';

export default function HomePage() {
  const { language, bookmarkedSlugs } = useApp();
  const featuredCase = CASES_DATA[0]; // The Ghost Case

  // Filter case categories for Netflix shelves
  const top10Cases = [...CASES_DATA].sort((a, b) => a.rank - b.rank);
  const judgeCases = CASES_DATA.filter((c) => c.hasJudgeDecision);
  const crimeCases = CASES_DATA.filter((c) => c.genre === 'crime');
  const constitutionalCases = CASES_DATA.filter(
    (c) => c.genre === 'constitutional' || c.genre === 'cyber'
  );
  const corporateCases = CASES_DATA.filter(
    (c) => c.genre === 'consumer' || c.genre === 'tort'
  );
  const savedCases = CASES_DATA.filter((c) => bookmarkedSlugs.includes(c.slug));

  return (
    <main className="min-h-screen bg-[#0E1016] text-[#F3EFE6] relative overflow-x-hidden select-none">
      <Header />
      <Hero featuredCase={featuredCase} />

      {/* Netflix Dynamic Shelves & Curated Formats */}
      <div className="-mt-10 relative z-20 pb-16 space-y-4">
        {/* Shelf: Saved by You (if any) */}
        {savedCases.length > 0 && (
          <BrowseRow
            title={language === 'en' ? 'My Saved Library' : 'मेरी सहेजी गई लाइब्रेरी'}
            subtitle={
              language === 'en'
                ? 'Your personal bookmarked courtroom case dossiers'
                : 'आपकी व्यक्तिगत बुकमार्क की गई लाइब्रेरी'
            }
            cases={savedCases}
            renderItem={(caseItem) => <PosterCard caseData={caseItem} />}
          />
        )}

        {/* Shelf 1: Top 10 Landmark Precedents (Giant Numbered Cards) */}
        <BrowseRow
          title={language === 'en' ? 'Top 10 Landmark Precedents in India' : 'भारत के शीर्ष 10 ऐतिहासिक फैसले'}
          subtitle={
            language === 'en'
              ? 'Most referenced court rulings by law students, advocates, and citizens'
              : 'लॉ छात्रों और वकीलों द्वारा सबसे ज्यादा पढ़े जाने वाले फैसले'
          }
          cases={top10Cases}
          renderItem={(caseItem, idx) => <Top10Card caseData={caseItem} index={idx} />}
        />

        {/* Shelf 2: Interactive Judicial Decisions (Dilemma Split Cards) */}
        <BrowseRow
          title={language === 'en' ? 'Interactive Judicial Deliberations' : '"आप हैं जज" — लाइव सिमुलेशन'}
          subtitle={
            language === 'en'
              ? 'Analyze the facts and cast your vote before the court reveals the actual ratio'
              : 'साक्ष्य देखें और सुप्रीम कोर्ट का फैसला जानने से पहले अपना निर्णय दें'
          }
          cases={judgeCases}
          renderItem={(caseItem) => <JudgeShowdownCard caseData={caseItem} />}
        />

        {/* Shelf 3: Crime Scene & Forensic Files (Manila Evidence Dossiers) */}
        <BrowseRow
          title={language === 'en' ? 'Crime Scene & Forensic Case Files' : 'फॉरेंसिक साक्ष्य व अपराध डायरी'}
          subtitle={
            language === 'en'
              ? 'Authentic police station diaries, ballistics reports, and recovered exhibits'
              : 'थाना केस डायरी, बैलिस्टिक रिपोर्ट और जब्त किए गए साक्ष्य'
          }
          cases={crimeCases}
          renderItem={(caseItem) => <EvidenceDossierCard caseData={caseItem} />}
        />

        {/* Shelf 4: Constitutional Law Benches (Widescreen Gold Ratios) */}
        <BrowseRow
          title={language === 'en' ? 'Supreme Court Constitutional Benches' : 'ऐतिहासिक संविधान पीठ के महामुकदमे'}
          subtitle={
            language === 'en'
              ? 'Marathon hearings that protected fundamental rights and the soul of the Indian Constitution'
              : 'वह मैराथन बहस जिसने भारतीय लोकतंत्र और मूल अधिकारों को बचाया'
          }
          cases={constitutionalCases}
          renderItem={(caseItem) => <ConstitutionalWideCard caseData={caseItem} />}
        />

        {/* Shelf 5: Consumer & Corporate Disputes (Executive Dossiers) */}
        <BrowseRow
          title={language === 'en' ? 'Consumer Protection & Corporate Torts' : 'उपभोक्ता संरक्षण व औद्योगिक विवाद'}
          subtitle={
            language === 'en'
              ? 'Deficiency of service, luxury damages, and the absolute liability doctrine'
              : 'सेवा में कमी, भारी हर्जाना और पूर्ण दायित्व का सिद्धांत'
          }
          cases={corporateCases}
          renderItem={(caseItem) => <PosterCard caseData={caseItem} />}
        />
      </div>

      {/* Interactive Feature Experience Showcase */}
      <CourtroomExperienceShowcase />

      {/* Footer */}
      <footer
        className="bg-[#0c0c0c] py-14 px-6 md:px-12 text-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="max-w-3xl mx-auto space-y-4">
          <p className="font-anton text-white text-lg uppercase tracking-[0.25em]">
            PLEADINGS
          </p>
          <p className="text-xs text-[#a9a49a] max-w-xl mx-auto leading-relaxed">
            {language === 'en'
              ? 'Pleadings is a legal media platform for India turning real, closed, verified court cases into short, story-driven, interactive reads. Sourced directly from certified court records.'
              : 'प्लीडिंग्स भारत का एक लीगल मीडिया प्लेटफॉर्म है जो वास्तविक, निस्तारित और सत्यापित अदालती मामलों को संक्षिप्त, इंटरैक्टिव और रोमांचक कहानियों में बदलता है।'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#D4AF37] uppercase tracking-wider font-mono pt-2">
            <Link href="/browse" className="hover:underline">Browse Cases</Link>
            <span>·</span>
            <Link href="/glossary" className="hover:underline">Legal Glossary</Link>
            <span>·</span>
            <a href="https://indiankanoon.org" target="_blank" rel="noopener noreferrer" className="hover:underline">Indian Kanoon Verified</a>
          </div>
          <p className="text-[10px] text-[#595959] italic tracking-wide pt-4">
            © {new Date().getFullYear()} Pleadings · Netflix-Style Storytelling for Real Indian Law.
          </p>
        </div>
      </footer>

      <LawTermModal />
      <Toast />
    </main>
  );
}
