# FAQ Section

Questions and answers on native `details`: each question opens its answer in place, keyboard complete without
JavaScript, in two layouts. Optionally only one answer is open at a time. Its colours, fonts and corner radius come
from your design system's tokens when you load them, and it keeps a neutral look when you do not. A server component
with typed content: every visible string comes in through `content`.

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

## Layouts

Pick one with the `layout` prop; leave it out and the FAQ is `centered`.

| `layout` | What it draws | Example |
|---|---|---|
| `centered` | one column on the page: the title and intro above the questions (left-aligned text, the list at most `max-w-3xl`) | `<FaqSection layout="centered" content={{ title, intro, items }} />` |
| `split` | the title and intro beside the questions from `lg`, above them below `lg` | `<FaqSection layout="split" content={{ title, intro, items }} />` |

`exclusive` works the same in both. The section carries `data-layout` with its layout.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section looks the same as before with no design system
loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title and the questions | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro and the answers | `oklch(37.1% 0 none)` |
| `--oc-ink-subtle` | the chevron | `oklch(55.6% 0 none)` |
| `--oc-line` | the rules between the questions | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus ring of a question | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | the corners of a question's focus ring (1 ×) | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-line: #dfe3e8; --oc-focus: #0b5cad; }`. A `data-theme`
wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `FaqContent` | | `{ title, intro?, items: FaqItem[] }` |
| `layout` | `'centered' \| 'split'` | `centered` | see Layouts |
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

- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
- Version 3.0.1 breaks a long word or address in an answer too (3.0.0 let it widen the page on a phone).
- Version 3.0.0 adds `layout` (`split`) and the design tokens. Without a design system and without `layout` it draws
  what 2.0.0 drew.
- Version 2.0.0 replaces the shadcn-based 1.0.0: no UI library, no JavaScript, content through typed props.
