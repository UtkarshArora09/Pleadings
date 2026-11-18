import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'IPC to BNS, CrPC to BNSS & IEA to BSA Statutory Concordance | Pleadings',
  description:
    'Instant bi-directional concordance mapping Indian Penal Code (IPC), CrPC, and Indian Evidence Act sections to Bharatiya Nyaya Sanhita (BNS), BNSS, and BSA with landmark case cross-references.',
  alternates: {
    canonical: 'https://pleadings.in/bns',
  },
  openGraph: {
    title: 'IPC → BNS Statutory Concordance | Pleadings',
    description:
      'Search IPC to BNS, CrPC to BNSS, and Evidence Act to BSA statutory transitions cross-referenced with Indian court judgments.',
    url: 'https://pleadings.in/bns',
    siteName: 'Pleadings',
  },
};

export default function BnsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
