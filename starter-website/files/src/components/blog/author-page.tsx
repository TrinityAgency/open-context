// Derived from blog-author-page 1.0.0 (same markup): parts through @/, text from src/content/blog.ts.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCard } from '@/components/blog-card/blog-card';
import { BLOG_CARD_LABELS } from '@/components/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from '@/components/blog-card/labels.de';
import { BLOG_TEXT, blog as defaultBlog, paths } from '@/content/blog';
import type { Locale } from '@/content/locale';
import type { Blog } from '@/utils/blog-content/blog';

const CARD_LABELS = { en: BLOG_CARD_LABELS, de: BLOG_CARD_LABELS_DE };
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
  locale: Locale;
  /** The author's id, as in authors.yaml. */
  author: string;
  /** Where the posts come from. Default: the site's blog (src/content/blog.ts). */
  blog?: Blog;
};

/**
 * One author: name, portrait, bio and website, then every visible post they wrote (newest first, unpaged). An
 * unknown id calls notFound(). Server component; src/app/blog/author/[author]/page.tsx renders it with LOCALE.
 */
export async function AuthorPage({ locale, author: id, blog = defaultBlog }: AuthorPageProps) {
  const author = await blog.getAuthor(id);
  if (!author) notFound();
  const [posts, authors, categories] = await Promise.all([
    blog.getPosts({ authorId: author.id }),
    blog.getAuthors(),
    blog.getCategories(),
  ]);
  const t = BLOG_TEXT[locale].author;
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
                  {t.website}
                </Link>
              ) : (
                <a href={website} rel="noopener noreferrer" className={LINK}>
                  {t.website}
                </a>
              )}
            </p>
          ) : null}
        </div>
      </header>

      <section aria-labelledby="author-page-posts" className="mt-12">
        <h2 id="author-page-posts" className="m-0 text-2xl font-bold">
          {t.posts(author.name)}
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
                  labels={CARD_LABELS[locale]}
                  LinkComponent={Link}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="m-0 mt-6 text-lg text-neutral-700">{t.empty}</p>
        )}
      </section>

      <p className="m-0 mt-12">
        <Link href={paths.index()} className={LINK}>
          {t.all}
        </Link>
      </p>
    </main>
  );
}
