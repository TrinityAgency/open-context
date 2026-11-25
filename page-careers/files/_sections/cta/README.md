# CTA Section

A call to action: a title, an optional line of text and its links, in three layouts. Its colours, fonts and corner
radius come from your design system's tokens when you load them, and it keeps a neutral look when you do not. A
server component with typed content: every visible string comes in through `content`.

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

## Layouts

Pick one with the `layout` prop; leave it out and the call to action is `centered`.

| `layout` | What it draws | Example |
|---|---|---|
| `centered` | title, text and links centred on a light band | `<CtaSection layout="centered" content={{ title, text, ctas }} />` |
| `split` | title and text beside the links from `md`, on the light band, stacked on a phone | `<CtaSection layout="split" content={{ title, text, ctas }} />` |
| `band` | centred on a full-width band in the brand colour: text in on-brand, the primary link inverse (surface with brand-coloured text), the secondary one transparent with an on-brand border | `<CtaSection layout="band" content={{ title, text, ctas }} />` |

On `band` every focus ring is drawn in on-brand, because many design systems make the focus colour the brand colour
itself and a ring in it would vanish on the band. The section carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface-sunk` | the light band (`centered`, `split`); the secondary link under the pointer | `oklch(97% 0 none)` |
| `--oc-ink` | the title, the secondary link's text | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the line of text | `oklch(37.1% 0 none)` |
| `--oc-surface` | the secondary link; the primary link on `band` | `#fff` |
| `--oc-surface-alt` | the primary link on `band` under the pointer | `oklch(98.5% 0 none)` |
| `--oc-line-strong` | the secondary link's border | `oklch(87% 0 none)` |
| `--oc-brand` | the primary link; the ground of `band` | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | the primary link under the pointer; the secondary link on `band` under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the primary link's text; every text, border and focus ring on `band` | `#fff` |
| `--oc-brand-ink` | the primary link's text on `band` | `oklch(20.5% 0 none)` |
| `--oc-focus` | the focus ring (`centered`, `split`) | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | the links' corners (1.5 ×) | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks the pairs this section draws: body text on the light
band, on-brand on brand, brand-ink on surface) and the `design-system-seed` skill. To set them by hand, declare them
once in your global stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; --oc-radius: 0.5rem; }`. A
`data-theme` wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `CtaContent` | | `{ title, text?, ctas }` |
| `layout` | `'centered' \| 'split' \| 'band'` | `centered` | see Layouts |
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

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside the column and a long call to action wraps onto a second line, so nothing leaves a phone
  screen.
- Version 3.0.0 adds `layout` (`split`, `band`) and the design tokens. Without a design system and without `layout`
  it draws what 2.0.0 drew; a call to action now wraps instead of staying on one line.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
