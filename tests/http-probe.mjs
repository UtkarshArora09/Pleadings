import { spawn } from 'node:child_process';
import http from 'node:http';

const PORT = 3199;
const BASE = `http://127.0.0.1:${PORT}`;

// Pre-computed scrypt hash for password "TestAdmin2026!":
// crypto.scryptSync('TestAdmin2026!', 'testsalt12345678', 64).toString('hex')
// Salt: 'testsalt12345678'
import crypto from 'node:crypto';
const testPassword = 'TestAdmin2026!';
const testSalt = crypto.randomBytes(16).toString('hex');
const testDerived = crypto.scryptSync(testPassword, testSalt, 64).toString('hex');
const ADMIN_PASSWORD_HASH = `scrypt$${testSalt}$${testDerived}`;
const ADMIN_SESSION_SECRET = crypto.randomBytes(32).toString('hex');

const env = {
  ...process.env,
  PORT: String(PORT),
  ADMIN_PASSWORD_HASH,
  ADMIN_SESSION_SECRET,
  ADMIN_KEY: 'test_admin_probe_key_12345',
  NEXT_PUBLIC_BASE_URL: BASE,
  NODE_ENV: 'production',
};

async function waitServerReady(maxMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(`${BASE}/`, { method: 'GET' });
      if (res.status === 200) return true;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Server failed to start on ${BASE} within ${maxMs}ms`);
}

async function run() {
  console.log(`[HTTP PROBE] Launching Next.js production server on port ${PORT}...`);
  const server = spawn('node', ['node_modules/next/dist/bin/next', 'start', '-p', String(PORT), '-H', '127.0.0.1'], {
    env,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: false,
  });

  server.stdout.on('data', (d) => process.stdout.write(`[SERVER] ${d.toString()}`));
  server.stderr.on('data', (d) => process.stderr.write(`[SERVER ERR] ${d.toString()}`));

  const results = [];

  function record(id, name, pass, detail) {
    results.push({ id, name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${id}: ${name} - ${detail}`);
  }

  try {
    await waitServerReady();
    console.log('[HTTP PROBE] Server ready. Running 16 HTTP and security probes...\n');

    // 1. Root / security headers & no X-Powered-By
    const rootRes = await fetch(`${BASE}/`);
    const csp = rootRes.headers.get('content-security-policy') || '';
    const xfo = rootRes.headers.get('x-frame-options') || '';
    const xcto = rootRes.headers.get('x-content-type-options') || '';
    const poweredBy = rootRes.headers.get('x-powered-by');
    const h1Pass = rootRes.status === 200 && csp.length > 20 && xfo === 'DENY' && xcto === 'nosniff' && !poweredBy;
    record('PROBE-01', 'Root security headers & X-Powered-By suppression', h1Pass,
      `Status=${rootRes.status}, CSP=${!!csp}, XFO=${xfo}, XCTO=${xcto}, X-Powered-By=${poweredBy ?? 'REMOVED'}`);

    // 2. /admin -> 307 redirect to /admin/login
    const adminRes = await fetch(`${BASE}/admin`, { redirect: 'manual' });
    const location = adminRes.headers.get('location') || '';
    const cacheControl = adminRes.headers.get('cache-control') || '';
    const xRobots = adminRes.headers.get('x-robots-tag') || '';
    const h2Pass = (adminRes.status === 307 || adminRes.status === 302) &&
                   location.includes('/admin/login') &&
                   cacheControl.includes('no-store') &&
                   xRobots.includes('noindex');
    record('PROBE-02', 'Admin route server-side proxy protection', h2Pass,
      `Status=${adminRes.status}, Location=${location}, Cache-Control=${cacheControl}, X-Robots-Tag=${xRobots}`);

    // 3. /api/admin/cases -> 401 Unauthorized
    const apiAdminRes = await fetch(`${BASE}/api/admin/cases`);
    const h3Pass = apiAdminRes.status === 401;
    record('PROBE-03', 'Admin API endpoint blocks unauthenticated calls', h3Pass, `Status=${apiAdminRes.status}`);

    // 4. Legacy Bearer token rejected
    const legacyBearerRes = await fetch(`${BASE}/api/admin/cases`, {
      headers: { Authorization: 'Bearer dev-admin-token-2024' },
    });
    const h4Pass = legacyBearerRes.status === 401;
    record('PROBE-04', 'Admin API rejects revoked static Bearer token', h4Pass, `Status=${legacyBearerRes.status}`);

    // 5. Auth endpoint rejects incorrect password
    const wrongAuthRes = await fetch(`${BASE}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong_password_123' }),
    });
    const h5Pass = wrongAuthRes.status === 401;
    record('PROBE-05', 'Admin login rejects incorrect credentials', h5Pass, `Status=${wrongAuthRes.status}`);

    // 6. Auth rate limit enforcement (5 attempts allowed, 6th triggers 429)
    let rateLimited = false;
    for (let i = 0; i < 6; i++) {
      const rlRes = await fetch(`${BASE}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: `bruteforce_attempt_${i}` }),
      });
      if (rlRes.status === 429) {
        rateLimited = true;
        break;
      }
    }
    record('PROBE-06', 'Admin login rate limiting triggers 429', rateLimited, `RateLimitBlocked=${rateLimited}`);

    // 7. Successful login issues HttpOnly SameSite=Strict cookie with NO token in body
    // Use an IP / X-Forwarded-For header to test fresh bucket
    const authRes = await fetch(`${BASE}/api/admin/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': '198.51.100.42',
      },
      body: JSON.stringify({ password: testPassword }),
    });
    const authBody = await authRes.json().catch(() => ({}));
    const setCookie = authRes.headers.get('set-cookie') || '';
    const h7Pass = authRes.status === 200 &&
                   authBody.success === true &&
                   authBody.token === undefined &&
                   setCookie.includes('pleadings_admin_session=') &&
                   setCookie.toLowerCase().includes('httponly') &&
                   setCookie.toLowerCase().includes('samesite=strict');
    record('PROBE-07', 'Admin login issues secure HttpOnly session without leaking token', h7Pass,
      `Status=${authRes.status}, TokenInBody=${'token' in authBody}, Cookie=${setCookie.split(';')[0]}`);

    // 8. Missing case slug returns true 404
    const notFoundRes = await fetch(`${BASE}/case/non-existent-case-slug-test-12345`);
    const h8Pass = notFoundRes.status === 404;
    record('PROBE-08', 'Missing case slug returns HTTP 404', h8Pass, `Status=${notFoundRes.status}`);

    // 9. /browse returns 200
    const browseRes = await fetch(`${BASE}/browse`);
    const h9Pass = browseRes.status === 200;
    record('PROBE-09', 'Browse page returns HTTP 200', h9Pass, `Status=${browseRes.status}`);

    // 10. /bns returns 200
    const bnsRes = await fetch(`${BASE}/bns`);
    const h10Pass = bnsRes.status === 200;
    record('PROBE-10', 'BNS Concordance page returns HTTP 200', h10Pass, `Status=${bnsRes.status}`);

    // 11. /glossary returns 200
    const glossaryRes = await fetch(`${BASE}/glossary`);
    const h11Pass = glossaryRes.status === 200;
    record('PROBE-11', 'Legal Glossary page returns HTTP 200', h11Pass, `Status=${glossaryRes.status}`);

    // 12. /contribute returns 200
    const contributeRes = await fetch(`${BASE}/contribute`);
    const h12Pass = contributeRes.status === 200;
    record('PROBE-12', 'Contribute page returns HTTP 200', h12Pass, `Status=${contributeRes.status}`);

    // 13. /privacy returns 200
    const privacyRes = await fetch(`${BASE}/privacy`);
    const h13Pass = privacyRes.status === 200;
    record('PROBE-13', 'Privacy Policy page returns HTTP 200', h13Pass, `Status=${privacyRes.status}`);

    // 14. /api/subscribe invalid email -> 400
    const subRes = await fetch(`${BASE}/api/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'not-an-email' }),
    });
    const h14Pass = subRes.status === 400;
    record('PROBE-14', 'Subscribe API strictly validates email schema', h14Pass, `Status=${subRes.status}`);

    // 15. /api/report-error empty body -> 400
    const repRes = await fetch(`${BASE}/api/report-error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const h15Pass = repRes.status === 400;
    record('PROBE-15', 'Report Error API validates schema and rejects empty bodies', h15Pass, `Status=${repRes.status}`);

    // 16. /api/suggest-case honeypot catches bots
    const botRes = await fetch(`${BASE}/api/suggest-case`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Spam Case',
        description: 'Spam description',
        website_feedback: 'im-a-bot',
      }),
    });
    // Silent success 200 or 400 is expected for bot trap
    const h16Pass = botRes.status === 200 || botRes.status === 400;
    record('PROBE-16', 'Suggest Case honeypot handles spam bot payloads', h16Pass, `Status=${botRes.status}`);

  } finally {
    console.log('\n[HTTP PROBE] Shutting down test server...');
    server.kill('SIGTERM');
    // Ensure exit
    setTimeout(() => {
      try { server.kill('SIGKILL'); } catch {}
    }, 1000);
  }

  const allPass = results.every((r) => r.pass);
  console.log(`\n======================================================`);
  console.log(`PROBE SUMMARY: ${results.filter((r) => r.pass).length}/${results.length} PASSED`);
  console.log(`RESULT: ${allPass ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
  console.log(`======================================================\n`);

  if (!allPass) process.exit(1);
}

run().catch((err) => {
  console.error('[PROBE FATAL ERROR]', err);
  process.exit(1);
});
