import fs from 'fs';
import path from 'path';
import os from 'os';
import { CaseData, CaseStatus } from '@/types';
import { CASES_DATA } from '@/data/cases';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PRIMARY_DB_PATH = path.join(DATA_DIR, 'dynamicCases.json');
const TMP_DB_PATH = path.join(os.tmpdir(), 'dynamicCases.json');

// In-memory cache for fast lookups
let cachedCases: CaseData[] | null = null;

function ensureInitialized(): CaseData[] {
  if (cachedCases && cachedCases.length > 0) return cachedCases;

  // 1. Try reading from TMP_DB_PATH (written by serverless functions)
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      const raw = fs.readFileSync(TMP_DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCases = parsed;
        return cachedCases;
      }
    }
  } catch (tmpErr) {
    // continue
  }

  // 2. Try reading from PRIMARY_DB_PATH
  try {
    if (fs.existsSync(PRIMARY_DB_PATH)) {
      const raw = fs.readFileSync(PRIMARY_DB_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        cachedCases = parsed;
        return cachedCases;
      }
    }
  } catch (error) {
    console.warn('Error reading dynamicCases.json, falling back to seed data:', error);
  }

  // 3. Bootstrap with the 10 landmark cases from CASES_DATA
  const seedCases: CaseData[] = CASES_DATA.map((c, idx) => ({
    ...c,
    status: 'PUBLISHED' as CaseStatus,
    createdAt: new Date(Date.now() - (10 - idx) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  cachedCases = seedCases;
  return cachedCases;
}

function persistCases(cases: CaseData[]): boolean {
  cachedCases = cases;
  let saved = false;

  // Try writing to primary path
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${PRIMARY_DB_PATH}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(cases, null, 2), 'utf-8');
    fs.renameSync(tempFile, PRIMARY_DB_PATH);
    saved = true;
  } catch {
    // Primary path is read-only in Vercel serverless
  }

  // Always write to /tmp on serverless
  try {
    const tmpTemp = `${TMP_DB_PATH}.tmp`;
    fs.writeFileSync(tmpTemp, JSON.stringify(cases, null, 2), 'utf-8');
    fs.renameSync(tmpTemp, TMP_DB_PATH);
    saved = true;
  } catch (tmpErr) {
    console.warn('Failed to write to /tmp dynamic cases:', tmpErr);
  }

  return saved;
}

export function normalizeCaseData(raw: any): CaseData {
  if (!raw) return {} as CaseData;

  const titleEn = typeof raw.title === 'string' ? raw.title : (raw.title?.en || raw.slug || 'Untitled Case');
  const titleHi = typeof raw.title === 'string' ? raw.title : (raw.title?.hi || titleEn);

  const hookEn = typeof raw.hook === 'string' ? raw.hook : (raw.blurb?.en || raw.featuredHeroHook?.en || '');
  const hookHi = typeof raw.hi?.hook === 'string' ? raw.hi.hook : (raw.blurb?.hi || raw.featuredHeroHook?.hi || hookEn);

  const bannerImage = raw.bannerImage || raw.poster?.src || '/images/cases/ghost-case.jpg';
  const court = raw.court || 'Supreme Court of India';
  const year = raw.year || 2020;
  const citation = raw.citations?.primary || raw.citation || `${year} INSC 1`;
  const categoryTag = raw.categoryTag || raw.doctrines?.[0] || raw.tag?.en || 'Constitutional';

  // If episodes exist (CaseFile structure), map episodes to panels
  let panels = raw.panels;
  if (!panels || !Array.isArray(panels) || panels.length === 0) {
    if (raw.episodes && Array.isArray(raw.episodes)) {
      panels = raw.episodes.map((ep: any, idx: number) => {
        const epType = idx === 0 ? 'HOOK' : idx === 1 ? 'PEOPLE' : idx === 2 ? 'INCIDENT' : idx === 3 ? 'TIMELINE' : idx === 4 ? 'EVIDENCE' : idx === 5 ? 'ARGUMENTS' : idx === 6 ? 'VERDICT' : 'RATIO';
        const bodyText = ep.layers?.story?.blocks?.[0]?.text || (Array.isArray(ep.layers?.story?.blocks) ? ep.layers.story.blocks.map((b: any) => b.text).join('\n\n') : '') || ep.title || '';
        return {
          id: `panel-${idx + 1}`,
          type: epType,
          eyebrow: { en: ep.kicker || `EPISODE 0${idx + 1}`, hi: ep.kicker || `एपिसोड 0${idx + 1}` },
          headline: { en: ep.title || `Episode ${idx + 1}`, hi: ep.title || `एपिसोड ${idx + 1}` },
          body: { en: bodyText, hi: bodyText },
          photoExhibitSrc: ep.exhibit?.image?.src || ep.image?.src || bannerImage,
          image: ep.exhibit?.image?.src || ep.image?.src || bannerImage,
          evidence: ep.exhibit ? {
            masthead: ep.exhibit.label || 'OFFICIAL COURT EXHIBIT',
            date: ep.exhibit.meta || `${year}`,
            headline: { en: ep.exhibit.headline || ep.title, hi: ep.exhibit.headline || ep.title },
            snippet: { en: ep.exhibit.body || bodyText, hi: ep.exhibit.body || bodyText },
            imageSrc: ep.exhibit.image?.src || bannerImage,
          } : undefined,
        };
      });
    } else {
      panels = [];
    }
  }

  // Ensure brief exists
  const brief = raw.brief || {
    courtAndYear: { en: `${court} (${year})`, hi: `${court} (${year})` },
    facts: { en: hookEn, hi: hookHi },
    issues: { en: [raw.vote?.question || `Constitutional validity and legal threshold in ${titleEn}`], hi: [raw.vote?.question || `${titleEn} में कानूनी प्रश्न`] },
    chargesApplied: raw.doctrines || [categoryTag],
    held: { en: raw.status?.explain || raw.vote?.courtChoseOptionId || 'Judgment rendered by the Bench.', hi: raw.status?.explain || 'न्यायालय द्वारा दिया गया निर्णय।' },
    reasoning: { en: `The court established foundational doctrine under ${categoryTag}.`, hi: `न्यायालय ने ${categoryTag} के तहत सिद्धांत प्रतिपादित किया।` },
    whyItMatters: { en: raw.status?.explain || 'Essential legal precedent.', hi: 'महत्वपूर्ण न्यायिक मिसाल।' },
  };

  return {
    ...raw,
    slug: raw.slug,
    title: { en: titleEn, hi: titleHi },
    tag: { en: categoryTag, hi: categoryTag },
    categoryTag: categoryTag,
    genre: raw.genre || 'constitutional',
    theme: raw.theme || 'constitutional-gold',
    court: court,
    year: year,
    readTime: raw.readTime?.en ? raw.readTime : { en: `${raw.readingTime?.story || 5} min read`, hi: `${raw.readingTime?.story || 5} मिनट` },
    blurb: { en: hookEn, hi: hookHi },
    citation: citation,
    judgmentUrl: raw.judgmentUrl || raw.sourceUrl || 'https://indiankanoon.org/',
    watermark: raw.watermark || '§',
    bannerImage: bannerImage,
    poster: raw.poster || { src: bannerImage, alt: `${titleEn} cover poster`, provenance: 'illustration' },
    matchRate: raw.matchRate || 98,
    maturityRating: raw.maturityRating || 'U/A 13+',
    rank: raw.rank || 10,
    featuredHeroHook: { en: hookEn, hi: hookHi },
    featuredHeroDesc: { en: hookEn, hi: hookHi },
    panels: panels,
    brief: brief,
    status: raw.status?.code ? (raw.status?.code === 'GOOD_LAW' ? 'PUBLISHED' : 'ADMIN_REVIEW') : (raw.status || 'ADMIN_REVIEW'),
    createdAt: raw.createdAt || raw.publishedAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

function matchSlug(caseSlug?: string, querySlug?: string): boolean {
  if (!caseSlug || !querySlug) return false;
  const a = caseSlug.toLowerCase().trim();
  const b = querySlug.toLowerCase().trim();
  if (a === b) return true;
  if (
    (a === 'rinku-rukshar-habeas-corpus-custody-case' || a === 'rinku-rukshar-habeas-corpus-case') &&
    (b === 'rinku-rukshar-habeas-corpus-custody-case' || b === 'rinku-rukshar-habeas-corpus-case')
  ) {
    return true;
  }
  return false;
}

export const CaseStore = {
  getAll(): CaseData[] {
    return ensureInitialized();
  },

  getPublished(): CaseData[] {
    const all = ensureInitialized();
    return all.filter((c) => c.status === 'PUBLISHED' || !c.status);
  },

  getBySlug(slug: string): CaseData | null {
    const all = ensureInitialized();
    const found = all.find((c) => matchSlug(c.slug, slug));
    if (found) return normalizeCaseData(found);

    // Fallback 1: check static CASES_DATA
    const staticCase = CASES_DATA.find((c) => matchSlug(c.slug, slug));
    if (staticCase) {
      const normalized = normalizeCaseData(staticCase);
      this.create(normalized);
      return normalized;
    }

    // Fallback 2: check content/cases/*.json on disk
    try {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
      const possibleFilenames = [
        `${cleanSlug}.json`,
        'rinku-rukshar-habeas-corpus-case.json',
      ];
      for (const fn of possibleFilenames) {
        const caseFilePath = path.join(process.cwd(), 'content', 'cases', fn);
        if (fs.existsSync(caseFilePath)) {
          const raw = fs.readFileSync(caseFilePath, 'utf8');
          const parsed = JSON.parse(raw);
          if (matchSlug(parsed.slug, slug) || fn.includes('rinku')) {
            const normalized = normalizeCaseData(parsed);
            this.create(normalized);
            return normalized;
          }
        }
      }
    } catch (err) {
      console.warn(`Could not read case from content/cases/${slug}.json:`, err);
    }

    return null;
  },

  create(newCase: any): CaseData {
    const normalized = normalizeCaseData(newCase);
    const all = ensureInitialized();
    const existingIdx = all.findIndex((c) => matchSlug(c.slug, normalized.slug));
    
    const timestamp = new Date().toISOString();
    const caseToSave: CaseData = {
      ...normalized,
      status: normalized.status || 'ADMIN_REVIEW',
      createdAt: normalized.createdAt || timestamp,
      updatedAt: timestamp,
    };

    let updatedList: CaseData[];
    if (existingIdx >= 0) {
      updatedList = [...all];
      updatedList[existingIdx] = caseToSave;
    } else {
      updatedList = [caseToSave, ...all];
    }

    persistCases(updatedList);
    return caseToSave;
  },

  update(slug: string, updates: Partial<CaseData>): CaseData | null {
    const all = ensureInitialized();
    let idx = all.findIndex((c) => matchSlug(c.slug, slug));
    if (idx < 0) {
      const loaded = this.getBySlug(slug);
      if (loaded) {
        const refreshed = ensureInitialized();
        idx = refreshed.findIndex((c) => matchSlug(c.slug, slug));
      }
    }

    if (idx >= 0) {
      const current = ensureInitialized();
      const updatedCase: CaseData = normalizeCaseData({
        ...current[idx],
        ...updates,
        slug: updates.slug || current[idx].slug,
        updatedAt: new Date().toISOString(),
      });
      const updatedList = [...current];
      updatedList[idx] = updatedCase;
      persistCases(updatedList);
      return updatedCase;
    }
    return null;
  },

  delete(slug: string): boolean {
    const all = ensureInitialized();
    const filtered = all.filter((c) => !matchSlug(c.slug, slug));
    if (filtered.length !== all.length) {
      persistCases(filtered);
      return true;
    }
    return false;
  },

  setPublishStatus(slug: string, publish: boolean): CaseData | null {
    return this.update(slug, {
      status: publish ? 'PUBLISHED' : 'DRAFT',
    });
  },
};
