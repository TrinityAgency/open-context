import { z } from 'zod';
import type { ConsentCategory, ConsentState } from './site-types';

// The consent cookie's rules. Pure functions, no browser API: safe on the server and in the client.

/** The cookie's name: one first-party cookie holds the whole choice. */
export const CONSENT_COOKIE = 'site_consent';
/** How long a choice is kept: 180 days. */
export const CONSENT_MAX_AGE_SECONDS = 15552000;

const StoredConsent = z.object({ version: z.string(), decidedAt: z.string(), granted: z.array(z.string()) });

/** FNV-1a, 32 bit, over the UTF-8 bytes of `text`, as 8 hex digits. */
function fnv1a32(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let hash = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i += 1) {
    hash ^= bytes[i] ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

const byId = (a: ConsentCategory, b: ConsentCategory) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);

/**
 * The version a choice is stored under: `v<policyVersion>-` plus a fingerprint of the category list (ids sorted,
 * each with its required flag). Adding, removing or renaming a category, or flipping a required flag, changes it,
 * and a stored choice with another version counts as no choice, so the banner asks again. Raise `policyVersion`
 * to ask again for any other reason (a changed privacy policy).
 */
export function consentVersion(categories: readonly ConsentCategory[], policyVersion = 1): string {
  const list = [...categories].sort(byId).map((c) => `${c.id}:${c.required ? 1 : 0}`);
  return `v${policyVersion}-${fnv1a32(list.join(','))}`;
}

/** Known ids only, every required id, no duplicates, in category order. */
function normalizeGranted(categories: readonly ConsentCategory[], ids: readonly string[]): string[] {
  const wanted = new Set(ids);
  return [...new Set(categories.filter((c) => c.required || wanted.has(c.id)).map((c) => c.id))];
}

/** The state for a choice made now: the granted ids normalised, the current version, `decidedAt` = now. */
export function decide(
  categories: readonly ConsentCategory[],
  grantedIds: readonly string[],
  now: Date,
  policyVersion = 1,
): ConsentState {
  return {
    version: consentVersion(categories, policyVersion),
    decidedAt: now.toISOString(),
    granted: normalizeGranted(categories, grantedIds),
  };
}

/** The cookie value: the state as URI-encoded JSON. */
export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(JSON.stringify(state));
}

/**
 * Reads a cookie value back. Anything that is not a well-formed choice for exactly these categories and this policy
 * version (bad URI encoding, bad JSON, wrong shape, a decidedAt that is no date, another version) is `null`: no
 * decision, the banner shows again, nothing is granted. The granted list comes back normalised. Takes the value as
 * the browser stores it (URI-encoded) or already decoded, as some server cookie APIs hand it over.
 */
export function parseConsent(
  raw: string | null | undefined,
  categories: readonly ConsentCategory[],
  policyVersion = 1,
): ConsentState | null {
  if (!raw) return null;
  let data: unknown;
  try {
    data = JSON.parse(raw.startsWith('{') ? raw : decodeURIComponent(raw));
  } catch {
    return null;
  }
  const parsed = StoredConsent.safeParse(data);
  if (!parsed.success) return null;
  const { version, decidedAt, granted } = parsed.data;
  if (Number.isNaN(Date.parse(decidedAt))) return null;
  if (version !== consentVersion(categories, policyVersion)) return null;
  return { version, decidedAt, granted: normalizeGranted(categories, granted) };
}

/** Whether a category may run: a required one always, an optional one only once granted, an unknown id never. */
export function isGranted(state: ConsentState | null, id: string, categories: readonly ConsentCategory[]): boolean {
  const category = categories.find((c) => c.id === id);
  if (!category) return false;
  return category.required || (state?.granted.includes(id) ?? false);
}

/** A `document.cookie` assignment for the state: first-party, path `/`, 180 days, `SameSite=Lax`, `Secure` on https. */
export function cookieString(state: ConsentState, opts: { secure: boolean }): string {
  return `${CONSENT_COOKIE}=${serializeConsent(state)}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${opts.secure ? '; Secure' : ''}`;
}
