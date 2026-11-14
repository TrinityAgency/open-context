// The site facts this page needs, in English and German, and where the blog lives. Replace them with your own.
// The posts themselves are files in content/blog/ (see _parts/blog-content/README.md).
import type { SiteIdentity } from './_parts/site-seo/site-types';

/** The page's language: picks the labels and formats. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

/** The site: its name and absolute URL go into share links, the canonical URL and the Article data. */
export const SITE: Record<'en' | 'de', SiteIdentity> = {
  en: {
    name: 'Samplework Inc.',
    url: 'https://example.com',
    description: 'Samplework Inc. makes sample products and writes about how they are built.',
  },
  de: {
    name: 'Beispielwerk GmbH',
    url: 'https://example.com',
    description: 'Die Beispielwerk GmbH baut Beispielprodukte und schreibt darüber, wie sie entstehen.',
  },
};

/** The Open Graph locale of each language. */
export const OG_LOCALE: Record<'en' | 'de', string> = { en: 'en_US', de: 'de_DE' };

/**
 * `dir`: the posts folder, relative to the project root. `base`: the blog's URL; this folder must sit at
 * app/<base>/[slug] (app/blog/[slug] → /blog/<slug>).
 */
export const BLOG = { dir: 'content/blog', base: '/blog' };
