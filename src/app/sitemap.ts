import { MetadataRoute } from 'next';
import { getAllCaseSlugs } from '@/lib/cases';
import glossaryData from '@/content/glossary.json';

export default function sitemap(): MetadataRoute.Sitemap {
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

  // Dynamic Case routes
  const caseSlugs = getAllCaseSlugs();
  const caseRoutes: MetadataRoute.Sitemap = caseSlugs.map((slug) => ({
    url: `${baseUrl}/case/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // Dynamic Glossary Term routes
  const glossaryRoutes: MetadataRoute.Sitemap = glossaryData.map((term) => ({
    url: `${baseUrl}/glossary/${term.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseRoutes, ...glossaryRoutes];
}
