# AGENTS.md: how this site is put together

For whoever changes this site next, a person or a coding agent. Read it before changing pages, facts or the design.
Run `pnpm test && pnpm lint` after every change; both must pass.

This is the lean skeleton: a home page, a not-found page, a header and a footer. It grows by adding pages and by
installing templates from the website kit (see "Growing with the kit").

## Where facts and text live

- **`src/content/site.ts`**: the facts, once. `SITE` (name, description, `url`) and `CONTACT` (company, phone, email,
  address) exist once; per language: `NAV` (the main navigation), `HOME` (the home page's text), `NOT_FOUND` (the
  not-found page's text) and `UI` (the skip link, the navigation's name, the words "Phone", "Email" and "Home").
  `FORBIDDEN` lists phrases that must appear nowhere on the site.
- **`src/content/locale.ts`**: `LOCALE`, the language switch (see below).

Pages and components read these; they never copy a fact. `SITE_URL` in the environment overrides `SITE.url`. Every
value as shipped is invented sample data (Samplework Inc., `example.com`): replace it before the site goes live.

## The language switch

`src/content/locale.ts` holds `LOCALE`, `'en'` by default. Set it to `'de'` and every text, label and the page's
`lang` switch to German; nothing else needs to change. Every per-language entry in `site.ts` exists in both
languages. Facts (the name, the address) are not text: they exist once.

Routes stay English in both languages. For a German path, rename the route folder under `src/app/`, then update its
`NAV` entry and its `PAGES` entry in `src/app/sitemap.ts`.

## Adding a page

1. A route folder under `src/app/`, e.g. `src/app/about/page.tsx`. The page renders
   `<main id="main" tabIndex={-1}>` (the skip link's target) with exactly one `h1`; the layout brings the header and
   footer and has no `main` of its own.
2. `export const metadata = { title, description }`, from text in `src/content/`; the layout adds `| <company>` to
   the title.
3. A `NAV` entry in `src/content/site.ts`, in both languages, if it belongs in the navigation. The home page's
   sections are `NAV` targets too (`/#services`, `/#about`, `/#contact`); point an entry at the new page instead
   when the page replaces a section.
4. Its path in `PAGES` in `src/app/sitemap.ts`. `src/app/pages.test.tsx` fails when a `NAV` entry points at a page
   the sitemap does not list.
5. Its text in both languages, next to the other text in `src/content/`.

## The design

The design comes from a Claude Design export: put it under `design/export/`, run `pnpm design:sync`, and build class
names with `cx` from the generated `src/design/catalog.ts`. `README.md`, "The design", has the steps and the four
`design:*` scripts. Until the first export, the header, footer and pages use Tailwind's neutral palette. Colours never
appear as literals outside `src/design/`: two guards refuse them.

## Growing with the kit

The website kit is a set of published templates (family `site`): sections, components, pages and the legal pages,
each proven on its own. Find them with `npx @trinity369/use search <words>`, read one with
`npx @trinity369/use info <slug>`, and install from this folder (the site's root), so the record of what was
installed (`.open-context.json`) stays with the site:

- **A component or a section** into its own folder:
  `npx @trinity369/use <slug> --dir src/components/<slug>`, then import it from `@/components/<slug>/…`.
- **A page** into its route: `npx @trinity369/use <slug> --dir src/app/<route>`. A page template brings its own
  `main#main` and `h1`, and a `content.ts` with its text in both languages and its own `LOCALE` line: set that line to
  this site's language. Then add the route to `PAGES` (and to `NAV` or the footer).
- **The legal pages**: `page-legal-imprint`, `page-legal-privacy` and `page-legal-terms`, for example
  `npx @trinity369/use page-legal-imprint --dir src/app/imprint`. Link them in `SiteFooter.tsx`.
- **Cookie consent**: `npx @trinity369/use site-cookie-consent --dir src/modules/site-cookie-consent`, before the
  first thing that loads from another host (see "Consent").

When most of these are needed (features, pricing, about, contact, a blog, the legal pages, consent), start from
`npx @trinity369/use starter-website` in an empty folder instead: it holds them all, assembled and proven together.

An installed template is a copy of a published one. Change it through its props and its `content.ts`; an edit inside
its files is lost the next time it is installed.

## Consent

As shipped, the site stores nothing and loads nothing from another host, so it needs no cookie banner. That changes
with the first map, video, font or script from another host, or the first statistics tool: install
`site-cookie-consent` first, mount its provider in `src/app/layout.tsx`, and put the embed inside its `ConsentGate`,
created in a client component (the module's `README.md` shows the pattern).

## Legal text

A site run from Germany or Austria needs an imprint and a privacy notice; most sites that sell need terms. The legal
page templates ship structure and placeholders (`[[…]]`, highlighted on the page), **not legal text**. The text must
come from the site's owner or their counsel; nothing in this site is legal advice, and a coding agent must not write
or fill it.

## Release

1. Set `SITE_URL` to the public origin, e.g. `SITE_URL=https://example.org pnpm build`. It is read at build time for
   `robots.txt`, `sitemap.xml` and absolute metadata URLs.
2. `pnpm build` writes a self-contained server to `.next/standalone` (the `postbuild` script copies `.next/static`
   and `public/` into it).
3. `pnpm start` runs it (`node .next/standalone/server.js`); `PORT` and `HOSTNAME` in the environment set where it
   listens. Copy `.next/standalone` to any host with Node 22 and run it there behind HTTPS (a reverse proxy, or a
   platform that terminates TLS). A platform that builds Next itself needs only `SITE_URL` set.

`next start` does not serve the standalone output; use `pnpm start`.

## What each guard test protects

| Test | Protects |
|---|---|
| `src/app/pages.test.tsx` | in both languages: the home page has one `h1` and a section for every `NAV` anchor; the not-found page has one `h1`, a way home and every `NAV` link; both render `main#main`; the header's first link is the skip link; every `NAV` page is in the sitemap |
| `src/content/claims.test.ts` | no source file or static page states a `FORBIDDEN` phrase, however it is wrapped |
| `src/design/no-hardcoded-colour.test.ts` | no colour literal outside `src/design/` (colours come from the design tokens) |
| `pnpm design:check`, `pnpm design:guards` | the generated design files match the export; no colour literal, unknown wrapper class or hand-written vendor prefix |
| `pnpm typecheck` | the whole site type-checks strictly |
