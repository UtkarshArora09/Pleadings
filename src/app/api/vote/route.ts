import { NextResponse } from 'next/server';
import { recordVoteForSlugAsync } from '@/lib/voteStore';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { slug, optionId, anonId } = body;

    if (!slug || !optionId || !anonId) {
      return NextResponse.json(
        { success: false, error: 'Missing required vote parameters.' },
        { status: 400 }
      );
    }

    const caseVotes = await recordVoteForSlugAsync(String(slug), String(optionId), String(anonId));
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

    return NextResponse.json({
      success: true,
      totalVotes,
      counts,
      percentages,
      isThresholdMet: totalVotes >= 50,
    });
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
