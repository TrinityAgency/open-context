'use server';

import { handleNewsletter, type NewsletterState } from './_sections/newsletter/newsletter';
import { subscribe } from './subscribe';

/** The signup form's server action: works with and without JavaScript in the browser. */
export async function subscribeAction(_previous: NewsletterState, form: FormData): Promise<NewsletterState> {
  return handleNewsletter(form, subscribe);
}
