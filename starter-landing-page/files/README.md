# starter-landing-page

A company landing page, ready to fill in: Next 16 · React 19 · Tailwind 4 (without preflight) · strict TypeScript ·
Vitest. It is assembled from the website kit's templates: a header with a mobile menu and a skip link, a footer, a
cookie banner that asks before anything non-essential is stored or loaded, structured data for search, eight page
sections, an imprint, a privacy notice, terms, and the not-found and error pages. Guard tests keep facts in one place,
colours in the design tokens and legal placeholders out of a live site. `next build` writes a self-contained server
to `.next/standalone`.

The sample company "Samplework Inc.", its address and phone number are invented: replace them in
`src/content/site.ts`. The text is English; set `LOCALE` in `src/content/locale.ts` to `'de'` for the German set.
**Read `AGENTS.md` before you change pages, facts or legal text** (it is written for you and for a coding agent).

```
pnpm install
pnpm dev                    # local development server
pnpm test && pnpm lint      # design:check, design:guards, typecheck, vitest; eslint
pnpm build && pnpm start    # starts .next/standalone/server.js (PORT, HOSTNAME from the environment)
```

`pnpm build` assembles the standalone server: after `next build`, the `postbuild` script
(`scripts/assemble-standalone.mjs`) copies `.next/static` and `public/` into `.next/standalone`, so `pnpm start`
serves the styled site and the folder can be copied to a server as it is.

## What it is made of

Each folder below is a published template, copied in byte for byte at the version shown. Your own code (the
"glue") is everything else: the layout, the home page, the route files, the content and the tests.

| Folder | Template | Version |
|---|---|---|
| `src/components/site-header` | `site-header` | 1.0.0 |
| `src/components/site-footer` | `site-footer` | 1.0.0 |
| `src/modules/site-cookie-consent` | `site-cookie-consent` | 1.0.0 |
| `src/utils/site-seo` | `site-seo` | 1.0.0 |
| `src/components/section-hero` | `section-hero` | 2.0.0 |
| `src/components/section-logo-cloud` | `section-logo-cloud` | 2.0.0 |
| `src/components/section-features` | `section-features` | 2.0.0 |
| `src/components/section-stats` | `section-stats` | 2.0.0 |
| `src/components/section-testimonials` | `section-testimonials` | 2.0.0 |
| `src/components/section-pricing` | `section-pricing` | 2.0.0 |
| `src/components/section-faq` | `section-faq` | 2.0.0 |
| `src/components/section-cta` | `section-cta` | 2.0.0 |
| `src/app/_page-legal-imprint` | `page-legal-imprint` | 1.0.0 |
| `src/app/_page-legal-privacy` | `page-legal-privacy` | 1.0.0 |
| `src/app/_page-legal-terms` | `page-legal-terms` | 1.0.0 |
| `src/app/_page-404-error` | `page-404-error` | 1.0.0 |

Each folder has its own `README.md` with its props, labels and keyboard behaviour. Folders starting with `_` are
private to Next: they hold views, not routes. The routes are `src/app/page.tsx` (home), `imprint/`, `privacy/`,
`terms/`, `not-found.tsx` and `error.tsx`.

## Pages

| Path | What | Text in |
|---|---|---|
| `/` | hero, logos, features, figures, testimonials, pricing, questions, call to action | `src/content/home.ts` |
| `/imprint` | provider identification, as placeholders | `src/app/_page-legal-imprint/content.ts` |
| `/privacy` | privacy notice: structure and placeholders | `src/app/_page-legal-privacy/content.ts` |
| `/terms` | terms: structure and placeholders | `src/app/_page-legal-terms/content.ts` |
| any other | the not-found page (HTTP 404) | `src/app/_page-404-error/content.ts` |

The legal pages ship structure and highlighted `[[…]]` placeholders, not legal text: the text must come from you or
your counsel. Once the site's URL is your own domain (`SITE.url`, or `SITE_URL` at build time), `pnpm build` refuses
to render a legal page that still shows a placeholder, and `pnpm test` fails while any is left, in either language.

## The design: from a Claude Design export to classes

The design pipeline is the one `site-starter` ships:

1. Put the export, unchanged, under `design/export/` (see `design/export/README.md`) and set `prefix` in
   `design-sync.config.json` to the class prefix your export uses.
2. `pnpm design:sync` writes `src/design/tokens.css`, `components.css` and `catalog.ts`. Commit them; never edit them
   by hand.
3. Uncomment the two `src/design/` imports in `src/app/globals.css` and map the colour tokens in its `@theme inline`
   block, so utilities like `bg-paper` read the tokens.
4. After your first `design:sync`, remove `|| echo "no export yet"` from `design:check` in `package.json`, so a stale
   generated file fails the tests.

Until then every part uses Tailwind's neutral palette, so the site looks plain but complete.

## Going live

1. Replace the facts in `src/content/site.ts` (with `SITE.url` your domain, or `SITE_URL` set at build time) and
   the sample text in `src/content/home.ts`.
2. Have the legal pages' text written. With your domain set, `pnpm test` names every legal file that still holds a
   placeholder (in either language), and `pnpm build` stops at the first legal page that would show one.
3. `pnpm build`, then copy `.next/standalone` to the server and run `node server.js` there (`PORT`, `HOSTNAME` from
   the environment). `next start` does not serve the standalone output; use `pnpm start` locally.
