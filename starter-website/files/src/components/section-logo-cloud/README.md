# Logo Cloud Section

A row of client or partner logos under a small heading, each optionally linked: two columns on phones, up to six on
wide screens. A server component with typed content: every visible string comes in through `content`.

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

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `LogoCloudContent` | | `{ title, logos: LogoItem[] }` |
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

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight. Monochrome logos fit best; recolour them in the SVG files themselves.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
