# AGENTS.md: how this site is put together

For whoever changes this site next, a person or a coding agent. Read it before changing pages, facts or the design.
Run `pnpm test && pnpm lint` after every change; both must pass.

This is the lean skeleton: a home page, a not-found page, a header, a footer and the design tokens. It grows by adding
pages and by installing templates from the website kit (see "Growing with the kit").

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

A page of your own that arranges parts is this route file alone: its default export renders `main` with the parts,
their text from `src/content/`, and nothing else of yours (no view component, no helper; see "Growing with the kit").

## The design

The site's colours, fonts and corners are the design tokens every Open Context part reads (`--oc-surface`,
`--oc-ink`, `--oc-brand`, … `--oc-radius`). `src/design-system/design-tokens/` (the `design-tokens` template, a part
of this site) defines them with neutral defaults; a connected design sets them in `src/design-system/generated/`.

- **Connect a design system** made on claude.ai with the `design-system-seed` skill
  (`npx @trinity369/use design-system-seed`): put the export, unchanged, under `design/export/`, copy
  `src/design-system/design-tokens/oc-map.example.json` to `design/oc-map.json` and map every contract token to the
  design's token that plays its role (`null` where the design has none), then run `pnpm design:sync`. It checks the
  map and that every text stays readable on its ground before it writes anything; a refusal names the pair, the theme
  and both colours, and is a question for whoever owns the design, never a reason to bend the map. This site already
  holds `design-tokens`, its config (`design-sync.config.json`) and the imports in `src/app/globals.css`, so the
  skill's install and loading steps are done.
- **The site's own code** names tokens with `design-tokens`' utilities: `bg-oc-surface`, `text-oc-ink`,
  `border-oc-line`, `rounded-oc-lg`, `font-oc-heading` (its `README.md` lists them all). Never a colour literal, a
  grey or other palette class, a radius from Tailwind's scale, `font-sans`, or a radius, font or variable in brackets
  that is no token (`rounded-[6px]`, `font-[Georgia]`, `bg-[var(--color-neutral-100)]`): `pnpm design:guards`
  refuses the colour literal, `src/design-system/tokens-only.test.ts` the rest, and `pnpm test` runs both.
- **Structure** is chosen with each installed part's `layout` prop (`layout="split"`, …); the part's `README.md`
  lists its layouts and what each draws. A part is never restyled with classes.
- **The design's own components** are optional. Wrappers in `src/components/ui/` that use the export's component
  classes need an `approved` list in `design-sync.config.json` (the components you agreed to use): `pnpm design:guards`
  refuses such a wrapper while the list is missing, and a class whose component is not on it. `README.md`, "The
  design", step 5, has the steps.
- **Never edit `src/design-system/generated/`**: `pnpm design:sync` writes it. To change the design, change it in
  Claude Design, export it again over `design/export/`, run `pnpm design:sync`, then `pnpm design:diff`.
  `README.md`, "The design", has the steps and the four `design:*` scripts.
- **Updating `design-tokens`**: install a newer one over its folder
  (`npx @trinity369/use design-tokens --dir src/design-system/design-tokens`), never edit it. Once a design is
  connected, the generated files change once after an update: `pnpm design:check` reports all three (`tokens.css`,
  `components.css`, `catalog.ts`) out of date until `pnpm design:sync` writes them again; commit what it writes.

## Growing with the kit

The website kit is a set of published templates (family `site`): sections, components, pages and the legal pages,
each proven on its own. Find them with `npx @trinity369/use search <words>`, read one with
`npx @trinity369/use info <slug>`, and install from this folder (the site's root), so the record of what was
installed (`.open-context.json`) stays with the site:

- **A component or a section** into its own folder:
  `npx @trinity369/use <slug> --dir src/components/<slug>`, then import it from `@/components/<slug>/…`. The
  sections a company site most often adds install this way: `section-team`, `section-process`,
  `section-references`, `section-gallery`, `section-location` (address, hours and a map) and `section-video`. The
  map and the video are embeds: see "Consent".
- **The two pieces of chrome** go in `src/app/layout.tsx`, after installing each into `src/components/<slug>`:
  `site-announcement-bar` right after `SiteHeader`, and `site-call-button` last in `<body>`, after `SiteFooter`.
- **A page** into its route: `npx @trinity369/use <slug> --dir src/app/<route>`. A page template brings its own
  `main#main` and `h1`, and a `content.ts` with its text in both languages and its own `LOCALE` line: set that line to
  this site's language. Then add the route to `PAGES` (and to `NAV` or the footer). One exception:
  `page-coming-soon` says `noindex`, so it is never added to `PAGES` and never linked from `NAV` or the footer (to
  make it the whole site until launch, render it from `src/app/page.tsx`; its `README.md` says how).
- **The legal pages**: `page-legal-imprint`, `page-legal-privacy` and `page-legal-terms`, for example
  `npx @trinity369/use page-legal-imprint --dir src/app/imprint`. Link them in `SiteFooter.tsx`.
- **Cookie consent**: `npx @trinity369/use site-cookie-consent --dir src/modules/site-cookie-consent`, before the
  first thing that loads from another host (see "Consent").

When most of these are needed (features, pricing, about, contact, a blog, the legal pages, consent), start from
`npx @trinity369/use starter-website` in an empty folder instead: it holds them all, assembled and proven together.

An installed template is a copy of a published one. Change it through its props (its `layout` among them) and its
`content.ts`; an edit inside its files is lost the next time it is installed. Every part reads the design tokens, so
it takes the connected design without being edited.

**Arranging is all a site writes**, as the kit is proven: the owner's text and facts in `src/content/`, each entry
written out (no helper that builds entries), pictures in `public/`, the parts' props and their order on a page, and the
route, metadata, navigation, sitemap and test-list entries a new page needs. Nothing else is written: no component,
function, hook, event handler, `'use client'` file or test of your own (the starter's views and tests are its own glue).
Where the owner asks for something no part's props give, such as an announcement that ends by itself on a date, leave it
to the owner (the bar's line is removed when it is over) and say so: a part that is missing is a question for the kit,
not code in the site.

## Consent

As shipped, the site stores nothing and loads nothing from another host, so it needs no cookie banner. That changes
with the first map, video, font or script from another host, or the first statistics tool: install
`site-cookie-consent` first and mount its provider in `src/app/layout.tsx`, with a `media` category for maps and
videos (the module's `README.md` shows both).

- **A kit part that embeds** (`section-location`'s map, `section-video`'s player) takes the gate as a prop: pass
  `Gate={ConsentGate}` from any page, a server page included, and it loads the embed only once the visitor allows its
  category (`category`, `"media"` unless you pass another; the provider's categories must include it). It needs no
  client component of yours. Without `Gate` it never embeds: it links to the map or the video instead.
- **An embed of the site's own** (any other map, video, font or script from another host) goes inside
  `<ConsentGate category="media" fallback={…}>`, created in a client component (`'use client'`): React's server
  renderer preloads every `<img>` and `<link>` it renders, even inside a gate that is still closed. The module's
  `README.md` shows the pattern.

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
| `src/design-system/tokens-only.test.ts` | the classes in every file under `src/` but the generated design files, the tests and the copy (`src/content/`, a part's `content.ts` and `labels`): no palette, white or black colour class, no radius from Tailwind's scale, no `font-sans` or `font-serif`, no radius, font or variable in brackets but a token (a step of `--oc-radius`, a weight or a contract font, an `--oc-*` variable); design-sync's guards report nothing |
| `pnpm design:check`, `pnpm design:guards` | the generated design files match the export (before the first export there is nothing to check); no colour literal, unknown wrapper class or hand-written vendor prefix under `src/`, and no wrapper over the design's component classes without an `approved` list in `design-sync.config.json` |
| `pnpm typecheck` | the whole site type-checks strictly |
