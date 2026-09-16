import { NextResponse } from 'next/server';
import { globalVotes } from '../route';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const url = new URL(req.url);
    const anonId = url.searchParams.get('anonId');

    const caseVotes = globalVotes.filter((v) => v.slug === slug);
    const totalVotes = caseVotes.length;
    const counts: Record<string, number> = {};

    caseVotes.forEach((v) => {
      counts[v.optionId] = (counts[v.optionId] || 0) + 1;
    });

    const percentages: Record<string, number> = {};
    if (totalVotes > 0) {
      Object.keys(counts).forEach((opt) => {
        percentages[opt] = Math.round((counts[opt] / totalVotes) * 100);
      });
    }

    const userVote = anonId
      ? caseVotes.find((v) => v.anonId === anonId)?.optionId || null
      : null;

    return NextResponse.json({
      success: true,
      totalVotes,
      counts,
      percentages,
      isThresholdMet: totalVotes >= 50,
      userVote
    });
  } catch (error) {
    console.error('Failed to get votes:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
