import {
  fetchVotesFromSupabase,
  isSupabaseConfigured,
  upsertVoteToSupabase,
} from '@/lib/supabase';

export interface VoteRecord {
  slug: string;
  optionId: string;
  anonId: string;
  createdAt: string;
}

// In-memory cache synced with private Supabase table `case_votes` (never public bucket)
export const globalVotes: VoteRecord[] = [
  { slug: 'ghost-case', optionId: 'opt-a', anonId: 'seed-1', createdAt: '2026-01-01' },
  { slug: 'ghost-case', optionId: 'opt-a', anonId: 'seed-2', createdAt: '2026-01-02' },
  { slug: 'ghost-case', optionId: 'opt-b', anonId: 'seed-3', createdAt: '2026-01-03' },
];

export async function getVotesForSlugAsync(slug: string): Promise<VoteRecord[]> {
  if (isSupabaseConfigured()) {
    const stored = await fetchVotesFromSupabase(slug);
    if (Array.isArray(stored)) {
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

  for (let i = globalVotes.length - 1; i >= 0; i--) {
    if (globalVotes[i].slug === slug) globalVotes.splice(i, 1);
  }
  globalVotes.push(...caseVotes);

  if (isSupabaseConfigured()) {
    await upsertVoteToSupabase(slug, optionId, anonId, caseVotes);
  }

  return caseVotes;
}
