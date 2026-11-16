export interface CaseComplexityInfo {
  readTimeMin: number;
  readTimeStr: string;
  complexity: 'Easy' | 'Moderate' | 'Deep-Dive';
  badge: string; // e.g. "3 Min Read • Easy" or "8 Min Deep-Dive • 3 Twists"
  twistsCount: number;
  tagColor: string;
  emoji: string;
}

/**
 * Determines case complexity and read-time badge for posters and cards
 * e.g. "3 Min Read • Easy", "5 Min Read • 2 Twists", "8 Min Deep-Dive • 3 Twists"
 */
export function getCaseComplexity(caseData: any, lang: 'en' | 'hi' = 'en'): CaseComplexityInfo {
  if (!caseData) {
    return {
      readTimeMin: 5,
      readTimeStr: '5 Min Read',
      complexity: 'Moderate',
      badge: '5 Min Read • 2 Twists',
      twistsCount: 2,
      tagColor: '#D4AF37',
      emoji: '⏱️',
    };
  }

  // 1. Calculate reading time in minutes
  let readTimeMin = 5;
  const rawReadTime = caseData.readingTime?.story ?? caseData.readTime;

  if (typeof rawReadTime === 'number') {
    readTimeMin = rawReadTime;
  } else if (typeof rawReadTime === 'string') {
    const match = rawReadTime.match(/\d+/);
    if (match) readTimeMin = parseInt(match[0], 10);
  } else if (rawReadTime?.en) {
    const match = String(rawReadTime.en).match(/\d+/);
    if (match) readTimeMin = parseInt(match[0], 10);
  }

  // 2. Count twists / complexity drivers
  const episodesCount = Array.isArray(caseData.episodes) ? caseData.episodes.length : 8;
  const hasDissent = caseData.episodes?.some(
    (ep: any) => ep.layers?.student?.dissent?.judge || ep.dissent?.judge
  );
  const isConstitutionalOrCrime =
    caseData.genre === 'constitutional' ||
    caseData.genre === 'crime' ||
    String(caseData.categoryTag).toLowerCase().includes('crime');

  let twistsCount = 2;
  if (readTimeMin <= 3 || episodesCount <= 4) {
    twistsCount = 1;
  } else if (readTimeMin >= 8 || hasDissent || (isConstitutionalOrCrime && episodesCount >= 8)) {
    twistsCount = 3;
  } else {
    twistsCount = 2;
  }

  // 3. Format badge
  let complexity: 'Easy' | 'Moderate' | 'Deep-Dive' = 'Moderate';
  let badge = `${readTimeMin} Min Read • ${twistsCount} Twists`;
  let emoji = '⏱️';

  if (readTimeMin <= 3) {
    complexity = 'Easy';
    emoji = '⚡';
    badge = lang === 'hi' ? `${readTimeMin} मिनट • सरल कथा` : `${readTimeMin} Min Read • Easy`;
  } else if (readTimeMin >= 7 || twistsCount >= 3) {
    complexity = 'Deep-Dive';
    emoji = '🔥';
    badge =
      lang === 'hi'
        ? `${readTimeMin} मिनट • गहन अध्ययन (${twistsCount} मोड़)`
        : `${readTimeMin} Min Deep-Dive • ${twistsCount} Twists`;
  } else {
    complexity = 'Moderate';
    emoji = '⚖️';
    badge =
      lang === 'hi'
        ? `${readTimeMin} मिनट • ${twistsCount} मोड़`
        : `${readTimeMin} Min Read • ${twistsCount} Twists`;
  }

  // Explicit override if present
  if (caseData.complexityBadge) {
    badge = caseData.complexityBadge;
  }

  const tagColor =
    complexity === 'Easy' ? '#10B981' : complexity === 'Deep-Dive' ? '#E50914' : '#D4AF37';

  return {
    readTimeMin,
    readTimeStr: `${readTimeMin} Min Read`,
    complexity,
    badge,
    twistsCount,
    tagColor,
    emoji,
  };
}
