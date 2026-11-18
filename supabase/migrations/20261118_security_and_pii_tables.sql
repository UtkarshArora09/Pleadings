-- =============================================================================
-- Pleadings Security & Data Integrity Migration (Idempotent, Backward-Compatible)
-- Target: Supabase PostgreSQL
-- Issues Resolved: SEC-002 (Private PII Tables), SEC-008 (RLS Draft Protection),
--                  BUG-001 (Editorial vs Legal Status Separation), DB-001 (Atomic Views),
--                  BUG-003 (Error Report Persistence)
--
-- IMPORTANT: Take a full Supabase snapshot/backup before applying to production.
-- =============================================================================

BEGIN;

-- 1. Separate editorial publish_status and atomic views column on existing `cases` table
ALTER TABLE IF EXISTS public.cases
  ADD COLUMN IF NOT EXISTS publish_status TEXT NOT NULL DEFAULT 'PUBLISHED',
  ADD COLUMN IF NOT EXISTS views INTEGER NOT NULL DEFAULT 0;

-- Backfill publish_status safely from existing `status` column (preserving DRAFT / ADMIN_REVIEW)
UPDATE public.cases
SET publish_status = CASE
  WHEN status IN ('DRAFT', 'ADMIN_REVIEW', 'PUBLISHED', 'ARCHIVED') THEN status
  ELSE 'PUBLISHED'
END
WHERE publish_status IS NULL OR publish_status = 'PUBLISHED';

-- Backfill views from JSONB data->>'views' where available
UPDATE public.cases
SET views = GREATEST(
  COALESCE(views, 0),
  CASE
    WHEN (data->>'views') ~ '^[0-9]+$' THEN (data->>'views')::INTEGER
    ELSE 0
  END
);

-- Enable Row-Level Security on `cases` so `anon` key can NEVER read DRAFT/ADMIN_REVIEW cases
ALTER TABLE IF EXISTS public.cases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published cases only" ON public.cases;
CREATE POLICY "Public can read published cases only"
  ON public.cases
  FOR SELECT
  TO anon, authenticated
  USING (
    publish_status = 'PUBLISHED'
    AND (status IS NULL OR status NOT IN ('DRAFT', 'ADMIN_REVIEW', 'ARCHIVED'))
  );

-- Explicit deny for anon/authenticated writes (service_role bypasses RLS on server APIs)
DROP POLICY IF EXISTS "Deny public writes on cases" ON public.cases;
CREATE POLICY "Deny public writes on cases"
  ON public.cases
  FOR ALL
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

-- 2. Atomic serverless view increment RPC (DB-001)
CREATE OR REPLACE FUNCTION public.increment_case_views(p_slug TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_views INTEGER;
BEGIN
  UPDATE public.cases
  SET
    views = COALESCE(views, 0) + 1,
    data = jsonb_set(
      COALESCE(data, '{}'::jsonb),
      '{views}',
      to_jsonb(COALESCE(views, 0) + 1),
      true
    ),
    updated_at = NOW()
  WHERE slug = p_slug
    AND publish_status = 'PUBLISHED'
  RETURNING views INTO v_new_views;

  RETURN COALESCE(v_new_views, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.increment_case_views(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_case_views(TEXT) TO service_role;

-- 3. Private PII Table: Advocate Case Submissions (SEC-002)
CREATE TABLE IF NOT EXISTS public.advocate_submissions (
  id TEXT PRIMARY KEY,
  advocate_name TEXT NOT NULL,
  bar_council_no TEXT NOT NULL,
  bar_association TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  designation TEXT,
  case_title TEXT NOT NULL,
  court TEXT NOT NULL,
  year TEXT NOT NULL,
  citation TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING_VERIFICATION',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.advocate_submissions ENABLE ROW LEVEL SECURITY;
-- Zero anon/authenticated policies => accessible ONLY by server service_role

-- 4. Private PII Table: Daily 3-Min Case Subscribers (SEC-002)
CREATE TABLE IF NOT EXISTS public.daily_subscribers (
  id TEXT PRIMARY KEY,
  contact TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('whatsapp', 'email')),
  case_slug TEXT DEFAULT 'general',
  frequency TEXT DEFAULT 'daily-3min',
  unsubscribed_at TIMESTAMPTZ,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_daily_subscribers_channel ON public.daily_subscribers(channel);
ALTER TABLE public.daily_subscribers ENABLE ROW LEVEL SECURITY;

-- 5. Private Table: Reader Case Suggestions (SEC-002)
CREATE TABLE IF NOT EXISTS public.case_suggestions (
  id TEXT PRIMARY KEY,
  case_name TEXT NOT NULL,
  court_or_city TEXT,
  year TEXT,
  story_synopsis TEXT NOT NULL,
  contributor_name TEXT,
  contributor_contact TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.case_suggestions ENABLE ROW LEVEL SECURITY;

-- 6. Private Table: Editorial Error & Correction Reports (BUG-003)
CREATE TABLE IF NOT EXISTS public.editorial_error_reports (
  id TEXT PRIMARY KEY,
  case_slug TEXT NOT NULL,
  episode TEXT,
  description TEXT NOT NULL,
  reporter_email TEXT,
  status TEXT NOT NULL DEFAULT 'OPEN',
  reported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_error_reports_slug ON public.editorial_error_reports(case_slug);
ALTER TABLE public.editorial_error_reports ENABLE ROW LEVEL SECURITY;

-- 7. Private Table: Anonymous Judge Votes (SEC-002)
CREATE TABLE IF NOT EXISTS public.case_votes (
  case_slug TEXT NOT NULL,
  anon_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (case_slug, anon_id)
);
CREATE INDEX IF NOT EXISTS idx_case_votes_slug ON public.case_votes(case_slug);
ALTER TABLE public.case_votes ENABLE ROW LEVEL SECURITY;

-- 8. Private Storage Bucket for fallback archival (non-public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('pleadings-private', 'pleadings-private', false)
ON CONFLICT (id) DO NOTHING;

COMMIT;

-- =============================================================================
-- ROLLBACK PROCEDURE (Run manually ONLY if rollback is required)
-- =============================================================================
-- DROP FUNCTION IF EXISTS public.increment_case_views(TEXT);
-- DROP TABLE IF EXISTS public.case_votes;
-- DROP TABLE IF EXISTS public.editorial_error_reports;
-- DROP TABLE IF EXISTS public.case_suggestions;
-- DROP TABLE IF EXISTS public.daily_subscribers;
-- DROP TABLE IF EXISTS public.advocate_submissions;
-- ALTER TABLE IF EXISTS public.cases DROP COLUMN IF EXISTS publish_status;
-- ALTER TABLE IF EXISTS public.cases DROP COLUMN IF EXISTS views;
