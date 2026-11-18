import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { saveSubmissionToSupabase } from '@/lib/supabase';
import { sendCaseContributionEmails } from '@/lib/email';
import { checkRateLimit, getClientIp, logSecurityEvent } from '@/lib/security/rateLimit';
import { ContributeSchema } from '@/lib/security/schemas';
import { verifyTurnstileToken } from '@/lib/security/sanitize';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const clientIp = getClientIp(req);

  const rl = await checkRateLimit(clientIp, {
    prefix: 'contribute',
    limit: 3,
    windowSec: 30 * 60,
  });

  if (!rl.allowed) {
    logSecurityEvent('contribute_rate_limited', 'warn', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Submission limit reached. Please wait before submitting another case.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSec) } }
    );
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = ContributeSchema.safeParse(rawBody);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues[0]?.message || 'Please fill in all mandatory case and advocate details.',
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    if (data.website && data.website.trim().length > 0) {
      logSecurityEvent('contribute_honeypot_triggered', 'warn', { ip: clientIp });
      return NextResponse.json({
        success: true,
        submissionId: `sub_${Date.now()}_ok`,
        emailSent: false,
        emailNotice: 'Submission logged.',
      });
    }

    const turnstile = await verifyTurnstileToken(data.turnstileToken, clientIp);
    if (!turnstile.ok) {
      return NextResponse.json({ success: false, error: turnstile.reason }, { status: 400 });
    }

    const submissionRecord = {
      id: `sub_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      submittedAt: new Date().toISOString(),
      advocate: {
        name: data.advocateName,
        barCouncilNo: data.barCouncilNo,
        barAssociation: data.barAssociation || 'High Court / Supreme Court Bar',
        email: data.email.toLowerCase(),
        phone: data.phone,
        designation: data.designation || 'Advocate',
      },
      caseDetails: {
        title: data.caseTitle,
        court: data.court,
        year: data.year,
        citation: data.citation,
        statutes: data.statutes,
        doctrine: data.doctrine,
        facts: data.facts,
        issues: data.issues,
        prosecutionArgs: data.prosecutionArgs,
        defenceArgs: data.defenceArgs,
        holdingAndRatio: data.holdingAndRatio,
        whyItMatters: data.whyItMatters,
        judgmentUrl: data.judgmentUrl,
        additionalNotes: data.additionalNotes,
      },
      status: 'PENDING_VERIFICATION',
    };

    // Persist strictly to private RLS-protected table (never public storage or local disk)
    const persisted = await saveSubmissionToSupabase(submissionRecord);

    const emailResult = await sendCaseContributionEmails(submissionRecord);

    return NextResponse.json({
      success: true,
      submissionId: submissionRecord.id,
      persisted,
      emailSent: emailResult.success,
      emailNotice: emailResult.success
        ? 'Notification and acknowledgement emails sent successfully.'
        : 'Submission recorded in our private editorial verification queue.',
    });
  } catch {
    logSecurityEvent('contribute_exception', 'error', { ip: clientIp });
    return NextResponse.json(
      { success: false, error: 'Failed to process case submission. Please try again.' },
      { status: 500 }
    );
  }
}
