import { MetadataRoute } from 'next';
import { getPublishedCasesAsync } from '@/lib/cases';
import glossaryData from '@/content/glossary.json';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fallback slugs used only if Supabase is unreachable during offline build
const FALLBACK_LANDMARK_SLUGS = [
  'can-a-secular-criminal-code-reach-past-personal-law-to-provide-maintenance',
  'nanavati-case',
  'kesavananda-bharati',
  'maneka-gandhi',
  'm-c-mehta',
  'right-to-privacy-case',
  'shreya-singhal',
  'vishaka-case',
  'ghost-case',
  'haircut-case',
  'navtej-johar',
  'rinku-rukshar-habeas-corpus-case',
  'anuradha-bhasin',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://pleadings.in';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bns`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/corrections`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Fetch all live published cases from Supabase so newly added cases appear automatically
  let dbCases: Array<{ slug: string; updatedAt?: string; publishedAt?: string }> = [];
  try {
    dbCases = await getPublishedCasesAsync();
  } catch (e) {
    console.warn('Sitemap database fetch exception:', e);
  }

  const caseRoutes: MetadataRoute.Sitemap =
    dbCases.length > 0
      ? dbCases
          .filter((c) => Boolean(c.slug))
          .map((c) => ({
            url: `${baseUrl}/case/${encodeURIComponent(c.slug.trim())}`,
            lastModified: c.updatedAt
              ? new Date(c.updatedAt)
              : c.publishedAt
              ? new Date(c.publishedAt)
              : now,
            changeFrequency: 'daily' as const,
            priority: 1.0,
          }))
      : FALLBACK_LANDMARK_SLUGS.map((slug) => ({
          url: `${baseUrl}/case/${slug}`,
          lastModified: now,
          changeFrequency: 'daily' as const,
          priority: 1.0,
        }));

  const glossaryRoutes: MetadataRoute.Sitemap = glossaryData.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseRoutes, ...glossaryRoutes];
}
