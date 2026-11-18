import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  hashAdminPassword,
  isAdminAuthConfigured,
  validateAdminCredential,
  createAdminSessionToken,
  verifyAdminSessionToken,
  revokeAdminSessionToken,
} from '../src/lib/auth';
import {
  escapeHtml,
  safeJsonLd,
  sanitizeHttpUrl,
  validateSafeReturnUrl,
  verifyFileMagicBytes,
} from '../src/lib/security/sanitize';
import {
  checkRateLimit,
  _resetMemoryRateLimitsForTest,
} from '../src/lib/security/rateLimit';
import {
  SubscribeSchema,
  SuggestCaseSchema,
  ContributeSchema,
  ReportErrorSchema,
  VoteSchema,
  GenerateImageSchema,
  AdminCaseUpdateSchema,
} from '../src/lib/security/schemas';
import { getAdminRecipients } from '../src/lib/email';

describe('SEC-001 & SEC-003: Admin Authentication & Sessions', () => {
  const savedEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.ADMIN_PASSWORD_HASH;
    delete process.env.ADMIN_KEY;
    delete process.env.ADMIN_PASSWORD;
    delete process.env.ADMIN_PIN;
    delete process.env.ADMIN_SESSION_SECRET;
  });

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it('fails closed when no env credentials are configured and rejects all legacy defaults', () => {
    assert.equal(isAdminAuthConfigured(), false);
    assert.equal(validateAdminCredential('pleadings2025'), false);
    assert.equal(validateAdminCredential('admin123'), false);
    assert.equal(validateAdminCredential('pleadings'), false);
    assert.equal(validateAdminCredential('1947'), false);
    assert.equal(verifyAdminSessionToken('pleadings-secured-editorial-session-2025'), null);
    assert.equal(createAdminSessionToken(), null);
  });

  it('validates scrypt hashed admin password and issues revocable HMAC-signed sessions', () => {
    process.env.ADMIN_PASSWORD_HASH = hashAdminPassword('Str0ng!Editorial#2026');
    process.env.ADMIN_SESSION_SECRET = '0123456789abcdef0123456789abcdef';

    assert.equal(isAdminAuthConfigured(), true);
    assert.equal(validateAdminCredential('Str0ng!Editorial#2026'), true);
    assert.equal(validateAdminCredential('wrong-password'), false);
    assert.equal(validateAdminCredential('admin123'), false);

    const token = createAdminSessionToken(3600);
    assert.ok(token && token.includes('.'));

    const verified = verifyAdminSessionToken(token);
    assert.ok(verified);
    assert.equal(verified.sub, 'admin');

    // Tampered token must fail
    const tampered = `${token.slice(0, -4)}AAAA`;
    assert.equal(verifyAdminSessionToken(tampered), null);

    // Revoked token must fail immediately
    revokeAdminSessionToken(token);
    assert.equal(verifyAdminSessionToken(token), null);
  });

  it('rejects expired session tokens', () => {
    process.env.ADMIN_KEY = 'TestKey-999';
    process.env.ADMIN_SESSION_SECRET = 'fedcba9876543210fedcba9876543210';
    const expired = createAdminSessionToken(-10);
    assert.ok(expired);
    assert.equal(verifyAdminSessionToken(expired), null);
  });

  it('prevents Open Redirect via returnUrl validation', () => {
    assert.equal(validateSafeReturnUrl('/admin/cases/shah-bano'), '/admin/cases/shah-bano');
    assert.equal(validateSafeReturnUrl('https://evil.example/phish'), '/admin');
    assert.equal(validateSafeReturnUrl('//evil.example/phish'), '/admin');
    assert.equal(validateSafeReturnUrl('javascript:alert(1)'), '/admin');
    assert.equal(validateSafeReturnUrl('/admin/login?loop=1'), '/admin');
    assert.equal(validateSafeReturnUrl('/browse'), '/admin');
  });
});

describe('SEC-004: File Signature (Magic Bytes) Validation', () => {
  it('accepts genuine JPEG, PNG, WebP, and PDF headers', () => {
    const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0]);
    const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP')]);
    const pdf = Buffer.from('%PDF-1.7\n1 0 obj\n');

    assert.equal(verifyFileMagicBytes(jpeg, 'image').extension, 'jpg');
    assert.equal(verifyFileMagicBytes(png, 'image').extension, 'png');
    assert.equal(verifyFileMagicBytes(webp, 'image').extension, 'webp');
    assert.equal(verifyFileMagicBytes(pdf, 'image').valid, false);
    assert.equal(verifyFileMagicBytes(pdf, 'ocr').extension, 'pdf');
  });

  it('rejects SVG XSS payloads and arbitrary scripts disguised as images', () => {
    const svg = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>');
    const html = Buffer.from('<html><body><script>alert(1)</script></body></html>');

    assert.equal(verifyFileMagicBytes(svg, 'image').valid, false);
    assert.equal(verifyFileMagicBytes(svg, 'ocr').valid, false);
    assert.equal(verifyFileMagicBytes(html, 'image').valid, false);
  });
});

describe('SEC-006: Zero Hardcoded Admin Emails', () => {
  const savedEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...savedEnv };
  });

  it('returns empty recipient list when no admin email env vars are set', () => {
    delete process.env.ADMIN_NOTIFY_EMAILS;
    delete process.env.ADMIN_EMAIL;
    delete process.env.GMAIL_USER;
    delete process.env.SMTP_USER;

    assert.deepEqual(getAdminRecipients(), []);
  });

  it('parses deduplicated ADMIN_NOTIFY_EMAILS from env', () => {
    process.env.ADMIN_NOTIFY_EMAILS = 'editor@pleadings.in, Desk@Pleadings.in, editor@pleadings.in';
    assert.deepEqual(getAdminRecipients(), ['editor@pleadings.in', 'desk@pleadings.in']);
  });
});

describe('SEC-007: Sliding-Window Rate Limiting', () => {
  beforeEach(() => {
    _resetMemoryRateLimitsForTest();
  });

  it('blocks requests exceeding the configured threshold', async () => {
    const opts = { prefix: 'test-login', limit: 3, windowSec: 60 };
    assert.equal((await checkRateLimit('1.2.3.4', opts)).allowed, true);
    assert.equal((await checkRateLimit('1.2.3.4', opts)).allowed, true);
    assert.equal((await checkRateLimit('1.2.3.4', opts)).allowed, true);
    const fourth = await checkRateLimit('1.2.3.4', opts);
    assert.equal(fourth.allowed, false);
    assert.ok(fourth.retryAfterSec > 0);
  });
});

describe('SEC-009: XSS & Protocol Sanitization', () => {
  it('escapes script breakout characters in JSON-LD', () => {
    const out = safeJsonLd({ title: 'Case </script><script>alert(1)</script>' });
    assert.equal(out.includes('</script>'), false);
    assert.ok(out.includes('\\u003c/script\\u003e'));
  });

  it('blocks dangerous URL schemes and permits safe http/https/relative links', () => {
    assert.equal(sanitizeHttpUrl('javascript:alert(1)'), 'https://indiankanoon.org/');
    assert.equal(sanitizeHttpUrl('data:text/html,<script>alert(1)</script>'), 'https://indiankanoon.org/');
    assert.equal(sanitizeHttpUrl('//evil.example'), 'https://indiankanoon.org/');
    assert.equal(sanitizeHttpUrl('https://indiankanoon.org/doc/123/'), 'https://indiankanoon.org/doc/123/');
    assert.equal(sanitizeHttpUrl('/case/shah-bano'), '/case/shah-bano');
  });

  it('escapes HTML entities safely for email templates', () => {
    assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  });
});

describe('SEC-010: Strict Zod API Schemas', () => {
  it('validates SubscribeSchema and rejects bad contacts', () => {
    assert.equal(SubscribeSchema.safeParse({ channel: 'email', contact: 'not-an-email' }).success, false);
    assert.equal(SubscribeSchema.safeParse({ channel: 'whatsapp', contact: '12345' }).success, false);
    assert.equal(SubscribeSchema.safeParse({ channel: 'whatsapp', contact: '+91 9876543210' }).success, true);
    assert.equal(SubscribeSchema.safeParse({ channel: 'email', contact: 'reader@example.com' }).success, true);
  });

  it('rejects unknown mass-assignment fields in AdminCaseUpdateSchema', () => {
    const bad = AdminCaseUpdateSchema.safeParse({ title: 'Valid Title', maliciousExtraCol: 'drop table' });
    assert.equal(bad.success, false);

    const good = AdminCaseUpdateSchema.safeParse({
      title: 'Valid Title',
      publishStatus: 'PUBLISHED',
      legalStatus: { code: 'OVERRULED', explain: 'Overruled by 9-judge bench', chain: [] },
    });
    assert.equal(good.success, true);
  });

  it('enforces length bounds across public form & AI schemas', () => {
    assert.equal(SuggestCaseSchema.safeParse({ caseName: 'A', storySynopsis: 'short' }).success, false);
    assert.equal(ReportErrorSchema.safeParse({ slug: 'shah-bano', description: 'short' }).success, false);
    assert.equal(VoteSchema.safeParse({ slug: '', optionId: 'a', anonId: '1' }).success, false);
    assert.equal(GenerateImageSchema.safeParse({ prompt: 'a'.repeat(3000) }).success, false);
    assert.equal(
      ContributeSchema.safeParse({
        advocateName: 'Adv. Test',
        barCouncilNo: 'D/100/2020',
        email: 'bad-email',
        phone: '9876543210',
        caseTitle: 'Test v. State',
        court: 'Supreme Court of India',
        year: '2024',
        citation: '2024 INSC 1',
        statutes: 'Article 21',
        facts: 'Detailed verified statement of facts exceeding minimum length.',
        holdingAndRatio: 'Binding legal ratio exceeding minimum length.',
      }).success,
      false
    );
  });
});
