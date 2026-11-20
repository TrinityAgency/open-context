'use client';

import { ModalFrame } from './dialog';
import type { DrawerProps, DrawerSide } from './types';

const SIDES: Record<DrawerSide, string> = {
  right: 'm-0 ml-auto h-full max-h-none w-80 max-w-[calc(100%-3rem)] border-0 border-l border-[var(--oc-line,oklch(92.2%_0_none))]',
  left: 'm-0 mr-auto h-full max-h-none w-80 max-w-[calc(100%-3rem)] border-0 border-r border-[var(--oc-line,oklch(92.2%_0_none))]',
  bottom:
    'm-0 mt-auto max-h-[85%] w-full max-w-none rounded-t-[calc(var(--oc-radius,0.25rem)*2)] border-0 border-t border-[var(--oc-line,oklch(92.2%_0_none))]',
};

/** A modal panel along one edge of the viewport, on native `<dialog>`. Default side: right. */
export function Drawer({ side = 'right', ...props }: DrawerProps) {
  return <ModalFrame {...props} placementClassName={SIDES[side]} />;
}
