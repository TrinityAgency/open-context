# Logo Cloud Section

Client or partner logos under (or beside) a small heading, each optionally linked, in two layouts. Its colours,
fonts and corner radius come from your design system's tokens when you load them, and it keeps a neutral look when
you do not. A server component with typed content: every visible string comes in through `content`.

## Usage

```tsx
import { LogoCloudSection } from '@/components/section-logo-cloud/logo-cloud-section';

<LogoCloudSection
  content={{
    title: 'Trusted by teams who plan ahead',
    logos: [
      { name: 'Example Builders', image: { src: '/logos/example-builders.svg', alt: '', width: 120, height: 32 } },
      { name: 'Demo Studio', image: { src: '/logos/demo-studio.svg', alt: '', width: 120, height: 32 }, href: '/work/demo-studio' },
    ],
  }}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

Logos are shown 2rem high at their own aspect ratio (`width` and `height` give it). Serve them from your own site:
a logo loaded from another host is a request to a third party.

### With Next's Link and Image

Linked logos render through `LinkComponent` (a plain `a` by default) and every logo through `ImageComponent` (a
plain `img` by default):

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { ImageComponent } from '@/components/section-logo-cloud/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<LogoCloudSection content={content} LinkComponent={Link} ImageComponent={NextImage} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the logos are a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | a small centred title above the logos in two, three or six columns as the width grows | `<LogoCloudSection layout="grid" content={{ title, logos }} />` |
| `split` | the title beside the logos from `md` (two or three columns of logos), stacked on a phone | `<LogoCloudSection layout="split" content={{ title, logos }} />` |

The section carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title in `split` | `oklch(20.5% 0 none)` |
| `--oc-ink-muted` | the small title in `grid` | `oklch(43.9% 0 none)` |
| `--oc-focus` | the focus ring of a linked logo | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | the corners of a linked logo's focus ring (1 ×) | `0.25rem` |

The logos keep their own colours: recolour them in the SVG files themselves. To set the tokens from a claude.ai
design system, use the `design-tokens` template (its `design-sync.mjs` writes them as aliases of your design's own
tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare them once in your global
stylesheet, e.g. `:root { --oc-ink-muted: #5b6573; --oc-focus: #0b5cad; }`. A `data-theme` wrapper with its own
values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `LogoCloudContent` | | `{ title, logos: LogoItem[] }` |
| `layout` | `'grid' \| 'split'` | `grid` | see Layouts |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `LogoItem` is `{ name, image, href? }`; `image` is an `ImageRef` (`{ src, alt, width, height }`). An empty `logos`
renders the heading only.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its heading, an `h2` styled small.
- Every logo has a text alternative: the image's `alt`, or the logo's `name` when `alt` is empty, so a logo is never
  silent and a linked logo's link always has a name.
- Linked logos are links in reading order with a visible focus ring; unlinked logos are not focusable.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables. Monochrome logos
  fit best; recolour them in the SVG files themselves.
- Long words in the title break inside its column, so nothing leaves a phone screen.
- Version 3.0.0 adds `layout` (`split`) and the design tokens. Without a design system and without `layout` it draws
  what 2.0.0 drew.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
