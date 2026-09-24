import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { getCaseBySlug } from '@/lib/cases';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug required' }, { status: 400 });
    }

    const dynamicCase = await CaseStore.getBySlugAsync(slug);
    if (dynamicCase) {
      return NextResponse.json({ success: true, case: dynamicCase });
    }

    const fallbackCase = getCaseBySlug(slug);
    if (fallbackCase) {
      return NextResponse.json({ success: true, case: fallbackCase });
    }

    return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching case by slug:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
