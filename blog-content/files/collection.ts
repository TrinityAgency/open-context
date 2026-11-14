import { instantOf } from './front-matter';
import type { Post } from './site-types';

const byCodePoint = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** A post is visible when it is not a draft (or drafts are included) and its publishedAt is not after `now`. */
export function isVisible(post: Post, now: Date, includeDrafts: boolean): boolean {
  return (includeDrafts || !post.draft) && instantOf(post.publishedAt) <= now.getTime();
}

/** A new array, newest first; posts published at the same instant in slug order. */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => instantOf(b.publishedAt) - instantOf(a.publishedAt) || byCodePoint(a.slug, b.slug));
}

function pageCountOf(total: number, perPage: number): number {
  if (!Number.isInteger(perPage) || perPage < 1) throw new RangeError(`perPage must be a positive integer, not ${perPage}`);
  return Math.max(1, Math.ceil(total / perPage));
}

/**
 * One page of `items`. `pageCount` is at least 1 (an empty list has one empty page). Gives null when `page` is not an
 * integer in 1…pageCount, so a route can answer 404; throws a RangeError for a `perPage` that is not a positive integer.
 */
export function paginate<T>(items: T[], page: number, perPage: number): { items: T[]; page: number; pageCount: number } | null {
  const pageCount = pageCountOf(items.length, perPage);
  if (!Number.isInteger(page) || page < 1 || page > pageCount) return null;
  return { items: items.slice((page - 1) * perPage, page * perPage), page, pageCount };
}

/** generateStaticParams for the pages after the first: `[{ page: '2' }, …]`. */
export function pageParams(total: number, perPage: number): { page: string }[] {
  const pageCount = pageCountOf(total, perPage);
  return Array.from({ length: pageCount - 1 }, (_, i) => ({ page: String(i + 2) }));
}

/**
 * Up to `limit` posts like `post`: 2 points for the same category, 1 per shared tag. The post itself and posts
 * scoring 0 are left out; ties keep the sortPosts order.
 */
export function relatedPosts(post: Post, posts: Post[], limit = 3): Post[] {
  const score = (other: Post) =>
    (other.category === post.category ? 2 : 0) + other.tags.filter((tag) => post.tags.includes(tag)).length;
  return sortPosts(posts)
    .filter((other) => other.slug !== post.slug)
    .map((other) => ({ other, score: score(other) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.other);
}

/** Every tag with the number of posts carrying it: most used first, then by tag. */
export function tagCounts(posts: Post[]): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || byCodePoint(a.tag, b.tag));
}
