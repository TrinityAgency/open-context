'use client';

import { useId } from 'react';
import type { ConsentLayout } from './consent-provider';
import type { ConsentLabels } from './labels';

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
// A long label wraps between its words (a word wider than the whole button breaks); one line keeps the 40 px box.
// Never wrap-anywhere: in a row that cannot wrap it lets a button shrink to one letter and split its label mid-word.
const BUTTON_BASE =
  'm-0 box-border inline-flex min-h-10 cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid px-4 py-2 font-[family-name:var(--oc-font-body)] text-center text-sm font-medium wrap-break-word';
/** Accept all and Reject all share this one class string: equal weight, equal size (a grid gives equal widths). */
export const CHOICE_CLASS = `${BUTTON_BASE} w-full border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`;
export const SECONDARY_CLASS = `${BUTTON_BASE} border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink,oklch(20.5%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`;

// Beside the choices (from sm) Settings keeps its width and the choices give way, as in 1.0.0; a label wider than half
// the row wraps between its words.
const SETTINGS_CLASS = `${SECONDARY_CLASS} sm:max-w-[50%] sm:shrink-0`;
const HEADING = 'm-0 text-base font-semibold font-[family-name:var(--oc-font-heading)]';
const TEXT = 'm-0 mt-2 text-sm text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const CHOICES = 'grid grid-cols-2 gap-2 sm:w-96';
// One whole class string per layout for every element a layout changes.
const REGION: Record<ConsentLayout, string> = {
  card: 'pointer-events-none fixed inset-x-0 bottom-0 z-40 box-border p-4',
  bar: 'pointer-events-none fixed inset-x-0 bottom-0 z-40 box-border',
};
const PANEL: Record<ConsentLayout, string> = {
  card: 'pointer-events-auto mx-auto box-border max-w-3xl rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] p-5 text-[var(--oc-ink,oklch(20.5%_0_none))] shadow-lg wrap-break-word',
  bar: 'pointer-events-auto box-border w-full border-0 border-t border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] px-4 py-4 text-[var(--oc-ink,oklch(20.5%_0_none))] shadow-lg wrap-break-word',
};

/**
 * The first-visit banner: a named region fixed to the bottom of the viewport, as a floating card (`card`, the default)
 * or a full-width bar (`bar`, the text beside the choices from lg). Rendered by ConsentProvider.
 */
export function ConsentBanner({
  layout = 'card',
  labels,
  onAcceptAll,
  onRejectAll,
  onSettings,
}: {
  layout?: ConsentLayout;
  labels: ConsentLabels;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSettings: () => void;
}) {
  const titleId = useId();
  const settings = (
    <button type="button" className={SETTINGS_CLASS} onClick={onSettings}>
      {labels.settings}
    </button>
  );
  const choices = (
    <div className={CHOICES}>
      <button type="button" className={CHOICE_CLASS} onClick={onRejectAll}>
        {labels.rejectAll}
      </button>
      <button type="button" className={CHOICE_CLASS} onClick={onAcceptAll}>
        {labels.acceptAll}
      </button>
    </div>
  );
  const title = (
    <h2 id={titleId} className={HEADING}>
      {labels.bannerTitle}
    </h2>
  );
  const text = <p className={TEXT}>{labels.bannerText}</p>;

  return (
    <section aria-labelledby={titleId} data-layout={layout} className={REGION[layout]}>
      <div className={PANEL[layout]}>
        {layout === 'bar' ? (
          // The text beside the choices from lg (at md the text would be squeezed beside them); below, the choices under it.
          <div className="mx-auto box-border flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="min-w-0 lg:max-w-xl">
              {title}
              {text}
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:shrink-0">
              {settings}
              {choices}
            </div>
          </div>
        ) : (
          <>
            {title}
            {text}
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {settings}
              {choices}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
