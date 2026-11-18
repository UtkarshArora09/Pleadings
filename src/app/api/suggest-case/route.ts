import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { saveSuggestionToSupabase } from '@/lib/supabase';
import { sendAdminAlertEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';
import { SuggestCaseSchema } from '@/lib/security/schemas';
import { verifyTurnstileToken } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  const rl = await checkRateLimit(clientIp, {
    prefix: 'suggest-case',
    limit: 5,
    windowSec: 15 * 60,
  });

  if (!rl.allowed) {
    logSecurityEvent('suggest_case_rate_limited', 'warn', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Too many submissions. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = SuggestCaseSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Please provide the case name and summary.' },
        { status: 400 }
      );
    }

    const {
      caseName,
      courtOrCity,
      year,
      storySynopsis,
      contributorName,
      contributorContact,
      website,
      turnstileToken,
    } = parsed.data;

    if (website && website.trim().length > 0) {
      logSecurityEvent('suggest_case_honeypot_triggered', 'warn', { ip: clientIp });
      return NextResponse.json({
        success: true,
        message: 'Thank you! Your case suggestion has been received.',
      });
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstile.ok) {
      return NextResponse.json({ success: false, error: turnstile.reason }, { status: 400 });
    }

    const record = {
      id: `sug_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      caseName,
      courtOrCity: courtOrCity || 'Not specified',
      year: year || 'Unknown',
      storySynopsis,
      contributorName: contributorName || 'Anonymous',
      contributorContact: contributorContact || 'None',
      submittedAt: new Date().toISOString(),
    };

    const savedToSupabase = await saveSuggestionToSupabase(record);

    await sendAdminAlertEmail({
      subject: `[Case Suggestion] ${record.caseName}`,
      heading: 'NEW READER CASE SUGGESTION',
      fields: [
        { label: 'Case / Topic', value: record.caseName },
        { label: 'Court / City', value: record.courtOrCity },
        { label: 'Year', value: record.year },
        { label: 'Story Synopsis', value: record.storySynopsis },
        { label: 'Suggested By', value: record.contributorName },
        { label: 'Contact', value: record.contributorContact },
        { label: 'Stored Privately', value: savedToSupabase ? 'Yes' : 'Email alert only' },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your case suggestion has been received by our editorial team.',
      persisted: savedToSupabase,
    });
  } catch {
    logSecurityEvent('suggest_case_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to submit case suggestion. Please try again.' },
      { status: 500 }
    );
  }
}
