# starter-portfolio

A portfolio site, ready to fill in: Next 16 · React 19 · Tailwind 4 (without preflight) · strict TypeScript · Vitest. It
is assembled from the website kit's templates: a home page with the newest projects, the work (projects written as MDX
files, sorted into disciplines, a page each), services with questions, about (story, values, figures, team), a contact
form, a blog with MDX posts, authors, categories and RSS and Atom feeds, a sitemap, a cookie banner that asks before
anything non-essential is stored or loaded, an imprint, a privacy notice, terms, and the not-found and error pages, all
reading one set of design tokens that a design system made on claude.ai sets. Guard tests keep facts in one place,
styling in the design tokens, drafts off the site and legal placeholders out of a live site. `next build` writes a
self-contained server to `.next/standalone`.

The sample studio "Samplework Inc.", its people, projects and posts are invented: replace the facts in
`src/content/site.ts`, the page text in `src/content/`, the projects in `content/work/en/` and the posts in
`content/blog/en/`. The text is English; set `LOCALE` in `src/content/locale.ts` to `'de'` for the German set. **Read
`AGENTS.md` before you change pages, projects, posts, facts or legal text** (it is written for you and for a coding
agent).

```
pnpm install
pnpm dev                    # local development server; edits to projects and posts show on reload
pnpm test && pnpm lint      # design:check, design:guards, typecheck, vitest; eslint
pnpm build && pnpm start    # starts .next/standalone/server.js (PORT, HOSTNAME from the environment)
```

`pnpm build` assembles the standalone server: after `next build`, the `postbuild` script
(`scripts/assemble-standalone.mjs`) copies `.next/static` and `public/` into `.next/standalone`, so `pnpm start`
serves the styled site and the folder can be copied to a server as it is. Every page but the contact page is built
ahead; a new project or post appears at the next build.

## Where projects live

```
content/work/en/
  posts/<slug>.mdx      one file per project; its name is its address, /work/<slug>
  authors.yaml          the people who work on the projects (their names show on each project)
  categories.yaml       the disciplines (a page each at /work/category/<id>, once it has a project)
public/work/            the projects' covers
```

A project is written like a blog post, read by the same loader: `content/work/en/posts/project-template.mdx` is a draft
that shows every setting and where the client, your part and the links go. It never appears on the site.

## Pages

| Path | What | Text in |
|---|---|---|
| `/` | hero, the three newest projects, logos, testimonials, a call to action | `src/content/home.ts` |
| `/work` | every project, newest first, with a discipline filter | `src/content/work.ts` |
| `/work/<slug>` | one project | `content/work/<locale>/posts/<slug>.mdx` |
| `/work/category/<id>` | one discipline's projects | `content/work/<locale>/categories.yaml` |
| `/services` | groups of services and questions | `src/content/pages.ts` (`SERVICES_PAGE`) |
| `/about` | story, values, figures, team | `src/content/pages.ts` (`ABOUT_PAGE`) |
| `/contact` | the contact form, email, phone, address and a map link | `src/content/pages.ts` (`CONTACT_PAGE`), facts in `site.ts` |
| `/blog`, `/blog/page/<n>` | every post, nine per page, with a category filter | `src/content/blog.ts` |
| `/blog/<slug>` | one post | `content/blog/<locale>/posts/<slug>.mdx` |
| `/blog/author/<id>`, `/blog/category/<id>` | an author's or a category's posts | `content/blog/<locale>/authors.yaml`, `categories.yaml` |
| `/feed.xml`, `/atom.xml` | the RSS and Atom feeds (posts only) | the posts |
| `/imprint`, `/privacy`, `/terms` | the legal pages: structure and placeholders | `src/app/_page-legal-*/content.ts` |
| any other | the not-found page (HTTP 404) | `src/app/_page-404-error/content.ts` |

The legal pages ship structure and highlighted `[[…]]` placeholders, not legal text: the text must come from you or
your counsel. Once the site's URL is your own domain (`SITE.url`, or `SITE_URL` at build time), `pnpm build` refuses
to render a legal page that still shows a placeholder, and `pnpm test` fails while any is left, in either language.

## What it is made of

Each folder below is a published template, copied in byte for byte at the version shown. Your own code (the
"glue") is everything else: the layout, the page and work views and routes, the feeds, the content and the tests.

| Folder | Template | Version |
|---|---|---|
| `src/design-system/design-tokens` | `design-tokens` | 2.0.0 |
| `src/components/site-header` | `site-header` | 2.0.0 |
| `src/components/site-footer` | `site-footer` | 2.0.0 |
| `src/modules/site-cookie-consent` | `site-cookie-consent` | 2.0.0 |
| `src/utils/site-seo` | `site-seo` | 1.0.0 |
| `src/components/component-pagination` | `component-pagination` | 2.0.0 |
| `src/components/component-breadcrumbs` | `component-breadcrumbs` | 2.0.0 |
| `src/components/section-hero` | `section-hero` | 3.0.0 |
| `src/components/section-logo-cloud` | `section-logo-cloud` | 3.0.0 |
| `src/components/section-features` | `section-features` | 3.0.0 |
| `src/components/section-stats` | `section-stats` | 3.0.0 |
| `src/components/section-testimonials` | `section-testimonials` | 3.0.0 |
| `src/components/section-faq` | `section-faq` | 3.0.0 |
| `src/components/section-cta` | `section-cta` | 3.0.0 |
| `src/utils/blog-content` | `blog-content` | 2.0.0 |
| `src/utils/blog-rss-sitemap` | `blog-rss-sitemap` | 1.0.0 |
| `src/components/blog-card` | `blog-card` | 2.0.0 |
| `src/components/blog-newsletter-cta` | `blog-newsletter-cta` | 2.0.0 |
| `src/components/blog-share-buttons` | `blog-share-buttons` | 3.0.0 |
| `src/app/_page-contact` | `page-contact` | 2.0.0 |
| `src/app/_page-legal-imprint` | `page-legal-imprint` | 2.0.0 |
| `src/app/_page-legal-privacy` | `page-legal-privacy` | 2.0.0 |
| `src/app/_page-legal-terms` | `page-legal-terms` | 2.0.0 |
| `src/app/_page-404-error` | `page-404-error` | 2.0.0 |

Each folder has its own `README.md` with its props, labels and keyboard behaviour; a part with layouts also lists them
(its `layout` prop: `<SiteFooter layout="minimal" …>`), and the site uses each one's default but where a page names
another (`layout="rows"` for the service groups, `layout="sticky"` for the newsletter beside a post). Folders starting
with `_` are private to Next: they hold views, not routes.

## The contact form and the newsletter

Both forms work without JavaScript and never put what was typed in a URL, but as shipped they send nothing anywhere:

- **Contact:** replace `deliver()` in `src/app/_page-contact/deliver.ts` with your email service, database or help
  desk. Until then a production build answers every message with "could not be sent" and keeps what was typed, so no
  message is silently dropped.
- **Newsletter** (beside every post): replace `subscribe()` in `src/content/subscribe.ts` with a call to your
  newsletter provider. Until then a production build answers every signup with "That did not work".

## The design: from a claude.ai design system to every part

The `design-system-seed` skill (`npx @trinity369/use design-system-seed`) walks an agent through these steps; this
site already holds `design-tokens`, its config and the imports, so only the export, the map and the sync are left.

1. Put the export, unchanged, under `design/export/` (see `design/export/README.md`).
2. Copy `src/design-system/design-tokens/oc-map.example.json` to `design/oc-map.json` and write the map: for every
   contract token, the design's token that plays its role (read the `usage` notes on both sides; `null` only where
   the design has no such role). `src/design-system/design-tokens/README.md` has the contract's table.
3. `pnpm design:sync` checks the map and that every text stays readable on its ground in every theme, then writes
   `src/design-system/generated/tokens.css` (the design's variables and the `--oc-*` tokens), `components.css` and
   `catalog.ts`, plus fonts under `public/fonts` and brand SVGs under `public/brand`. Commit them; never edit them by
   hand. `src/app/globals.css` already imports them, so every part and the site's own code take the design at once.
4. The design's first theme is the default; another applies inside `data-theme="<theme id>"` (on `<html>` for the
   whole site).
5. To use the export's own components as well, set `prefix` in `design-sync.config.json` to the class prefix its
   `bundle.css` uses (`ds-` is a placeholder), name the components you approved in an `approved` list there, write
   thin wrappers in `src/components/ui/` and build class names with `cx` from `src/design-system/generated/catalog.ts`.
6. After a new export: `pnpm design:sync`, then `pnpm design:diff` lists the classes that were added or removed
   and the wrappers that still use a removed one.

| script | what it does |
|---|---|
| `design:sync` | checks the map and the contrast, then writes the generated files from the export |
| `design:check` | fails when the generated files differ from a fresh run; before the first export there is nothing to check, and it passes |
| `design:diff` | lists classes added/removed since the committed catalog, and the wrappers they hit |
| `design:guards` | fails on a colour literal, an unknown wrapper class or a hand-written vendor prefix under `src/` |

Each runs `node src/design-system/design-tokens/design-sync.mjs --config design-sync.config.json` (with `--check`,
`--diff` or `--guards`). `design-sync.mjs` belongs to the `design-tokens` part: update it by installing a newer
`design-tokens`, never by editing it.

## Going live

1. Replace the facts in `src/content/site.ts` (with `SITE.url` your domain, or `SITE_URL` set at build time), the
   page text in `src/content/home.ts`, `pages.ts`, `work.ts` and `blog.ts`, and the sample projects in
   `content/work/` and posts in `content/blog/`.
2. Connect the contact form (`deliver()`) and the newsletter (`subscribe()`), or remove the signup (AGENTS.md says
   how).
3. Have the legal pages' text written. With your domain set, `pnpm test` names every legal file that still holds a
   placeholder (in either language), and `pnpm build` stops at the first legal page that would show one.
4. `pnpm build`, then copy `.next/standalone` to the server and run `node server.js` there (`PORT`, `HOSTNAME` from
   the environment). `next start` does not serve the standalone output; use `pnpm start` locally.
