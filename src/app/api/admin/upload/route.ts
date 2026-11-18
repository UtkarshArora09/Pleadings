import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { isRequestAuthenticated } from '@/lib/auth';
import { verifyFileMagicBytes } from '@/lib/security/sanitize';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB hard limit

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  const clientIp = getClientIp(request);
  const rl = await checkRateLimit(clientIp, {
    prefix: 'admin-upload',
    limit: 30,
    windowSec: 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Upload rate limit exceeded. Please retry shortly.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawSlug = String(formData.get('slug') || 'case');
    const rawType = String(formData.get('type') || 'poster');

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No image file provided in upload request.' },
        { status: 400 }
      );
    }

    // Reject oversized files BEFORE allocating full buffer in memory
    if (typeof file.size === 'number' && file.size > MAX_IMAGE_BYTES) {
      logSecurityEvent('admin_upload_oversized', 'warn', { ip: clientIp, bytes: file.size });
      return NextResponse.json(
        { success: false, error: 'Image exceeds the 5 MB maximum upload size.' },
        { status: 413 }
      );
    }

    // Explicitly block SVG and unknown client-declared MIME types
    const allowedClientMimes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
    if (file.type && !allowedClientMimes.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'Invalid file format. Only JPG, PNG, and WebP images are permitted.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    if (bytes.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { success: false, error: 'Image exceeds the 5 MB maximum upload size.' },
        { status: 413 }
      );
    }

    const buffer = Buffer.from(bytes);

    // Inspect binary magic bytes — never trust file.type or file.name extension
    const sig = verifyFileMagicBytes(buffer, 'image');
    if (!sig.valid || !sig.mimeType || !sig.extension) {
      logSecurityEvent('admin_upload_invalid_signature', 'warn', { ip: clientIp });
      return NextResponse.json(
        { success: false, error: sig.error || 'Invalid image file signature.' },
        { status: 400 }
      );
    }

    const safeSlug = rawSlug.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 60) || 'case';
    const safeType = rawType.toLowerCase().replace(/[^a-z0-9_-]/g, '-').slice(0, 30) || 'poster';
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const fileName = `${safeSlug}-${safeType}-${uniqueSuffix}.${sig.extension}`;

    let publicUrl = `/images/cases/${fileName}`;

    const { uploadImageToSupabase, isSupabaseConfigured } = await import('@/lib/supabase');
    if (isSupabaseConfigured()) {
      const supabaseUrl = await uploadImageToSupabase(buffer, fileName, sig.mimeType);
      if (supabaseUrl) {
        publicUrl = supabaseUrl;
      }
    }

    if (!publicUrl.startsWith('http')) {
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'images', 'cases');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
      } catch {
        publicUrl = `data:${sig.mimeType};base64,${buffer.toString('base64')}`;
      }
    }

    logSecurityEvent('admin_upload_success', 'info', {
      ip: clientIp,
      fileName,
      mimeType: sig.mimeType,
      bytes: buffer.length,
    });

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
    });
  } catch {
    logSecurityEvent('admin_upload_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
