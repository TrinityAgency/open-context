'use client';

import { useEffect, useId, useRef } from 'react';
import { DESCRIPTION_CLASS, FRAME_CLASS, SECONDARY_CLASS, TITLE_CLASS, TRIGGER_CLASS } from './dialog';
import { MODAL_LABELS } from './labels';
import type { AlertDialogProps } from './types';
import { useNativeDialog, useOpenState } from './use-native-dialog';

const PLACEMENT =
  'm-auto w-[min(28rem,calc(100%-2rem))] max-w-none rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))]';

/**
 * A confirmation on native `<dialog>` with role="alertdialog". Focus starts on Cancel; Escape cancels; a backdrop
 * click does nothing; there is no close button. Confirm calls `onConfirm` once and closes.
 */
export function AlertDialog({
  title,
  description,
  open: openProp,
  defaultOpen,
  onOpenChange,
  trigger,
  triggerClassName,
  labels,
  className,
  onConfirm,
  confirmLabel,
  cancelLabel,
  destructive = false,
}: AlertDialogProps) {
  const l = { ...MODAL_LABELS, ...labels };
  const [open, setOpen] = useOpenState(openProp, defaultOpen, onOpenChange);
  const ref = useNativeDialog(open, () => setOpen(false));
  const cancelRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) cancelRef.current?.focus();
  }, [open]);

  return (
    <>
      {trigger !== undefined ? (
        <button type="button" className={triggerClassName ?? TRIGGER_CLASS} onClick={() => setOpen(true)}>
          {trigger}
        </button>
      ) : null}
      <dialog
        ref={ref}
        role="alertdialog"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`${FRAME_CLASS} ${PLACEMENT}${className ? ` ${className}` : ''}`}
      >
        <div className="box-border flex flex-col gap-4 p-6">
          <h2 id={titleId} className={TITLE_CLASS}>
            {title}
          </h2>
          {description ? (
            <p id={descriptionId} className={DESCRIPTION_CLASS}>
              {description}
            </p>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2">
            <button ref={cancelRef} type="button" className={SECONDARY_CLASS} onClick={() => ref.current?.close()}>
              {cancelLabel ?? l.cancel}
            </button>
            <button
              type="button"
              data-destructive={destructive ? '' : undefined}
              className={`${TRIGGER_CLASS} gap-2`}
              onClick={() => {
                onConfirm();
                ref.current?.close();
              }}
            >
              {destructive ? (
                <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
                  <path d="M8 2.5 14 13H2L8 2.5Z" strokeLinejoin="round" />
                  <path d="M8 6.5v3M8 11.25v.01" strokeLinecap="round" />
                </svg>
              ) : null}
              {confirmLabel ?? l.confirm}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
