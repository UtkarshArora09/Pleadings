# Pleadings — Environment Variable Setup & Secret Rotation Guide

> **Security Rule:** NEVER commit real values to Git. Store production variables exclusively in **Vercel Project Settings -> Environment Variables** (Production & Preview) and local development values in `.env.local` (which is gitignored). A clean template is checked in at [.env.example](file:///c:/Users/Utkar/OneDrive/Desktop/grow/Pleadings/.env.example).

---

## 1. Required Production Environment Variables

| Variable | Scope | Required | Purpose & Generation Command |
| :--- | :--- | :---: | :--- |
| `ADMIN_PASSWORD_HASH` | Server-only | **YES** | `scrypt` hash of your Admin CMS master password (`SEC-001`). Generate locally with: `node -e "const c=require('crypto'),s=c.randomBytes(16).toString('hex');console.log('scrypt$'+s+'$'+c.scryptSync('YOUR_STRONG_PASS',s,64).toString('hex'))"` |
| `ADMIN_SESSION_SECRET` | Server-only | **YES** | 32-byte random hex key signing `HttpOnly` HMAC-SHA256 admin cookies (`SEC-001`/`SEC-003`). Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `NEXT_PUBLIC_SUPABASE_URL` | Client + Server | **YES** | Your Supabase project URL (`https://<ref>.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client + Server | **YES** | Supabase `anon` publishable key (restricted by PostgreSQL RLS to published cases only). |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-only** | **YES** | Service Role key for server-side admin case writes and private PII tables. **NEVER prefix with `NEXT_PUBLIC_`!** |
| `SUPABASE_PRIVATE_BUCKET` | Server-only | Recommended | Private (non-public) fallback storage bucket name. Default: `pleadings-private`. |
| `ADMIN_NOTIFY_EMAILS` | Server-only | **YES** | Comma-separated list of editorial admin email addresses (`SEC-006`). Replaces previously hardcoded emails. |
| `GMAIL_USER` (or `SMTP_USER`) | Server-only | Recommended | SMTP sender email address (e.g., editorial desk Gmail or transactional SMTP user). |
| `GMAIL_APP_PASSWORD` (or `SMTP_PASS`) | Server-only | Recommended | 16-char Google App Password (or transactional SMTP password). |
| `SMTP_HOST` / `SMTP_PORT` | Server-only | Optional | Defaults to `smtp.gmail.com` / `465` with strict TLS 1.2+ certificate verification (`rejectUnauthorized: true`). |

---

## 2. Strongly Recommended Free-Tier Security Variables

| Variable | Provider (Free Tier) | Purpose |
| :--- | :--- | :--- |
| `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` | [Upstash Redis](https://upstash.com/) (Free 10k cmds/day) | Distributed serverless rate limiting across all Vercel edge/lambda instances for `/api/admin/auth` (5/15m) and public write APIs (`SEC-003`, `SEC-007`). Falls back safely to in-memory limiter if omitted. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` & `TURNSTILE_SECRET_KEY` | [Cloudflare Turnstile](https://www.cloudflare.com/products/turnstile/) (Free unlimited) | Invisible human verification on `/contribute`, Suggest Case, Daily Subscribe, and Report Error (`SEC-007`). Server enforces automatically once `TURNSTILE_SECRET_KEY` is set. |

---

## 3. Optional AI & OCR Ingestion Keys (Server-Only)

Configure only the providers you actively use in Admin OCR / Image Studio:
- `GEMINI_API_KEY` (now transmitted via `x-goog-api-key` header — never in URL query strings, `SEC-012`)
- `GROQ_API_KEY`
- `OPENAI_API_KEY`
- `TOGETHER_API_KEY`
- `DEEPINFRA_API_KEY`
- `HF_TOKEN`

---

## 4. Mandatory Credential Rotation Procedure (Post-`SEC-001` Containment)

Because legacy admin credentials were previously visible in Git history, perform these steps in Vercel before or immediately after deploying this branch:

1. **Generate a fresh strong Admin Password** (16+ random characters) and hash it into `ADMIN_PASSWORD_HASH`.
2. **Generate a brand-new `ADMIN_SESSION_SECRET`** (64 hex chars). Rotating this immediately invalidates any prior sessions.
3. **Remove** any old weak `ADMIN_KEY`, `ADMIN_PASSWORD`, or `ADMIN_PIN` env vars from Vercel once `ADMIN_PASSWORD_HASH` is set.
4. **Rotate** `SUPABASE_SERVICE_ROLE_KEY` (Supabase Dashboard -> Settings -> API -> Roll Service Key) and `GMAIL_APP_PASSWORD` (Google Account -> App Passwords -> Revoke old & create new) if there is any chance prior admin endpoints were abused.
5. **Rotate** any active AI provider API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`, `GROQ_API_KEY`) and set monthly spending caps in each provider's billing console.
6. **Redeploy** the Vercel project so all serverless functions pick up the new environment variables.
