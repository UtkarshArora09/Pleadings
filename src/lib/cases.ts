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
import rightToPrivacyCase from '@/content/cases/right-to-privacy-case.json';
import rinkuRuksharCase from '@/content/cases/rinku-rukshar-habeas-corpus-case.json';

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
  rightToPrivacyCase as unknown as CaseFile,
  rinkuRuksharCase as unknown as CaseFile,
];

export function getAllCases(): CaseFile[] {
  return ALL_CASES;
}

export function getCaseBySlug(slug: string): CaseFile | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  return (
    ALL_CASES.find(
      (c) =>
        c.slug === decoded ||
        c.slug.toLowerCase() === decoded ||
        (decoded === 'rinku-rukshar-habeas-corpus-case' && c.slug === 'rinku-rukshar-habeas-corpus-custody-case') ||
        (decoded === 'rinku-rukshar-habeas-corpus-custody-case' && c.slug === 'rinku-rukshar-habeas-corpus-case')
    ) || null
  );
}

export function getAllCaseSlugs(): string[] {
  const slugs = ALL_CASES.map((c) => c.slug);
  if (!slugs.includes('rinku-rukshar-habeas-corpus-custody-case')) {
    slugs.push('rinku-rukshar-habeas-corpus-custody-case');
  }
  if (!slugs.includes('rinku-rukshar-habeas-corpus-case')) {
    slugs.push('rinku-rukshar-habeas-corpus-case');
  }
  return slugs;
}

export function getFeaturedCases(): CaseFile[] {
  return ALL_CASES.filter((c) => c.featured).slice(0, 5);
}

export function getTop10Cases(): CaseFile[] {
  return [...ALL_CASES]
    .filter((c) => {
      const r = (c as any).rank;
      if (typeof r === 'number' && r > 10) return false;
      return true;
    })
    .sort((a, b) => {
      const rankA = typeof (a as any).rank === 'number' ? (a as any).rank : 100;
      const rankB = typeof (b as any).rank === 'number' ? (b as any).rank : 100;
      return rankA - rankB;
    })
    .slice(0, 10);
}

export function getLatestCases(): CaseFile[] {
  return [...ALL_CASES]
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 5);
}



