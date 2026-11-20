'use client';

import { useId } from 'react';
import { MODAL_LABELS } from './labels';
import type { ModalBaseProps } from './types';
import { useNativeDialog, useOpenState } from './use-native-dialog';

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is. The scrim veils the page behind an open dialog.
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
// A long label wraps between its words (a word wider than the whole button breaks); one line keeps the 40 px box. Never
// wrap-anywhere: in a row that cannot wrap it lets the button shrink to one letter and split its label mid-word.
const BUTTON_BASE =
  'm-0 box-border inline-flex min-h-10 cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid px-4 py-2 font-[family-name:var(--oc-font-body)] text-center text-sm font-medium wrap-break-word';

/** Shared button and frame classes; every value a browser default would otherwise supply is set here. */
export const TRIGGER_CLASS = `${BUTTON_BASE} border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`;
export const SECONDARY_CLASS = `${BUTTON_BASE} gap-2 border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink,oklch(20.5%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`;
export const FRAME_CLASS = `box-border overflow-auto bg-[var(--oc-surface,#fff)] p-0 text-[var(--oc-ink,oklch(20.5%_0_none))] shadow-xl wrap-break-word backdrop:bg-[var(--oc-scrim,oklch(20.5%_0_none))]/50 ${FOCUS}`;
/** The title row's heading: it may break a long word beside the close button. */
export const TITLE_CLASS = 'm-0 min-w-0 text-lg leading-8 font-semibold font-[family-name:var(--oc-font-heading)]';
/** The line under the title. */
export const DESCRIPTION_CLASS = 'm-0 text-sm text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const CLOSE_CLASS = `m-0 box-border inline-flex h-8 w-8 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border-0 bg-transparent p-0 text-[var(--oc-ink-body,oklch(37.1%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`;
const CENTERED_CLASS =
  'm-auto w-[min(32rem,calc(100%-2rem))] max-w-none rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))]';

/** The frame Dialog and Drawer share: trigger, native dialog, title row with close button, description, body. */
export function ModalFrame({
  title,
  description,
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  trigger,
  triggerClassName,
  labels,
  className,
  placementClassName,
}: ModalBaseProps & { placementClassName: string }) {
  const l = { ...MODAL_LABELS, ...labels };
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const ref = useNativeDialog(open, () => setOpen(false));
  const titleId = useId();
  const descriptionId = useId();

  return (
    <>
      {trigger !== undefined ? (
        <button type="button" className={triggerClassName ?? TRIGGER_CLASS} onClick={() => setOpen(true)}>
          {trigger}
        </button>
      ) : null}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`${FRAME_CLASS} ${placementClassName}${className ? ` ${className}` : ''}`}
        onClick={(event) => {
          // Only a click on the dialog box itself, outside the content wrapper, is a click on the backdrop.
          if (event.target === event.currentTarget) ref.current?.close();
        }}
      >
        <div className="box-border flex min-h-full flex-col gap-4 p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id={titleId} className={TITLE_CLASS}>
              {title}
            </h2>
            <button type="button" aria-label={l.close} className={CLOSE_CLASS} onClick={() => ref.current?.close()}>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {description ? (
            <p id={descriptionId} className={DESCRIPTION_CLASS}>
              {description}
            </p>
          ) : null}
          {children}
        </div>
      </dialog>
    </>
  );
}

/** A centred modal dialog on native `<dialog>`: Escape, the close button and a backdrop click close it. */
export function Dialog(props: ModalBaseProps) {
  return <ModalFrame {...props} placementClassName={CENTERED_CLASS} />;
}
