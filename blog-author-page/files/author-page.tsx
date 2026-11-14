import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCard } from './_parts/blog-card/blog-card';
import { BLOG_CARD_LABELS } from './_parts/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from './_parts/blog-card/labels.de';
import { createBlog, type Blog } from './_parts/blog-content/blog';
import { blogPaths } from './_parts/blog-content/blog-paths';
import { BLOG } from './content';
import { AUTHOR_PAGE_LABELS } from './labels';
import { AUTHOR_PAGE_LABELS_DE } from './labels.de';

/** The posts and authors in BLOG.dir, read at build time. The route shares it. */
export const defaultBlog = createBlog({ dir: BLOG.dir });
const paths = blogPaths(BLOG.base);

const LABELS = {
  en: { page: AUTHOR_PAGE_LABELS, card: BLOG_CARD_LABELS },
  de: { page: AUTHOR_PAGE_LABELS_DE, card: BLOG_CARD_LABELS_DE },
};
const LINK =
  'font-medium text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/** A bio's paragraphs: split on blank lines, trimmed, empty ones left out. */
export function bioParagraphs(bio: string | undefined): string[] {
  return (bio ?? '')
    .split(/\r?\n[ \t]*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

export type AuthorPageProps = {
  locale: 'en' | 'de';
  /** The author's id, as in authors.yaml. */
  author: string;
  /** Where the posts come from. Default: BLOG.dir. */
  blog?: Blog;
};

/**
 * One author: name, portrait, bio and website, then every visible post they wrote (newest first, unpaged). An
 * unknown id calls notFound(). Server component; `page.tsx` renders it with `LOCALE`.
 */
export async function AuthorPage({ locale, author: id, blog = defaultBlog }: AuthorPageProps) {
  const author = await blog.getAuthor(id);
  if (!author) notFound();
  const [posts, authors, categories] = await Promise.all([
    blog.getPosts({ authorId: author.id }),
    blog.getAuthors(),
    blog.getCategories(),
  ]);
  const l = LABELS[locale];
  const website = author.url;

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-neutral-900 outline-none sm:px-6">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {author.image ? (
          <img
            src={author.image.src}
            alt={author.image.alt}
            width={author.image.width}
            height={author.image.height}
            className="m-0 block h-24 w-24 shrink-0 rounded-full object-cover"
          />
        ) : null}
        <div className="min-w-0 max-w-2xl">
          <h1 className="m-0 text-4xl font-bold leading-tight">{author.name}</h1>
          {bioParagraphs(author.bio).map((paragraph) => (
            <p key={paragraph} className="m-0 mt-3 text-lg leading-relaxed text-neutral-700">
              {paragraph}
            </p>
          ))}
          {website ? (
            <p className="m-0 mt-4">
              {/^\/(?![/\\])/.test(website) ? (
                <Link href={website} className={LINK}>
                  {l.page.website}
                </Link>
              ) : (
                <a href={website} rel="noopener noreferrer" className={LINK}>
                  {l.page.website}
                </a>
              )}
            </p>
          ) : null}
        </div>
      </header>

      <section aria-labelledby="author-page-posts" className="mt-12">
        <h2 id="author-page-posts" className="m-0 text-2xl font-bold">
          {l.page.posts(author.name)}
        </h2>
        {posts.length ? (
          <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.slug} className="m-0 min-w-0 p-0">
                <BlogCard
                  post={post}
                  href={paths.post(post.slug)}
                  authors={authors}
                  category={categories.find((category) => category.id === post.category)}
                  locale={locale}
                  headingLevel={3}
                  labels={l.card}
                  LinkComponent={Link}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 mt-6 text-lg text-neutral-700">{l.page.empty}</p>
        )}
      </section>

      <p className="m-0 mt-12">
        <Link href={paths.index()} className={LINK}>
          {l.page.all}
        </Link>
      </p>
    </main>
  );
}
