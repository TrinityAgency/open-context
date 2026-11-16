'use client';

import type { ReactNode } from 'react';
import { useConsent } from './consent-provider';

/**
 * Renders `children` only once the choice is known and `category` is granted; until then `fallback` (default:
 * nothing). Put anything that loads from another host (maps, videos, analytics, fonts) inside one.
 */
export function ConsentGate({ category, children, fallback = null }: { category: string; children: ReactNode; fallback?: ReactNode }) {
  const consent = useConsent();
  return <>{consent.ready && consent.isGranted(category) ? children : fallback}</>;
}
