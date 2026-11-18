import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { saveSubscriberToSupabase } from '@/lib/supabase';
import { sendAdminAlertEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';
import { SubscribeSchema } from '@/lib/security/schemas';
import { verifyTurnstileToken } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  const rl = await checkRateLimit(clientIp, {
    prefix: 'subscribe',
    limit: 5,
    windowSec: 10 * 60,
  });

  if (!rl.allowed) {
    logSecurityEvent('subscribe_rate_limited', 'warn', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a few minutes before retrying.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = SubscribeSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Invalid subscription details.' },
        { status: 400 }
      );
    }

    const { contact, channel, caseSlug, frequency, website, turnstileToken } = parsed.data;

    // Silent honeypot drop for bots
    if (website && website.trim().length > 0) {
      logSecurityEvent('subscribe_honeypot_triggered', 'warn', { ip: clientIp });
      return NextResponse.json({
        success: true,
        message: 'Your subscription request has been recorded.',
      });
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstile.ok) {
      return NextResponse.json({ success: false, error: turnstile.reason }, { status: 400 });
    }

    const record = {
      id: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      contact,
      channel,
      caseSlug,
      frequency,
      subscribedAt: new Date().toISOString(),
    };

    const savedToSupabase = await saveSubscriberToSupabase(record);

    await sendAdminAlertEmail({
      subject: `[Daily 3-Min Case] New ${channel.toUpperCase()} Subscriber`,
      heading: 'NEW DAILY 3-MIN CASE SUBSCRIBER',
      fields: [
        { label: 'Channel', value: channel.toUpperCase() },
        { label: 'Contact', value: contact },
        { label: 'Source Case', value: record.caseSlug },
        { label: 'Frequency', value: record.frequency },
        { label: 'Stored Privately', value: savedToSupabase ? 'Yes' : 'Email alert only' },
      ],
    });

    return NextResponse.json({
      success: true,
      message: 'Your request is registered for our upcoming daily case dispatch.',
      channel,
      persisted: savedToSupabase,
    });
  } catch {
    logSecurityEvent('subscribe_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    );
  }
}
