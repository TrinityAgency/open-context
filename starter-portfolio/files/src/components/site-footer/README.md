# Site Footer

The site's footer: the site's name and one line about it, link columns, a contact block, social links, the legal
links and the copyright line. With `cookieSettings` it adds a "cookie settings" button that a consent module can
listen for. Three layouts (`layout`), and its colours, fonts and corners come from your design system's tokens. A
server component, no JavaScript.

## Usage

```tsx
import { SiteFooter } from '@/components/site-footer/site-footer';

<SiteFooter
  identity={{ name: 'Example Ltd', description: 'Consulting, planning and delivery.' }}
  columns={[
    { title: 'Services', links: [{ href: '/services/consulting', label: 'Consulting' }] },
    { title: 'Company', links: [{ href: '/about', label: 'About' }, { href: '/blog', label: 'Blog' }] },
  ]}
  contact={{
    email: 'hello@example.com',
    phone: '+1 555 0100',
    address: { street: '1 Example Street', postalCode: '12345', city: 'Exampletown', country: 'US' },
  }}
  social={[{ network: 'mastodon', label: 'Mastodon', href: 'https://example.com/@example' }]}
  legal={[{ href: '/imprint', label: 'Imprint' }, { href: '/privacy', label: 'Privacy' }]}
  cookieSettings
/>
```

Every block is optional except `identity`; a block without data is not rendered.

### The cookie-settings hook

With `cookieSettings`, a `<button type="button" data-consent-open>` follows the legal links. The footer does nothing
with it itself: a consent module that listens for clicks on `[data-consent-open]` (such as `site-cookie-consent`)
opens its settings dialog. Without such a module the button is inert and raises no error. Neither template imports
the other.

### With Next's Link

Links render through `LinkComponent`, a plain `a` by default. In a Next app, pass `next/link`:

```tsx
import Link from 'next/link';

<SiteFooter {...props} LinkComponent={Link} />
```

## Layouts

Pick one with the `layout` prop; leave it out and the footer is `columns`.

| `layout` | What it draws | Example |
|---|---|---|
| `columns` | the name and its line beside titled link columns, the contact block and the social links (one column on a phone, two from `sm`, all side by side from `lg`); the copyright and the legal links in a row below | `<SiteFooter layout="columns" identity={identity} columns={columns} legal={legal} />` |
| `centered` | the same blocks centred: the name and its line on top, the columns centred below it, the copyright above the legal links | `<SiteFooter layout="centered" identity={identity} columns={columns} legal={legal} />` |
| `minimal` | one wrapping row: the name, the address on one line with the email and phone links, every column and social link in one list, the legal links and the copyright; no titles and no description | `<SiteFooter layout="minimal" identity={identity} columns={columns} legal={legal} />` |

A word wider than its column breaks instead of pushing the page sideways. The footer carries `data-layout` with its
layout.

## Brand

The footer reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the footer looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface-alt` | the footer's ground | `oklch(98.5% 0 none)` |
| `--oc-line` | the top border and the line above the legal row | `oklch(92.2% 0 none)` |
| `--oc-ink` | the name, the column titles, the email and phone labels, a link under the pointer | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the text, the links and the cookie-settings button | `oklch(37.1% 0 none)` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the name and the column titles | the page's font |
| `--oc-font-body` | the cookie-settings button | the page's font |
| `--oc-radius` | the focus ring's corners | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks the pairs this footer draws: ink and body text on the
alternate ground, the focus ring on it) and the `design-system-seed` skill. To set them by hand, declare them once in
your global stylesheet, e.g. `:root { --oc-surface-alt: #f6f7f9; --oc-ink: #111827; --oc-radius: 0.5rem; }`. A
`data-theme` wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `identity` | `{ name, description }` | | the name, and the description under it when not empty |
| `columns` | `FooterColumn[]` | `[]` | `{ title, links: LinkItem[] }` |
| `contact` | `ContactFacts` | | `{ email?, phone?, address? }`; the email as `mailto:`, the phone as `tel:` with everything but digits and `+` removed (after a country code, a `(0)` is dropped: `+49 (0)30 123` dials `+4930123`) |
| `social` | `SocialLink[]` | `[]` | `{ network, label, href }`, shown as text links |
| `legal` | `LinkItem[]` | `[]` | in a `nav` named by `labels.legal` |
| `cookieSettings` | `boolean` | `false` | adds the `data-consent-open` button |
| `copyright` | `string` | `labels.copyright(identity.name)` | the whole copyright line |
| `layout` | `'columns' \| 'centered' \| 'minimal'` | `columns` | see Layouts |
| `labels` | `Partial<SiteFooterLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | e.g. `next/link` |
| `className` | `string` | | on the `footer` |

## Labels

English by default. A German set ships beside it:

```tsx
import { SITE_FOOTER_LABELS_DE } from '@/components/site-footer/labels.de';

<SiteFooter {...props} labels={SITE_FOOTER_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `contact` | Contact | Kontakt |
| `legal` | Legal | Rechtliches |
| `social` | Follow | Folgen |
| `cookieSettings` | Cookie settings | Cookie-Einstellungen |
| `email` | Email | E-Mail |
| `phone` | Phone | Telefon |
| `copyright` | `(name) => © ${name}` | `(name) => © ${name}` |

## Keyboard and screen readers

- A `footer` landmark (`contentinfo`). Columns, contact and social links each sit under an `h2` (`minimal` draws no
  titles); give the page one `h1` before it.
- The legal links are a `nav` landmark named by `labels.legal`; the cookie button is the last stop in it.
- The contact block is an `address` element (upright text, `not-italic`).
- Tab moves through every link in reading order.

## Client islands

None.

## Notes

- Every colour is a design token with the neutral look as its fallback, and every margin and box is set on the
  element, so it looks the same with or without Tailwind's preflight.
- 2.0.0: the design tokens and `layout` are new; without a design system and without `layout` it draws what 1.0.0
  drew.
