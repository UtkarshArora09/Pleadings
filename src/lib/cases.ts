import { CaseFile } from '@/types/case';

import ghostCase from '@/content/cases/ghost-case.json';
import nanavatiCase from '@/content/cases/nanavati-case.json';
import haircutCase from '@/content/cases/haircut-case.json';
import shreyaSinghal from '@/content/cases/shreya-singhal.json';
import mcMehta from '@/content/cases/m-c-mehta.json';
import kesavanandaBharati from '@/content/cases/kesavananda-bharati.json';
import shahBano from '@/content/cases/shah-bano.json';
import vishakaCase from '@/content/cases/vishaka-case.json';
import manekaGandhi from '@/content/cases/maneka-gandhi.json';
import navtejJohar from '@/content/cases/navtej-johar.json';

const ALL_CASES: CaseFile[] = [
  ghostCase as unknown as CaseFile,
  nanavatiCase as unknown as CaseFile,
  haircutCase as unknown as CaseFile,
  shreyaSinghal as unknown as CaseFile,
  mcMehta as unknown as CaseFile,
  kesavanandaBharati as unknown as CaseFile,
  shahBano as unknown as CaseFile,
  vishakaCase as unknown as CaseFile,
  manekaGandhi as unknown as CaseFile,
  navtejJohar as unknown as CaseFile,
];

export function getAllCases(): CaseFile[] {
  return ALL_CASES;
}

export function getCaseBySlug(slug: string): CaseFile | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  return ALL_CASES.find((c) => c.slug === decoded || c.slug.toLowerCase() === decoded) || null;
}

export function getAllCaseSlugs(): string[] {
  return ALL_CASES.map((c) => c.slug);
}

export function getFeaturedCases(): CaseFile[] {
  return ALL_CASES.filter((c) => c.featured).slice(0, 5);
}

export function getLatestCases(): CaseFile[] {
  return [...ALL_CASES]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5);
}
