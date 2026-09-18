import { NextRequest, NextResponse } from 'next/server';
import { saveSubmissionToSupabase } from '@/lib/supabase';
import { sendCaseContributionEmails } from '@/lib/email';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      advocateName,
      barCouncilNo,
      barAssociation,
      email,
      phone,
      designation,
      caseTitle,
      court,
      year,
      citation,
      statutes,
      doctrine,
      facts,
      issues,
      prosecutionArgs,
      defenceArgs,
      holdingAndRatio,
      whyItMatters,
      judgmentUrl,
      additionalNotes,
    } = body;

    // Validation
    if (
      !advocateName?.trim() ||
      !barCouncilNo?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !caseTitle?.trim() ||
      !court?.trim() ||
      !year ||
      !citation?.trim() ||
      !statutes?.trim() ||
      !facts?.trim() ||
      !holdingAndRatio?.trim()
    ) {
      return NextResponse.json(
        { error: 'Please fill in all mandatory case and advocate details.' },
        { status: 400 }
      );
    }

    const submissionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      submittedAt: new Date().toISOString(),
      advocate: {
        name: advocateName.trim(),
        barCouncilNo: barCouncilNo.trim(),
        barAssociation: barAssociation?.trim() || 'High Court / Supreme Court Bar',
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        designation: designation?.trim() || 'Advocate',
      },
      caseDetails: {
        title: caseTitle.trim(),
        court: court.trim(),
        year: String(year).trim(),
        citation: citation.trim(),
        statutes: statutes.trim(),
        doctrine: doctrine?.trim() || '',
        facts: facts.trim(),
        issues: issues?.trim() || '',
        prosecutionArgs: prosecutionArgs?.trim() || '',
        defenceArgs: defenceArgs?.trim() || '',
        holdingAndRatio: holdingAndRatio.trim(),
        whyItMatters: whyItMatters?.trim() || '',
        judgmentUrl: judgmentUrl?.trim() || '',
        additionalNotes: additionalNotes?.trim() || '',
      },
      status: 'PENDING_VERIFICATION',
    };

    // 1. Persist to Supabase Storage
    try {
      await saveSubmissionToSupabase(submissionRecord);
    } catch (e) {
      console.warn('Could not save to Supabase:', e);
    }

    // 2. Persist locally to data/submissions.json (if writable)
    try {
      const submissionsDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(submissionsDir)) {
        fs.mkdirSync(submissionsDir, { recursive: true });
      }
      const submissionsFile = path.join(submissionsDir, 'submissions.json');
      let currentSubmissions: any[] = [];
      if (fs.existsSync(submissionsFile)) {
        const raw = fs.readFileSync(submissionsFile, 'utf-8');
        currentSubmissions = JSON.parse(raw);
      }
      currentSubmissions.unshift(submissionRecord);
      fs.writeFileSync(submissionsFile, JSON.stringify(currentSubmissions, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Local file write skipped:', e);
    }

    // 3. Dispatch Notification Emails via centralized email service
    const emailResult = await sendCaseContributionEmails(submissionRecord as any);

    return NextResponse.json({
      success: true,
      submissionId: submissionRecord.id,
      emailSent: emailResult.success,
      emailNotice: emailResult.success
        ? 'Notification and acknowledgement emails sent successfully to admin and advocate.'
        : emailResult.error
        ? `Submission recorded in database. (Email status: ${emailResult.error})`
        : 'Submission recorded in database.',
    });
  } catch (error: any) {
    console.error('Contribution API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process case submission.' },
      { status: 500 }
    );
  }
}

