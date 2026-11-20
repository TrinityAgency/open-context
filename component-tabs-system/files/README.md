# Tabs

Tabs with automatic activation (selection follows focus), roving focus and an optional URL sync. Every panel renders
on the server; a small client island handles the selection, the keys and the URL.

## Usage

```tsx
import { Tabs } from '@/components/component-tabs-system/tabs';

const items = [
  { id: 'consulting', label: 'Consulting', content: <p>We listen before we plan.</p> },
  { id: 'planning', label: 'Planning', content: <p>A plan with timeline, cost and contacts.</p> },
  { id: 'delivery', label: 'Delivery', content: <p>Weekly reports and a clean handover.</p> },
];

<Tabs items={items} label="Services" />
<Tabs items={items} label="Services" defaultTab="planning" param="tab" />
```

With `param="tab"`, selecting a tab writes `?tab=<id>` into the address bar with `history.replaceState` (no new
history entry), so a link or a reload opens that tab. Other search params are kept. An unknown id in the URL is
ignored and the default tab shows.

### The key and URL helpers

```ts
import { nextIndex, searchWithTab, tabFromSearch } from '@/components/component-tabs-system/tab-keys';

nextIndex('ArrowRight', 2, 3); // 0 (wraps)
tabFromSearch('?tab=b', 'tab', ['a', 'b']); // 'b'
searchWithTab('?x=1&tab=a', 'tab', 'b'); // '?x=1&tab=b'
```

## Brand

The tabs read these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so they look the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-brand-ink` | the selected tab's underline (brand-ink, not brand: its contrast on the surface is checked) | `oklch(20.5% 0 none)` |
| `--oc-ink` | the selected tab's label; a tab under the pointer | `oklch(20.5% 0 none)` |
| `--oc-ink-muted` | the other tabs' labels | `oklch(43.9% 0 none)` |
| `--oc-ink-body` | the panel's text | `oklch(37.1% 0 none)` |
| `--oc-line` | the line under the tab list | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-font-body` | the tabs' labels | the page's font |
| `--oc-radius` | the panel's focus ring corners | `0.25rem` |

The tabs draw no ground of their own: they sit on the page's, usually `--oc-surface`. To set the tokens from a
claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as aliases of your
design's own tokens, light and dark, and checks the pairs these draw: ink, muted and body text and brand-ink on the
surface, the focus ring) and the `design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-brand-ink: #0b5cad; --oc-ink: #111827; }`.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `items` | `TabItem[]` | | `{ id, label, content }`; empty renders nothing |
| `label` | `string` | | the tab list's accessible name |
| `defaultTab` | `string` | first id | selected on first render |
| `param` | `string` | | URL search param to keep the selection in |
| `className` | `string` | | on the wrapper |

## Labels

None of its own: the tab list's name is the `label` prop, the tab names and panels are your `items`.

## Keyboard and screen readers

- `role="tablist"` named by `label`, buttons with `role="tab"`, `aria-selected` and `aria-controls`, panels with
  `role="tabpanel"` and `aria-labelledby`.
- Tab enters the list on the selected tab; the next Tab moves to its panel. ArrowRight and ArrowLeft move between
  tabs and wrap around; Home and End go to the first and last. Selection follows focus.
- Inactive panels carry `hidden`. The colour change runs only under `prefers-reduced-motion: no-preference`.

## Client islands

`tabs-client.tsx` (`'use client'`). `tabs.tsx` is a server component; the panels' content renders on the server.

## Notes

- With `param`, the URL is read after hydration, so the server always renders `defaultTab` and the tab named in the
  URL takes over a moment later. Read the param on the server and pass it as `defaultTab` if that flash matters.
- Panels are not lazy: every panel's content is in the HTML.
- Every colour is a design token with the neutral look as its fallback; the tab buttons reset their own font, border,
  padding and background, so they look the same with or without Tailwind's preflight.
- 2.0.0: the design tokens are new; without a design system the tabs draw what 1.0.0 drew. The tab list scrolls
  sideways when its labels are wider than the page; a word wider than a panel breaks.
