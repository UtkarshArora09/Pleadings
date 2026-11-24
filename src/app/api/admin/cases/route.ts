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

    const defaultKickers = [
      'EPISODE 01 · THE PREMISE',
      'EPISODE 02 · DRAMATIS PERSONAE',
      'EPISODE 03 · THE TRIAL & INQUIRY',
      'EPISODE 04 · THE LEGAL CONTROVERSY',
      'EPISODE 05 · COURTROOM ARGUMENTS',
      'EPISODE 06 · JUDICIAL DELIBERATION',
      'EPISODE 07 · OPERATIVE VERDICT',
      'EPISODE 08 · PRECEDENTIAL LEGACY',
    ];

    const defaultTitles = [
      'THE GENESIS OF THE DISPUTE',
      'THE PARTIES & CONFLICTING INTERESTS',
      'PROCEDURAL ORDERS & INVESTIGATIVE RECORD',
      'THE CENTRAL CONSTITUTIONAL QUESTION',
      'CONTENTIONS AT THE BAR',
      'BENCH REASONING & DOCTRINAL TESTS',
      'THE BINDING HOLDING & DECREE',
      'THE DOCTRINE GOING FORWARD',
    ];

    const validPersonas = Array.isArray(body.personas) && body.personas.length > 0 ? body.personas : [];

    if (Array.isArray(body.episodes) && body.episodes.length > 0) {
      const normalizedEpisodes = (body.episodes as any[]).map((ep, i) => {
        const epNum = ep.n || i + 1;
        const kicker = ep.kicker || defaultKickers[i] || `EPISODE 0${epNum}`;
        const title = ep.title || defaultTitles[i] || `Episode ${epNum}`;
        const narrativeText =
          ep.layers?.story?.blocks?.[0]?.text !== undefined
            ? String(ep.layers.story.blocks[0].text || '')
            : typeof ep.text === 'string'
            ? ep.text
            : i === 0
            ? String(body.factsSummary || briefObj?.facts?.en || '')
            : '';

        return {
          n: epNum,
          kicker,
          title,
          endHook: ep.endHook || (i < 7 ? 'What followed next in the proceedings?' : 'Case dossier complete.'),
          layers: {
            story: {
              blocks: [
                {
                  type: 'para' as const,
                  text: narrativeText,
                  source: { tier: 'AMBER' as const, para: epNum },
                },
              ],
            },
            student: ep.layers?.student || {
              blocks: [{ type: 'para' as const, text: `Doctrinal analysis for ${title}.`, source: { tier: 'AMBER' as const } }],
              ratio: String(body.studentRatio || ''),
              obiter: Array.isArray(body.studentObiter) ? body.studentObiter : [],
              examAngle: String(body.studentExamAngle || ''),
            },
            advocate: ep.layers?.advocate || {
              blocks: [{ type: 'para' as const, text: `TRIAL PROPOSITION: Key legal principle from ${title}.`, source: { tier: 'AMBER' as const } }],
              pinpoints: [{ para: epNum * 8, proposition: 'Operative finding' }],
            },
          },
          personas: i === 1 && validPersonas.length > 0 ? validPersonas : ep.personas,
        };
      });

      const panels = normalizedEpisodes.map((ep, i) => ({
        id: `panel-${i + 1}`,
        type: i === 0 ? 'HOOK' as const : i === 1 ? 'PEOPLE' as const : i === 6 ? 'VERDICT' as const : i === 7 ? 'RATIO' as const : 'INCIDENT' as const,
        eyebrow: { en: ep.kicker, hi: ep.kicker },
        headline: { en: ep.title, hi: ep.title },
        body: {
          en: ep.layers?.story?.blocks?.[0]?.text || '',
          hi: ep.layers?.story?.blocks?.[0]?.text || '',
        },
      }));

      caseToSave = {
        ...body,
        slug: caseSlug,
        title: normalizedTitle,
        court: courtStr,
        year: yearNum,
        genre: genreStr,
        categoryTag: String(body.categoryTag || statuteSectionsStr),
        episodes: normalizedEpisodes,
        panels: body.panels || panels,
        personas: validPersonas.length > 0 ? validPersonas : normalizedEpisodes[1]?.personas || [],
        brief: body.brief || {
          facts: { en: normalizedEpisodes[0]?.layers?.story?.blocks?.[0]?.text || String(body.factsSummary || ''), hi: '' },
          held: { en: normalizedEpisodes[6]?.layers?.story?.blocks?.[0]?.text || '', hi: '' },
          reasoning: { en: normalizedEpisodes[5]?.layers?.story?.blocks?.[0]?.text || '', hi: '' },
          whyItMatters: { en: normalizedEpisodes[7]?.layers?.story?.blocks?.[0]?.text || '', hi: '' },
        },
        updatedAt: new Date().toISOString(),
      } as unknown as CaseData;
    } else {
      const defaultEpisodes = Array.from({ length: 8 }, (_, i) => ({
        n: i + 1,
        kicker: defaultKickers[i],
        title: defaultTitles[i],
        layers: {
          story: {
            blocks: [
              {
                type: 'para' as const,
                text: i === 0 ? String(body.factsSummary || briefObj?.facts?.en || `Factual inception and background of ${titleStr}.`) : `Factual developments of stage ${i + 1} in ${titleStr}.`,
                source: { tier: 'AMBER' as const, para: i + 1 },
              },
            ],
          },
        },
        endHook: i < 7 ? 'What followed next in the proceedings?' : 'Case dossier complete.',
        personas: i === 1 && validPersonas.length > 0 ? validPersonas : undefined,
      }));

      const panels = defaultEpisodes.map((ep, i) => ({
        id: `panel-${i + 1}`,
        type: i === 0 ? 'HOOK' as const : i === 1 ? 'PEOPLE' as const : i === 6 ? 'VERDICT' as const : i === 7 ? 'RATIO' as const : 'INCIDENT' as const,
        eyebrow: { en: ep.kicker, hi: ep.kicker },
        headline: { en: ep.title, hi: ep.title },
        body: {
          en: ep.layers?.story?.blocks?.[0]?.text || '',
          hi: ep.layers?.story?.blocks?.[0]?.text || '',
        },
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
        panels,
        personas: validPersonas,
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
