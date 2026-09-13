import React from 'react';
import { ReelView } from '@/components/ReelView';
import { CASES_DATA } from '@/data/cases';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return CASES_DATA.map((c) => ({
    slug: c.slug,
  }));
}

interface CasePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CasePage({ params }: CasePageProps) {
  const { slug } = await params;
  const currentCase = CASES_DATA.find((c) => c.slug === slug);

  if (!currentCase) {
    notFound();
  }

  return <ReelView cases={CASES_DATA} initialCaseSlug={slug} />;
}
