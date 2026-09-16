import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { processCaseIngestion } from '@/lib/ai/pipeline';
import { AdminIngestPayload } from '@/types';
import { isRequestAuthenticated } from '@/lib/auth';

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const cases = CaseStore.getAll();
    return NextResponse.json({ success: true, cases });
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
    const body: AdminIngestPayload = await request.json();

    if (!body.title || !body.court || !body.year || !body.genre || !body.statuteSections) {
      return NextResponse.json(
        { success: false, error: 'Missing required case metadata fields.' },
        { status: 400 }
      );
    }

    // Process using AI extraction & structuring pipeline
    const generatedCase = await processCaseIngestion(body);

    // Save to dynamic store with ADMIN_REVIEW status
    const savedCase = CaseStore.create(generatedCase);

    return NextResponse.json({ success: true, case: savedCase });
  } catch (error) {
    console.error('Error ingesting case:', error);
    return NextResponse.json({ success: false, error: 'Failed to process case ingestion' }, { status: 500 });
  }
}
