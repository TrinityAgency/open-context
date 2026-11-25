'use client';

import { useActionState, useId, type ReactNode } from 'react';
import type { NewsletterLabels } from './labels';
import type { NewsletterAction, NewsletterState } from './newsletter';

export type NewsletterFormProps = {
  action: NewsletterAction;
  labels: NewsletterLabels;
  /** The line under the form, e.g. the privacy notice with its link (rendered on the server). */
  notice?: ReactNode;
  /** From which width the field and the button stand side by side: `sm` (default), or `lg` in a narrow column. */
  wideFrom?: 'sm' | 'lg';
};

const INITIAL: NewsletterState = { status: 'idle' };
// The colours, radius and font are the token contract's (design-tokens), each with its default, so the form without a
// design system draws what 1.0.0 drew. The button grows in height for a label wider than itself and breaks only
// between words; an invalid field takes an ink border (an emphasis, not the brand). Side by side, the field keeps at
// least 10rem and the row wraps, so in a narrow column (a sticky card in a sidebar) a button that does not fit beside
// the field moves under it instead of squeezing the field and running past the card.
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const BODY_FONT = 'font-[family-name:var(--oc-font-body)]';
const LABEL = `m-0 block text-sm font-medium ${INK}`;
const ROW = {
  sm: 'mt-1.5 flex flex-col gap-2 sm:flex-row sm:flex-wrap',
  lg: 'mt-1.5 flex flex-col gap-2 lg:flex-row lg:flex-wrap',
};
// The honeypot draws the field's box without the minimum width (it sits in a 1 px visually hidden box).
const FIELD_BOX = `m-0 box-border block h-10 w-full min-w-0 flex-1 appearance-none rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] px-3 py-2 ${BODY_FONT} text-base ${INK} aria-invalid:border-[var(--oc-ink,oklch(20.5%_0_none))] ${FOCUS}`;
const FIELD = `${FIELD_BOX} sm:min-w-40`;
const BUTTON = `m-0 box-border inline-flex min-h-10 max-w-full shrink-0 appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] px-4 py-2 text-center ${BODY_FONT} text-sm font-medium wrap-break-word text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] disabled:cursor-wait disabled:opacity-60 ${FOCUS}`;

/**
 * The signup form on a server action. Client island. It works before hydration and without JavaScript (the form
 * posts to the action and the page comes back with the result). After an invalid or failed submit the typed address
 * stays in the field; an invalid one is tied to its message.
 */
export function NewsletterForm({ action, labels, notice, wideFrom = 'sm' }: NewsletterFormProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const id = useId();
  const invalid = state.status === 'invalid';
  const kept = state.status === 'invalid' || state.status === 'failed' ? state.email : '';

  return (
    <form action={formAction} data-newsletter="" className="m-0 grid min-w-0 grid-cols-1 gap-3">
      <div className="min-w-0">
        <label htmlFor={`${id}-email`} className={LABEL}>
          {labels.email}
        </label>
        <div className={ROW[wideFrom]}>
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
          <p id={`${id}-error`} className={`m-0 mt-1.5 text-sm font-medium ${INK}`}>
            {labels.invalid}
          </p>
        ) : null}
      </div>

      {/* A spam trap: hidden from people and screen readers, filled in by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${id}-website`} className={LABEL}>
          {labels.honeypot}
        </label>
        <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" className={FIELD_BOX} />
      </div>

      {notice ? <p className="m-0 text-sm leading-relaxed text-[var(--oc-ink-muted,oklch(43.9%_0_none))]">{notice}</p> : null}
      <p role="status" className={`m-0 text-sm font-medium ${INK}`}>
        {state.status === 'subscribed' ? labels.subscribed : state.status === 'failed' ? labels.failed : null}
      </p>
    </form>
  );
}
