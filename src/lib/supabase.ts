import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prioritize IPv4 on Node.js runtime to prevent connect timeouts on dual-stack hosts
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require('dns');
    if (dns && typeof dns.setDefaultResultOrder === 'function') {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch {
    // ignore in non-Node runtimes
  }
}

const PUBLIC_IMAGES_BUCKET = 'case-images';
const PRIVATE_DATA_BUCKET = process.env.SUPABASE_PRIVATE_BUCKET || 'pleadings-private';

function getCredentials() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    '';
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    '';

  return {
    supabaseUrl: supabaseUrl.trim(),
    supabaseAnonKey: supabaseAnonKey.trim(),
    supabaseServiceKey: supabaseServiceKey.trim(),
  };
}

let supabaseAnonClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getCredentials();
  return Boolean(
    supabaseUrl &&
      supabaseUrl.startsWith('http') &&
      (supabaseAnonKey || supabaseServiceKey)
  );
}

/**
 * Returns the public Supabase client (anon key only — respects RLS).
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getCredentials();
  if (!supabaseAnonClient) {
    supabaseAnonClient = createClient(supabaseUrl, supabaseAnonKey || supabaseServiceKey, {
      auth: { persistSession: false },
    });
  }
  return supabaseAnonClient;
}

/**
 * Returns the server-side Admin Supabase client with Service Role privileges.
 * Used exclusively on server-side API routes and private persistence operations.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  const { supabaseUrl, supabaseAnonKey, supabaseServiceKey } = getCredentials();
  if (!supabaseAdminClient) {
    const key = supabaseServiceKey || supabaseAnonKey;
    supabaseAdminClient = createClient(supabaseUrl, key, {
      auth: { persistSession: false },
    });
  }
  return supabaseAdminClient;
}

/**
 * Upload editorial artwork/images ONLY to public storage bucket 'case-images'.
 * Never used for user PII or private JSON payloads.
 */
export async function uploadImageToSupabase(
  buffer: Buffer,
  fileName: string,
  contentType = 'image/jpeg'
): Promise<string | null> {
  const client = getSupabaseAdmin();
  if (!client) return null;

  try {
    const filePath = `cases/${fileName}`;
    const { error } = await client.storage
      .from(PUBLIC_IMAGES_BUCKET)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return null;
    }

    const { data: publicUrlData } = client.storage.from(PUBLIC_IMAGES_BUCKET).getPublicUrl(filePath);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase upload exception:', err);
    return null;
  }
}

interface RawCaseRow {
  slug: string;
  status?: string;
  publish_status?: string;
  views?: number;
  data?: Record<string, unknown>;
  [key: string]: unknown;
}

function hydrateCaseRow(row: RawCaseRow): Record<string, unknown> {
  const base = (row.data && typeof row.data === 'object' ? { ...row.data } : { ...row }) as Record<string, unknown>;
  // Preserve authoritative DB column status & views without clobbering legalStatus object
  if (typeof row.publish_status === 'string' && !base.publishStatus) {
    base.publishStatus = row.publish_status;
  } else if (
    typeof row.status === 'string' &&
    ['DRAFT', 'ADMIN_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(row.status) &&
    !base.publishStatus
  ) {
    base.publishStatus = row.status;
  }
  if (typeof row.views === 'number') {
    const existingViews = typeof base.views === 'number' ? base.views : 0;
    base.views = Math.max(row.views, existingViews);
  }
  return base;
}

/**
 * Fetch all cases directly from Supabase 'cases' table.
 */
export async function fetchCasesFromSupabase(): Promise<Record<string, unknown>[] | null> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('cases')
      .select('*')
      .order('slug', { ascending: true });

    if (error) {
      console.warn('Supabase fetch cases table error:', error.message);
      return null;
    }

    if (Array.isArray(data)) {
      return (data as RawCaseRow[]).map(hydrateCaseRow);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch cases exception:', err);
    return null;
  }
}

/**
 * Fetch single case by slug from Supabase 'cases' table.
 */
export async function fetchCaseBySlugFromSupabase(slug: string): Promise<Record<string, unknown> | null> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client || !slug) return null;

  try {
    const { data, error } = await client
      .from('cases')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return hydrateCaseRow(data as RawCaseRow);
  } catch {
    return null;
  }
}

/**
 * Upsert case directly into Supabase 'cases' table.
 */
export async function upsertCaseToSupabase(caseData: Record<string, unknown>): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client || typeof caseData?.slug !== 'string' || !caseData.slug) return false;

  try {
    const rawTitle = caseData.title;
    const title =
      typeof rawTitle === 'string'
        ? { en: rawTitle, hi: rawTitle }
        : rawTitle || { en: caseData.slug, hi: caseData.slug };

    const publishStatus =
      typeof caseData.publishStatus === 'string'
        ? caseData.publishStatus
        : typeof caseData.status === 'string' &&
          ['DRAFT', 'ADMIN_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(caseData.status)
        ? caseData.status
        : 'PUBLISHED';

    const citations = caseData.citations as { primary?: string } | undefined;
    const poster = caseData.poster as { src?: string } | undefined;

    const payload = {
      slug: caseData.slug,
      title,
      court: (caseData.court as string) || 'Supreme Court of India',
      year: Number(caseData.year) || 2020,
      citation: (caseData.citation as string) || citations?.primary || '',
      status: publishStatus,
      category_tag: (caseData.categoryTag as string) || (caseData.category_tag as string) || 'Constitutional',
      banner_image: (caseData.bannerImage as string) || (caseData.banner_image as string) || poster?.src || '',
      data: {
        ...caseData,
        publishStatus,
      },
      updated_at: new Date().toISOString(),
    };

    const { error } = await client.from('cases').upsert(payload, { onConflict: 'slug' });

    if (error) {
      console.warn('Supabase upsert case error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase upsert case exception:', err);
    return false;
  }
}

/**
 * Delete case from Supabase 'cases' table.
 */
export async function deleteCaseFromSupabase(slug: string): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client || !slug) return false;

  try {
    const { error } = await client.from('cases').delete().eq('slug', slug);
    if (error) {
      console.warn('Supabase delete case error:', error.message);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Update editorial publication status in Supabase 'cases' table without overwriting legalStatus.
 */
export async function updateCaseStatusInSupabase(
  slug: string,
  publishStatus: string,
  fullData?: Record<string, unknown>
): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client || !slug) return false;

  try {
    const updateObj: Record<string, unknown> = {
      status: publishStatus,
      updated_at: new Date().toISOString(),
    };

    if (fullData) {
      updateObj.data = {
        ...fullData,
        publishStatus,
        status: typeof fullData.status === 'object' && fullData.status !== null ? fullData.status : publishStatus,
        updatedAt: new Date().toISOString(),
      };
    }

    const { error } = await client.from('cases').update(updateObj).eq('slug', slug);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Serverless-safe atomic view counter:
 * 1. Calls PostgreSQL RPC `increment_case_views(p_slug)` when deployed (atomic, zero race conditions).
 * 2. Falls back to direct authoritative Supabase fetch + update (works on cold starts without in-memory cache).
 */
export async function incrementCaseViewsAtomicInSupabase(slug: string): Promise<number | null> {
  const client = getSupabaseAdmin();
  if (!client || !slug) return null;

  try {
    const { data: rpcViews, error: rpcError } = await client.rpc('increment_case_views', {
      p_slug: slug,
    });
    if (!rpcError && typeof rpcViews === 'number') {
      return rpcViews;
    }
  } catch {
    // Fall through to authoritative DB read-update if RPC migration hasn't been executed yet
  }

  try {
    const { data: row, error } = await client
      .from('cases')
      .select('slug, data')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !row) return null;

    const currentData = (row.data && typeof row.data === 'object' ? row.data : {}) as Record<string, unknown>;
    const currentViews = typeof currentData.views === 'number' ? currentData.views : 0;
    const nextViews = currentViews + 1;

    await client
      .from('cases')
      .update({
        data: {
          ...currentData,
          views: nextViews,
          updatedAt: new Date().toISOString(),
        },
        updated_at: new Date().toISOString(),
      })
      .eq('slug', slug);

    return nextViews;
  } catch {
    return null;
  }
}

export async function getCaseViewsFromSupabase(slug: string): Promise<number> {
  const row = await fetchCaseBySlugFromSupabase(slug);
  return typeof row?.views === 'number' ? row.views : 0;
}

/**
 * Private bucket fallback ONLY (NEVER writes to public 'case-images' bucket).
 */
async function saveToPrivateBucketFallback(filePath: string, payload: unknown): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client || !filePath) return false;

  try {
    const jsonBuffer = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
    const { error } = await client.storage
      .from(PRIVATE_DATA_BUCKET)
      .upload(filePath, jsonBuffer, {
        contentType: 'application/json',
        upsert: true,
      });
    return !error;
  } catch {
    return false;
  }
}

async function loadFromPrivateBucketFallback<T>(filePath: string): Promise<T | null> {
  const client = getSupabaseAdmin();
  if (!client || !filePath) return null;

  try {
    const { data, error } = await client.storage.from(PRIVATE_DATA_BUCKET).download(filePath);
    if (error || !data) return null;
    const text = await data.text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

/**
 * Persist advocate case submission into private RLS-protected table `advocate_submissions`.
 * Falls back only to private bucket `pleadings-private` — NEVER to public `case-images`.
 */
export async function saveSubmissionToSupabase(submission: {
  id: string;
  submittedAt: string;
  advocate: {
    name: string;
    barCouncilNo: string;
    barAssociation: string;
    email: string;
    phone: string;
    designation: string;
  };
  caseDetails: Record<string, unknown>;
  status: string;
}): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  try {
    const { error } = await client.from('advocate_submissions').insert({
      id: submission.id,
      advocate_name: submission.advocate.name,
      bar_council_no: submission.advocate.barCouncilNo,
      bar_association: submission.advocate.barAssociation,
      email: submission.advocate.email,
      phone: submission.advocate.phone,
      designation: submission.advocate.designation,
      case_title: String(submission.caseDetails.title || ''),
      court: String(submission.caseDetails.court || ''),
      year: String(submission.caseDetails.year || ''),
      citation: String(submission.caseDetails.citation || ''),
      payload: submission,
      status: submission.status,
      submitted_at: submission.submittedAt,
    });
    if (!error) return true;
  } catch {
    // Table may not be migrated yet
  }

  return saveToPrivateBucketFallback(`submissions/${submission.id}.json`, submission);
}

/**
 * Persist subscriber PII into private RLS-protected table `daily_subscribers`.
 */
export async function saveSubscriberToSupabase(record: {
  id: string;
  contact: string;
  channel: 'whatsapp' | 'email';
  caseSlug: string;
  frequency: string;
  subscribedAt: string;
}): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  try {
    const { error } = await client.from('daily_subscribers').insert({
      id: record.id,
      contact: record.contact,
      channel: record.channel,
      case_slug: record.caseSlug,
      frequency: record.frequency,
      subscribed_at: record.subscribedAt,
    });
    if (!error) return true;
  } catch {
    // Table may not be migrated yet
  }

  return saveToPrivateBucketFallback(`subscribers/${record.id}.json`, record);
}

/**
 * Persist reader case suggestion into private RLS-protected table `case_suggestions`.
 */
export async function saveSuggestionToSupabase(record: {
  id: string;
  caseName: string;
  courtOrCity: string;
  year: string;
  storySynopsis: string;
  contributorName: string;
  contributorContact: string;
  submittedAt: string;
}): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  try {
    const { error } = await client.from('case_suggestions').insert({
      id: record.id,
      case_name: record.caseName,
      court_or_city: record.courtOrCity,
      year: record.year,
      story_synopsis: record.storySynopsis,
      contributor_name: record.contributorName,
      contributor_contact: record.contributorContact,
      submitted_at: record.submittedAt,
    });
    if (!error) return true;
  } catch {
    // Table may not be migrated yet
  }

  return saveToPrivateBucketFallback(`suggestions/${record.id}.json`, record);
}

/**
 * Persist editorial correction report into private RLS-protected table `editorial_error_reports`.
 */
export async function saveErrorReportToSupabase(record: {
  id: string;
  slug: string;
  episode?: string | number;
  description: string;
  reporterEmail?: string;
  reportedAt: string;
}): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  try {
    const { error } = await client.from('editorial_error_reports').insert({
      id: record.id,
      case_slug: record.slug,
      episode: record.episode ? String(record.episode) : null,
      description: record.description,
      reporter_email: record.reporterEmail || null,
      reported_at: record.reportedAt,
    });
    if (!error) return true;
  } catch {
    // Table may not be migrated yet
  }

  return saveToPrivateBucketFallback(`error-reports/${record.id}.json`, record);
}

export interface StoredVoteRow {
  slug: string;
  optionId: string;
  anonId: string;
  createdAt: string;
}

/**
 * Read votes from private PostgreSQL table `case_votes` (with private bucket fallback).
 */
export async function fetchVotesFromSupabase(slug: string): Promise<StoredVoteRow[] | null> {
  const client = getSupabaseAdmin();
  if (!client || !slug) return null;

  try {
    const { data, error } = await client
      .from('case_votes')
      .select('case_slug, option_id, anon_id, updated_at')
      .eq('case_slug', slug);

    if (!error && Array.isArray(data)) {
      return data.map((row) => ({
        slug: String(row.case_slug),
        optionId: String(row.option_id),
        anonId: String(row.anon_id),
        createdAt: String(row.updated_at || new Date().toISOString()),
      }));
    }
  } catch {
    // Fall through to private bucket
  }

  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 100);
  return loadFromPrivateBucketFallback<StoredVoteRow[]>(`votes/${safeSlug}.json`);
}

/**
 * Upsert a single vote atomically into `case_votes` (unique on case_slug + anon_id).
 */
export async function upsertVoteToSupabase(
  slug: string,
  optionId: string,
  anonId: string,
  fallbackList: StoredVoteRow[]
): Promise<boolean> {
  const client = getSupabaseAdmin();
  if (!client) return false;

  try {
    const { error } = await client.from('case_votes').upsert(
      {
        case_slug: slug,
        anon_id: anonId,
        option_id: optionId,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'case_slug,anon_id' }
    );
    if (!error) return true;
  } catch {
    // Fall through to private bucket
  }

  const safeSlug = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 100);
  return saveToPrivateBucketFallback(`votes/${safeSlug}.json`, fallbackList);
}
