import Link from 'next/link';
import { BlogCard } from '@/components/blog-card/blog-card';
import { BLOG_CARD_LABELS } from '@/components/blog-card/labels';
import { BLOG_CARD_LABELS_DE } from '@/components/blog-card/labels.de';
import { CtaSection } from '@/components/section-cta/cta-section';
import { FeaturesSection } from '@/components/section-features/features-section';
import { HeroSection } from '@/components/section-hero/hero-section';
import { LogoCloudSection } from '@/components/section-logo-cloud/logo-cloud-section';
import { StatsSection } from '@/components/section-stats/stats-section';
import { TestimonialsSection } from '@/components/section-testimonials/testimonials-section';
import { blog as defaultBlog, paths } from '@/content/blog';
import { HOME } from '@/content/home';
import type { Locale } from '@/content/locale';
import type { Blog } from '@/utils/blog-content/blog';

const CARD_LABELS = { en: BLOG_CARD_LABELS, de: BLOG_CARD_LABELS_DE };
const LINK =
  'rounded-sm font-medium text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

export type HomePageProps = {
  locale: Locale;
  /** Where the posts come from. Default: the site's blog (src/content/blog.ts). */
  blog?: Blog;
};

/**
 * The home page: hero, logos, features, figures, testimonials, the three newest posts with a link to the blog, and a
 * call to action. Text: HOME[locale] in src/content/home.ts. The posts' section is left out while the blog has no
 * visible post. Server component; src/app/page.tsx renders it with LOCALE.
 */
export async function HomePage({ locale, blog = defaultBlog }: HomePageProps) {
  const c = HOME[locale];
  const [posts, authors, categories] = await Promise.all([blog.getPosts(), blog.getAuthors(), blog.getCategories()]);
  const latest = posts.slice(0, 3);

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      <LogoCloudSection content={c.logos} LinkComponent={Link} />
      <FeaturesSection id="features" content={c.features} />
      <StatsSection content={c.stats} />
      <TestimonialsSection content={c.testimonials} />
      {latest.length ? (
        <section aria-labelledby="home-latest" className="box-border px-6 py-16 text-neutral-900">
          <div className="mx-auto max-w-5xl">
            <h2 id="home-latest" className="m-0 text-3xl font-semibold tracking-tight">
              {c.latest.title}
            </h2>
            <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
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
            <p className="m-0 mt-8">
              <Link href={paths.index()} className={LINK}>
                {c.latest.allPosts}
              </Link>
            </p>
          </div>
        </section>
      ) : null}
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
