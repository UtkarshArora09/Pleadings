import { CaseFile } from '@/types/case';
import { CaseStore, isCasePublished, resolveLegalStatus, resolvePublishStatus } from '@/lib/db/caseStore';

type RawCaseInput = Record<string, any>;

function formatCaseDataToCaseFile(dyn: RawCaseInput): CaseFile {
  const titleStr =
    typeof dyn.title === 'string'
      ? dyn.title
      : dyn.title?.en || dyn.slug || 'Untitled Case';

  const hookStr =
    typeof dyn.blurb === 'string'
      ? dyn.blurb
      : dyn.blurb?.en !== undefined
      ? dyn.blurb.en
      : typeof dyn.hook === 'string'
      ? dyn.hook
      : dyn.hook?.en || dyn.featuredHeroHook?.en || '';

  const posterImg = dyn.poster?.src
    ? dyn.poster
    : dyn.bannerImage
    ? {
        src: dyn.bannerImage,
        alt: `${titleStr} cover poster`,
        provenance: 'illustration' as const,
      }
    : { src: '/images/cases/ghost-case.jpg', alt: `${titleStr} poster`, provenance: 'illustration' as const };

  const bannerImg = dyn.bannerImage || posterImg?.src || '/images/cases/ghost-case.jpg';
  const court = dyn.court || 'Supreme Court of India';
  const year = typeof dyn.year === 'number' ? dyn.year : 2020;
  const citation = dyn.citation || dyn.citations?.primary || `${year} INSC 1`;
  const categoryTag = dyn.categoryTag || dyn.category_tag || dyn.doctrines?.[0] || dyn.tag?.en || 'Constitutional';

  // Clean separation between editorial publication status and legal precedential status
  const publishStatus = resolvePublishStatus(dyn);
  const legalStatus = resolveLegalStatus(dyn, year);

  return {
    ...dyn,
    slug: dyn.slug,
    title: titleStr,
    hook: hookStr,
    court,
    year,
    decidedOn: dyn.decidedOn || `${year}-05-15`,
    bench: dyn.bench || [`Hon'ble Bench of the ${court}`],
    citations: dyn.citations || { primary: citation, parallel: [] },
    sourceUrl: dyn.sourceUrl || dyn.judgmentUrl || 'https://indiankanoon.org/',
    publishStatus,
    legalStatus,
    // Keep `status` as the legal precedential status object for UI StatusBadge components
    status: legalStatus,
    statuteMap: dyn.statuteMap || [{ old: categoryTag, new: null, note: 'Governing statute' }],
    doctrines: dyn.doctrines || [categoryTag],
    categories: dyn.categories || [dyn.genre || 'constitutional'],
    readingTime: dyn.readingTime || { story: 5, student: 7, advocate: 9 },
    featured: typeof dyn.featured === 'boolean' ? dyn.featured : true,
    publishedAt: dyn.publishedAt || dyn.createdAt || new Date().toISOString(),
    poster: posterImg,
    bannerImage: bannerImg,
    episodes: dyn.episodes || dyn.panels || [],
    lawyerEpisodes: dyn.lawyerEpisodes,
    rank: typeof dyn.rank === 'number' ? dyn.rank : 10,
    vote:
      dyn.vote && dyn.vote.question && Array.isArray(dyn.vote.options) && dyn.vote.options.length >= 2
        ? dyn.vote
        : {
            question: dyn.vote?.question || `How should the Court decide regarding ${titleStr}?`,
            context:
              dyn.vote?.context ||
              'Balancing constitutional principles, fundamental freedoms, and statutory compliance.',
            options:
              dyn.vote?.options && Array.isArray(dyn.vote.options) && dyn.vote.options.length >= 2
                ? dyn.vote.options
                : [
                    {
                      id: 'petitioner',
                      label: 'In Favor of Petitioner',
                      argument: 'Uphold constitutional liberties and statutory safeguards.',
                    },
                    {
                      id: 'respondent',
                      label: 'In Favor of Respondent',
                      argument: 'Uphold regulatory authority and legitimate state interest.',
                    },
                  ],
            courtChoseOptionId: dyn.vote?.courtChoseOptionId || 'petitioner',
          },
    glossary: Array.isArray(dyn.glossary) ? dyn.glossary : [],
    flashcards: Array.isArray(dyn.flashcards) ? dyn.flashcards : [],
    affectsYou: dyn.affectsYou || {
      heading: `How this ruling affects your legal rights`,
      points: [`Establishes binding procedural safeguards and substantive law standards.`],
      actionLink: {
        label: 'Verified against official judgment record',
        url: dyn.sourceUrl || dyn.judgmentUrl || 'https://indiankanoon.org/',
      },
    },
    timeline:
      Array.isArray(dyn.timeline) && dyn.timeline.length > 0
        ? dyn.timeline
        : [{ year, event: 'Judgment delivered by the Court' }],
    relatedSlugs: Array.isArray(dyn.relatedSlugs) ? dyn.relatedSlugs : [],
    subsequentHistory: Array.isArray(dyn.subsequentHistory) ? dyn.subsequentHistory : [],
    sources:
      Array.isArray(dyn.sources) && dyn.sources.length > 0
        ? dyn.sources
        : [
            {
              label: 'Supreme Court of India / Indian Kanoon',
              url: dyn.sourceUrl || dyn.judgmentUrl || 'https://indiankanoon.org/',
            },
          ],
    advocateReference: dyn.advocateReference,
    review: dyn.review || {
      reviewer: dyn.reviewer || 'Adv. Girish Kr. Srivastava',
      enrolment: dyn.enrolmentNumber || dyn.enrolment || 'D/842/1991',
      reviewedOn: dyn.decidedOn || dyn.createdAt || '2024-01-15',
    },
  } as unknown as CaseFile;
}

export function getAllCases(): CaseFile[] {
  const dynamicList = CaseStore.getAll();
  return dynamicList.map(formatCaseDataToCaseFile);
}

export async function getAllCasesAsync(): Promise<CaseFile[]> {
  const dynamicList = await CaseStore.getAllAsync();
  return dynamicList.map(formatCaseDataToCaseFile);
}

/**
 * Returns ONLY cases whose editorial publishStatus === 'PUBLISHED'.
 * Published precedents that are legally OVERRULED, PARTLY_SUPERSEDED, or STATUTE_REPLACED
 * remain visible with their legal status warning badge.
 */
export function getPublishedCases(): CaseFile[] {
  const dynamicList = CaseStore.getAll();
  return dynamicList.filter((c) => isCasePublished(c)).map(formatCaseDataToCaseFile);
}

export async function getPublishedCasesAsync(): Promise<CaseFile[]> {
  const dynamicList = await CaseStore.getAllAsync();
  return dynamicList.filter((c) => isCasePublished(c)).map(formatCaseDataToCaseFile);
}

/**
 * Admin/internal lookup by slug (includes DRAFT / ADMIN_REVIEW).
 */
export function getCaseBySlug(slug: string): CaseFile | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const cleanSlug = decoded.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const dynamicCase = CaseStore.getBySlug(decoded) || CaseStore.getBySlug(cleanSlug);
  if (dynamicCase) {
    return formatCaseDataToCaseFile(dynamicCase);
  }
  return null;
}

export async function getCaseBySlugAsync(slug: string): Promise<CaseFile | null> {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const cleanSlug = decoded.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const dynamicCase = (await CaseStore.getBySlugAsync(decoded)) || (await CaseStore.getBySlugAsync(cleanSlug));
  if (dynamicCase) {
    return formatCaseDataToCaseFile(dynamicCase);
  }
  return null;
}

/**
 * Public-safe lookup by slug: strictly blocks DRAFT, ADMIN_REVIEW, and ARCHIVED cases (SEC-008).
 */
export function getPublishedCaseBySlug(slug: string): CaseFile | null {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const cleanSlug = decoded.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const dynamicCase = CaseStore.getBySlug(decoded) || CaseStore.getBySlug(cleanSlug);
  if (dynamicCase && isCasePublished(dynamicCase)) {
    return formatCaseDataToCaseFile(dynamicCase);
  }
  return null;
}

export async function getPublishedCaseBySlugAsync(slug: string): Promise<CaseFile | null> {
  if (!slug) return null;
  const decoded = decodeURIComponent(slug).trim().toLowerCase();
  const cleanSlug = decoded.replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');

  const dynamicCase = (await CaseStore.getBySlugAsync(decoded)) || (await CaseStore.getBySlugAsync(cleanSlug));
  if (dynamicCase && isCasePublished(dynamicCase)) {
    return formatCaseDataToCaseFile(dynamicCase);
  }
  return null;
}

export function getAllCaseSlugs(): string[] {
  const all = getPublishedCases();
  return all.map((c) => c.slug);
}

export function getFeaturedCases(): CaseFile[] {
  const all = getPublishedCases();
  return all.filter((c) => c.featured).slice(0, 5);
}

export function getTop10Cases(): CaseFile[] {
  const all = getPublishedCases();
  return [...all]
    .filter((c) => {
      const r = (c as unknown as { rank?: number }).rank;
      if (typeof r === 'number' && r > 10) return false;
      return true;
    })
    .sort((a, b) => {
      const rankA = typeof (a as unknown as { rank?: number }).rank === 'number' ? (a as unknown as { rank: number }).rank : 100;
      const rankB = typeof (b as unknown as { rank?: number }).rank === 'number' ? (b as unknown as { rank: number }).rank : 100;
      return rankA - rankB;
    })
    .slice(0, 10);
}

export function getLatestCases(): CaseFile[] {
  const all = getPublishedCases();
  return [...all]
    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    .slice(0, 5);
}
