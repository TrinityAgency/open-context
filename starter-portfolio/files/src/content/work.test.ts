import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { GET as atomGet } from '@/app/atom.xml/route';
import { GET as rssGet } from '@/app/feed.xml/route';
import sitemap from '@/app/sitemap';
import { HomePage } from '@/components/home-page';
import { ProjectPage } from '@/components/work/project-page';
import { WorkIndex } from '@/components/work/work-index';
import { createBlog } from '@/utils/blog-content/blog';
import { blog, paths } from './blog';
import type { Locale } from './locale';
import { WORK, moreWork, work, workPaths } from './work';

afterEach(cleanup);

const LOCALES: Locale[] = ['en', 'de'];

const workOf = (locale: Locale) => createBlog({ dir: `content/work/${locale}` });

/** Every link's path in a rendered view. */
const hrefsIn = (container: HTMLElement) =>
  [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? '').filter((href) => href.startsWith('/'));

// These checks hold for any projects: the samples, the owner's beside them, or the owner's alone.
describe.each(LOCALES)('content/work/%s', (locale) => {
  it('every project names a known discipline and known people, and its cover is a file in public/work/', async () => {
    const w = workOf(locale);
    const [projects, people, disciplines] = await Promise.all([w.getPosts(), w.getAuthors(), w.getCategories()]);
    for (const project of projects) {
      expect(disciplines.map((d) => d.id), project.slug).toContain(project.category);
      expect(project.authorIds.filter((id) => !people.some((person) => person.id === id)), project.slug).toEqual([]);
      expect(project.image?.src, project.slug).toMatch(/^\/work\//);
      expect(existsSync(join('public', project.image?.src ?? '')), `${project.slug}: ${project.image?.src}`).toBe(true);
    }
  });

  it('moreWork: the same discipline first, the newest first within each, never the project itself, at most n', async () => {
    const projects = await workOf(locale).getPosts();
    const rank = (slug: string) => projects.findIndex((p) => p.slug === slug);
    for (const project of projects) {
      for (const n of [1, 3]) {
        const more = moreWork(project, projects, n);
        expect(more.map((p) => p.slug), project.slug).not.toContain(project.slug);
        expect(more, project.slug).toHaveLength(Math.min(n, projects.length - 1));
        const same = more.filter((p) => p.category === project.category);
        expect(more.slice(0, same.length), project.slug).toEqual(same);
        for (const group of [same, more.slice(same.length)]) {
          expect(group.map((p) => rank(p.slug)), project.slug).toEqual(group.map((p) => rank(p.slug)).sort((a, b) => a - b));
        }
      }
    }
  });

  it('every link the work views and the home page render for a project is under /work/, none under /blog/', async () => {
    const w = workOf(locale);
    const projects = await w.getPosts();
    const views = [
      await WorkIndex({ locale, work: w }),
      ...(await Promise.all([...new Set(projects.map((p) => p.category))].map((category) => WorkIndex({ locale, category, work: w })))),
      await HomePage({ locale, work: w }),
      ...(await Promise.all(projects.map((p) => ProjectPage({ locale, slug: p.slug, work: w })))),
    ];
    let found = 0;
    for (const view of views) {
      const hrefs = hrefsIn(render(view).container);
      for (const project of projects) {
        const toIt = hrefs.filter((href) => href.split(/[?#]/)[0]?.endsWith(`/${project.slug}`));
        found += toIt.length;
        expect(toIt.filter((href) => href !== workPaths.post(project.slug)), project.slug).toEqual([]);
      }
      expect(hrefs.filter((href) => href.startsWith(`${paths.index()}/`))).toEqual([]);
      expect(hrefs.filter((href) => href.includes('/category/') && !href.startsWith(`${workPaths.index()}/category/`))).toEqual([]);
      cleanup();
    }
    expect(found).toBeGreaterThanOrEqual(projects.length * 2);
  });
});

describe('the site in LOCALE', () => {
  it.each([
    ['RSS', rssGet],
    ['Atom', atomGet],
  ] as const)('the %s feed lists the posts only, never a project', async (_, get) => {
    const doc = new DOMParser().parseFromString(await (await get()).text(), 'application/xml');
    const links = [
      ...[...doc.querySelectorAll('item > link')].map((link) => link.textContent ?? ''),
      ...[...doc.querySelectorAll('entry > link')].map((link) => link.getAttribute('href') ?? ''),
    ].map((href) => new URL(href).pathname);
    const posts = (await blog.getPosts()).map((post) => paths.post(post.slug));
    expect([...links].sort()).toEqual([...posts].sort());
    expect(links.filter((path) => path.startsWith(`${workPaths.index()}/`))).toEqual([]);
  });

  it('the sitemap lists every visible project under /work/ and every visible post under /blog/, no URL twice, no draft', async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls.filter((url, i) => urls.indexOf(url) !== i)).toEqual([]);
    const listed = urls.map((url) => new URL(url).pathname);
    const [projects, posts, withDrafts] = await Promise.all([
      work.getPosts(),
      blog.getPosts(),
      createBlog({ dir: WORK.dir, includeDrafts: true }).getPosts(),
    ]);
    expect(projects.map((p) => workPaths.post(p.slug)).filter((path) => !listed.includes(path))).toEqual([]);
    expect(posts.map((p) => paths.post(p.slug)).filter((path) => !listed.includes(path))).toEqual([]);
    expect(projects.map((p) => paths.post(p.slug)).filter((path) => listed.includes(path))).toEqual([]);
    expect(posts.map((p) => workPaths.post(p.slug)).filter((path) => listed.includes(path))).toEqual([]);
    const disciplines = [...new Set(projects.map((p) => p.category))];
    expect(disciplines.map((id) => workPaths.category(id)).filter((path) => !listed.includes(path))).toEqual([]);
    const hidden = withDrafts.filter((p) => !projects.some((visible) => visible.slug === p.slug));
    expect(hidden.map((p) => workPaths.post(p.slug)).filter((path) => listed.includes(path))).toEqual([]);
  });
});

describe('a project written like a project', () => {
  it.each(['client', 'year', 'url'])('a %s: key in the front matter stops the build, naming the file and the key', async (key) => {
    const dir = await mkdtemp(join(tmpdir(), 'work-'));
    try {
      await mkdir(join(dir, 'posts'));
      await writeFile(join(dir, 'authors.yaml'), '- id: alex-sample\n  name: Alex Sample\n');
      await writeFile(join(dir, 'categories.yaml'), '- id: web\n  name: Web\n');
      await writeFile(
        join(dir, 'posts', 'acme-website.mdx'),
        `---\ntitle: A website\ndescription: A sample.\npublishedAt: 2026-01-05\nauthorIds: [alex-sample]\ncategory: web\n${key}: Acme\n---\n\nText.\n`,
      );
      await expect(createBlog({ dir }).getPosts()).rejects.toThrow(new RegExp(`posts/acme-website\\.mdx.*\\b${key}: unknown key`));
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

// ── The sample work ────────────────────────────────────────────────────────────────────────────────────────────────
// Everything below checks the sample projects that ship with the starter. Projects of your own beside them pass; once
// you delete the samples, delete this block too (down to the end of the file). The checks above stay.

/** The sample projects of each language, newest first, with their discipline; and the draft that documents the format. */
const SAMPLE: Record<Locale, { projects: [string, string][]; draft: string }> = {
  en: {
    projects: [
      ['northfield-website', 'web'],
      ['example-builders-identity', 'brand'],
      ['sample-labs-dashboard', 'product'],
      ['demo-studio-website', 'web'],
    ],
    draft: 'project-template',
  },
  de: {
    projects: [
      ['website-fuer-northfield', 'web'],
      ['zeichen-fuer-example-builders', 'brand'],
      ['dashboard-fuer-sample-labs', 'product'],
      ['demo-studio-neu-gebaut', 'web'],
    ],
    draft: 'projekt-vorlage',
  },
};

describe.each(LOCALES)('the sample work in content/work/%s', (locale) => {
  const sample = SAMPLE[locale];
  const samplesOf = async () => {
    const all = await workOf(locale).getPosts();
    return all.filter((p) => sample.projects.some(([slug]) => slug === p.slug));
  };

  it('holds the four sample projects, newest first; the draft documents the format and stays hidden', async () => {
    expect((await samplesOf()).map((p) => [p.slug, p.category])).toEqual(sample.projects);
    const dir = `content/work/${locale}`;
    expect((await createBlog({ dir, includeDrafts: true }).getPosts()).map((p) => p.slug)).toContain(sample.draft);
    expect(await workOf(locale).getPost(sample.draft)).toBeNull();
  });

  it('holds the three sample disciplines and the two sample people', async () => {
    const w = workOf(locale);
    const [people, disciplines] = await Promise.all([w.getAuthors(), w.getCategories()]);
    expect(disciplines.map((d) => d.id)).toEqual(expect.arrayContaining(['web', 'brand', 'product']));
    expect(people.map((p) => p.id)).toEqual(expect.arrayContaining(['alex-sample', 'casey-example']));
  });

  it('moreWork orders the samples: the same discipline first, then the newest', async () => {
    const samples = await samplesOf();
    const [a, b, c, d] = samples;
    if (!a || !b || !c || !d) throw new Error('four sample projects expected');
    const slugs = (list: { slug: string }[]) => list.map((p) => p.slug);
    expect(slugs(moreWork(a, samples))).toEqual(slugs([d, b, c]));
    expect(slugs(moreWork(b, samples))).toEqual(slugs([a, c, d]));
    expect(slugs(moreWork(d, samples))).toEqual(slugs([a, b, c]));
    expect(slugs(moreWork(a, samples, 1))).toEqual(slugs([d]));
  });
});
