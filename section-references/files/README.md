# References Section

Past work as cards: each reference's image, client, a meta line (a trade, a year), its title and a short
description, in two layouts. A title links to the project's page when you give it one. Its colours, fonts and corner
radius come from your design system's tokens when you load them, and it keeps a neutral look when you do not. A
server component with typed content: every visible string comes in through `content`.

## Usage

```tsx
import { ReferencesSection } from '@/components/section-references/references-section';

<ReferencesSection
  id="work"
  content={{
    title: 'Selected work',
    intro: 'Three projects from the last two years.',
    items: [
      {
        title: 'A new roof for the town library',
        client: 'Town of Sampletown',
        meta: 'Roofing · 2025',
        description: 'Insulated and re-tiled in six weeks.',
        image: { src: '/work/library.jpg', alt: 'The library under its new roof', width: 1200, height: 900 },
        href: '/work/library',
      },
      { title: 'A kitchen for a family of five', client: 'A private client', meta: 'Interiors · 2024' },
    ],
  }}
/>

<ReferencesSection layout="rows" content={content} />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### With Next's Link and Image

Title links render through `LinkComponent` (a plain `a` by default), images through `ImageComponent` (a plain `img`):

```tsx
import Link from 'next/link';
import Image from 'next/image';
import type { ImageComponent } from '@/components/section-references/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<ReferencesSection content={content} LinkComponent={Link} ImageComponent={NextImage} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the references are a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | one card per reference, the image on top, then client and meta in one line, the title and the description; one, two or three columns as the width grows | `<ReferencesSection layout="grid" content={{ title, intro, items }} />` |
| `rows` | one reference per row in a card, the image beside the text from `md` (above it on a phone), the image side alternating | `<ReferencesSection layout="rows" content={{ title, items: [{ title, client, description, image, href }] }} />` |

`rows` needs images: references without any draw the `grid` instead, and a reference without one gets a card with its
text only. The section carries `data-layout` with the layout it drew; in `rows`, each `li` carries `data-side`
(`start` or `end`), the side its image takes from `md` up. Images are cut to 4:3; in `rows` from `md` the image fills
its row's height, cut further when the text beside it is the taller one. Text never sits on an image.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title and the reference titles (linked or not) | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the descriptions | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the client and meta line | `oklch(43.9% 0 none)` |
| `--oc-surface` | the card's ground | `#fff` |
| `--oc-line` | the card's border | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring of a linked title | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title and the reference titles | the page's font |
| `--oc-radius` | corners: 2 × on the card, 1 × on a focused title | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink: #1d2b3a; --oc-radius: 0.5rem; }`. A `data-theme` wrapper
with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `ReferencesContent` | | `{ title, intro?, items: Reference[] }` |
| `layout` | `'grid' \| 'rows'` | `grid` | see Layouts |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. next/link's `Link` |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `Reference` is `{ title, client?, meta?, description?, image?, href? }`; `image` is an `ImageRef`
(`{ src, alt, width, height }`). Only the facts a reference has are drawn: no client and no meta draws no line. An
empty `items` renders the heading and intro only, in every layout.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2`; each reference's title is an `h3`, so the page outline lists them.
- A linked title is the card's one link, named by the title, with a visible focus ring; the image is not a second
  link to the same page.
- The image comes before the text in reading order on every card; in `rows` only the visual side alternates. Give
  each image an `alt` that says what it shows, or an empty `alt` when the title already says it.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
