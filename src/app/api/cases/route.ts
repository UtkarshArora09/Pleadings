import { NextResponse } from 'next/server';
import { CaseStore, isCasePublished } from '@/lib/db/caseStore';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre');
    const query = searchParams.get('q')?.toLowerCase().trim().slice(0, 120);

    const all = await CaseStore.getAllAsync();
    let cases = all.filter((c) => isCasePublished(c));

    if (genre && genre !== 'ALL') {
      cases = cases.filter((c) => c.genre === genre || c.categoryTag === genre);
    }

    if (query) {
      cases = cases.filter(
        (c) =>
          c.title?.en?.toLowerCase()?.includes(query) ||
          c.title?.hi?.toLowerCase()?.includes(query) ||
          c.court?.toLowerCase()?.includes(query) ||
          c.citation?.toLowerCase()?.includes(query) ||
          c.tag?.en?.toLowerCase()?.includes(query)
      );
    }

    return NextResponse.json(
      { success: true, cases },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    );
  } catch (error) {
    console.error('Error fetching public cases:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch cases' }, { status: 500 });
  }
}
