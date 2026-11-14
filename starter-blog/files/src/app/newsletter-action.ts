'use server';

import { handleNewsletter, type NewsletterState } from '@/components/blog-newsletter-cta/newsletter';
import { subscribe } from '@/content/subscribe';

/**
 * The newsletter form's server action (a NewsletterAction): it checks the address and calls subscribe() from
 * src/content/subscribe.ts. It runs on the server, so the form works without JavaScript and the address never
 * appears in a URL.
 */
export async function subscribeAction(_state: NewsletterState, form: FormData): Promise<NewsletterState> {
  return handleNewsletter(form, subscribe);
}
