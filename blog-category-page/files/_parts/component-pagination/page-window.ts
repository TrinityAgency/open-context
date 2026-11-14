export type PageWindowItem = number | 'gap';

export type PageWindowOptions = {
  /** Pages shown on each side of the current page. An integer ≥ 0; default 1. */
  siblings?: number;
  /** Pages always shown at each end. An integer ≥ 1; default 1. */
  boundaries?: number;
};

function assertInteger(name: string, value: number, min: number) {
  if (!Number.isInteger(value) || value < min) {
    throw new RangeError(`${name} must be an integer ≥ ${min}, got ${value}`);
  }
}

/** The page clamped into 1…pageCount (pageCount ≥ 1). */
export function clampPage(page: number, pageCount: number): number {
  return Math.min(Math.max(page, 1), pageCount);
}

/**
 * The page numbers to show for `page` of `pageCount`, with `'gap'` where pages are left out. A gap always hides at
 * least two pages (one hidden page is shown instead), so with the defaults the window holds min(pageCount, 7) items.
 * A page outside the range is clamped; a page count below 1 gives an empty window; a non-integer throws RangeError.
 */
export function pageWindow(page: number, pageCount: number, options: PageWindowOptions = {}): PageWindowItem[] {
  const siblings = options.siblings ?? 1;
  const boundaries = options.boundaries ?? 1;
  if (!Number.isInteger(page)) throw new RangeError(`page must be an integer, got ${page}`);
  if (!Number.isInteger(pageCount)) throw new RangeError(`pageCount must be an integer, got ${pageCount}`);
  assertInteger('siblings', siblings, 0);
  assertInteger('boundaries', boundaries, 1);
  if (pageCount < 1) return [];

  const current = clampPage(page, pageCount);
  const range = (from: number, to: number) => (from > to ? [] : Array.from({ length: to - from + 1 }, (_, i) => from + i));
  const startPages = range(1, Math.min(boundaries, pageCount));
  const endPages = range(Math.max(pageCount - boundaries + 1, boundaries + 1), pageCount);
  const siblingsStart = Math.max(
    Math.min(current - siblings, pageCount - boundaries - siblings * 2 - 1),
    boundaries + 2,
  );
  const siblingsEnd = Math.min(Math.max(current + siblings, boundaries + siblings * 2 + 2), pageCount - boundaries - 1);

  const items: PageWindowItem[] = [...startPages];
  if (siblingsStart > boundaries + 2) items.push('gap');
  else if (boundaries + 1 < pageCount - boundaries) items.push(boundaries + 1);
  items.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < pageCount - boundaries - 1) items.push('gap');
  else if (pageCount - boundaries > boundaries) items.push(pageCount - boundaries);
  items.push(...endPages);
  return items;
}
