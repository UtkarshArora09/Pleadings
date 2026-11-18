# Pleadings — Complete Production Website Audit Report

- **Platform:** Pleadings (`https://www.pleadings.in/` | canonical: `https://pleadings.in`)
- **Repository:** `https://github.com/UtkarshArora09/Pleadings` (Branch: `main`, HEAD `dca47ed`)
- **Audit Mode:** Phase 1 — Read-Only Static, Architectural, Security, SEO, A11Y, Performance & QA Audit (Zero code/config/DB modifications made)
- **Dedicated Security Report:** See `PLEADINGS_SECURITY_REPORT.md` for full OWASP Top 10 / API Top 10 / CWE / CVSS analysis, Supabase hardening, DPDP Act compliance, Incident Response Plan, and Backup/DR strategy.

---

## 1. Executive Summary

| Severity | Count | Summary |
| :--- | :---: | :--- |
| **P0 — Critical** | **4** | Hardcoded admin session token & weak default passwords in public repo (`SEC-001`), User PII stored in public Supabase Storage bucket (`SEC-002`), Editorial vs. Legal `status` field collision hiding overruled/superseded precedents (`BUG-001`), Draft/Unpublished case public disclosure (`SEC-008`) |
| **P1 — High** | **15** | Missing security headers, unauthenticated public write endpoints without rate limiting/spam defense (email-bombing risk), disabled SMTP TLS cert verification, unrestricted file uploads, JSON-LD broken URL & script-breakout risk, Soft-404 HTTP 200 on invalid case slugs, duplicate canonical SEO bug on client pages, 20 broken 404 glossary links, lost `/api/report-error` submissions, broken view counter on cold starts, `select-none` blocking text copying in Scroll view & core pages, missing error/404 boundaries |
| **P2 — Medium** | **14** | Open redirect on admin login, keyboard/swipe hijack in Scroll mode, missing 2000s decade filter, duplicate client fetches & public 401 calls to `/api/admin/cases`, silent-success bugs on `/api/subscribe` & `/api/vote`, unoptimized remote images (`unoptimized=true`), missing modal accessibility (Escape/focus trap/portals), share card factual mismatch, Tailwind invalid class / missing `xs:` breakpoint, hardcoded `'IPC 79'` fallback, `Hero` empty-array crash |
| **P3 — Low / Polish** | **7** | 45 ESLint warnings, 161 `any` usages, 3,055-line god component (`admin/cases/[slug]/page.tsx`), 11 unused legacy components, duplicate favicons & starter SVGs in `public/`, missing empty state on `/glossary`, missing unit/E2E test suite |
| **Total Issues** | **40** | **12 Security (`SEC-001`–`SEC-012`) + 28 Functional/UI/SEO/Perf/A11Y/Code Quality/Editorial** |

### Technology Stack & Architecture Inventory
- **Framework:** Next.js `16.3.5` (App Router, `next build --webpack`), React `19.2.8`, TypeScript `^5`
- **Styling:** Tailwind CSS `^4` (`@import "tailwindcss"` in `src/app/globals.css`), fonts: `Anton`, `Montserrat`, `Noto Sans Devanagari`
- **Backend / Data:** Supabase (`@supabase/supabase-js ^2.116.0` — PostgreSQL `cases` table + Storage bucket `case-images`), in-memory 60s cache (`CaseStore`), `nodemailer ^10.0.10`, `zod ^4.6.7`
- **AI / OCR Pipeline:** Gemini (`2.0-flash` / `1.5-flash` / `1.5-pro` / `2.5-flash` / Imagen 3), Groq, OpenAI, Together AI, DeepInfra, Hugging Face, Pollinations fallback
- **Quality Checks Executed Locally:**
  - `npx tsc --noEmit`: **PASS (0 errors)**
  - `npm run lint`: **PASS with 45 warnings (0 errors)** — 4 `react-hooks/exhaustive-deps`, 3 `@next/next/no-img-element`, 38 `@typescript-eslint/no-unused-vars`
  - `src/` Scale: 133 TypeScript/TSX files, 161 explicit `any` occurrences, 44 files containing `select-none`

### Route & Feature Inventory

| Route | Render Mode | Purpose | Auth |
| :--- | :--- | :--- | :--- |
| `/` | Dynamic SSR (`force-dynamic`) | Homepage (Hero, Top 10, Essential Precedents, Courtroom Showcase, Suggest Case, Footer) | Public |
| `/browse` | Client (`'use client'`) | Search & multi-filter case directory + Saved tab (`?tab=saved`, `?q=`) | Public |
| `/case/[slug]` | Dynamic SSR + Client hydration | Case dossier (Slide mode on mobile, Scroll mode on desktop, VoteGate, TapToDefine, Exhibits, Share, Daily Subscribe, Report Error) | Public (Bug: leaks drafts) |
| `/glossary` | Client (`'use client'`) | Bilingual plain-English legal glossary (16 entries in `content/glossary.json`) | Public |
| `/glossary/[term]` | Dynamic SSR + `generateStaticParams` | Individual doctrine definition + linked landmark cases | Public |
| `/bns` | Client (`'use client'`) | IPC/CrPC/IEA -> BNS/BNSS/BSA concordance (18 mappings in `content/statute-map.json`) | Public |
| `/contribute` | Client (`'use client'`) | Advocate case submission form (`POST /api/contribute`) | Public |
| `/about` | Static/SSR | Editorial method, 3-tier sourcing (BLACK/BLUE/AMBER), masthead | Public |
| `/corrections` | Dynamic SSR | Public corrections log with live slug resolution | Public |
| `/admin`, `/admin/new`, `/admin/ocr`, `/admin/cases/[slug]`, `/admin/login` | Client-guarded Admin CMS | Case CRUD, OCR PDF/image ingestion, AI prompt & image generator, publishing | Broken (`SEC-001`, client-only gate) |
| `/api/cases`, `/api/cases/[slug]`, `/api/cases/[slug]/view` | Dynamic API | Public case reads & view counter | Public |
| `/api/subscribe`, `/api/suggest-case`, `/api/contribute`, `/api/report-error`, `/api/vote`, `/api/vote/[slug]` | Dynamic API | Public user writes, voting & email dispatch | Public (unthrottled) |
| `/api/share/[slug]` | Node.js `ImageResponse` | Dynamic 1080×1350 verdict card & OG image | Public |
| `/api/admin/*` | Dynamic API | Auth, Case CRUD, Publish, Upload, OCR, AI Image/Prompts | Broken (`SEC-001`) |
| `/robots.txt`, `/sitemap.xml`, `/manifest.webmanifest` | Next.js Metadata Routes | Crawler rules, dynamic Supabase sitemap, PWA manifest | Public |

---

## 2. Master Summary Table of All Findings

| ID | Category | Severity | Summary | Affected File / Route |
| :--- | :--- | :---: | :--- | :--- |
| `SEC-001` | Security | **P0** | Hardcoded static admin session token & 4 weak default passwords in public repo | `src/lib/auth.ts:5-16` |
| `SEC-002` | Security | **P0** | Sensitive user PII (phones, emails, Bar Council Nos.) written to public `case-images` bucket | `src/lib/supabase.ts:154-205` |
| `BUG-001` | Functional / DB | **P0** | `status` field collision hides `OVERRULED` / `PARTLY_SUPERSEDED` / `STATUTE_REPLACED` cases from entire site | `src/lib/cases.ts:46,105-129`, `src/lib/db/caseStore.ts:328-330` |
| `SEC-008` | Security / API | **P0** | Unpublished `DRAFT` / `ADMIN_REVIEW` cases publicly accessible via `/case/[slug]`, `/api/cases/[slug]`, `/api/share/[slug]` | `src/app/api/cases/[slug]/route.ts:18-21`, `src/lib/cases.ts:131-153` |
| `SEC-003` | Security | **P1** | No auth rate limiting/lockout, token leaked in JSON body, no session rotation, client-only admin gate, login Open Redirect | `src/app/api/admin/auth/route.ts`, `src/app/admin/layout.tsx`, `src/app/admin/login/page.tsx:10,37` |
| `SEC-004` | Security / API | **P1** | Unrestricted file upload (no size cap, no magic-byte check, unsanitized extension) in `/api/admin/upload` & `/api/admin/ocr` | `src/app/api/admin/upload/route.ts`, `src/app/api/admin/ocr/route.ts` |
| `SEC-005` | Security | **P1** | Zero HTTP security headers (no CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) | `next.config.ts` |
| `SEC-006` | Security | **P1** | SMTP TLS verification disabled (`rejectUnauthorized: false`) & personal admin emails hardcoded in public repo | `src/lib/email.ts:12-20,92` |
| `SEC-007` | Security / API | **P1** | Unauthenticated write APIs lack rate limits, bot protection, & length caps (email-bombing & storage DoS risk) | `src/app/api/{subscribe,suggest-case,contribute,report-error,vote}/route.ts` |
| `SEC-009` | Security | **P1** | JSON-LD `dangerouslySetInnerHTML` lacks `<` escaping (script-breakout XSS) & unvalidated `href` protocols | `src/app/case/[slug]/page.tsx:447`, `src/components/case/SourcesAndCorrections.tsx:65,77` |
| `SEO-001` | SEO | **P1** | Soft-404 bug: invalid `/case/<garbage>` returns HTTP 200 OK with `robots: index, follow` | `src/app/case/[slug]/page.tsx:247-254,309-459` |
| `SEO-002` | SEO | **P1** | Broken JSON-LD `image` produces `https://pleadings.inhttps://...supabase.co/...` for remote posters | `src/app/case/[slug]/page.tsx:350` |
| `SEO-003` | SEO | **P1** | `/browse`, `/bns`, `/glossary`, `/contribute` inherit homepage `canonical: https://pleadings.in` (duplicate canonical bug) | `src/app/{browse,bns,glossary,contribute}/page.tsx`, `src/app/layout.tsx` |
| `BUG-002` | Functional | **P1** | 20 broken 404 internal links in `content/glossary.json` (`related` doctrine chips) | `content/glossary.json`, `src/app/glossary/[term]/page.tsx:144-160` |
| `BUG-003` | Functional / API | **P1** | `/api/report-error` only `console.log`s user correction reports — never persists or emails admins | `src/app/api/report-error/route.ts:15-20` |
| `DB-001` | Backend / DB | **P1** | View counter (`POST/GET /api/cases/[slug]/view`) fails on serverless cold starts & suffers non-atomic lost updates | `src/app/api/cases/[slug]/view/route.ts`, `src/lib/db/caseStore.ts:392-408` |
| `UI-001` | UI/UX / A11Y | **P1** | `select-none` blocks text selection/copying across desktop Scroll case reader and `/browse`, `/bns`, `/glossary`, `/about`, `/corrections` | `src/components/case/CaseViewer.tsx:310,750` (+ 43 other files) |
| `BUG-004` | Reliability | **P1** | Missing `error.tsx`, `global-error.tsx`, and `not-found.tsx` boundaries; unguarded `.layers.story.blocks` crash risk on `/glossary/[term]` | `src/app/`, `src/app/glossary/[term]/page.tsx:86-88` |
| `BUG-005` | Reliability | **P1** | Homepage crashes with unhandled 500 `TypeError` if `allCases` is empty (`featuredCase` undefined in `Hero`) | `src/app/page.tsx:39`, `src/components/Hero.tsx:27` |
| `SEC-010` | Security / API | **P2** | Missing Zod validation / Mass Assignment in Admin Case APIs & `err.message` leaked in 500 responses | `src/app/api/admin/cases/route.ts`, `src/app/api/admin/cases/[slug]/route.ts` |
| `SEC-011` | Security / UX | **P2** | Public `CasePageClient` calls `/api/admin/cases/[slug]` (401 error) and shows `"Open in Review Studio"` link on 404 | `src/components/case/CasePageClient.tsx:283,346` |
| `SEC-012` | Security / AI | **P2** | Prompt injection / unbounded AI token cost risk & Gemini API key passed in URL query string | `src/app/api/admin/generate-image/route.ts:136`, `src/lib/ai/ocrScanner.ts` |
| `BUG-006` | Functional / UX | **P2** | Keyboard navigation hijacks `ArrowUp/Down`/`Space` in Scroll mode & fires behind open modals; swipe listener active in Scroll mode | `src/components/case/CaseViewer.tsx:202-271` |
| `BUG-007` | Functional / Perf | **P2** | Duplicate client fetches on case load + `VoteGate` refetches `/api/vote/[slug]` on every parent re-render | `src/components/case/CasePageClient.tsx:271`, `src/components/case/VoteGate.tsx:51-89`, `CaseViewer.tsx:562` |
| `BUG-008` | Functional | **P2** | `DailyCaseSubscribe` and `VoteGate` silently report success even when API fails or returns HTTP 4xx/5xx | `src/components/case/DailyCaseSubscribe.tsx:50-74`, `src/components/case/VoteGate.tsx:125-129` |
| `BUG-009` | Functional | **P2** | Missing `2000s` decade option in `/browse` filter; Saved tab count includes deleted/unpublished slugs; unvalidated `localStorage` JSON crash risk | `src/app/browse/page.tsx:213,279-287`, `src/context/AppContext.tsx:55-62` |
| `PERF-001` | Performance | **P2** | `unoptimized={isRemote}` bypasses Next.js image optimization (WebP/AVIF/resizing) for all Supabase images | `src/components/Hero.tsx:60`, `CaseCard.tsx:74`, `CaseImage.tsx:65,77` |
| `PERF-002` | Performance | **P2** | `force-dynamic` + `revalidate = 0` on `/`, `/case/[slug]`, `/glossary/[term]`, `/corrections`, `/sitemap.xml` disables CDN caching | `src/app/{page,case/[slug]/page,glossary/[term]/page,corrections/page,sitemap}.ts(x)` |
| `A11Y-001` | Accessibility | **P2** | Modals (`SuggestCaseModal`, `ReportErrorButton`, `GlossarySheet`, `ShareSheet`, `ParaSheet`) lack `Escape` close, focus trap, and/or portals; forms lack `<label htmlFor>` | Multiple modal & form components |
| `A11Y-002` | Accessibility | **P2** | `Toast` missing `role="status"` / `aria-live`; `Header` hamburger lacks `aria-expanded`; `CaseCard` bookmark touch target too small (~24px) | `src/components/{Toast,Header,CaseCard}.tsx` |
| `UI-002` | UI / CSS | **P2** | Undefined Tailwind `xs:` breakpoint hides `"SAVE"` text forever in `CaseViewer`; invalid border syntax `border-[#rgba(...)]` in `LanguageToggle` | `src/components/case/CaseViewer.tsx:375`, `src/components/LanguageToggle.tsx:10` |
| `CONTENT-001` | Editorial / UX | **P2** | Share card hardcodes `"I ruled for the petitioner"` regardless of actual option; `Hero` hardcodes `'IPC 79'` fallback; `"1-click unsubscribe"` / `"8:00 AM daily"` claims unbacked by automation | `src/app/api/share/[slug]/route.tsx:27-29`, `Hero.tsx:101`, `DailyCaseSubscribe.tsx:124,211` |
| `SEO-004` | SEO | **P2** | `/contribute` missing from `sitemap.ts`; `www.pleadings.in` vs `pleadings.in` canonical alignment needs live verification | `src/app/sitemap.ts` |
| `CODE-001` | Code Quality | **P3** | 45 ESLint warnings (including 4 `react-hooks/exhaustive-deps` and 38 unused imports/vars) | Repo-wide (`npm run lint`) |
| `CODE-002` | Code Quality | **P3** | 161 explicit `any` type occurrences weakening TypeScript safety | Repo-wide (`src/`) |
| `CODE-003` | Architecture | **P3** | Oversized monolithic components (`admin/cases/[slug]/page.tsx`: 3,055 lines; `admin/new/page.tsx`: 1,056 lines; `CaseViewer.tsx`: 998 lines) | `src/app/admin/`, `src/components/case/CaseViewer.tsx` |
| `CODE-004` | Code Quality | **P3** | 11+ dead/unused legacy components (`ReelView`, `DepthToggle`, `NewsletterCapture`, `layers/*`, etc.) left over from streamlining | `src/components/` |
| `UI-003` | UI / UX | **P3** | `/glossary` renders blank grid with no empty-state message when search yields 0 results | `src/app/glossary/page.tsx:73-115` |
| `I18N-001` | i18n (EN/HI) | **P3** | Partial Hindi coverage: `/browse`, `/bns`, `/about`, `/corrections`, form labels, slide nav chrome, and error messages remain English-only when `हिं` is selected | Multiple pages & components |
| `QA-001` | Testing / Ops | **P3** | Duplicate favicon/icon files (`src/app/icon.{svg,tsx}`, `public/{icon,favicon}.svg`, starter Next.js SVGs) and zero automated unit/E2E tests | `public/`, `src/app/`, `package.json` |

---

## 3. Detailed Findings by Category

### A. Confirmed Critical & High Functional / Data Bugs

#### `BUG-001` — Editorial Status vs. Legal Precedent Status Collision Hides Landmark Cases
- **Severity:** **P0 — Critical**
- **Affected Files:** `src/lib/cases.ts:46,105-129`, `src/lib/db/caseStore.ts:328-330`
- **Root Cause:** The single `status` property is overloaded for both **CMS publication workflow** (`DRAFT | ADMIN_REVIEW | PUBLISHED | ARCHIVED`) and **legal status** (`GOOD_LAW | PARTLY_SUPERSEDED | OVERRULED | STATUTE_REPLACED`).
  - In `caseStore.ts:330`, if `source.status?.code` is anything other than `'GOOD_LAW'`, `normalizeCaseData` coerces `status` to `'ADMIN_REVIEW'`.
  - In `cases.ts:112,125`, `getPublishedCases()` / `getPublishedCasesAsync()` filters out every case whose `status.code !== 'GOOD_LAW'`.
  - In `cases.ts:46`, any non-`PUBLISHED` draft is mapped to legal status `'OVERRULED'`.
- **Impact:** Any landmark Indian judgment that is legally `PARTLY_SUPERSEDED`, `STATUTE_REPLACED` (e.g., IPC sections replaced by BNS!), or `OVERRULED` (e.g., *ADM Jabalpur*, *Suresh Kumar Koushal*) silently disappears from the homepage, `/browse`, `/sitemap.xml`, and `/glossary`.
- **Recommended Fix:** Separate `publishStatus: 'DRAFT' | 'ADMIN_REVIEW' | 'PUBLISHED' | 'ARCHIVED'` from `legalStatus: { code: 'GOOD_LAW' | 'PARTLY_SUPERSEDED' | 'OVERRULED' | 'STATUTE_REPLACED', explain, chain }` across the schema, DB mapping, and filter helpers.

#### `BUG-002` — 20 Broken 404 Internal Links in Legal Glossary (`content/glossary.json`)
- **Severity:** **P1 — High**
- **Affected Files:** `content/glossary.json`, `src/app/glossary/[term]/page.tsx:144-160`, `src/components/GlossarySheet.tsx:112-123`
- **Evidence:** Automated integrity check against the 16 terms in `content/glossary.json` confirmed 20 `related` slugs have no corresponding glossary entry (`good-faith`, `due-diligence`, `strict-liability`, `polluter-pays`, `public-interest-litigation`, `judicial-review`, `ultra-vires`, `separation-of-powers`, `stare-decisis`, `natural-justice`, `fundamental-rights`, `vagueness-doctrine`, `freedom-of-speech`, `consumer-rights`, `punitive-damages`, `posh-act`, `equality-before-law`).
- **Impact:** Clicking any of those "Related Doctrines" chips in `/glossary/[term]` or inside the in-story `GlossarySheet` sends readers and Googlebot straight to a 404 page.
- **Recommended Fix:** Either add verified bilingual definitions for those missing terms (after editorial approval) or filter `related` links to only render `<Link>` when the target slug exists in `glossary.json`.

#### `BUG-003` — Editorial Error Reports (`/api/report-error`) Are Silently Dropped
- **Severity:** **P1 — High**
- **Affected File:** `src/app/api/report-error/route.ts:15-20`
- **Evidence:** The handler only executes `console.log(...)` and returns `{ success: true }`. It never saves to Supabase and never sends an email alert.
- **Impact:** On Vercel serverless, ephemeral stdout logs expire quickly; readers who click `"Report an error in this record"` believe their legal correction was logged for the reviewing advocate, when in reality it is lost.
- **Recommended Fix:** Persist validated reports to a private Supabase table (or private bucket) and dispatch an admin notification email (with rate limiting & input length caps).

#### `DB-001` — View Counter Fails on Cold Starts & Suffers Race Conditions
- **Severity:** **P1 — High**
- **Affected Files:** `src/app/api/cases/[slug]/view/route.ts:17,34`, `src/lib/db/caseStore.ts:392-408`, `src/lib/supabase.ts`
- **Evidence:** `CaseStore.recordView(slug)` calls synchronous `this.getAll()` which returns `[]` on every cold serverless container, so it returns `1` without writing to Supabase. Even when warm, it performs a non-atomic read-modify-write overwriting the entire case row.
- **Recommended Fix:** Use an atomic PostgreSQL RPC (`UPDATE cases SET views = views + 1 WHERE slug = $1 RETURNING views`) with bot/duplicate throttling (e.g., short TTL cookie or session dedupe).

#### `BUG-004` — Missing Error Boundaries (`error.tsx`, `not-found.tsx`) & Unsafe Property Access
- **Severity:** **P1 — High**
- **Affected Files:** `src/app/` (missing `error.tsx`, `global-error.tsx`, `not-found.tsx`), `src/app/glossary/[term]/page.tsx:86-88`
- **Evidence:** `src/app/` has no custom error boundary or branded 404 page. Additionally, `glossary/[term]/page.tsx:87` accesses `ep.layers.story.blocks.some(...)` without optional chaining, risking a 500 crash if any case episode lacks nested `layers.story.blocks`.
- **Recommended Fix:** Add branded `src/app/error.tsx`, `src/app/global-error.tsx`, and `src/app/not-found.tsx`, and guard nested arrays with optional chaining.

#### `BUG-005` — Homepage 500 Crash When Case Catalog Is Empty
- **Severity:** **P1 — High**
- **Affected Files:** `src/app/page.tsx:39`, `src/components/Hero.tsx:27`
- **Evidence:** If Supabase temporarily returns `[]`, `featuredCase` is `undefined`, and `Hero.tsx:27` throws `TypeError: Cannot read properties of undefined (reading 'hi')`.
- **Recommended Fix:** Render a graceful fallback empty/retry state in `HomePage` / `Hero` when `allCases.length === 0`.

#### `BUG-006` — Keyboard Hijacking & Scroll-Mode Swipe Collision in `CaseViewer`
- **Severity:** **P2 — Medium**
- **Affected File:** `src/components/case/CaseViewer.tsx:202-271`
- **Evidence:**
  1. In desktop `scroll` mode, pressing `ArrowDown`, `ArrowUp`, `PageDown`, `PageUp`, or `Space` calls `e.preventDefault()` and jumps whole episodes instead of native smooth browser scrolling.
  2. Keyboard handler does not check whether a modal/sheet (`activeSource`, `activeTermSlug`, `SuggestCaseModal`, `DisclaimerModal`, `ShareSheet`) is open, so pressing keys while interacting with modals navigates slides underneath.
  3. `onTouchStart`/`onTouchEnd` runs even when `readingView === 'scroll'`, so horizontal swipe gestures in Scroll mode silently call `goToSlide` and can unexpectedly redirect to `prevSlug`/`nextSlug`.
- **Recommended Fix:** Restrict swipe and arrow/space slide-jumping strictly to `readingView === 'slide'` and disable global shortcuts whenever any modal/dialog is open.

#### `BUG-007` — Duplicate Network Requests on Case Load & Repeated Vote Polling
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/components/case/CasePageClient.tsx:268-312`, `src/components/case/VoteGate.tsx:51-89`, `src/components/case/CaseViewer.tsx:562`
- **Evidence:**
  1. Even when SSR delivers `initialCase`, `CasePageClient` immediately refetches `GET /api/cases/${slug}` on mount.
  2. `CaseViewer.tsx:562` passes an inline callback `onUnlocked={() => setIsVerdictUnlocked(true)}` into `VoteGate`, which is in `VoteGate`'s `useCallback`/`useEffect` dependency array—re-triggering `GET /api/vote/[slug]` on every parent state update!
- **Recommended Fix:** Skip client refetch when `initialCase` is already hydrated; memoize `onUnlocked` with `useCallback` (or pass `setIsVerdictUnlocked` directly).

#### `BUG-008` — Silent-Success Error Handling on Subscription & Voting Forms
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/components/case/DailyCaseSubscribe.tsx:50-74`, `src/components/case/VoteGate.tsx:125-129`
- **Evidence:** `DailyCaseSubscribe` ignores `res.ok` and catches fetch errors silently, always setting `setIsSuccess(true)`. `VoteGate` similarly sets `setHasVoted(true)` inside its `catch` block without notifying the user that their vote failed to record.
- **Recommended Fix:** Check `res.ok` and `data.success`, and surface clear inline error feedback with retry option on network/server failure.

#### `BUG-009` — Browse Filter Gaps, Stale Saved Count & Unvalidated `localStorage` Parsing
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/app/browse/page.tsx:213,279-287`, `src/context/AppContext.tsx:55-62`
- **Evidence:**
  1. Decade `<select>` jumps from `1990s` straight to `2010s`, omitting `2000s` (2000–2009).
  2. `Saved ({bookmarkedSlugs.length})` displays the raw `localStorage` length rather than the count of matching published cases, causing count mismatches if a slug was removed/renamed.
  3. `AppContext.tsx:57` executes `setBookmarkedSlugs(JSON.parse(savedBookmarks))` without verifying `Array.isArray(...)` or deduplicating strings; corrupted storage causes runtime exceptions on `.includes()`.
- **Recommended Fix:** Add `2000s` option, compute `savedCount` against live `allCases`, and validate/deduplicate `localStorage` arrays in `AppContext`.

---

### B. Security Findings (Summary — Full Details in `PLEADINGS_SECURITY_REPORT.md`)

- **`SEC-001` (P0):** Hardcoded `ADMIN_SECRET_TOKEN` and 4 weak default admin passwords in public `src/lib/auth.ts:5-16` (always accepted even if env vars are set).
- **`SEC-002` (P0):** User PII (`submissions/*.json`, `subscribers/*.json`, `suggestions/*.json`) written to public Supabase Storage bucket `case-images` (`src/lib/supabase.ts:154-205`).
- **`SEC-008` (P0):** Public exposure of `DRAFT`/`ADMIN_REVIEW` cases via `/case/[slug]`, `/api/cases/[slug]`, and `/api/share/[slug]`.
- **`SEC-003` (P1):** No login rate limiting, token leaked in JSON response, no session rotation/revocation, client-only `/admin` gate, and login `returnUrl` Open Redirect.
- **`SEC-004` (P1):** Unrestricted upload size, no magic-byte file signature verification, and unsanitized filename extensions in `/api/admin/upload` and `/api/admin/ocr`.
- **`SEC-005` (P1):** Zero HTTP security headers configured in `next.config.ts`.
- **`SEC-006` (P1):** `tls: { rejectUnauthorized: false }` in `src/lib/email.ts:92` and hardcoded personal admin emails in public source.
- **`SEC-007` (P1):** Unauthenticated public write endpoints without rate limiting, CAPTCHA/Turnstile/honeypot, or server-side length caps (email-bombing & storage flooding risk).
- **`SEC-009` (P1):** Unescaped JSON-LD `dangerouslySetInnerHTML` (`<` breakout) and unvalidated `href` schemes in `SourcesAndCorrections` & `ParaSheet`.
- **`SEC-010` (P2):** Missing Zod validation / Mass Assignment in Admin Case APIs & `err.message` leaked in 500s.
- **`SEC-011` (P2):** Public 404 UI calls `/api/admin/cases/[slug]` (401 console error) and exposes `"Open in Review Studio"` admin link.
- **`SEC-012` (P2):** Unbounded AI prompt/OCR payloads, missing fetch timeouts on paid LLM providers, and Gemini API key passed in URL query string.

---

### C. SEO Audit Findings

#### `SEO-001` — Soft-404 Bug Indexing Invalid Case URLs as HTTP 200 OK
- **Severity:** **P1 — High**
- **Affected File:** `src/app/case/[slug]/page.tsx:247-254,309-459`
- **Evidence:** When `getCaseForPage(slug)` returns `null`, `generateMetadata` returns a synthesized title from the URL slug with **`robots: { index: true, follow: true }`**, and `CasePage` renders HTTP **200 OK** instead of calling `notFound()`.
- **Impact:** Severe Google crawl-budget waste and Soft-404 quality penalties; arbitrary URLs like `/case/spam-keywords-here` return indexable HTTP 200 pages with reflected text.
- **Recommended Fix:** Call `notFound()` from `next/navigation` when `!currentCase` (returning true HTTP 404) and set `robots: { index: false, follow: false }` in `generateMetadata`.

#### `SEO-002` — Malformed Double-Origin URL in Case Article JSON-LD `image`
- **Severity:** **P1 — High**
- **Affected File:** `src/app/case/[slug]/page.tsx:350`
- **Evidence:**
  ```ts
  image: currentCase.poster?.src ? `https://pleadings.in${currentCase.poster.src}` : 'https://pleadings.in/opengraph-image'
  ```
  When `poster.src` is a Supabase Storage URL (`https://...supabase.co/...`), this outputs `https://pleadings.inhttps://...supabase.co/...`.
- **Recommended Fix:** Check `poster.src.startsWith('http') ? poster.src : \`https://pleadings.in${poster.src}\``.

#### `SEO-003` — Duplicate Canonical Tag on Core Landing Pages (`/browse`, `/bns`, `/glossary`, `/contribute`)
- **Severity:** **P1 — High**
- **Affected Files:** `src/app/layout.tsx`, `src/app/browse/page.tsx`, `src/app/bns/page.tsx`, `src/app/glossary/page.tsx`, `src/app/contribute/page.tsx`
- **Evidence:** Because these four pages are `'use client'` files with no route-level `layout.tsx` exporting `metadata`, Next.js inherits the root `layout.tsx` metadata—including **`alternates.canonical: 'https://pleadings.in'`** and the homepage `<title>`!
- **Impact:** Google interprets `/browse`, `/bns`, `/glossary`, and `/contribute` as duplicates of the homepage and suppresses them from search rankings (directly contributing to poor Google visibility!).
- **Recommended Fix:** Add a lightweight Server Component `layout.tsx` (or split page wrapper) for each route exporting unique `title`, `description`, `openGraph`, and self-referencing `alternates.canonical` (`https://pleadings.in/browse`, `/bns`, `/glossary`, `/contribute`).

#### `SEO-004` — Sitemap Completeness & Domain Canonicalization (`www` vs apex)
- **Severity:** **P2 — Medium**
- **Affected File:** `src/app/sitemap.ts`
- **Evidence:** `/contribute` is omitted from `staticRoutes` in `src/app/sitemap.ts`. Additionally, the user accesses `https://www.pleadings.in/` while all canonicals, `robots.ts`, and `sitemap.ts` use apex `https://pleadings.in`.
- **Recommended Fix:** Add `/contribute` to `sitemap.ts`, and verify in Vercel Domain settings that `www.pleadings.in` issues a single clean **301 permanent redirect** to `https://pleadings.in` (and vice versa if `www` is preferred—pick ONE canonical host consistently).

---

### D. Performance & Core Web Vitals Findings

#### `PERF-001` — Image Optimization Bypassed for All Supabase Remote Posters
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/components/Hero.tsx:60`, `src/components/CaseCard.tsx:74`, `src/components/case/CaseImage.tsx:65,77`
- **Evidence:** `unoptimized={... || src.startsWith('http')}` disables Next.js `<Image>` WebP/AVIF conversion and responsive `srcset` resizing for all Supabase-hosted images—even though `next.config.ts` already allows remote image patterns!
- **Impact:** Mobile users on 4G download full-resolution desktop images for small cards and thumbnails, degrading LCP and bandwidth.
- **Recommended Fix:** Keep `unoptimized` only for `data:` / `blob:` URIs and allow Next.js Image Optimization for allowlisted Supabase Storage hostnames (restricting `next.config.ts` `remotePatterns` to the exact Supabase project hostname rather than wildcard `**`).

#### `PERF-002` — `force-dynamic` + `revalidate = 0` Disables Edge/ISR Caching Site-Wide
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/app/page.tsx:13-14`, `src/app/case/[slug]/page.tsx:14-15`, `src/app/glossary/[term]/page.tsx:11-12`, `src/app/corrections/page.tsx:6-7`, `src/app/sitemap.ts:5-6`
- **Evidence:** Every public page hits Supabase on every single request (higher TTFB, increased DB load, no CDN HTML caching).
- **Recommended Fix:** Switch public pages to ISR (`export const revalidate = 60` or `300`) and call `revalidatePath('/')`, `revalidatePath('/case/' + slug)`, and `revalidatePath('/sitemap.xml')` inside Admin publish/update/delete handlers for instant updates with sub-100ms TTFB.

---

### E. UI/UX, Accessibility (WCAG 2.2 AA) & Internationalization (EN/HI) Findings

#### `UI-001` — Widespread `select-none` Breaks Legal Research & Accessibility
- **Severity:** **P1 — High**
- **Affected Files:** `src/components/case/CaseViewer.tsx:310,750`, `src/app/browse/page.tsx:177`, `src/app/bns/page.tsx:62`, `src/app/glossary/page.tsx:29`, `src/app/glossary/[term]/page.tsx:93`, `src/app/about/page.tsx:30`, `src/app/corrections/page.tsx:71` (44 files total)
- **Evidence:** Putting `select-none` on `<main>` and on `CaseViewer`'s root without restoring `select-text` on the desktop Scroll `<main>` prevents advocates, law students, and readers from copying citations, statutory mappings, or judgment text.
- **Recommended Fix:** Remove `select-none` from all `<main>` containers and content wrappers; apply `select-none` only to interactive UI controls (buttons/badges) where accidental selection hurts ergonomics.

#### `A11Y-001` — Modal Dialogs & Form Labels Violate WCAG 2.2 AA Keyboard & Screen-Reader Standards
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/components/SuggestCaseModal.tsx`, `src/components/ReportErrorButton.tsx`, `src/components/GlossarySheet.tsx`, `src/components/case/ShareSheet.tsx`, `src/components/case/ParaSheet.tsx`, `src/app/contribute/page.tsx`, `src/app/browse/page.tsx`, `src/app/admin/login/page.tsx`
- **Evidence:**
  - `ReportErrorButton`, `GlossarySheet`, `ShareSheet`, and `ParaSheet` do not portal to `document.body` (risking z-index/transform trapping), lack `Escape`-to-close, lack focus trapping/restoration, and lack body scroll locking.
  - `SuggestCaseModal` lacks `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `Escape`-to-close.
  - Form `<label>` elements across `/contribute`, `/browse`, `/admin/login`, `SuggestCaseModal`, and `ReportErrorButton` are not programmatically associated via `htmlFor`/`id`.
- **Recommended Fix:** Create a shared accessible `<Modal>` primitive (portal, `role="dialog"`, `aria-modal`, `Escape` handler, focus trap, scroll lock) and wire explicit `id`/`htmlFor` pairs on all form inputs.

#### `A11Y-002` — Live Regions, Menu ARIA State & Mobile Touch Target Sizes
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/components/Toast.tsx`, `src/components/Header.tsx:93-99`, `src/components/CaseCard.tsx:149-158`
- **Evidence:**
  - `Toast.tsx` has no `role="status"` or `aria-live="polite"`.
  - `Header.tsx` mobile hamburger button lacks `aria-expanded={mobileMenuOpen}` and `aria-controls`; drawer lacks `Escape` close & backdrop dismiss.
  - `CaseCard.tsx` bookmark button (`p-1.5 text-xs`) renders below the recommended 44×44px mobile touch target and lacks `aria-pressed={bookmarked}`.

#### `UI-002` — Invalid CSS Utility Classes (`xs:` & `border-[#rgba(...)]`)
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/components/case/CaseViewer.tsx:375`, `src/components/LanguageToggle.tsx:10`
- **Evidence:**
  - `CaseViewer.tsx:375` uses `hidden xs:inline`, but `globals.css` defines no `xs` breakpoint in Tailwind v4 -> `"SAVE"` / `"SAVED"` label is permanently hidden on all viewports.
  - `LanguageToggle.tsx:10` uses `border-[#rgba(243,239,230,0.10)]` (stray `#` invalidates the CSS color).

#### `UI-003` — Missing Empty Search State on `/glossary`
- **Severity:** **P3 — Low**
- **Affected File:** `src/app/glossary/page.tsx:73-115`
- **Evidence:** Searching a non-matching query renders an empty white/dark void with no message or reset button.

#### `I18N-001` — Incomplete English/Hindi (`EN` / `हिं`) Localization Coverage
- **Severity:** **P3 — Low**
- **Affected Files:** `src/app/browse/page.tsx`, `src/app/bns/page.tsx`, `src/app/about/page.tsx`, `src/app/corrections/page.tsx`, `src/components/case/CaseViewer.tsx`, `src/app/contribute/page.tsx`
- **Evidence:** Switching to `हिं` translates the Header, Hero labels, Glossary definitions, and partial headings, while `/browse`, `/bns`, `/about`, `/corrections`, form labels, slide dock buttons (`Begin Episode 1`, `Prologue`, `View Ratio & Dossier`), and validation messages remain English-only.

---

### F. Editorial & Legal Content Integrity Findings

#### `CONTENT-001` — Share Card Inaccuracy, Hardcoded `'IPC 79'` Fallback & Unbacked Daily Dispatch Claims
- **Severity:** **P2 — Medium**
- **Affected Files:** `src/app/api/share/[slug]/route.tsx:27-29`, `src/components/Hero.tsx:101`, `src/components/case/DailyCaseSubscribe.tsx:124,211`
- **Evidence:**
  1. `/api/share/[slug]` hardcodes `"I ruled for the petitioner. The Court did too."` whenever `agree=true`, even if the court ruled for the **respondent**!
  2. `Hero.tsx:101` falls back to `'IPC 79'` when `activeCase.doctrines?.[0]` is missing, mislabeling unrelated cases.
  3. `DailyCaseSubscribe.tsx` tells users `"Tomorrow's 3-minute judgment will arrive on your whatsapp at 8:00 AM"` and `"Instant 1-click unsubscribe"`, though no automated WhatsApp/email 8 AM dispatcher or unsubscribe endpoint exists in the codebase yet.
- **Note on Legal Facts:** Per audit rules, **no legal facts, citations, or IPC->BNS mappings in `content/statute-map.json` or `content/glossary.json` were modified**. Any substantive legal text update will require explicit editorial approval.

---

### G. Code Quality, Maintainability & Operational Findings

- **`CODE-001` (P3):** 45 ESLint warnings (including 4 `react-hooks/exhaustive-deps` risks in `CaseCard`, `Hero`, `CasePageClient`, `CaseViewer`).
- **`CODE-002` (P3):** 161 explicit `any` usages across 133 TS/TSX files.
- **`CODE-003` (P3):** Monolithic files (`src/app/admin/cases/[slug]/page.tsx` at 3,055 lines; `admin/new/page.tsx` at 1,056 lines; `CaseViewer.tsx` at 998 lines) hinder maintainability and inflate client JS bundles.
- **`CODE-004` (P3):** 11 unused legacy components (`BrowseRow`, `DepthToggle`, `DissentPanel`, `EpisodeQuestionCard`, `LawyerEpisodeStream`, `RatioObiterSplit`, `NewsletterCapture`, `ConstitutionalWideCard`, `EvidenceDossierCard`, `JudgeShowdownCard`, `ReelView`) plus unused starter SVGs (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) in `public/`.
- **`QA-001` (P3):** Duplicate icon assets (`src/app/icon.svg`, `src/app/icon.tsx`, `public/icon.svg`, `public/favicon.svg`) and zero automated tests (no Vitest/Jest/Playwright scripts in `package.json`).

---

## 4. Untested / Blocked Items (Transparent Reporting)

Per strict non-fabrication policy, the following items **could not be executed** in this environment and are explicitly noted rather than assumed:

1. **Live Chrome DevTools Responsive & Visual Testing (`320px`–`1920px`, 125%/150%/200% zoom, live console/network capture):** Blocked because Google Chrome did not have remote debugging enabled (`ENOENT: C:\Users\Utkar\AppData\Local\Google\Chrome\User Data\DevToolsActivePort`). Once Chrome is launched with remote debugging enabled (`chrome://inspect/#remote-debugging`), live multi-viewport & interactive verification can run immediately.
2. **Cross-Browser Testing (Firefox & WebKit):** Not executed locally (no Playwright browsers installed in workspace).
3. **Lighthouse Scores & Live HTTP Header/Redirect Probing (`www.pleadings.in` vs `pleadings.in`):** Blocked by local sandbox outbound network restriction (`ENOTFOUND`).
4. **`npm audit` Live Advisory Lookup:** Blocked by local sandbox outbound network restriction (`ENOTFOUND registry.npmjs.org`). Can be run immediately with network access.
5. **Supabase Dashboard PostgreSQL RLS Policies & Storage Bucket Settings:** Not directly inspectable from local repo (no `.env.local` or Supabase CLI session present). Required manual verification checklist is provided in `PLEADINGS_SECURITY_REPORT.md`.
6. **Production Form Write Testing:** Intentionally skipped on production to prevent polluting production data/emails.

---

## 5. Recommended Remediation Order (Pending Your Approval)

1. **Immediate Containment (P0 Security — Today):** Fix `SEC-001` (remove hardcoded credentials/token, enforce env-only secret + HMAC-signed `HttpOnly` sessions + rotate keys), `SEC-002` (move PII out of public `case-images` bucket into private Supabase tables with RLS), `SEC-008` (block draft case leaks), and `BUG-001` (separate `publishStatus` vs `legalStatus`).
2. **High-Impact Hardening & SEO (P1):** Add security headers (`SEC-005`), rate limiting & honeypot/Turnstile (`SEC-007`), upload validation (`SEC-004`), fix SMTP TLS (`SEC-006`), fix JSON-LD XSS & image URL (`SEC-009`, `SEO-002`), fix Soft-404 (`SEO-001`) & duplicate canonicals (`SEO-003`), fix 20 broken glossary links (`BUG-002`), persist `/api/report-error` (`BUG-003`), fix view counter (`DB-001`), remove `select-none` (`UI-001`), add `error.tsx`/`not-found.tsx` (`BUG-004`/`BUG-005`).
3. **UX, Performance & Accessibility (P2):** Fix `SEC-010`–`SEC-012`, keyboard/swipe isolation (`BUG-006`), duplicate fetches (`BUG-007`), silent form errors (`BUG-008`), Browse 2000s/saved count (`BUG-009`), enable Next.js image optimization & ISR (`PERF-001`, `PERF-002`), modal & form WCAG 2.2 AA (`A11Y-001`, `A11Y-002`), CSS fixes (`UI-002`), share card copy (`CONTENT-001`).
4. **Code Hygiene & Testing (P3):** Resolve ESLint warnings, remove dead components & starter SVGs, add glossary empty state, expand Hindi strings, add automated Vitest/Playwright smoke tests.
