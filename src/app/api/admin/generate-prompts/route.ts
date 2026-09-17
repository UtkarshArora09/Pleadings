import { NextRequest, NextResponse } from 'next/server';
import { isRequestAuthenticated } from '@/lib/auth';
import { generateSmartPromptsWithLLM } from '@/lib/ai/llmPrompts';

export async function POST(request: NextRequest) {
  if (!isRequestAuthenticated(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Admin credentials required.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { caseData, artStyle, customInstruction, targetSlot } = body;

    if (!caseData) {
      return NextResponse.json(
        { success: false, error: 'Missing caseData in request body.' },
        { status: 400 }
      );
    }

    const result = await generateSmartPromptsWithLLM({
      caseData,
      artStyle,
      customInstruction,
      targetSlot: targetSlot || 'all',
    });

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
  } catch (error) {
    console.error('Error generating smart prompts with LLM:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate prompts',
      },
      { status: 500 }
    );
  }
}
