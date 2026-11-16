const DATE_PREFIX = /^(\d{4})-(\d{2})-(\d{2})(?=$|T)/;

/**
 * The calendar date written at the start of an ISO 8601 value (`YYYY-MM-DD…`), formatted for `locale` (medium
 * style). The offset never moves the day: `2026-03-01T23:30:00-05:00` shows 1 March, as the author wrote it.
 * Throws a RangeError when the value does not start with a real date.
 */
export function formatPostDate(iso: string, locale: string): string {
  const match = DATE_PREFIX.exec(iso);
  const n = (i: number) => Number(match?.[i]);
  const date = new Date(Date.UTC(n(1), n(2) - 1, n(3)));
  if (!match || date.getUTCFullYear() !== n(1) || date.getUTCMonth() !== n(2) - 1 || date.getUTCDate() !== n(3)) {
    throw new RangeError(`not a date: ${iso}`);
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone: 'UTC' }).format(Date.UTC(n(1), n(2) - 1, n(3)));
}
