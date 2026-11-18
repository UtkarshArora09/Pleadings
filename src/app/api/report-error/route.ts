import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { saveErrorReportToSupabase } from '@/lib/supabase';
import { sendAdminAlertEmail } from '@/lib/email';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';
import { ReportErrorSchema } from '@/lib/security/schemas';
import { verifyTurnstileToken } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  const rl = await checkRateLimit(clientIp, {
    prefix: 'report-error',
    limit: 5,
    windowSec: 15 * 60,
  });

  if (!rl.allowed) {
    logSecurityEvent('report_error_rate_limited', 'warn', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Too many correction reports. Please wait a few minutes.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = ReportErrorSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message || 'Missing required fields.' },
        { status: 400 }
      );
    }

    const { slug, episode, description, reporterEmail, website, turnstileToken } = parsed.data;

    if (website && website.trim().length > 0) {
      logSecurityEvent('report_error_honeypot_triggered', 'warn', { ip: clientIp });
      return NextResponse.json({
        success: true,
        message: 'Correction report submitted to editorial board successfully.',
      });
    }

    const turnstile = await verifyTurnstileToken(turnstileToken, clientIp);
    if (!turnstile.ok) {
      return NextResponse.json({ success: false, error: turnstile.reason }, { status: 400 });
    }

    const record = {
      id: `err_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      slug,
      episode: episode ?? 'General',
      description,
      reporterEmail: reporterEmail || undefined,
      reportedAt: new Date().toISOString(),
    };

    const persisted = await saveErrorReportToSupabase(record);

    await sendAdminAlertEmail({
      subject: `[Editorial Correction] ${slug}`,
      heading: 'NEW EDITORIAL CORRECTION REPORT',
      fields: [
        { label: 'Report ID', value: record.id },
        { label: 'Case Slug', value: slug },
        { label: 'Episode', value: String(record.episode) },
        { label: 'Description', value: description },
        { label: 'Reporter Email', value: reporterEmail || 'Anonymous' },
        { label: 'Stored Privately', value: persisted ? 'Yes' : 'Email alert only' },
      ],
    });

    return NextResponse.json({
      success: true,
      reportId: record.id,
      persisted,
      message: 'Correction report submitted to editorial board successfully.',
    });
  } catch {
    logSecurityEvent('report_error_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
