'use client';

import { useActionState, useId, type ReactNode } from 'react';
import { sendContact } from './actions';
import type { ContactField, ContactResult } from './contact-message';
import type { ContactLabels } from './labels';

export type ContactFormProps = {
  /** When the page was rendered (ms since the epoch); a form sent sooner than 3 s later counts as a bot. */
  startedAt: number;
  labels: ContactLabels;
  /** The line above the button, e.g. the privacy notice with its link (rendered on the server). */
  notice?: ReactNode;
};

const INITIAL: ContactResult = { status: 'idle' };
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const LABEL = 'm-0 block text-sm font-medium text-neutral-900';
const FIELD = `m-0 mt-1.5 box-border block w-full appearance-none rounded-md border border-solid border-neutral-300 bg-white px-3 py-2 font-sans text-base text-neutral-900 aria-invalid:border-neutral-900 ${FOCUS}`;
const ERROR = 'm-0 mt-1.5 text-sm font-medium text-neutral-900';

/**
 * The contact form: name, email and message, sent through a server action. Client island. It works before
 * hydration and without JavaScript (the form posts to the action and the page comes back with the result). After
 * an invalid submit or a failed delivery, the typed values stay in the fields and each error is tied to its field;
 * the form resends the first `startedAt`, so a quick fix is not taken for a bot.
 */
export function ContactForm({ startedAt, labels, notice }: ContactFormProps) {
  const [state, formAction, pending] = useActionState(sendContact, INITIAL);
  const id = useId();
  const kept = state.status === 'invalid' || state.status === 'failed' ? state : null;
  const errors = state.status === 'invalid' ? state.errors : {};
  const values = kept?.values ?? {};

  const field = (name: ContactField) => {
    const error = errors[name];
    return {
      id: `${id}-${name}`,
      name,
      required: true,
      defaultValue: values[name] ?? '',
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${id}-${name}-error` : undefined,
      className: FIELD,
    };
  };
  const errorLine = (name: ContactField) => {
    const error = errors[name];
    return error ? (
      <p id={`${id}-${name}-error`} className={ERROR}>
        {labels[error]}
      </p>
    ) : null;
  };

  return (
    <form action={formAction} className="m-0 grid min-w-0 gap-5">
      <div>
        <label htmlFor={`${id}-name`} className={LABEL}>
          {labels.name}
        </label>
        <input type="text" autoComplete="name" maxLength={100} {...field('name')} />
        {errorLine('name')}
      </div>
      <div>
        <label htmlFor={`${id}-email`} className={LABEL}>
          {labels.email}
        </label>
        <input type="email" autoComplete="email" maxLength={254} {...field('email')} />
        {errorLine('email')}
      </div>
      <div>
        <label htmlFor={`${id}-message`} className={LABEL}>
          {labels.message}
        </label>
        <textarea rows={6} autoComplete="off" maxLength={5000} {...field('message')} />
        {errorLine('message')}
      </div>

      {/* A spam trap: hidden from people and screen readers, filled in by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${id}-website`} className={LABEL}>
          {labels.honeypot}
        </label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" className={FIELD} />
      </div>
      <input type="hidden" name="startedAt" value={kept?.startedAt ?? startedAt} />

      {notice ? <p className="m-0 text-sm text-neutral-600">{notice}</p> : null}
      <div>
        <button
          type="submit"
          disabled={pending}
          className={`m-0 box-border inline-flex h-10 appearance-none items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 font-sans text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-wait disabled:opacity-60 ${FOCUS}`}
        >
          {pending ? labels.sending : labels.submit}
        </button>
      </div>
      <p role="status" className="m-0 text-sm font-medium text-neutral-900">
        {state.status === 'sent' ? labels.sent : state.status === 'failed' ? labels.failed : null}
      </p>
    </form>
  );
}
