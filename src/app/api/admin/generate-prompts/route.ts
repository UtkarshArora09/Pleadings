import { NextRequest, NextResponse } from 'next/server';
import { isRequestAuthenticated } from '@/lib/auth';
import { generateSmartPromptsWithLLM } from '@/lib/ai/llmPrompts';
import { GeneratePromptsSchema } from '@/lib/security/schemas';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  const clientIp = getClientIp(request);
  const rl = await checkRateLimit(clientIp, {
    prefix: 'admin-gen-prompts',
    limit: 20,
    windowSec: 5 * 60,
  });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: 'Prompt generation rate limit exceeded.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await request.json().catch(() => null);
    const parsed = GeneratePromptsSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Missing caseData in request body.' },
        { status: 400 }
      );
    }

    const { caseData, artStyle, customInstruction, targetSlot } = parsed.data;

    const result = await generateSmartPromptsWithLLM({
      caseData: caseData as Record<string, any>,
      artStyle,
      customInstruction,
      targetSlot,
    });

    logSecurityEvent('admin_prompts_generated', 'info', { ip: clientIp, provider: result.provider });

    return NextResponse.json({
      success: true,
      prompts: {
        poster: result.poster,
        exhibit: result.exhibit,
        verdict: result.verdict,
      },
      provider: result.provider,
      caseSummaryUsed: result.caseSummaryUsed,
    });
  } catch {
    logSecurityEvent('admin_prompts_gen_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to generate prompts.' },
      { status: 500 }
    );
  }
}
