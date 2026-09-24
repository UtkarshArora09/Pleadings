import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

// Ensure IPv4 lookup first to prevent connect timeouts on Windows
dns.setDefaultResultOrder('ipv4first');

const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const idx = trimmed.indexOf('=');
    if (idx > 0) {
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim();
      env[key] = val;
    }
  }
});

const url = env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!url || !serviceKey) {
  console.error('Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
});

// Load dynamicCases.json if available
let dynamicCases = [];
try {
  const dynamicPath = path.join(process.cwd(), 'src', 'data', 'dynamicCases.json');
  if (fs.existsSync(dynamicPath)) {
    dynamicCases = JSON.parse(fs.readFileSync(dynamicPath, 'utf-8'));
    console.log(`Loaded ${dynamicCases.length} cases from dynamicCases.json`);
  }
} catch (e) {
  console.warn('Could not load dynamicCases.json:', e.message);
}

// Load content/cases/*.json
const casesDir = path.join(process.cwd(), 'content', 'cases');
const caseFiles = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
console.log(`Found ${caseFiles.length} JSON files in content/cases/`);

const staticCasesMap = new Map();
for (const file of caseFiles) {
  try {
    const content = JSON.parse(fs.readFileSync(path.join(casesDir, file), 'utf-8'));
    if (content.slug) {
      staticCasesMap.set(content.slug.toLowerCase().trim(), content);
    }
  } catch (e) {
    console.warn(`Error reading ${file}:`, e.message);
  }
}

// Build map of all slugs
const allSlugs = new Set();
dynamicCases.forEach(c => { if (c.slug) allSlugs.add(c.slug.toLowerCase().trim()); });
staticCasesMap.forEach((_, slug) => allSlugs.add(slug));

console.log(`\nTotal unique cases to migrate: ${allSlugs.size}`);

function normalizeCase(slug) {
  const dyn = dynamicCases.find(c => (c.slug || '').toLowerCase().trim() === slug) || {};
  const stat = staticCasesMap.get(slug) || {};

  // Merge dynamic and static
  const merged = { ...stat, ...dyn };

  const titleEn = typeof merged.title === 'string' ? merged.title : (merged.title?.en || stat.title || dyn.slug || 'Untitled Case');
  const titleHi = typeof merged.title === 'string' ? merged.title : (merged.title?.hi || titleEn);

  const hookEn = typeof merged.hook === 'string' ? merged.hook : (merged.blurb?.en || merged.featuredHeroHook?.en || stat.hook || '');
  const hookHi = typeof merged.hi?.hook === 'string' ? merged.hi.hook : (merged.blurb?.hi || merged.featuredHeroHook?.hi || hookEn);

  const bannerImage = merged.bannerImage || merged.banner_image || merged.poster?.src || stat.poster?.src || '/images/cases/ghost-case.jpg';
  const court = merged.court || stat.court || 'Supreme Court of India';
  const year = merged.year || stat.year || 2020;
  const citation = merged.citations?.primary || merged.citation || stat.citations?.primary || `${year} INSC 1`;
  const categoryTag = merged.categoryTag || merged.category_tag || (stat.doctrines && stat.doctrines[0]) || merged.tag?.en || 'Constitutional';

  // Determine status: preserve existing status if specified, otherwise PUBLISHED
  let status = 'PUBLISHED';
  if (merged.status === 'DRAFT' || merged.status === 'ARCHIVED' || merged.status === 'ADMIN_REVIEW') {
    status = merged.status;
  } else if (typeof merged.status === 'string') {
    status = merged.status;
  }

  const views = typeof merged.views === 'number' ? merged.views : (typeof dyn.views === 'number' ? dyn.views : 0);

  // Complete combined data object
  const fullData = {
    ...stat,
    ...dyn,
    slug: merged.slug || slug,
    title: { en: titleEn, hi: titleHi },
    tag: { en: categoryTag, hi: categoryTag },
    categoryTag,
    court,
    year,
    views,
    citation,
    bannerImage,
    poster: merged.poster || stat.poster || { src: bannerImage, alt: `${titleEn} cover poster`, provenance: 'illustration' },
    status,
    createdAt: merged.createdAt || stat.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return {
    slug: fullData.slug,
    title: fullData.title,
    court: fullData.court,
    year: Number(fullData.year) || 2020,
    citation: fullData.citation,
    status: fullData.status,
    category_tag: fullData.categoryTag,
    banner_image: fullData.bannerImage,
    data: fullData,
    updated_at: new Date().toISOString(),
  };
}

async function migrateAll() {
  console.log('\n--- Starting Migration to Supabase ---');
  let successCount = 0;
  let failCount = 0;

  for (const slug of allSlugs) {
    const caseRow = normalizeCase(slug);
    console.log(`Migrating case: ${caseRow.slug} (${caseRow.title.en}) [Status: ${caseRow.status}]...`);

    const { data, error } = await supabase
      .from('cases')
      .upsert(caseRow, { onConflict: 'slug' })
      .select('slug, status, year, court');

    if (error) {
      console.error(`❌ Failed to upsert ${slug}:`, error.message);
      failCount++;
    } else {
      console.log(`✅ Upserted ${slug}`);
      successCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Migration complete! Successfully migrated: ${successCount}, Failed: ${failCount}`);
  console.log(`========================================`);

  // Verify rows in Supabase
  const { data: countData, error: countErr } = await supabase
    .from('cases')
    .select('slug, status, updated_at')
    .order('slug', { ascending: true });

  if (countErr) {
    console.error('Verification error:', countErr.message);
  } else {
    console.log(`\nTotal cases now in Supabase 'cases' table: ${countData.length}`);
    console.table(countData);
  }
}

migrateAll().catch(console.error);
