import { NextResponse } from 'next/server';
import { CaseStore } from '@/lib/db/caseStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const query = searchParams.get('q')?.toLowerCase();

    let cases = CaseStore.getPublished();

    if (genre && genre !== 'ALL') {
      cases = cases.filter((c) => c.genre === genre || c.categoryTag === genre);
    }

    if (query) {
      cases = cases.filter(
        (c) =>
          c.title.en.toLowerCase().includes(query) ||
          c.title.hi.toLowerCase().includes(query) ||
          c.court.toLowerCase().includes(query) ||
          c.citation.toLowerCase().includes(query) ||
          c.tag.en.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, cases });
  } catch (error) {
    console.error('Error fetching public cases:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cases' }, { status: 500 });
  }
}
