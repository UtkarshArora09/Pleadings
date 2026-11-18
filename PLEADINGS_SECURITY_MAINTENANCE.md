# Pleadings — Continuous Security Management & Operations Playbook

This playbook establishes a sustainable, zero-cost-first DevSecOps lifecycle for Pleadings.

---

## 1. Automated CI/CD & Dependency Controls (Implemented in Repo)

- **GitHub Actions Security CI** ([.github/workflows/security-ci.yml](file:///c:/Users/Utkar/OneDrive/Desktop/grow/Pleadings/.github/workflows/security-ci.yml)):
  - Runs on every push/PR to `main` and every Monday 03:00 UTC.
  - Enforces: `tsc --noEmit`, `npm run lint` (zero warnings/errors), `npm test` (unit + security regression tests), static forbidden-pattern scan (`rejectUnauthorized: false`, hardcoded secrets), `npm audit --audit-level=high`, and `npm run build`.
- **Dependabot** ([.github/dependabot.yml](file:///c:/Users/Utkar/OneDrive/Desktop/grow/Pleadings/.github/dependabot.yml)):
  - Weekly grouped npm dependency security PRs + monthly GitHub Actions version updates.
- **GitHub Native Protections (Enable in GitHub Repo Settings -> Security):**
  - Enable **Secret Scanning** & **Push Protection** (free for public repos).
  - Enable **Dependabot Alerts** and **Branch Protection on `main`** requiring the `Security & Quality CI` status check before merge.

---

## 2. Monitoring, Logging & Alerting (Free-Tier Stack)

- **Structured Security Logs (`src/lib/security/rateLimit.ts`):**
  - Every failed admin login, login lockout (`429`), successful admin login/logout, case create/update/publish/delete, upload rejection, honeypot trigger, and rate-limit hit logs structured JSON (`service: "pleadings-security"`) with automatic PII/secret redaction (`[REDACTED]`).
  - Inspect via **Vercel Dashboard -> Logs** filtering by `pleadings-security`.
- **Error Tracking:** Connect **Sentry** (Free Developer tier) or **Vercel Web Analytics / Speed Insights** for frontend & API error spikes.
- **Uptime & SSL Monitoring:** Configure **UptimeRobot** or **Better Stack** (Free tier) to check `https://pleadings.in/` and `https://pleadings.in/api/cases` every 5 minutes with email alerts.
- **AI API Spend Guardrails:** Set hard monthly billing limits (e.g., \$5–\$10/month) in Google AI Studio / OpenAI / Groq / Together consoles; all `/api/admin/generate-*` and `/api/admin/ocr` endpoints are now rate-limited and capped on input size & upstream timeout.

---

## 3. Recurring Maintenance Cadence

| Cadence | Tasks |
| :--- | :--- |
| **Per Pull Request** | Automated CI (`tsc`, `eslint`, `npm test`, secret scan, `npm audit`, `next build`) must pass. |
| **Weekly** | Review Dependabot PRs; skim Vercel `pleadings-security` logs for `admin_login_failed`, `429`, or `500` anomalies. |
| **Monthly** | Audit Supabase Storage `case-images` contents (confirm zero PII/JSON files); verify RLS remains enabled on all tables; check AI provider usage dashboards. |
| **Quarterly** | Rotate `ADMIN_SESSION_SECRET` & `ADMIN_PASSWORD_HASH`; re-run `securityheaders.com` & Lighthouse audit; test restoring a Supabase SQL backup into a scratch database. |

---

## 4. Incident Response Playbook (10 Steps)

1. **Detect & Triage:** Identify abnormal admin edits, unexpected 401/429 spikes, or suspected secret exposure.
2. **Contain Immediately:** Rotate `ADMIN_SESSION_SECRET` (instantly revokes all admin sessions), `ADMIN_PASSWORD_HASH`, `SUPABASE_SERVICE_ROLE_KEY`, SMTP password, and AI API keys.
3. **Preserve Forensic Logs:** Export Vercel runtime logs, Supabase Postgres & Storage logs before making destructive edits.
4. **Assess Blast Radius:** Query `public.cases` `updated_at` timestamps and check `case-images` for unauthorized uploads.
5. **Assess Personal Data Impact:** Verify whether `advocate_submissions`, `daily_subscribers`, `case_suggestions`, or `editorial_error_reports` were accessed.
6. **Eradicate & Patch:** Remove unauthorized files/edits and deploy the fix via PR.
7. **Restore Clean Data:** Restore modified case records from pre-incident backup or verified legal records.
8. **Verify Externally:** Confirm old credentials return `401`, headers are intact, and CI passes.
9. **Legal / Regulatory Notice:** If personal data was breached, evaluate notification duties under India's **DPDP Act 2023** and **CERT-In** 6-hour incident reporting directives.
10. **Post-Mortem:** Record timeline, root cause, and new regression tests in `tests/security.test.ts` so the class of vulnerability cannot recur.
