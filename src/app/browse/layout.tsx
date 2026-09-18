import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Landmark Indian Cases | Pleadings',
  description:
    'Search and filter certified Indian court judgments by court, decade, legal doctrine, and status. Essential precedents from the Supreme Court of India and High Courts.',
  keywords: [
    'browse Indian cases',
    'search court judgments',
    'Supreme Court landmark cases',
    'High Court case search',
    'Indian legal precedents database',
    'CLAT PG cases list',
    'Judiciary exam cases',
    'criminal law cases',
    'constitutional law cases',
  ],
  alternates: {
    canonical: 'https://pleadings.in/browse',
  },
  openGraph: {
    title: 'Browse Landmark Indian Cases | Pleadings',
    description:
      'Search and filter certified Indian court judgments by court, decade, legal doctrine, and status.',
    url: 'https://pleadings.in/browse',
    siteName: 'Pleadings',
  },
};

export default function BrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
