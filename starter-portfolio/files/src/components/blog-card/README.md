# Blog Card

A post preview for listings: the post image, its category, the title as a link, the description, then the date,
the reading time and the authors. A server component that takes the post as data, so it fits posts from any source
with the kit's `Post` shape (the `blog-content` loader gives exactly that).

## Usage

```tsx
import { BlogCard } from '@/components/blog-card/blog-card';

<ul className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3">
  {posts.map((post) => (
    <li key={post.slug} className="m-0 flex p-0">
      <BlogCard
        post={post}
        href={`/blog/${post.slug}`}
        authors={authors}
        category={categories.find((c) => c.id === post.category)}
        headingLevel={2}
        className="w-full"
      />
    </li>
  ))}
</ul>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

### With Next's Link and Image

The title link renders through `LinkComponent` and the image through `ImageComponent`, a plain `a` and `img` by
default. In a Next app, pass `next/link` and a `next/image` wrapper:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { ComponentProps } from 'react';

function NextImage(props: ComponentProps<typeof Image>) {
  return <Image {...props} sizes="(min-width: 768px) 33vw, 100vw" />;
}

<BlogCard post={post} href={`/blog/${post.slug}`} LinkComponent={Link} ImageComponent={NextImage} />
```

### The date on its own

```ts
import { formatPostDate } from '@/components/blog-card/format-date';

formatPostDate('2026-03-01', 'en');                // Mar 1, 2026
formatPostDate('2026-03-01T23:30:00-05:00', 'de'); // 01.03.2026
```

It shows the calendar date written at the start of the value, whatever the offset, so a post dated late in the
evening in New York does not show the next day. A value that does not start with a real date throws a `RangeError`.

## Props

| Prop | |
|---|---|
| `post` | the kit's `Post` (`site-types.ts`) |
| `href` | where the title links |
| `authors` | `Author[]`; the card names those in `post.authorIds`, in that order, skipping unknown ids |
| `category` | the post's `Category`, shown above the title |
| `locale` | formats the date and joins the names (`en` by default: "By Robin Example and Alex Sample") |
| `headingLevel` | `3` by default; `2` when the cards are the page's main list under its `h1` |
| `labels` | `Partial<BlogCardLabels>` |
| `LinkComponent`, `ImageComponent` | see above |
| `className` | added to the card's `article` |

The card fills its parent's height (`flex` column, the meta line at the bottom), so cards in a grid row line up.
The image is cropped to 40:21 with `object-cover`.

## Labels

English by default. A German set ships beside it:

```tsx
import { BLOG_CARD_LABELS_DE } from '@/components/blog-card/labels.de';

<BlogCard post={post} href={href} locale="de" labels={BLOG_CARD_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `minutes` | `(n) => \`${n} min read\`` | `(n) => \`${n} Min. Lesezeit\`` |
| `by` | By | Von |

## Keyboard and screen readers

- Each card is an `article` named by its title heading. The title link is the one tab stop.
- The date is a `time` element with the post's `publishedAt` as `dateTime`.
- The dots between date, reading time and authors are `aria-hidden`.
- The image carries the post's own alt text.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
