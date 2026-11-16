import type { MetadataRoute } from 'next';
import { BLOG, blog, paths } from '@/content/blog';
import { siteUrl } from '@/content/site';
import { work, workPaths } from '@/content/work';
import { pageParams } from '@/utils/blog-content/collection';
import { postSitemapEntries } from '@/utils/blog-rss-sitemap/sitemap';

// Every public page; add each new page here (src/app/pages.test.tsx checks that every linked route is listed).
// The blog's index pages, categories, authors and posts, and the work's projects and disciplines, follow from the
// content. Redirects, the not-found page and the feeds are not listed.
const PAGES = ['/', '/work', '/services', '/about', '/contact', '/blog', '/imprint', '/privacy', '/terms'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const [posts, authors, categories, projects, disciplines] = await Promise.all([
    blog.getPosts(),
    blog.getAuthors(),
    blog.getCategories(),
    work.getPosts(),
    work.getCategories(),
  ]);
  const categoryPaths = await Promise.all(
    categories.map(async (category) => {
      const count = (await blog.getPosts({ category: category.id })).length;
      return [paths.category(category.id), ...pageParams(count, BLOG.perPage).map(({ page }) => paths.category(category.id, Number(page)))];
    }),
  );
  const listed = [
    ...PAGES,
    ...pageParams(posts.length, BLOG.perPage).map(({ page }) => paths.index(Number(page))),
    ...categoryPaths.flat(),
    ...authors.map((author) => paths.author(author.id)),
    ...disciplines.filter((d) => projects.some((project) => project.category === d.id)).map((d) => workPaths.category(d.id)),
  ];
  return [
    ...listed.map((path) => ({ url: path === '/' ? base : `${base}${path}` })),
    ...postSitemapEntries(posts, { siteUrl: base, postHref: paths.post }),
    ...postSitemapEntries(projects, { siteUrl: base, postHref: workPaths.post }),
  ];
}
