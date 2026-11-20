# Stats Section

Key figures, such as years in business or projects finished, as a description list: each figure's label is the
term, its value the definition, shown large above the label, with an optional line of description, in three
layouts. Its colours and fonts come from your design system's tokens when you load them, and it keeps a neutral look
when you do not. A server component with typed content: every visible string comes in through `content`.

## Usage

```tsx
import { StatsSection } from '@/components/section-stats/stats-section';

<StatsSection
  content={{
    title: 'In figures',
    intro: 'What twelve years add up to.',
    items: [
      { value: '12', label: 'years in business' },
      { value: '340+', label: 'projects finished', description: 'from refits to whole buildings' },
      { value: '98%', label: 'on time' },
    ],
  }}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

Values are strings, so you format them yourself (`340+`, `98%`, `1,200`) in the site's language.

## Layouts

Pick one with the `layout` prop; leave it out and the figures are a `grid`.

| `layout` | What it draws | Example |
|---|---|---|
| `grid` | the figures in one, two or four columns below the title | `<StatsSection layout="grid" content={{ title, intro, items }} />` |
| `split` | the title and intro beside the figures (two columns of them) from `md`, stacked on a phone | `<StatsSection layout="split" content={{ title, intro, items }} />` |
| `band` | a full-width band on the brand colour; the title, figures, labels, descriptions and rules in on-brand | `<StatsSection layout="band" content={{ title, items }} />` |

In every layout the value is shown above its label while the label stays first in the reading order. The section
carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title and the values | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the labels and descriptions | `oklch(43.9% 0 none)` |
| `--oc-line` | the rule beside each figure | `oklch(92.2% 0 none)` |
| `--oc-brand` | the ground of `band` | `oklch(20.5% 0 none)` |
| `--oc-on-brand` | every text and rule in `band` | `#fff` |
| `--oc-font-heading` | the title | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill; its contrast check holds
`on-brand` on `brand` to 4.5:1, which `band` relies on. To set them by hand, declare them once in your global
stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff; }`. A `data-theme` wrapper with its own values
re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `StatsContent` | | `{ title, intro?, items: Stat[] }` |
| `layout` | `'grid' \| 'split' \| 'band'` | `grid` | see Layouts |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `Stat` is `{ value, label, description? }`. An empty `items` renders the heading and intro only.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2`.
- The figures are a `dl`: a screen reader reads each label (the term) before its value, while the value is shown
  first (CSS `order`), so the visual order never changes what is announced.

## Client islands

None.

## Notes

- Colours and fonts only through the tokens above, and every margin and box set on the element, so it looks the same
  with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
- Version 3.0.0 adds `layout` (`split`, `band`) and the design tokens. Without a design system and without `layout`
  it draws what 2.0.0 drew.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
