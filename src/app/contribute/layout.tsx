import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Contribute a Landmark Indian Case — Advocate Network | Pleadings',
  description:
    'Submit verified case briefs, arguments, and ratio decidendi to the Pleadings Indian law archive for editorial registry verification and contributor attribution.',
  alternates: {
    canonical: 'https://pleadings.in/contribute',
  },
  openGraph: {
    title: 'Contribute a Landmark Case | Pleadings',
    description:
      'Advocates and legal researchers can submit Indian court judgments and case analysis to Pleadings.',
    url: 'https://pleadings.in/contribute',
    siteName: 'Pleadings',
  },
};

export default function ContributeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
