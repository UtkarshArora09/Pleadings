import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { processCaseIngestion } from '@/lib/ai/pipeline';
import { isRequestAuthenticated } from '@/lib/auth';
import { sendAdminCaseCreatedEmail } from '@/lib/email';
import { CaseData } from '@/types';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const cases = await CaseStore.getAllAsync();
    return NextResponse.json(
      { success: true, cases },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error) {
    console.error('Error fetching admin cases:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const body = await request.json();

    const titleStr = typeof body.title === 'string'
      ? body.title
      : (body.title?.en || body.slug || '');

    const courtStr = body.court || 'Supreme Court of India';
    const yearNum = typeof body.year === 'number' ? body.year : parseInt(body.year) || new Date().getFullYear();
    const genreStr = body.genre || 'constitutional';
    const statuteSectionsStr = body.statuteSections || body.categoryTag || body.brief?.chargesApplied?.join('; ') || 'Constitutional Law';

    if (!titleStr.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required case title.' },
        { status: 400 }
      );
    }

    let caseToSave: CaseData;

    // Check if body is an already structured CaseData (e.g. from OCR scanner or direct review)
    if (body.episodes && Array.isArray(body.episodes) && body.episodes.length > 0) {
      caseToSave = {
        ...body,
        court: courtStr,
        year: yearNum,
        genre: genreStr,
        categoryTag: body.categoryTag || statuteSectionsStr,
        updatedAt: new Date().toISOString(),
      };
    } else {
      // Process using AI extraction & structuring pipeline from raw form fields
      const generated = await processCaseIngestion({
        ...body,
        title: titleStr,
        court: courtStr,
        year: yearNum,
        genre: genreStr,
        statuteSections: statuteSectionsStr,
        factsSummary: body.factsSummary || body.brief?.facts?.en || titleStr,
      });
      caseToSave = generated as unknown as CaseData;
    }

    // Save directly to Supabase Database / CaseStore
    const savedCase = await CaseStore.create(caseToSave as any);

    // Send Admin Notification Email
    try {
      await sendAdminCaseCreatedEmail(savedCase);
    } catch (emailErr) {
      console.warn('Admin case creation email notice warning:', emailErr);
    }

    return NextResponse.json({ success: true, case: savedCase });
  } catch (error) {
    console.error('Error ingesting case:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process case ingestion' },
      { status: 500 }
    );
  }
}
