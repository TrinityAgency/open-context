/**
 * A phone number as a `tel:` URL: one leading `+` when the number starts with one, then the digits only
 * (`'+1 555 0100'` → `'tel:+15550100'`, `'(030) 000-0000'` → `'tel:0300000000'`). After a country code, a `(0)`
 * trunk prefix (`+49 (0)30 …`) is dropped: it is not dialled from abroad.
 */
export function telHref(phone: string): string {
  const trimmed = phone.trim();
  const international = trimmed.startsWith('+');
  const digits = (international ? trimmed.replace(/\(\s*0\s*\)/g, '') : trimmed).replace(/\D/g, '');
  return `tel:${international ? '+' : ''}${digits}`;
}
