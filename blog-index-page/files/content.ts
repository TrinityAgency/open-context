// The page's text, in English and German, and where the blog lives. Replace the text with your own; keep the shapes.
// The posts themselves are files in content/blog/ (see _parts/blog-content/README.md).

/** The page's language: picks the text and labels. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Blog – Samplework Inc.',
    description: 'Notes, guides and news from Samplework Inc.',
  },
  de: {
    title: 'Blog – Beispielwerk GmbH',
    description: 'Notizen, Anleitungen und Neuigkeiten der Beispielwerk GmbH.',
  },
};

export type BlogIndexContent = {
  title: string;
  intro: string;
  /** Shown instead of the list while there is no visible post. */
  empty: string;
};

export const CONTENT: Record<'en' | 'de', BlogIndexContent> = {
  en: {
    title: 'Blog',
    intro: 'Notes, guides and news from the Samplework team.',
    empty: 'No posts yet.',
  },
  de: {
    title: 'Blog',
    intro: 'Notizen, Anleitungen und Neuigkeiten aus dem Beispielwerk-Team.',
    empty: 'Noch keine Beiträge.',
  },
};

/**
 * `dir`: the posts folder, relative to the project root. `base`: the blog's URL; it must match this folder's place
 * under app/ (app/blog → /blog). `perPage`: posts per index page.
 */
export const BLOG = { dir: 'content/blog', base: '/blog', perPage: 9 };
