/**
 * Text or an attribute value made safe for XML 1.0: the characters XML forbids are dropped (U+0000–U+0008, U+000B,
 * U+000C, U+000E–U+001F, U+FFFE, U+FFFF and lone surrogates), and `& < > " '` are escaped. Tab, line feed, carriage
 * return and every other character, emoji included, are kept.
 */
export function xmlText(value: string): string {
  let kept = '';
  for (const char of value) {
    const cp = char.codePointAt(0) ?? 0;
    if ((cp < 0x20 && cp !== 0x9 && cp !== 0xa && cp !== 0xd) || cp === 0xfffe || cp === 0xffff || (cp >= 0xd800 && cp <= 0xdfff)) {
      continue;
    }
    kept += char;
  }
  return kept
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
