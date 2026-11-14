# Newsletter CTA

A newsletter signup: a heading, a line of text, an email field with its button, and a privacy notice. The form posts
to a server action, so it works before hydration and without JavaScript, and the address never appears in the URL.
Validation (zod) and a honeypot field run on the server; your provider's `subscribe(email)` is called only for a
valid address. Two looks: an `inline` band across the page, or a `sticky` card that stays in view beside long text.

Needs `zod` (3 or later) in your project.

## Usage

### 1. Your server action

```ts
// app/newsletter-action.ts
'use server';
import { handleNewsletter, type NewsletterState } from '@/components/blog-newsletter-cta/newsletter';
import { subscribe } from '@/lib/newsletter'; // your provider: (email: string) => Promise<void>

export async function subscribeAction(_state: NewsletterState, form: FormData): Promise<NewsletterState> {
  return handleNewsletter(form, subscribe);
}
```

`subscribe` receives the trimmed address. Make it throw when the provider refuses or cannot be reached: the visitor
then sees the `failed` message and keeps the typed address.

**Double opt-in is the provider's job.** In the EU a newsletter needs a confirmed address: let your provider send
the confirmation mail, and change `labels.subscribed` to say so ("Thank you. Please check your inbox to confirm.").
This component only collects the address.

### 2. The signup

```tsx
import Link from 'next/link';
import { NewsletterCta } from '@/components/blog-newsletter-cta/newsletter-cta';
import { subscribeAction } from '@/app/newsletter-action';

<NewsletterCta
  id="newsletter"
  content={{
    title: 'Get the Samplework notes',
    text: 'Twice a month, in your inbox.',
    privacy: { href: '/privacy', label: 'Privacy policy' },
  }}
  action={subscribeAction}
  LinkComponent={Link}
/>
```

`@/` is your project's own import alias (the project root, or `src/`); adjust the path to where the files landed.
The privacy link renders through `LinkComponent`, a plain `a` by default; pass `next/link` in a Next app.

For the sticky card, put it in a column taller than itself, e.g. beside an article:

```tsx
<div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_20rem]">
  <article>…</article>
  <aside>
    <NewsletterCta variant="sticky" content={{ title: 'Stay in the loop' }} action={subscribeAction} />
  </aside>
</div>
```

`sticky top-6` keeps the card 1.5 rem from the top of the window while its column scrolls past.

### The handler on its own

`handleNewsletter(form, subscribe)` answers a `NewsletterState`:

| Submitted | Answer |
|---|---|
| a valid address (spaces around it are trimmed) | `subscribed`, after `subscribe(address)` |
| the hidden `website` field filled in | `subscribed`, without calling `subscribe` (bots are not told) |
| not an address, longer than 254 characters, or with a line break | `invalid`, with the typed value |
| an address, but `subscribe` throws | `failed`, with the typed value, after one `console.error` |

## Props

| Prop | |
|---|---|
| `content` | `{ title, text?, privacy? }`; `privacy` is a `LinkItem` shown after `labels.notice` |
| `action` | your server action (`NewsletterAction`) |
| `variant` | `inline` (default) or `sticky` |
| `id` | the section's id, for a `/#newsletter` link |
| `labels` | `Partial<NewsletterLabels>` |
| `LinkComponent` | see above |
| `className` | added to the section |

## Labels

English by default. A German set ships beside it:

```tsx
import { NEWSLETTER_LABELS_DE } from '@/components/blog-newsletter-cta/labels.de';

<NewsletterCta content={content} action={subscribeAction} labels={NEWSLETTER_LABELS_DE} />
```

| Key | English | German |
|---|---|---|
| `email` | Email address | E-Mail-Adresse |
| `submit` | Subscribe | Abonnieren |
| `sending` | Subscribing… | Wird abonniert … |
| `subscribed` | Thank you. Your address has been received. | Danke. Ihre Adresse ist eingegangen. |
| `invalid` | Please enter a valid email address. | Bitte geben Sie eine gültige E-Mail-Adresse ein. |
| `failed` | That did not work. Please try again later. | Das hat nicht geklappt. Bitte versuchen Sie es später noch einmal. |
| `honeypot` | Leave this field empty | Dieses Feld leer lassen |
| `notice` | We use your address only to send this newsletter. You can unsubscribe at any time. More: | Wir verwenden Ihre Adresse nur für diesen Newsletter. Sie können ihn jederzeit abbestellen. Mehr dazu: |

## Keyboard and screen readers

- A `section` named by its `h2` (a region landmark). Give two signups on one page different titles.
- The email field has a visible label, `type="email"`, `autocomplete="email"` and a 254-character limit.
- An invalid address sets `aria-invalid` on the field and ties the message to it with `aria-describedby`.
- The result (`subscribed` or `failed`) is announced from a `role="status"` line.
- The honeypot is hidden from people and screen readers and skipped by Tab.

## Client islands

`newsletter-form.tsx`: the form (`useActionState` for the pending button and the result). The section, heading and
notice render on the server.

## Notes

- The action runs on your server; the browser never talks to the provider, so nothing is requested from another
  host on your page.
- Neutral colours only, with every margin and box set on the element, so it looks the same with or without
  Tailwind's preflight.
