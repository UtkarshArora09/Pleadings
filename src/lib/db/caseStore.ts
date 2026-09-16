import fs from 'fs';
import path from 'path';
import { CaseData, CaseStatus } from '@/types';
import { CASES_DATA } from '@/data/cases';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const DB_FILE_PATH = path.join(DATA_DIR, 'dynamicCases.json');

// In-memory cache for fast lookups
let cachedCases: CaseData[] | null = null;

function ensureInitialized(): CaseData[] {
  if (cachedCases) return cachedCases;

  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      cachedCases = JSON.parse(raw);
      return cachedCases || [];
    }
  } catch (error) {
    console.error('Error reading dynamicCases.json, falling back to seed data:', error);
  }

  // Bootstrap with the 10 landmark cases from CASES_DATA
  const seedCases: CaseData[] = CASES_DATA.map((c, idx) => ({
    ...c,
    status: 'PUBLISHED' as CaseStatus,
    createdAt: new Date(Date.now() - (10 - idx) * 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(seedCases, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing initial dynamicCases.json:', err);
  }

  cachedCases = seedCases;
  return cachedCases;
}

function persistCases(cases: CaseData[]): boolean {
  cachedCases = cases;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tempFile = `${DB_FILE_PATH}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(cases, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE_PATH);
    return true;
  } catch (error) {
    console.error('Failed to persist cases to disk:', error);
    return false;
  }
}

export const CaseStore = {
  getAll(): CaseData[] {
    return ensureInitialized();
  },

  getPublished(): CaseData[] {
    const all = ensureInitialized();
    return all.filter((c) => c.status === 'PUBLISHED' || !c.status);
  },

  getBySlug(slug: string): CaseData | null {
    const all = ensureInitialized();
    return all.find((c) => c.slug === slug) || null;
  },

  create(newCase: CaseData): CaseData {
    const all = ensureInitialized();
    const existingIdx = all.findIndex((c) => c.slug === newCase.slug);
    
    const timestamp = new Date().toISOString();
    const caseToSave: CaseData = {
      ...newCase,
      status: newCase.status || 'ADMIN_REVIEW',
      createdAt: newCase.createdAt || timestamp,
      updatedAt: timestamp,
    };

    let updatedList: CaseData[];
    if (existingIdx >= 0) {
      updatedList = [...all];
      updatedList[existingIdx] = caseToSave;
    } else {
      updatedList = [caseToSave, ...all];
    }

    persistCases(updatedList);
    return caseToSave;
  },

  update(slug: string, updates: Partial<CaseData>): CaseData | null {
    const all = ensureInitialized();
    const idx = all.findIndex((c) => c.slug === slug);
    if (idx === 0 || idx > 0) {
      const updatedCase: CaseData = {
        ...all[idx],
        ...updates,
        slug: updates.slug || all[idx].slug,
        updatedAt: new Date().toISOString(),
      };
      const updatedList = [...all];
      updatedList[idx] = updatedCase;
      persistCases(updatedList);
      return updatedCase;
    }
    return null;
  },

  delete(slug: string): boolean {
    const all = ensureInitialized();
    const filtered = all.filter((c) => c.slug !== slug);
    if (filtered.length !== all.length) {
      persistCases(filtered);
      return true;
    }
    return false;
  },

  setPublishStatus(slug: string, publish: boolean): CaseData | null {
    return this.update(slug, {
      status: publish ? 'PUBLISHED' : 'DRAFT',
    });
  },
};
