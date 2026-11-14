import type { ChangelogEntry } from './site-types';

// SemVer 2.0 (semver.org): MAJOR.MINOR.PATCH, an optional -prerelease and an optional +build.
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+[0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*)?$/;
const NUMERIC = /^\d+$/;

const compareAscii = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
// Digits without leading zeros: the longer number is the larger, so any length compares exactly.
const compareNumeric = (a: string, b: string) => a.length - b.length || compareAscii(a, b);

function comparePrerelease(a: string | undefined, b: string | undefined): number {
  if (a === undefined || b === undefined) return a === b ? 0 : a === undefined ? 1 : -1;
  const x = a.split('.');
  const y = b.split('.');
  for (let i = 0; i < Math.min(x.length, y.length); i++) {
    const p = x[i] ?? '';
    const q = y[i] ?? '';
    const pn = NUMERIC.test(p);
    const qn = NUMERIC.test(q);
    const c = pn && qn ? compareNumeric(p, q) : pn ? -1 : qn ? 1 : compareAscii(p, q);
    if (c !== 0) return c;
  }
  return x.length - y.length;
}

/**
 * SemVer 2.0 precedence: negative when `a` ranks below `b`. Numeric cores, a prerelease below its release
 * (`1.0.0-beta.2 < 1.0.0`), prerelease identifiers numerically or by ASCII, build metadata ignored
 * (`1.0.0+build.5` equals `1.0.0`). A version that is not SemVer ranks below every SemVer one; two such versions
 * compare as strings.
 */
export function compareVersions(a: string, b: string): number {
  const pa = SEMVER.exec(a);
  const pb = SEMVER.exec(b);
  if (!pa || !pb) return pa ? 1 : pb ? -1 : compareAscii(a, b);
  for (let i = 1; i <= 3; i++) {
    const core = compareNumeric(pa[i] ?? '0', pb[i] ?? '0');
    if (core !== 0) return core;
  }
  return comparePrerelease(pa[4], pb[4]);
}

const byDate = (a: ChangelogEntry, b: ChangelogEntry) => compareAscii(b.date, a.date);

/** The releases newest first: by date, then by version, highest first. Stable; the input is not changed. */
export function sortReleases(entries: ChangelogEntry[]): ChangelogEntry[] {
  return [...entries].sort((a, b) => byDate(a, b) || compareVersions(b.version, a.version));
}

/**
 * One anchor per entry, in order: `v` + the version in lower case, every run of other characters than `a-z0-9`
 * turned into `-` (`1.0.0-beta.1` → `v1-0-0-beta-1`). A repeat gets `-2`, `-3`, … so no two anchors are equal.
 */
export function releaseAnchors(entries: ChangelogEntry[]): string[] {
  const used = new Set<string>();
  return entries.map((entry) => {
    const base = `v${entry.version.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`;
    let anchor = base;
    for (let n = 2; used.has(anchor); n++) anchor = `${base}-${n}`;
    used.add(anchor);
    return anchor;
  });
}

/**
 * A release date (`YYYY-MM-DD`, optionally followed by a time) written in full for the locale: `March 1, 2026`,
 * `1. März 2026`. The calendar day is read as written, so every time zone shows the same day. Throws `RangeError`
 * for anything else or a day that does not exist (`2026-02-30`).
 */
export function formatReleaseDate(iso: string, locale: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:$|T)/.exec(iso);
  const [year, month, day] = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : [NaN, NaN, NaN];
  const date = new Date(Date.UTC(year, month - 1, day));
  if (!m || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new RangeError(`formatReleaseDate: not a date (YYYY-MM-DD): ${JSON.stringify(iso)}`);
  }
  return new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}
