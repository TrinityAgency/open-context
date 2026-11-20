# Blog Content Loader

A typed post collection from MDX files in your project. `createBlog` reads `content/blog/` on the server, validates
every post's front matter (zod), hides drafts and posts scheduled for later, works out reading time and the
headings for a table of contents, and compiles a post's body with the MDX compiler (`@mdx-js/mdx`). No
`next.config` change and no `mdx-components.tsx` at the project root are needed. Plain functions plus
`mdxComponents()`, the styled post elements.

Needs `@mdx-js/mdx` (3 or later), `yaml` (2 or later) and `zod` (3 or later) in your project.

## Usage

### The content folder

```text
content/blog/
  posts/
    writing-posts.mdx      → served at /blog/writing-posts
    using-images.mdx
  authors.yaml
  categories.yaml
public/blog/
  using-images.png         → referred to as /blog/using-images.png
```

A post is one `.mdx` file in `posts/`; its file name is its slug. Other files in `posts/` are ignored. A missing
folder or file reads as empty (a fresh project has an empty blog).

```mdx
---
title: Using images in posts
description: Where images live and how to describe them.
publishedAt: 2026-02-02T09:00:00+01:00
updatedAt: 2026-02-05
authorIds: [robin-example, alex-sample]
category: guides
tags: [mdx, images]
image: { src: /blog/using-images.png, alt: A grey frame around three shapes, width: 1200, height: 630 }
draft: false
---

Text in Markdown. `## Headings` and `### headings` become the table of contents.

![A figure with three bars](/blog/sample-figure.png)
```

| Key | |
|---|---|
| `title` | 1–200 characters |
| `description` | 1–500 characters; listings, feeds and search results show it |
| `publishedAt` | `2026-03-01` (read as 00:00 UTC that day) or a date-time with an offset (`2026-03-01T09:00:00+01:00`, `…Z`). A date-time without an offset is refused: it would mean the build machine's time zone |
| `updatedAt` | optional, the same formats, not before `publishedAt` |
| `authorIds` | at least one id from `authors.yaml`, no repeats |
| `category` | one id from `categories.yaml` |
| `tags` | optional list of 1–40 characters each, no repeats |
| `image` | optional `{ src, alt, width, height }`; `src` is a path on this site or a `data:image/` URI |
| `draft` | optional, default `false` |

Slugs and ids are lowercase letters and digits joined by single hyphens. `page`, `author` and `category` are
reserved (the blog's own routes use them). Any other key, such as the typo `publishAt`, is refused.

A post is visible when it is not a draft and its `publishedAt` has come. A static site rebuilds to show a scheduled
post: it appears at the first build after its time.

```yaml
# authors.yaml
- id: alex-sample
  name: Alex Sample
  bio: |
    One paragraph.

    Another paragraph.
  url: /about                 # a path on this site or an https address
  image: { src: /blog/alex-sample.png, alt: Portrait of Alex Sample, width: 96, height: 96 }

# categories.yaml
- id: guides
  name: Guides
  description: How-tos.       # optional
```

### Reading posts

```tsx
// app/blog/[slug]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createBlog, mdxComponents } from '@/src/utils/blog-content';

const blog = createBlog({ dir: 'content/blog' });

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await blog.getPosts()).map((post) => ({ slug: post.slug }));
}

export default async function PostRoute({ params }: { params: Promise<{ slug: string }> }) {
  const loaded = await blog.getPost((await params).slug);
  if (!loaded) notFound();
  const { post, Content, headings } = loaded;
  return (
    <main id="main">
      <h1>{post.title}</h1>
      <Content components={mdxComponents({ LinkComponent: Link })} />
    </main>
  );
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.
Pass `next/link`'s `Link` as `LinkComponent` so links to your own pages are client-side navigations.

| `createBlog(options)` | |
|---|---|
| `getPosts(filter?)` | visible posts, newest first (a tie by slug); `filter`: `{ category?, authorId?, tag? }` |
| `getPost(slug)` | `{ post, Content, headings }` for a visible post, else `null`; compiles that post only |
| `getAuthors()`, `getAuthor(id)` | in `authors.yaml` order; `null` for an unknown id |
| `getCategories()`, `getCategory(id)` | in `categories.yaml` order; `null` for an unknown id |
| `getTags()` | `{ tag, count }[]` of the visible posts, most used first |

Every call reads the files again, so `next dev` shows an edit at once. Every call validates every post, drafts and
scheduled posts too, front matter and body (each body is compiled once per content): one broken file stops the build
with `<file>[:<line>]: <field>: <problem>`, for example `content/blog/posts/a.mdx: publishedAt: must be a date …`. A
post scheduled for next month therefore breaks this build, not the first build after its date.

### Helpers

| | |
|---|---|
| `blogPaths(base = '/blog')` | `index(page?)`, `post(slug)`, `author(id)`, `category(id, page?)`; page 1 has no `/page/1` |
| `paginate(items, page, perPage)` | `{ items, page, pageCount }`, or `null` when `page` is not an integer in 1…pageCount (answer 404) |
| `pageParams(total, perPage)` | `generateStaticParams` for pages 2 and up: `[{ page: '2' }, …]` |
| `relatedPosts(post, posts, limit = 3)` | 2 points for the same category, 1 per shared tag; score 0 left out |
| `sortPosts`, `isVisible`, `tagCounts`, `instantOf` | the rules above, for your own lists |
| `countWords`, `readingMinutes` | words without markup; minutes at 200 words per minute, rounded up, at least 1 |
| `headingId(text)` | the id a heading gets: `Über uns & mehr` → `über-uns-mehr`; repeats get `-1`, `-2` |

## Brand

The post elements read these design tokens (CSS custom properties of the Open Context token contract, version 1).
Unset, each falls back to the neutral value in brackets, so a post looks the same as before with no design system
loaded. Paragraphs and list items take the colour of the page around them.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | headings, links, inline code; the code block's ground | `oklch(20.5% 0 none)` |
| `--oc-surface` | the code block's text | `#fff` |
| `--oc-ink-muted` | a link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-ink-body` | a quote | `oklch(37.1% 0 none)` |
| `--oc-line-strong` | a quote's border | `oklch(87% 0 none)` |
| `--oc-surface-sunk` | inline code's ground | `oklch(97% 0 none)` |
| `--oc-line` | the rule (`---`) | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring of a link and of a code block | `oklch(20.5% 0 none)` |
| `--oc-radius` | inline code (1 ×), the code block and images (1.5 ×) | `0.25rem` |
| `--oc-font-heading` | `h2`, `h3`, `h4` | the page's font |

A code block is an inverse block, no brand mark: the ink ground with surface text, so it is dark on a light theme and
light on a dark one, and its contrast is the `[surface, ink]` pair. Code keeps the monospace font (`font-mono`): there is
no code font token. To set the tokens from a claude.ai design system, use the `design-tokens` template (its
`design-sync.mjs` writes them as aliases of your design's own tokens, light and dark, and checks the pairs these draw:
ink, body and muted text on the surface, ink on the sunk tint, surface on ink, the focus ring) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-surface: #fff; }`.

## Props

`createBlog({ dir, now?, includeDrafts?, wordsPerMinute?, mdx? })`: `dir` relative to the project root or absolute;
`now` decides which scheduled posts show (default: the time of the call); `includeDrafts` for a preview build;
`mdx: { remarkPlugins?, rehypePlugins? }` adds plugins after the blog's own rules (code highlighting, for example).

`mdxComponents({ LinkComponent? })` styles `h2 h3 h4 p a ul ol li blockquote code pre hr img strong em` in your
design tokens (Brand, below), the same with and without preflight. `h2` and `h3` keep their ids. Headings, paragraphs,
lists and quotes break a word wider than the column (a long compound on a phone). Spread your own over it to change one
element: `{ ...mdxComponents({ LinkComponent: Link }), blockquote: MyQuote }`.

The types (`Post`, `Author`, `Category`, `ImageRef`, `LinkComponent`) are in `site-types.ts`.

## Labels

None: every visible word comes from your posts.

## Keyboard and screen readers

Headings keep their levels, so the post's outline reads as written; each `h2` and `h3` has an id for in-page links,
with scroll margin so a sticky header does not cover it. A code block that scrolls sideways can be focused with Tab
and scrolled with the arrow keys. Images carry the alt text written in the post: describe what each image shows.

## Client islands

None. Everything runs on the server at build time (`node:fs`); never import this folder from a `'use client'` file.

## Notes

- **Posts are code.** MDX can run JavaScript at build time, so posts come from the site's own authors only, never
  from a form or a third party. The build's refusals are a guard against accidents (a pasted embed or font snippet),
  not a sandbox. It refuses, naming the file and line:
  - `import`/`export` in a post, spread attributes (`{...props}`), and JSX inside `{ }` (write the element directly);
  - the elements `script`, `style`, `link`, `meta`, `base`, `object` and `embed`;
  - an address on another host, or a computed one (`src={url}`), in `src`, `srcSet`, `poster`, `data`,
    `background` or `xlinkHref` (attribute names in any case), and in `href` on any element but a link (`a`,
    `area`), such as SVG `image` and `use`; `#…` stays allowed in an `href`;
  - `srcDoc`, and `url()` or `image-set()` in a `style`;
  - a markdown image (`![](…)`, also by reference) and a front matter or author image on another host.

  An address counts as this site's when it starts with one `/` (or is a `data:image/` URI), read as a browser reads
  it: tabs and line breaks dropped, so `/<tab>/host` is another host. Links (`href` on `a`) to other sites stay
  allowed.
- Images in posts are plain `img` elements with `loading="lazy"`: nothing loads before it is scrolled into view, and
  with the refusals above nothing a post shows loads from another host.
- There is no code highlighting built in; add a rehype plugin through `mdx.rehypePlugins` if you want one.
- **From 1.x:** the loader is unchanged. `mdxComponents()` draws in your design tokens (above): with none set it looks as
  1.x did, except that headings take the heading font when your design sets one and text breaks a word wider than the
  column instead of running off the page.
- A route that reads posts per request (`revalidate`) in a standalone build needs `content/blog/**` in
  `outputFileTracingIncludes` in `next.config`; static routes read them at build time and need nothing.
