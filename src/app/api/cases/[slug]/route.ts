import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { getCaseBySlug } from '@/lib/cases';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    // 1. Check static cases
    const staticCase = getCaseBySlug(slug);
    if (staticCase) {
      return NextResponse.json({ success: true, case: staticCase });
    }

    // 2. Check dynamic CaseStore
    const dynamicCase = CaseStore.getBySlug(slug);
    if (dynamicCase) {
      return NextResponse.json({ success: true, case: dynamicCase });
    }

    return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching case by slug:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
