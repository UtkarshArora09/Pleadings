import nodemailer from 'nodemailer';

export interface AdvocateSubmission {
  id: string;
  submittedAt: string;
  advocate: {
    name: string;
    barCouncilNo: string;
    barAssociation: string;
    email: string;
    phone: string;
    designation: string;
  };
  caseDetails: {
    title: string;
    court: string;
    year: string;
    citation: string;
    statutes: string;
    doctrine?: string;
    facts: string;
    issues?: string;
    prosecutionArgs?: string;
    defenceArgs?: string;
    holdingAndRatio: string;
    whyItMatters?: string;
    judgmentUrl?: string;
    additionalNotes?: string;
  };
  status: string;
}

/**
 * Returns clean SMTP credentials
 */
export function getSmtpCredentials() {
  const gmailUser = (
    process.env.GMAIL_USER ||
    process.env.SMTP_USER ||
    process.env.ADMIN_EMAIL ||
    ''
  ).trim();

  const rawPass =
    process.env.GMAIL_APP_PASSWORD ||
    process.env.GMAIL_PASSWORD ||
    process.env.SMTP_PASS ||
    '';
  const gmailPassword = rawPass.replace(/\s+/g, '').trim();

  return { gmailUser, gmailPassword };
}

/**
 * Returns all admin destination emails (deduplicated)
 */
export function getAdminRecipients(): string[] {
  const list = [
    process.env.ADMIN_EMAIL,
    process.env.GMAIL_USER,
    'utkarsh54545454@gmail.com',
    'utkarsh.arora09@gmail.com',
  ];

  const unique = new Set<string>();
  for (const item of list) {
    if (item && item.trim() && item.includes('@')) {
      unique.add(item.trim().toLowerCase());
    }
  }
  return Array.from(unique);
}

/**
 * Creates and returns a verified nodemailer transporter
 */
export function createEmailTransporter() {
  const { gmailUser, gmailPassword } = getSmtpCredentials();
  if (!gmailUser || !gmailPassword) {
    return null;
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: gmailUser,
      pass: gmailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
}

/**
 * Dispatches automated case contribution emails to Admin and Submitting Advocate
 */
export async function sendCaseContributionEmails(
  submission: AdvocateSubmission
): Promise<{ success: boolean; adminDispatched: boolean; advocateDispatched: boolean; error?: string }> {
  const transporter = createEmailTransporter();
  const { gmailUser } = getSmtpCredentials();

  if (!transporter || !gmailUser) {
    console.warn('[Email] Gmail SMTP credentials missing in environment.');
    return {
      success: false,
      adminDispatched: false,
      advocateDispatched: false,
      error: 'SMTP credentials not configured',
    };
  }

  const adminRecipients = getAdminRecipients();
  let adminDispatched = false;
  let advocateDispatched = false;
  let errorMsg: string | undefined;

  const refId = submission.id.replace('sub_', '').slice(-7).toUpperCase();
  const timeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  // 1. Dispatch Email to Admins
  try {
    const adminHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #0E1016; color: #F3EFE6; padding: 24px; border-radius: 8px; max-width: 680px; margin: 0 auto; border: 1px solid #D4AF37;">
        <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="color: #E50914; margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase;">PLEADINGS</h1>
          <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase;">NEW ADVOCATE CASE CONTRIBUTION SUBMISSION [REF: #${refId}]</p>
        </div>

        <!-- Advocate Information -->
        <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #D4AF37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2a2d3d; padding-bottom: 6px;">
            Advocate Contributor Profile
          </h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
            <tr>
              <td style="padding: 5px 0; width: 170px; font-weight: bold; color: #94a3b8;">Full Name:</td>
              <td style="padding: 5px 0; color: #ffffff; font-weight: bold;">${submission.advocate.name} (${submission.advocate.designation})</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Bar Council Enrolment:</td>
              <td style="padding: 5px 0; color: #f59e0b; font-family: monospace; font-weight: bold;">${submission.advocate.barCouncilNo}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Bar Association / Court:</td>
              <td style="padding: 5px 0; color: #ffffff;">${submission.advocate.barAssociation}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Email Address:</td>
              <td style="padding: 5px 0;"><a href="mailto:${submission.advocate.email}" style="color: #38bdf8; text-decoration: none; font-weight: bold;">${submission.advocate.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Phone / WhatsApp:</td>
              <td style="padding: 5px 0; color: #34d399; font-weight: bold;">${submission.advocate.phone}</td>
            </tr>
          </table>
        </div>

        <!-- Case Summary -->
        <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #D4AF37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2a2d3d; padding-bottom: 6px;">
            Case Identification
          </h3>
          <div style="margin-bottom: 12px;">
            <span style="font-size: 18px; font-weight: bold; color: #ffffff;">${submission.caseDetails.title}</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #cbd5e1;">
            <tr>
              <td style="padding: 5px 0; width: 170px; font-weight: bold; color: #94a3b8;">Deciding Court:</td>
              <td style="padding: 5px 0; color: #ffffff;">${submission.caseDetails.court} (${submission.caseDetails.year})</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Law Report Citation:</td>
              <td style="padding: 5px 0; color: #D4AF37; font-family: monospace; font-weight: bold;">${submission.caseDetails.citation}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Statutory Sections:</td>
              <td style="padding: 5px 0; color: #34d399; font-weight: bold;">${submission.caseDetails.statutes}</td>
            </tr>
            ${
              submission.caseDetails.doctrine
                ? `<tr>
                    <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Core Doctrine:</td>
                    <td style="padding: 5px 0; color: #ffffff;">${submission.caseDetails.doctrine}</td>
                  </tr>`
                : ''
            }
            ${
              submission.caseDetails.judgmentUrl
                ? `<tr>
                    <td style="padding: 5px 0; font-weight: bold; color: #94a3b8;">Public Judgment Link:</td>
                    <td style="padding: 5px 0;"><a href="${submission.caseDetails.judgmentUrl}" style="color: #38bdf8; word-break: break-all;">${submission.caseDetails.judgmentUrl}</a></td>
                  </tr>`
                : ''
            }
          </table>
        </div>

        <!-- Detailed Pleadings -->
        <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 20px;">
          <h3 style="color: #D4AF37; margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; border-bottom: 1px solid #2a2d3d; padding-bottom: 6px;">
            Pleadings, Arguments & Ratio
          </h3>

          <div style="margin-bottom: 14px;">
            <strong style="color: #f59e0b; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">1. Factual Summary:</strong>
            <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submission.caseDetails.facts}</p>
          </div>

          ${
            submission.caseDetails.issues
              ? `<div style="margin-bottom: 14px;">
                  <strong style="color: #f59e0b; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">2. Issues Framed:</strong>
                  <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submission.caseDetails.issues}</p>
                </div>`
              : ''
          }

          ${
            submission.caseDetails.prosecutionArgs
              ? `<div style="margin-bottom: 14px;">
                  <strong style="color: #60a5fa; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">3A. Petitioner / Prosecution Arguments:</strong>
                  <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submission.caseDetails.prosecutionArgs}</p>
                </div>`
              : ''
          }

          ${
            submission.caseDetails.defenceArgs
              ? `<div style="margin-bottom: 14px;">
                  <strong style="color: #f87171; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">3B. Respondent / Defence Arguments:</strong>
                  <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submission.caseDetails.defenceArgs}</p>
                </div>`
              : ''
          }

          <div style="margin-bottom: 14px; background-color: #0d131a; padding: 12px; border-left: 3px solid #D4AF37; border-radius: 3px;">
            <strong style="color: #D4AF37; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">4. Ratio Decidendi & Court Holding:</strong>
            <p style="margin: 0; color: #ffffff; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submission.caseDetails.holdingAndRatio}</p>
          </div>

          ${
            submission.caseDetails.whyItMatters
              ? `<div style="margin-bottom: 14px;">
                  <strong style="color: #34d399; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">5. Practical Significance for Advocates:</strong>
                  <p style="margin: 0; color: #e2e8f0; font-size: 13px; line-height: 1.6; white-space: pre-line;">${submission.caseDetails.whyItMatters}</p>
                </div>`
              : ''
          }

          ${
            submission.caseDetails.additionalNotes
              ? `<div style="margin-bottom: 8px;">
                  <strong style="color: #94a3b8; font-size: 12px; text-transform: uppercase; display: block; margin-bottom: 4px;">6. Key Paragraphs / Submitter Notes:</strong>
                  <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.5; white-space: pre-line;">${submission.caseDetails.additionalNotes}</p>
                </div>`
              : ''
          }
        </div>

        <!-- Footer Action -->
        <div style="text-align: center; padding-top: 12px; border-top: 1px solid #2a2d3d; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">Submission ID: <strong>${submission.id}</strong> · Logged at ${submission.submittedAt}</p>
          <p style="margin: 4px 0 0 0; color: #D4AF37;">Pleadings Editorial Review Queue</p>
        </div>
      </div>
    `;

    for (const recipient of adminRecipients) {
      try {
        const info = await transporter.sendMail({
          from: `"Pleadings Case Submissions" <${gmailUser}>`,
          to: recipient,
          replyTo: submission.advocate.email,
          subject: `[New Case #${refId}] ${submission.caseDetails.title} (${submission.caseDetails.year}) — Adv. ${submission.advocate.name} [${timeStr}]`,
          html: adminHtml,
        });
        console.log(`[Email] Admin notification dispatched to ${recipient}, MessageId: ${info.messageId}`);
        adminDispatched = true;
      } catch (sendErr: any) {
        console.error(`[Email] Failed dispatching to admin recipient ${recipient}:`, sendErr?.message || sendErr);
        errorMsg = sendErr?.message;
      }
    }
  } catch (err: any) {
    console.error('[Email] General admin dispatch error:', err);
    errorMsg = err?.message;
  }

  // 2. Dispatch Auto-Acknowledgement to Advocate
  if (submission.advocate.email && submission.advocate.email.includes('@')) {
    try {
      const ackHtml = `
        <div style="font-family: Arial, Helvetica, sans-serif; background-color: #0E1016; color: #F3EFE6; padding: 24px; border-radius: 8px; max-width: 600px; margin: 0 auto; border: 1px solid #D4AF37;">
          <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
            <h1 style="color: #E50914; margin: 0; font-size: 22px; letter-spacing: 2px;">PLEADINGS</h1>
            <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">CERTIFIED INDIAN CASE LAWS & ADVOCATE NETWORK</p>
          </div>

          <p style="font-size: 15px; color: #ffffff;">Respected Adv. ${submission.advocate.name},</p>

          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            Thank you for submitting the landmark case <strong>"${submission.caseDetails.title} (${submission.caseDetails.year})"</strong> to the Pleadings Indian Law Archive.
          </p>

          <div style="background-color: #171922; border-left: 3px solid #D4AF37; padding: 14px; margin: 16px 0; font-size: 13px; color: #e2e8f0;">
            <div style="margin-bottom: 4px;"><strong>Citation:</strong> ${submission.caseDetails.citation}</div>
            <div style="margin-bottom: 4px;"><strong>Court:</strong> ${submission.caseDetails.court}</div>
            <div style="margin-bottom: 4px;"><strong>Statutes:</strong> ${submission.caseDetails.statutes}</div>
            <div><strong>Submission Ref ID:</strong> <span style="font-family: monospace; color: #D4AF37; font-weight: bold;">${submission.id}</span></div>
          </div>

          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            Our legal editorial panel is currently verifying the paragraph citations, statutory mappings (IPC to BNS), and holding against certified registry records. Once verified, this case will be published on <a href="https://pleadings.in" style="color: #D4AF37; text-decoration: none; font-weight: bold;">pleadings.in</a> with full contributor attribution to your advocate profile.
          </p>

          <p style="font-size: 13px; color: #cbd5e1; line-height: 1.6; margin-top: 20px;">
            Warm regards,<br/>
            <strong>Editorial Board</strong><br/>
            <span style="color: #D4AF37;">Pleadings (pleadings.in)</span>
          </p>
        </div>
      `;

      const ackInfo = await transporter.sendMail({
        from: `"Pleadings Editorial Desk" <${gmailUser}>`,
        to: submission.advocate.email,
        subject: `Case Submission Received: ${submission.caseDetails.title} [Ref: #${refId}]`,
        html: ackHtml,
      });
      console.log(`[Email] Advocate acknowledgement dispatched to ${submission.advocate.email}, MessageId: ${ackInfo.messageId}`);
      advocateDispatched = true;
    } catch (ackErr: any) {
      console.warn('[Email] Advocate auto-ack email warning:', ackErr?.message || ackErr);
    }
  }

  return {
    success: adminDispatched,
    adminDispatched,
    advocateDispatched,
    error: errorMsg,
  };
}

/**
 * Dispatches notification when a case is created or published via Admin Panel
 */
export async function sendAdminCaseCreatedEmail(
  caseRecord: any
): Promise<boolean> {
  const transporter = createEmailTransporter();
  const { gmailUser } = getSmtpCredentials();
  if (!transporter || !gmailUser) return false;

  const adminRecipients = getAdminRecipients();
  const timeStr = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Kolkata',
  });

  try {
    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; background-color: #0E1016; color: #F3EFE6; padding: 24px; border-radius: 8px; max-width: 650px; margin: 0 auto; border: 1px solid #D4AF37;">
        <div style="border-bottom: 2px solid #D4AF37; padding-bottom: 12px; margin-bottom: 20px;">
          <h1 style="color: #E50914; margin: 0; font-size: 22px; letter-spacing: 2px;">PLEADINGS ADMIN</h1>
          <p style="color: #D4AF37; margin: 4px 0 0 0; font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase;">NEW CASE ADDED & INGESTED INTO CATALOG</p>
        </div>

        <div style="background-color: #171922; border: 1px solid #2a2d3d; border-radius: 6px; padding: 16px; margin-bottom: 16px;">
          <h2 style="color: #ffffff; margin: 0 0 8px 0; font-size: 18px;">${caseRecord.title || caseRecord.shortTitle}</h2>
          <div style="font-size: 13px; color: #cbd5e1; line-height: 1.6;">
            <div><strong>Citation:</strong> <span style="color: #D4AF37;">${caseRecord.citation || 'N/A'}</span></div>
            <div><strong>Court & Year:</strong> ${caseRecord.court || 'Supreme Court'} (${caseRecord.year || '2025'})</div>
            <div><strong>Genre:</strong> ${caseRecord.genre || 'Constitutional'}</div>
            <div><strong>Reviewing Counsel:</strong> ${caseRecord.reviewer || 'Editorial'} (${caseRecord.enrolmentNumber || 'Verified'})</div>
            <div><strong>Slug:</strong> <code>${caseRecord.slug}</code></div>
          </div>
        </div>

        <div style="text-align: center; padding-top: 10px; font-size: 11px; color: #94a3b8;">
          <p style="margin: 0;">Case Ingestion Timestamp: ${timeStr}</p>
        </div>
      </div>
    `;

    for (const recipient of adminRecipients) {
      await transporter.sendMail({
        from: `"Pleadings Admin System" <${gmailUser}>`,
        to: recipient,
        subject: `[Case Added] ${caseRecord.title || caseRecord.slug} (${caseRecord.year || 2025}) [${timeStr}]`,
        html,
      });
      console.log(`[Email] Case creation alert dispatched to ${recipient}`);
    }
    return true;
  } catch (err) {
    console.error('[Email] Failed to send admin case creation email:', err);
    return false;
  }
}
