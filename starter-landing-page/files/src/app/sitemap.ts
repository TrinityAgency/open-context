import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/site';

// Every public page; add each new page here (src/app/pages.test.tsx checks that every linked route is listed).
// Redirects and the not-found page are not listed.
const PAGES = ['/', '/imprint', '/privacy', '/terms'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PAGES.map((path) => ({ url: path === '/' ? base : `${base}${path}` }));
}
