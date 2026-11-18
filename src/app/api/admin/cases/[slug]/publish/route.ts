import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { isRequestAuthenticated } from '@/lib/auth';
import { getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const clientIp = getClientIp(request);

  try {
    const { slug } = await params;
    const body = await request.json().catch(() => ({}));
    const publish = body.publish !== undefined ? Boolean(body.publish) : true;

    const updated = await CaseStore.setPublishStatus(slug, publish);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/browse');
    revalidatePath('/sitemap.xml');
    revalidatePath(`/case/${slug}`);

    logSecurityEvent('admin_case_publish_toggled', 'info', { ip: clientIp, slug, publish });

    return NextResponse.json({ success: true, case: updated });
  } catch {
    logSecurityEvent('admin_case_publish_exception', 'error', { ip: clientIp });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
