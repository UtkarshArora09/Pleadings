import { CaseFile } from '@/types/case';
import { CaseStore } from '@/lib/db/caseStore';

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

const ALL_STATIC_CASES: CaseFile[] = [
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

import dynamicCasesJson from '@/data/dynamicCases.json';

// Build initial map from dynamicCases.json so all images are instantly available
const INITIAL_DYNAMIC_MAP = new Map<string, any>();
if (Array.isArray(dynamicCasesJson)) {
  dynamicCasesJson.forEach((d: any) => {
    if (d.slug) INITIAL_DYNAMIC_MAP.set(d.slug.toLowerCase().trim(), d);
  });
}

function mergeCaseWithDynamic(staticCase: CaseFile, dynamicData: any): CaseFile {
  if (!dynamicData) return staticCase;

  const titleStr =
    typeof dynamicData.title === 'string'
      ? dynamicData.title
      : dynamicData.title?.en || staticCase.title;

  const hookStr =
    typeof dynamicData.hook === 'string'
      ? dynamicData.hook
      : dynamicData.hook?.en || dynamicData.blurb?.en || staticCase.hook;

  const posterImg = dynamicData.poster?.src
    ? dynamicData.poster
    : dynamicData.bannerImage
    ? {
        src: dynamicData.bannerImage,
        alt: `${titleStr} cover poster`,
        provenance: 'illustration' as const,
      }
    : staticCase.poster;

  const bannerImg = dynamicData.bannerImage || posterImg?.src || (staticCase as any).bannerImage;

  // Source base episodes from dynamicData if available, otherwise staticCase
  const baseEpisodes = (dynamicData.episodes && Array.isArray(dynamicData.episodes) && dynamicData.episodes.length >= 8)
    ? dynamicData.episodes
    : (staticCase.episodes || []);

  // Clone episodes and inject dynamic custom visuals & layer overrides
  const episodes = baseEpisodes.map((ep: any, idx: number) => {
    const staticEp = staticCase.episodes?.[idx];
    const clone = { ...(staticEp || {}), ...ep };
    if (idx === 0 && posterImg) {
      clone.image = posterImg;
    }
    const panelExhibit = dynamicData.panels?.[idx]?.photoExhibitSrc;
    if (panelExhibit) {
      clone.image = {
        src: panelExhibit,
        alt: clone.title || `${titleStr} Exhibit`,
        provenance: 'archival' as const,
      };
    }
    // Ensure layers are preserved
    if (ep.layers) {
      clone.layers = {
        story: ep.layers.story || staticEp?.layers?.story || { blocks: [] },
        student: ep.layers.student || staticEp?.layers?.student || { blocks: [] },
        advocate: ep.layers.advocate || staticEp?.layers?.advocate || { blocks: [] },
      };
    }
    return clone;
  });

  const flashcards = dynamicData.flashcards || staticCase.flashcards;
  const subsequentHistory = dynamicData.subsequentHistory || staticCase.subsequentHistory;

  return {
    ...staticCase,
    ...dynamicData,
    title: titleStr,
    hook: hookStr,
    poster: posterImg,
    bannerImage: bannerImg,
    episodes,
    flashcards,
    subsequentHistory,
  };
}

export function getAllCases(): CaseFile[] {
  let dynamicList: any[] = [];
  try {
    dynamicList = CaseStore.getAll();
  } catch {}

  const dynamicMap = new Map<string, any>(INITIAL_DYNAMIC_MAP);
  if (Array.isArray(dynamicList) && dynamicList.length > 0) {
    dynamicList.forEach((d) => {
      if (d.slug) dynamicMap.set(d.slug.toLowerCase().trim(), d);
    });
  }

  return ALL_STATIC_CASES.map((sc) => {
    const dyn =
      dynamicMap.get(sc.slug.toLowerCase().trim()) ||
      (sc.slug.includes('rinku')
        ? dynamicMap.get('rinku-rukshar-habeas-corpus-custody-case') ||
          dynamicMap.get('rinku-rukshar-habeas-corpus-case')
        : null);
    return mergeCaseWithDynamic(sc, dyn);
  });
}

export function getCaseBySlug(slug: string): CaseFile | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();

  const staticCase = ALL_STATIC_CASES.find(
    (c) =>
      c.slug === decoded ||
      c.slug.toLowerCase() === decoded ||
      (decoded === 'rinku-rukshar-habeas-corpus-case' &&
        c.slug === 'rinku-rukshar-habeas-corpus-custody-case') ||
      (decoded === 'rinku-rukshar-habeas-corpus-custody-case' &&
        c.slug === 'rinku-rukshar-habeas-corpus-case')
  );

  let dynamicCase: any = null;
  try {
    dynamicCase = CaseStore.getBySlug(slug);
  } catch {}

  if (!dynamicCase) {
    dynamicCase =
      INITIAL_DYNAMIC_MAP.get(decoded) ||
      (decoded.includes('rinku')
        ? INITIAL_DYNAMIC_MAP.get('rinku-rukshar-habeas-corpus-custody-case') ||
          INITIAL_DYNAMIC_MAP.get('rinku-rukshar-habeas-corpus-case')
        : null);
  }

  if (dynamicCase) {
    if (staticCase) {
      return mergeCaseWithDynamic(staticCase, dynamicCase);
    }
    return dynamicCase as unknown as CaseFile;
  }

  return staticCase || null;
}

export function getAllCaseSlugs(): string[] {
  const slugs = ALL_STATIC_CASES.map((c) => c.slug);
  if (!slugs.includes('rinku-rukshar-habeas-corpus-custody-case')) {
    slugs.push('rinku-rukshar-habeas-corpus-custody-case');
  }
  if (!slugs.includes('rinku-rukshar-habeas-corpus-case')) {
    slugs.push('rinku-rukshar-habeas-corpus-case');
  }
  return slugs;
}

export function getFeaturedCases(): CaseFile[] {
  const all = getAllCases();
  return all.filter((c) => c.featured).slice(0, 5);
}

export function getTop10Cases(): CaseFile[] {
  const all = getAllCases();
  return [...all]
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
  const all = getAllCases();
  return [...all]
    .sort(
      (a, b) =>
        new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
    )
    .slice(0, 5);
}
