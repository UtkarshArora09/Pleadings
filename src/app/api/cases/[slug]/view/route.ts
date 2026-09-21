import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const views = CaseStore.recordView(slug);
    return NextResponse.json({ success: true, slug, views });
  } catch (error) {
    console.error('Error recording real case view:', error);
    return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const caseItem = CaseStore.getBySlug(slug);
    const views = caseItem?.views || 0;
    return NextResponse.json({ success: true, slug, views });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to get views' }, { status: 500 });
  }
}
