import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plain-English Legal Glossary & Latin Maxims Dictionary | Pleadings',
  description:
    'Comprehensive dictionary of Indian legal doctrines, Latin maxims, and judicial vocabulary explained in plain English and Hindi with certified court precedents.',
  keywords: [
    'legal glossary India',
    'legal terms plain english',
    'latin legal maxims explained',
    'ratio decidendi meaning',
    'obiter dicta meaning',
    'mens rea actus reus meaning',
    'habeas corpus meaning',
    'res judicata doctrine',
    'basic structure doctrine meaning',
    'due process of law India meaning',
  ],
  alternates: {
    canonical: 'https://pleadings.in/glossary',
  },
  openGraph: {
    title: 'Plain-English Legal Glossary & Latin Maxims | Pleadings',
    description:
      'Master core legal doctrines and Latin maxims with plain English definitions and certified landmark case citations.',
    url: 'https://pleadings.in/glossary',
    siteName: 'Pleadings',
  },
};

export default function GlossaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
