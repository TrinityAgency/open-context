# Process Section

How you work, as numbered steps: each a title and an optional description, in two layouts. Its colours and fonts
come from your design system's tokens when you load them, and it keeps a neutral look when you do not. A server
component with typed content: every visible string comes in through `content`.

## Usage

```tsx
import { ProcessSection } from '@/components/section-process/process-section';

<ProcessSection
  id="process"
  content={{
    title: 'How we work',
    intro: 'Four steps from the first call to the finished work.',
    steps: [
      { title: 'We listen', description: 'A first call to understand what you need, at no cost.' },
      { title: 'We plan it with you', description: 'A written plan with prices and dates.' },
      { title: 'We build' },
      { title: 'We stay', description: 'We look after the finished work.' },
    ],
  }}
/>

<ProcessSection layout="grid" content={content} />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

## Layouts

Pick one with the `layout` prop; leave it out and the steps are `rows`.

| `layout` | What it draws | Example |
|---|---|---|
| `rows` | one step per row, its number in a round badge beside the title and description, a thin rule joining the badges | `<ProcessSection layout="rows" content={{ title, intro, steps }} />` |
| `grid` | the steps in one, two or three columns as the width grows, each badge above its title | `<ProcessSection layout="grid" content={{ title, intro, steps }} />` |

The section carries `data-layout` with its layout. The badge holds up to two digits; a process of more than a dozen
steps reads better split into two sections.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title and the step titles | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the descriptions | `oklch(37.1% 0 none)` |
| `--oc-brand` | the number badge's ground | `oklch(20.5% 0 none)` |
| `--oc-on-brand` | the number in the badge | `#fff` |
| `--oc-line` | the rule joining the badges in `rows` | `oklch(92.2% 0 none)` |
| `--oc-font-heading` | the title and the step titles | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-brand: #1d4ed8; --oc-on-brand: #fff; }`. A `data-theme`
wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `ProcessContent` | | `{ title, intro?, steps: ProcessStep[] }` |
| `layout` | `'rows' \| 'grid'` | `rows` | see Layouts |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `ProcessStep` is `{ title, description? }`; a step without a description draws its title only. An empty `steps`
renders the heading and intro only.

## Labels

None: the section has no fixed strings. The numbers are counted from the steps' order, everything else comes from
`content`.

## Keyboard and screen readers

- The section is a region named by its `h2`; the steps are an ordered list (`ol`), each title an `h3`.
- The number is text, so a screen reader reads it before the title, also where a list style of `none` hides the
  list's own count. The joining rule is decoration (`aria-hidden`).
- Nothing in the section takes focus.

## Client islands

None.

## Notes

- Colours and fonts only through the tokens above, and every margin and box set on the element, so it looks the same
  with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
- The steps describe how you work; they are not a progress indicator (no current step, no state).
