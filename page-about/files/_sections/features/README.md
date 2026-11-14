# Features Section

A titled list of features, each with an optional icon, a title, a description and an optional image. Two layouts:
`grid` (the default) shows cards in one, two or three columns; `rows` gives each feature its own row, text beside
the image from `md` up, the image side alternating. A server component with typed content: every visible string
comes in through `content`.

## Usage

```tsx
import { FeaturesSection } from '@/components/section-features/features-section';

<FeaturesSection
  id="features"
  content={{
    title: 'What you get',
    intro: 'Three things every project includes.',
    items: [
      { title: 'A plan that holds', description: 'Scope, budget and dates first.', icon: 'M4 6h16M4 12h16M4 18h10' },
      { title: 'Work you can check', description: 'Every step written down.', icon: 'M5 12.5l4.5 4.5L19 7' },
      { title: 'Answers within a day', description: 'One contact person.', image: { src: '/team.jpg', alt: 'The team', width: 640, height: 400 } },
    ],
  }}
/>

<FeaturesSection layout="rows" content={content} />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### Icons

`icon` is the `d` attribute of one SVG path drawn in a 24 × 24 box with a 1.5 stroke (the style of most outline
icon sets), so content stays plain data and no icon package is needed. It renders as an inline `svg` with
`aria-hidden="true"`; the title carries the meaning.

### With Next's Image

Images render through `ImageComponent` (a plain `img` by default):

```tsx
import Image from 'next/image';
import type { ImageComponent } from '@/components/section-features/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<FeaturesSection content={content} ImageComponent={NextImage} />
```

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `FeaturesContent` | | `{ title, intro?, items: Feature[] }` |
| `layout` | `'grid' \| 'rows'` | `grid` | cards in columns, or alternating rows |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `Feature` is `{ title, description, icon?, image? }`; `image` is an `ImageRef` (`{ src, alt, width, height }`). An
empty `items` renders the heading and intro only. In `rows`, each `li` carries `data-side` (`start` or `end`): the
side its image takes from `md` up.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2`; each feature's title is an `h3`, so the page outline lists them.
- In `rows`, the text comes before the image in reading order on every row; only the visual side alternates.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
