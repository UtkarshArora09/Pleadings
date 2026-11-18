# Pleadings — Production Deployment & Verification Checklist

> **Current Status:** All 40 fixes are implemented locally on branch `fix/complete-production-audit`. Nothing has been pushed to GitHub, deployed to Vercel, or applied to production Supabase yet.

---

## 1. Pre-Deployment Steps (Manual Approval Required)

1. **Review Diff & Local Branch:**
   - Confirm untracked `posterGeneration/` remains untouched.
   - Review `git diff main...fix/complete-production-audit`.
2. **Apply Supabase SQL Migration (Staging First, Then Production):**
   - Take full Supabase backup (`PLEADINGS_DATABASE_MIGRATION.md` Section 1).
   - Run [supabase/migrations/20261118_security_and_pii_tables.sql](file:///c:/Users/Utkar/OneDrive/Desktop/grow/Pleadings/supabase/migrations/20261118_security_and_pii_tables.sql).
   - Archive & remove legacy `submissions/`, `subscribers/`, `suggestions/`, and `votes/` folders from public `case-images` bucket.
3. **Update Vercel Environment Variables (`PLEADINGS_ENV_SETUP.md`):**
   - Set `ADMIN_PASSWORD_HASH` (new strong scrypt hash) and `ADMIN_SESSION_SECRET` (new 64-hex secret).
   - Remove legacy `ADMIN_KEY` / `ADMIN_PASSWORD` / `ADMIN_PIN` once `ADMIN_PASSWORD_HASH` is set.
   - Set `ADMIN_NOTIFY_EMAILS` with your editorial email(s).
   - Set `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN` (free tier) for distributed rate limiting.
   - Optionally set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` & `TURNSTILE_SECRET_KEY` (free tier).
   - Confirm `SUPABASE_SERVICE_ROLE_KEY` is Server-only (never `NEXT_PUBLIC_`).
4. **Verify Domain Canonicalization in Vercel Domains (`SEO-004`):**
   - Confirm `www.pleadings.in` performs a single **301 Permanent Redirect** to `https://pleadings.in` (matching all canonical URLs, `robots.txt`, and `sitemap.xml`).
5. **Merge & Deploy:**
   - Push `fix/complete-production-audit`, open PR to `main`, confirm GitHub Actions **Security & Quality CI** passes green, then merge to deploy on Vercel.

---

## 2. Post-Deployment Smoke & Security Verification

Run these checks immediately after Vercel finishes deploying:

- [ ] **HTTP Security Headers (`SEC-005`):** `curl -sI https://pleadings.in/` includes `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and NO `X-Powered-By: Next.js`.
- [ ] **Admin Gate (`SEC-001`, `SEC-003`):**
  - `GET https://pleadings.in/admin` redirects **307** to `/admin/login?returnUrl=%2Fadmin` server-side.
  - `GET https://pleadings.in/api/admin/cases` without cookie returns **401**.
  - Old legacy passwords & hardcoded Bearer token return **401**.
  - 6 rapid failed logins on `/api/admin/auth` return **429 Too Many Requests** with `Retry-After`.
  - Logging in with your new strong password sets `HttpOnly; Secure; SameSite=Strict` cookie and returns NO `token` field in JSON.
- [ ] **Draft Protection (`SEC-008`):** Visiting `/case/<draft-slug>` and `/api/cases/<draft-slug>` returns **404**.
- [ ] **SEO Fixes (`SEO-001`–`SEO-004`):**
  - `GET https://pleadings.in/case/non-existent-test-slug` returns **HTTP 404** (not 200!).
  - View source on `/browse`, `/bns`, `/glossary`, `/contribute` — each has its own self-referencing `<link rel="canonical" href="https://pleadings.in/<route>">`.
  - View source on a live case page — JSON-LD `image` is a single valid `https://...` URL (no `https://pleadings.inhttps://...`).
  - Resubmit `https://pleadings.in/sitemap.xml` in Google Search Console and request indexing on key updated URLs.
- [ ] **UX & A11Y (`UI-001`, `BUG-002`, `BUG-006`):**
  - Highlight and copy text on desktop `/case/<slug>` Scroll view, `/browse`, `/bns`, and `/glossary`.
  - Confirm zero 404 clicks on Related Doctrines chips on `/glossary/[term]`.
  - Confirm `Escape` key closes all modals (`SuggestCaseModal`, `ReportErrorButton`, `GlossarySheet`, `ShareSheet`, `ParaSheet`).

---

## 3. Instant Rollback Plan

1. **Application Rollback (< 1 minute):** In **Vercel Dashboard -> Deployments**, promote the previous production deployment to Current.
2. **Session Emergency Kill-Switch (< 30 seconds):** Rotate `ADMIN_SESSION_SECRET` in Vercel and redeploy to revoke all active admin cookies globally.
3. **Database Rollback:** Only if required, execute the rollback SQL block in `PLEADINGS_DATABASE_MIGRATION.md` or restore the pre-migration Supabase snapshot.
