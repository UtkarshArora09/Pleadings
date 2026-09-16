import { NextRequest, NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';
import { CaseData } from '@/types';
import { isRequestAuthenticated } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const caseItem = CaseStore.getBySlug(slug);

    if (!caseItem) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, case: caseItem });
  } catch (error) {
    console.error('Error fetching admin case:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

import fs from 'fs';
import path from 'path';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized. Admin credentials required.' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const body: Partial<CaseData> = await request.json();

    const updated = CaseStore.update(slug, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    // Sync to content/cases/${slug}.json
    try {
      const casesDir = path.join(process.cwd(), 'content', 'cases');
      const caseFilePath = path.join(casesDir, `${slug}.json`);
      if (fs.existsSync(caseFilePath)) {
        const raw = fs.readFileSync(caseFilePath, 'utf8');
        const existing = JSON.parse(raw);
        const merged = { ...existing, ...body };

        // Ensure episodes are synchronized with new visuals
        if (body.poster?.src && merged.episodes) {
          merged.poster = body.poster;
          merged.bannerImage = body.poster.src;
          if (merged.episodes[0]) merged.episodes[0].image = body.poster;
          if (merged.hi?.episodes?.[0]) merged.hi.episodes[0].image = body.poster;
        }
        if (body.panels?.[1]?.photoExhibitSrc && merged.episodes?.[1]) {
          const exhibitImg = { src: body.panels[1].photoExhibitSrc, alt: `Archival Exhibit for ${merged.title?.en || merged.slug}`, provenance: 'archival' };
          merged.episodes[1].image = exhibitImg;
          if (merged.episodes[1].exhibit) merged.episodes[1].exhibit.image = exhibitImg;
          if (merged.hi?.episodes?.[1]) {
            merged.hi.episodes[1].image = exhibitImg;
            if (merged.hi.episodes[1].exhibit) merged.hi.episodes[1].exhibit.image = exhibitImg;
          }
        }
        if (body.panels?.[6]?.photoExhibitSrc && merged.episodes?.[6]) {
          const verdictImg = { src: body.panels[6].photoExhibitSrc, alt: `Courtroom Verdict for ${merged.title?.en || merged.slug}`, provenance: 'illustration' };
          merged.episodes[6].image = verdictImg;
          if (merged.episodes[6].exhibit) merged.episodes[6].exhibit.image = verdictImg;
          if (merged.hi?.episodes?.[6]) {
            merged.hi.episodes[6].image = verdictImg;
            if (merged.hi.episodes[6].exhibit) merged.hi.episodes[6].exhibit.image = verdictImg;
          }
        }

        fs.writeFileSync(caseFilePath, JSON.stringify(merged, null, 2), 'utf8');
      }
    } catch (fsErr) {
      console.warn('Could not sync to content/cases file:', fsErr);
    }

    return NextResponse.json({ success: true, case: updated });
  } catch (error) {
    console.error('Error updating admin case:', error);
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

  try {
    const { slug } = await params;
    const deleted = CaseStore.delete(slug);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Case not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Case deleted successfully' });
  } catch (error) {
    console.error('Error deleting admin case:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
