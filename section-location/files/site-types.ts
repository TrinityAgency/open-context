// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
import type { ComponentType, ReactNode } from 'react';

export const VOCAB_VERSION = 1;

export type PostalAddress = { street: string; postalCode: string; city: string; country: string };
export type ContactFacts = { email?: string; phone?: string; address?: PostalAddress };
export type GateComponent = ComponentType<{ category: string; children: ReactNode; fallback?: ReactNode }>;
export type HoursRow = { days: string; hours: string };
export type MapRef = { title: string; href: string; embedSrc?: string };
