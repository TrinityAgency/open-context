import type { MetadataRoute } from 'next';
import { absoluteUrl } from './feeds';
import type { Post } from './site-types';

/** Sitemap entries for posts: the absolute URL and the last change (updatedAt, else publishedAt). */
export function postSitemapEntries(
  posts: Post[],
  opts: { siteUrl: string; postHref: (slug: string) => string },
): MetadataRoute.Sitemap {
  return posts.map((post) => ({
    url: absoluteUrl(opts.siteUrl, opts.postHref(post.slug)),
    lastModified: post.updatedAt ?? post.publishedAt,
  }));
}
