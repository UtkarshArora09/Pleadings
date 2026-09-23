import { CaseData, CaseStatus } from '@/types';
import { CASES_DATA } from '@/data/cases';
import { getSupabaseAdmin, getSupabase, isSupabaseConfigured } from '@/lib/supabase';

// Helper to safely access node modules only in server environment
function getNodeModules() {
  if (typeof window !== 'undefined') return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const fs = require('fs');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const path = require('path');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const os = require('os');
    return { fs, path, os };
  } catch {
    return null;
  }
}

// In-memory cache for ultra-fast lookups
let cachedCases: CaseData[] | null = null;
let lastSupabaseFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache before checking Supabase updates

function ensureInitialized(): CaseData[] {
  if (cachedCases && cachedCases.length > 0) return cachedCases;

  const node = getNodeModules();
  if (node) {
    const { fs, path, os } = node;
    const DATA_DIR = path.join(process.cwd(), 'src', 'data');
    const PRIMARY_DB_PATH = path.join(DATA_DIR, 'dynamicCases.json');
    const TMP_DB_PATH = path.join(os.tmpdir(), 'dynamicCases.json');

    // 1. Try reading from PRIMARY_DB_PATH
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ PRIMARY_DB_PATH)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ PRIMARY_DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedCases = parsed;
          return cachedCases;
        }
      }
    } catch (error) {
      console.warn('Error reading dynamicCases.json, trying tmp fallback:', error);
    }

    // 2. Try reading from TMP_DB_PATH (written by serverless functions)
    try {
      if (fs.existsSync(/*turbopackIgnore: true*/ TMP_DB_PATH)) {
        const raw = fs.readFileSync(/*turbopackIgnore: true*/ TMP_DB_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cachedCases = parsed;
          return cachedCases;
        }
      }
    } catch {
      // continue
    }
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
  const node = getNodeModules();
  if (!node) return false;

  const { fs, path, os } = node;
  const DATA_DIR = path.join(process.cwd(), 'src', 'data');
  const PRIMARY_DB_PATH = path.join(DATA_DIR, 'dynamicCases.json');
  const TMP_DB_PATH = path.join(os.tmpdir(), 'dynamicCases.json');
  let saved = false;

  // 1. Try writing directly to primary path
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(PRIMARY_DB_PATH, JSON.stringify(cases, null, 2), 'utf-8');
    saved = true;
  } catch (e) {
    // Primary path may be read-only in Vercel serverless
  }

  // 2. Also write to /tmp on serverless
  try {
    fs.writeFileSync(TMP_DB_PATH, JSON.stringify(cases, null, 2), 'utf-8');
    saved = true;
  } catch {
    // ignore
  }

  return saved;
}

export function buildDefaultLawyerEpisodes(source: any): import('@/types/case').LawyerEpisode[] {
  if (source.lawyerEpisodes && Array.isArray(source.lawyerEpisodes) && source.lawyerEpisodes.length > 0) {
    return source.lawyerEpisodes;
  }

  const advRef = source.advocateReference || {};
  const statutoryText = advRef.statutoryText || [];
  const holdings = advRef.holdings || [];
  const precedents = advRef.precedents || [];
  const citatorHistory = advRef.citatorHistory || [];
  const citatorDisclaimer = advRef.citatorDisclaimer ||
    "These are the citator entries recorded in this report and may not be complete or current. Verify this case's present status through a live citator (SCC Online, Manupatra, or equivalent) before relying on it in an active matter.";
  const parallelCitations = advRef.parallelCitations || source.citations?.parallel || [];

  return [
    {
      id: 'lawyer-ep-1',
      n: 1,
      type: 'STATUTORY_TEXT',
      kicker: 'LAWYER EPISODE 01 · STATUTORY TEXT',
      title: 'Statutory Text As Reproduced In The Judgment',
      description: 'Verbatim statutory provisions and sections reproduced in full by the court.',
      statutoryText: statutoryText,
    },
    {
      id: 'lawyer-ep-2',
      n: 2,
      type: 'ENUMERATED_HOLDINGS',
      kicker: 'LAWYER EPISODE 02 · COURT HOLDINGS',
      title: "The Court's Enumerated Holdings",
      description: "Operative conclusions and findings of law with precise pinpoint citations.",
      holdings: holdings,
    },
    {
      id: 'lawyer-ep-3',
      n: 3,
      type: 'PRECEDENTS_DISCUSSED',
      kicker: 'LAWYER EPISODE 03 · PRECEDENT TREATMENT',
      title: 'Precedents Discussed In This Judgment',
      description: 'Prior authorities cited and their specific judicial treatment by the bench.',
      precedents: precedents,
    },
    {
      id: 'lawyer-ep-4',
      n: 4,
      type: 'CITATOR_HISTORY',
      kicker: 'LAWYER EPISODE 04 · CITATOR HISTORY',
      title: 'Subsequent Citator History',
      description: 'Recorded citator history entries and subsequent judicial references.',
      citatorHistory: citatorHistory,
      citatorDisclaimer: citatorDisclaimer,
    },
    {
      id: 'lawyer-ep-5',
      n: 5,
      type: 'PARALLEL_CITATIONS',
      kicker: 'LAWYER EPISODE 05 · PARALLEL CITATIONS',
      title: 'Full Parallel Citation Index',
      description: 'Cross-reporter citations across AIR, SCC, SCR, SCALE, Cri LJ, and High Court reporters.',
      parallelCitations: parallelCitations,
    },
  ];
}

export function normalizeCaseData(raw: any): CaseData {
  if (!raw) return {} as CaseData;

  // If raw comes from Supabase JSON column 'data'
  const source = raw.data || raw;

  const titleEn = typeof source.title === 'string' ? source.title : (source.title?.en || source.slug || 'Untitled Case');
  const titleHi = typeof source.title === 'string' ? source.title : (source.title?.hi || titleEn);

  const hookEn = typeof source.hook === 'string' ? source.hook : (source.blurb?.en || source.featuredHeroHook?.en || '');
  const hookHi = typeof source.hi?.hook === 'string' ? source.hi.hook : (source.blurb?.hi || source.featuredHeroHook?.hi || hookEn);

  const bannerImage = source.bannerImage || source.banner_image || source.poster?.src || '/images/cases/ghost-case.jpg';
  const court = source.court || 'Supreme Court of India';
  const year = source.year || 2020;
  const citation = source.citations?.primary || source.citation || `${year} INSC 1`;
  const categoryTag = source.categoryTag || source.category_tag || source.doctrines?.[0] || source.tag?.en || 'Constitutional';

  // Canonical 8 episode types in exact order
  const CANONICAL_EP_TYPES = ['HOOK', 'PEOPLE', 'INCIDENT', 'TIMELINE', 'EVIDENCE', 'ARGUMENTS', 'VERDICT', 'RATIO'] as const;

  // If episodes exist (CaseFile structure), map episodes to panels
  let panels = source.panels;
  if (!panels || !Array.isArray(panels) || panels.length < 8) {
    if (source.episodes && Array.isArray(source.episodes) && source.episodes.length >= 8) {
      panels = source.episodes.slice(0, 8).map((ep: any, idx: number) => {
        const epType = CANONICAL_EP_TYPES[idx];
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
    } else if (Array.isArray(panels) && panels.length > 0) {
      // Pad or normalize panels to 8
      const padded = [...panels];
      while (padded.length < 8) {
        const nextIdx = padded.length;
        const epType = CANONICAL_EP_TYPES[nextIdx];
        padded.push({
          id: `panel-${nextIdx + 1}`,
          type: epType,
          eyebrow: { en: `EPISODE 0${nextIdx + 1} · ${epType}`, hi: `एपिसोड 0${nextIdx + 1} · ${epType}` },
          headline: { en: `${titleEn} - Episode ${nextIdx + 1}`, hi: `${titleHi} - एपिसोड ${nextIdx + 1}` },
          body: { en: hookEn, hi: hookHi },
          photoExhibitSrc: bannerImage,
          image: bannerImage,
        });
      }
      panels = padded.slice(0, 8).map((p: any, idx: number) => ({
        ...p,
        id: `panel-${idx + 1}`,
        type: CANONICAL_EP_TYPES[idx],
        eyebrow: p.eyebrow?.en ? p.eyebrow : { en: `EPISODE 0${idx + 1}`, hi: `एपिसोड 0${idx + 1}` },
      }));
    } else {
      panels = CANONICAL_EP_TYPES.map((epType, idx) => ({
        id: `panel-${idx + 1}`,
        type: epType,
        eyebrow: { en: `EPISODE 0${idx + 1} · ${epType}`, hi: `एपिसोड 0${idx + 1} · ${epType}` },
        headline: { en: `${titleEn} · Episode ${idx + 1}`, hi: `${titleHi} · एपिसोड ${idx + 1}` },
        body: { en: hookEn, hi: hookHi },
        photoExhibitSrc: bannerImage,
        image: bannerImage,
      }));
    }
  }

  // Ensure episodes exist with all 3 layers (story, student, advocate)
  let episodes = source.episodes;
  if (!episodes || !Array.isArray(episodes) || episodes.length < 8) {
    episodes = panels.map((p: any, idx: number) => {
      const epNum = idx + 1;
      const bodyText = typeof p.body === 'string' ? p.body : (p.body?.en || hookEn);
      const headlineText = typeof p.headline === 'string' ? p.headline : (p.headline?.en || `${titleEn} · Episode ${epNum}`);
      const eyebrowText = typeof p.eyebrow === 'string' ? p.eyebrow : (p.eyebrow?.en || `EPISODE 0${epNum}`);

      return {
        n: epNum,
        kicker: eyebrowText,
        title: headlineText,
        layers: {
          story: {
            blocks: [{ type: 'para' as const, text: bodyText, source: { tier: 'AMBER' as const } }],
          },
          student: {
            blocks: [{ type: 'para' as const, text: `LEGAL ANALYSIS: ${bodyText}`, source: { tier: 'AMBER' as const } }],
            ratio: epNum >= 7 ? (source.brief?.held?.en || `The ${court} held authoritative construction under ${categoryTag}.`) : undefined,
            obiter: epNum === 7 ? ['Courts must balance constitutional principles with statutory safeguards.'] : undefined,
            examAngle: `Tested in CLAT-PG, Judiciary Mains, and AIBE under ${categoryTag}. Focus on core ratio and legal principles.`,
          },
          advocate: {
            blocks: [{ type: 'para' as const, text: `TRIAL PROPOSITION: Standard of proof and evidentiary rules under ${categoryTag}.`, source: { tier: 'AMBER' as const } }],
            pinpoints: [{ proposition: headlineText, para: epNum === 8 ? 12 : 8 }],
            howToUse: [`Cite this precedent when establishing threshold elements under ${categoryTag}.`],
            howToDistinguish: [`Distinguish on facts if intentional misconduct or statutory exceptions do not apply.`],
          },
        },
        image: p.image || p.photoExhibitSrc ? { src: p.image || p.photoExhibitSrc, alt: headlineText, provenance: 'illustration' as const } : undefined,
        endHook: epNum < 8 ? 'How did the proceedings unfold?' : 'Case dossier complete.',
      };
    });
  } else {
    // If episodes exist, make sure each episode has valid layers structure
    episodes = episodes.slice(0, 8).map((ep: any, idx: number) => {
      const p = panels[idx];
      const storyBlocks = ep.layers?.story?.blocks || [
        { type: 'para' as const, text: typeof p?.body === 'string' ? p.body : (p?.body?.en || hookEn), source: { tier: 'AMBER' as const } }
      ];
      const studentBlocks = ep.layers?.student?.blocks || [
        { type: 'para' as const, text: `LEGAL ANALYSIS: ${storyBlocks[0]?.text || hookEn}`, source: { tier: 'AMBER' as const } }
      ];
      const advocateBlocks = ep.layers?.advocate?.blocks || [
        { type: 'para' as const, text: `TRIAL PROPOSITION: Standard of proof under ${categoryTag}.`, source: { tier: 'AMBER' as const } }
      ];

      return {
        ...ep,
        n: ep.n || idx + 1,
        kicker: ep.kicker || (p?.eyebrow ? (typeof p.eyebrow === 'string' ? p.eyebrow : p.eyebrow.en) : `EPISODE 0${idx + 1}`),
        title: ep.title || (p?.headline ? (typeof p.headline === 'string' ? p.headline : p.headline.en) : `Episode ${idx + 1}`),
        layers: {
          story: {
            ...ep.layers?.story,
            blocks: storyBlocks,
          },
          student: {
            ...ep.layers?.student,
            blocks: studentBlocks,
            ratio: ep.layers?.student?.ratio,
            obiter: ep.layers?.student?.obiter,
            dissent: ep.layers?.student?.dissent,
            examAngle: ep.layers?.student?.examAngle || `Exam consideration under ${categoryTag}.`,
          },
          advocate: {
            ...ep.layers?.advocate,
            blocks: advocateBlocks,
            pinpoints: ep.layers?.advocate?.pinpoints || [{ proposition: ep.title || 'Core proposition', para: 8 }],
            howToUse: ep.layers?.advocate?.howToUse || [`Cite for principle under ${categoryTag}.`],
            howToDistinguish: ep.layers?.advocate?.howToDistinguish || [`Distinguish based on specific factual matrix.`],
          },
        },
      };
    });
  }

  // Ensure brief exists
  const brief = source.brief || {
    courtAndYear: { en: `${court} (${year})`, hi: `${court} (${year})` },
    facts: { en: hookEn, hi: hookHi },
    issues: { en: [source.vote?.question || `Constitutional validity and legal threshold in ${titleEn}`], hi: [source.vote?.question || `${titleEn} में कानूनी प्रश्न`] },
    chargesApplied: source.doctrines || [categoryTag],
    held: { en: source.status?.explain || source.vote?.courtChoseOptionId || 'Judgment rendered by the Bench.', hi: source.status?.explain || 'न्यायालय द्वारा दिया गया निर्णय।' },
    reasoning: { en: `The court established foundational doctrine under ${categoryTag}.`, hi: `न्यायालय ने ${categoryTag} के तहत सिद्धांत प्रतिपादित किया।` },
    whyItMatters: { en: source.status?.explain || 'Essential legal precedent.', hi: 'महत्वपूर्ण न्यायिक मिसाल।' },
  };

  const flashcards = source.flashcards || [
    {
      q: `What was the central issue in ${titleEn}?`,
      a: `Interpretation and application of ${categoryTag} before the ${court}.`,
    },
    {
      q: `What is the core holding?`,
      a: source.brief?.held?.en || `Authoritative judgment delivered by the ${court}.`,
    },
  ];

  const subsequentHistory = source.subsequentHistory || [
    {
      type: 'followed' as const,
      case: `${titleEn} Reference Bench`,
      year: year + 5,
      note: `Affirmed as good law.`,
    },
  ];

  const views = typeof source.views === 'number' ? source.views : 0;

  return {
    ...source,
    slug: source.slug,
    title: { en: titleEn, hi: titleHi },
    tag: { en: categoryTag, hi: categoryTag },
    categoryTag: categoryTag,
    genre: source.genre || 'constitutional',
    theme: source.theme || 'constitutional-gold',
    court: court,
    year: year,
    views: views,
    readTime: source.readTime?.en ? source.readTime : { en: `${source.readingTime?.story || 5} min read`, hi: `${source.readingTime?.story || 5} मिनट` },
    blurb: { en: hookEn, hi: hookHi },
    citation: citation,
    judgmentUrl: source.judgmentUrl || source.sourceUrl || 'https://indiankanoon.org/',
    watermark: source.watermark || '§',
    bannerImage: bannerImage,
    poster: source.poster || { src: bannerImage, alt: `${titleEn} cover poster`, provenance: 'illustration' },
    matchRate: source.matchRate || 98,
    maturityRating: source.maturityRating || 'U/A 13+',
    rank: typeof source.rank === 'number' ? source.rank : 10,
    featuredHeroHook: { en: hookEn, hi: hookHi },
    featuredHeroDesc: { en: hookEn, hi: hookHi },
    panels: panels,
    brief: brief,
    episodes: episodes,
    lawyerEpisodes: buildDefaultLawyerEpisodes(source),
    flashcards: flashcards,
    subsequentHistory: subsequentHistory,
    advocateReference: source.advocateReference || undefined,
    status: source.status === 'DRAFT' || source.status === 'ADMIN_REVIEW'
      ? source.status
      : (source.status?.code ? (source.status?.code === 'GOOD_LAW' ? 'PUBLISHED' : 'ADMIN_REVIEW') : (source.status || 'PUBLISHED')),
    createdAt: source.createdAt || source.created_at || source.publishedAt || new Date().toISOString(),
    updatedAt: source.updatedAt || source.updated_at || new Date().toISOString(),
  };
}

function matchSlug(caseSlug?: string, querySlug?: string): boolean {
  if (!caseSlug || !querySlug) return false;
  const normalize = (s: string) =>
    decodeURIComponent(s)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-');

  const a = normalize(caseSlug);
  const b = normalize(querySlug);
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
  /**
   * Synchronous getter with Supabase background sync
   */
  getAll(): CaseData[] {
    // If Supabase is configured and TTL expired, trigger background sync
    if (isSupabaseConfigured() && Date.now() - lastSupabaseFetchTime > CACHE_TTL_MS) {
      this.syncFromSupabase().catch((err) => console.warn('Supabase sync warning:', err));
    }
    return ensureInitialized();
  },

  async getAllAsync(): Promise<CaseData[]> {
    if (isSupabaseConfigured()) {
      await this.syncFromSupabase();
    }
    return ensureInitialized();
  },

  getPublished(): CaseData[] {
    const all = this.getAll();
    return all.filter((c) => c.status === 'PUBLISHED');
  },

  recordView(slug: string): number {
    const decodedSlug = decodeURIComponent(slug).trim();
    const all = ensureInitialized();
    let idx = all.findIndex((c) => matchSlug(c.slug, decodedSlug));

    if (idx === -1) {
      const loaded = this.getBySlug(decodedSlug);
      if (loaded) {
        const refreshed = ensureInitialized();
        idx = refreshed.findIndex((c) => matchSlug(c.slug, decodedSlug));
      }
    }

    if (idx !== -1) {
      const currentViews: number = typeof all[idx].views === 'number' ? (all[idx].views as number) : 0;
      const newViews = currentViews + 1;
      all[idx].views = newViews;
      persistCases(all);

      if (isSupabaseConfigured()) {
        const targetSlug = all[idx].slug;
        import('@/lib/supabase').then(async ({ saveDynamicCasesToSupabase, getSupabaseAdmin, getSupabase }) => {
          try {
            await saveDynamicCasesToSupabase(all);
          } catch {}

          try {
            const client = getSupabaseAdmin() || getSupabase();
            if (client) {
              await client
                .from('cases')
                .update({ views: newViews, updated_at: new Date().toISOString() })
                .eq('slug', targetSlug);
            }
          } catch {}
        });
      }
      return newViews;
    }
    return 1;
  },

  getBySlug(slug: string): CaseData | null {
    const all = this.getAll();
    const found = all.find((c) => matchSlug(c.slug, slug));
    if (found) return normalizeCaseData(found);

    // Fallback 1: check static CASES_DATA
    const staticCase = CASES_DATA.find((c) => matchSlug(c.slug, slug));
    if (staticCase) {
      const normalized = normalizeCaseData(staticCase);
      return normalized;
    }

    // Fallback 2: check content/cases/*.json on disk
    try {
      const node = getNodeModules();
      if (node) {
        const { fs, path } = node;
        const cleanSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');
        const caseFilePath = path.join(process.cwd(), 'content', 'cases', `${cleanSlug}.json`);
        if (fs.existsSync(/*turbopackIgnore: true*/ caseFilePath)) {
          const raw = fs.readFileSync(/*turbopackIgnore: true*/ caseFilePath, 'utf8');
          const parsed = JSON.parse(raw);
          if (matchSlug(parsed.slug, slug)) {
            const normalized = normalizeCaseData(parsed);
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
    const existingCase = existingIdx >= 0 ? all[existingIdx] : null;
    const viewsToKeep = typeof normalized.views === 'number' && normalized.views > 0
      ? normalized.views
      : (existingCase && typeof existingCase.views === 'number' ? existingCase.views : 0);

    const caseToSave: CaseData = {
      ...normalized,
      views: viewsToKeep,
      status: normalized.status || 'ADMIN_REVIEW',
      createdAt: normalized.createdAt || existingCase?.createdAt || timestamp,
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

    // Sync to content/cases/${slug}.json on disk
    try {
      const node = getNodeModules();
      if (node) {
        const { fs, path } = node;
        const casesDir = path.join(process.cwd(), 'content', 'cases');
        if (!fs.existsSync(/*turbopackIgnore: true*/ casesDir)) fs.mkdirSync(/*turbopackIgnore: true*/ casesDir, { recursive: true });
        const filePath = path.join(casesDir, `${caseToSave.slug}.json`);
        fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(caseToSave, null, 2), 'utf-8');
      }
    } catch (diskErr) {
      console.warn('Could not write disk case file:', diskErr);
    }

    // Async push to Supabase if configured
    if (isSupabaseConfigured()) {
      import('@/lib/supabase').then(async ({ saveDynamicCasesToSupabase, getSupabaseAdmin, getSupabase }) => {
        try {
          await saveDynamicCasesToSupabase(updatedList);
        } catch (e) {
          console.warn('Supabase storage save error:', e);
        }

        try {
          const client = getSupabaseAdmin() || getSupabase();
          if (client) {
            const res = await client
              .from('cases')
              .upsert(
                {
                  slug: caseToSave.slug,
                  title: caseToSave.title,
                  court: caseToSave.court,
                  year: caseToSave.year,
                  citation: caseToSave.citation,
                  status: caseToSave.status,
                  category_tag: caseToSave.categoryTag,
                  banner_image: caseToSave.bannerImage,
                  data: caseToSave,
                  updated_at: timestamp,
                },
                { onConflict: 'slug' }
              );
            if (res.error) console.warn('Supabase upsert error:', res.error.message);
          }
        } catch (err) {
          console.warn('Supabase upsert exception:', err);
        }
      });
    }

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
      const currentItem = current[idx];
      const viewsToKeep = typeof updates.views === 'number' && updates.views > 0
        ? updates.views
        : (typeof currentItem.views === 'number' ? currentItem.views : 0);

      const updatedCase: CaseData = normalizeCaseData({
        ...currentItem,
        ...updates,
        views: viewsToKeep,
        slug: updates.slug || currentItem.slug,
        updatedAt: new Date().toISOString(),
      });
      const updatedList = [...current];
      updatedList[idx] = updatedCase;
      persistCases(updatedList);

      // Sync to content/cases/${slug}.json on disk
      try {
        const node = getNodeModules();
        if (node) {
          const { fs, path } = node;
          const casesDir = path.join(process.cwd(), 'content', 'cases');
          if (!fs.existsSync(/*turbopackIgnore: true*/ casesDir)) fs.mkdirSync(/*turbopackIgnore: true*/ casesDir, { recursive: true });
          const filePath = path.join(casesDir, `${updatedCase.slug}.json`);
          fs.writeFileSync(/*turbopackIgnore: true*/ filePath, JSON.stringify(updatedCase, null, 2), 'utf-8');
        }
      } catch (diskErr) {
        console.warn('Could not sync update to disk file:', diskErr);
      }

      // Async push update to Supabase
      if (isSupabaseConfigured()) {
        import('@/lib/supabase').then(async ({ saveDynamicCasesToSupabase, getSupabaseAdmin, getSupabase }) => {
          try {
            await saveDynamicCasesToSupabase(updatedList);
          } catch (e) {
            console.warn('Supabase storage update error:', e);
          }

          try {
            const client = getSupabaseAdmin() || getSupabase();
            if (client) {
              const res = await client
                .from('cases')
                .upsert(
                  {
                    slug: updatedCase.slug,
                    title: updatedCase.title,
                    court: updatedCase.court,
                    year: updatedCase.year,
                    citation: updatedCase.citation,
                    status: updatedCase.status,
                    category_tag: updatedCase.categoryTag,
                    banner_image: updatedCase.bannerImage,
                    data: updatedCase,
                    updated_at: new Date().toISOString(),
                  },
                  { onConflict: 'slug' }
                );
              if (res.error) console.warn('Supabase update error:', res.error.message);
            }
          } catch (err) {
            console.warn('Supabase update exception:', err);
          }
        });
      }

      return updatedCase;
    }
    return null;
  },

  async getBySlugAsync(slug: string): Promise<CaseData | null> {
    if (isSupabaseConfigured()) {
      await this.syncFromSupabase();
    }
    return this.getBySlug(slug);
  },

  delete(slug: string): boolean {
    const all = ensureInitialized();
    const filtered = all.filter((c) => !matchSlug(c.slug, slug));
    if (filtered.length !== all.length) {
      persistCases(filtered);

      // Remove from content/cases/${slug}.json on disk
      try {
        const node = getNodeModules();
        if (node) {
          const { fs, path } = node;
          const casesDir = path.join(process.cwd(), 'content', 'cases');
          const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
          const possiblePaths = [
            path.join(casesDir, `${slug}.json`),
            path.join(casesDir, `${cleanSlug}.json`),
          ];
          for (const p of possiblePaths) {
            if (fs.existsSync(/*turbopackIgnore: true*/ p)) {
              fs.unlinkSync(/*turbopackIgnore: true*/ p);
            }
          }
        }
      } catch (diskErr) {
        console.warn('Could not delete disk case file:', diskErr);
      }

      if (isSupabaseConfigured()) {
        import('@/lib/supabase').then(async ({ saveDynamicCasesToSupabase, getSupabaseAdmin, getSupabase }) => {
          try {
            await saveDynamicCasesToSupabase(filtered);
          } catch (e) {
            console.warn('Supabase storage delete error:', e);
          }

          try {
            const client = getSupabaseAdmin() || getSupabase();
            if (client) {
              const res = await client
                .from('cases')
                .delete()
                .eq('slug', slug);
              if (res.error) console.warn('Supabase delete error:', res.error.message);
            }
          } catch (err) {
            console.warn('Supabase delete exception:', err);
          }
        });
      }
      return true;
    }
    return false;
  },

  setPublishStatus(slug: string, publish: boolean): CaseData | null {
    return this.update(slug, {
      status: publish ? 'PUBLISHED' : 'DRAFT',
    });
  },

  /**
   * Sync all cases from Supabase (storage or table) into memory and disk cache
   */
  async syncFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const { loadDynamicCasesFromSupabase } = await import('@/lib/supabase');
      
      // 1. Try loading from Supabase Storage JSON (authoritative & works with anon key)
      const storageCases = await loadDynamicCasesFromSupabase();
      if (Array.isArray(storageCases) && storageCases.length > 0) {
        const current = ensureInitialized();
        const currentMap = new Map<string, CaseData>();
        current.forEach((c) => currentMap.set(c.slug, c));

        const normalizedList: CaseData[] = storageCases.map((row: any) => {
          const norm = normalizeCaseData(row);
          const existing = currentMap.get(norm.slug);
          const maxViews = Math.max(
            typeof existing?.views === 'number' ? existing.views : 0,
            typeof norm.views === 'number' ? norm.views : 0
          );
          return {
            ...norm,
            views: maxViews,
          };
        });

        persistCases(normalizedList);
        lastSupabaseFetchTime = Date.now();
        return true;
      }

      // 2. Fallback: try querying Supabase 'cases' table
      const client = getSupabase() || getSupabaseAdmin();
      if (client) {
        const { data, error } = await client
          .from('cases')
          .select('*')
          .order('updated_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const current = ensureInitialized();
          const currentMap = new Map<string, CaseData>();
          current.forEach((c) => currentMap.set(c.slug, c));

          const normalizedList: CaseData[] = data.map((row: any) => {
            const norm = normalizeCaseData(row);
            const existing = currentMap.get(norm.slug);
            const maxViews = Math.max(
              typeof existing?.views === 'number' ? existing.views : 0,
              typeof norm.views === 'number' ? norm.views : 0
            );
            return {
              ...norm,
              views: maxViews,
            };
          });

          persistCases(normalizedList);
          lastSupabaseFetchTime = Date.now();
          return true;
        }
      }
    } catch (err) {
      console.warn('Supabase sync exception:', err);
    }
    return false;
  },
};
