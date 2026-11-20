import Link from 'next/link';
import { CtaSection } from '@/components/section-cta/cta-section';
import { HeroSection } from '@/components/section-hero/hero-section';
import { LogoCloudSection } from '@/components/section-logo-cloud/logo-cloud-section';
import { TestimonialsSection } from '@/components/section-testimonials/testimonials-section';
import { ProjectCard } from '@/components/work/project-card';
import { HOME } from '@/content/home';
import type { Locale } from '@/content/locale';
import { work as defaultWork, workPaths } from '@/content/work';
import type { Blog } from '@/utils/blog-content/blog';

const LINK =
  'rounded-oc font-medium text-oc-ink underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oc-focus';

export type HomePageProps = {
  locale: Locale;
  /** Where the projects come from. Default: the site's work (src/content/work.ts). */
  work?: Blog;
};

/**
 * The home page: hero, the three newest projects with a link to the work, logos, testimonials and a call to action.
 * Text: HOME[locale] in src/content/home.ts. The projects' section is left out while there is no visible project.
 * Server component; src/app/page.tsx renders it with LOCALE.
 */
export async function HomePage({ locale, work = defaultWork }: HomePageProps) {
  const c = HOME[locale];
  const [projects, disciplines] = await Promise.all([work.getPosts(), work.getCategories()]);
  const selected = projects.slice(0, 3);

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <HeroSection content={c.hero} LinkComponent={Link} />
      {selected.length ? (
        <section aria-labelledby="home-work" className="box-border px-6 py-16 text-oc-ink wrap-break-word">
          <div className="mx-auto max-w-5xl">
            <h2 id="home-work" className="m-0 text-3xl font-semibold tracking-tight font-oc-heading">
              {c.work.title}
            </h2>
            <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {selected.map((project) => (
                <li key={project.slug} className="m-0 min-w-0 p-0">
                  <ProjectCard
                    project={project}
                    href={workPaths.post(project.slug)}
                    discipline={disciplines.find((d) => d.id === project.category)}
                    locale={locale}
                    headingLevel={3}
                    LinkComponent={Link}
                    className="h-full"
                  />
                </li>
              ))}
            </ul>
            <p className="m-0 mt-8">
              <Link href={workPaths.index()} className={LINK}>
                {c.work.allWork}
              </Link>
            </p>
          </div>
        </section>
      ) : null}
      <LogoCloudSection content={c.logos} LinkComponent={Link} />
      <TestimonialsSection content={c.testimonials} />
      <CtaSection id="contact" content={c.cta} LinkComponent={Link} />
    </main>
  );
}
