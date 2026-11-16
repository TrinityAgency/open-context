import type { PricingInterval, PricingPlan } from './site-types';

const INTERVAL_ORDER: PricingInterval[] = ['month', 'year', 'once'];

type IntlWithSupported = typeof Intl & { supportedValuesOf?: (key: 'currency') => string[] };

/** Whether the runtime's Intl knows the currency (when it can list them); a malformed code also fails in Intl. */
function knownCurrency(currency: string): boolean {
  const list = (Intl as IntlWithSupported).supportedValuesOf;
  return typeof list === 'function' ? list('currency').includes(currency.toUpperCase()) : true;
}

// ISO 4217's minor-unit exponents other than 2 (every other code has 2). The scale of `priceMinor` comes from this
// table, not from Intl: Intl shows some currencies without decimals (HUF, IDR, COP, PKR, …) although ISO 4217 counts
// their minor units in hundredths; and Intl's data differs between runtimes.
const ISO_EXPONENT: Record<string, number> = {
  BIF: 0, CLP: 0, DJF: 0, GNF: 0, ISK: 0, JPY: 0, KMF: 0, KRW: 0, PYG: 0, RWF: 0, UGX: 0, UYI: 0, VND: 0, VUV: 0,
  XAF: 0, XOF: 0, XPF: 0,
  BHD: 3, IQD: 3, JOD: 3, KWD: 3, LYD: 3, OMR: 3, TND: 3,
  CLF: 4, UYW: 4,
};

/** How many decimal places the currency's minor unit has, per ISO 4217: 2 for most, 0 for JPY, 3 for KWD. */
export function minorUnitDigits(currency: string): number {
  return ISO_EXPONENT[currency.toUpperCase()] ?? 2;
}

/**
 * A price in ISO 4217 minor units, written the way the locale writes it: `formatPrice(2950, 'EUR', 'en')` is
 * `€29.50`, `formatPrice(1200, 'JPY', 'en')` is `¥1,200` (the yen has no minor unit), `formatPrice(990000, 'HUF',
 * 'en')` is `HUF 9,900`. A whole amount shows no decimals (`29 €`). Throws `RangeError` for anything but a
 * non-negative integer, or a currency Intl does not know.
 */
export function formatPrice(priceMinor: number, currency: string, locale: string): string {
  if (!Number.isSafeInteger(priceMinor) || priceMinor < 0) {
    throw new RangeError(`formatPrice: priceMinor must be a non-negative integer, got ${priceMinor}`);
  }
  if (!knownCurrency(currency)) throw new RangeError(`formatPrice: unknown currency ${JSON.stringify(currency)}`);
  const digits = minorUnitDigits(currency);
  const scale = 10 ** digits;
  const whole = priceMinor % scale === 0;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: whole ? 0 : digits,
    maximumFractionDigits: digits,
  }).format(priceMinor / scale);
}

/** The intervals the plans use, each once, in the order month, year, once. */
export function intervalsOf(plans: PricingPlan[]): PricingInterval[] {
  const present = new Set(plans.map((plan) => plan.interval));
  return INTERVAL_ORDER.filter((interval) => present.has(interval));
}
