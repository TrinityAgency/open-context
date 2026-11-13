# Accordion

A disclosure list on native `details` and `summary`: each item opens and closes by click, Enter or Space with no
JavaScript at all. In exclusive mode only one item is open at a time, through the browser's own `details name`
grouping. A server component.

## Usage

```tsx
import { Accordion } from '@/components/component-accordion/accordion';

const faq = [
  { id: 'delivery', title: 'How long does delivery take?', content: 'Three to five working days.' },
  { id: 'returns', title: 'Can I return an order?', content: 'Yes, within 30 days.' },
];

<Accordion items={faq} />
<Accordion items={faq} exclusive name="faq" defaultOpen={['delivery']} />
```

`title` and `content` take any React node, so an answer can hold links, lists or images. Each item's `id` lands on
its `details`, so `/faq#returns` scrolls to it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `items` | `AccordionItem[]` | | `{ id, title, content }` |
| `defaultOpen` | `string[]` | `[]` | ids open on first render |
| `exclusive` | `boolean` | `false` | only one item open at a time |
| `name` | `string` | | required with `exclusive`; unique per page |
| `className` | `string` | | on the wrapper |

## Labels

None: the accordion has no text of its own. Every visible string is in your `items`.

## Keyboard and screen readers

- Tab moves from summary to summary; Enter or Space opens and closes an item. Screen readers announce each summary
  as a button with its expanded state; this is the browser's own `details` behaviour.
- The turning chevron is an inline SVG with `aria-hidden="true"`. It turns only under
  `prefers-reduced-motion: no-preference`; with reduced motion it switches without a transition.
- The content of a closed item is hidden from everyone; the browser's find-in-page can still open it.

## Client islands

None.

## Notes

- Exclusive mode needs a browser with `details name` grouping (Chrome 120, Safari 17.2, Firefox 130). Older
  browsers simply let several items open.
- The open item's height does not animate; only the chevron turns. A height animation is left out on purpose: it
  needs either JavaScript or CSS that is not yet in every browser.
- Neutral colours only, with borders and margins set on the elements, so it looks the same with or without
  Tailwind's preflight.
