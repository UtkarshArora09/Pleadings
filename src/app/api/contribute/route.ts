import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { saveSubmissionToSupabase } from '@/lib/supabase';
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

    // 3. Send Notification via Gmail SMTP using nodemailer
    const gmailUser =
      process.env.GMAIL_USER ||
      process.env.SMTP_USER ||
      process.env.ADMIN_EMAIL ||
      '';
    const gmailPassword =
      process.env.GMAIL_APP_PASSWORD ||
      process.env.GMAIL_PASSWORD ||
      process.env.SMTP_PASS ||
      '';
    const adminEmail =
      process.env.ADMIN_EMAIL ||
      process.env.GMAIL_USER ||
      'pleadings.in@gmail.com';

    let emailSent = false;
    let emailError: string | null = null;

    if (gmailUser && gmailPassword) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: gmailUser,
            pass: gmailPassword,
          },
        });

        // Email to Admin / Reviewer
        const adminMailHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0E1016; color: #F3EFE6; padding: 24px; border-radius: 8px; max-width: 680px; margin: 0 auto; border: 1px solid #D4AF37;">
            <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
              <h1 style="color: #E50914; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">PLEADINGS</h1>
              <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">NEW ADVOCATE CASE CONTRIBUTION SUBMITTED</p>
            </div>

            <!-- Advocate Information -->
            <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
              <h3 style="color: #D4AF37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2a2d3d; padding-bottom: 6px;">
                Advocate Contributor Profile
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
                <tr>
                  <td style="padding: 4px 0; width: 160px; font-weight: bold; color: #94a3b8;">Full Name:</td>
                  <td style="padding: 4px 0; color: #ffffff; font-weight: bold;">${submissionRecord.advocate.name} (${submissionRecord.advocate.designation})</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Bar Council Enrolment:</td>
                  <td style="padding: 4px 0; color: #f59e0b; font-family: monospace;">${submissionRecord.advocate.barCouncilNo}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Bar Association:</td>
                  <td style="padding: 4px 0; color: #ffffff;">${submissionRecord.advocate.barAssociation}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Email Address:</td>
                  <td style="padding: 4px 0;"><a href="mailto:${submissionRecord.advocate.email}" style="color: #38bdf8; text-decoration: none;">${submissionRecord.advocate.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Phone / WhatsApp:</td>
                  <td style="padding: 4px 0; color: #34d399;">${submissionRecord.advocate.phone}</td>
                </tr>
              </table>
            </div>

            <!-- Case Summary -->
            <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
              <h3 style="color: #D4AF37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2a2d3d; padding-bottom: 6px;">
                Case Legal Metadata
              </h3>
              <div style="margin-bottom: 12px;">
                <span style="font-size: 18px; font-weight: bold; color: #ffffff;">${submissionRecord.caseDetails.title}</span>
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
                <tr>
                  <td style="padding: 4px 0; width: 160px; font-weight: bold; color: #94a3b8;">Court & Year:</td>
                  <td style="padding: 4px 0; color: #ffffff;">${submissionRecord.caseDetails.court} (${submissionRecord.caseDetails.year})</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Formal Citation:</td>
                  <td style="padding: 4px 0; color: #D4AF37; font-family: monospace;">${submissionRecord.caseDetails.citation}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Statutory Sections:</td>
                  <td style="padding: 4px 0; color: #34d399; font-weight: bold;">${submissionRecord.caseDetails.statutes}</td>
                </tr>
                ${
                  submissionRecord.caseDetails.doctrine
                    ? `<tr>
                        <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Doctrine / Tag:</td>
                        <td style="padding: 4px 0; color: #ffffff;">${submissionRecord.caseDetails.doctrine}</td>
                      </tr>`
                    : ''
                }
                ${
                  submissionRecord.caseDetails.judgmentUrl
                    ? `<tr>
                        <td style="padding: 4px 0; font-weight: bold; color: #94a3b8;">Official Judgment Link:</td>
                        <td style="padding: 4px 0;"><a href="${submissionRecord.caseDetails.judgmentUrl}" style="color: #38bdf8; word-break: break-all;">${submissionRecord.caseDetails.judgmentUrl}</a></td>
                      </tr>`
                    : ''
                }
              </table>
            </div>

            <!-- Detailed Content -->
            <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
              <h3 style="color: #D4AF37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2a2d3d; padding-bottom: 6px;">
                Legal Analysis & Pleadings
              </h3>

              <div style="margin-bottom: 14px;">
                <strong style="color: #f59e0b; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Statement of Facts:</strong>
                <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submissionRecord.caseDetails.facts}</p>
              </div>

              ${
                submissionRecord.caseDetails.issues
                  ? `<div style="margin-bottom: 14px;">
                      <strong style="color: #f59e0b; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Issues Presented:</strong>
                      <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submissionRecord.caseDetails.issues}</p>
                    </div>`
                  : ''
              }

              ${
                submissionRecord.caseDetails.prosecutionArgs
                  ? `<div style="margin-bottom: 14px;">
                      <strong style="color: #60a5fa; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Prosecution / Petitioner Contentions:</strong>
                      <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submissionRecord.caseDetails.prosecutionArgs}</p>
                    </div>`
                  : ''
              }

              ${
                submissionRecord.caseDetails.defenceArgs
                  ? `<div style="margin-bottom: 14px;">
                      <strong style="color: #f87171; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Defence / Respondent Contentions:</strong>
                      <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submissionRecord.caseDetails.defenceArgs}</p>
                    </div>`
                  : ''
              }

              <div style="margin-bottom: 14px; background-color: #0d131a; padding: 12px; border-left: 3px solid #D4AF37; border-radius: 3px;">
                <strong style="color: #D4AF37; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Ratio Decidendi & Court Holding:</strong>
                <p style="margin: 0; color: #ffffff; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submissionRecord.caseDetails.holdingAndRatio}</p>
              </div>

              ${
                submissionRecord.caseDetails.whyItMatters
                  ? `<div style="margin-bottom: 14px;">
                      <strong style="color: #34d399; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Practical Impact & Legal Significance:</strong>
                      <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submissionRecord.caseDetails.whyItMatters}</p>
                    </div>`
                  : ''
              }

              ${
                submissionRecord.caseDetails.additionalNotes
                  ? `<div style="margin-bottom: 8px;">
                      <strong style="color: #94a3b8; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">Additional Submitter Notes:</strong>
                      <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5; white-space: pre-line;">${submissionRecord.caseDetails.additionalNotes}</p>
                    </div>`
                  : ''
              }
            </div>

            <!-- Footer Action -->
            <div style="text-align: center; padding-top: 10px; border-top: 1px solid #2a2d3d; font-size: 11px; color: #94a3b8;">
              <p style="margin: 0;">Submission ID: ${submissionRecord.id} · Logged at ${submissionRecord.submittedAt}</p>
              <p style="margin: 4px 0 0 0;">Review in Pleadings Admin Dashboard to verify and publish to website.</p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Pleadings Case Submissions" <${gmailUser}>`,
          to: adminEmail,
          replyTo: submissionRecord.advocate.email,
          subject: `[New Case Submission] ${submissionRecord.caseDetails.title} (${submissionRecord.caseDetails.year}) — Adv. ${submissionRecord.advocate.name}`,
          html: adminMailHtml,
        });

        // Acknowledgment Email to the Submitting Advocate
        const ackMailHtml = `
          <div style="font-family: Arial, sans-serif; background-color: #0E1016; color: #F3EFE6; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
            <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
              <h1 style="color: #E50914; margin: 0; font-size: 22px; letter-spacing: 2px;">PLEADINGS</h1>
              <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">CERTIFIED INDIAN CASE LAWS & COURTROOM EPISODES</p>
            </div>

            <p style="font-size: 15px; color: #ffffff;">Respected Adv. ${submissionRecord.advocate.name},</p>

            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
              Thank you for submitting the landmark case <strong>"${submissionRecord.caseDetails.title} (${submissionRecord.caseDetails.year})"</strong> to the Pleadings Indian Law Archive.
            </p>

            <div style="background-color: #171922; border-left: 3px solid #D4AF37; padding: 14px; margin: 16px 0; font-size: 13px; color: #e2e8f0;">
              <div><strong>Citation:</strong> ${submissionRecord.caseDetails.citation}</div>
              <div><strong>Court:</strong> ${submissionRecord.caseDetails.court}</div>
              <div><strong>Statutes:</strong> ${submissionRecord.caseDetails.statutes}</div>
              <div><strong>Submission Ref ID:</strong> <span style="font-family: monospace; color: #D4AF37;">${submissionRecord.id}</span></div>
            </div>

            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
              Our legal editorial panel is currently verifying the paragraph citations, statutory mappings (IPC to BNS), and holding against certified registry records. Once verified, this case will be published on <a href="https://pleadings.in" style="color: #D4AF37; text-decoration: none;">pleadings.in</a> with full contributor credit attributed to your advocate profile.
            </p>

            <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-top: 20px;">
              Best regards,<br/>
              <strong>Editorial Board</strong><br/>
              <span style="color: #D4AF37;">Pleadings (pleadings.in)</span>
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: `"Pleadings Editorial Desk" <${gmailUser}>`,
          to: submissionRecord.advocate.email,
          subject: `Case Submission Received: ${submissionRecord.caseDetails.title} [Ref: ${submissionRecord.id}]`,
          html: ackMailHtml,
        });

        emailSent = true;
      } catch (err: any) {
        console.error('SMTP Email dispatch error:', err);
        emailError = err?.message || 'SMTP dispatch error';
      }
    } else {
      console.warn(
        'Gmail SMTP credentials (GMAIL_USER, GMAIL_APP_PASSWORD) not configured. Submission saved to Supabase storage.'
      );
    }

    return NextResponse.json({
      success: true,
      submissionId: submissionRecord.id,
      emailSent,
      emailNotice: emailSent
        ? 'Notification and acknowledgement emails sent successfully.'
        : emailError
        ? `Submission recorded in database. (Email note: ${emailError})`
        : 'Submission recorded in database. (SMTP credentials pending configuration)',
    });
  } catch (error: any) {
    console.error('Contribution API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process case submission.' },
      { status: 500 }
    );
  }
}
