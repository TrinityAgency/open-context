# Testimonials Section

Quotes from clients, each with the person's name, role and an optional portrait, in three layouts. Its colours,
fonts and corner radius come from your design system's tokens when you load them, and it keeps a neutral look when
you do not. A server component with typed content: every visible string comes in through `content`.

## Usage

```tsx
import { TestimonialsSection } from '@/components/section-testimonials/testimonials-section';

<TestimonialsSection
  content={{
    title: 'What clients say',
    items: [
      {
        quote: 'They kept to the plan and to the budget.',
        name: 'Alex Example',
        role: 'Operations lead, Example Builders',
        image: { src: '/people/alex.jpg', alt: '', width: 80, height: 80 },
      },
      { quote: 'One person to call for everything.', name: 'Jordan Example' },
    ],
  }}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

Publish only quotes the person agreed to, in their words.

### With Next's Image

Portraits render through `ImageComponent` (a plain `img` by default):

```tsx
import Image from 'next/image';
import type { ImageComponent } from '@/components/section-testimonials/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<TestimonialsSection content={content} ImageComponent={NextImage} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the quotes are a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | quote cards in one, two or three columns as the width grows | `<TestimonialsSection layout="grid" content={{ title, items }} />` |
| `centered` | one large quote per row, centred, the portrait and name below it | `<TestimonialsSection layout="centered" content={{ title, items: [{ quote, name, role, image }] }} />` |
| `wall` | cards of their own heights in flowing columns, for many quotes of different lengths | `<TestimonialsSection layout="wall" content={{ title, items }} />` |

A quote without a portrait shows the name and role alone, in every layout. In `wall` a card never breaks across two
columns. The section carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the names | `oklch(20.5% 0 none)` |
| `--oc-ink-soft` | the quotes | `oklch(26.9% 0 none)` |
| `--oc-ink-muted` | the roles | `oklch(43.9% 0 none)` |
| `--oc-surface` | the cards in `grid` and `wall` | `#fff` |
| `--oc-line` | the cards' border | `oklch(92.2% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | the cards' corners (2 ×) | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink-soft: #2a3340; --oc-radius: 0.5rem; }`. A `data-theme`
wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `TestimonialsContent` | | `{ title, items: Testimonial[] }` |
| `layout` | `'grid' \| 'centered' \| 'wall'` | `grid` | see Layouts |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `Testimonial` is `{ quote, name, role?, image? }`; `image` is an `ImageRef` (`{ src, alt, width, height }`). An
empty `items` renders the heading only.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2`.
- Each testimonial is a `figure`: the quote is a `blockquote`, and the `figcaption` names who said it.
- A portrait whose `alt` is empty is decorative (the name beside it already says who it is); give it an `alt` only
  when the picture adds something.

## Client islands

None.

## Notes

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
- Version 3.0.0 adds `layout` (`centered`, `wall`) and the design tokens. Without a design system and without
  `layout` it draws what 2.0.0 drew.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
