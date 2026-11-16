# RSS & Sitemap

Feeds and sitemap entries for a blog, as pure functions: `rssFeed` writes an RSS 2.0 feed, `atomFeed` an Atom feed,
and `postSitemapEntries` the posts' lines for Next's `sitemap.ts`. They take posts as data in the kit's `Post` shape
(the `blog-content` loader gives exactly that), so the two route handlers below are all the wiring a site needs.

## Usage

`@/` is your project's own import alias (the project root, or `src/`); adjust the paths to where the files landed.
`@/lib/blog` stands for wherever your posts come from: a function returning the visible posts, and the authors.

### The RSS feed: `app/feed.xml/route.ts`

```ts
import { rssFeed } from '@/src/utils/blog-rss-sitemap/feeds';
import { getAuthors, getPosts } from '@/lib/blog';
import { SITE } from '@/site'; // your SiteIdentity: { name, url, description }

export const dynamic = 'force-static';

export async function GET() {
  const body = rssFeed({
    site: SITE,
    feedPath: '/feed.xml',
    posts: await getPosts(),
    authors: await getAuthors(),
    postHref: (slug) => `/blog/${slug}`,
    language: 'en',
  });
  return new Response(body, { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } });
}
```

### The Atom feed: `app/atom.xml/route.ts`

The same, with `atomFeed`, `feedPath: '/atom.xml'` and `content-type: application/atom+xml; charset=utf-8`.

### Telling browsers and readers: `app/layout.tsx`

```ts
export const metadata = {
  alternates: {
    types: {
      'application/rss+xml': [{ url: '/feed.xml', title: 'RSS' }],
      'application/atom+xml': [{ url: '/atom.xml', title: 'Atom' }],
    },
  },
};
```

### The sitemap: `app/sitemap.ts`

```ts
import type { MetadataRoute } from 'next';
import { postSitemapEntries } from '@/src/utils/blog-rss-sitemap/sitemap';
import { getPosts } from '@/lib/blog';
import { SITE } from '@/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = ['/', '/blog'].map((path) => ({ url: new URL(path, SITE.url).toString() }));
  return [...pages, ...postSitemapEntries(await getPosts(), { siteUrl: SITE.url, postHref: (slug) => `/blog/${slug}` })];
}
```

The post entries cover posts only; list your other pages (the blog index, category and author pages) beside them.

## Props

`FeedInput` for both feeds:

| Key | |
|---|---|
| `site` | `SiteIdentity`: `name` is the feed title and the Atom feed's author, `description` its subtitle, `url` the base of every link |
| `feedPath` | the feed's own path, for its self link |
| `posts` | the posts to list, already filtered to the visible ones; the feed sorts them newest first |
| `authors` | Atom names each entry's known authors in `authorIds` order |
| `postHref` | a post's path from its slug |
| `language` | `en`, `de`, … |
| `limit` | the newest `limit` posts (default 20) |

What the feeds hold:

- **RSS 2.0:** the channel's `title`, `link`, `description`, `language`, an `atom:link rel="self"` and
  `lastBuildDate` (the newest `updatedAt` or `publishedAt`; left out with no posts). Each item has `title`, `link`,
  `guid isPermaLink="true"`, `pubDate` (RFC 822), `description` and `category` (the id).
- **Atom:** the feed's `id` (its URL), `title`, `subtitle`, `updated` (the newest change; the epoch with no posts),
  self and alternate links and the site as `author`. Each entry has `id` (the post URL), `title`, an alternate link,
  `published`, `updated` (`updatedAt`, else `publishedAt`), `summary` and its authors.
- Feeds carry the description, not the whole post: readers follow the link to read it.

Every link is absolute, with one slash between `site.url` and the path, so `https://example.com/` works as well as
`https://example.com`. A date-only `publishedAt` (`2026-03-01`) counts as 00:00 UTC that day; a date-time keeps its
offset.

`postSitemapEntries(posts, { siteUrl, postHref })` gives `{ url, lastModified }` per post, `lastModified` being
`updatedAt`, else `publishedAt`.

`xmlText(value)` (in `xml.ts`) is what makes text safe: it drops the characters XML 1.0 forbids (control characters,
U+FFFE, U+FFFF, lone surrogates) and escapes `& < > " '`. A title like `Tom & Jerry <3` reads back as written.

## Labels

None: the feed's words are your site's and your posts'.

## Keyboard and screen readers

Nothing visible: feeds are read by feed readers. Link them from a page with plain text links.

## Client islands

None.

## Notes

- `dynamic = 'force-static'` makes each feed a file at build time; a new post appears at the next build.
- Feed readers fetch the feeds themselves: nothing is requested from another host when a visitor opens your site.
