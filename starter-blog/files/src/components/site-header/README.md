# Site Header

The site's header: a skip link, the brand, the main navigation with sub-menus, one call to action, and on narrow
screens a menu button that opens a drawer with every link. The current page is marked. Three layouts (`layout`), and
its colours, fonts and corners come from your design system's tokens. A server component; the sub-menus are native
`details`, the drawer is a native popover, so menus open without JavaScript. One small client island closes them on a
link click, Escape and an outside click.

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

## Layouts

Pick one with the `layout` prop; leave it out and the header is a `bar`.

| `layout` | What it draws | Example |
|---|---|---|
| `bar` | brand, navigation and call to action in one row from `md`; below it the brand and a menu button that opens the drawer | `<SiteHeader layout="bar" identity={identity} nav={nav} currentPath={path} />` |
| `centered` | from `md` the brand centred on a line of its own, the navigation and the call to action centred below it; below `md` the bar's row | `<SiteHeader layout="centered" identity={identity} nav={nav} currentPath={path} />` |
| `minimal` | the brand and a menu button at every width (the call to action beside it from `md`); every link lives in the drawer | `<SiteHeader layout="minimal" identity={identity} nav={nav} currentPath={path} />` |

A navigation row that does not fit wraps onto a second line, and a long brand name wraps beside the menu button, so a
long menu never pushes the page sideways. The header carries `data-layout` with its layout.

## Brand

The header reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the header looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface` | the header, the drawer, the sub-menu panel, the buttons, the focused skip link, a secondary call to action | `#fff` |
| `--oc-surface-sunk` | a link, a sub-menu item or a button under the pointer | `oklch(97% 0 none)` |
| `--oc-line` | the bottom border, the sub-menu panel's border | `oklch(92.2% 0 none)` |
| `--oc-line-strong` | the buttons' border, a secondary call to action's border | `oklch(87% 0 none)` |
| `--oc-ink` | the brand name, the current page, a link under the pointer, the buttons' text | `oklch(20.5% 0 none)` |
| `--oc-ink-soft` | the drawer's links | `oklch(26.9% 0 none)` |
| `--oc-ink-body` | the navigation's links | `oklch(37.1% 0 none)` |
| `--oc-ink-subtle` | the chevrons, the drawer's group titles | `oklch(55.6% 0 none)` |
| `--oc-brand` | a primary call to action | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | a primary call to action under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | a primary call to action's text | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-scrim` | the veil behind the open drawer (at 40 %) | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the brand name | the page's font |
| `--oc-font-body` | the buttons | the page's font |
| `--oc-radius` | the corners (1.5 ×) | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks the pairs this header draws: each ink on the surface,
ink on the sunk tint, on-brand on brand, the focus ring on both grounds) and the `design-system-seed` skill. To set
them by hand, declare them once in your global stylesheet, e.g. `:root { --oc-brand: #0b5cad; --oc-on-brand: #fff;
--oc-radius: 0.5rem; }`. A `data-theme` wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `identity` | `{ name, logo? }` | | the logo (`ImageRef`) when given, else the name as text |
| `homeHref` | `string` | `/` | where the brand links to |
| `nav` | `NavItem[]` | | `{ href, label, children? }`; an item with children becomes a sub-menu and its own `href` is not rendered (list the page among its children if it has one) |
| `currentPath` | `string` | | the current pathname |
| `cta` | `Cta` | | `{ href, label, variant: 'primary' \| 'secondary' }` |
| `mainId` | `string` | `main` | the skip link's target |
| `layout` | `'bar' \| 'centered' \| 'minimal'` | `bar` | see Layouts |
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
- One `nav` landmark named by `labels.nav` is exposed at a time: the row on wide screens, the drawer's on narrow ones
  (in `minimal`, only the drawer's).
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

- The breakpoint is Tailwind's `md` (48rem): the row from there up, the drawer below (`minimal`: the drawer always).
- Every colour is a design token with the neutral look as its fallback, and every margin and box is set on the
  element, so it looks the same with or without Tailwind's preflight.
- 2.0.0: the design tokens and `layout` are new; without a design system and without `layout` it draws what 1.0.0
  drew. A link in the drawer now takes ink under the pointer, as the row's links do.
