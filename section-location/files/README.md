# Location Section

Where to find a business: the postal address, phone and email as links, the opening hours, and a map, in two
layouts. The map loads from its provider only behind your consent gate, once the visitor allows external media;
until then, and on a site without a gate, the section links to the map instead. Its colours, fonts and corner radius
come from your design system's tokens when you load them, and it keeps a neutral look when you do not. A server
component; the map's frame is the one client file.

## Usage

```tsx
import { LocationSection } from '@/components/section-location/location-section';
// and ConsentGate, from where you installed the site-cookie-consent template (its index file)

const content = {
  title: 'Visit the workshop',
  intro: 'A short walk from the station.',
  contact: {
    email: 'hello@example.com',
    phone: '+1 555 0100',
    address: { street: '1 Sample Street', postalCode: '12345', city: 'Sampletown', country: 'US' },
  },
  hours: [
    { days: 'Monday to Friday', hours: '8:00–17:00' },
    { days: 'Saturday', hours: '9:00–13:00' },
  ],
  hoursNote: 'Closed on public holidays.',
  map: {
    title: 'Map of 1 Sample Street, Sampletown',
    href: 'https://www.openstreetmap.org/?mlat=…&mlon=…',
    embedSrc: 'https://www.openstreetmap.org/export/embed.html?bbox=…&marker=…',
  },
};

// behind your consent gate: the map appears once the visitor allows "media"
<LocationSection id="location" content={content} Gate={ConsentGate} />

// without a gate: never embedded, a link to the map instead
<LocationSection content={content} layout="stacked" />
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the paths to where the files landed.
Pass `Gate` from a server page: it is an import and a prop, no client component of your own. `ConsentGate` must sit
inside your `ConsentProvider` (the `site-cookie-consent` template's layout does that), and the provider's categories
must include the one the map needs (`category`, default `'media'`).

## The map and consent

- **With `Gate` and `map.embedSrc`:** the section renders `<Gate category={category} fallback={placeholder}>` with
  the map's `iframe` as its child. The frame is created in this template's own client file (`map-frame.tsx`), so
  until the gate grants the category the page holds no trace of it and the browser asks the map's host for nothing,
  also when another page links here and Next prefetches this one. The placeholder says why the map is missing, offers
  a "Show the map" button (`data-consent-open`: the consent module opens its settings) and links to the map.
- **Without `Gate`, or without `embedSrc`:** never an `iframe`. The placeholder links to `map.href` only.
- The link is a plain `a`, so it works without JavaScript. `map.title` names the frame for screen readers.

## Layouts

Pick one with the `layout` prop; leave it out and the section is `split`.

| `layout` | What it draws | Example |
|---|---|---|
| `split` | the details beside the map from `md` (the map the wider column), the map below them on a phone | `<LocationSection layout="split" Gate={ConsentGate} content={{ title, contact, hours, map }} />` |
| `stacked` | the map above the details, in one column at every width | `<LocationSection layout="stacked" content={{ title, contact, hours, map: { title, href } }} />` |

Without a `map`, both draw the details alone in one column, and the section reports `stacked`. The section carries
`data-layout` with the layout it drew. The map's box is 4:3 (16:9 from `md` in `stacked`, at full width) and at least
20rem tall from `md`; it grows when the placeholder's text needs the room. The opening hours follow their own
column, not the window: each day sits beside its hours once the column is 24rem wide (one above the other in a
narrower one), and the list never spreads wider than 28rem, so a day stays near its hours.

## Brand

The section reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset,
each falls back to the neutral value in brackets, so the section keeps its neutral look with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the address, the hours' days and every link | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro, the hours and the map's notice | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the small headings, the hours note, a link under the pointer and the map pin | `oklch(43.9% 0 none)` |
| `--oc-surface-sunk` | the map's box until the map shows | `oklch(97% 0 none)` |
| `--oc-line` | the map's border | `oklch(92.2% 0 none)` |
| `--oc-brand` | the "Show the map" button | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | that button under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | that button's text | `#fff` |
| `--oc-focus` | the focus ring of every link and the button | `oklch(20.5% 0 none)` |
| `--oc-font-heading` | the title | the page's font |
| `--oc-font-body` | the button | the page's font |
| `--oc-radius` | corners: 2 × on the map's box, 1.5 × on the button, 1 × on a focused link | `0.25rem` |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark) and the `design-system-seed` skill. To set them by hand, declare
them once in your global stylesheet, e.g. `:root { --oc-ink: #1d2b3a; --oc-radius: 0.5rem; }`. A `data-theme` wrapper
with its own values re-brands everything inside it.

## Props

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `LocationContent` | | `{ title, intro?, contact, hours?, hoursNote?, map? }` |
| `layout` | `'split' \| 'stacked'` | `split` | see Layouts |
| `Gate` | `GateComponent` | none | your consent gate, e.g. `ConsentGate`; without it the map is a link |
| `category` | `string` | `'media'` | the consent category the map needs |
| `labels` | `Partial<LocationLabels>` | English | see Labels |
| `id` | `string` | | on the `section`, e.g. an anchor target |
| `className` | `string` | | on the `section` |

`contact` is `ContactFacts` (`{ email?, phone?, address? }`, the address `{ street, postalCode, city, country }`),
`hours` a list of `HoursRow` (`{ days, hours }`, both text: write them as your visitors say them), `map` a `MapRef`
(`{ title, href, embedSrc? }`). Only the facts you give are drawn. The phone link is built by `telHref` (exported from
`tel-href.ts`): one leading `+` and the digits (`+1 555 0100` → `tel:+15550100`); after a country code a `(0)` is
dropped (`+49 (0)30 …` → `tel:+4930…`).

## Labels

The fixed strings, in `labels.ts` (English, the default) and `labels.de.ts` (German):

```tsx
import { LOCATION_LABELS_DE } from '@/components/section-location/labels.de';

<LocationSection content={content} Gate={ConsentGate} labels={LOCATION_LABELS_DE} />
```

| Key | English |
|---|---|
| `address` | `Address` |
| `hours` | `Opening hours` |
| `phone` | `Phone` |
| `email` | `Email` |
| `openInMaps` | `Open in maps` |
| `showMap` | `Show the map` |
| `mapNotice` | `The map is loaded from another provider once you allow external media.` |

## Keyboard and screen readers

- The section is a region named by its `h2`; address, phone, email and opening hours each have an `h3`, so a screen
  reader can jump between them. The hours are a description list: each day and its hours are read together.
- Every link and the button draw a visible focus ring. The placeholder's button opens the consent settings, where the
  visitor allows the map; the link opens the map on the provider's own page.
- The map's frame is named by `map.title`. The pin in the placeholder is decoration, hidden from screen readers.

## Client islands

`map-frame.tsx` (`'use client'`): the map's `iframe`, created only where your gate renders it. Everything else is
rendered on the server.

## Notes

- Never put the provider's own map picture (a static map image) in the placeholder: it would be a request to that
  host before consent.
- Colours, fonts and radii only through the tokens above, and every margin and box set on the element, so it looks
  the same with or without Tailwind's preflight, and in a project with shadcn/ui's own variables.
- Long words break inside their column, so nothing leaves a phone screen.
