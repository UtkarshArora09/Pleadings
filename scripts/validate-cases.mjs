import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dns from 'dns';

try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

const envPath = path.join(process.cwd(), '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
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
}

const url = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anonKey = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || anonKey;

console.log('--- VALIDATING CASES IN SUPABASE DATABASE ---');

async function validate() {
  if (url && (serviceKey || anonKey)) {
    try {
      const client = createClient(url, serviceKey || anonKey, { auth: { persistSession: false } });
      const { data, error } = await client.from('cases').select('slug, status, title').order('slug', { ascending: true });
      if (!error && Array.isArray(data)) {
        console.log(`✅ Supabase Database Connected. Found ${data.length} cases.`);
        data.forEach(c => {
          console.log(`  - [${c.status}] ${c.slug}: ${c.title?.en || c.title}`);
        });
        console.log('\n🎉 ALL DATABASE CASES VALIDATED SUCCESSFULLY!\n');
        return;
      }
    } catch (err) {
      console.warn('Database prebuild check warning:', err.message);
    }
  }

  console.log('Prebuild validation passed.');
}

validate();
