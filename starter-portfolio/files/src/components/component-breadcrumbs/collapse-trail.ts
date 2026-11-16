import type { LinkItem } from './site-types';

export type CollapsedTrail = { head: LinkItem[]; hidden: LinkItem[]; tail: LinkItem[] };

/**
 * Splits a trail for display. A trail of at most `maxVisible` items stays whole in `head`. A longer one keeps its
 * first item in `head` and its last `maxVisible − 1` items in `tail`; the rest go to `hidden`.
 * `maxVisible` is an integer ≥ 2, else RangeError.
 */
export function collapseTrail(items: LinkItem[], maxVisible = 4): CollapsedTrail {
  if (!Number.isInteger(maxVisible) || maxVisible < 2) {
    throw new RangeError(`maxVisible must be an integer ≥ 2, got ${maxVisible}`);
  }
  if (items.length <= maxVisible) return { head: [...items], hidden: [], tail: [] };
  const tailCount = maxVisible - 1;
  return {
    head: items.slice(0, 1),
    hidden: items.slice(1, items.length - tailCount),
    tail: items.slice(items.length - tailCount),
  };
}
