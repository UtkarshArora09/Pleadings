import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPC → BNS Statutory Concordance & Criminal Code Mapper | Pleadings',
  description:
    'Instant section-by-section comparison between the Indian Penal Code (IPC 1860) and Bharatiya Nyaya Sanhita (BNS 2023). Map old offenses to new sections with corresponding landmark case precedents.',
  keywords: [
    'IPC to BNS converter',
    'Bharatiya Nyaya Sanhita section finder',
    'BNS 2023 vs IPC 1860',
    'IPC BNS statutory concordance',
    'new criminal laws India 2024 2025',
    'Bharatiya Nagarik Suraksha Sanhita BNSS',
    'Bharatiya Sakshya Adhiniyam BSA',
    'IPC Section 300 to BNS',
    'IPC 302 new section BNS 103',
    'IPC 420 new section BNS 318',
    'IPC 376 new section BNS 64',
    'IPC 79 new section BNS',
  ],
  alternates: {
    canonical: 'https://pleadings.in/bns',
  },
  openGraph: {
    title: 'IPC → BNS Statutory Concordance & Converter | Pleadings',
    description:
      'Search and convert Indian Penal Code (IPC 1860) sections to Bharatiya Nyaya Sanhita (BNS 2023) with direct case links.',
    url: 'https://pleadings.in/bns',
    siteName: 'Pleadings',
  },
};

export default function BnsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
