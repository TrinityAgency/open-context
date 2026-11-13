/**
 * The tab a key moves to, by index, or null for a key the tab list does not handle. ArrowRight and ArrowLeft wrap
 * around; Home and End go to the first and last tab.
 */
export function nextIndex(key: string, current: number, count: number): number | null {
  if (count <= 0) return null;
  switch (key) {
    case 'ArrowRight':
      return (current + 1) % count;
    case 'ArrowLeft':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}

/** The tab id named by `param` in a search string, or null when it is missing or not one of `ids`. */
export function tabFromSearch(search: string, param: string, ids: readonly string[]): string | null {
  const value = new URLSearchParams(search).get(param);
  return value !== null && ids.includes(value) ? value : null;
}

/** The search string with `param` set to `id`; other params keep their order. Always starts with `?`. */
export function searchWithTab(search: string, param: string, id: string): string {
  const params = new URLSearchParams(search);
  params.set(param, id);
  return `?${params.toString()}`;
}
