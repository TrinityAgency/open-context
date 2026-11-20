import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BlogCard } from './_parts/blog-card/blog-card';
import { formatPostDate } from './_parts/blog-card/format-date';
import { BLOG_CARD_LABELS } from './_parts/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from './_parts/blog-card/labels.de';
import { createBlog, type Blog } from './_parts/blog-content/blog';
import { blogPaths } from './_parts/blog-content/blog-paths';
import { relatedPosts } from './_parts/blog-content/collection';
import { mdxComponents } from './_parts/blog-content/mdx-components';
import { SHARE_LABELS } from './_parts/blog-share-buttons/labels';
import { SHARE_LABELS_DE } from './_parts/blog-share-buttons/labels.de';
import { ShareButtons } from './_parts/blog-share-buttons/share-buttons';
import { Breadcrumbs } from './_parts/component-breadcrumbs/breadcrumbs';
import { BREADCRUMBS_LABELS } from './_parts/component-breadcrumbs/labels';
import { BREADCRUMBS_LABELS_DE } from './_parts/component-breadcrumbs/labels.de';
import { articleJsonLd } from './_parts/site-seo/json-ld';
import { JsonLd } from './_parts/site-seo/json-ld-script';
import { absoluteUrl } from './_parts/site-seo/metadata';
import { BLOG, SITE } from './content';
import { POST_PAGE_LABELS } from './labels';
import { POST_PAGE_LABELS_DE } from './labels.de';
import { ReadingProgress } from './reading-progress';
import { TableOfContents } from './table-of-contents';

/** The posts in BLOG.dir, read at build time. The route shares it. */
export const defaultBlog = createBlog({ dir: BLOG.dir });
export const paths = blogPaths(BLOG.base);

const LABELS = {
  en: { page: POST_PAGE_LABELS, card: BLOG_CARD_LABELS, share: SHARE_LABELS, trail: BREADCRUMBS_LABELS },
  de: { page: POST_PAGE_LABELS_DE, card: BLOG_CARD_LABELS_DE, share: SHARE_LABELS_DE, trail: BREADCRUMBS_LABELS_DE },
};
const AUTHOR_LINK =
  'text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const MDX = mdxComponents({ LinkComponent: Link });

export type PostPageProps = {
  locale: 'en' | 'de';
  slug: string;
  /** Where the posts come from. Default: BLOG.dir. */
  blog?: Blog;
};

/**
 * One post: breadcrumbs, the header, the body beside its table of contents, share links, related posts and the
 * Article data, under a reading progress bar. A missing, draft or scheduled slug calls notFound(). Server component;
 * `page.tsx` renders it with `LOCALE`.
 */
export async function PostPage({ locale, slug, blog = defaultBlog }: PostPageProps) {
  const loaded = await blog.getPost(slug);
  if (!loaded) notFound();
  const { post, Content, headings } = loaded;
  const [posts, authors, categories] = await Promise.all([blog.getPosts(), blog.getAuthors(), blog.getCategories()]);
  const l = LABELS[locale];
  const site = SITE[locale];
  const category = categories.find((c) => c.id === post.category);
  const byline = post.authorIds.flatMap((id) => authors.filter((author) => author.id === id));
  const related = relatedPosts(post, posts);
  const trail = [
    { href: '/', label: l.page.home },
    { href: paths.index(), label: l.page.blog },
    ...(category ? [{ href: paths.category(category.id), label: category.name }] : []),
    { href: paths.post(post.slug), label: post.title },
  ];
  // The author names joined for the locale ("A, B and C"), each name a link to its author page.
  let nextAuthor = 0;
  const names = new Intl.ListFormat(locale, { type: 'conjunction' })
    .formatToParts(byline.map((author) => author.name))
    .map((part, i) => {
      if (part.type === 'literal') return part.value;
      const author = byline[nextAuthor++];
      return author ? (
        <Link key={`${author.id}-${i}`} href={paths.author(author.id)} className={AUTHOR_LINK}>
          {author.name}
        </Link>
      ) : null;
    });

  return (
    <>
      <ReadingProgress targetId="post-body" />
      <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-10 text-[var(--oc-ink,oklch(20.5%_0_none))] outline-none wrap-break-word sm:px-6">
        <Breadcrumbs items={trail} baseUrl={site.url} labels={l.trail} LinkComponent={Link} />

        <header className="mt-8 max-w-3xl">
          {category ? (
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--oc-ink-muted,oklch(43.9%_0_none))]">{category.name}</p>
          ) : null}
          <h1 className="m-0 mt-2 text-4xl font-bold leading-tight font-[family-name:var(--oc-font-heading)]">{post.title}</h1>
          <p className="m-0 mt-4 text-lg leading-relaxed text-[var(--oc-ink-body,oklch(37.1%_0_none))]">{post.description}</p>
          <p className="m-0 mt-5 text-sm leading-relaxed text-[var(--oc-ink-muted,oklch(43.9%_0_none))]">
            {l.page.published} <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
            {post.updatedAt ? (
              <>
                <span aria-hidden="true"> · </span>
                {l.page.updated} <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt, locale)}</time>
              </>
            ) : null}
            <span aria-hidden="true"> · </span>
            {l.card.minutes(post.readingMinutes)}
            {byline.length ? (
              <>
                <span aria-hidden="true"> · </span>
                {l.card.by} {names}
              </>
            ) : null}
          </p>
        </header>

        {post.image ? (
          // A plain img: the post's own picture from public/, sized by its front matter.
          <img
            src={post.image.src}
            alt={post.image.alt}
            width={post.image.width}
            height={post.image.height}
            className="m-0 mt-8 block h-auto w-full max-w-3xl rounded-[calc(var(--oc-radius,0.25rem)*2)]"
          />
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
          {headings.length >= 2 ? (
            <aside className="min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:self-start">
              <TableOfContents headings={headings} label={l.page.contents} />
            </aside>
          ) : null}
          <article id="post-body" className="min-w-0 max-w-3xl lg:col-start-1 lg:row-start-1">
            <Content components={MDX} />
          </article>
        </div>

        <ShareButtons
          url={absoluteUrl(paths.post(post.slug), site.url)}
          title={post.title}
          labels={l.share}
          className="mt-12 max-w-3xl border-t border-[var(--oc-line,oklch(92.2%_0_none))] pt-8"
        />

        {related.length ? (
          <section aria-labelledby="post-page-related" className="mt-16">
            <h2 id="post-page-related" className="m-0 text-2xl font-bold font-[family-name:var(--oc-font-heading)]">
              {l.page.related}
            </h2>
            <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((other) => (
                <li key={other.slug} className="m-0 min-w-0 p-0">
                  <BlogCard
                    post={other}
                    href={paths.post(other.slug)}
                    authors={authors}
                    category={categories.find((c) => c.id === other.category)}
                    locale={locale}
                    headingLevel={3}
                    labels={l.card}
                    LinkComponent={Link}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <JsonLd data={articleJsonLd(post, { url: paths.post(post.slug), site, authors })} />
      </main>
    </>
  );
}
