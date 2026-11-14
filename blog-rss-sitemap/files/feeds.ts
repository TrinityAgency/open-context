import type { Author, Post, SiteIdentity } from './site-types';
import { xmlText } from './xml';

export type FeedInput = {
  site: SiteIdentity;
  /** The feed's own path, e.g. `/feed.xml`: the self link. */
  feedPath: string;
  /** The posts to list, already filtered to the visible ones. */
  posts: Post[];
  /** For the Atom author names, matched by post.authorIds. */
  authors: Author[];
  /** A post's path, e.g. (slug) => `/blog/${slug}`. */
  postHref: (slug: string) => string;
  /** The feed's language, e.g. `en` or `de`. */
  language: string;
  /** How many of the newest posts the feed lists. Default 20. */
  limit?: number;
};

/** An absolute URL from the site's URL and a path, with exactly one slash between; an absolute path stays as is. */
export function absoluteUrl(siteUrl: string, path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

// The blog's date rule, copied (this template stands alone): a date-only value is UTC midnight that day.
function instantOf(iso: string): number {
  const instant = Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(iso) ? `${iso}T00:00:00Z` : iso);
  if (Number.isNaN(instant)) throw new RangeError(`not a date: ${iso}`);
  return instant;
}

type Item = { post: Post; url: string; published: number; updated: number };

function itemsOf(input: FeedInput): Item[] {
  return [...input.posts]
    .sort((a, b) => instantOf(b.publishedAt) - instantOf(a.publishedAt))
    .slice(0, input.limit ?? 20)
    .map((post) => ({
      post,
      url: absoluteUrl(input.site.url, input.postHref(post.slug)),
      published: instantOf(post.publishedAt),
      updated: instantOf(post.updatedAt ?? post.publishedAt),
    }));
}

const newest = (items: Item[]) => (items.length ? Math.max(...items.map((item) => item.updated)) : null);

/** An RSS 2.0 feed of the newest `limit` posts: title, link, guid, pubDate, description and category per item. */
export function rssFeed(input: FeedInput): string {
  const items = itemsOf(input);
  const built = newest(items);
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '<channel>',
    `<title>${xmlText(input.site.name)}</title>`,
    `<link>${xmlText(input.site.url)}</link>`,
    `<description>${xmlText(input.site.description)}</description>`,
    `<language>${xmlText(input.language)}</language>`,
    `<atom:link href="${xmlText(absoluteUrl(input.site.url, input.feedPath))}" rel="self" type="application/rss+xml"/>`,
    ...(built === null ? [] : [`<lastBuildDate>${new Date(built).toUTCString()}</lastBuildDate>`]),
    ...items.map(({ post, url, published }) =>
      [
        '<item>',
        `<title>${xmlText(post.title)}</title>`,
        `<link>${xmlText(url)}</link>`,
        `<guid isPermaLink="true">${xmlText(url)}</guid>`,
        `<pubDate>${new Date(published).toUTCString()}</pubDate>`,
        `<description>${xmlText(post.description)}</description>`,
        `<category>${xmlText(post.category)}</category>`,
        '</item>',
      ].join('\n'),
    ),
    '</channel>',
    '</rss>',
  ];
  return `${lines.join('\n')}\n`;
}

/** An Atom feed of the newest `limit` posts, with each entry's authors (the site as the feed's author). */
export function atomFeed(input: FeedInput): string {
  const items = itemsOf(input);
  const feedUrl = absoluteUrl(input.site.url, input.feedPath);
  const authorNames = (post: Post) =>
    post.authorIds.flatMap((id) => input.authors.filter((author) => author.id === id).map((author) => author.name));
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="${xmlText(input.language)}">`,
    `<id>${xmlText(feedUrl)}</id>`,
    `<title>${xmlText(input.site.name)}</title>`,
    `<subtitle>${xmlText(input.site.description)}</subtitle>`,
    `<updated>${new Date(newest(items) ?? 0).toISOString()}</updated>`,
    `<link rel="self" type="application/atom+xml" href="${xmlText(feedUrl)}"/>`,
    `<link rel="alternate" type="text/html" href="${xmlText(input.site.url)}"/>`,
    `<author><name>${xmlText(input.site.name)}</name></author>`,
    ...items.map(({ post, url, published, updated }) =>
      [
        '<entry>',
        `<id>${xmlText(url)}</id>`,
        `<title>${xmlText(post.title)}</title>`,
        `<link rel="alternate" type="text/html" href="${xmlText(url)}"/>`,
        `<published>${new Date(published).toISOString()}</published>`,
        `<updated>${new Date(updated).toISOString()}</updated>`,
        `<summary>${xmlText(post.description)}</summary>`,
        ...authorNames(post).map((name) => `<author><name>${xmlText(name)}</name></author>`),
        '</entry>',
      ].join('\n'),
    ),
    '</feed>',
  ];
  return `${lines.join('\n')}\n`;
}
