// The blog: where its posts live, its URL, and the text of its pages, in English and German. Server only (it reads
// files). Posts, authors and categories are files in content/blog/<locale>/: AGENTS.md, "Writing a post".
import type { Metadata } from 'next';
import type { LinkItem } from '@/components/site-footer/site-types';
import { createBlog } from '@/utils/blog-content/blog';
import { blogPaths } from '@/utils/blog-content/blog-paths';
import { pageMetadata, type PageMetadataInput } from '@/utils/site-seo';
import { LOCALE, type Locale } from './locale';
import { SITE, siteUrl } from './site';

/**
 * `dir`: the posts folder of the site's language, relative to the project root. `base`: the blog's URL; it must match
 * the route folder src/app/blog. `perPage`: posts per index and category page.
 */
export const BLOG = { dir: `content/blog/${LOCALE}`, base: '/blog', perPage: 9 };

/** The posts, authors and categories in BLOG.dir, read at build time. Every blog route reads this one. */
export const blog = createBlog({ dir: BLOG.dir });

/** The blog's URLs under BLOG.base: index(n), post(slug), author(id), category(id, n). */
export const paths = blogPaths(BLOG.base);

/** The feeds, announced in every page's head (src/app/feed.xml and src/app/atom.xml serve them). */
export const FEED_TYPES = {
  'application/rss+xml': [{ url: '/feed.xml', title: 'RSS' }],
  'application/atom+xml': [{ url: '/atom.xml', title: 'Atom' }],
};

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', de: 'de_DE' };

/**
 * A page's metadata: canonical URL, Open Graph and Twitter card for the site in LOCALE, plus the feed links. Next
 * replaces the layout's `alternates` with a page's own, so a page with a canonical URL names the feeds again here.
 */
export function blogMetadata(input: Omit<PageMetadataInput, 'site' | 'locale'>): Metadata {
  const meta = pageMetadata({ ...input, site: { ...SITE, url: siteUrl() }, locale: OG_LOCALE[LOCALE] });
  return { ...meta, alternates: { ...meta.alternates, types: FEED_TYPES } };
}

export type BlogText = {
  home: {
    meta: { title: string; description: string };
    title: string;
    lead: string;
    /** The heading over the newest posts. */
    latest: string;
    /** The link to the blog index under them. */
    all: string;
    /** Shown instead of the cards while there is no visible post. */
    empty: string;
  };
  index: {
    meta: { title: string; description: string };
    title: string;
    intro: string;
    empty: string;
    /** The category filter's navigation name and its first link. */
    filter: string;
    all: string;
    /** Added to the title of the pages after the first. */
    page: (n: number) => string;
  };
  post: {
    /** The table of contents' title. */
    contents: string;
    related: string;
    published: string;
    updated: string;
    /** The breadcrumb trail's first two links. */
    home: string;
    blog: string;
  };
  author: {
    /** The description of an author without a bio. */
    description: string;
    website: string;
    posts: (name: string) => string;
    empty: string;
    all: string;
  };
  category: {
    /** The description of a category without one. */
    description: string;
    all: string;
    empty: string;
    page: (n: number) => string;
  };
  /** The signup on the home page and beside every post. Its form labels are the part's own (labels.ts, labels.de.ts). */
  newsletter: { title: string; text: string; privacy: LinkItem };
};

export const BLOG_TEXT: Record<Locale, BlogText> = {
  en: {
    home: {
      meta: { title: 'Notes on building websites', description: 'Guides and news on writing, publishing and running a website.' },
      title: 'Notes on building websites',
      lead: 'Guides and news on writing, publishing and running a website: short, practical and written by the people who do the work.',
      latest: 'Latest posts',
      all: 'All posts',
      empty: 'No posts yet.',
    },
    index: {
      meta: { title: 'Blog', description: 'Every post: guides and news on writing, publishing and running a website.' },
      title: 'Blog',
      intro: 'Guides and news on writing, publishing and running a website.',
      empty: 'No posts yet.',
      filter: 'Categories',
      all: 'All posts',
      page: (n) => `Page ${n}`,
    },
    post: {
      contents: 'On this page',
      related: 'Related posts',
      published: 'Published',
      updated: 'Updated',
      home: 'Home',
      blog: 'Blog',
    },
    author: {
      description: 'The people who write this blog.',
      website: 'Website',
      posts: (name) => `Posts by ${name}`,
      empty: 'No posts yet.',
      all: 'All posts',
    },
    category: {
      description: 'Posts from this blog on one topic.',
      all: 'All posts',
      empty: 'No posts in this category yet.',
      page: (n) => `Page ${n}`,
    },
    newsletter: {
      title: 'Get new posts by email',
      text: 'One short email when a new post is out. Nothing else.',
      privacy: { href: '/privacy', label: 'Privacy notice' },
    },
  },
  de: {
    home: {
      meta: { title: 'Notizen zum Bau von Websites', description: 'Anleitungen und Neuigkeiten zum Schreiben, Veröffentlichen und Betreiben einer Website.' },
      title: 'Notizen zum Bau von Websites',
      lead: 'Anleitungen und Neuigkeiten zum Schreiben, Veröffentlichen und Betreiben einer Website: kurz, praktisch und von den Menschen geschrieben, die die Arbeit machen.',
      latest: 'Neueste Beiträge',
      all: 'Alle Beiträge',
      empty: 'Noch keine Beiträge.',
    },
    index: {
      meta: { title: 'Blog', description: 'Alle Beiträge: Anleitungen und Neuigkeiten zum Schreiben, Veröffentlichen und Betreiben einer Website.' },
      title: 'Blog',
      intro: 'Anleitungen und Neuigkeiten zum Schreiben, Veröffentlichen und Betreiben einer Website.',
      empty: 'Noch keine Beiträge.',
      filter: 'Kategorien',
      all: 'Alle Beiträge',
      page: (n) => `Seite ${n}`,
    },
    post: {
      contents: 'Auf dieser Seite',
      related: 'Ähnliche Beiträge',
      published: 'Veröffentlicht',
      updated: 'Aktualisiert',
      home: 'Startseite',
      blog: 'Blog',
    },
    author: {
      description: 'Die Menschen, die diesen Blog schreiben.',
      website: 'Website',
      posts: (name) => `Beiträge von ${name}`,
      empty: 'Noch keine Beiträge.',
      all: 'Alle Beiträge',
    },
    category: {
      description: 'Beiträge aus diesem Blog zu einem Thema.',
      all: 'Alle Beiträge',
      empty: 'In dieser Kategorie gibt es noch keine Beiträge.',
      page: (n) => `Seite ${n}`,
    },
    newsletter: {
      title: 'Neue Beiträge per E-Mail',
      text: 'Eine kurze E-Mail, wenn ein neuer Beitrag erscheint. Sonst nichts.',
      privacy: { href: '/privacy', label: 'Datenschutzhinweise' },
    },
  },
};
