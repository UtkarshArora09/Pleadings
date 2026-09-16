import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { CaseStore } from '@/lib/db/caseStore';
import { processCaseIngestion } from '@/lib/ai/pipeline';
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
    const body = await request.json();

    if (!body.title || !body.court || !body.year || !body.genre || !body.statuteSections) {
      return NextResponse.json(
        { success: false, error: 'Missing required case metadata fields.' },
        { status: 400 }
      );
    }

    // Process using AI extraction & structuring pipeline
    const generatedCase = await processCaseIngestion(body);

    // Persist as JSON file in content/cases/
    try {
      const casesDir = path.join(process.cwd(), 'content', 'cases');
      if (!fs.existsSync(casesDir)) {
        fs.mkdirSync(casesDir, { recursive: true });
      }
      const caseFilePath = path.join(casesDir, `${generatedCase.slug}.json`);
      fs.writeFileSync(caseFilePath, JSON.stringify(generatedCase, null, 2), 'utf8');
    } catch (fsErr) {
      console.warn('Could not write case file directly to disk (serverless mode):', fsErr);
    }

    // Save to dynamic store with ADMIN_REVIEW status
    const savedCase = CaseStore.create(generatedCase as any);

    return NextResponse.json({ success: true, case: savedCase });
  } catch (error) {
    console.error('Error ingesting case:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to process case ingestion' },
      { status: 500 }
    );
  }
}

