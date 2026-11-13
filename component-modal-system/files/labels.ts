export type ModalLabels = {
  /** The accessible name of the close button (Dialog, Drawer). */
  close: string;
  /** AlertDialog's confirm button, unless `confirmLabel` is given. */
  confirm: string;
  /** AlertDialog's cancel button, unless `cancelLabel` is given. */
  cancel: string;
};

export const MODAL_LABELS: ModalLabels = {
  close: 'Close',
  confirm: 'Confirm',
  cancel: 'Cancel',
};
