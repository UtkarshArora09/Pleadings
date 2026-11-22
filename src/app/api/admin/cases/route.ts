import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { isRequestAuthenticated } from '@/lib/auth';
import { sendAdminCaseCreatedEmail } from '@/lib/email';
import { CaseData } from '@/types';
import { AdminCaseCreateSchema } from '@/lib/security/schemas';
import { getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const cases = await CaseStore.getAllAsync();
    return NextResponse.json(
      { success: true, cases },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, private' } }
    );
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch cases' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  const clientIp = getClientIp(request);

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = AdminCaseCreateSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid case payload.' },
        { status: 400 }
      );
    }

    const body = parsed.data as Record<string, unknown>;
    const rawTitle = body.title;
    const titleStr =
      typeof rawTitle === 'string'
        ? rawTitle
        : typeof rawTitle === 'object' && rawTitle !== null && 'en' in rawTitle
        ? String((rawTitle as { en?: string }).en || '')
        : String(body.slug || '');

    function slugify(text: string): string {
      return (text || '')
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    const rawSlugCandidate = typeof body.slug === 'string' && body.slug.trim() ? body.slug : titleStr;
    const caseSlug = slugify(rawSlugCandidate) || `case-${Date.now()}`;
    const normalizedTitle =
      typeof rawTitle === 'string'
        ? { en: rawTitle, hi: rawTitle }
        : typeof rawTitle === 'object' && rawTitle !== null
        ? rawTitle
        : { en: titleStr || 'Untitled Case', hi: titleStr || 'Untitled Case' };

    const courtStr = String(body.court || 'Supreme Court of India');
    const yearNum =
      typeof body.year === 'number'
        ? body.year
        : parseInt(String(body.year || ''), 10) || new Date().getFullYear();
    const allowedGenres = new Set(['crime', 'consumer', 'constitutional', 'cyber', 'tort'] as const);
    const rawGenre = String(body.genre || 'constitutional');
    const genreStr = (allowedGenres.has(rawGenre as 'constitutional') ? rawGenre : 'constitutional') as
      | 'crime'
      | 'consumer'
      | 'constitutional'
      | 'cyber'
      | 'tort';
    const briefObj = body.brief as { chargesApplied?: string[]; facts?: { en?: string } } | undefined;
    const statuteSectionsStr =
      String(body.statuteSections || body.categoryTag || briefObj?.chargesApplied?.join('; ') || 'Constitutional Law');

    if (!titleStr.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required case title.' },
        { status: 400 }
      );
    }

    let caseToSave: CaseData;

    if (Array.isArray(body.episodes) && body.episodes.length > 0) {
      caseToSave = {
        ...body,
        slug: caseSlug,
        title: normalizedTitle,
        court: courtStr,
        year: yearNum,
        genre: genreStr,
        categoryTag: String(body.categoryTag || statuteSectionsStr),
        updatedAt: new Date().toISOString(),
      } as unknown as CaseData;
    } else {
      const defaultEpisodes = Array.from({ length: 8 }, (_, i) => ({
        n: i + 1,
        kicker: `EPISODE 0${i + 1}`,
        title: `Episode ${i + 1}`,
        layers: {
          story: {
            blocks: [
              {
                type: 'para' as const,
                text: i === 0 ? String(body.factsSummary || briefObj?.facts?.en || '') : '',
                source: { tier: 'AMBER' as const },
              },
            ],
          },
        },
        endHook: i < 7 ? 'What followed next in the proceedings?' : 'Case dossier complete.',
      }));

      caseToSave = {
        ...body,
        slug: caseSlug,
        title: normalizedTitle,
        court: courtStr,
        year: yearNum,
        genre: genreStr,
        categoryTag: String(body.categoryTag || statuteSectionsStr),
        episodes: defaultEpisodes,
        brief: body.brief || {
          facts: { en: String(body.factsSummary || ''), hi: '' },
          held: { en: '', hi: '' },
          reasoning: { en: '', hi: '' },
        },
        updatedAt: new Date().toISOString(),
      } as unknown as CaseData;
    }

    const savedCase = await CaseStore.create(caseToSave);

    revalidatePath('/');
    revalidatePath('/browse');
    revalidatePath('/sitemap.xml');
    revalidatePath(`/case/${savedCase.slug}`);

    logSecurityEvent('admin_case_created', 'info', { ip: clientIp, slug: savedCase.slug });

    try {
      await sendAdminCaseCreatedEmail(savedCase);
    } catch {
      // Non-fatal
    }

    return NextResponse.json({ success: true, case: savedCase });
  } catch {
    logSecurityEvent('admin_case_create_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to process case ingestion.' },
      { status: 500 }
    );
  }
}
