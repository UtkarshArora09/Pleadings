import { NextRequest, NextResponse } from 'next/server';
import { recordVoteForSlugAsync } from '@/lib/voteStore';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';
import { VoteSchema } from '@/lib/security/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  const rl = await checkRateLimit(clientIp, {
    prefix: 'vote',
    limit: 20,
    windowSec: 60,
  });

  if (!rl.allowed) {
    logSecurityEvent('vote_rate_limited', 'warn', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Too many vote requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = VoteSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid vote parameters.' },
        { status: 400 }
      );
    }

    const { slug, optionId, anonId } = parsed.data;
    const caseVotes = await recordVoteForSlugAsync(slug, optionId, anonId);
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
  } catch {
    logSecurityEvent('vote_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
