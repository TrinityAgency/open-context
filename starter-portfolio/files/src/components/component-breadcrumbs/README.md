# Breadcrumbs

A breadcrumb trail from the home page to the current page. Long trails collapse into "first … last three" with a
native `details` overflow that needs no JavaScript. Given the site's URL, it also renders the matching
`BreadcrumbList` JSON-LD, so search engines read the same trail people see. A server component.

## Usage

```tsx
import { Breadcrumbs } from '@/components/component-breadcrumbs/breadcrumbs';

<Breadcrumbs
  items={[
    { href: '/', label: 'Home' },
    { href: '/services', label: 'Services' },
    { href: '/services/consulting', label: 'Consulting' },
  ]}
  baseUrl="https://example.com"
/>
```

The last item is the current page: it renders as text with `aria-current="page"`, its `href` is used only in the
JSON-LD.

### With Next's Link

Links render through `LinkComponent`, a plain `a` by default. In a Next app, pass `next/link`:

```tsx
import Link from 'next/link';

<Breadcrumbs items={items} LinkComponent={Link} />
```

### The parts on their own

```ts
import { collapseTrail } from '@/components/component-breadcrumbs/collapse-trail';
import { breadcrumbListJsonLd, jsonLdHtml } from '@/components/component-breadcrumbs/breadcrumb-json-ld';

collapseTrail(items, 4); // { head: [first], hidden: [...], tail: [last three] }
breadcrumbListJsonLd(items, 'https://example.com'); // schema.org BreadcrumbList, absolute item URLs
jsonLdHtml(data); // JSON safe to put inside <script type="application/ld+json">
```

`collapseTrail` throws a `RangeError` for a `maxVisible` that is not an integer ≥ 2. `breadcrumbListJsonLd` throws a
`TypeError` for a base URL that is not absolute http(s). `jsonLdHtml` writes `<`, `>` and `&` as
`\u003c`, `\u003e` and `\u0026`, so a label like `</script>` cannot end the script element; the JSON still parses to the same object.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `items` | `LinkItem[]` | | `{ href, label }` from home to the current page; empty renders nothing |
| `maxVisible` | `number` | `4` | longer trails collapse |
| `baseUrl` | `string` | | absolute site URL; when given, the JSON-LD script is rendered |
| `labels` | `Partial<BreadcrumbsLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `className` | `string` | | on the `nav` |

## Labels

English by default. A German set ships beside it:

```tsx
import { BREADCRUMBS_LABELS_DE } from '@/components/component-breadcrumbs/labels.de';

<Breadcrumbs items={items} labels={BREADCRUMBS_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `nav` | Breadcrumb | Brotkrümelpfad |
| `more` | Show full path | Ganzen Pfad anzeigen |

## Keyboard and screen readers

- A `nav` landmark named by `labels.nav`, holding an ordered list.
- Tab moves through the links. The overflow "…" is a `summary`: Enter or Space opens it, and Tab then reaches the
  hidden links. Its accessible name is `labels.more`.
- Separators are inline SVG with `aria-hidden="true"`.
- The current page is text with `aria-current="page"`, not a link.

## Client islands

None.

## Notes

- One trail per page renders the JSON-LD; leave `baseUrl` off on a second trail.
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without Tailwind's
  preflight.
