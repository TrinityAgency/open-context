import type { LinkItem } from './site-types';

export type BreadcrumbListJsonLd = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{ '@type': 'ListItem'; position: number; name: string; item: string }>;
};

function httpBase(baseUrl: string): URL {
  const url = new URL(baseUrl); // a relative URL throws a TypeError here
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError(`baseUrl must be an absolute http(s) URL, got ${baseUrl}`);
  }
  return url;
}

/** schema.org BreadcrumbList data for a trail: positions from 1, every href made absolute against `baseUrl`. */
export function breadcrumbListJsonLd(items: LinkItem[], baseUrl: string): BreadcrumbListJsonLd {
  const base = httpBase(baseUrl);
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: new URL(item.href, base).href,
    })),
  };
}

/**
 * JSON for the body of a `<script type="application/ld+json">`. `<`, `>` and `&` are written as \u003c, \u003e and
 * \u0026, so no value can end the script element or open a comment; JSON.parse reads the same object back.
 */
export function jsonLdHtml(data: unknown): string {
  return (JSON.stringify(data) ?? 'null').replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');
}
