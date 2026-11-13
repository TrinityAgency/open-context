import type { ReactNode } from 'react';
import { TabsClient } from './tabs-client';

export type TabItem = { id: string; label: ReactNode; content: ReactNode };

export type TabsProps = {
  items: TabItem[];
  /** The tab list's accessible name, e.g. "Services". */
  label: string;
  /** The tab selected on first render; default the first. */
  defaultTab?: string;
  /** When given, the selected tab is kept in this URL search param (replaceState, no history entry). */
  param?: string;
  className?: string;
};

/**
 * Tabs with automatic activation and roving focus. A server component: every panel renders on the server and is
 * handed to the small client island that handles selection, keys and the optional URL sync.
 */
export function Tabs({ items, label, defaultTab, param, className }: TabsProps) {
  if (items.length === 0) return null;
  const initial = items.some((item) => item.id === defaultTab) ? defaultTab! : items[0]!.id;
  return (
    <TabsClient
      tabs={items.map(({ id, label: tabLabel }) => ({ id, label: tabLabel }))}
      panels={items.map((item) => item.content)}
      label={label}
      defaultTab={initial}
      param={param}
      className={className}
    />
  );
}
