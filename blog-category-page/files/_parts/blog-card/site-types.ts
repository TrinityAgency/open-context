// The website kit's shared vocabulary (version 1): the declarations this template uses, copied word for word.
import type { ComponentType, ReactNode } from 'react';

export const VOCAB_VERSION = 1;

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
export type Post = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  authorIds: string[];
  category: string;
  tags: string[];
  image?: ImageRef;
  draft: boolean;
  readingMinutes: number;
};
export type Author = { id: string; name: string; bio?: string; url?: string; image?: ImageRef };
export type Category = { id: string; name: string; description?: string };
