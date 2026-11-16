'use client';

import { useId } from 'react';
import type { ConsentLabels } from './labels';

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
/** Accept all and Reject all share this one class string: equal weight, equal size (a grid gives equal widths). */
export const CHOICE_CLASS = `m-0 box-border inline-flex h-10 w-full cursor-pointer appearance-none items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 py-0 font-sans text-sm font-medium whitespace-nowrap text-white hover:bg-neutral-700 ${FOCUS}`;
export const SECONDARY_CLASS = `m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center rounded-md border border-solid border-neutral-300 bg-white px-4 py-0 font-sans text-sm font-medium whitespace-nowrap text-neutral-900 hover:bg-neutral-100 ${FOCUS}`;

/** The first-visit banner: a named region fixed to the bottom of the viewport. Rendered by ConsentProvider. */
export function ConsentBanner({
  labels,
  onAcceptAll,
  onRejectAll,
  onSettings,
}: {
  labels: ConsentLabels;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSettings: () => void;
}) {
  const titleId = useId();
  return (
    <section aria-labelledby={titleId} className="pointer-events-none fixed inset-x-0 bottom-0 z-40 box-border p-4">
      <div className="pointer-events-auto mx-auto box-border max-w-3xl rounded-lg border border-solid border-neutral-200 bg-white p-5 text-neutral-900 shadow-lg">
        <h2 id={titleId} className="m-0 text-base font-semibold">
          {labels.bannerTitle}
        </h2>
        <p className="m-0 mt-2 text-sm text-neutral-700">{labels.bannerText}</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className={SECONDARY_CLASS} onClick={onSettings}>
            {labels.settings}
          </button>
          <div className="grid grid-cols-2 gap-2 sm:w-96">
            <button type="button" className={CHOICE_CLASS} onClick={onRejectAll}>
              {labels.rejectAll}
            </button>
            <button type="button" className={CHOICE_CLASS} onClick={onAcceptAll}>
              {labels.acceptAll}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
