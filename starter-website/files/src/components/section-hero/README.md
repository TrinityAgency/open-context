# Hero Section

The opening section of a page: an optional eyebrow, the title, a lead, calls to action and an optional image. With
an image, text and image sit side by side from `md` up; without one, the text is centred. A server component with
typed content: every visible string comes in through `content`.

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

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `HeroContent` | | `{ eyebrow?, title, lead?, ctas?, image? }` |
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

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
