import { MetadataRoute } from 'next';
import { getAllCasesAsync } from '@/lib/cases';
import glossaryData from '@/content/glossary.json';

// Known landmark cases guaranteed to be indexed by Googlebot even if DB fetch is cold during static generation
const KNOWN_LANDMARK_SLUGS = [
  'nanavati-case',
  'kesavananda-bharati',
  'maneka-gandhi',
  'm-c-mehta',
  'right-to-privacy-case',
  'shah-bano',
  'the-shah-bano-case',
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

  // Base routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/browse`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bns`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/glossary`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/corrections`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
  ];

  // Dynamic Case routes: query DB asynchronously and merge with guaranteed known slugs
  let dbCases: Array<{ slug: string }> = [];
  try {
    dbCases = await getAllCasesAsync();
  } catch (e) {
    console.warn('Sitemap database fetch exception:', e);
  }

  const slugSet = new Set<string>();
  dbCases.forEach((c) => {
    if (c.slug) slugSet.add(c.slug.trim());
  });
  KNOWN_LANDMARK_SLUGS.forEach((slug) => slugSet.add(slug));

  const caseRoutes: MetadataRoute.Sitemap = Array.from(slugSet).map((slug) => ({
    url: `${baseUrl}/case/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  }));

  // Dynamic Glossary Term routes
  const glossaryRoutes: MetadataRoute.Sitemap = glossaryData.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticRoutes, ...caseRoutes, ...glossaryRoutes];
}
