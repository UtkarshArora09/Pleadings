/**
 * Security sanitization, URL validation, JSON-LD escaping, file magic-byte verification,
 * and optional Cloudflare Turnstile verification.
 */

export function escapeHtml(input: unknown): string {
  return String(input ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Safely serialize an object for embedding inside <script type="application/ld+json">.
 * Escapes `<`, `>`, `&`, U+2028, and U+2029 to prevent </script> tag breakout XSS.
 */
export function safeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

/**
 * Validates that a URL uses an allowed http/https protocol (or safe root-relative path).
 * Blocks javascript:, data:, vbscript:, file:, and protocol-relative // redirects.
 */
export function sanitizeHttpUrl(
  rawUrl?: string | null,
  fallback = 'https://indiankanoon.org/'
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return fallback;

  // Allow safe root-relative internal paths (but reject protocol-relative //evil.com)
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
  } catch {
    return fallback;
  }

  return fallback;
}

/**
 * Validates post-login redirect URLs so /admin/login?returnUrl=... can never open-redirect
 * to an external domain or non-admin route.
 */
export function validateSafeReturnUrl(
  rawUrl?: string | null,
  fallback = '/admin'
): string {
  if (!rawUrl || typeof rawUrl !== 'string') return fallback;
  const trimmed = rawUrl.trim();
  // Must be a single-slash internal path under /admin (no //, no backslashes, no control chars)
  if (
    !trimmed.startsWith('/admin') ||
    trimmed.startsWith('//') ||
    trimmed.includes('\\') ||
    /[\r\n\0]/.test(trimmed) ||
    trimmed.startsWith('/admin/login')
  ) {
    return fallback;
  }
  return trimmed;
}

export interface VerifiedFileSignature {
  valid: boolean;
  mimeType?: 'image/jpeg' | 'image/png' | 'image/webp' | 'application/pdf';
  extension?: 'jpg' | 'png' | 'webp' | 'pdf';
  error?: string;
}

/**
 * Inspects actual binary magic bytes rather than trusting client-supplied MIME headers or filenames.
 * Explicitly excludes SVG (stored XSS risk) and executables.
 */
export function verifyFileMagicBytes(
  buffer: Buffer,
  mode: 'image' | 'ocr'
): VerifiedFileSignature {
  if (!buffer || buffer.length < 12) {
    return { valid: false, error: 'File is empty or corrupted.' };
  }

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, mimeType: 'image/jpeg', extension: 'jpg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, mimeType: 'image/png', extension: 'png' };
  }

  // WebP: RIFF....WEBP
  if (
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { valid: true, mimeType: 'image/webp', extension: 'webp' };
  }

  // PDF: %PDF- (allowed in OCR mode only)
  if (mode === 'ocr' && buffer.subarray(0, 5).toString('ascii') === '%PDF-') {
    return { valid: true, mimeType: 'application/pdf', extension: 'pdf' };
  }

  return {
    valid: false,
    error:
      mode === 'ocr'
        ? 'Unsupported or invalid file signature. Only verified PDF, JPG, PNG, and WebP files are accepted.'
        : 'Unsupported or invalid image signature. Only verified JPG, PNG, and WebP images are accepted (SVG is disallowed).',
  };
}

/**
 * Optional Cloudflare Turnstile verification (active when TURNSTILE_SECRET_KEY is configured).
 */
export async function verifyTurnstileToken(
  token?: string | null,
  remoteIp?: string
): Promise<{ ok: boolean; reason?: string }> {
  const secret = (process.env.TURNSTILE_SECRET_KEY || '').trim();
  if (!secret) {
    // Turnstile not configured yet — rely on honeypot + rate limiting
    return { ok: true };
  }

  if (!token || typeof token !== 'string' || !token.trim()) {
    return { ok: false, reason: 'Human verification check is required.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const formBody = new URLSearchParams();
    formBody.set('secret', secret);
    formBody.set('response', token.trim());
    if (remoteIp && remoteIp !== 'unknown') {
      formBody.set('remoteip', remoteIp);
    }

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody.toString(),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { ok: false, reason: 'Verification service temporarily unavailable.' };
    }

    const data = (await res.json()) as { success?: boolean };
    return data.success ? { ok: true } : { ok: false, reason: 'Verification challenge failed. Please retry.' };
  } catch {
    return { ok: false, reason: 'Verification check timed out. Please retry.' };
  }
}
