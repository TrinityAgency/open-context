# Blog Index Page

The front page of a blog in a Next app: a title, an intro, a category filter, the posts as cards (newest first, nine
to a page) and page links. It installs as a route folder at `app/blog` (served at `/blog`, then `/blog/page/2`, …).
The posts are MDX files in `content/blog/` at your project root, read and checked at build time, so every page is
static HTML and ships no JavaScript of its own.

Needs `@mdx-js/mdx` (3 or later), `yaml` (2 or later) and `zod` (3 or later) in your project.

## Usage

1. Write posts: `content/blog/posts/<slug>.mdx`, with `content/blog/authors.yaml` and `content/blog/categories.yaml`
   beside them. The format, and what the build refuses, is in `_parts/blog-content/README.md`. Without a
   `content/blog` folder the page shows its empty text.
2. Edit `content.ts`: the page's title and description (`META`), its visible text (`CONTENT`), and `BLOG`: the posts
   folder (`dir`), the blog's URL (`base`) and posts per page (`perPage`).
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German set). Set `lang` on
   `<html>` in your root layout to match. Routes stay English in both.

**The other blog pages.** The cards link to `/blog/<slug>`, the filter to `/blog/category/<id>`. Install
`blog-post-page`, `blog-category-page` and `blog-author-page` beside this one and the four form one blog; without
them those links answer 404.

**Another URL.** Move the folder (e.g. to `app/journal`) and set `BLOG.base` to match (`/journal`). The other blog
pages each have a `BLOG.base` of their own: keep them all equal.

The page body is `BlogIndexPage({ locale, page, blog? })` in `blog-index.tsx`; the route files only render it with
`LOCALE`. A site that keeps its locale elsewhere renders the body itself:

```tsx
import { BlogIndexPage } from '@/app/blog/blog-index';

export default function Blog() {
  return <BlogIndexPage locale="de" page={1} />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | `/blog`: `metadata` and page 1, in `LOCALE` |
| `page/[page]/page.tsx` | `/blog/page/<n>`: pages 2… are built ahead (`generateStaticParams`); any other number answers 404 |
| `blog-index.tsx` | `BlogIndexPage`: the filter, the cards and the page links, with Next's `Link` |
| `content.ts` | `LOCALE`, `META`, `CONTENT` (English and German) and `BLOG` |
| `labels.ts`, `labels.de.ts` | the page's own labels |
| `_parts/blog-content` | a copy of `blog-content` 1.0.0, byte for byte: reads and checks the posts |
| `_parts/blog-card` | a copy of `blog-card` 1.0.0: one card |
| `_parts/component-pagination` | a copy of `component-pagination` 1.0.0: the page links |

Each `_parts` folder has its own README. The folders start with an underscore, so Next never serves them as routes.

## Props

`BlogIndexPage`:

| Prop | Type | Default | |
|---|---|---|---|
| `locale` | `'en' \| 'de'` | | picks the text, the labels and the date format |
| `page` | `number` | | 1-based; a page past the last, or not a whole number, calls `notFound()` |
| `blog` | `Blog` | the posts in `BLOG.dir` | another source, e.g. `createBlog({ dir, includeDrafts: true })` for a preview |

## Labels

The page's own (`labels.ts`, German in `labels.de.ts`), picked by `locale`:

| Key | English | German |
|---|---|---|
| `filter` | Categories | Kategorien |
| `all` | All posts | Alle Beiträge |
| `page` | Page n (in the browser title of page 2…) | Seite n |

The cards and the page links use their parts' label sets (`_parts/blog-card/labels*.ts`,
`_parts/component-pagination/labels*.ts`), picked by the same `locale`.

## Keyboard and screen readers

- One `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- The filter is a navigation landmark named "Categories". "All posts" carries `aria-current`: `page` on `/blog`,
  `true` on the later pages, where it is still the filter's choice.
- Each card is an `article` named by its title, an `h2` linking to the post.
- The page links are a navigation landmark named "Pagination"; the current page carries `aria-current="page"`.

## Client islands

None.

## Notes

- Drafts and posts dated in the future are left out. Pages are built at `next build`, so a scheduled post appears
  with the first build after its date: rebuild on a schedule (a daily deploy) if you schedule posts.
- A post file the build cannot read stops the build with the file and line: a broken draft too, since it is a file
  in your repository.
- Card images render as plain `img` elements; posts' images live in `public/`.
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
