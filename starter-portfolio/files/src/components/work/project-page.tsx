// Derived from blog-post-page 1.0.0 (the same markup): breadcrumbs, the header, the cover and the body, then more
// work. A project shows its discipline, the month it was finished and the people's names; no reading time, table of
// contents, share links or author pages. Text from src/content/work.ts.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/component-breadcrumbs/breadcrumbs';
import { BREADCRUMBS_LABELS } from '@/components/component-breadcrumbs/labels';
import { BREADCRUMBS_LABELS_DE } from '@/components/component-breadcrumbs/labels.de';
import type { Locale } from '@/content/locale';
import { SITE, siteUrl } from '@/content/site';
import { WORK_TEXT, moreWork, work as defaultWork, workPaths } from '@/content/work';
import type { Blog } from '@/utils/blog-content/blog';
import { mdxComponents } from '@/utils/blog-content/mdx-components';
import { ProjectCard, projectDate } from './project-card';

const TRAIL_LABELS = { en: BREADCRUMBS_LABELS, de: BREADCRUMBS_LABELS_DE };
const LINK =
  'text-neutral-900 underline underline-offset-2 hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const MDX = mdxComponents({ LinkComponent: Link });

export type ProjectPageProps = {
  locale: Locale;
  slug: string;
  /** Where the projects come from. Default: the site's work (src/content/work.ts). */
  work?: Blog;
};

/**
 * One project: breadcrumbs (with their BreadcrumbList data), the title, description, discipline, month and people,
 * the cover, the body, and up to three more projects. A missing, draft or scheduled slug calls notFound(). Server
 * component; src/app/work/[slug]/page.tsx renders it with LOCALE.
 */
export async function ProjectPage({ locale, slug, work = defaultWork }: ProjectPageProps) {
  const loaded = await work.getPost(slug);
  if (!loaded) notFound();
  const { post: project, Content } = loaded;
  const [projects, people, disciplines] = await Promise.all([work.getPosts(), work.getAuthors(), work.getCategories()]);
  const t = WORK_TEXT[locale].project;
  const site = { ...SITE, url: siteUrl() };
  const discipline = disciplines.find((d) => d.id === project.category);
  const names = project.authorIds.flatMap((id) => people.filter((person) => person.id === id).map((person) => person.name));
  const more = moreWork(project, projects);
  const trail = [
    { href: '/', label: t.home },
    { href: workPaths.index(), label: t.work },
    { href: workPaths.post(project.slug), label: project.title },
  ];

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-10 text-neutral-900 outline-none sm:px-6">
      <Breadcrumbs items={trail} baseUrl={site.url} labels={TRAIL_LABELS[locale]} LinkComponent={Link} />

      <header className="mt-8 max-w-3xl">
        <h1 className="m-0 text-4xl font-bold leading-tight">{project.title}</h1>
        <p className="m-0 mt-4 text-lg leading-relaxed text-neutral-700">{project.description}</p>
        <p className="m-0 mt-5 text-sm leading-relaxed text-neutral-600">
          {discipline ? (
            <>
              <Link href={workPaths.category(discipline.id)} className={LINK}>
                {discipline.name}
              </Link>
              <span aria-hidden="true"> · </span>
            </>
          ) : null}
          {t.finished} <time dateTime={project.publishedAt}>{projectDate(project.publishedAt, locale, true)}</time>
          {names.length ? (
            <>
              <span aria-hidden="true"> · </span>
              {t.by} {new Intl.ListFormat(locale, { type: 'conjunction' }).format(names)}
            </>
          ) : null}
        </p>
      </header>

      {project.image ? (
        // A plain img: the project's own cover from public/, sized by its front matter.
        <img
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          className="m-0 mt-8 block h-auto w-full max-w-4xl rounded-lg"
        />
      ) : null}

      <article className="mt-10 min-w-0 max-w-3xl">
        <Content components={MDX} />
      </article>

      {more.length ? (
        <section aria-labelledby="project-page-more" className="mt-16">
          <h2 id="project-page-more" className="m-0 text-2xl font-bold">
            {t.more}
          </h2>
          <ul className="m-0 mt-6 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((other) => (
              <li key={other.slug} className="m-0 min-w-0 p-0">
                <ProjectCard
                  project={other}
                  href={workPaths.post(other.slug)}
                  discipline={disciplines.find((d) => d.id === other.category)}
                  locale={locale}
                  headingLevel={3}
                  LinkComponent={Link}
                  className="h-full"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
