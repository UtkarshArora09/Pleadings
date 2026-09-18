import type { Metadata, Viewport } from 'next';
import { Anton, Montserrat, Noto_Sans_Devanagari } from 'next/font/google';
import './globals.css';
import { AppContextProvider } from '@/context/AppContext';

const anton = Anton({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-anton',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

const notoDevanagari = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-devanagari',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0E1016',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://pleadings.in'),
  title: {
    default: 'Pleadings — Landmark Indian Court Judgments as Verified Stories',
    template: '%s | Pleadings',
  },
  description:
    'Pleadings transforms real, closed, certified Indian court judgments into cinematic legal thrillers, evidence exhibits, and law student case briefs. Search landmark Supreme Court of India precedents, IPC to BNS 2023 concordance, and core constitutional doctrines.',
  applicationName: 'Pleadings',
  authors: [{ name: 'Pleadings Editorial Board', url: 'https://pleadings.in/about' }],
  creator: 'Pleadings',
  publisher: 'Pleadings Legal Media',
  category: 'Legal Education & Judicial Precedents',
  keywords: [
    // Brand & Platform
    'Pleadings',
    'pleadings.in',
    'Pleadings India',
    'Indian legal media',
    'courtroom thriller India',
    'Netflix for Indian law',
    'verified legal stories',
    'Indian court judgments summary',

    // Landmark Cases (Core Case Library)
    'KM Nanavati vs State of Maharashtra',
    'Nanavati case full judgment',
    'Sylvia Nanavati Prem Ahuja',
    'Jury trial abolished in India',
    'Kesavananda Bharati vs State of Kerala',
    'Basic Structure Doctrine',
    'Article 368 constitutional amendment',
    'Maneka Gandhi vs Union of India',
    'Article 21 procedure established by law',
    'Golden Triangle Article 14 19 21',
    'Due Process of Law in India',
    'Passport impounding case',
    'Justice KS Puttaswamy vs Union of India',
    'Right to Privacy fundamental right',
    'Aadhaar case judgment',
    'MC Mehta vs Union of India',
    'Oleum Gas Leak case',
    'Absolute Liability principle',
    'Shriram Food and Fertilizers',
    'Vishaka vs State of Rajasthan',
    'Vishaka guidelines sexual harassment',
    'POSH Act 2013',
    'Bhanwari Devi case',
    'Mohd Ahmed Khan vs Shah Bano Begum',
    'Shah Bano case maintenance',
    'Section 125 CrPC Muslim women',
    'Uniform Civil Code Article 44',
    'Shreya Singhal vs Union of India',
    'Section 66A IT Act struck down',
    'Freedom of speech and expression online',
    'State of Orissa vs Ram Bahadur Thapa',
    'Ghost case law India',
    'IPC 79 mistake of fact in good faith',
    'Aashna Roy vs ITC Hotels Maurya',
    '2 crore haircut case judgment',
    'Consumer Protection Act 2019 deficiency of service',
    'Navtej Singh Johar vs Union of India',
    'Section 377 IPC decriminalized',
    'LGBTQ rights Supreme Court',
    'Rinku Rukshar vs State of UP',
    'Habeas Corpus child custody interfaith',

    // Statutes & Bharatiya Nyaya Sanhita (BNS) Transition
    'Bharatiya Nyaya Sanhita 2023',
    'BNS 2023',
    'BNS vs IPC converter',
    'IPC to BNS concordance',
    'Bharatiya Nagarik Suraksha Sanhita',
    'BNSS 2023',
    'Bharatiya Sakshya Adhiniyam',
    'BSA 2023',
    'Indian Penal Code 1860',
    'Code of Criminal Procedure 1973',
    'Indian Evidence Act 1872',
    'Constitution of India',
    'Consumer Protection Act 2019',
    'Information Technology Act 2000',

    // Core Legal Doctrines & Latin Maxims
    'Basic Structure Doctrine',
    'Mens Rea and Actus Reus',
    'Mistake of Fact IPC 79',
    'Grave and Sudden Provocation IPC 300 Exception 1',
    'Absolute Liability vs Strict Liability',
    'Rylands vs Fletcher rule',
    'Habeas Corpus Writ',
    'Ratio Decidendi',
    'Obiter Dicta',
    'Res Judicata',
    'Constitutional Morality',
    'Proportionality Test',
    'Chilling Effect Doctrine',
    'Doctrine of Severability',

    // Competitive Exam Preparation
    'CLAT PG landmark judgments 2025 2026',
    'CLAT LLM case law questions',
    'Judiciary exam preparation case summaries',
    'UPSC Law Optional landmark cases',
    'LLB case study notes India',
    'Bar Council of India AIBE exam case laws',
    'Supreme Court latest precedents',
  ],
  alternates: {
    canonical: 'https://pleadings.in',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '48x48 32x32 16x16', type: 'image/x-icon' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Pleadings — Landmark Indian Court Judgments as Verified Stories',
    description:
      'Certified Indian legal precedents transformed into transparent, episodic courtroom stories and briefs. Verified against original Supreme Court and High Court judgments.',
    url: 'https://pleadings.in',
    siteName: 'Pleadings',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: 'https://pleadings.in/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Pleadings — Landmark Indian Court Judgments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pleadings — Real Indian Court Judgments as Verified Stories',
    description:
      'Certified Indian legal precedents transformed into episodic stories, evidence reels, and law student briefs.',
    images: ['https://pleadings.in/opengraph-image'],
    creator: '@pleadings_in',
    site: '@pleadings_in',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const globalJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://pleadings.in/#organization',
        name: 'Pleadings',
        url: 'https://pleadings.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://pleadings.in/icon.svg',
          caption: 'Pleadings Logo',
        },
        description:
          'Pleadings transforms certified Indian court judgments into transparent, source-tiered episodic stories, evidence exhibits, and case briefs.',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://pleadings.in/#website',
        url: 'https://pleadings.in',
        name: 'Pleadings',
        description: 'Landmark Indian Court Judgments as Verified Stories',
        publisher: {
          '@id': 'https://pleadings.in/#organization',
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://pleadings.in/browse?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-IN', 'hi-IN'],
      },
    ],
  };

  return (
    <html
      lang="en"
      className={`${anton.variable} ${montserrat.variable} ${notoDevanagari.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalJsonLd) }}
        />
      </head>
      <body className="bg-[#0E1016] text-[#F3EFE6] font-sans antialiased selection:bg-[#D4AF37] selection:text-[#0E1016] overflow-x-hidden min-h-screen">
        <AppContextProvider>{children}</AppContextProvider>
      </body>
    </html>
  );
}
