import {
  isSupabaseConfigured,
  loadJsonFromSupabaseStorage,
  saveJsonToSupabaseStorage,
} from '@/lib/supabase';

export interface VoteRecord {
  slug: string;
  optionId: string;
  anonId: string;
  createdAt: string;
}

// In-memory cache synced with Supabase Storage (survives serverless cold starts)
export const globalVotes: VoteRecord[] = [
  { slug: 'ghost-case', optionId: 'opt-a', anonId: 'seed-1', createdAt: '2026-01-01' },
  { slug: 'ghost-case', optionId: 'opt-a', anonId: 'seed-2', createdAt: '2026-01-02' },
  { slug: 'ghost-case', optionId: 'opt-b', anonId: 'seed-3', createdAt: '2026-01-03' },
];

const slugToVoteFile = (slug: string) => {
  const safe = slug.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 100);
  return `votes/${safe}.json`;
};

export async function getVotesForSlugAsync(slug: string): Promise<VoteRecord[]> {
  if (isSupabaseConfigured()) {
    const stored = await loadJsonFromSupabaseStorage<VoteRecord[]>(slugToVoteFile(slug));
    if (Array.isArray(stored)) {
      // Refresh in-memory cache for this slug
      for (let i = globalVotes.length - 1; i >= 0; i--) {
        if (globalVotes[i].slug === slug) globalVotes.splice(i, 1);
      }
      globalVotes.push(...stored);
      return stored;
    }
  }
  return globalVotes.filter((v) => v.slug === slug);
}

export async function recordVoteForSlugAsync(
  slug: string,
  optionId: string,
  anonId: string
): Promise<VoteRecord[]> {
  const caseVotes = [...(await getVotesForSlugAsync(slug))];
  const existingIdx = caseVotes.findIndex((v) => v.anonId === anonId);

  if (existingIdx >= 0) {
    caseVotes[existingIdx] = {
      ...caseVotes[existingIdx],
      optionId,
      createdAt: new Date().toISOString(),
    };
  } else {
    caseVotes.push({
      slug,
      optionId,
      anonId,
      createdAt: new Date().toISOString(),
    });
  }

  // Update in-memory cache
  for (let i = globalVotes.length - 1; i >= 0; i--) {
    if (globalVotes[i].slug === slug) globalVotes.splice(i, 1);
  }
  globalVotes.push(...caseVotes);

  // Persist to Supabase Storage
  if (isSupabaseConfigured()) {
    await saveJsonToSupabaseStorage(slugToVoteFile(slug), caseVotes);
  }

  return caseVotes;
}
