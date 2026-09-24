import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Prioritize IPv4 on Node.js runtime to prevent connect timeouts on dual-stack hosts
if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const dns = require('dns');
    if (dns && typeof dns.setDefaultResultOrder === 'function') {
      dns.setDefaultResultOrder('ipv4first');
    }
  } catch {}
}

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
    supabaseAnonKey;

  return { supabaseUrl: supabaseUrl.trim(), supabaseAnonKey: supabaseAnonKey.trim(), supabaseServiceKey: supabaseServiceKey.trim() };
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
 * Returns the public Supabase client (safe for browser & client-side queries)
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
 * Returns the Admin Supabase client with Service Role privileges
 * (Used on server-side API routes and database operations)
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
 * Upload image to public storage bucket 'case-images'
 */
export async function uploadImageToSupabase(
  buffer: Buffer,
  fileName: string,
  contentType = 'image/jpeg'
): Promise<string | null> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client) return null;

  try {
    const bucketName = 'case-images';
    const filePath = `cases/${fileName}`;

    const { error } = await client.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return null;
    }

    const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(filePath);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase upload exception:', err);
    return null;
  }
}

/**
 * Fetch all cases directly from Supabase 'cases' table
 */
export async function fetchCasesFromSupabase(): Promise<any[] | null> {
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
      return data.map((row) => row.data || row);
    }
    return null;
  } catch (err) {
    console.warn('Supabase fetch cases exception:', err);
    return null;
  }
}

/**
 * Fetch single case by slug from Supabase 'cases' table
 */
export async function fetchCaseBySlugFromSupabase(slug: string): Promise<any | null> {
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

    return data.data || data;
  } catch {
    return null;
  }
}

/**
 * Upsert case directly into Supabase 'cases' table
 */
export async function upsertCaseToSupabase(caseData: any): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client || !caseData?.slug) return false;

  try {
    const title = typeof caseData.title === 'string'
      ? { en: caseData.title, hi: caseData.title }
      : (caseData.title || { en: caseData.slug, hi: caseData.slug });

    const payload = {
      slug: caseData.slug,
      title: title,
      court: caseData.court || 'Supreme Court of India',
      year: Number(caseData.year) || 2020,
      citation: caseData.citation || caseData.citations?.primary || '',
      status: caseData.status || 'PUBLISHED',
      category_tag: caseData.categoryTag || caseData.category_tag || 'Constitutional',
      banner_image: caseData.bannerImage || caseData.banner_image || caseData.poster?.src || '',
      data: caseData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await client
      .from('cases')
      .upsert(payload, { onConflict: 'slug' });

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
 * Delete case from Supabase 'cases' table
 */
export async function deleteCaseFromSupabase(slug: string): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client || !slug) return false;

  try {
    const { error } = await client
      .from('cases')
      .delete()
      .eq('slug', slug);

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
 * Update case status in Supabase 'cases' table
 */
export async function updateCaseStatusInSupabase(slug: string, status: string, fullData?: any): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client || !slug) return false;

  try {
    const updateObj: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (fullData) {
      updateObj.data = {
        ...fullData,
        status,
        updatedAt: new Date().toISOString(),
      };
    }

    const { error } = await client
      .from('cases')
      .update(updateObj)
      .eq('slug', slug);

    return !error;
  } catch {
    return false;
  }
}

/**
 * Increment view count in Supabase 'cases' table
 */
export async function incrementCaseViewsInSupabase(slug: string, newViews: number, fullData?: any): Promise<void> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client || !slug) return;

  try {
    const updateObj: any = {
      updated_at: new Date().toISOString(),
    };

    if (fullData) {
      updateObj.data = {
        ...fullData,
        views: newViews,
        updatedAt: new Date().toISOString(),
      };
    }

    await client
      .from('cases')
      .update(updateObj)
      .eq('slug', slug);
  } catch {}
}

/**
 * Save an advocate case contribution submission
 */
export async function saveSubmissionToSupabase(submission: any): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client) return false;

  try {
    const bucketName = 'case-images';
    const timestamp = Date.now();
    const safeTitle = (submission.caseTitle || 'case')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .slice(0, 30);
    const filePath = `submissions/${timestamp}-${safeTitle}.json`;
    const jsonBuffer = Buffer.from(JSON.stringify(submission, null, 2), 'utf-8');

    const { error } = await client.storage
      .from(bucketName)
      .upload(filePath, jsonBuffer, {
        contentType: 'application/json',
        upsert: true,
      });

    return !error;
  } catch {
    return false;
  }
}
