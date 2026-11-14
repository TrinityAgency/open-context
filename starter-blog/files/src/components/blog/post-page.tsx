// Derived from blog-post-page 1.0.0 (same markup): parts through @/, text from src/content/blog.ts, plus the
// newsletter signup in the aside under the table of contents.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { subscribeAction } from '@/app/newsletter-action';
import { BlogCard } from '@/components/blog-card/blog-card';
import { formatPostDate } from '@/components/blog-card/format-date';
import { BLOG_CARD_LABELS } from '@/components/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from '@/components/blog-card/labels.de';
import { NEWSLETTER_LABELS } from '@/components/blog-newsletter-cta/labels';
import { NEWSLETTER_LABELS_DE } from '@/components/blog-newsletter-cta/labels.de';
import { NewsletterCta } from '@/components/blog-newsletter-cta/newsletter-cta';
import { SHARE_LABELS } from '@/components/blog-share-buttons/labels';
import { SHARE_LABELS_DE } from '@/components/blog-share-buttons/labels.de';
import { ShareButtons } from '@/components/blog-share-buttons/share-buttons';
import { Breadcrumbs } from '@/components/component-breadcrumbs/breadcrumbs';
import { BREADCRUMBS_LABELS } from '@/components/component-breadcrumbs/labels';
import { BREADCRUMBS_LABELS_DE } from '@/components/component-breadcrumbs/labels.de';
import { BLOG_TEXT, blog as defaultBlog, paths } from '@/content/blog';
import type { Locale } from '@/content/locale';
import { SITE, siteUrl } from '@/content/site';
import type { Blog } from '@/utils/blog-content/blog';
import { relatedPosts } from '@/utils/blog-content/collection';
import { mdxComponents } from '@/utils/blog-content/mdx-components';
import { JsonLd, absoluteUrl, articleJsonLd } from '@/utils/site-seo';
import { ReadingProgress } from './reading-progress';
import { TableOfContents } from './table-of-contents';

const LABELS = {
  en: { card: BLOG_CARD_LABELS, share: SHARE_LABELS, trail: BREADCRUMBS_LABELS, newsletter: NEWSLETTER_LABELS },
  de: { card: BLOG_CARD_LABELS_DE, share: SHARE_LABELS_DE, trail: BREADCRUMBS_LABELS_DE, newsletter: NEWSLETTER_LABELS_DE },
};
const AUTHOR_LINK =
  'text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
// The aside holds the table of contents (2+ headings) and the signup. Below lg it sits above the post and shows only
// the table of contents (the header's Subscribe link leads to the signup on the home page); without one it is hidden.
const ASIDE = 'min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:self-start';
const ASIDE_WIDE_ONLY = 'hidden min-w-0 lg:sticky lg:top-6 lg:col-start-2 lg:row-start-1 lg:block lg:self-start';
const MDX = mdxComponents({ LinkComponent: Link });

export type PostPageProps = {
  locale: Locale;
  slug: string;
  /** Where the posts come from. Default: the site's blog (src/content/blog.ts). */
  blog?: Blog;
};

/**
 * One post: breadcrumbs, the header, the body beside its table of contents and the newsletter signup, share links,
 * related posts and the Article data, under a reading progress bar. A missing, draft or scheduled slug calls
 * notFound(). Server component; src/app/blog/[slug]/page.tsx renders it with LOCALE.
 */
export async function PostPage({ locale, slug, blog = defaultBlog }: PostPageProps) {
  const loaded = await blog.getPost(slug);
  if (!loaded) notFound();
  const { post, Content, headings } = loaded;
  const [posts, authors, categories] = await Promise.all([blog.getPosts(), blog.getAuthors(), blog.getCategories()]);
  const t = BLOG_TEXT[locale];
  const l = LABELS[locale];
  const site = { ...SITE, url: siteUrl() };
  const category = categories.find((c) => c.id === post.category);
  const byline = post.authorIds.flatMap((id) => authors.filter((author) => author.id === id));
  const related = relatedPosts(post, posts);
  const toc = headings.length >= 2;
  const trail = [
    { href: '/', label: t.post.home },
    { href: paths.index(), label: t.post.blog },
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
      <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-10 text-neutral-900 outline-none sm:px-6">
        <Breadcrumbs items={trail} baseUrl={site.url} labels={l.trail} LinkComponent={Link} />

        <header className="mt-8 max-w-3xl">
          {category ? (
            <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-600">{category.name}</p>
          ) : null}
          <h1 className="m-0 mt-2 text-4xl font-bold leading-tight">{post.title}</h1>
          <p className="m-0 mt-4 text-lg leading-relaxed text-neutral-700">{post.description}</p>
          <p className="m-0 mt-5 text-sm leading-relaxed text-neutral-600">
            {t.post.published} <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
            {post.updatedAt ? (
              <>
                <span aria-hidden="true"> · </span>
                {t.post.updated} <time dateTime={post.updatedAt}>{formatPostDate(post.updatedAt, locale)}</time>
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
            className="m-0 mt-8 block h-auto w-full max-w-3xl rounded-lg"
          />
        ) : null}

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <aside className={toc ? ASIDE : ASIDE_WIDE_ONLY}>
            {toc ? <TableOfContents headings={headings} label={t.post.contents} /> : null}
            <NewsletterCta
              content={t.newsletter}
              action={subscribeAction}
              variant="sticky"
              labels={l.newsletter}
              LinkComponent={Link}
              className={toc ? 'mt-8 hidden lg:block' : 'hidden lg:block'}
            />
          </aside>
          <article id="post-body" className="min-w-0 max-w-3xl lg:col-start-1 lg:row-start-1">
            <Content components={MDX} />
          </article>
        </div>

        <ShareButtons
          url={absoluteUrl(paths.post(post.slug), site.url)}
          title={post.title}
          labels={l.share}
          className="mt-12 max-w-3xl border-t border-neutral-200 pt-8"
        />

        {related.length ? (
          <section aria-labelledby="post-page-related" className="mt-16">
            <h2 id="post-page-related" className="m-0 text-2xl font-bold">
              {t.post.related}
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
