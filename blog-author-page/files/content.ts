// The page's fallback text, in English and German, and where the blog lives. Replace it with your own.
// The authors themselves are in content/blog/authors.yaml (see _parts/blog-content/README.md).

/** The page's language: picks the labels and formats. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

/** `description` is used for an author without a bio. */
export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Authors – Samplework Inc.',
    description: 'The people who write the Samplework blog.',
  },
  de: {
    title: 'Autorinnen und Autoren – Beispielwerk GmbH',
    description: 'Die Menschen, die den Beispielwerk-Blog schreiben.',
  },
};

/**
 * `dir`: the posts folder, relative to the project root. `base`: the blog's URL; this folder must sit at
 * app/<base>/author/[author] (app/blog/author/[author] → /blog/author/<id>).
 */
export const BLOG = { dir: 'content/blog', base: '/blog' };
