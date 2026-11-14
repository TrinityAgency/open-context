'use client';

import { useEffect, useId, useRef } from 'react';
import { CHOICE_CLASS, SECONDARY_CLASS } from './consent-banner';
import { isGranted } from './consent-cookie';
import type { ConsentLabels } from './labels';
import type { ConsentCategory, ConsentState } from './site-types';

const FRAME_CLASS =
  'm-auto box-border w-[min(32rem,calc(100%-2rem))] max-w-none overflow-auto rounded-lg border border-solid border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-neutral-900/50';

/**
 * The preferences dialog on a native `dialog` (`showModal`): one checkbox per category, the required ones checked
 * and disabled. Save stores exactly what is ticked; Escape and the close button close without saving. Each opening
 * starts from the stored choice, and focus returns to whatever opened it if that is still on the page. Rendered by
 * ConsentProvider.
 */
export function ConsentDialog({
  open,
  categories,
  state,
  labels,
  onSave,
  onClose,
}: {
  open: boolean;
  categories: readonly ConsentCategory[];
  state: ConsentState | null;
  labels: ConsentLabels;
  onSave: (ids: string[]) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement | null>(null);
  const form = useRef<HTMLFormElement | null>(null);
  const opener = useRef<Element | null>(null);
  const onCloseRef = useRef(onClose);
  const baseId = useId();
  const titleId = `${baseId}-title`;

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement;
      form.current?.reset();
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onNativeClose = () => {
      const back = opener.current;
      opener.current = null;
      if (back instanceof HTMLElement && back.isConnected) back.focus();
      onCloseRef.current();
    };
    dialog.addEventListener('close', onNativeClose);
    return () => dialog.removeEventListener('close', onNativeClose);
  }, []);

  return (
    <dialog ref={ref} aria-labelledby={titleId} className={FRAME_CLASS}>
      <form
        ref={form}
        className="box-border flex flex-col gap-5 p-6"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(new FormData(event.currentTarget).getAll('category').map(String));
        }}
      >
        <h2 id={titleId} className="m-0 text-lg leading-8 font-semibold">
          {labels.dialogTitle}
        </h2>
        <ul className="m-0 flex list-none flex-col gap-4 p-0">
          {categories.map((category, i) => {
            const inputId = `${baseId}-${i}`;
            return (
              <li key={category.id} className="flex items-start gap-3">
                <input
                  id={inputId}
                  type="checkbox"
                  name="category"
                  value={category.id}
                  defaultChecked={isGranted(state, category.id, categories)}
                  disabled={category.required}
                  aria-describedby={`${inputId}-text`}
                  className="m-0 mt-1 box-border h-4 w-4 shrink-0 cursor-pointer accent-neutral-900 disabled:cursor-default"
                />
                <div className="min-w-0">
                  <label htmlFor={inputId} className="font-medium">
                    {category.label}
                  </label>
                  {category.required ? (
                    <span className="ml-2 rounded-sm bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-700">
                      {labels.alwaysOn}
                    </span>
                  ) : null}
                  <p id={`${inputId}-text`} className="m-0 mt-1 text-sm text-neutral-600">
                    {category.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" className={SECONDARY_CLASS} onClick={() => ref.current?.close()}>
            {labels.close}
          </button>
          <button type="submit" className={`${CHOICE_CLASS} sm:w-auto`}>
            {labels.save}
          </button>
        </div>
      </form>
    </dialog>
  );
}
