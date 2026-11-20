# Features Section

A titled list of features, each with an optional icon, a title, a description and an optional image, in three
layouts. Its colours, fonts and corner radius come from your design system's tokens when you load them, and it keeps
a neutral look when you do not. A server component with typed content: every visible string comes in through
`content`.

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

## Layouts

Pick one with the `layout` prop; leave it out and the features are a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | cards in one, two or three columns as the width grows | `<FeaturesSection layout="grid" content={{ title, intro, items }} />` |
| `rows` | one feature per row, text beside its image from `md`, the image side alternating | `<FeaturesSection layout="rows" content={{ title, items: [{ title, description, image }] }} />` |
| `split` | the title and intro in one column beside the features from `md`, stacked on a phone | `<FeaturesSection layout="split" content={{ title, intro, items }} />` |

In `rows` a feature without an image keeps its text in the row's first column, as 2.0.0 drew it. The section
carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the feature titles, the icons | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the descriptions | `oklch(37.1% 0 none)` |
| `--oc-surface-sunk` | the icon's box | `oklch(97% 0 none)` |
| `--oc-font-heading` | the title and the feature titles | the page's font |
| `--oc-radius` | corners: 1.5 × on the icon's box, 2 × on the images | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink: #1d2b3a; --oc-radius: 0.5rem; }`. A `data-theme` wrapper
with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `FeaturesContent` | | `{ title, intro?, items: Feature[] }` |
| `layout` | `'grid' \| 'rows' \| 'split'` | `grid` | see Layouts |
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
- In `split`, the title and intro come before the features in reading order at every width.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
- Version 3.0.0 adds the `split` layout and the design tokens. Without a design system it draws what 2.0.0 drew, in
  `grid` and in `rows`.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
