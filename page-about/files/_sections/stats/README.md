# Stats Section

Key figures, such as years in business or projects finished, as a description list: each figure's label is the
term, its value the definition, shown large above the label, with an optional line of description. One to four
columns by width. A server component with typed content: every visible string comes in through `content`.

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

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `StatsContent` | | `{ title, intro?, items: Stat[] }` |
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

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, server-rendered, content through typed props.
