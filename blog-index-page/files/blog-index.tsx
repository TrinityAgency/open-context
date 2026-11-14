import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCard } from './_parts/blog-card/blog-card';
import { BLOG_CARD_LABELS } from './_parts/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from './_parts/blog-card/labels.de';
import { createBlog, type Blog } from './_parts/blog-content/blog';
import { blogPaths } from './_parts/blog-content/blog-paths';
import { paginate } from './_parts/blog-content/collection';
import { PAGINATION_LABELS } from './_parts/component-pagination/labels';
import { PAGINATION_LABELS_DE } from './_parts/component-pagination/labels.de';
import { Pagination } from './_parts/component-pagination/pagination';
import { BLOG, CONTENT } from './content';
import { BLOG_INDEX_LABELS } from './labels';
import { BLOG_INDEX_LABELS_DE } from './labels.de';

/** The posts in BLOG.dir, read at build time. The routes share it. */
export const defaultBlog = createBlog({ dir: BLOG.dir });

export const INDEX_LABELS = { en: BLOG_INDEX_LABELS, de: BLOG_INDEX_LABELS_DE };
const CARD_LABELS = { en: BLOG_CARD_LABELS, de: BLOG_CARD_LABELS_DE };
const PAGE_LABELS = { en: PAGINATION_LABELS, de: PAGINATION_LABELS_DE };
const paths = blogPaths(BLOG.base);

const FILTER =
  'box-border inline-flex h-9 items-center rounded-full border border-solid border-neutral-300 bg-white px-4 font-sans text-sm font-medium text-neutral-900 no-underline hover:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const FILTER_CURRENT =
  'box-border inline-flex h-9 items-center rounded-full border border-solid border-neutral-900 bg-neutral-900 px-4 font-sans text-sm font-semibold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

export type BlogIndexPageProps = {
  locale: 'en' | 'de';
  /** The page number, 1-based; one past the last (or not a whole number) answers 404. */
  page: number;
  /** Where the posts come from. Default: BLOG.dir. */
  blog?: Blog;
};

/**
 * The blog index: title, intro, the category filter, one page of post cards, then the page links. Server component;
 * `page.tsx` renders page 1 and `page/[page]/page.tsx` the rest.
 */
export async function BlogIndexPage({ locale, page, blog = defaultBlog }: BlogIndexPageProps) {
  const c = CONTENT[locale];
  const labels = INDEX_LABELS[locale];
  const [posts, authors, categories] = await Promise.all([blog.getPosts(), blog.getAuthors(), blog.getCategories()]);
  const current = paginate(posts, page, BLOG.perPage);
  if (!current) notFound();

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-neutral-900 outline-none sm:px-6">
      <h1 className="m-0 text-4xl font-bold leading-tight">{c.title}</h1>
      <p className="m-0 mt-3 max-w-2xl text-lg leading-relaxed text-neutral-700">{c.intro}</p>

      {categories.length ? (
        <nav aria-label={labels.filter} className="mt-8">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            <li className="m-0 p-0">
              {/* "All posts" is the filter's current choice on every index page; it is the current page only on page 1. */}
              <Link href={paths.index()} aria-current={current.page === 1 ? 'page' : 'true'} className={FILTER_CURRENT}>
                {labels.all}
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id} className="m-0 p-0">
                <Link href={paths.category(category.id)} className={FILTER}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {current.items.length ? (
        <>
          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {current.items.map((post) => (
              <li key={post.slug} className="m-0 min-w-0 p-0">
                <BlogCard
                  post={post}
                  href={paths.post(post.slug)}
                  authors={authors}
                  category={categories.find((category) => category.id === post.category)}
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
            hrefFor={(n) => paths.index(n)}
            labels={PAGE_LABELS[locale]}
            LinkComponent={Link}
            className="mt-12"
          />
        </>
      ) : (
        <p className="m-0 mt-10 text-lg text-neutral-700">{c.empty}</p>
      )}
    </main>
  );
}
