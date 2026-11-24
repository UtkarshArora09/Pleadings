import type { Episode, Exhibit as ExhibitType } from '@/types/case';

export function normalizeImgKey(src?: string): string {
  if (!src) return '';
  const trimmed = src.trim();
  return trimmed.startsWith('data:') ? trimmed : trimmed.split('?')[0];
}

/**
 * Deduplicates images across a case dossier so the hero poster or any earlier
 * episode/exhibit image never renders twice.
 */
export function deduplicateCaseImages(
  posterSrc: string | undefined,
  episodes: Episode[]
): {
  showEpisodeImage: boolean[];
  cleanExhibits: Array<ExhibitType | undefined>;
} {
  const seen = new Set<string>();
  const posterKey = normalizeImgKey(posterSrc);
  if (posterKey) seen.add(posterKey);

  const showEpisodeImage: boolean[] = [];
  const cleanExhibits = episodes.map((ep) => {
    const rawEpImgSrc = ep.image?.src || (ep as any).photoExhibitSrc || (ep as any).imageSrc;
    const epKey = normalizeImgKey(rawEpImgSrc);
    const exhibitKey = normalizeImgKey(ep.exhibit?.image?.src);

    const hasValidExhibitCard = Boolean(
      ep.exhibit && ep.exhibit.headline && ep.exhibit.kind && exhibitKey
    );

    let cleanedExhibit = ep.exhibit;
    if (ep.exhibit && exhibitKey) {
      if (seen.has(exhibitKey)) {
        cleanedExhibit = { ...ep.exhibit, image: undefined };
      } else if (hasValidExhibitCard) {
        seen.add(exhibitKey);
      }
    }

    const isSuppressedByExhibitCard = hasValidExhibitCard && Boolean(exhibitKey) && epKey === exhibitKey;
    const shouldShow = Boolean(epKey) && !isSuppressedByExhibitCard && !seen.has(epKey);
    if (shouldShow) seen.add(epKey);
    showEpisodeImage.push(shouldShow);

    return cleanedExhibit;
  });

  return { showEpisodeImage, cleanExhibits };
}

export function resolveLocalizedField(
  raw: unknown,
  lang: 'en' | 'hi',
  fallback: string
): string {
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>;
    if (typeof obj[lang] === 'string' && obj[lang]) return obj[lang] as string;
    if (typeof obj.en === 'string' && obj.en) return obj.en as string;
  }
  return fallback;
}
