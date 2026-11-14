/** A part of a legal text: plain text, or a placeholder the site's owner must fill in. */
export type TextPart = { text: string } | { placeholder: string };

// `[[` + one or more characters that are not `[`, `]` or a line break + `]]`.
const PLACEHOLDER = /\[\[([^[\]\r\n]+)\]\]/g;

/**
 * Splits a text into plain parts and `[[…]]` placeholders. Anything that is not a whole marker (unclosed, empty,
 * nested, across a line break) stays text, so joining the parts back, placeholders re-wrapped in `[[…]]`, gives the
 * input exactly.
 */
export function splitPlaceholders(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let at = 0;
  for (const m of text.matchAll(PLACEHOLDER)) {
    if (m.index > at) parts.push({ text: text.slice(at, m.index) });
    parts.push({ placeholder: m[1] ?? '' });
    at = m.index + m[0].length;
  }
  if (at < text.length) parts.push({ text: text.slice(at) });
  return parts;
}

/** Whether any string inside a value (strings, arrays and plain objects, at any depth) holds a placeholder. */
export function hasPlaceholders(value: unknown): boolean {
  if (typeof value === 'string') return splitPlaceholders(value).some((part) => 'placeholder' in part);
  if (Array.isArray(value)) return value.some(hasPlaceholders);
  if (value !== null && typeof value === 'object') {
    const proto = Object.getPrototypeOf(value);
    if (proto === Object.prototype || proto === null) return Object.values(value).some(hasPlaceholders);
  }
  return false;
}
