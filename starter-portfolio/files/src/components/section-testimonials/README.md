# Testimonials Section

Quotes from clients, each with the person's name, role and an optional portrait, in one to three columns by width.
A server component with typed content: every visible string comes in through `content`.

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

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `TestimonialsContent` | | `{ title, items: Testimonial[] }` |
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

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
