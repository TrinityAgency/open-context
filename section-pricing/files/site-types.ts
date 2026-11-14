// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
import type { ComponentType, ReactNode } from 'react';

export const VOCAB_VERSION = 1;

export type LinkItem = { href: string; label: string };
export type Cta = LinkItem & { variant: 'primary' | 'secondary' };
export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  'aria-current'?: 'page';
  'aria-label'?: string;
  rel?: string;
}>;
export type PricingInterval = 'month' | 'year' | 'once';
export type PricingPlan = {
  id: string;
  name: string;
  description?: string;
  priceMinor: number;
  currency: string;
  interval: PricingInterval;
  features: string[];
  cta: Cta;
  highlighted?: boolean;
};
