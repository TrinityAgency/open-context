import { cleanup, render, screen } from '@testing-library/react';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { HomePage } from '@/components/home-page';
import { HOME } from '@/content/home';
import type { Locale } from '@/content/locale';
import { CONSENT_CATEGORIES, CTA, FOOTER_COLUMNS, LEGAL, NAV } from '@/content/site';
import { CONSENT_LABELS, CONSENT_LABELS_DE, ConsentProvider } from '@/modules/site-cookie-consent';
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

/** A link's route: its path without query and hash ('/#faq' is '/'); null for a link that leaves the site. */
const routeOf = (href: string) => (href.startsWith('/') ? href.split(/[?#]/)[0] || '/' : null);

describe.each(LOCALES)('home page (%s)', (locale) => {
  it("has one h1, that locale's hero title", () => {
    renderPage(<HomePage locale={locale} />, locale);
    const h1 = screen.getAllByRole('heading', { level: 1 });
    expect(h1.map((h) => h.textContent)).toEqual([HOME[locale].hero.title]);
  });

  it('has an element for every NAV anchor that points into it', () => {
    const { container } = renderPage(<HomePage locale={locale} />, locale);
    const ids = NAV[locale]
      .flatMap((item) => [item, ...(item.children ?? [])])
      .filter((item) => item.href.startsWith('/#'))
      .map((item) => item.href.slice(2));
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.filter((id) => !container.querySelector(`[id="${id}"]`))).toEqual([]);
  });

  it('has a target for every in-page link it renders', () => {
    const { container } = renderPage(<HomePage locale={locale} />, locale);
    const targets = [...container.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')?.slice(1) ?? '');
    expect(targets.length).toBeGreaterThan(0);
    expect(targets.filter((id) => !container.querySelector(`[id="${id}"]`))).toEqual([]);
  });
});

describe('routes', () => {
  it('lists every NAV, call-to-action, LEGAL and footer route of both locales in the sitemap', () => {
    const listed = new Set(sitemap().map((entry) => new URL(entry.url).pathname));
    const hrefs = LOCALES.flatMap((locale) => [
      ...NAV[locale].flatMap((item) => [item.href, ...(item.children ?? []).map((child) => child.href)]),
      CTA[locale].href,
      ...LEGAL[locale].map((link) => link.href),
      ...FOOTER_COLUMNS[locale].flatMap((column) => column.links.map((link) => link.href)),
    ]);
    const routes = hrefs.map(routeOf).filter((route): route is string => route !== null);
    expect(routes.length).toBeGreaterThan(0);
    expect(routes.filter((route) => !listed.has(route))).toEqual([]);
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
