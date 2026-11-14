# FAQ Section

Questions and answers on native `details`: each question opens its answer in place, keyboard complete without
JavaScript. Optionally only one answer is open at a time. A server component with typed content: every visible
string comes in through `content`.

## Usage

```tsx
import { FaqSection } from '@/components/section-faq/faq-section';

<FaqSection
  id="faq"
  content={{
    title: 'Questions, answered',
    intro: 'What people ask us before a first call.',
    items: [
      {
        question: 'How long does a typical project take?',
        answer: 'Six to ten weeks from the first call.\n\nWe agree the dates in writing before work starts.',
      },
      { question: 'What does the first call cost?', answer: 'Nothing.' },
    ],
  }}
/>

<FaqSection content={content} exclusive />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

An answer is plain text: a blank line starts a new paragraph.

### Structured data

The section emits no JSON-LD. If your site has `site-seo`, put the same items into a `FAQPage` beside it:

```tsx
import { JsonLd, faqPageJsonLd } from '@/utils/site-seo';

<JsonLd data={faqPageJsonLd(content.items)} />
<FaqSection content={content} />
```

Only use `FAQPage` for questions you answer yourself on that page.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `FaqContent` | | `{ title, intro?, items: FaqItem[] }` |
| `exclusive` | `boolean` | `false` | one answer open at a time |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

A `FaqItem` is `{ question, answer }`. An empty `items` renders the heading and intro only.

## Labels

None: the section has no fixed strings. Everything it shows comes from `content`.

## Keyboard and screen readers

- The section is a region named by its `h2`.
- Each question is a `summary`: Tab reaches it, Enter or Space opens and closes its answer, and screen readers
  announce it as expanded or collapsed. All of it is the browser's own behaviour; no script runs.
- With `exclusive`, the browser closes the open answer when another opens (`details` sharing a `name`). Browsers
  without that feature simply let several stay open.
- The chevron is an inline SVG with `aria-hidden="true"`; it turns only behind `motion-safe:`.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, no JavaScript, content through typed props.
