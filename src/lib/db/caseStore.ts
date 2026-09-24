import { CaseData, CaseStatus } from '@/types';
import {
  fetchCasesFromSupabase,
  fetchCaseBySlugFromSupabase,
  upsertCaseToSupabase,
  deleteCaseFromSupabase,
  updateCaseStatusInSupabase,
  incrementCaseViewsInSupabase,
  isSupabaseConfigured,
} from '@/lib/supabase';

// In-memory cache for ultra-fast server/SSR lookups
let cachedCases: CaseData[] | null = null;
let lastSupabaseFetchTime = 0;
const CACHE_TTL_MS = 60000; // 1 minute in-memory cache TTL before refreshing from DB

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

  // If raw comes from Supabase JSON column 'data' or top-level row
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
   * Synchronous getter with in-memory caching
   */
  getAll(): CaseData[] {
    if (cachedCases && cachedCases.length > 0) {
      // Refresh cache in background if TTL expired
      if (isSupabaseConfigured() && Date.now() - lastSupabaseFetchTime > CACHE_TTL_MS) {
        this.syncFromSupabase().catch(() => {});
      }
      return cachedCases;
    }
    return cachedCases || [];
  },

  /**
   * Authoritative async getter directly from Supabase PostgreSQL Database
   */
  async getAllAsync(): Promise<CaseData[]> {
    await this.syncFromSupabase();
    return cachedCases || [];
  },

  /**
   * Get all published cases
   */
  getPublished(): CaseData[] {
    const all = this.getAll();
    return all.filter((c) => c.status === 'PUBLISHED');
  },

  /**
   * Record view count directly into Supabase
   */
  recordView(slug: string): number {
    const decodedSlug = decodeURIComponent(slug).trim();
    const all = this.getAll();
    const idx = all.findIndex((c) => matchSlug(c.slug, decodedSlug));

    if (idx !== -1) {
      const currentViews = typeof all[idx].views === 'number' ? all[idx].views : 0;
      const newViews = currentViews + 1;
      all[idx].views = newViews;

      if (isSupabaseConfigured()) {
        incrementCaseViewsInSupabase(all[idx].slug, newViews, all[idx]);
      }
      return newViews;
    }
    return 1;
  },

  /**
   * Synchronously get case by slug from memory
   */
  getBySlug(slug: string): CaseData | null {
    if (!slug) return null;
    const all = this.getAll();
    const found = all.find((c) => matchSlug(c.slug, slug));
    if (found) return normalizeCaseData(found);
    return null;
  },

  /**
   * Authoritative async case retrieval by slug from Supabase
   */
  async getBySlugAsync(slug: string): Promise<CaseData | null> {
    if (!slug) return null;

    if (isSupabaseConfigured()) {
      const dbCase = await fetchCaseBySlugFromSupabase(slug);
      if (dbCase) {
        const normalized = normalizeCaseData(dbCase);
        // Update item in local cache
        if (cachedCases) {
          const idx = cachedCases.findIndex((c) => matchSlug(c.slug, slug));
          if (idx >= 0) {
            cachedCases[idx] = normalized;
          } else {
            cachedCases.push(normalized);
          }
        }
        return normalized;
      }
    }

    return this.getBySlug(slug);
  },

  /**
   * Create new case directly in Supabase
   */
  async create(newCase: any): Promise<CaseData> {
    const normalized = normalizeCaseData(newCase);
    const timestamp = new Date().toISOString();

    const caseToSave: CaseData = {
      ...normalized,
      views: typeof normalized.views === 'number' ? normalized.views : 0,
      status: normalized.status || 'ADMIN_REVIEW',
      createdAt: normalized.createdAt || timestamp,
      updatedAt: timestamp,
    };

    // Upsert directly to Supabase Database
    if (isSupabaseConfigured()) {
      await upsertCaseToSupabase(caseToSave);
    }

    // Update in-memory cache
    if (!cachedCases) cachedCases = [];
    const existingIdx = cachedCases.findIndex((c) => matchSlug(c.slug, caseToSave.slug));
    if (existingIdx >= 0) {
      cachedCases[existingIdx] = caseToSave;
    } else {
      cachedCases.unshift(caseToSave);
    }

    return caseToSave;
  },

  /**
   * Update existing case directly in Supabase
   */
  async update(slug: string, updates: Partial<CaseData>): Promise<CaseData | null> {
    let currentItem = this.getBySlug(slug);
    if (!currentItem && isSupabaseConfigured()) {
      currentItem = await this.getBySlugAsync(slug);
    }

    if (!currentItem) return null;

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

    // Write directly to Supabase Database
    if (isSupabaseConfigured()) {
      await upsertCaseToSupabase(updatedCase);
    }

    // Update local cache
    if (cachedCases) {
      const idx = cachedCases.findIndex((c) => matchSlug(c.slug, slug));
      if (idx >= 0) {
        cachedCases[idx] = updatedCase;
      } else {
        cachedCases.push(updatedCase);
      }
    }

    return updatedCase;
  },

  /**
   * Delete case directly from Supabase
   */
  async delete(slug: string): Promise<boolean> {
    if (isSupabaseConfigured()) {
      await deleteCaseFromSupabase(slug);
    }

    if (cachedCases) {
      cachedCases = cachedCases.filter((c) => !matchSlug(c.slug, slug));
    }

    return true;
  },

  /**
   * Set publish status (PUBLISHED or DRAFT) directly in Supabase
   */
  async setPublishStatus(slug: string, publish: boolean): Promise<CaseData | null> {
    const status: CaseStatus = publish ? 'PUBLISHED' : 'DRAFT';
    let currentItem = this.getBySlug(slug);
    if (!currentItem && isSupabaseConfigured()) {
      currentItem = await this.getBySlugAsync(slug);
    }

    if (currentItem) {
      const updatedCase: CaseData = {
        ...currentItem,
        status,
        updatedAt: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        await updateCaseStatusInSupabase(slug, status, updatedCase);
      }

      if (cachedCases) {
        const idx = cachedCases.findIndex((c) => matchSlug(c.slug, slug));
        if (idx >= 0) {
          cachedCases[idx] = updatedCase;
        }
      }

      return updatedCase;
    }

    return null;
  },

  /**
   * Sync all cases directly from Supabase PostgreSQL Database into memory cache
   */
  async syncFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;

    try {
      const dbCases = await fetchCasesFromSupabase();
      if (Array.isArray(dbCases) && dbCases.length > 0) {
        cachedCases = dbCases.map(normalizeCaseData);
        lastSupabaseFetchTime = Date.now();
        return true;
      }
    } catch (err) {
      console.warn('Supabase database sync exception:', err);
    }
    return false;
  },
};
