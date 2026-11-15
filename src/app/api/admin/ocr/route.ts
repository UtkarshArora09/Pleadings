import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { scanAndExtractCaseDocument } from '@/lib/ai/ocrScanner';
import { CaseStore } from '@/lib/db/caseStore';
import { isRequestAuthenticated } from '@/lib/auth';
import { sendAdminCaseCreatedEmail } from '@/lib/email';
import { CaseStatus } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // Allow sufficient time for multi-page OCR & AI synthesis

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const isSample = searchParams.get('sample') === 'true';

  // If testing with the built-in template PDF
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

        return NextResponse.json(result);
      }
    } catch (err: any) {
      return NextResponse.json({ success: false, error: err.message || 'Failed to scan sample template' }, { status: 500 });
    }
  }

  return NextResponse.json({
    success: true,
    message: 'Pleadings High-Precision OCR & Legal Extraction Engine is active.',
    supportedFormats: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    maxUploadSize: '50MB',
  });
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
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
      customInstructions = (formData.get('customInstructions') as string) || '';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded in form data' }, { status: 400 });
      }

      fileName = file.name;
      mimeType = file.type || (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');

      const arrayBuffer = await file.arrayBuffer();
      fileBuffer = Buffer.from(arrayBuffer);
      fileBase64 = fileBuffer.toString('base64');
    } else {
      const body = await request.json();
      fileBase64 = body.fileBase64 || body.pdfBase64 || '';
      if (fileBase64) {
        fileBuffer = Buffer.from(fileBase64, 'base64');
      }
      textPayload = body.textPayload;
      fileName = body.fileName || 'scanned-judgment.pdf';
      mimeType = body.mimeType || (fileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
      autoSave = Boolean(body.autoSave);
      publishImmediately = Boolean(body.publishImmediately);
      customInstructions = body.customInstructions || '';

      if (!fileBase64 && !body.textPayload) {
        return NextResponse.json({ success: false, error: 'Missing document payload (fileBase64 or textPayload required)' }, { status: 400 });
      }
    }

    console.log(`📑 Ingesting document via OCR: ${fileName} (${mimeType}). AutoSave: ${autoSave}, PublishImmediately: ${publishImmediately}`);

    const scanResult = await scanAndExtractCaseDocument({
      fileBase64,
      fileBuffer,
      textPayload,
      fileName,
      mimeType,
      customInstructions,
    });

    if (!scanResult.success) {
      return NextResponse.json({ success: false, error: scanResult.error || 'Failed to extract case data' }, { status: 500 });
    }

    let finalCaseData = scanResult.caseData;

    // If auto-save or direct publishing is requested
    if (autoSave || publishImmediately) {
      const statusToSet: CaseStatus = publishImmediately ? 'PUBLISHED' : 'ADMIN_REVIEW';
      finalCaseData.status = statusToSet;

      // Save to Supabase Database / CaseStore
      const saved = await CaseStore.create(finalCaseData as any);
      finalCaseData = saved;

      // Send email alert for administrative awareness
      try {
        await sendAdminCaseCreatedEmail(saved);
      } catch (emailErr) {
        console.warn('OCR Auto-Save email notification warning:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      case: finalCaseData,
      rawText: scanResult.rawExtractedText,
      metadata: scanResult.metadata,
      savedToPipeline: autoSave || publishImmediately,
    });
  } catch (error: any) {
    console.error('OCR Processing Endpoint Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal error processing OCR scan',
      },
      { status: 500 }
    );
  }
}
