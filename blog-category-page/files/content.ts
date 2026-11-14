// The page's fallback text, in English and German, and where the blog lives. Replace it with your own.
// The categories themselves are in content/blog/categories.yaml (see _parts/blog-content/README.md).

/** The page's language: picks the labels and formats. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

/** `description` is used for a category without one. */
export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Blog – Samplework Inc.',
    description: 'Posts from the Samplework blog on one topic.',
  },
  de: {
    title: 'Blog – Beispielwerk GmbH',
    description: 'Beiträge aus dem Beispielwerk-Blog zu einem Thema.',
  },
};

/**
 * `dir`: the posts folder, relative to the project root. `base`: the blog's URL; this folder must sit at
 * app/<base>/category/[category] (app/blog/category/[category] → /blog/category/<id>). `perPage`: posts per page.
 */
export const BLOG = { dir: 'content/blog', base: '/blog', perPage: 9 };
