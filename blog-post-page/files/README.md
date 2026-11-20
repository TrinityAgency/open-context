# Blog Post Page

One blog post in a Next app: breadcrumbs, the title with its dates, reading time and authors, the post's picture,
the body beside a table of contents, share links, related posts, and `Article` data for search engines, under a thin
reading progress bar. It installs as a route folder at `app/blog/[slug]` (served at `/blog/<slug>`). The posts are
MDX files in `content/blog/` at your project root; every visible post is built into static HTML at `next build`,
and any other slug answers 404.

Needs `@mdx-js/mdx` (3 or later), `yaml` (2 or later) and `zod` (3 or later) in your project.

## Usage

1. Write posts: `content/blog/posts/<slug>.mdx`, with `content/blog/authors.yaml` and `content/blog/categories.yaml`
   beside them. The format, and what the build refuses, is in `_parts/blog-content/README.md`.
2. Edit `content.ts`: `SITE` (your site's name, absolute URL and description, used for share links, the canonical
   URL and the `Article` data) and `BLOG` (the posts folder and the blog's URL).
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German set). Set `lang` on
   `<html>` in your root layout to match. Routes stay English in both.

**The other blog pages.** The breadcrumbs link to `/` and `/blog`, the category to `/blog/category/<id>`, the
authors to `/blog/author/<id>`. Install `blog-index-page`, `blog-category-page` and `blog-author-page` beside this
one and the four form one blog; without them those links answer 404 (and your site needs a home page at `/`).

**Another URL.** Move the folder (e.g. to `app/journal/[slug]`) and set `BLOG.base` to match (`/journal`). Keep
`BLOG.base` equal in every blog page.

The page body is `PostPage({ locale, slug, blog? })` in `post-page.tsx`; `page.tsx` builds the routes, the metadata,
and renders the body with `LOCALE`. A site that keeps its locale elsewhere renders the body itself:

```tsx
import { PostPage } from '@/app/blog/[slug]/post-page';

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostPage locale="de" slug={slug} />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `generateStaticParams` over the visible posts, `dynamicParams = false`, `generateMetadata` (canonical URL, Open Graph `article` with dates and authors, Twitter card) and the page |
| `post-page.tsx` | `PostPage`: the post and everything around it, with Next's `Link` |
| `table-of-contents.tsx` | `TableOfContents`: the post's `h2`/`h3` headings as in-page links |
| `reading-progress.tsx` | `ReadingProgress` (the bar) and `readingProgress` (the pure measure) |
| `content.ts` | `LOCALE`, `SITE`, `OG_LOCALE` and `BLOG` |
| `labels.ts`, `labels.de.ts` | the page's own labels |
| `_parts/blog-content` | a copy of `blog-content` 2.0.0, byte for byte: reads, checks and compiles the posts |
| `_parts/blog-card` | `blog-card` 2.0.0: the related posts' cards, the date format and the reading-time label |
| `_parts/component-breadcrumbs` | `component-breadcrumbs` 2.0.0: the trail and its `BreadcrumbList` data |
| `_parts/blog-share-buttons` | `blog-share-buttons` 3.0.0: the share links |
| `_parts/site-seo` | `site-seo` 1.0.0: the metadata and the `Article` data |

Each `_parts` folder has its own README. The folders start with an underscore, so Next never serves them as routes.

## Brand

The page's own markup reads these design tokens (CSS custom properties of the Open Context token contract, version 1);
each part in `_parts/` reads its own (see its README). Unset, each falls back to the neutral value in brackets, so the
page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the author links, the contents' title and links under the pointer | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the description, the contents' links | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the category, the date line | `oklch(43.9% 0 none)` |
| `--oc-line` | the rule above the share links | `oklch(92.2% 0 none)` |
| `--oc-brand-ink` | the reading progress bar | `oklch(20.5% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the post's image (2 ×) | `0.25rem` |
| `--oc-font-heading` | the title, "Related posts" | the page's font |
| `--oc-font-body` | the table of contents | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page and its parts draw) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; }`.

## Props

`PostPage`:

| Prop | Type | Default | |
|---|---|---|---|
| `locale` | `'en' \| 'de'` | | picks the labels and the date format |
| `slug` | `string` | | a missing, draft or scheduled slug calls `notFound()` |
| `blog` | `Blog` | the posts in `BLOG.dir` | another source, e.g. `createBlog({ dir, includeDrafts: true })` for a preview |

`TableOfContents({ headings, label })`: renders nothing for fewer than two headings; each `h3` sits under the `h2`
before it. `ReadingProgress({ targetId })`: measures the element with that id (`post-body`, the article).

## Labels

The page's own (`labels.ts`, German in `labels.de.ts`), picked by `locale`:

| Key | English | German |
|---|---|---|
| `contents` | On this page | Auf dieser Seite |
| `related` | Related posts | Ähnliche Beiträge |
| `published` | Published | Veröffentlicht |
| `updated` | Updated | Aktualisiert |
| `home` | Home | Startseite |
| `blog` | Blog | Blog |

The reading time and "By" come from `_parts/blog-card`'s labels, the trail's and the share links' labels from their
parts, all picked by the same `locale`.

## Keyboard and screen readers

- One `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the post's title.
- The breadcrumbs are a navigation landmark ("Breadcrumb"); the post is the current item (`aria-current="page"`).
- Dates are `time` elements with the date as written in the post's front matter.
- The table of contents is a navigation landmark named by its visible title; its links move focus to the heading.
- The body is an `article`; its headings keep the ids the table of contents links to.
- The share links are a group named by their title; see `_parts/blog-share-buttons/README.md`.
- The related posts are a region named by their `h2`; each card's title is an `h3`.
- The progress bar is decorative and hidden from screen readers.

## Client islands

`reading-progress.tsx` (the bar, updated on scroll and resize once per frame, listeners passive and removed on
unmount), and `_parts/blog-share-buttons/share-actions.tsx` (native share and copy link).

## Notes

- Related posts: up to three visible posts sharing the category (2 points) or tags (1 point each), best first.
- Drafts and posts dated in the future get no page. Pages are built at `next build`, so a scheduled post appears with
  the first build after its date: rebuild on a schedule (a daily deploy) if you schedule posts.
- A post file the build cannot read stops the build with the file and line: a broken draft too, since it is a file
  in your repository.
- The post's picture renders as a plain `img`; images inside the body load lazily.
- Every colour is a design token (Brand), with every margin and box set on the element, so it looks the same with or
  without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the page and its parts draw in your design
  tokens. The reading progress bar takes your brand-ink colour (the brand colour that stays readable on your
  surface), and a long heading stays inside the table of contents.
