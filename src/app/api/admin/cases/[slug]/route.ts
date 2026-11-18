import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { CaseData } from '@/types';
import { isRequestAuthenticated } from '@/lib/auth';
import { AdminCaseUpdateSchema } from '@/lib/security/schemas';
import { getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate, private' };

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const caseItem = await CaseStore.getBySlugAsync(slug);

    if (!caseItem) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: caseItem }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const clientIp = getClientIp(request);

  try {
    const { slug } = await params;
    const rawBody = await request.json().catch(() => null);
    const parsed = AdminCaseUpdateSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid case update payload.' },
        { status: 400 }
      );
    }

    const updated = await CaseStore.update(slug, parsed.data as unknown as Partial<CaseData>);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/browse');
    revalidatePath('/sitemap.xml');
    revalidatePath(`/case/${slug}`);
    if (updated.slug && updated.slug !== slug) {
      revalidatePath(`/case/${updated.slug}`);
    }

    logSecurityEvent('admin_case_updated', 'info', { ip: clientIp, slug });

    return NextResponse.json({ success: true, case: updated }, { headers: NO_STORE });
  } catch {
    logSecurityEvent('admin_case_update_exception', 'error', { ip: clientIp });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const clientIp = getClientIp(request);

  try {
    const { slug } = await params;
    const deleted = await CaseStore.delete(slug);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    revalidatePath('/');
    revalidatePath('/browse');
    revalidatePath('/sitemap.xml');
    revalidatePath(`/case/${slug}`);

    logSecurityEvent('admin_case_deleted', 'warn', { ip: clientIp, slug });

    return NextResponse.json({ success: true, message: 'Case deleted successfully' }, { headers: NO_STORE });
  } catch {
    logSecurityEvent('admin_case_delete_exception', 'error', { ip: clientIp });
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
