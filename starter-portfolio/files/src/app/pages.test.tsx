import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { cleanup, render, screen, within } from '@testing-library/react';
import type { ComponentType, ReactElement, ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { AboutPage } from '@/components/about/about-page';
import { HomePage } from '@/components/home-page';
import { ServicesPage } from '@/components/services-page';
import { ProjectPage } from '@/components/work/project-page';
import { WorkIndex } from '@/components/work/work-index';
import { paths } from '@/content/blog';
import { contactContent } from '@/content/contact';
import { HOME } from '@/content/home';
import type { Locale } from '@/content/locale';
import { CONSENT_CATEGORIES, CONTACT, CTA, FOOTER_COLUMNS, LEGAL, NAV } from '@/content/site';
import { CONSENT_LABELS, CONSENT_LABELS_DE, ConsentProvider } from '@/modules/site-cookie-consent';
import { workPaths } from '@/content/work';
import { createBlog } from '@/utils/blog-content/blog';
import { ContactView } from './_page-contact/contact-view';
import { CONTACT_LABELS_DE } from './_page-contact/labels.de';
import { CONTACT_LABELS } from './_page-contact/labels';
import About from './about/page';
import Contact from './contact/page';
import Imprint from './imprint/page';
import NotFound from './not-found';
import Privacy from './privacy/page';
import Services from './services/page';
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

/** A link to a file in public/ (a gallery's thumbnail opens its picture): no page, but the file must be there. */
const isFile = (route: string) => /\.[a-z0-9]+$/i.test(route) && existsSync(join(__dirname, '..', '..', 'public', route));

const LOCALES: Locale[] = ['en', 'de'];

/** The feeds: linked from the footer, served as files, never listed in the sitemap. */
const FEEDS = ['/feed.xml', '/atom.xml'];

/** A link's route: its path without query and hash ('/services#faq' is '/services'); null for a link that leaves the site. */
const routeOf = (href: string) => (href.startsWith('/') ? href.split(/[?#]/)[0] || '/' : null);

/** Each language's own projects (LOCALE picks one of them for the site). */
const workOf = (locale: Locale) => createBlog({ dir: `content/work/${locale}` });

/** Every page view of the site in one locale, rendered as the routes render it. */
const views = async (locale: Locale): Promise<[string, ReactElement][]> => {
  const work = workOf(locale);
  const [newest] = await work.getPosts();
  if (!newest) throw new Error(`content/work/${locale}: no visible project`);
  return [
    ['home', await HomePage({ locale, work })],
    ['services', <ServicesPage key="services" locale={locale} />],
    ['about', <AboutPage key="about" locale={locale} />],
    [
      'contact',
      <ContactView
        key="contact"
        content={contactContent(locale)}
        startedAt={0}
        labels={{ en: CONTACT_LABELS, de: CONTACT_LABELS_DE }[locale]}
      />,
    ],
    ['work', await WorkIndex({ locale, work })],
    ['work category', await WorkIndex({ locale, category: newest.category, work })],
    ['project', await ProjectPage({ locale, slug: newest.slug, work })],
  ];
};

/** The site's routes as the sitemap lists them (the blog's and the work's follow the content of LOCALE). */
const listedRoutes = async () => new Set((await sitemap()).map((entry) => new URL(entry.url).pathname));

describe.each(LOCALES)('pages (%s)', (locale) => {
  it('every page view renders main#main with one h1', async () => {
    for (const [name, view] of await views(locale)) {
      const { container } = renderPage(view, locale);
      expect(container.querySelectorAll('main#main'), name).toHaveLength(1);
      expect(screen.getAllByRole('heading', { level: 1 }), name).toHaveLength(1);
      cleanup();
    }
  });

  it("the home page's h1 is that locale's hero title", async () => {
    renderPage(await HomePage({ locale, work: workOf(locale) }), locale);
    expect(screen.getAllByRole('heading', { level: 1 }).map((h) => h.textContent)).toEqual([HOME[locale].hero.title]);
  });

  it('the home page shows the newest projects, three at most, and links to the work', async () => {
    const work = workOf(locale);
    const newest = (await work.getPosts()).slice(0, 3).map((project) => project.title);
    renderPage(await HomePage({ locale, work }), locale);
    if (newest.length === 0) {
      expect(screen.queryByRole('region', { name: HOME[locale].work.title })).toBeNull();
      return;
    }
    const selected = screen.getByRole('region', { name: HOME[locale].work.title });
    expect(within(selected).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(newest);
    expect(within(selected).getByRole('link', { name: HOME[locale].work.allWork }).getAttribute('href')).toBe(workPaths.index());
  });

  it('the contact page shows the email and phone from site.ts', () => {
    renderPage(<ContactView content={contactContent(locale)} startedAt={0} />, locale);
    expect(screen.getByRole('link', { name: CONTACT.email }).getAttribute('href')).toBe(`mailto:${CONTACT.email}`);
    expect(screen.getByRole('link', { name: CONTACT.phone })).toBeTruthy();
  });

  it('every in-page link a view renders has its target', async () => {
    for (const [name, view] of await views(locale)) {
      const { container } = renderPage(view, locale);
      const targets = [...container.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')?.slice(1) ?? '');
      expect(targets.filter((id) => !container.querySelector(`[id="${id}"]`)), name).toEqual([]);
      cleanup();
    }
  });

  it('every link a view renders to another page of the site points at a listed route', async () => {
    const listed = await listedRoutes();
    // The collections' item and category pages follow LOCALE's content: another locale's slugs are not listed.
    const content = [`${paths.index()}/`, `${workPaths.index()}/`];
    for (const [name, view] of await views(locale)) {
      const { container } = renderPage(view, locale);
      const routes = [...container.querySelectorAll('a[href^="/"]')]
        .map((a) => routeOf(a.getAttribute('href') ?? ''))
        .filter((route): route is string => route !== null && !content.some((prefix) => route.startsWith(prefix)));
      expect(routes.filter((route) => !listed.has(route) && !FEEDS.includes(route) && !isFile(route)), name).toEqual([]);
      cleanup();
    }
  });
});

describe('routes', () => {
  it('lists every NAV, call-to-action, LEGAL and footer route of both locales in the sitemap, the feeds aside', async () => {
    const listed = await listedRoutes();
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
    ['services', Services],
    ['about', About],
    ['contact', Contact],
    ['not-found', NotFound],
    ['imprint', Imprint],
    ['privacy', Privacy],
    ['terms', Terms],
  ])('%s renders main#main with one h1; its in-page links have targets, its site links listed routes', async (_, Route) => {
    // A page of the site's own is its route file alone (AGENTS.md, "Adding a page"), so its links are read here.
    const listed = await listedRoutes();
    const { container } = renderPage(<Route />);
    expect(container.querySelectorAll('main#main')).toHaveLength(1);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const targets = [...container.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')?.slice(1) ?? '');
    expect(targets.filter((id) => !container.querySelector(`[id="${id}"]`))).toEqual([]);
    const routes = [...container.querySelectorAll('a[href^="/"]')]
      .map((a) => routeOf(a.getAttribute('href') ?? ''))
      .filter((route): route is string => route !== null);
    expect(routes.filter((route) => !listed.has(route) && !FEEDS.includes(route) && !isFile(route))).toEqual([]);
  });
});
