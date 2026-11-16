import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from '@/components/HomePage';
import { NotFoundView } from '@/components/NotFoundView';
import { SiteHeader } from '@/components/SiteHeader';
import { LOCALE, type Locale } from '@/content/locale';
import { HOME, NAV, NOT_FOUND, UI } from '@/content/site';
import NotFound from './not-found';
import Home, { metadata } from './page';
import sitemap from './sitemap';

afterEach(cleanup);

const LOCALES: Locale[] = ['en', 'de'];

for (const l of LOCALES) {
  describe(`home page (${l})`, () => {
    it('renders main#main with one h1, the title from site.ts', () => {
      const { container } = render(<HomePage locale={l} />);
      expect(container.querySelectorAll('main#main')).toHaveLength(1);
      const h1 = screen.getAllByRole('heading', { level: 1 });
      expect(h1).toHaveLength(1);
      expect(h1[0]?.textContent).toBe(HOME[l].title);
    });

    it('has an element for every NAV anchor', () => {
      const { container } = render(<HomePage locale={l} />);
      const ids = NAV[l].filter((item) => item.href.startsWith('/#')).map((item) => item.href.slice(2));
      expect(ids.length).toBeGreaterThan(0);
      expect(ids.filter((id) => !container.querySelector(`#${id}`))).toEqual([]);
    });
  });

  describe(`not-found view (${l})`, () => {
    it('renders main#main with one h1, a way home and every NAV link', () => {
      const { container } = render(<NotFoundView locale={l} />);
      const main = container.querySelector('main#main');
      expect(main).not.toBeNull();
      const h1 = screen.getAllByRole('heading', { level: 1 });
      expect(h1).toHaveLength(1);
      expect(h1[0]?.textContent).toBe(NOT_FOUND[l].title);
      const links = within(main as HTMLElement);
      expect(links.getByRole('link', { name: UI[l].home })).toHaveAttribute('href', '/');
      for (const item of NAV[l]) expect(links.getByRole('link', { name: item.label })).toHaveAttribute('href', item.href);
    });
  });

  describe(`header (${l})`, () => {
    it('starts with the skip link to #main', () => {
      render(<SiteHeader locale={l} />);
      const first = screen.getAllByRole('link')[0];
      expect(first).toHaveAttribute('href', '#main');
      expect(first?.textContent).toBe(UI[l].skipLink);
      expect(screen.getByRole('navigation', { name: UI[l].mainNav })).toBeInTheDocument();
    });
  });
}

describe('routes', () => {
  it('the home page names itself from HOME in LOCALE', () => {
    expect(metadata.title).toBe(HOME[LOCALE].metaTitle);
    expect(metadata.description).toBe(HOME[LOCALE].lead);
  });

  it('the home and not-found routes render their views (one main#main each)', () => {
    const home = render(<Home />);
    expect(home.container.querySelectorAll('main#main')).toHaveLength(1);
    cleanup();
    const notFound = render(<NotFound />);
    expect(notFound.container.querySelectorAll('main#main')).toHaveLength(1);
  });

  it('every NAV entry points at a page the sitemap lists, in both languages', () => {
    const listed = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    const missing = LOCALES.flatMap((l) => NAV[l].map((item) => item.href.split('#')[0] || '/')).filter((path) => !listed.has(path));
    expect(missing).toEqual([]);
  });
});
