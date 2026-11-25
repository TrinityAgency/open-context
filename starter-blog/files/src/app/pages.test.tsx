import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from '@/components/home-page';
import { BLOG_TEXT } from '@/content/blog';
import type { Locale } from '@/content/locale';
import { CONSENT_CATEGORIES, CTA, FOOTER_COLUMNS, LEGAL, NAV } from '@/content/site';
import { CONSENT_LABELS, CONSENT_LABELS_DE, ConsentProvider } from '@/modules/site-cookie-consent';
import { createBlog } from '@/utils/blog-content/blog';
import Imprint from './imprint/page';
import NotFound from './not-found';
import Privacy from './privacy/page';
import sitemap from './sitemap';
import Terms from './terms/page';

afterEach(cleanup);

/**
 * The consent provider around every page, as src/app/layout.tsx puts it: a kit part behind `Gate={ConsentGate}` (a map,
 * a video) renders only inside it, its gate closed until a choice is made.
 */
function Consent({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <ConsentProvider categories={CONSENT_CATEGORIES[locale]} labels={{ en: CONSENT_LABELS, de: CONSENT_LABELS_DE }[locale]}>
      {children}
    </ConsentProvider>
  );
}

/** Renders a page view or a route as the layout does: inside the consent provider. */
const renderPage = (ui: ReactElement, locale: Locale = 'en') => render(<Consent locale={locale}>{ui}</Consent>);

const LOCALES: Locale[] = ['en', 'de'];

/** The feeds: linked from the footer, served as files, never listed in the sitemap. */
const FEEDS = ['/feed.xml', '/atom.xml'];

/** A link's route: its path without query and hash ('/#newsletter' is '/'); null for a link that leaves the site. */
const routeOf = (href: string) => (href.startsWith('/') ? href.split(/[?#]/)[0] || '/' : null);

/** Each language's own posts (LOCALE picks one of them for the site). */
const blogOf = (locale: Locale) => createBlog({ dir: `content/blog/${locale}` });

describe.each(LOCALES)('home page (%s)', (locale) => {
  it("has one h1, that locale's home title", async () => {
    renderPage(await HomePage({ locale, blog: blogOf(locale) }), locale);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1.map((h) => h.textContent)).toEqual([BLOG_TEXT[locale].home.title]);
  });

  it('has the #newsletter target and an element for every NAV or CTA anchor that points into it', async () => {
    const { container } = renderPage(await HomePage({ locale, blog: blogOf(locale) }), locale);
    expect(container.querySelector('section#newsletter form[data-newsletter]')).not.toBeNull();
    const ids = [...NAV[locale].flatMap((item) => [item, ...(item.children ?? [])]), CTA[locale]]
      .filter((item) => item.href.startsWith('/#'))
      .map((item) => item.href.slice(2));
    expect(ids).toContain('newsletter');
    expect(ids.filter((id) => !container.querySelector(`[id="${id}"]`))).toEqual([]);
  });

  it('shows the three newest posts', async () => {
    const blog = blogOf(locale);
    const newest = (await blog.getPosts()).slice(0, 3).map((post) => post.title);
    renderPage(await HomePage({ locale, blog }), locale);
    expect(screen.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(newest);
  });
});

describe('routes', () => {
  it('lists every NAV, call-to-action, LEGAL and footer route of both locales in the sitemap, the feeds aside', async () => {
    const listed = new Set((await sitemap()).map((entry) => new URL(entry.url).pathname));
    const hrefs = LOCALES.flatMap((locale) => [
      ...NAV[locale].flatMap((item) => [item.href, ...(item.children ?? []).map((child) => child.href)]),
      CTA[locale].href,
      ...LEGAL[locale].map((link) => link.href),
      ...FOOTER_COLUMNS[locale].flatMap((column) => column.links.map((link) => link.href)),
    ]);
    const routes = hrefs.map(routeOf).filter((route): route is string => route !== null && !FEEDS.includes(route));
    expect(routes.length).toBeGreaterThan(0);
    expect(routes.filter((route) => !listed.has(route))).toEqual([]);
  });

  it('links both feeds from the footer in both locales', () => {
    for (const locale of LOCALES) {
      const hrefs = FOOTER_COLUMNS[locale].flatMap((column) => column.links.map((link) => link.href));
      expect(FEEDS.filter((feed) => !hrefs.includes(feed))).toEqual([]);
    }
  });
});

describe('route modules', () => {
  it.each<[string, ComponentType]>([
    ['not-found', NotFound],
    ['imprint', Imprint],
    ['privacy', Privacy],
    ['terms', Terms],
  ])('%s renders main#main with one h1', (_, Route) => {
    const { container } = renderPage(<Route />);
    expect(container.querySelectorAll('main#main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
  });
});
