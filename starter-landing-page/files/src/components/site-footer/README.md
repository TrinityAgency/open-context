# Site Footer

The site's footer: the site's name and one line about it, link columns, a contact block, social links, the legal
links and the copyright line. With `cookieSettings` it adds a "cookie settings" button that a consent module can
listen for. A server component, no JavaScript.

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

- A `footer` landmark (`contentinfo`). Columns, contact and social links each sit under an `h2`; give the page one
  `h1` before it.
- The legal links are a `nav` landmark named by `labels.legal`; the cookie button is the last stop in it.
- The contact block is an `address` element (upright text, `not-italic`).
- Tab moves through every link in reading order.

## Client islands

None.

## Notes

- Neutral colours only, with every margin and box set on the element, so it looks the same with or without Tailwind's
  preflight.
