import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { isRequestAuthenticated } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body = await request.json().catch(() => ({}));
    const publish = body.publish !== undefined ? Boolean(body.publish) : true;

    const updated = CaseStore.setPublishStatus(slug, publish);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: updated });
  } catch (error) {
    console.error('Error toggling publish status:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
