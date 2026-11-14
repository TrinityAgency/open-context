import { z } from 'zod';

export type NewsletterState =
  | { status: 'idle' }
  | { status: 'invalid'; email: string }
  | { status: 'subscribed' }
  | { status: 'failed'; email: string };

/** A server action for the form: `useActionState` calls it with the previous state and the submitted form. */
export type NewsletterAction = (state: NewsletterState, form: FormData) => Promise<NewsletterState>;

/** One line (no CR or LF anywhere), then trimmed: an email address of at most 254 characters. */
export const newsletterEmail = z
  .string()
  .refine((value) => !/[\r\n]/.test(value), 'must be one line')
  .transform((value) => value.trim())
  .pipe(z.string().max(254).email());

/**
 * Handles one signup: call it from your own `'use server'` action with your provider's `subscribe(email)`.
 * - A filled honeypot field (`website`) answers `subscribed` without calling `subscribe` (bots are not told).
 * - An invalid address answers `invalid` with the typed value, so the form shows it again.
 * - A `subscribe` that throws answers `failed` with the address, after one `console.error`.
 * - Otherwise it calls `subscribe` once with the trimmed address and answers `subscribed`.
 */
export async function handleNewsletter(
  form: FormData,
  subscribe: (email: string) => Promise<void>,
): Promise<NewsletterState> {
  const honeypot = form.get('website');
  if (typeof honeypot === 'string' && honeypot !== '') return { status: 'subscribed' };
  const value = form.get('email');
  const typed = typeof value === 'string' ? value : '';
  const parsed = newsletterEmail.safeParse(typed);
  if (!parsed.success) return { status: 'invalid', email: typed };
  try {
    await subscribe(parsed.data);
  } catch (error) {
    console.error('newsletter: subscribe failed', error);
    return { status: 'failed', email: typed };
  }
  return { status: 'subscribed' };
}
