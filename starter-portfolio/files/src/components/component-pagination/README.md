# Pagination

Page links for a paged list: previous, a window of page numbers with gaps, next. It takes the current page, the page
count and a function that builds each href, so it works with any URL scheme. The window itself is a pure function,
`pageWindow`, that you can use on its own. A server component with no JavaScript in the browser.

## Usage

```tsx
import { Pagination } from '@/components/component-pagination/pagination';

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const page = Number((await searchParams).page ?? '1');
  return <Pagination page={page} pageCount={12} hrefFor={(n) => `/blog?page=${n}`} />;
}
```

`Pagination` takes the page as the URL gives it: a page that is not a number (`?page=abc`, `?page=1&page=2`) reads
as 1, a fraction is rounded down, and anything outside `1…pageCount` is clamped, so a junk query string never breaks
the page. Use the same number when you slice the list.

### With Next's Link

Links render through `LinkComponent`, a plain `a` by default. In a Next app, pass `next/link` for client-side
navigation:

```tsx
import Link from 'next/link';

<Pagination page={page} pageCount={pageCount} hrefFor={(n) => `/blog?page=${n}`} LinkComponent={Link} />
```

### The window on its own

```ts
import { pageWindow } from '@/components/component-pagination/page-window';

pageWindow(5, 10); // [1, 'gap', 4, 5, 6, 'gap', 10]
pageWindow(5, 20, { boundaries: 2 }); // [1, 2, 3, 4, 5, 6, 'gap', 19, 20]
```

A gap always hides at least two pages (a single hidden page is shown instead), so with the defaults the window has
`min(pageCount, 7)` items and keeps its width while you page through. A page outside `1…pageCount` is clamped, a page
count below 1 gives `[]`, and a non-integer page, page count, `siblings` or `boundaries` throws a `RangeError`.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `page` | `number` | | the current page, 1-based; NaN reads as 1, a fraction is rounded down, then clamped into range |
| `pageCount` | `number` | | renders nothing when it is 1 or less |
| `hrefFor` | `(page: number) => string` | | builds each link's href |
| `siblings` | `number` | `1` | pages on each side of the current one |
| `boundaries` | `number` | `1` | pages always shown at each end |
| `labels` | `Partial<PaginationLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `className` | `string` | | on the `nav` |

## Labels

English by default. A German set ships beside it:

```tsx
import { PAGINATION_LABELS_DE } from '@/components/component-pagination/labels.de';

<Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} labels={PAGINATION_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `nav` | Pagination | Seitennavigation |
| `previous` | Previous | Zurück |
| `next` | Next | Weiter |
| `page(n)` | Page n | Seite n |
| `gap` | … | … |

Pass a partial object to change single strings. Two paginations on one page need different `nav` names, so each
landmark can be told apart.

## Keyboard and screen readers

- A `nav` landmark named by `labels.nav`, holding a list of links.
- Tab moves through previous, each page and next. On the first page "previous", and on the last page "next", is
  plain text with `aria-disabled="true"`, not a link, so it is skipped.
- Page links show the number and are named by `labels.page(n)` ("Page 5"); the current one carries
  `aria-current="page"`. Previous and next carry `rel="prev"` and `rel="next"`.
- Gaps are hidden from screen readers and are not focusable.

## Client islands

None.

## Notes

- Neutral colours only, with every margin, border and box size set on the element itself, so it looks the same with
  or without Tailwind's preflight.
- Cursor-based pagination is not covered; this component pages by number.
