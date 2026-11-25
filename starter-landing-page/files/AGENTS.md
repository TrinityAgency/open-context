# AGENTS.md: how this site is put together

For whoever changes this site next, a person or a coding agent. Read it before changing pages, facts or legal text.
Run `pnpm test && pnpm lint` after every change; both must pass.

## Where facts and text live

- **`src/content/site.ts`**: the facts, once. `SITE` (name, description, `url`), `CONTACT` (email, phone, address),
  and per language: `NAV` (main navigation), `CTA` (the header's button), `FOOTER_COLUMNS`, `LEGAL` (the footer's legal
  links), `CONSENT_CATEGORIES` (what the cookie banner asks for). `FORBIDDEN` lists phrases that must appear nowhere.
- **`src/content/home.ts`**: the home page's text, per language, one entry per section.
- **A part's `content.ts`**: the legal pages' and the not-found page's text (see "Parts" below).

Pages and components read these; they never copy a fact. `SITE_URL` in the environment overrides `SITE.url`.

## The language switch

`src/content/locale.ts` holds `LOCALE`, `'en'` by default. Set it to `'de'` and every text, label, date and number
format and the page's `lang` switch to German; nothing else needs to change. Every entry in `site.ts` and `home.ts`
exists in both languages, and every part ships both label sets.

Routes stay English in both languages (`/imprint`, `/privacy`, `/terms`). For German paths, rename the route folders
under `src/app/` (for example `imprint` to `impressum`), then update the hrefs in `NAV`, `LEGAL`, `FOOTER_COLUMNS` and
`CTA`, the `PAGES` list in `src/app/sitemap.ts`, and the links in `src/app/_page-404-error/content.ts`.
`pnpm test` fails until the links and the sitemap agree.

## Adding a page

1. A route folder under `src/app/`, e.g. `src/app/services/page.tsx`. The page renders
   `<main id="main" tabIndex={-1}>` (the skip link's target) with exactly one `h1`; the layout brings the header and
   footer.
2. `export const metadata` with its own `title` and `description` (the layout adds `| <company>` to the title).
3. A `NAV` entry in `src/content/site.ts`, in both languages, if it belongs in the navigation.
4. Its path in `PAGES` in `src/app/sitemap.ts`. `src/app/pages.test.tsx` fails when a `NAV`, `CTA`, `LEGAL` or footer
   link points at a route the sitemap does not list.
5. Its text in both languages, next to the other content in `src/content/`.
6. Its route in the `route modules` list of `src/app/pages.test.tsx`, which renders every route inside the
   consent provider, as the layout does.

To build it from sections, import them into the route file from `src/components/section-*` (as
`src/components/home-page.tsx` imports them); each section's `README.md` lists its content shape.

A page of your own that arranges parts is this route file alone: its default export renders `main` with the parts,
their text from `src/content/`, and nothing else of yours (no view component, no helper; see "Growing with the kit").

## Parts

These folders are published templates, copied in unchanged at the version shown. Do not edit them in place: an edit
is lost the next time the template is installed, and it is no longer the proven template.

| Folder | Template | Version |
|---|---|---|
| `src/design-system/design-tokens` | `design-tokens` | 2.1.0 |
| `src/components/site-header` | `site-header` | 2.0.0 |
| `src/components/site-footer` | `site-footer` | 2.0.0 |
| `src/modules/site-cookie-consent` | `site-cookie-consent` | 2.1.0 |
| `src/utils/site-seo` | `site-seo` | 1.0.0 |
| `src/components/section-<name>` (hero, logo-cloud, features, stats, testimonials, pricing, cta) | `section-<name>` | 3.0.0 |
| `src/components/section-faq` | `section-faq` | 3.0.1 |
| `src/app/_page-legal-imprint` | `page-legal-imprint` | 2.0.0 |
| `src/app/_page-legal-privacy` | `page-legal-privacy` | 2.0.0 |
| `src/app/_page-legal-terms` | `page-legal-terms` | 2.0.0 |
| `src/app/_page-404-error` | `page-404-error` | 2.0.0 |

The exception is a part's `content.ts`: the legal pages' and the not-found page's text is yours to replace there.

To change a part's behaviour, change it through its props (its `layout` among them: each section's `README.md` lists
its layouts), labels and content from your own code first. If that is not enough, the change belongs in the template:
change it there, then install it again into its folder, e.g.
`npx @trinity369/use section-hero --dir src/components/section-hero`. An install overwrites the folder's files, so
save a legal or not-found part's `content.ts` first and put it back after. Folders starting with `_` are private to Next:
they hold views, and the short route files (`src/app/imprint/page.tsx`, `not-found.tsx`, `error.tsx`, …) render them
with `LOCALE`.

## Growing with the kit

The website kit is a set of published templates (family `site`): sections, components, pages and the legal pages,
each proven on its own; the folders under "Parts" are some of them. Find more with
`npx @trinity369/use search <words>`, read one with `npx @trinity369/use info <slug>`, and install from this folder
(the site's root), so the record of what was installed (`.open-context.json`) stays with the site:

- **A component or a section** into its own folder:
  `npx @trinity369/use <slug> --dir src/components/<slug>`, then import it from `@/components/<slug>/…`. The
  sections a company site most often adds install this way: `section-team`, `section-process`,
  `section-references`, `section-gallery`, `section-location` (address, hours and a map) and `section-video`. The
  map and the video are embeds: see "Consent".
- **The two pieces of chrome** go in `src/app/layout.tsx`, after installing each into `src/components/<slug>`, both
  inside `ConsentProvider`: `site-announcement-bar` right after `<Header … />`, and `site-call-button` right after
  `<SiteFooter … />`. While the cookie banner is up the call button is not drawn; it appears once the visitor has
  chosen.
- **A page** into its route: `npx @trinity369/use <slug> --dir src/app/<route>`. A page template brings its own
  `main#main` and `h1`, and a `content.ts` with its text in both languages and its own `LOCALE` line: set that line to
  this site's language. Then add it as "Adding a page" says. One exception: `page-coming-soon` says `noindex`, so it is
  never added to `PAGES` and never linked from `NAV` or the footer (to make it the whole site until launch, render it
  from `src/app/page.tsx`; its `README.md` says how).

An installed template is a copy of a published one. Change it through its props (its `layout` among them) and its
`content.ts`; an edit inside its files is lost the next time it is installed. Every part reads the design tokens, so
it takes the connected design without being edited. Add each new folder to the table under "Parts", with its
template and version.

**Arranging is all a site writes**, as the kit is proven: the owner's text and facts in `src/content/`, each entry
written out (no helper that builds entries), pictures in `public/`, the parts' props and their order on a page, and the
route, metadata, navigation, sitemap and test-list entries a new page needs. Nothing else is written: no component,
function, hook, event handler, `'use client'` file or test of your own (the starter's views and tests are its own glue).
Where the owner asks for something no part's props give, such as an announcement that ends by itself on a date, leave it
to the owner (the bar's line is removed when it is over) and say so: a part that is missing is a question for the kit,
not code in the site.

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

## Consent: nothing from another host before a choice

The cookie banner (`src/modules/site-cookie-consent`, mounted in `src/app/layout.tsx`) shows until the visitor
chooses. Until then nothing non-essential is stored and nothing is requested from another host. The choice lives in
one first-party cookie, `site_consent`; the footer's "Cookie settings" button opens the choice again.

- **A kit part that embeds** (`section-location`'s map, `section-video`'s player) takes the gate as a prop: pass
  `Gate={ConsentGate}` (from `@/modules/site-cookie-consent`) from any page, a server page included, and it loads
  the embed only once the visitor allows its category (`category`, `"media"` unless you pass another; it must be one
  of `CONSENT_CATEGORIES`). It needs no client component of yours. Without `Gate` it never embeds: it links to the
  map or the video instead.
- **Any other embed from another host** (a map, a video, a font or script from a CDN) goes inside
  `<ConsentGate category="media" fallback={…}>`, **created in a client component** (`'use client'`). React's server
  renderer preloads every `<img>` and `<link>` it renders, even inside a gate that is still closed, so a gated embed
  written in a server component is requested before consent. The module's `README.md` shows the pattern.
- **A new kind of use** (statistics, say) is a new entry in `CONSENT_CATEGORIES`, in both languages. Changing the list
  asks every visitor again.
- **A site that never stores anything and never loads from another host** needs no banner: remove `ConsentProvider`
  from `src/app/layout.tsx` (keep its children), drop `cookieSettings` from `SiteFooter`, and delete
  `src/modules/site-cookie-consent` and `CONSENT_CATEGORIES`. Add them back before the first embed.

## Legal text

The imprint, privacy notice and terms ship **structure and placeholders, not legal text**. Every `[[…]]` in their
`content.ts` is a placeholder, highlighted on the page until replaced. The text must come from the site's owner or
their counsel; nothing in these files is legal advice, and a coding agent must not write it.

While the site's URL is `https://example.com` (the sample), nothing complains about placeholders. Once it is your
domain (`SITE.url`, or `SITE_URL` as the build reads it):

- `pnpm build` refuses to render a legal page whose text in `LOCALE` still holds a `[[…]]`
  (`src/content/legal-guard.ts`, called by the three legal route files), so an unfinished imprint never goes live.
- `src/content/claims.test.ts` fails and names every legal `content.ts` that still holds one. It reads both
  languages: a site in one language also replaces the other language's placeholders (with its own text or a copy).

## What each guard test protects

| Test | Protects |
|---|---|
| `src/app/pages.test.tsx` | the home page has one `h1` and a target for every navigation anchor and in-page link, in both languages; every linked route is in the sitemap; the legal and not-found pages render `main#main` with one `h1` |
| `src/content/claims.test.ts` | no source file states a `FORBIDDEN` phrase, however it is wrapped; no legal placeholder is left once the site has its own domain |
| `src/content/legal-guard.test.ts` | the build-time guard: legal placeholders render on the sample domain only |
| `src/design-system/tokens-only.test.ts` | the classes in every file under `src/` but the generated design files, the tests and the copy (`src/content/`, a part's `content.ts` and `labels`): no palette, white or black colour class, no radius from Tailwind's scale, no `font-sans` or `font-serif`, no radius, font or variable in brackets but a token (a step of `--oc-radius`, a weight or a contract font, an `--oc-*` variable); design-sync's guards report nothing |
| `pnpm design:check`, `pnpm design:guards` | the generated design files match the export (before the first export there is nothing to check); no colour literal, unknown wrapper class or hand-written vendor prefix under `src/`, and no wrapper over the design's component classes without an `approved` list in `design-sync.config.json` |
| `pnpm typecheck` | the whole site, parts included, type-checks strictly |
