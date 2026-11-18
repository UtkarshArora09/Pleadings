import { NextRequest, NextResponse } from 'next/server';
import { getPublishedCaseBySlugAsync } from '@/lib/cases';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length > 200) {
      return NextResponse.json({ success: false, error: 'Valid slug required' }, { status: 400 });
    }

    // Strictly returns ONLY published cases — blocks DRAFT / ADMIN_REVIEW / ARCHIVED disclosure (SEC-008)
    const publishedCase = await getPublishedCaseBySlugAsync(slug);
    if (publishedCase) {
      return NextResponse.json(
        { success: true, case: publishedCase },
        { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
      );
    }

    return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
  } catch (error) {
    console.error('Error fetching case by slug:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
