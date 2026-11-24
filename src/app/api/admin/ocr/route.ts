import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { scanAndExtractCaseDocument } from '@/lib/ai/ocrScanner';
import { CaseStore } from '@/lib/db/caseStore';
import { isRequestAuthenticated } from '@/lib/auth';
import { sendAdminCaseCreatedEmail } from '@/lib/email';
import { CaseStatus } from '@/types';
import { verifyFileMagicBytes } from '@/lib/security/sanitize';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60;

const MAX_OCR_FILE_BYTES = 15 * 1024 * 1024; // 15 MB hard cap
const MAX_TEXT_PAYLOAD_CHARS = 150_000;
const MAX_CUSTOM_INSTRUCTIONS_CHARS = 1000;

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isSample = searchParams.get('sample') === 'true';

  if (isSample) {
    try {
      const samplePath = path.join(process.cwd(), 'Pleadings_Case_Upload_Template.pdf');
      if (fs.existsSync(samplePath)) {
        const fileBuffer = fs.readFileSync(samplePath);
        const result = await scanAndExtractCaseDocument({
          fileBuffer,
          fileName: 'Pleadings_Case_Upload_Template.pdf',
          mimeType: 'application/pdf',
        });
        return NextResponse.json({
          success: true,
          case: result.caseData,
          rawText: result.rawExtractedText,
          metadata: result.metadata,
        });
      }
    } catch {
      return NextResponse.json({ success: false, error: 'Failed to scan sample template.' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Pleadings High-Precision OCR & Legal Extraction Engine is active.',
    supportedFormats: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    maxUploadSize: '15MB',
  });
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const clientIp = getClientIp(request);
  const rl = await checkRateLimit(clientIp, {
    prefix: 'admin-ocr',
    limit: 10,
    windowSec: 5 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'OCR rate limit reached. Please wait a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let fileBase64 = '';
    let fileBuffer: Buffer | undefined;
    let textPayload: string | undefined;
    let fileName = 'scanned-judgment.pdf';
    let mimeType = 'application/pdf';
    let autoSave = false;
    let publishImmediately = false;
    let customInstructions = '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      autoSave = formData.get('autoSave') === 'true';
      publishImmediately = formData.get('publishImmediately') === 'true';
      customInstructions = String(formData.get('customInstructions') || '').slice(0, MAX_CUSTOM_INSTRUCTIONS_CHARS);

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded in form data.' }, { status: 400 });
      }

      if (typeof file.size === 'number' && file.size > MAX_OCR_FILE_BYTES) {
        return NextResponse.json({ success: false, error: 'Document exceeds the 15 MB maximum upload limit.' }, { status: 413 });
      }

      const arrayBuffer = await file.arrayBuffer();
      if (arrayBuffer.byteLength > MAX_OCR_FILE_BYTES) {
        return NextResponse.json({ success: false, error: 'Document exceeds the 15 MB maximum upload limit.' }, { status: 413 });
      }

      fileBuffer = Buffer.from(arrayBuffer);
      const sig = verifyFileMagicBytes(fileBuffer, 'ocr');
      if (!sig.valid || !sig.mimeType) {
        return NextResponse.json({ success: false, error: sig.error || 'Unsupported file type.' }, { status: 400 });
      }

      fileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || `document.${sig.extension}`;
      mimeType = sig.mimeType;
      fileBase64 = fileBuffer.toString('base64');
    } else {
      const body = await request.json().catch(() => null);
      if (!body || typeof body !== 'object') {
        return NextResponse.json({ success: false, error: 'Invalid JSON request body.' }, { status: 400 });
      }

      fileBase64 = typeof body.fileBase64 === 'string' ? body.fileBase64 : typeof body.pdfBase64 === 'string' ? body.pdfBase64 : '';
      textPayload = typeof body.textPayload === 'string' ? body.textPayload.slice(0, MAX_TEXT_PAYLOAD_CHARS) : undefined;
      autoSave = Boolean(body.autoSave);
      publishImmediately = Boolean(body.publishImmediately);
      customInstructions = typeof body.customInstructions === 'string' ? body.customInstructions.slice(0, MAX_CUSTOM_INSTRUCTIONS_CHARS) : '';

      if (!fileBase64 && !textPayload) {
        return NextResponse.json(
          { success: false, error: 'Missing document payload (fileBase64 or textPayload required).' },
          { status: 400 }
        );
      }

      if (fileBase64) {
        // Approximate decoded byte length before decoding
        if (fileBase64.length > Math.ceil((MAX_OCR_FILE_BYTES * 4) / 3) + 1024) {
          return NextResponse.json({ success: false, error: 'Encoded document exceeds 15 MB limit.' }, { status: 413 });
        }
        fileBuffer = Buffer.from(fileBase64, 'base64');
        const sig = verifyFileMagicBytes(fileBuffer, 'ocr');
        if (!sig.valid || !sig.mimeType) {
          return NextResponse.json({ success: false, error: sig.error || 'Unsupported file signature.' }, { status: 400 });
        }
        mimeType = sig.mimeType;
        fileName = String(body.fileName || `scanned-judgment.${sig.extension}`).replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120);
      }
    }

    const scanResult = await scanAndExtractCaseDocument({
      fileBase64,
      fileBuffer,
      textPayload,
      fileName,
      mimeType,
      customInstructions,
    });

    if (!scanResult.success) {
      return NextResponse.json({ success: false, error: 'Failed to extract case data from document.' }, { status: 500 });
    }

    let finalCaseData = scanResult.caseData;

    if (autoSave || publishImmediately) {
      const statusToSet: CaseStatus = publishImmediately ? 'PUBLISHED' : 'ADMIN_REVIEW';
      finalCaseData.status = statusToSet;
      (finalCaseData as unknown as { publishStatus?: CaseStatus }).publishStatus = statusToSet;

      const saved = await CaseStore.create(finalCaseData);
      finalCaseData = saved;

      if (publishImmediately) {
        revalidatePath('/');
        revalidatePath('/browse');
        revalidatePath('/sitemap.xml');
        revalidatePath(`/case/${saved.slug}`);
      }

      try {
        await sendAdminCaseCreatedEmail(saved);
      } catch {
        // Non-fatal
      }
    }

    logSecurityEvent('admin_ocr_processed', 'info', {
      ip: clientIp,
      fileName,
      savedToPipeline: autoSave || publishImmediately,
    });

    return NextResponse.json({
      success: true,
      case: finalCaseData,
      rawText: scanResult.rawExtractedText,
      metadata: scanResult.metadata,
      savedToPipeline: autoSave || publishImmediately,
    });
  } catch {
    logSecurityEvent('admin_ocr_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Internal error processing OCR scan.' },
      { status: 500 }
    );
  }
}
