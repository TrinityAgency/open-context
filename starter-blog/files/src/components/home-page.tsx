import Link from 'next/link';
import { subscribeAction } from '@/app/newsletter-action';
import { BlogCard } from '@/components/blog-card/blog-card';
import { BLOG_CARD_LABELS } from '@/components/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from '@/components/blog-card/labels.de';
import { NEWSLETTER_LABELS } from '@/components/blog-newsletter-cta/labels';
import { NEWSLETTER_LABELS_DE } from '@/components/blog-newsletter-cta/labels.de';
import { NewsletterCta } from '@/components/blog-newsletter-cta/newsletter-cta';
import { BLOG_TEXT, blog as defaultBlog, paths } from '@/content/blog';
import type { Locale } from '@/content/locale';
import type { Blog } from '@/utils/blog-content/blog';

const CARD_LABELS = { en: BLOG_CARD_LABELS, de: BLOG_CARD_LABELS_DE };
const NEWSLETTER = { en: NEWSLETTER_LABELS, de: NEWSLETTER_LABELS_DE };
const LINK =
  'font-medium text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

export type HomePageProps = {
  locale: Locale;
  /** Where the posts come from. Default: the site's blog (src/content/blog.ts). */
  blog?: Blog;
};

/**
 * The home page: title and lead, the three newest posts, a link to the blog, and the newsletter signup (the target
 * of the header's Subscribe link, /#newsletter). Text: BLOG_TEXT[locale].home in src/content/blog.ts.
 */
export async function HomePage({ locale, blog = defaultBlog }: HomePageProps) {
  const t = BLOG_TEXT[locale];
  const [posts, authors, categories] = await Promise.all([blog.getPosts(), blog.getAuthors(), blog.getCategories()]);
  const latest = posts.slice(0, 3);

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-neutral-900 outline-none sm:px-6">
      <h1 className="m-0 max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">{t.home.title}</h1>
      <p className="m-0 mt-4 max-w-2xl text-lg leading-relaxed text-neutral-700">{t.home.lead}</p>

      <section aria-labelledby="home-latest" className="mt-14">
        <h2 id="home-latest" className="m-0 text-2xl font-bold">
          {t.home.latest}
        </h2>
        {latest.length ? (
          <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((post) => (
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
          <p className="m-0 mt-6 text-lg text-neutral-700">{t.home.empty}</p>
        )}
        <p className="m-0 mt-8">
          <Link href={paths.index()} className={LINK}>
            {t.home.all}
          </Link>
        </p>
      </section>

      <NewsletterCta
        id="newsletter"
        content={t.newsletter}
        action={subscribeAction}
        labels={NEWSLETTER[locale]}
        LinkComponent={Link}
        className="mt-16"
      />
    </main>
  );
}
