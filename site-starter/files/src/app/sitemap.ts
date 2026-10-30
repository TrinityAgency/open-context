import type { MetadataRoute } from 'next';
import { siteUrl } from '@/content/site';

// Every public page; add each new page here. Redirects and the not-found page are not listed.
const PAGES = ['/'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PAGES.map((path) => ({ url: path === '/' ? base : `${base}${path}` }));
}
