# Hero Section

The opening section of a page: an optional eyebrow, the title, a lead, calls to action and an optional image, in
four layouts. Its colours, fonts and corner radius come from your design system's tokens when you load them, and it
keeps a neutral look when you do not. A server component with typed content: every visible string comes in through
`content`.

## Usage

```tsx
import { HeroSection } from '@/components/section-hero/hero-section';

<HeroSection
  content={{
    eyebrow: 'Example Ltd',
    title: 'Plans that hold, from the first sketch to the finished work',
    lead: 'One team and one point of contact from start to finish.',
    ctas: [
      { href: '/contact', label: 'Book a call', variant: 'primary' },
      { href: '/services', label: 'See what we do', variant: 'secondary' },
    ],
    image: { src: '/hero.jpg', alt: 'The workshop', width: 1280, height: 960 },
  }}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

The heading is an `h1` by default, because a hero usually opens the page. A hero further down a page takes
`headingLevel={2}`, so the page keeps exactly one `h1`.

### With Next's Link and Image

The calls to action render through `LinkComponent` (a plain `a` by default) and the image through `ImageComponent`
(a plain `img` by default):

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { ImageComponent } from '@/components/section-hero/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<HeroSection content={content} LinkComponent={Link} ImageComponent={NextImage} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the hero is `split` with an image and `centered` without one.

| `layout` | What it draws | Example |
|---|---|---|
| `split` | text and image side by side from `md`, stacked on a phone | `<HeroSection layout="split" content={{ title, lead, ctas, image }} />` |
| `centered` | the text centred in one column, the image (if any) below it | `<HeroSection layout="centered" content={{ title, lead, ctas }} />` |
| `image` | the image fills the section, the text sits on a panel over it | `<HeroSection layout="image" content={{ title, lead, ctas, image }} />` |
| `type` | large type, with the lead, `points` and the calls to action beside a rule; no image | `<HeroSection layout="type" content={{ title, lead, points, ctas }} />` |

`split` and `image` need an image: without one they draw `centered`. `points` (a short list of strings) shows only
in `type`. The section carries `data-layout` with the layout it drew.

## Brand

The hero reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the hero looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the section's text, the secondary call to action's text | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the lead and the points | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the eyebrow | `oklch(43.9% 0 none)` |
| `--oc-surface` | the secondary call to action, the panel in `image` | `#fff` |
| `--oc-surface-sunk` | the secondary call to action under the pointer | `oklch(97% 0 none)` |
| `--oc-line-strong` | the secondary call to action's border | `oklch(87% 0 none)` |
| `--oc-brand` | the primary call to action, the rule and the points' marks in `type` | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | the primary call to action under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the primary call to action's text | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | corners: 1.5 × on the calls to action, 2 × on the image and the panel | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; --oc-radius: 0.5rem; }`.
A `data-theme` wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `HeroContent` | | `{ eyebrow?, title, lead?, ctas?, image?, points? }` |
| `layout` | `'split' \| 'centered' \| 'image' \| 'type'` | `split` with an image, else `centered` | see Layouts |
| `headingLevel` | `1 \| 2` | `1` | the heading's level |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

`ctas` are `Cta` items: `{ href, label, variant: 'primary' | 'secondary' }`, rendered in order with a
`data-variant` attribute. `image` is an `ImageRef`: `{ src, alt, width, height }`; an empty `alt` makes it
decorative.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its heading (`aria-labelledby`).
- The calls to action are ordinary links in reading order, with a visible focus ring.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column and a long call to action wraps onto a second line, so nothing leaves a phone
  screen.
- Version 3.0.0 adds `layout`, `points` and the design tokens. Without a design system and without `layout` it draws
  what 2.0.0 drew; a call to action now wraps instead of staying on one line.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
