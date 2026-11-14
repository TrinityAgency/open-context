// Derived from blog-category-page 2.0.0 (same markup): parts through @/, text from src/content/blog.ts.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCard } from '@/components/blog-card/blog-card';
import { BLOG_CARD_LABELS } from '@/components/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from '@/components/blog-card/labels.de';
import { PAGINATION_LABELS } from '@/components/component-pagination/labels';
import { PAGINATION_LABELS_DE } from '@/components/component-pagination/labels.de';
import { Pagination } from '@/components/component-pagination/pagination';
import { BLOG, BLOG_TEXT, blog as defaultBlog, paths } from '@/content/blog';
import type { Locale } from '@/content/locale';
import type { Blog } from '@/utils/blog-content/blog';
import { paginate } from '@/utils/blog-content/collection';

const CARD_LABELS = { en: BLOG_CARD_LABELS, de: BLOG_CARD_LABELS_DE };
const PAGE_LABELS = { en: PAGINATION_LABELS, de: PAGINATION_LABELS_DE };
const LINK =
  'font-medium text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

export type CategoryPageProps = {
  locale: Locale;
  /** The category's id, as in categories.yaml. */
  category: string;
  /** The page number, 1-based; one past the last (or not a whole number) answers 404. */
  page: number;
  /** Where the posts come from. Default: the site's blog (src/content/blog.ts). */
  blog?: Blog;
};

/**
 * One category: its name and description, a link to all posts, one page of its post cards, then the page links. An
 * unknown category or page calls notFound(). Server component; src/app/blog/category/[category]/page.tsx renders
 * page 1 and …/page/[page]/page.tsx the rest.
 */
export async function CategoryPage({ locale, category: id, page, blog = defaultBlog }: CategoryPageProps) {
  const category = await blog.getCategory(id);
  if (!category) notFound();
  const [posts, authors] = await Promise.all([blog.getPosts({ category: category.id }), blog.getAuthors()]);
  const current = paginate(posts, page, BLOG.perPage);
  if (!current) notFound();
  const t = BLOG_TEXT[locale].category;

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-neutral-900 outline-none sm:px-6">
      <h1 className="m-0 text-4xl font-bold leading-tight">{category.name}</h1>
      {category.description ? (
        <p className="m-0 mt-3 max-w-2xl text-lg leading-relaxed text-neutral-700">{category.description}</p>
      ) : null}
      <p className="m-0 mt-4">
        <Link href={paths.index()} className={LINK}>
          {t.all}
        </Link>
      </p>

      {current.items.length ? (
        <>
          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {current.items.map((post) => (
              <li key={post.slug} className="m-0 min-w-0 p-0">
                <BlogCard
                  post={post}
                  href={paths.post(post.slug)}
                  authors={authors}
                  category={category}
                  locale={locale}
                  headingLevel={2}
                  labels={CARD_LABELS[locale]}
                  LinkComponent={Link}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
          <Pagination
            page={current.page}
            pageCount={current.pageCount}
            hrefFor={(n) => paths.category(category.id, n)}
            labels={PAGE_LABELS[locale]}
            LinkComponent={Link}
            className="mt-12"
          />
        </>
      ) : (
        <p className="m-0 mt-10 text-lg text-neutral-700">{t.empty}</p>
      )}
    </main>
  );
}
