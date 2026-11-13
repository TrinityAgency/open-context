import type { ReactNode } from 'react';
import type { ModalLabels } from './labels';

export type ModalBaseProps = {
  /** The heading; it also names the dialog for screen readers. */
  title: ReactNode;
  /** A short line under the title; it describes the dialog for screen readers. */
  description?: ReactNode;
  children?: ReactNode;
  /** Controlled open state. Leave it out to let the component keep its own. */
  open?: boolean;
  /** Open on first render (uncontrolled). */
  defaultOpen?: boolean;
  /** Called with true when the trigger opens it, with false whenever it closes (Escape, close button, backdrop). */
  onOpenChange?: (open: boolean) => void;
  /** Content of a trigger button rendered before the dialog. Leave it out to open it through `open`. */
  trigger?: ReactNode;
  /** Replaces the trigger button's classes. */
  triggerClassName?: string;
  labels?: Partial<ModalLabels>;
  /** Added to the dialog element's classes. */
  className?: string;
};

export type DrawerSide = 'left' | 'right' | 'bottom';

export type DrawerProps = ModalBaseProps & { side?: DrawerSide };

export type AlertDialogProps = Omit<ModalBaseProps, 'children'> & {
  onConfirm: () => void;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  /** Marks the confirm button with `data-destructive` and a warning icon. */
  destructive?: boolean;
};
