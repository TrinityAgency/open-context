# Category Page

One page per blog category in a Next app: the category's name and description, a link to all posts, its posts as
cards (newest first, nine to a page) and page links. It installs as a route folder at `app/blog/category/[category]`
(served at `/blog/category/<id>`, then `/blog/category/<id>/page/2`, …). Categories come from
`content/blog/categories.yaml` at your project root; every category gets its pages at `next build`, empty ones too,
and any other id or page answers 404.

Needs `@mdx-js/mdx` (3 or later), `yaml` (2 or later) and `zod` (3 or later) in your project.

## Usage

1. List the categories in `content/blog/categories.yaml` (`id`, `name`, and optionally `description`); each post
   names one in `category`. The format is in `_parts/blog-content/README.md`.
2. Edit `content.ts`: `META[…].description` is the page description for a category without one, and `BLOG` holds
   the posts folder, the blog's URL and posts per page.
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German set). Set `lang` on
   `<html>` in your root layout to match. Routes stay English in both.

**The other blog pages.** The cards link to `/blog/<slug>`, "All posts" to `/blog`. Install `blog-index-page`,
`blog-post-page` and `blog-author-page` beside this one and the four form one blog; the index's category filter
and the post page's breadcrumbs link here.

**Another URL.** Move the folder (e.g. to `app/journal/category/[category]`) and set `BLOG.base` to match
(`/journal`). Keep `BLOG.base` equal in every blog page.

The page body is `CategoryPage({ locale, category, page, blog? })` in `category-page.tsx`; the route files build the
routes and the metadata, and render the body with `LOCALE`. A site that keeps its locale elsewhere renders the body
itself:

```tsx
import { CategoryPage } from '@/app/blog/category/[category]/category-page';

export default async function Category({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  return <CategoryPage locale="de" category={category} page={1} />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | `/blog/category/<id>`: `generateStaticParams` over every category, `dynamicParams = false`, `generateMetadata` (the name and description) and page 1 |
| `page/[page]/page.tsx` | `/blog/category/<id>/page/<n>`: pages 2… of every category are built ahead; any other number answers 404 |
| `category-page.tsx` | `CategoryPage`: the cards and the page links, with Next's `Link` |
| `content.ts` | `LOCALE`, `META` and `BLOG` |
| `labels.ts`, `labels.de.ts` | the page's own labels |
| `_parts/blog-content` | a copy of `blog-content` 1.0.0, byte for byte: reads and checks the posts and categories |
| `_parts/blog-card` | a copy of `blog-card` 1.0.0: one card |
| `_parts/component-pagination` | a copy of `component-pagination` 1.0.0: the page links |

Each `_parts` folder has its own README. The folders start with an underscore, so Next never serves them as routes.

## Props

`CategoryPage`:

| Prop | Type | Default | |
|---|---|---|---|
| `locale` | `'en' \| 'de'` | | picks the labels and the date format |
| `category` | `string` | | the category's id; an unknown id calls `notFound()` |
| `page` | `number` | | 1-based; a page past the last, or not a whole number, calls `notFound()` |
| `blog` | `Blog` | the posts in `BLOG.dir` | another source, e.g. `createBlog({ dir, includeDrafts: true })` for a preview |

## Labels

The page's own (`labels.ts`, German in `labels.de.ts`), picked by `locale`:

| Key | English | German |
|---|---|---|
| `all` | All posts | Alle Beiträge |
| `empty` | No posts in this category yet. | In dieser Kategorie gibt es noch keine Beiträge. |
| `page` | Page n (in the browser title of page 2…) | Seite n |

The cards and the page links use their parts' label sets, picked by the same `locale`.

## Keyboard and screen readers

- One `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the category's name.
- Each card is an `article` named by its title, an `h2` linking to the post.
- The page links are a navigation landmark named "Pagination"; the current page carries `aria-current="page"`.

## Client islands

None.

## Notes

- Drafts and posts dated in the future are left out until the first build after their date.
- A category id must be lowercase letters, digits and hyphens; it is the URL segment and stays English in both
  languages.
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
- **From 1.0.0:** 2.0.0 is a new page. 1.0.0 was one `page.tsx` at `app/blog/category` with its posts written into
  the file and `lucide-react` icons; 2.0.0 reads your posts from `content/blog/` and installs one level deeper, at
  `app/blog/category/[category]`. If you installed 1.0.0, delete `app/blog/category/page.tsx` yourself (or keep it as
  a list of categories): the new version does not replace it.
