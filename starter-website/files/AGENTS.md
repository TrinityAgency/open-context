# AGENTS.md: how this site is put together

For whoever changes this site next, a person or a coding agent. Read it before changing pages, posts, facts or legal
text. Run `pnpm test && pnpm lint` after every change; both must pass.

## Where facts and text live

- **`src/content/site.ts`**: the facts, once. `SITE` (name, description, `url`), `CONTACT` (email, phone, address),
  and per language: `NAV` (main navigation), `CTA` (the header's button), `FOOTER_COLUMNS`, `LEGAL` (the footer's legal
  links), `CONSENT_CATEGORIES` (what the cookie banner asks for). `FORBIDDEN` lists phrases that must appear nowhere.
- **`src/content/home.ts`**: the home page's text per language, `HOME`, section by section.
- **`src/content/pages.ts`**: the features, pricing, about and contact pages' text per language (`FEATURES_PAGE`,
  `PRICING_PAGE`, `ABOUT_PAGE`, `CONTACT_PAGE`), each with its `meta` (title and description).
- **`src/content/contact.ts`**: what the contact page shows: `CONTACT_PAGE`'s text with `CONTACT` and the privacy
  link from `LEGAL`.
- **`src/content/blog.ts`**: the blog. `BLOG` (the posts folder, the blog's URL, posts per page), `blog` (the loader
  every page reads), `paths` (the blog's URLs), `blogMetadata` (a page's metadata with the feed links) and, per
  language, `BLOG_TEXT`: the index, post, author and category texts and the newsletter's heading.
- **`content/blog/<locale>/`**: the posts, authors and categories (see "Writing a post").
- **A part's `content.ts`**: the legal pages', the not-found page's and the changelog's text (see "Parts" below).

Pages and components read these; they never copy a fact. `SITE_URL` in the environment overrides `SITE.url`.

## The pages

The features, pricing and about pages are this site's own code, derived from the website kit's page templates: the same
markup (the templates' `var(--oc-…)` classes written as `design-tokens`' utilities), the sections from
`src/components/section-*` (each part once), the text from `src/content/pages.ts`. Change them here as you like: they
are not parts.

| View | Route | Derived from |
|---|---|---|
| `src/components/home-page.tsx` | `src/app/page.tsx` | `starter-landing-page` 2.0.0's home page, without pricing and questions, plus the newest posts |
| `src/components/features-page.tsx` | `src/app/features/page.tsx` | `page-features` 2.0.0 |
| `src/components/pricing/pricing-page.tsx`, `comparison-table.tsx`, `labels.ts`, `labels.de.ts` | `src/app/pricing/page.tsx` | `page-pricing` 2.0.0 (plus the questions as FAQPage data) |
| `src/components/about/about-page.tsx`, `about-story.tsx`, `team-grid.tsx`, `site-types.ts` | `src/app/about/page.tsx` | `page-about` 2.0.0 |

The contact page and the changelog are parts with logic of their own; their routes render the part's view:

| Route | Renders | Part |
|---|---|---|
| `src/app/contact/page.tsx` | `ContactView` with `contactContent(LOCALE)` | `src/app/_page-contact` (`page-contact` 2.0.0) |
| `src/app/changelog/page.tsx` | `ChangelogPage` | `src/app/_page-changelog` (`page-changelog` 2.0.0) |

## The contact form

`/contact` shows the form, the email, phone and address from `CONTACT` in `site.ts`, and a link to a map. The form
works without JavaScript: the server action (`src/app/_page-contact/actions.ts`) checks the fields, quietly drops
spam (a hidden field, and a form sent within three seconds of opening the page) and hands the message to `deliver()`.

- **Replace `deliver()`** in `src/app/_page-contact/deliver.ts` with your email service, database or help desk. As
  shipped it logs in development and refuses in production, so the form answers "could not be sent" and keeps what
  was typed, instead of dropping messages silently.
- **The part's `content.ts` is not read.** The page's text is `CONTACT_PAGE` in `src/content/pages.ts`, the facts
  are `CONTACT` in `site.ts`; `src/content/contact.ts` puts them together.
- **The map is a link** (OpenStreetMap, built from `CONTACT.address`), so nothing loads from another host. To embed
  a map, render it inside `ConsentGate` in a client component and pass it as `ContactView`'s `map` prop (see
  "Consent" and `src/app/_page-contact/README.md`).
- The route is rendered per request (`export const dynamic = 'force-dynamic'`), so the time check starts when a
  visitor opens the page.

## Writing a post

A post is one file, `content/blog/<locale>/posts/<slug>.mdx`: Markdown (MDX) with its settings at the top, between
two lines of three dashes. `content/blog/en/posts/writing-a-post.mdx` is a draft that shows every setting; copy it to
start a post.

- **The slug is the file name** and the address: `/blog/<slug>`. Lowercase letters and digits joined by single
  hyphens (`^[a-z0-9]+(?:-[a-z0-9]+)*$`). `page`, `author` and `category` are reserved: the blog's own routes use them.
  Files in `posts/` that do not end in `.mdx` are ignored.
- **The settings** are the post's fields, nothing else (an unknown key stops the build):

  | Key | |
  |---|---|
  | `title` | required, up to 200 characters |
  | `description` | required, up to 500; shown on cards, in feeds and to search engines |
  | `publishedAt` | required: `2026-03-01` (counts from 00:00 UTC that day) or `2026-03-01T09:00:00+01:00` (an offset is required) |
  | `updatedAt` | optional, never before `publishedAt` |
  | `authorIds` | required: one or more ids from `authors.yaml` |
  | `category` | required: one id from `categories.yaml` |
  | `tags` | optional list; related posts share tags or the category |
  | `image` | optional: `{ src, alt, width, height }`, the picture at the top and in shares |
  | `draft` | optional: `true` keeps the post off every page, feed and the sitemap |

  `readingMinutes` is computed from the text.
- **Drafts and scheduling:** a post is on the site when `draft` is not `true` and `publishedAt` has passed. The site is
  built ahead of time, so a scheduled post appears at the **first build after its date**: rebuild then, or let the
  hosting rebuild on a schedule. Drafts and scheduled posts are checked in full at every build, settings and text: one
  broken file stops the build now, not the first build after its date.
- **Images** go in `public/blog/` and are referenced from the root: `![What it shows](/blog/picture.svg)` in the text,
  `src: /blog/picture.svg` in `image`. Images in the text load when they scroll into view.
- **What the build refuses, and why:** anything in a post that would load from another host, and what cannot be
  checked. In detail (`src/utils/blog-content/README.md`, "Notes", is the full list): an image, video or frame
  address on another host or computed (`![](https://…)`, `<img src="//…">`, `<iframe src="https://…">`,
  `src={…}`, also `srcSet`, `poster`, `data`, `background`, SVG `href`/`xlinkHref`, in any letter case); the
  elements `script`, `style`, `link` (a pasted font or stylesheet snippet), `meta`, `base`, `object`, `embed`;
  `srcDoc`; `url()` in a `style`; a spread `{...props}`; JSX inside `{ }`; `import`/`export`; and an `image.src` on
  another host. A post is code (MDX runs JSX), and anything loaded from another host would be requested before the
  visitor agreed to it (see "Consent"). Links (`href` on `a`) to other sites are fine. Every refusal names the file
  and line: `<file>:<line>: <field>: <problem>`. The refusals catch accidents, not intent: posts must come from the
  people who run the site, never from visitors.

**`authors.yaml`** lists the authors: `id`, `name`, optional `bio` (a blank line starts a paragraph), `url` (a path
on this site or an `https://` address) and `image`. **`categories.yaml`** lists the categories: `id`, `name`,
optional `description`. Each author and each category gets a page, with or without posts; a post that names an id
missing from the list stops the build. Ids are URL segments and stay English in every language.

## The language switch

`src/content/locale.ts` holds `LOCALE`, `'en'` by default. Set it to `'de'` and every text, label, date and number
format and the page's `lang` switch to German, and the blog reads `content/blog/de/` instead of `content/blog/en/`
(`BLOG.dir` follows `LOCALE`); nothing else needs to change. Every entry in `site.ts`, `home.ts`, `pages.ts` and
`blog.ts` exists in both languages, and every part ships both label sets. Post slugs are content: the German posts
have German slugs.

Routes stay English in both languages (`/features`, `/pricing`, `/about`, `/contact`, `/changelog`, `/blog`,
`/imprint`, `/privacy`, `/terms`). For German paths, rename the route folders under `src/app/` (for example `imprint`
to `impressum`), then update the hrefs in `NAV`, `LEGAL`, `FOOTER_COLUMNS` and `CTA`, the links in `home.ts` and
`pages.ts`, the `PAGES` list in `src/app/sitemap.ts`, the `/privacy` lookup in `src/content/contact.ts`, and the
links in `src/app/_page-404-error/content.ts`. `pnpm test` fails until the links and the sitemap agree. To move the
blog itself, see "Moving the blog".

## The feeds

`src/app/feed.xml/route.ts` (RSS 2.0) and `src/app/atom.xml/route.ts` (Atom) list the newest 20 visible posts with
their title, date and description; readers follow the link to read the post. They are written at build time
(`dynamic = 'force-static'`) with absolute links on `SITE_URL`, else `SITE.url`. Every page names them in its head
(`metadata.alternates.types`): the layout does it for pages without a canonical URL, and `blogMetadata` for the rest,
because Next replaces the layout's `alternates` with a page's own. A new page whose metadata sets `alternates` (a
canonical URL) loses the feed links unless it uses `blogMetadata`. The footer links both feeds; the sitemap does not
list them (they are not pages).

## Moving the blog

The blog lives at `/blog`. To serve it elsewhere, say `/journal`: rename the folder `src/app/blog` to
`src/app/journal`, set `BLOG.base` to `'/journal'` in `src/content/blog.ts`, and update `NAV`, `FOOTER_COLUMNS` and
`PAGES` in `src/app/sitemap.ts`. Every link, feed entry and sitemap entry comes from `paths`, so they follow.

## The blog views

The blog's pages are this site's own code, derived from the website kit's page templates; they hold the same markup (the
templates' `var(--oc-…)` classes written as `design-tokens`' utilities), read the parts in `src/` (each part once) and
take their text from `src/content/blog.ts`:

| View | Route files | Derived from |
|---|---|---|
| `src/components/blog/blog-index.tsx` | `src/app/blog/page.tsx`, `src/app/blog/page/[page]/page.tsx` | `blog-index-page` 2.0.0 |
| `src/components/blog/post-page.tsx`, `table-of-contents.tsx`, `reading-progress.tsx` | `src/app/blog/[slug]/page.tsx` | `blog-post-page` 2.0.0 (plus the newsletter beside the post) |
| `src/components/blog/author-page.tsx` | `src/app/blog/author/[author]/page.tsx` | `blog-author-page` 2.0.0 |
| `src/components/blog/category-page.tsx` | `src/app/blog/category/[category]/page.tsx`, `…/page/[page]/page.tsx` | `blog-category-page` 3.0.0 |

Change them here as you like: they are not parts. Every blog route is built ahead (`generateStaticParams`,
`dynamicParams = false`), so an unknown slug, id or page number answers 404.

A route that reads posts **at request time** instead (for example with `export const revalidate = 3600`) also needs
the post files in the standalone server: add `outputFileTracingIncludes: { '/blog/**': ['./content/blog/**'] }` to
`next.config.ts`, or the server finds no posts. The routes as shipped read them only at build time.

## The newsletter

`NewsletterCta` (`src/components/blog-newsletter-cta`) sits beside every post on wide screens. Its form posts to the
server action `src/app/newsletter-action.ts`, which checks the address and calls `subscribe(email)` from
`src/content/subscribe.ts`. **Replace `subscribe()`** with a call to your provider; as shipped it only logs in
development and refuses in production (so the form answers "did not work" instead of a false "subscribed"). Double
opt-in (the confirmation email) is the provider's job: switch it on there, and change the part's `subscribed` label
to "check your inbox" through the `labels` prop. To drop the newsletter, remove `NewsletterCta` from
`src/components/blog/post-page.tsx`, and delete `newsletter-action.ts` and `subscribe.ts`.

## Adding a page

1. A route folder under `src/app/`, e.g. `src/app/careers/page.tsx`. The page renders `<main id="main" tabIndex={-1}>`
   (the skip link's target) with exactly one `h1`; the layout brings the header and footer.
2. `export const metadata = blogMetadata({ path, title, description })` (from `src/content/blog.ts`), in both
   languages' text; the layout adds `| <company>` to the title.
3. A `NAV` entry in `src/content/site.ts`, in both languages, if it belongs in the navigation.
4. Its path in `PAGES` in `src/app/sitemap.ts`. `src/app/pages.test.tsx` fails when a `NAV`, `CTA`, `LEGAL` or footer
   link, or a link on a page, points at a route the sitemap does not list.
5. Its text in both languages, next to the other content in `src/content/` (`pages.ts` holds the other pages').

## Removing a page

Say the site sells nothing and `/pricing` should go:

1. Delete the route folder (`src/app/pricing`) and, for a derived page, its view (`src/components/pricing`) and its
   entry in `src/content/pages.ts`.
2. Remove its `NAV`, `CTA` and `FOOTER_COLUMNS` entries in `src/content/site.ts`, in both languages, and the links to
   it in `src/content/home.ts` and `pages.ts`.
3. Remove its path from `PAGES` in `src/app/sitemap.ts`.
4. For a page that is a part (`/contact`, `/changelog`), also delete its part folder (`src/app/_page-contact`,
   `src/app/_page-changelog`) and the files that import it (`src/content/contact.ts` for the contact page). A
   section no page uses any more may stay or go with its folder.
5. Run `pnpm test && pnpm lint`: `src/app/pages.test.tsx` fails until the navigation, the links on the pages and the
   sitemap agree, and the type check fails while anything still imports a deleted file. Remove the page from the
   test's lists too.

The blog is not removed this way: every page's metadata comes from `blogMetadata` in `src/content/blog.ts`, the
layout names the feeds, and the tests check the posts and the feeds. It stays; leave it out of `NAV` if it should not
be in the navigation yet.

## Parts

These folders are published templates, copied in unchanged at the version shown. Do not edit them in place: an edit
is lost the next time the template is installed, and it is no longer the proven template.

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
| `src/components/section-pricing` | `section-pricing` | 3.0.0 |
| `src/components/section-faq` | `section-faq` | 3.0.0 |
| `src/components/section-cta` | `section-cta` | 3.0.0 |
| `src/utils/blog-content` | `blog-content` | 2.0.0 |
| `src/utils/blog-rss-sitemap` | `blog-rss-sitemap` | 1.0.0 |
| `src/components/blog-card` | `blog-card` | 2.0.0 |
| `src/components/blog-newsletter-cta` | `blog-newsletter-cta` | 2.0.0 |
| `src/components/blog-share-buttons` | `blog-share-buttons` | 3.0.0 |
| `src/app/_page-contact` | `page-contact` | 2.0.0 |
| `src/app/_page-changelog` | `page-changelog` | 2.0.0 |
| `src/app/_page-legal-imprint` | `page-legal-imprint` | 2.0.0 |
| `src/app/_page-legal-privacy` | `page-legal-privacy` | 2.0.0 |
| `src/app/_page-legal-terms` | `page-legal-terms` | 2.0.0 |
| `src/app/_page-404-error` | `page-404-error` | 2.0.0 |

**The owner's files inside parts.** A few files in part folders are yours to replace there:

- the legal pages' and the not-found page's text: `src/app/_page-legal-imprint/content.ts`,
  `src/app/_page-legal-privacy/content.ts`, `src/app/_page-legal-terms/content.ts`,
  `src/app/_page-404-error/content.ts`;
- the releases: `src/app/_page-changelog/content.ts`;
- where contact messages go: `src/app/_page-contact/deliver.ts`.

To change a part's behaviour, change it through its props (its `layout` among them: a part's `README.md` lists its
layouts, where it has any), labels and content from your own code first. If that is not enough, the change belongs in
the template: change it there, then install it again into its folder, e.g.
`npx @trinity369/use blog-card --dir src/components/blog-card`. An install overwrites the folder's files, so **save the
owner's files above first** and put them back after. Folders starting with `_` are private to Next: they hold views, and
the short route files (`src/app/contact/page.tsx`, `src/app/imprint/page.tsx`, `not-found.tsx`, `error.tsx`, …) render
them with `LOCALE`.

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
  grey or other palette class, a radius from Tailwind's scale or `font-sans`: `src/design-system/tokens-only.test.ts`
  and `pnpm design:guards` refuse them.
- **Structure** is chosen with each installed part's `layout` prop (`layout="split"`, …); the part's `README.md`
  lists its layouts and what each draws. A part is never restyled with classes.
- **Never edit `src/design-system/generated/`**: `pnpm design:sync` writes it. To change the design, change it in
  Claude Design, export it again over `design/export/`, run `pnpm design:sync`, then `pnpm design:diff`.
  `README.md`, "The design", has the steps and the four `design:*` scripts.

## Consent: nothing from another host before a choice

The cookie banner (`src/modules/site-cookie-consent`, mounted in `src/app/layout.tsx`) shows until the visitor
chooses. Until then nothing non-essential is stored and nothing is requested from another host. The choice lives in
one first-party cookie, `site_consent`; the footer's "Cookie settings" button opens the choice again. The map on the
contact page and the share links under a post are plain links: nothing is loaded from a network until a visitor
clicks one.

- **Anything that loads from another host** (a map, a video, a font or script from a CDN) goes inside
  `<ConsentGate category="media" fallback={…}>`, **created in a client component** (`'use client'`). React's server
  renderer preloads every `<img>` and `<link>` it renders, even inside a gate that is still closed, so a gated embed
  written in a server component is requested before consent. The module's `README.md` shows the pattern. The build
  refuses embeds from another host in posts (see "Writing a post"); put such an embed in a component.
- **A new kind of use** (statistics, say) is a new entry in `CONSENT_CATEGORIES`, in both languages. Changing the list
  asks every visitor again.
- **A site that never stores anything and never loads from another host** needs no banner: remove `ConsentProvider`
  from `src/app/layout.tsx` (keep its children), drop `cookieSettings` from `SiteFooter`, and delete
  `src/modules/site-cookie-consent` and `CONSENT_CATEGORIES`. Add them back before the first embed.

## Legal text

The imprint, privacy notice and terms ship **structure and placeholders, not legal text**. Every `[[…]]` in their
`content.ts` is a placeholder, highlighted on the page until replaced. The text must come from the site's owner or
their counsel; nothing in these files is legal advice, and a coding agent must not write it. The contact form and a
newsletter usually need their own paragraphs in the privacy notice (what is stored, where it goes, for how long).

While the site's URL is `https://example.com` (the sample), nothing complains about placeholders. Once it is your
domain (`SITE.url`, or `SITE_URL` as the build reads it):

- `pnpm build` refuses to render a legal page whose text in `LOCALE` still holds a `[[…]]`
  (`src/content/legal-guard.ts`, called by the three legal route files), so an unfinished imprint never goes live.
- `src/content/claims.test.ts` fails and names every legal `content.ts` that still holds one. It reads both
  languages: a site in one language also replaces the other language's placeholders (with its own text or a copy).

## Before going live

1. `SITE_URL` (or `SITE.url`) is your domain, and the facts in `src/content/site.ts` are yours.
2. The legal text is written by you or your counsel (see "Legal text"); the build and the tests stop you until every
   placeholder is gone.
3. `deliver()` in `src/app/_page-contact/deliver.ts` sends messages somewhere you read.
4. `subscribe()` in `src/content/subscribe.ts` calls your newsletter provider, or the signup is removed.
5. `FORBIDDEN` in `site.ts` lists what must never appear (an old address, a promise you cannot keep).
6. `CONSENT_CATEGORIES` names every kind of use the site has, and every embed sits inside `ConsentGate`.
7. With the German switch: the sample names in the parts' German text (the legal pages, the changelog) and in the
   German page text (`pages.ts`) are the German sample company's (Beispielwerk GmbH), while `site.ts` names
   Samplework Inc. in both languages. Replace them all with your own facts.

## What each guard test protects

| Test | Protects |
|---|---|
| `src/app/pages.test.tsx` | every page view (home, features, pricing, about, contact, changelog) renders `main#main` with one `h1` in both languages; the home page shows the newest posts; the contact page shows the email and phone from `site.ts`; every in-page link has its target and every link to another page points at a listed route; every linked route but the feeds is in the sitemap; the footer links both feeds; the route modules render `main#main` with one `h1` |
| `src/content/blog.test.ts` | both languages' posts load and render (headings, image, code block); drafts stay out of the posts and the sitemap; both feeds parse and list exactly the visible posts; `subscribe()` refuses in production until replaced. Its counts (three posts, two authors, two categories per language) and the render checks (headings, an SVG picture, a code block) describe the sample posts: change them when you replace those, and keep the rest |
| `src/content/claims.test.ts` | no source file or post states a `FORBIDDEN` phrase, however it is wrapped; no legal placeholder is left once the site has its own domain |
| `src/content/legal-guard.test.ts` | the build-time guard: legal placeholders render on the sample domain only |
| `src/design-system/tokens-only.test.ts` | the classes in every file under `src/` but the generated design files, the tests and the copy (`src/content/`, a part's `content.ts` and `labels`): no palette, white or black colour class, no radius from Tailwind's scale, no `font-sans` or `font-serif`; design-sync's guards report nothing (the parts pass it by construction) |
| `pnpm design:check`, `pnpm design:guards` | the generated design files match the export (before the first export there is nothing to check); no colour literal, unknown wrapper class or hand-written vendor prefix under `src/` |
| `pnpm typecheck` | the whole site, parts included, type-checks strictly |
