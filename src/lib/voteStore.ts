export interface VoteRecord {
  slug: string;
  optionId: string;
  anonId: string;
  createdAt: string;
}

// Global in-memory vote storage (persists per server lifecycle / worker)
export const globalVotes: VoteRecord[] = [
  // Initial seed votes for demonstration
  { slug: 'ghost-case', optionId: 'opt-a', anonId: 'seed-1', createdAt: '2026-01-01' },
  { slug: 'ghost-case', optionId: 'opt-a', anonId: 'seed-2', createdAt: '2026-01-02' },
  { slug: 'ghost-case', optionId: 'opt-b', anonId: 'seed-3', createdAt: '2026-01-03' },
];
