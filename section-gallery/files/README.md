# Gallery Section

A gallery of pictures: a title, an intro and the thumbnails in two layouts. Each thumbnail is a link to its
full-size image, so it opens even without JavaScript; with it, a click opens a lightbox (a modal dialog) at that
picture, with previous and next buttons that wrap around, the arrow keys, Escape, the picture's position and its
caption. Its colours, fonts and corner radius come from your design system's tokens when you load them, and it keeps a
neutral look when you do not. A server component with one client island, the lightbox.

## Usage

```tsx
import { GallerySection } from '@/components/section-gallery/gallery-section';

<GallerySection
  id="gallery"
  content={{
    title: 'From the workshop',
    intro: 'Six pictures from this year’s jobs.',
    images: [
      {
        src: '/gallery/door-640.jpg',
        alt: 'The new workshop door',
        width: 640,
        height: 480,
        caption: 'The new workshop door',
        full: { src: '/gallery/door-1600.jpg', alt: 'The new workshop door by the harbour', width: 1600, height: 1200 },
      },
      { src: '/gallery/bench.jpg', alt: 'A workbench with hand tools', width: 640, height: 640 },
    ],
  }}
/>

<GallerySection layout="wall" content={content} />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### With Next's Image

Thumbnails render through `ImageComponent` (by default a plain `img` with `loading="lazy"`). The lightbox's large
picture is always a plain lazy `img` of `full` (or of the thumbnail when there is no `full`): it is drawn by the client
island, which takes no component from a server page.

```tsx
import Image from 'next/image';
import type { ImageComponent } from '@/components/section-gallery/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<GallerySection content={content} ImageComponent={NextImage} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the gallery is a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | square tiles, each picture cut to its square; two columns, three from `md`, four from `lg` | `<GallerySection layout="grid" content={{ title, intro, images }} />` |
| `wall` | flowing columns (two, three from `md`), each picture at its own ratio, no row alignment | `<GallerySection layout="wall" content={{ title, images: [{ src, alt, width, height, caption, full }] }} />` |

The section carries `data-layout` with the layout it drew. A caption sits below its thumbnail and below the picture in
the lightbox, never on a picture. Give every image its real `width` and `height`: the `wall` keeps that ratio, and the
browser reserves the box before the picture loads.

## The lightbox

- A plain click on a thumbnail opens it at that picture; a click with a modifier key (a new tab) stays the browser's.
- Previous and next buttons, and ArrowLeft and ArrowRight, move through the pictures and wrap around: next on the last
  shows the first, previous on the first the last. A gallery of one picture has no arrows.
- Close, Escape and a click on the dimmed page close it; focus then returns to the thumbnail that opened it.
- The position line ("3 of 6") names the dialog; the caption, when there is one, is below the picture.
- Each move is announced: the position line is a polite live region, and screen readers hear the picture's alt text
  with it ("4 of 6: Roof lights over the hall"), as focus stays on the buttons.
- The large picture loads only when the lightbox shows it (`loading="lazy"`), so a closed lightbox loads nothing.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the lightbox's text and its icon buttons | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the caption in the lightbox | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the captions below the thumbnails and the position line | `oklch(43.9% 0 none)` |
| `--oc-surface` | the lightbox's ground | `#fff` |
| `--oc-surface-sunk` | an icon button under the pointer | `oklch(97% 0 none)` |
| `--oc-scrim` | the veil behind the lightbox, at 80 % | `oklch(20.5% 0 none)` |
| `--oc-focus` | the focus ring of a thumbnail, a button and the lightbox | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-font-body` | the lightbox's text | the page's font |
| `--oc-radius` | corners: 2 × on the thumbnails and the lightbox, 1.5 × on its buttons | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink: #1d2b3a; --oc-radius: 0.5rem; }`. A `data-theme` wrapper
with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `GalleryContent` | | `{ title, intro?, images: GalleryImage[] }` |
| `layout` | `'grid' \| 'wall'` | `grid` | see Layouts |
| `labels` | `Partial<GalleryLabels>` | English | see Labels |
| `ImageComponent` | `ImageComponent` | plain lazy `img` | the thumbnails, e.g. a `next/image` wrapper |
| `id` | `string` | a generated one | on the `section`; the lightbox finds its thumbnails by it |
| `className` | `string` | | on the `section` |

A `GalleryImage` is an `ImageRef` (`{ src, alt, width, height }`, the thumbnail) with an optional `caption` and an
optional `full` (an `ImageRef` of the large picture). Without `full`, the thumbnail's link and the lightbox show the
thumbnail's own `src`. An empty `images` renders the heading and intro only, and no lightbox.

## Labels

The fixed strings, in `labels.ts` (English, the default) and `labels.de.ts` (German). Placeholders in braces are filled
in: `{n}` the picture's number, `{total}` the number of pictures, `{alt}` the thumbnail's alt text.

```tsx
import { GALLERY_LABELS_DE } from '@/components/section-gallery/labels.de';

<GallerySection content={content} labels={GALLERY_LABELS_DE} />
```

| Key | English | |
|---|---|---|
| `open` | `Open image {n} of {total}: {alt}` | a thumbnail link's name |
| `previous` | `Previous image` | the lightbox's previous button |
| `next` | `Next image` | the lightbox's next button |
| `close` | `Close` | the lightbox's close button |
| `position` | `{n} of {total}` | the position line, which names the lightbox |

## Keyboard and screen readers

- The section is a region named by its `h2`. Each thumbnail is a link named by its position and its alt text ("Open
  image 3 of 6: A workbench with hand tools"); a caption is the thumbnail's `figcaption`.
- Enter on a thumbnail opens the lightbox, a modal `dialog`: the rest of the page is inert, Tab moves among its
  buttons (previous, next and close; close alone for a gallery of one picture) and stays there, ArrowLeft and
  ArrowRight move through the pictures, Escape closes it and focus returns to
  the thumbnail. Every thumbnail, button and the dialog draw a visible focus ring.
- Write each `alt` to say what the picture shows: it names the thumbnail's link and the large picture.

## Client islands

`lightbox.tsx` (`'use client'`): the dialog and one click listener on the section. Everything else is rendered on the
server; without JavaScript the thumbnails are plain links to the pictures.

## Notes

- Serve the pictures from your own site. A picture on another host is a request to that host on every visit, before
  any consent; put such content behind your consent gate instead.
- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
