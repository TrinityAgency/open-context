# CTA Section

A call-to-action band: a title, an optional line of text and its links, centred on a light band. A server component
with typed content: every visible string comes in through `content`.

## Usage

```tsx
import { CtaSection } from '@/components/section-cta/cta-section';

<CtaSection
  id="contact"
  content={{
    title: 'Ready when you are',
    text: 'Tell us what you are planning. We answer within one working day.',
    ctas: [
      { href: '/contact', label: 'Book a call', variant: 'primary' },
      { href: '/about', label: 'Read more first', variant: 'secondary' },
    ],
  }}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### With Next's Link

The links render through `LinkComponent` (a plain `a` by default):

```tsx
import Link from 'next/link';

<CtaSection content={content} LinkComponent={Link} />
```

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `CtaContent` | | `{ title, text?, ctas }` |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

`ctas` are `Cta` items: `{ href, label, variant: 'primary' | 'secondary' }`, rendered in order with a
`data-variant` attribute. An empty list renders the band without a link row.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2` (`aria-labelledby`).
- The links are ordinary links in reading order, with a visible focus ring.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight. The band is `bg-neutral-100`; remap the neutral scale in `@theme` to theme it.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
