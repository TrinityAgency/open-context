'use client';

import { useEffect } from 'react';

/**
 * The header's one client island; renders nothing. Inside the header that holds the drawer `drawerId`:
 * a link click closes the drawer and every open sub-menu (a client-side route change keeps the page, so nothing
 * else would close them); a click outside an open sub-menu closes it; Escape closes an open sub-menu and, when
 * focus was inside it, puts focus back on its summary. The drawer's own Escape and outside click are the native
 * popover's.
 */
export function CloseOnNavigate({ drawerId }: { drawerId: string }) {
  useEffect(() => {
    const drawer = document.getElementById(drawerId);
    const header = drawer?.closest('header');
    if (!drawer || !header) return;

    const openMenus = () => [...header.querySelectorAll<HTMLDetailsElement>('details[open]')];

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target && header.contains(target) && target.closest('a')) {
        if (typeof drawer.hidePopover === 'function' && drawer.matches(':popover-open')) drawer.hidePopover();
        for (const menu of openMenus()) menu.open = false;
        return;
      }
      for (const menu of openMenus()) if (!target || !menu.contains(target)) menu.open = false;
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      for (const menu of openMenus()) {
        const hadFocus = menu.contains(document.activeElement);
        menu.open = false;
        if (hadFocus) menu.querySelector('summary')?.focus();
      }
    };

    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [drawerId]);

  return null;
}
