import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || supabaseAnonKey;

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

/**
 * Upload an image buffer directly to Supabase Public Storage bucket ('case-images')
 * Returns the permanent public CDN URL.
 */
export async function uploadImageToSupabase(
  buffer: Buffer,
  fileName: string,
  contentType = 'image/jpeg'
): Promise<string | null> {
  const admin = getSupabaseAdmin();
  if (!admin) return null;

  try {
    const bucketName = 'case-images';
    const filePath = `cases/${fileName}`;

    // Ensure bucket exists or attempt upload
    const { data, error } = await admin.storage
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
    const { data: publicUrlData } = admin.storage.from(bucketName).getPublicUrl(filePath);
    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.warn('Supabase upload exception:', err);
    return null;
  }
}
