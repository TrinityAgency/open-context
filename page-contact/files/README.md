# Contact Page

A contact page for a Next app: a form that posts to a server action, with spam traps and validation, the contact
details (email, phone, address) and a map link. It installs as a route folder at `app/page-contact` (served at
`/page-contact`); rename the folder for another path, e.g. `app/contact`. The form is the page's only client island,
and it works without JavaScript too: the browser posts the form to the action and the page comes back with the
result.

## Usage

1. **Replace `deliver()` in `deliver.ts` before you go live.** It is where a valid message goes: send an email,
   write to your database or call your help desk. As shipped it logs the message in development and **refuses in
   production**, so the form shows "Your message could not be sent" instead of silently dropping messages.
2. Edit `content.ts`: the page's title and description (`META`), the intro, the contact details, the privacy page
   link and the map link (`CONTENT`). The sample content is invented (Samplework Inc.).
3. Pick the language: `LOCALE` in `content.ts` is `'en'` (the default) or `'de'` (the German content and labels).
   Set `lang` on `<html>` in your root layout to match.

```ts
// deliver.ts, e.g. with your mail client
import type { ContactMessage } from './contact-message';
import { sendMail } from '@/lib/mail'; // your own

export async function deliver(message: ContactMessage): Promise<void> {
  await sendMail({ to: 'hello@example.com', replyTo: message.email, subject: `Contact: ${message.name}`, text: message.message });
}
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.

A throwing `deliver` shows the "could not be sent" status, which asks the visitor to write an email instead, and
logs the error once on the server.

## What the form checks

`handleContact` in `contact-message.ts` runs on the server for every submit:

- **Spam traps.** A filled honeypot field (`website`, hidden from people and screen readers) or a form sent less
  than three seconds (`MIN_FILL_MS`) after the page was rendered is answered "sent" but never delivered, so a bot
  learns nothing. The page renders per request (`dynamic = 'force-dynamic'`), so the clock starts when the visitor
  opens it.
- **Validation** (zod, `contactSchema`), on trimmed values: a name of 1–100 characters, an email address of at most
  254 characters, a message of 1–5000 characters. A line break inside the name or the email is refused, so nothing
  downstream can read it as a mail header.
- An invalid submit comes back with one message per field, tied to it with `aria-describedby`, and the values as
  typed. A failed delivery comes back with the values as typed too, so the visitor keeps the message. Both resend
  the first render time, so fixing a field and sending at once is not taken for a bot, with or without JavaScript.

The browser checks the same rules first (`required`, `maxLength`, `type="email"`); the server's checks are the ones
that count.

## A map behind consent

The page links to a map. To embed one instead, pass it as the `map` slot of `ContactPage` (or `ContactView`). An
embedded map loads from another host, so with [`site-cookie-consent`] put it behind a `ConsentGate`, **created in a
client component**: React's server renderer preloads every `<img>` it writes, even inside a closed gate.

```tsx
// app/contact/page.tsx
import { ConsentGate } from '<site-cookie-consent>'; // the folder site-cookie-consent was installed into
import { ContactPage } from '@/app/page-contact/contact-view';
import { MapEmbed } from '@/components/map-embed'; // 'use client': renders the map's <iframe>

export const dynamic = 'force-dynamic';

// The request's time, outside the component: React's lint refuses `Date.now()` during render.
const requestTime = () => Date.now();

export default function Contact() {
  return (
    <ContactPage
      locale="en"
      startedAt={requestTime()}
      map={
        <ConsentGate category="media" fallback={<a href="https://www.openstreetmap.org/">Open the map</a>}>
          <MapEmbed />
        </ConsentGate>
      }
    />
  );
}
```

## What is inside

| File | |
|---|---|
| `page.tsx` | the route: `dynamic`, `metadata` and the page, in `LOCALE` |
| `contact-view.tsx` | `ContactView` (the page body) and `ContactPage({ locale, startedAt, map? })` |
| `contact-form.tsx` | `ContactForm`, the client island (`useActionState`) |
| `actions.ts` | `sendContact`, the server action |
| `contact-message.ts` | `handleContact`, `contactSchema`, `MIN_FILL_MS` and the types |
| `deliver.ts` | `deliver()`: replace it |
| `labels.ts`, `labels.de.ts` | the form's and the details' fixed strings, English and German |
| `site-types.ts` | the kit's shared types this page uses (`ContactFacts`, `PostalAddress`, …) |
| `content.ts` | `LOCALE`, `META` and `CONTENT` (English and German) |

## Brand

The page reads these design tokens (CSS custom properties of the Open Context token contract, version 1). Unset, each
falls back to the neutral value in brackets, so the page looks the same as before with no design system loaded.

| Token | Used for | Without a design system |
|---|---|---|
| `--oc-ink` | the title, the headings, the labels, the links, the status, an invalid field's border | `oklch(20.5% 0 none)` |
| `--oc-ink-body` | the intro | `oklch(37.1% 0 none)` |
| `--oc-ink-muted` | the notice, the card labels, a link under the pointer | `oklch(43.9% 0 none)` |
| `--oc-surface` | the fields | `#fff` |
| `--oc-line-strong` | the fields' border | `oklch(87% 0 none)` |
| `--oc-line` | the cards' border | `oklch(92.2% 0 none)` |
| `--oc-brand` | the send button | `oklch(20.5% 0 none)` |
| `--oc-brand-hover` | the send button under the pointer | `oklch(37.1% 0 none)` |
| `--oc-on-brand` | the send button's label | `#fff` |
| `--oc-focus` | the focus ring | `oklch(20.5% 0 none)` |
| `--oc-radius` | the corners (fields and button at 1.5 times it, cards at twice it) | `0.25rem` |
| `--oc-font-heading` | the title and "Contact details" | the page's font |
| `--oc-font-body` | the fields and the send button | the page's font |

To set them from a claude.ai design system, use the `design-tokens` template (its `design-sync.mjs` writes them as
aliases of your design's own tokens, light and dark, and checks every pair the page draws) and the
`design-system-seed` skill. To set them by hand, declare them once in your global stylesheet, e.g.
`:root { --oc-ink: #1d2433; --oc-line: #dfe3ea; }`.

## Props

`ContactView`:

| Prop | Type | Default | |
|---|---|---|---|
| `content` | `ContactContent` | | `{ title, intro?, contact: { email?, phone?, address? }, privacy: { href, label }, map?: { href, label } }` |
| `startedAt` | `number` | | when the page was rendered, `Date.now()` |
| `map` | `ReactNode` | the map link | replaces the link, e.g. an embed behind consent |
| `labels` | `Partial<ContactLabels>` | English | see below |
| `LinkComponent` | `LinkComponent` | plain `a` | renders the privacy, email and phone links |

A phone number becomes a `tel:` link with only its digits and `+`; after a country code, a `(0)` is dropped
(`+49 (0)30 0000000` dials `tel:+49300000000`).

## Labels

`CONTACT_LABELS` (English, the default) and `CONTACT_LABELS_DE`: the field labels (`name`, `email`, `message`), the
button (`submit`, `sending`), the status (`sent`, `failed`), the errors (`required`, `invalid`, `tooLong`), the
honeypot's label (`honeypot`), the privacy `notice`, and the details' heading and labels (`contact`, `phone`,
`address`). `ContactPage` picks the set for its locale; `ContactView` takes any of them as `labels`.

## Keyboard and screen readers

- The page is one `main` landmark (`id="main"`, the target of a skip link) with exactly one `h1`.
- Every field has a visible label; an error is announced with its field (`aria-invalid`, `aria-describedby`).
- While a message is being sent, the button is disabled and reads "Sending…". The result is a `role="status"` line,
  announced when it changes.
- The honeypot sits in an `aria-hidden` wrapper and out of the tab order, so neither keyboard nor screen reader
  users meet it.

## Client islands

`contact-form.tsx` (`'use client'`): the form, for the pending state and the inline result. Without JavaScript the
same form posts to the server action.

## Notes

- Every colour is a design token (Brand), with every margin and box set on the element, so the page looks the
  same with or without Tailwind's preflight. A word wider than the screen breaks instead of running off it.
- **From 1.x:** the props, the route, the server action and `content.ts` are the same; the page draws in your
  design tokens, and a long label of the send button wraps inside it.
- The privacy notice is a line with a link, not a checkbox: answering a message needs no consent. Point
  `privacy.href` at your privacy page.

[`site-cookie-consent`]: https://www.npmjs.com/package/@trinity369/use
