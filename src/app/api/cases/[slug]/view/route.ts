import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { checkRateLimit, getClientIp } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' };

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length > 200) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }

    const clientIp = getClientIp(request);
    // Deduplicate rapid repeat view increments per IP+slug (1 counted view per 10 minutes)
    const rl = await checkRateLimit(`${clientIp}:${slug}`, {
      prefix: 'case-view',
      limit: 1,
      windowSec: 600,
    });

    if (!rl.allowed) {
      const views = await CaseStore.getViewsAsync(slug);
      return NextResponse.json({ success: true, slug, views, deduplicated: true }, { headers: NO_STORE });
    }

    const views = await CaseStore.recordViewAsync(slug);
    return NextResponse.json({ success: true, slug, views }, { headers: NO_STORE });
  } catch (error) {
    console.error('Error recording case view:', error);
    return NextResponse.json({ success: false, error: 'Failed to record view' }, { status: 500 });
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || slug.length > 200) {
      return NextResponse.json({ success: false, error: 'Slug is required' }, { status: 400 });
    }
    const views = await CaseStore.getViewsAsync(slug);
    return NextResponse.json({ success: true, slug, views }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to get views' }, { status: 500 });
  }
}
