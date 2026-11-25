# Video Section

A video with its title and text, in two layouts: a 16:9 cover (your poster) with a play control in its middle. The
video loads from its provider only behind your consent gate, once the visitor allows external media; until then the
play control opens the consent settings, and on a site without a gate it links to the video's own page. Its colours,
fonts and corner radius come from your design system's tokens when you load them, and it keeps a neutral look when you
do not. A server component; the video's frame is the one client file.

## Usage

```tsx
import { VideoSection } from '@/components/section-video/video-section';
// and ConsentGate, from where you installed the site-cookie-consent template (its index file)

const content = {
  title: 'A tour of the workshop',
  text: 'Three minutes from the yard to the finishing room.',
  video: {
    title: 'Workshop tour, three minutes',
    href: 'https://www.youtube.com/watch?v=…',
    embedSrc: 'https://www.youtube-nocookie.com/embed/…',
    poster: { src: '/video/tour-poster.jpg', alt: 'The workshop seen from the yard', width: 1280, height: 720 },
  },
};

// behind your consent gate: the video plays once the visitor allows "media"
<VideoSection id="tour" content={content} Gate={ConsentGate} />

// without a gate: never embedded, the play control links to the video's page
<VideoSection content={content} layout="split" />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the paths to where the files landed.
Pass `Gate` from a server page: it is an import and a prop, no client component of your own. `ConsentGate` must sit
inside your `ConsentProvider` (the `site-cookie-consent` template's layout does that), and the provider's categories
must include the one the video needs (`category`, default `'media'`).

## The video and consent

- **With `Gate` and `video.embedSrc`:** the section renders `<Gate category={category} fallback={cover}>` with the
  video's `iframe` as its child. The frame is created in this template's own client file (`video-frame.tsx`), so until
  the gate grants the category the page holds no trace of it and the browser asks the video's host for nothing, also
  when another page links here and Next prefetches this one. The cover's play control is a button that opens the
  consent settings (`data-consent-open`); under the cover a notice says why, with a plain link to the video's page.
- **Without `Gate`, or without `embedSrc`:** never an `iframe`. The play control is a plain link to `video.href`.
- **The poster is your own picture**, served from your site. Never use the provider's thumbnail: it would be a
  request to that host from this page before consent, and from every page that links here, as Next prefetches it.
  Without a poster the cover is a plain box in your design's sunk ground.
- Every link is a plain `a`, so it works without JavaScript. `video.title` names the frame for screen readers.

## Layouts

Pick one with the `layout` prop; leave it out and the section is `centered`.

| `layout` | What it draws | Example |
|---|---|---|
| `centered` | the title and text centred above the video, one column up to `max-w-4xl` | `<VideoSection layout="centered" Gate={ConsentGate} content={{ title, text, video }} />` |
| `split` | the title and text beside the video from `md` (the video the wider column), above it on a phone | `<VideoSection layout="split" content={{ title, text, video: { title, href, poster } }} />` |

The section carries `data-layout` with the layout it drew. The cover and the video are 16:9; no text ever sits on the
poster: the play control is an icon, named for screen readers by its label.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title and the notice's link | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the text and the notice | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the notice's link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-surface-sunk` | the cover without a poster | `oklch(97% 0 none)` |
| `--oc-brand` | the play control's circle | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | that circle under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the play icon | `#fff` |
| `--oc-focus` | the focus ring of the play control and the link | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | corners: 2 × on the cover and the video, 1 × on a focused link | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink: #1d2b3a; --oc-radius: 0.5rem; }`. A `data-theme` wrapper
with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `VideoContent` | | `{ title, text?, video: VideoRef }` |
| `layout` | `'centered' \| 'split'` | `centered` | see Layouts |
| `Gate` | `GateComponent` | none | your consent gate, e.g. `ConsentGate`; without it the video is a link |
| `category` | `string` | `'media'` | the consent category the video needs |
| `labels` | `Partial<VideoLabels>` | English | see Labels |
| `ImageComponent` | `ImageComponent` | plain `img` | the poster, e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `VideoRef` is `{ title, href, embedSrc?, poster? }`: `href` the video's page on the provider's site, `embedSrc`
the address of its embed (shown only behind `Gate`), `poster` an `ImageRef` (`{ src, alt, width, height }`).

### With Next's Image

```tsx
import Image from 'next/image';
import type { ImageComponent } from '@/components/section-video/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<VideoSection content={content} Gate={ConsentGate} ImageComponent={NextImage} />
```

## Labels

The fixed strings, in `labels.ts` (English, the default) and `labels.de.ts` (German):

```tsx
import { VIDEO_LABELS_DE } from '@/components/section-video/labels.de';

<VideoSection content={content} Gate={ConsentGate} labels={VIDEO_LABELS_DE} />
```

| Key | English | |
|---|---|---|
| `play` | `Play the video (allows external media)` | the play control behind a gate |
| `watch` | `Watch the video` | the play control without a gate, and the notice's link |
| `notice` | `The video is loaded from another provider once you allow external media.` | under the cover |

## Keyboard and screen readers

- The section is a region named by its `h2`.
- The play control is a button behind a gate (it opens the consent settings, where the visitor allows the video) and a
  link without one; both are named by their label and draw a visible focus ring. The whole cover answers a click.
- The video's frame is named by `video.title`; the poster's `alt` says what it shows.

## Client islands

`video-frame.tsx` (`'use client'`): the video's `iframe`, created only where your gate renders it. Everything else is
rendered on the server.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
