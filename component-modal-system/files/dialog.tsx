'use client';

import { useId } from 'react';
import { MODAL_LABELS } from './labels';
import type { ModalBaseProps } from './types';
import { useNativeDialog, useOpenState } from './use-native-dialog';

/** Shared button and frame classes; every value a browser default would otherwise supply is set here. */
export const TRIGGER_CLASS =
  'm-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 font-sans text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
export const SECONDARY_CLASS =
  'm-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center gap-2 rounded-md border border-solid border-neutral-300 bg-white px-4 font-sans text-sm font-medium text-neutral-900 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
export const FRAME_CLASS = 'box-border overflow-auto bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-neutral-900/50';
const CLOSE_CLASS =
  'm-0 box-border inline-flex h-8 w-8 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-md border-0 bg-transparent p-0 text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const CENTERED_CLASS = 'm-auto w-[min(32rem,calc(100%-2rem))] max-w-none rounded-lg border border-solid border-neutral-200';

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
            <h2 id={titleId} className="m-0 text-lg leading-8 font-semibold">
              {title}
            </h2>
            <button type="button" aria-label={l.close} className={CLOSE_CLASS} onClick={() => ref.current?.close()}>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          {description ? (
            <p id={descriptionId} className="m-0 text-sm text-neutral-600">
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
