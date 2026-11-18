import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Browse Landmark Indian Cases by Court, Statute & Doctrine | Pleadings',
  description:
    'Search and filter verified Supreme Court and High Court landmark judgments by court, decade, doctrine, legal status, IPC/BNS statute, and reading time.',
  alternates: {
    canonical: 'https://pleadings.in/browse',
  },
  openGraph: {
    title: 'Browse Landmark Indian Cases | Pleadings',
    description:
      'Filter verified Indian court judgments by court, decade, legal doctrine, status, and saved bookmarks.',
    url: 'https://pleadings.in/browse',
    siteName: 'Pleadings',
  },
};

export default function BrowseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
