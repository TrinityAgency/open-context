'use client';

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react';
import { nextIndex, searchWithTab, tabFromSearch } from './tab-keys';

export type TabsClientProps = {
  tabs: { id: string; label: ReactNode }[];
  /** The panels, rendered on the server, in tab order. */
  panels: ReactNode[];
  label: string;
  defaultTab: string;
  param?: string;
  className?: string;
};

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange);
  return () => window.removeEventListener('popstate', onChange);
}
const browserSearch = () => window.location.search;
const serverSearch = () => '';

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is. The selected tab's underline is brand-ink: it is the
// tab's main mark, and the contract guarantees brand-ink's contrast on the surface ([brand-ink, surface]).
const FOCUS_COLOUR = 'focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const TAB = `m-0 box-border cursor-pointer appearance-none rounded-none border-0 border-b-2 bg-transparent px-4 py-2 font-[family-name:var(--oc-font-body)] text-sm font-medium focus-visible:outline-2 focus-visible:-outline-offset-2 ${FOCUS_COLOUR} motion-safe:transition-colors`;
const TAB_STATE = {
  active: 'border-[var(--oc-brand-ink,oklch(20.5%_0_none))] text-[var(--oc-ink,oklch(20.5%_0_none))]',
  inactive: 'border-transparent text-[var(--oc-ink-muted,oklch(43.9%_0_none))] hover:text-[var(--oc-ink,oklch(20.5%_0_none))]',
} as const;
const PANEL = `rounded-[var(--oc-radius,0.25rem)] pt-4 text-[var(--oc-ink-body,oklch(37.1%_0_none))] wrap-break-word focus-visible:outline-2 focus-visible:outline-offset-2 ${FOCUS_COLOUR}`;

/** The interactive part of Tabs: selection, roving focus and the optional URL sync. */
export function TabsClient({ tabs, panels, label, defaultTab, param, className }: TabsClientProps) {
  const baseId = useId();
  const ids = tabs.map((t) => t.id);
  const [picked, setPicked] = useState<string | null>(null);
  // The URL is read only in the browser, after hydration (the server renders defaultTab).
  const search = useSyncExternalStore(subscribe, browserSearch, serverSearch);
  const fromUrl = param ? tabFromSearch(search, param, ids) : null;
  const selected = picked ?? fromUrl ?? defaultTab;
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (id: string) => {
    setPicked(id);
    if (param) {
      const { pathname, search: current, hash } = window.location;
      window.history.replaceState(window.history.state, '', `${pathname}${searchWithTab(current, param, id)}${hash}`);
    }
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const next = nextIndex(event.key, index, tabs.length);
    if (next === null) return;
    event.preventDefault();
    select(ids[next]!);
    tabRefs.current[next]?.focus();
  };

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  return (
    <div className={className}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto border-b border-[var(--oc-line,oklch(92.2%_0_none))]">
        {tabs.map((tab, i) => {
          const active = tab.id === selected;
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={tabId(tab.id)}
              aria-selected={active}
              aria-controls={panelId(tab.id)}
              tabIndex={active ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(event) => onKeyDown(event, i)}
              className={`${TAB} ${active ? TAB_STATE.active : TAB_STATE.inactive}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={panelId(tab.id)}
          aria-labelledby={tabId(tab.id)}
          tabIndex={0}
          hidden={tab.id !== selected}
          className={PANEL}
        >
          {panels[i]}
        </div>
      ))}
    </div>
  );
}
