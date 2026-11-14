import { blog, paths } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { SITE, siteUrl } from '@/content/site';
import { atomFeed } from '@/utils/blog-rss-sitemap/feeds';

// Written once at build time: a new post appears in the feed at the next build.
export const dynamic = 'force-static';

/** The Atom feed of the newest posts (src/utils/blog-rss-sitemap/README.md). */
export async function GET() {
  const body = atomFeed({
    site: { ...SITE, url: siteUrl() },
    feedPath: '/atom.xml',
    posts: await blog.getPosts(),
    authors: await blog.getAuthors(),
    postHref: paths.post,
    language: LOCALE,
  });
  return new Response(body, { headers: { 'content-type': 'application/atom+xml; charset=utf-8' } });
}
