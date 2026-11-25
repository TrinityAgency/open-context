// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
import type { ComponentType, ReactNode } from 'react';

export const VOCAB_VERSION = 1;

export type LinkItem = { href: string; label: string };
export type Cta = LinkItem & { variant: 'primary' | 'secondary' };
export type ImageRef = { src: string; alt: string; width: number; height: number };
export type LinkComponent = ComponentType<{
  href: string;
  className?: string;
  children?: ReactNode;
  'aria-current'?: 'page';
  'aria-label'?: string;
  rel?: string;
}>;
export type ImageComponent = ComponentType<{ src: string; alt: string; width: number; height: number; className?: string }>;
