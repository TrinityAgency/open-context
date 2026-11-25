# Call Button

A floating contact card at the bottom corner of every page: call by phone or write on WhatsApp, Signal or Telegram,
one tap away. Every way to reach you is a plain link (a `tel:` link, or the messenger's own chat link), so nothing is
asked of any other host before a visitor taps one. While the cookie banner is up it is not drawn, so the two do not
stand side by side, and it appears once the visitor has chosen (without JavaScript it is always drawn). The page scrolls clear of it, so the last line of
your footer is never under it, and so does the keyboard: tabbing never puts a link or button under it. Its colours, fonts and
corner radius come from your design system's tokens when you load them, and it keeps a neutral look when you do not.
A server component, with no client code at all.

## Usage

```tsx
import { CallButton, type CallContent } from '@/components/site-call-button/call-button';

const call: CallContent = {
  title: 'Questions? Talk to us.',
  links: [
    { kind: 'phone', number: '+49 30 0000000', label: 'Call us' },
    { kind: 'whatsapp', href: 'https://wa.me/49300000000', label: 'WhatsApp' },
  ],
};

// in your root layout, last in <body>, after the footer
<body>
  <SiteHeader … />
  <main id="main">{children}</main>
  <SiteFooter … />
  <CallButton content={call} />
</body>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the paths to where the files landed.

**Place it last in `<body>`, after your footer.** It draws two things: the fixed card (or bar), and an invisible copy
of it in the page's flow, as tall as the card plus its distance from the bottom edge, so scrolled to the end the page
ends clear of it. Placed anywhere else, that room would open up there. The room's ground is `surface-alt`, the
ground the `site-footer` template draws, so it reads as the end of your footer; below a footer on another ground it
shows as a band of `surface-alt`. Inside the cookie consent template's `ConsentProvider`, keep it there too.

**The cookie banner.** While a banner that marks itself with `data-consent-banner` is on the page (the
`site-cookie-consent` template's does, from 2.1.0), the card or bar is not drawn: no box, no link for the keyboard or
a screen reader, and the in-flow room stays, so nothing moves when the banner goes and the card appears. Where the
banner is drawn in the browser after the page loads (a static page, as the starters' are), the card shows until the
banner appears, then steps aside. Without JavaScript the card is always drawn: a banner rendered on the server cannot
be answered then and never leaves, while the call links work without it. Another consent tool's banner can carry
the same attribute, but only while it is shown: remove the attribute (or the element) when the visitor chooses, or
the card stays hidden. A banner that does not mark itself is drawn over the card (`z-40` over its `z-30`) where the
two meet, so its buttons are never under it; on a wider screen the two can then stand side by side until the visitor
chooses.

## The links

- `{ kind: 'phone', number, label }`: a `tel:` link built from `number` as you write it: one leading `+` if it has
  one, then the digits (`'+49 (0)30 000 0000'` → `tel:+49300000000`; a `(0)` after the country code is dropped, as it
  is not dialled from abroad).
- `{ kind: 'whatsapp' | 'signal' | 'telegram', href, label }`: the messenger's chat link as you give it (e.g.
  `https://wa.me/<number>`, `https://signal.me/#p/<number>`, `https://t.me/<name>`), opened with
  `rel="noopener noreferrer"`.
- The first link is the primary one (your brand colour); the others are quiet. Each shows a small glyph (a handset, a
  speech bubble for WhatsApp and Signal, a paper plane for Telegram; no brand logos) and its `label` as text.
- No links: the part renders nothing.

## Layouts

Pick one with the `layout` prop; leave it out and it is `card`.

| `layout` | What it draws | Example |
|---|---|---|
| `card` | a floating card at the bottom corner (end side) at every width, the title above the links stacked | `<CallButton content={{ title, links }} />` |
| `bar` | on a phone a full-width bar along the bottom edge, the links side by side in equal columns (the title hidden); from `md` the card | `<CallButton layout="bar" content={{ links }} />` |

The card is 18rem wide (at most the screen less 2rem) and 1rem from the bottom and end edges. The `aside` carries
`data-layout` with the layout it drew.

## Brand

The part reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so it keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-surface` | the card's or bar's ground, the quiet links' ground | `#fff` |
| `--oc-surface-alt` | the room below your footer (the footer's ground in `site-footer`) | `oklch(98.5% 0 none)` |
| `--oc-line` | the card's border, the bar's top border | `oklch(92.2% 0 none)` |
| `--oc-ink` | the title, the quiet links' text and glyph | `oklch(20.5% 0 none)` |
| `--oc-line-strong` | the quiet links' border | `oklch(87% 0 none)` |
| `--oc-surface-sunk` | a quiet link under the pointer | `oklch(97% 0 none)` |
| `--oc-brand` | the primary link's ground and border | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | the primary link under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the primary link's text and glyph | `#fff` |
| `--oc-focus` | the focus ring of every link | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-radius` | corners: 2 × on the card, 1.5 × on each link | `0.25rem` |

The card keeps its `shadow-lg` (the contract has no shadow token).

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-brand: #15803d; --oc-radius: 0.5rem; }`. A `data-theme`
wrapper with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `CallContent` | | `{ links: CallLink[], title? }` |
| `layout` | `'card' \| 'bar'` | `card` | see Layouts |
| `labels` | `Partial<CallLabels>` | English | see Labels |
| `id` | `string` | | on the `aside` |
| `className` | `string` | | on the `aside` |

A `CallLink` is `{ kind: 'phone', number, label }` or `{ kind: 'whatsapp' | 'signal' | 'telegram', href, label }`.

## Labels

The fixed strings, in `labels.ts` (English, the default) and `labels.de.ts` (German):

```tsx
import { CALL_LABELS_DE } from '@/components/site-call-button/labels.de';

<CallButton content={call} labels={CALL_LABELS_DE} />
```

| Key | English | |
|---|---|---|
| `region` | `Contact us directly` | the name of the `aside` landmark |

The link labels and the title are your content.

## Keyboard and screen readers

- The card is an `aside` (a complementary landmark) named by `labels.region`, the last stop on the page for a
  keyboard; each link is named by its label (the glyphs are decoration) and draws a visible focus ring.
- The invisible copy that keeps the page clear of the card is hidden from screen readers and holds no link.
- While the part is on the page, the page's root keeps room below the element that has keyboard focus
  (`scroll-padding-bottom`: 16rem beside the card, 10rem above the bar on a phone), so tabbing scrolls each link or
  button clear of the card or bar. A card taller than 16rem (many long labels) can still cover part of one.

## Notes

- Nothing is requested before a tap: no messenger script, no widget, no prefetch (plain `a`, not a framework link).
- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- A long label wraps inside its link, and a word too long for a column of the bar breaks inside it, so nothing leaves
  a phone screen.
- 1.1.0: not drawn while a banner marked `data-consent-banner` is on the page (see "The cookie banner"), and the
  room below your footer takes the footer's ground (`surface-alt`); nothing else changes.
