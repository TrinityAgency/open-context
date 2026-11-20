# Features Page

A features page for a Next app: a hero, one section per group of features (each feature in its own row, with an
icon or an image, the image side alternating) and a call to action. It installs as a route folder at
`app/page-features` (served at `/page-features`); rename the folder for another path, e.g. `app/services`. The
sections are server components with typed content, so the page renders on the server and ships no JavaScript of its
own.

## Usage

1. Edit `content.ts`: the page's title and description (`META`) and every visible string (`CONTENT`). The sample
   content is invented (Samplework Inc.); keep the shapes and replace the text and pictures.
2. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German sample set). Set
   `lang` on `<html>` in your root layout to match.

Each group is `{ id, content }`: `id` becomes the section's id (link to it with `#planning`), and `content` is a
`FeaturesContent`: `{ title, intro?, items }`, where an item is `{ title, description, icon?, image? }`. An icon is
the `d` of one SVG path in a 24-unit box; an image is `{ src, alt, width, height }`. Add or remove groups freely.

The page body is `FeaturesPage({ locale })` in `features-page.tsx`; `page.tsx` only renders it with `LOCALE`. A site
that keeps its locale elsewhere renders the body itself:

```tsx
import { FeaturesPage } from '@/app/page-features/features-page';

export default function Services() {
  return <FeaturesPage locale="de" />;
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `metadata` and the page, in `LOCALE` |
| `features-page.tsx` | `FeaturesPage({ locale })`: hero, groups, call to action, with Next's `Link` for links |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |
| `_sections/hero`, `_sections/features`, `_sections/cta` | copies of `section-hero`, `section-features` and `section-cta` 3.0.0, byte for byte; each folder has its own README |

The `_sections` folders start with an underscore, so Next never serves them as routes.

## Layouts

Every section takes a `layout` prop; each section's README lists its layouts (`_sections/<name>/README.md`). Leaving
it out draws what 1.x drew, so this page looks as before. To change one, pass it where `features-page.tsx` calls the
section, e.g. `<FeaturesSection layout="split" … />`.

## Brand

The page draws nothing of its own: each section in `_sections/` reads the design tokens of the Open Context token
contract (version 1; see its README). Unset, each falls back to its neutral value, so the page looks the same as
before with no design system loaded.

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill.

## Labels

None: every string on the page comes from `content.ts`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`, the hero's title.
- Each group is a region named by its `h2`; each feature's title is an `h3`.
- Images carry their `alt`; an empty `alt` marks one as decorative.

## Client islands

None.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route and `content.ts` are the same; the sections draw in your design tokens, and every
  section takes `layout` (the feature groups pass `rows`, as 1.x drew them).
- The sample pictures are inline SVG, so the page loads nothing from another host. With `next/image`, pass an
  `ImageComponent` to `FeaturesSection` (see `_sections/features/README.md`).
- To change a section beyond its content, edit its copy under `_sections/`; it is your code now.
