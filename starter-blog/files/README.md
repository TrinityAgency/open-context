# starter-blog

A blog, ready to write in: Next 16 · React 19 · Tailwind 4 (without preflight) · strict TypeScript · Vitest. Posts are
MDX files with a few lines of settings at the top, in `content/blog/`; the site reads them at build time, so there is no
database and no CMS. It is assembled from the website kit's templates: a home page with the newest posts, the blog index
with a category filter and pages, a page per post (table of contents, reading progress, share links, related posts,
structured data), author and category pages, RSS and Atom feeds, a sitemap, a newsletter signup, a cookie banner that
asks before anything non-essential is stored or loaded, an imprint, a privacy notice, terms, and the not-found and error
pages, all reading one set of design tokens that a design system made on claude.ai sets. Guard tests keep facts in one
place, styling in the design tokens, drafts off the site and legal placeholders out of a live site. `next build` writes
a self-contained server to `.next/standalone`.

The sample company "Samplework Inc.", its authors and posts are invented: replace the facts in `src/content/site.ts`
and the posts in `content/blog/en/`. The text is English; set `LOCALE` in `src/content/locale.ts` to `'de'` for the
German set (the German posts are in `content/blog/de/`). **Read `AGENTS.md` before you change pages, posts, facts or
legal text** (it is written for you and for a coding agent).

```
pnpm install
pnpm dev                    # local development server; edits to posts show on reload
pnpm test && pnpm lint      # design:check, design:guards, typecheck, vitest; eslint
pnpm build && pnpm start    # starts .next/standalone/server.js (PORT, HOSTNAME from the environment)
```

`pnpm build` assembles the standalone server: after `next build`, the `postbuild` script
(`scripts/assemble-standalone.mjs`) copies `.next/static` and `public/` into `.next/standalone`, so `pnpm start`
serves the styled site and the folder can be copied to a server as it is. Every blog page and both feeds are built
ahead: a new post appears at the next build.

## Where posts live

```
content/blog/en/
  posts/<slug>.mdx      one file per post; its name is its address, /blog/<slug>
  authors.yaml          the authors (a page each at /blog/author/<id>)
  categories.yaml       the categories (a page each at /blog/category/<id>)
public/blog/            the posts' images
```

`content/blog/en/posts/writing-a-post.mdx` is a draft that documents every setting; it never appears on the site.

## What it is made of

Each folder below is a published template, copied in byte for byte at the version shown. Your own code (the
"glue") is everything else: the layout, the home page, the blog views and routes, the feeds, the content and the
tests.

| Folder | Template | Version |
|---|---|---|
| `src/design-system/design-tokens` | `design-tokens` | 2.1.0 |
| `src/components/site-header` | `site-header` | 2.0.0 |
| `src/components/site-footer` | `site-footer` | 2.0.0 |
| `src/modules/site-cookie-consent` | `site-cookie-consent` | 2.1.0 |
| `src/utils/site-seo` | `site-seo` | 1.0.0 |
| `src/components/component-pagination` | `component-pagination` | 2.0.0 |
| `src/components/component-breadcrumbs` | `component-breadcrumbs` | 2.0.0 |
| `src/utils/blog-content` | `blog-content` | 2.0.0 |
| `src/utils/blog-rss-sitemap` | `blog-rss-sitemap` | 1.0.0 |
| `src/components/blog-card` | `blog-card` | 2.0.0 |
| `src/components/blog-newsletter-cta` | `blog-newsletter-cta` | 2.0.0 |
| `src/components/blog-share-buttons` | `blog-share-buttons` | 3.0.0 |
| `src/app/_page-legal-imprint` | `page-legal-imprint` | 2.0.0 |
| `src/app/_page-legal-privacy` | `page-legal-privacy` | 2.0.0 |
| `src/app/_page-legal-terms` | `page-legal-terms` | 2.0.0 |
| `src/app/_page-404-error` | `page-404-error` | 2.0.0 |

Each folder has its own `README.md` with its props, labels and keyboard behaviour; a part with layouts also lists them
(its `layout` prop: `<SiteFooter layout="minimal" …>`), and the site uses each one's default but where a page names
another (`layout="sticky"` for the newsletter beside a post). Folders starting with `_` are private to Next: they hold
views, not routes.

## Pages

| Path | What | Text in |
|---|---|---|
| `/` | title, the three newest posts, newsletter signup | `src/content/blog.ts` (`BLOG_TEXT`) |
| `/blog`, `/blog/page/<n>` | every post, nine per page, with a category filter | `src/content/blog.ts` |
| `/blog/<slug>` | one post | `content/blog/<locale>/posts/<slug>.mdx` |
| `/blog/author/<id>` | an author and their posts | `content/blog/<locale>/authors.yaml` |
| `/blog/category/<id>`, `…/page/<n>` | a category's posts | `content/blog/<locale>/categories.yaml` |
| `/feed.xml`, `/atom.xml` | the RSS and Atom feeds | the posts |
| `/imprint` | provider identification, as placeholders | `src/app/_page-legal-imprint/content.ts` |
| `/privacy` | privacy notice: structure and placeholders | `src/app/_page-legal-privacy/content.ts` |
| `/terms` | terms: structure and placeholders | `src/app/_page-legal-terms/content.ts` |
| any other | the not-found page (HTTP 404) | `src/app/_page-404-error/content.ts` |

The legal pages ship structure and highlighted `[[…]]` placeholders, not legal text: the text must come from you or
your counsel. Once the site's URL is your own domain (`SITE.url`, or `SITE_URL` at build time), `pnpm build` refuses
to render a legal page that still shows a placeholder, and `pnpm test` fails while any is left, in either language.

## The newsletter

The signup form works without JavaScript and never puts the address in a URL, but as shipped it sends the address
nowhere: replace `subscribe()` in `src/content/subscribe.ts` with a call to your newsletter provider. Until then a
production build answers every signup with "That did not work", so no visitor is told they subscribed.

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
   `pnpm design:guards` refuses a wrapper that uses those classes while the list is missing.
6. After a new export: `pnpm design:sync`, then `pnpm design:diff` lists the classes that were added or removed
   and the wrappers that still use a removed one.

| script | what it does |
|---|---|
| `design:sync` | checks the map and the contrast, then writes the generated files from the export |
| `design:check` | fails when the generated files differ from a fresh run; before the first export there is nothing to check, and it passes |
| `design:diff` | lists classes added/removed since the committed catalog, and the wrappers they hit |
| `design:guards` | fails on a colour literal, an unknown wrapper class or a hand-written vendor prefix under `src/`, and on wrappers over the design's component classes without an `approved` list |

Each runs `node src/design-system/design-tokens/design-sync.mjs --config design-sync.config.json` (with `--check`,
`--diff` or `--guards`). `design-sync.mjs` belongs to the `design-tokens` part: update it by installing a newer
`design-tokens`, never by editing it. Once a design is connected, the generated files change once after an update:
`pnpm design:check` reports all three out of date until `pnpm design:sync` writes them again.

## Going live

1. Replace the facts in `src/content/site.ts` (with `SITE.url` your domain, or `SITE_URL` set at build time), the
   text in `src/content/blog.ts`, and the sample posts, authors and categories in `content/blog/`.
2. Connect the newsletter (`src/content/subscribe.ts`), or remove the signup (AGENTS.md says how).
3. Have the legal pages' text written. With your domain set, `pnpm test` names every legal file that still holds a
   placeholder (in either language), and `pnpm build` stops at the first legal page that would show one.
4. `pnpm build`, then copy `.next/standalone` to the server and run `node server.js` there (`PORT`, `HOSTNAME` from
   the environment). `next start` does not serve the standalone output; use `pnpm start` locally.
