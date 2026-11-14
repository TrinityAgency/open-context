import type { PricingInterval } from './site-types';

export type PricingLabels = {
  /** The legend of the interval switch. */
  billing: string;
  /** Each interval's choice in the switch. */
  intervals: Record<PricingInterval, string>;
  /** What follows a price, by its plan's interval. */
  per: Record<PricingInterval, string>;
  /** The badge on a highlighted plan. */
  highlighted: string;
  /** Shown in place of a price of 0. */
  free: string;
};

export const PRICING_LABELS: PricingLabels = {
  billing: 'Billing',
  intervals: { month: 'Monthly', year: 'Yearly', once: 'One-time' },
  per: { month: 'per month', year: 'per year', once: 'one-time' },
  highlighted: 'Most popular',
  free: 'Free',
};
