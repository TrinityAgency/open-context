# Site Header

The site's header: a skip link, the brand, the main navigation with sub-menus, one call to action, and on narrow
screens a menu button that opens a drawer with every link. The current page is marked. A server component; the
sub-menus are native `details`, the drawer is a native popover, so menus open without JavaScript. One small client
island closes them on a link click, Escape and an outside click.

## Usage

```tsx
import { SiteHeader } from '@/components/site-header/site-header';

<SiteHeader
  identity={{ name: 'Example Ltd' }}
  nav={[
    { href: '/', label: 'Home' },
    {
      href: '/services',
      label: 'Services',
      children: [
        { href: '/services/consulting', label: 'Consulting' },
        { href: '/services/planning', label: 'Planning' },
      ],
    },
    { href: '/blog', label: 'Blog' },
  ]}
  currentPath="/services/consulting"
  cta={{ href: '/contact', label: 'Get in touch', variant: 'primary' }}
/>
<main id="main" tabIndex={-1}>…</main>
```

Give the page's `main` the id the skip link points at (`main` by default) and `tabIndex={-1}`, so the skip link
moves focus there.

### The current path

The header takes `currentPath` as a prop and reads nothing from the router. In a Next app, pass it from a small
client wrapper that also brings Next's link and image (a server layout cannot hand functions to a client
component, so the wrapper sets them itself and the layout passes only data):

```tsx
// components/header.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SiteHeader, type SiteHeaderProps } from '@/components/site-header/site-header';
import type { ImageComponent } from '@/components/site-header/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

export function Header(props: Omit<SiteHeaderProps, 'currentPath' | 'LinkComponent' | 'ImageComponent'>) {
  return <SiteHeader {...props} currentPath={usePathname()} LinkComponent={Link} ImageComponent={NextImage} />;
}

// app/layout.tsx (server): <Header identity={…} nav={…} cta={…} />
```

`isCurrent(href, currentPath)` decides the mark, by whole path segments: `/blog` is current on `/blog` and
`/blog/post-1` but not on `/blog-old`; `/` only on `/`. Queries and a trailing slash are ignored; an href with a hash
or a scheme (`#team`, `https://…`, `mailto:…`) is never current. It is exported from `is-current.ts`.

### With Next's Link and Image

Links render through `LinkComponent` (a plain `a` by default) and the logo through `ImageComponent` (a plain `img`
by default). The wrapper above sets both; rendering `SiteHeader` straight from a server component works too:

```tsx
import Image from 'next/image';
import Link from 'next/link';
import type { ImageComponent } from '@/components/site-header/site-types';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

<SiteHeader {...props} LinkComponent={Link} ImageComponent={NextImage} />
```

The skip link stays a plain `a`: it jumps within the page.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `identity` | `{ name, logo? }` | | the logo (`ImageRef`) when given, else the name as text |
| `homeHref` | `string` | `/` | where the brand links to |
| `nav` | `NavItem[]` | | `{ href, label, children? }`; an item with children becomes a sub-menu and its own `href` is not rendered (list the page among its children if it has one) |
| `currentPath` | `string` | | the current pathname |
| `cta` | `Cta` | | `{ href, label, variant: 'primary' \| 'secondary' }` |
| `mainId` | `string` | `main` | the skip link's target |
| `labels` | `Partial<SiteHeaderLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `ImageComponent` | `ImageComponent` | plain `img` | e.g. a `next/image` wrapper |
| `className` | `string` | | on the `header` |

## Labels

English by default. A German set ships beside it:

```tsx
import { SITE_HEADER_LABELS_DE } from '@/components/site-header/labels.de';

<SiteHeader {...props} labels={SITE_HEADER_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `skip` | Skip to content | Zum Inhalt springen |
| `nav` | Main | Hauptnavigation |
| `menu` | Menu | Menü |
| `close` | Close menu | Menü schließen |

## Keyboard and screen readers

- The skip link is the first stop of Tab: hidden until focused, then shown at the top left. Enter moves focus to
  `main`.
- One `nav` landmark named by `labels.nav` is exposed at a time: the row on wide screens, the drawer's on narrow ones.
- The current link carries `aria-current="page"`. A sub-menu whose page is current is marked with `data-current`
  (style hook, no ARIA).
- Sub-menus: Enter or Space on the item opens it, Tab reaches its links, Escape closes it and returns focus to the
  item; opening one closes the other; a click outside closes it.
- The menu button opens the drawer (the browser announces it as expanded); Escape, the close button, a click outside
  or a link click close it, and focus returns to the menu button.
- Icons are inline SVG with `aria-hidden="true"`; every transition sits behind `motion-safe:`.

## Client islands

`close-on-navigate.tsx` (`CloseOnNavigate`, rendered by the header itself; it renders nothing).

## Notes

- The breakpoint is Tailwind's `md` (48rem): the row from there up, the drawer below.
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without Tailwind's
  preflight.
