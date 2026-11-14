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
import { BLOG } from './content';
import { CATEGORY_PAGE_LABELS } from './labels';
import { CATEGORY_PAGE_LABELS_DE } from './labels.de';

/** The posts and categories in BLOG.dir, read at build time. The routes share it. */
export const defaultBlog = createBlog({ dir: BLOG.dir });

export const CATEGORY_LABELS = { en: CATEGORY_PAGE_LABELS, de: CATEGORY_PAGE_LABELS_DE };
const CARD_LABELS = { en: BLOG_CARD_LABELS, de: BLOG_CARD_LABELS_DE };
const PAGE_LABELS = { en: PAGINATION_LABELS, de: PAGINATION_LABELS_DE };
const paths = blogPaths(BLOG.base);

const LINK =
  'font-medium text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

export type CategoryPageProps = {
  locale: 'en' | 'de';
  /** The category's id, as in categories.yaml. */
  category: string;
  /** The page number, 1-based; one past the last (or not a whole number) answers 404. */
  page: number;
  /** Where the posts come from. Default: BLOG.dir. */
  blog?: Blog;
};

/**
 * One category: its name and description, a link to all posts, one page of its post cards, then the page links. An
 * unknown category or page calls notFound(). Server component; `page.tsx` renders page 1 and `page/[page]/page.tsx`
 * the rest.
 */
export async function CategoryPage({ locale, category: id, page, blog = defaultBlog }: CategoryPageProps) {
  const category = await blog.getCategory(id);
  if (!category) notFound();
  const [posts, authors] = await Promise.all([blog.getPosts({ category: category.id }), blog.getAuthors()]);
  const current = paginate(posts, page, BLOG.perPage);
  if (!current) notFound();
  const labels = CATEGORY_LABELS[locale];

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-neutral-900 outline-none sm:px-6">
      <h1 className="m-0 text-4xl font-bold leading-tight">{category.name}</h1>
      {category.description ? (
        <p className="m-0 mt-3 max-w-2xl text-lg leading-relaxed text-neutral-700">{category.description}</p>
      ) : null}
      <p className="m-0 mt-4">
        <Link href={paths.index()} className={LINK}>
          {labels.all}
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
        <p className="m-0 mt-10 text-lg text-neutral-700">{labels.empty}</p>
      )}
    </main>
  );
}
