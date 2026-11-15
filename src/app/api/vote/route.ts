import { NextResponse } from 'next/server';
import { globalVotes } from '@/lib/voteStore';

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

    // Check if user already voted for this case
    const existingIndex = globalVotes.findIndex(
      (v) => v.slug === slug && v.anonId === anonId
    );

    if (existingIndex >= 0) {
      // Update vote
      globalVotes[existingIndex].optionId = optionId;
      globalVotes[existingIndex].createdAt = new Date().toISOString();
    } else {
      globalVotes.push({
        slug,
        optionId,
        anonId,
        createdAt: new Date().toISOString()
      });
    }

    // Tally votes for this slug
    const caseVotes = globalVotes.filter((v) => v.slug === slug);
    const totalVotes = caseVotes.length;
    const counts: Record<string, number> = {};

    caseVotes.forEach((v) => {
      counts[v.optionId] = (counts[v.optionId] || 0) + 1;
    });

    const percentages: Record<string, number> = {};
    Object.keys(counts).forEach((opt) => {
      percentages[opt] = Math.round((counts[opt] / totalVotes) * 100);
    });

    return NextResponse.json({
      success: true,
      totalVotes,
      counts,
      percentages,
      isThresholdMet: totalVotes >= 50
    });
  } catch (error) {
    console.error('Failed to submit vote:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}


