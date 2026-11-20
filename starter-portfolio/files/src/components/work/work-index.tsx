// Derived from blog-index-page 2.0.0 and blog-category-page 3.0.0 (the same markup, its tokens as design-tokens'
// utilities): one unpaged list of project cards, filtered by discipline; text from src/content/work.ts.
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '@/content/locale';
import { WORK_TEXT, work as defaultWork, workPaths } from '@/content/work';
import type { Blog } from '@/utils/blog-content/blog';
import { ProjectCard } from './project-card';

// The current filter is the brand mark; another filter is an outline chip whose border turns ink under the pointer
// (an emphasis, not the brand). A chip grows in height for a long discipline name: it is at most the row's width and
// its list item may shrink to the row, so only a word wider than the screen breaks inside it (`wrap-anywhere`: the
// label is a bare text node in a flex box, whose minimum width `break-word` would leave at that word).
const FILTER_BASE = 'box-border inline-flex min-h-9 max-w-full items-center rounded-full border border-solid px-4 py-1.5 font-oc-body text-sm wrap-anywhere no-underline';
const FILTER =
  `${FILTER_BASE} border-oc-line-strong bg-oc-surface font-medium text-oc-ink hover:border-oc-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oc-focus`;
const FILTER_CURRENT =
  `${FILTER_BASE} border-oc-brand bg-oc-brand font-semibold text-oc-on-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-oc-focus`;
const FILTER_ITEM = 'm-0 min-w-0 max-w-full p-0';

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
    <main id="main" tabIndex={-1} className="mx-auto box-border w-full max-w-6xl px-4 py-12 text-oc-ink outline-none wrap-break-word sm:px-6">
      <h1 className="m-0 text-4xl font-bold leading-tight font-oc-heading">{discipline ? discipline.name : t.title}</h1>
      <p className="m-0 mt-3 max-w-2xl text-lg leading-relaxed text-oc-ink-body">
        {discipline ? (discipline.description ?? t.intro) : t.intro}
      </p>

      {filter.length ? (
        <nav aria-label={t.filter} className="mt-8">
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            <li className={FILTER_ITEM}>
              <Link href={workPaths.index()} aria-current={discipline ? undefined : 'page'} className={discipline ? FILTER : FILTER_CURRENT}>
                {t.all}
              </Link>
            </li>
            {filter.map((d) => (
              <li key={d.id} className={FILTER_ITEM}>
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
        <p className="m-0 mt-10 text-lg text-oc-ink-body">{t.empty}</p>
      )}
    </main>
  );
}
