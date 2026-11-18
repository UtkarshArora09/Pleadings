# Pleadings — Database Migration, RLS & PII Cleanup Guide

- **Migration File:** [supabase/migrations/20261118_security_and_pii_tables.sql](file:///c:/Users/Utkar/OneDrive/Desktop/grow/Pleadings/supabase/migrations/20261118_security_and_pii_tables.sql)
- **Issues Addressed:** `SEC-002` (Private PII tables), `SEC-008` (RLS draft protection), `BUG-001` (`publish_status` separation), `DB-001` (Atomic serverless view counter), `BUG-003` (`editorial_error_reports` table)
- **Safety:** 100% idempotent (`IF NOT EXISTS`, `CREATE OR REPLACE`) and backward-compatible with existing `cases` rows. **Not executed automatically on production** per production safety restrictions.

---

## 1. Pre-Migration Backup (Mandatory)

Before running any SQL in Supabase Production:
1. Open **Supabase Dashboard -> Database -> Backups** and trigger a manual backup (or run `pg_dump "$SUPABASE_DB_URL" --format=custom --file=pleadings_pre_migration_$(date +%F).dump`).
2. Verify the dump file is non-empty and stored securely offline.

---

## 2. Applying the Migration

1. Open **Supabase Dashboard -> SQL Editor -> New Query**.
2. Paste the contents of [supabase/migrations/20261118_security_and_pii_tables.sql](file:///c:/Users/Utkar/OneDrive/Desktop/grow/Pleadings/supabase/migrations/20261118_security_and_pii_tables.sql).
3. Click **Run** and verify the transaction commits cleanly with zero errors.

### What the Migration Creates / Hardens
1. **`public.cases` Enhancements:**
   - Adds `publish_status TEXT NOT NULL DEFAULT 'PUBLISHED'` and backfills safely from `status` (preserving `DRAFT` / `ADMIN_REVIEW`, while keeping published `OVERRULED` / `PARTLY_SUPERSEDED` / `STATUTE_REPLACED` cases visible).
   - Adds integer `views` column backfilled from `data->>'views'`.
   - Enables **Row-Level Security (RLS)** on `public.cases`: `anon`/`authenticated` can ONLY `SELECT` rows where `publish_status = 'PUBLISHED'`; all public writes are explicitly denied.
2. **Atomic View Counter RPC (`public.increment_case_views(p_slug TEXT)`):**
   - Atomically increments `views` and `data->'views'` in a single PostgreSQL `UPDATE ... RETURNING` (fixes serverless cold-start & race-condition bugs).
   - Granted exclusively to `service_role` (`REVOKE ALL FROM PUBLIC`).
3. **Five Private RLS-Protected Tables (Zero `anon` Access):**
   - `public.advocate_submissions` (Advocate contributor PII + case details)
   - `public.daily_subscribers` (WhatsApp/Email opt-ins)
   - `public.case_suggestions` (Reader story suggestions)
   - `public.editorial_error_reports` (Persisted reader correction reports)
   - `public.case_votes` (Anonymous judge poll votes, primary key `(case_slug, anon_id)`)
4. **Private Fallback Storage Bucket:** Creates non-public bucket `pleadings-private` (`public = false`).

---

## 3. Migrating & Cleaning Legacy PII from Public `case-images` Bucket (`SEC-002`)

Because earlier code wrote JSON files under `submissions/`, `subscribers/`, `suggestions/`, and `votes/` inside the **public** `case-images` bucket:
1. Open **Supabase Dashboard -> Storage -> `case-images`**.
2. Inspect and download any existing JSON files inside:
   - `case-images/submissions/`
   - `case-images/subscribers/`
   - `case-images/suggestions/`
   - `case-images/votes/`
3. Archive downloaded records securely (or import them into the new private PostgreSQL tables above).
4. Once archived/imported, **delete** the `submissions/`, `subscribers/`, `suggestions/`, and `votes/` folders from the public `case-images` bucket so only public editorial artwork remains under `case-images/cases/`.
5. In **Storage -> `case-images` -> Bucket Settings**, restrict allowed MIME types strictly to `image/jpeg, image/png, image/webp` and set max file size to `5 MB`.

---

## 4. Verification Queries (Run After Migration)

```sql
-- 1. Confirm RLS is enabled on all 6 tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'cases', 'advocate_submissions', 'daily_subscribers',
    'case_suggestions', 'editorial_error_reports', 'case_votes'
  );

-- 2. Confirm anon role cannot read drafts or PII tables
SET LOCAL ROLE anon;
SELECT COUNT(*) FROM public.cases WHERE publish_status <> 'PUBLISHED'; -- Must return 0
SELECT COUNT(*) FROM public.daily_subscribers; -- Must return 0 (RLS blocked)
RESET ROLE;
```

---

## 5. Rollback Procedure

If an unexpected issue arises, run the rollback block at the bottom of `supabase/migrations/20261118_security_and_pii_tables.sql` (or restore your pre-migration snapshot from Step 1). Existing `cases` rows and `data` JSONB payloads remain intact throughout.
