// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
import type { ComponentType } from 'react';

export const VOCAB_VERSION = 1;

export type ImageRef = { src: string; alt: string; width: number; height: number };
export type ImageComponent = ComponentType<{ src: string; alt: string; width: number; height: number; className?: string }>;
export type Feature = { title: string; description: string; icon?: string; image?: ImageRef };
