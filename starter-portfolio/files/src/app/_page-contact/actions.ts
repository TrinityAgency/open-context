'use server';

import { handleContact, type ContactResult } from './contact-message';
import { deliver } from './deliver';

/** The contact form's server action: works with and without JavaScript in the browser. */
export async function sendContact(previous: ContactResult, form: FormData): Promise<ContactResult> {
  return handleContact(form, { now: Date.now(), deliver });
}
