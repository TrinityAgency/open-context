'use client';

import { useActionState, useId, type ReactNode } from 'react';
import type { NewsletterLabels } from './labels';
import type { NewsletterAction, NewsletterState } from './newsletter';

export type NewsletterFormProps = {
  action: NewsletterAction;
  labels: NewsletterLabels;
  /** The line under the form, e.g. the privacy notice with its link (rendered on the server). */
  notice?: ReactNode;
};

const INITIAL: NewsletterState = { status: 'idle' };
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const LABEL = 'm-0 block text-sm font-medium text-neutral-900';
const FIELD = `m-0 box-border block h-10 w-full min-w-0 flex-1 appearance-none rounded-md border border-solid border-neutral-300 bg-white px-3 py-2 font-sans text-base text-neutral-900 aria-invalid:border-neutral-900 ${FOCUS}`;
const BUTTON = `m-0 box-border inline-flex h-10 shrink-0 appearance-none items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 font-sans text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-wait disabled:opacity-60 ${FOCUS}`;

/**
 * The signup form on a server action. Client island. It works before hydration and without JavaScript (the form
 * posts to the action and the page comes back with the result). After an invalid or failed submit the typed address
 * stays in the field; an invalid one is tied to its message.
 */
export function NewsletterForm({ action, labels, notice }: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const id = useId();
  const invalid = state.status === 'invalid';
  const kept = state.status === 'invalid' || state.status === 'failed' ? state.email : '';

  return (
    <form action={formAction} data-newsletter="" className="m-0 grid min-w-0 gap-3">
      <div className="min-w-0">
        <label htmlFor={`${id}-email`} className={LABEL}>
          {labels.email}
        </label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={kept}
            aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? `${id}-error` : undefined}
            className={FIELD}
          />
          <button type="submit" disabled={pending} className={BUTTON}>
            {pending ? labels.sending : labels.submit}
          </button>
        </div>
        {invalid ? (
          <p id={`${id}-error`} className="m-0 mt-1.5 text-sm font-medium text-neutral-900">
            {labels.invalid}
          </p>
        ) : null}
      </div>

      {/* A spam trap: hidden from people and screen readers, filled in by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${id}-website`} className={LABEL}>
          {labels.honeypot}
        </label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" className={FIELD} />
      </div>

      {notice ? <p className="m-0 text-sm leading-relaxed text-neutral-600">{notice}</p> : null}
      <p role="status" className="m-0 text-sm font-medium text-neutral-900">
        {state.status === 'subscribed' ? labels.subscribed : state.status === 'failed' ? labels.failed : null}
      </p>
    </form>
  );
}
