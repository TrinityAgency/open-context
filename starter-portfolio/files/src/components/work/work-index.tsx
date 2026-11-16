// Derived from blog-index-page 1.0.0 and blog-category-page 2.0.0 (the same markup): one unpaged list of project
// cards, filtered by discipline; text from src/content/work.ts.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/locale';
import { WORK_TEXT, work as defaultWork, workPaths } from '@/content/work';
import type { Blog } from '@/utils/blog-content/blog';
import { ProjectCard } from './project-card';

const FILTER =
  'box-border inline-flex h-9 items-center rounded-full border border-solid border-neutral-300 bg-white px-4 font-sans text-sm font-medium text-neutral-900 no-underline hover:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const FILTER_CURRENT =
  'box-border inline-flex h-9 items-center rounded-full border border-solid border-neutral-900 bg-neutral-900 px-4 font-sans text-sm font-semibold text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

export type WorkIndexProps = {
  locale: Locale;
  /** A discipline's id: only its projects. Unknown ids answer 404. Default: every project. */
  category?: string;
  /** Where the projects come from. Default: the site's work (src/content/work.ts). */
  work?: Blog;
};

/**
 * The work: the title (or the discipline's name), its intro, the discipline filter (every discipline with a project)
 * and the project cards, newest first. Server component; src/app/work/page.tsx renders every project and
 * src/app/work/category/[category]/page.tsx one discipline's.
 */
export async function WorkIndex({ locale, category: id, work = defaultWork }: WorkIndexProps) {
  const t = WORK_TEXT[locale].index;
  const [projects, disciplines] = await Promise.all([work.getPosts(), work.getCategories()]);
  const discipline = id === undefined ? undefined : disciplines.find((d) => d.id === id);
  if (id !== undefined && !discipline) notFound();
  const shown = discipline ? projects.filter((project) => project.category === discipline.id) : projects;
  const filter = disciplines.filter((d) => projects.some((project) => project.category === d.id));

  return (
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-neutral-900 outline-none sm:px-6">
      <h1 className="m-0 text-4xl font-bold leading-tight">{discipline ? discipline.name : t.title}</h1>
      <p className="m-0 mt-3 max-w-2xl text-lg leading-relaxed text-neutral-700">
        {discipline ? (discipline.description ?? t.intro) : t.intro}
      </p>

      {filter.length ? (
        <nav aria-label={t.filter} className="mt-8">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            <li className="m-0 p-0">
              <Link href={workPaths.index()} aria-current={discipline ? undefined : 'page'} className={discipline ? FILTER : FILTER_CURRENT}>
                {t.all}
              </Link>
            </li>
            {filter.map((d) => (
              <li key={d.id} className="m-0 p-0">
                <Link
                  href={workPaths.category(d.id)}
                  aria-current={d.id === discipline?.id ? 'page' : undefined}
                  className={d.id === discipline?.id ? FILTER_CURRENT : FILTER}
                >
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      {shown.length ? (
        <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((project) => (
            <li key={project.slug} className="m-0 min-w-0 p-0">
              <ProjectCard
                project={project}
                href={workPaths.post(project.slug)}
                discipline={disciplines.find((d) => d.id === project.category)}
                locale={locale}
                headingLevel={2}
                LinkComponent={Link}
                className="h-full"
              />
            </li>
          ))}
        </ul>
      ) : (
        <p className="m-0 mt-10 text-lg text-neutral-700">{t.empty}</p>
      )}
    </main>
  );
}
