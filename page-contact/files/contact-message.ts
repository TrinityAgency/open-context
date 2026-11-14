import { z } from 'zod';

/** A form sent sooner than this after the page was rendered is treated as a bot. */
export const MIN_FILL_MS = 3000;

export type ContactField = 'name' | 'email' | 'message';
export type ContactError = 'required' | 'invalid' | 'tooLong';
export type ContactMessage = { name: string; email: string; message: string };
/**
 * What an answer hands back for the form to show again: the values as typed (never the honeypot), and the submitted
 * `startedAt`, so a resubmit counts from the first render, not from the page the server sent back without JavaScript.
 */
export type ContactKept = { values: Partial<Record<ContactField, string>>; startedAt: string };
export type ContactResult =
  | { status: 'idle' }
  | ({ status: 'invalid'; errors: Partial<Record<ContactField, ContactError>> } & ContactKept)
  | { status: 'sent' }
  | ({ status: 'failed' } & ContactKept);

// A line break in a single-line field could become a header wherever the message is mailed on.
const noLineBreak = (value: string) => !/[\r\n]/.test(value);

/** The three fields, trimmed: a name of 1–100 characters, an email of at most 254, a message of 1–5000. */
export const contactSchema = z.object({
  name: z.string().trim().min(1).max(100).refine(noLineBreak),
  email: z.string().trim().min(1).max(254).email().refine(noLineBreak),
  message: z.string().trim().min(1).max(5000),
});

const FIELDS: ContactField[] = ['name', 'email', 'message'];

const text = (form: FormData, key: string) => {
  const value = form.get(key);
  return typeof value === 'string' ? value : '';
};

const errorOf = (issue: z.ZodIssue): ContactError =>
  issue.code === 'too_small' ? 'required' : issue.code === 'too_big' ? 'tooLong' : 'invalid';

/**
 * Checks a submitted contact form and hands a valid message to `deliver`.
 *
 * - The spam traps answer `sent` without delivering, so a bot learns nothing: a filled honeypot (`website`), or a
 *   `startedAt` that is missing, not a number, or less than `MIN_FILL_MS` before `now`.
 * - An invalid field answers `invalid` with the first error per field and the values as typed (never the honeypot).
 * - A `deliver` that throws answers `failed`, with the values as typed, so the visitor keeps the message.
 * - `invalid` and `failed` also carry the submitted `startedAt` (see `ContactKept`).
 */
export async function handleContact(
  form: FormData,
  deps: { now: number; deliver: (message: ContactMessage) => Promise<void> },
): Promise<ContactResult> {
  if (text(form, 'website') !== '') return { status: 'sent' };
  const startedAt = text(form, 'startedAt');
  if (!/^\d+$/.test(startedAt) || deps.now - Number(startedAt) < MIN_FILL_MS) return { status: 'sent' };

  const values = { name: text(form, 'name'), email: text(form, 'email'), message: text(form, 'message') };
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const errors: Partial<Record<ContactField, ContactError>> = {};
    for (const issue of parsed.error.issues) {
      const field = FIELDS.find((f) => f === issue.path[0]);
      if (field && !errors[field]) errors[field] = errorOf(issue);
    }
    return { status: 'invalid', errors, values, startedAt };
  }

  try {
    await deps.deliver(parsed.data);
  } catch (error) {
    console.error('contact form: the message could not be delivered', error);
    return { status: 'failed', values, startedAt };
  }
  return { status: 'sent' };
}
