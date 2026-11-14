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

To build it from sections, import them from `src/components/section-*` as `src/components/home-page.tsx` does; each
section's `README.md` lists its content shape.

## Parts

These folders are published templates, copied in unchanged at the version shown. Do not edit them in place: an edit
is lost the next time the template is installed, and it is no longer the proven template.

| Folder | Template | Version |
|---|---|---|
| `src/components/site-header` | `site-header` | 1.0.0 |
| `src/components/site-footer` | `site-footer` | 1.0.0 |
| `src/modules/site-cookie-consent` | `site-cookie-consent` | 1.0.0 |
| `src/utils/site-seo` | `site-seo` | 1.0.0 |
| `src/components/section-<name>` (hero, logo-cloud, features, stats, testimonials, pricing, faq, cta) | `section-<name>` | 2.0.0 |
| `src/app/_page-legal-imprint` | `page-legal-imprint` | 1.0.0 |
| `src/app/_page-legal-privacy` | `page-legal-privacy` | 1.0.0 |
| `src/app/_page-legal-terms` | `page-legal-terms` | 1.0.0 |
| `src/app/_page-404-error` | `page-404-error` | 1.0.0 |

The exception is a part's `content.ts`: the legal pages' and the not-found page's text is yours to replace there.

To change a part's behaviour, change it through its props, labels and content from your own code first. If that is
not enough, the change belongs in the template: change it there, then install it again into its folder, e.g.
`npx @trinity369/use section-hero --dir src/components/section-hero`. An install overwrites the folder's files, so
save a legal or not-found part's `content.ts` first and put it back after. Folders starting with `_` are private to Next:
they hold views, and the short route files (`src/app/imprint/page.tsx`, `not-found.tsx`, `error.tsx`, …) render them
with `LOCALE`.

## Consent: nothing from another host before a choice

The cookie banner (`src/modules/site-cookie-consent`, mounted in `src/app/layout.tsx`) shows until the visitor
chooses. Until then nothing non-essential is stored and nothing is requested from another host. The choice lives in
one first-party cookie, `site_consent`; the footer's "Cookie settings" button opens the choice again.

- **Anything that loads from another host** (a map, a video, a font or script from a CDN) goes inside
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
| `src/design/no-hardcoded-colour.test.ts` | no colour literal outside `src/design/` (colours come from the design tokens) |
| `pnpm design:check`, `pnpm design:guards` | the generated design files match the export; no colour literal, unknown wrapper class or hand-written vendor prefix |
| `pnpm typecheck` | the whole site, parts included, type-checks strictly |
