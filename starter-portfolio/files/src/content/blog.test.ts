import { cleanup, render } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GET as atomGet } from '@/app/atom.xml/route';
import { GET as rssGet } from '@/app/feed.xml/route';
import sitemap from '@/app/sitemap';
import { createBlog } from '@/utils/blog-content/blog';
import { mdxComponents } from '@/utils/blog-content/mdx-components';
import { blog, paths } from './blog';
import type { Locale } from './locale';
import { subscribe } from './subscribe';

afterEach(cleanup);

const LOCALES: Locale[] = ['en', 'de'];

/** Each language's draft: it documents the post format and must never appear. */
const DRAFTS: Record<Locale, string> = { en: 'writing-a-post', de: 'einen-beitrag-schreiben' };

describe.each(LOCALES)('content/blog/%s', (locale) => {
  const dir = `content/blog/${locale}`;

  it('loads three visible posts, two authors and two categories, and every post names known ones', async () => {
    const site = createBlog({ dir });
    const [posts, authors, categories] = await Promise.all([site.getPosts(), site.getAuthors(), site.getCategories()]);
    expect(posts).toHaveLength(3);
    expect(authors).toHaveLength(2);
    expect(categories).toHaveLength(2);
    const authorIds = new Set(authors.map((author) => author.id));
    const categoryIds = new Set(categories.map((category) => category.id));
    expect(posts.flatMap((post) => post.authorIds).filter((id) => !authorIds.has(id))).toEqual([]);
    expect(posts.map((post) => post.category).filter((id) => !categoryIds.has(id))).toEqual([]);
  });

  it('compiles and renders every visible post: two or more headings, an image from public/blog/ and a code block', async () => {
    const site = createBlog({ dir });
    for (const { slug } of await site.getPosts()) {
      const loaded = await site.getPost(slug);
      expect(loaded, slug).not.toBeNull();
      if (!loaded) continue;
      expect(loaded.headings.length, `${slug} headings`).toBeGreaterThanOrEqual(2);
      expect(loaded.post.image?.src, `${slug} image`).toMatch(/^\/blog\/[a-z0-9-]+\.svg$/);
      const { container } = render(createElement(loaded.Content, { components: mdxComponents() }));
      expect(container.querySelectorAll('h2').length, `${slug} h2`).toBeGreaterThanOrEqual(1);
      expect(container.querySelectorAll('pre code').length, `${slug} code block`).toBeGreaterThanOrEqual(1);
      cleanup();
    }
  });

  it('keeps the draft out of getPosts and getPost, though it is a valid post', async () => {
    const draft = DRAFTS[locale];
    expect((await createBlog({ dir, includeDrafts: true }).getPosts()).map((post) => post.slug)).toContain(draft);
    expect((await createBlog({ dir }).getPosts()).map((post) => post.slug)).not.toContain(draft);
    expect(await createBlog({ dir }).getPost(draft)).toBeNull();
  });
});

describe('the site in LOCALE', () => {
  it('lists every visible post in the sitemap, and no draft', async () => {
    const listed = (await sitemap()).map((entry) => new URL(entry.url).pathname);
    const posts = (await blog.getPosts()).map((post) => paths.post(post.slug));
    expect(posts.filter((path) => !listed.includes(path))).toEqual([]);
    expect(listed.filter((path) => Object.values(DRAFTS).some((draft) => path.endsWith(`/${draft}`)))).toEqual([]);
  });

  it.each([
    ['RSS', rssGet, 'application/rss+xml'],
    ['Atom', atomGet, 'application/atom+xml'],
  ] as const)('the %s feed parses and lists exactly the visible posts', async (_, get, type) => {
    const response = await get();
    expect(response.headers.get('content-type')).toBe(`${type}; charset=utf-8`);
    const doc = new DOMParser().parseFromString(await response.text(), 'application/xml');
    expect(doc.getElementsByTagName('parsererror')).toHaveLength(0);
    const links = [
      ...[...doc.querySelectorAll('item > link')].map((link) => link.textContent ?? ''),
      ...[...doc.querySelectorAll('entry > link')].map((link) => link.getAttribute('href') ?? ''),
    ].map((href) => new URL(href).pathname);
    const visible = (await blog.getPosts()).map((post) => paths.post(post.slug));
    expect([...links].sort()).toEqual([...visible].sort());
  });
});

describe('subscribe', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it('refuses in production until it is replaced', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    await expect(subscribe('a@b.example')).rejects.toThrow('newsletter not configured');
  });

  it('only logs in development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    await expect(subscribe('a@b.example')).resolves.toBeUndefined();
    expect(info).toHaveBeenCalledOnce();
  });
});
