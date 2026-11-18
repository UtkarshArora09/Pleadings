/**
 * Determines whether Next.js <Image> optimization should be bypassed.
 * Data URIs, Blob URLs, and non-allowlisted third-party hosts bypass the optimizer,
 * while local assets and allowlisted Supabase Storage / Unsplash images are optimized
 * into responsive WebP/AVIF formats (PERF-001).
 */
const OPTIMIZABLE_HOSTS = [
  '.supabase.co',
  'images.unsplash.com',
];

export function shouldBypassImageOptimization(src?: string | null): boolean {
  if (!src || typeof src !== 'string') return true;
  const trimmed = src.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return true;
  if (trimmed.startsWith('/')) return false;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    const isAllowlisted = OPTIMIZABLE_HOSTS.some((suffix) =>
      suffix.startsWith('.') ? host.endsWith(suffix) : host === suffix
    );
    return !isAllowlisted;
  } catch {
    return true;
  }
}
