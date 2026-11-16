// The work: the projects, a second collection read by the blog's loader (src/utils/blog-content) from
// content/work/<locale>/, and the text of its pages, in English and German. Server only (it reads files). A project is
// written like a post: AGENTS.md, "Writing a project", says what each setting means for a project.
import { createBlog } from '@/utils/blog-content/blog';
import { blogPaths } from '@/utils/blog-content/blog-paths';
import { sortPosts } from '@/utils/blog-content/collection';
import type { Post } from '@/utils/blog-content/site-types';
import { LOCALE, type Locale } from './locale';

/**
 * `dir`: the projects folder of the site's language, relative to the project root (projects in `posts/`, people in
 * `authors.yaml`, disciplines in `categories.yaml`). `base`: the work's URL; it must match the route folder
 * src/app/work.
 */
export const WORK = { dir: `content/work/${LOCALE}`, base: '/work' };

/** The projects, people and disciplines in WORK.dir, read at build time. Every work route reads this one. */
export const work = createBlog({ dir: WORK.dir });

/** The work's URLs under WORK.base: index() the list, post(slug) a project, category(id) a discipline. */
export const workPaths = blogPaths(WORK.base);

export type WorkText = {
  index: {
    meta: { title: string; description: string };
    title: string;
    intro: string;
    /** The discipline filter's navigation name and its first link. */
    filter: string;
    all: string;
    /** Shown instead of the cards while there is no visible project. */
    empty: string;
  };
  project: {
    /** The breadcrumb trail's first two links. */
    home: string;
    work: string;
    /** Before the month the project was finished (its publishedAt). */
    finished: string;
    /** Before the names of the people who worked on it (its authorIds). */
    by: string;
    /** The heading over the other projects at the foot of the page. */
    more: string;
  };
};

export const WORK_TEXT: Record<Locale, WorkText> = {
  en: {
    index: {
      meta: { title: 'Work', description: 'Selected projects: what we planned, made and look after, newest first.' },
      title: 'Work',
      intro: 'Selected projects, newest first.',
      filter: 'Disciplines',
      all: 'All work',
      empty: 'No projects yet.',
    },
    project: {
      home: 'Home',
      work: 'Work',
      finished: 'Finished',
      by: 'By',
      more: 'More work',
    },
  },
  de: {
    index: {
      meta: { title: 'Arbeiten', description: 'Ausgewählte Projekte: was wir geplant, gemacht und betreut haben, die neuesten zuerst.' },
      title: 'Arbeiten',
      intro: 'Ausgewählte Projekte, die neuesten zuerst.',
      filter: 'Disziplinen',
      all: 'Alle Arbeiten',
      empty: 'Noch keine Projekte.',
    },
    project: {
      home: 'Startseite',
      work: 'Arbeiten',
      finished: 'Abgeschlossen',
      by: 'Von',
      more: 'Weitere Arbeiten',
    },
  },
};

/**
 * Up to `n` other projects for the foot of a project page: those in the same discipline first, then the rest, each
 * group newest first. Never the project itself.
 */
export function moreWork(project: Post, all: Post[], n = 3): Post[] {
  const others = sortPosts(all).filter((other) => other.slug !== project.slug);
  return [
    ...others.filter((other) => other.category === project.category),
    ...others.filter((other) => other.category !== project.category),
  ].slice(0, n);
}
