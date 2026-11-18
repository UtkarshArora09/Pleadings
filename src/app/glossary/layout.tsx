import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Plain-English & Hindi Indian Legal Glossary | Pleadings',
  description:
    'Understand key Indian legal doctrines, constitutional principles, and Latin maxims in plain English and Hindi, linked directly to statutory provisions and landmark cases.',
  alternates: {
    canonical: 'https://pleadings.in/glossary',
  },
  openGraph: {
    title: 'Plain-English Legal Glossary | Pleadings',
    description:
      'Bilingual English & Hindi glossary of Indian legal doctrines and Latin maxims linked to verified court judgments.',
    url: 'https://pleadings.in/glossary',
    siteName: 'Pleadings',
  },
};

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
