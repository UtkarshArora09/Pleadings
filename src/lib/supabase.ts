import { createClient, SupabaseClient } from '@supabase/supabase-js';

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

let supabaseAnonClient: SupabaseClient | null = null;
let supabaseAdminClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    supabaseUrl &&
    supabaseUrl.trim() !== '' &&
    supabaseUrl.startsWith('http') &&
    supabaseAnonKey &&
    supabaseAnonKey.trim() !== ''
  );
}

/**
 * Returns the public Supabase client (safe for browser & server queries)
 */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!supabaseAnonClient) {
    supabaseAnonClient = createClient(supabaseUrl.trim(), supabaseAnonKey.trim(), {
      auth: { persistSession: false },
    });
  }
  return supabaseAnonClient;
}

/**
 * Returns the Admin Supabase client with Service Role privileges
 * (Used on server-side API routes for database writes & storage uploads)
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;

  if (!supabaseAdminClient) {
    const key = (supabaseServiceKey && supabaseServiceKey.trim() !== '')
      ? supabaseServiceKey.trim()
      : supabaseAnonKey.trim();

    supabaseAdminClient = createClient(supabaseUrl.trim(), key, {
      auth: { persistSession: false },
    });
  }
  return supabaseAdminClient;
}

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

    // Upload image to public bucket
    const { data, error } = await client.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload error:', error.message);
      return null;
    }

    // Get public URL
    const { data: publicUrlData } = client.storage.from(bucketName).getPublicUrl(filePath);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase upload exception:', err);
    return null;
  }
}

/**
 * Persist dynamic cases JSON to Supabase Storage bucket ('case-images/data/dynamicCases.json')
 */
export async function saveDynamicCasesToSupabase(cases: any[]): Promise<boolean> {
  const client = getSupabaseAdmin() || getSupabase();
  if (!client) return false;

  try {
    const bucketName = 'case-images';
    const filePath = 'data/dynamicCases.json';
    const jsonBuffer = Buffer.from(JSON.stringify(cases, null, 2), 'utf-8');

    const { error } = await client.storage
      .from(bucketName)
      .upload(filePath, jsonBuffer, {
        contentType: 'application/json',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase save dynamic cases error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save dynamic cases exception:', err);
    return false;
  }
}

/**
 * Load dynamic cases JSON from Supabase Storage bucket ('case-images/data/dynamicCases.json')
 */
export async function loadDynamicCasesFromSupabase(): Promise<any[] | null> {
  const client = getSupabase() || getSupabaseAdmin();
  if (!client) return null;

  try {
    const bucketName = 'case-images';
    const filePath = 'data/dynamicCases.json';

    const { data, error } = await client.storage
      .from(bucketName)
      .download(filePath);

    if (error || !data) {
      return null;
    }

    const text = await data.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : null;
  } catch (err) {
    return null;
  }
}

/**
 * Save an advocate case contribution submission to Supabase Storage
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

    if (error) {
      console.warn('Supabase save submission error:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save submission exception:', err);
    return false;
  }
}

