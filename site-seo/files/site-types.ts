// The website kit's shared vocabulary: only the declarations this template uses, copied word for word.
export const VOCAB_VERSION = 1;

export type LinkItem = { href: string; label: string };
export type ImageRef = { src: string; alt: string; width: number; height: number };
export type SiteIdentity = { name: string; url: string; description: string; logo?: ImageRef };
export type PostalAddress = { street: string; postalCode: string; city: string; country: string };
export type ContactFacts = { email?: string; phone?: string; address?: PostalAddress };
export type FaqItem = { question: string; answer: string };
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
