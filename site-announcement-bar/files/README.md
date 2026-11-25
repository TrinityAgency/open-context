# Announcement Bar

A one-line notice across the top of the page (a holiday closing, a new service, a change of address) with an optional
link after the text and a dismiss button at the row's end. Dismissing hides the bar until the page is loaded again:
nothing is stored, so a reload or a new visit shows it again, and no cookie notice is needed for it. Without JavaScript the
text and link show and the dismiss button does not, since it could do nothing. Its colours, fonts and corner radius
come from your design system's tokens when you load them, and it keeps a neutral look when you do not. A server
component; the dismiss button is the one client island.

## Usage

```tsx
import Link from 'next/link';
import { AnnouncementBar } from '@/components/site-announcement-bar/announcement-bar';

const notice = {
  text: 'The workshop is closed from 24 to 26 December.',
  link: { href: '/opening-hours', label: 'Opening hours' },
};

// in your root layout, right after the header
<SiteHeader … />
<AnnouncementBar content={notice} LinkComponent={Link} />
<main id="main">…</main>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the paths to where the files landed.

**Place it right after your header**, before `main`: the header's skip link ("Skip to content") stays the first stop
for a keyboard, and the bar is read before the page. Put it in the root layout to show it on every page, or in one
page's own layout to show it there only. To end an announcement, remove the line.

## Layouts

Pick one with the `layout` prop; leave it out and the bar is `bar`.

| `layout` | What it draws | Example |
|---|---|---|
| `bar` | a quiet full-width bar in your design's sunk ground, the text and link in ink | `<AnnouncementBar content={{ text, link }} LinkComponent={Link} />` |
| `band` | a full-width band on your brand colour; the text, link, dismiss icon and focus rings in on-brand | `<AnnouncementBar layout="band" content={{ text, link }} LinkComponent={Link} />` |

Both centre the text in one row (`text-sm`), wrapping onto more lines on a narrow screen; the dismiss button sits at
the row's end, and an empty column of its width on the other side keeps the text centred. The section carries
`data-layout` with the layout it drew.

## Brand

The bar reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the bar keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface-sunk` | the ground of `bar` | `oklch(97% 0 none)` |
| `--oc-ink` | the text, link and dismiss icon of `bar` | `oklch(20.5% 0 none)` |
| `--oc-line` | the dismiss button under the pointer, on `bar` | `oklch(92.2% 0 none)` |
| `--oc-focus` | the focus rings on `bar` | `oklch(20.5% 0 none)` |
| `--oc-brand` | the ground of `band` | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | the dismiss button under the pointer, on `band` | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the text, link, dismiss icon and focus rings of `band` | `#fff` |
| `--oc-radius` | corners: 1 × on a focused link, 1.5 × on the dismiss button | `0.25rem` |

On `band` the focus rings are drawn in `--oc-on-brand`, never `--oc-focus`: many designs make the focus colour the
brand colour itself, and a ring in it would vanish on the band.

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-brand: #1d4ed8; --oc-radius: 0.5rem; }`. A `data-theme`
wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `AnnouncementContent` | | `{ text, link? }`; `link` is a `LinkItem` (`{ href, label }`) |
| `layout` | `'bar' \| 'band'` | `bar` | see Layouts |
| `dismissible` | `boolean` | `true` | the dismiss button; `false` keeps the bar until you remove it |
| `labels` | `Partial<AnnouncementLabels>` | English | see Labels |
| `LinkComponent` | `LinkComponent` | plain `a` | draws the link, e.g. `next/link`'s `Link` |
| `id` | `string` | | on the `section` |
| `className` | `string` | | on the `section` |

## Labels

The fixed strings, in `labels.ts` (English, the default) and `labels.de.ts` (German):

```tsx
import { ANNOUNCEMENT_LABELS_DE } from '@/components/site-announcement-bar/labels.de';

<AnnouncementBar content={notice} labels={ANNOUNCEMENT_LABELS_DE} LinkComponent={Link} />
```

| Key | English | |
|---|---|---|
| `region` | `Announcement` | the name of the bar's region |
| `dismiss` | `Dismiss the announcement` | the name of the dismiss button |

Two bars on one page need two `region` names: screen readers list regions by name.

## Keyboard and screen readers

- The bar is a region (a `section`) named by `labels.region`, so it shows in a screen reader's list of landmarks.
- The link and the dismiss button draw a visible focus ring; the button is named by `labels.dismiss` (its icon is
  decoration). Dismissing removes the whole bar, its region included; dismissed from the keyboard, the focus moves to
  your page's main content, `#main` (the header's skip link's target, with `tabIndex={-1}`), so the next Tab goes on
  after the bar instead of at the top of the page.
- The text and the link are read as one sentence with a space between them.

## Client islands

`dismissible.tsx` (`'use client'`): `Dismissible` holds whether the bar was dismissed (in memory, until the page is
loaded again) and renders nothing once it was; `DismissButton` is the button, `invisible` (hidden and not focusable) until the page
is hydrated. A bar with `dismissible={false}` renders no client code at all. Everything else is rendered on the server.

## Notes

- Nothing is stored: no cookie, no `localStorage`. The dismissed state lives in the page's memory: in your root
  layout, which Next keeps while a visitor follows links, the bar stays hidden on the next pages; a reload or a new
  visit shows it again. To keep a notice away for good, end it (remove the line); a bar that remembers across visits
  would need a cookie, and with it your consent notice.
- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside the row, so nothing leaves a phone screen.
