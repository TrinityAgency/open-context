# Author Page

One page per blog author in a Next app: the name, a portrait, the bio, a website link, and every post that author
wrote, newest first. It installs as a route folder at `app/blog/author/[author]` (served at `/blog/author/<id>`).
Authors come from `content/blog/authors.yaml` at your project root; every author gets a page at `next build`, those
without posts too, and any other id answers 404.

Needs `@mdx-js/mdx` (3 or later), `yaml` (2 or later) and `zod` (3 or later) in your project.

## Usage

1. List the authors in `content/blog/authors.yaml` (`id`, `name`, and optionally `bio`, `url`, `image`); posts name
   them in `authorIds`. The format is in `_parts/blog-content/README.md`. A blank line in `bio` starts a new
   paragraph (use a YAML block, `bio: |`).
2. Edit `content.ts`: `META[…].description` is the page description for an author without a bio, and `BLOG` holds
   the posts folder and the blog's URL.
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German set). Set `lang` on
   `<html>` in your root layout to match. Routes stay English in both.

**The other blog pages.** The cards link to `/blog/<slug>`, the last link to `/blog`. Install `blog-index-page`,
`blog-post-page` and `blog-category-page` beside this one and the four form one blog; the post page links each
author's name here.

**Another URL.** Move the folder (e.g. to `app/journal/author/[author]`) and set `BLOG.base` to match (`/journal`).
Keep `BLOG.base` equal in every blog page.

The page body is `AuthorPage({ locale, author, blog? })` in `author-page.tsx`; `page.tsx` builds the routes and the
metadata, and renders the body with `LOCALE`. A site that keeps its locale elsewhere renders the body itself:

```tsx
import { AuthorPage } from '@/app/blog/author/[author]/author-page';

export default async function Author({ params }: { params: Promise<{ author: string }> }) {
  const { author } = await params;
  return <AuthorPage locale="de" author={author} />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `generateStaticParams` over every author, `dynamicParams = false`, `generateMetadata` (the name; the bio's first paragraph as description) and the page |
| `author-page.tsx` | `AuthorPage` and `bioParagraphs`, with Next's `Link` |
| `content.ts` | `LOCALE`, `META` and `BLOG` |
| `labels.ts`, `labels.de.ts` | the page's own labels |
| `_parts/blog-content` | a copy of `blog-content` 1.0.0, byte for byte: reads and checks the posts and authors |
| `_parts/blog-card` | a copy of `blog-card` 1.0.0: one card |

Each `_parts` folder has its own README. The folders start with an underscore, so Next never serves them as routes.

## Props

`AuthorPage`:

| Prop | Type | Default | |
|---|---|---|---|
| `locale` | `'en' \| 'de'` | | picks the labels and the date format |
| `author` | `string` | | the author's id; an unknown id calls `notFound()` |
| `blog` | `Blog` | the posts in `BLOG.dir` | another source, e.g. `createBlog({ dir, includeDrafts: true })` for a preview |

## Labels

The page's own (`labels.ts`, German in `labels.de.ts`), picked by `locale`:

| Key | English | German |
|---|---|---|
| `website` | Website | Website |
| `posts` | Posts by {name} | Beiträge von {name} |
| `empty` | No posts yet. | Noch keine Beiträge. |
| `all` | All posts | Alle Beiträge |

The cards use `_parts/blog-card`'s label sets, picked by the same `locale`.

## Keyboard and screen readers

- One `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the author's name.
- The portrait's `alt` comes from `authors.yaml` (`image.alt`).
- The posts are a region named by their `h2`; each card is an `article` named by its title, an `h3`.
- A website on your own site (`/about`) is a Next link; one on another host is a plain link with
  `rel="noopener noreferrer"`.

## Client islands

None.

## Notes

- The list is not paged: every visible post of the author, newest first. Drafts and posts dated in the future are
  left out until the first build after their date.
- An author id must be lowercase letters, digits and hyphens; it is the URL segment and stays English in both
  languages.
- The portrait renders as a plain `img`; images live in `public/`.
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
