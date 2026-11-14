import type { Metadata } from 'next';
import type { ImageRef, SiteIdentity } from './site-types';

/** A copy without the keys whose value is undefined or an empty string. */
export function compact<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && v !== '')) as T;
}

function siteBase(siteUrl: string): URL {
  let url: URL;
  try {
    url = new URL(siteUrl);
  } catch {
    throw new TypeError(`siteUrl must be an absolute http(s) URL, got ${JSON.stringify(siteUrl)}`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError(`siteUrl must be an absolute http(s) URL, got ${JSON.stringify(siteUrl)}`);
  }
  return url;
}

/** `pathOrUrl` resolved against the site's URL; an absolute input stays as it is. TypeError unless siteUrl is http(s). */
export function absoluteUrl(pathOrUrl: string, siteUrl: string): string {
  return new URL(pathOrUrl, siteBase(siteUrl)).href;
}

/**
 * The canonical URL of a page: absolute, without query and hash, without a trailing slash except on the origin root.
 * An absolute input keeps its own origin. TypeError unless siteUrl is absolute http(s).
 */
export function canonicalUrl(path: string, siteUrl: string): string {
  const url = new URL(path, siteBase(siteUrl));
  url.search = '';
  url.hash = '';
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/, '');
  return url.href;
}

export type PageMetadataInput = {
  site: SiteIdentity;
  /** The page's path (or absolute URL); becomes the canonical URL. */
  path: string;
  title: string;
  /** Default: the site's description. */
  description?: string;
  /** The share image; its src is made absolute against the site's URL. */
  image?: ImageRef;
  type?: 'website' | 'article';
  /** Article only. ISO 8601. */
  publishedTime?: string;
  /** Article only. ISO 8601. */
  modifiedTime?: string;
  /** Article only: author names. */
  authors?: string[];
  /** Adds robots noindex, nofollow. */
  noIndex?: boolean;
  /** Open Graph locale, e.g. `de_DE`. */
  locale?: string;
};

/**
 * Next metadata for one page: title, description, canonical, Open Graph (website or article) and Twitter card
 * (`summary_large_image` with an image, else `summary`). Every URL is absolute; keys without a value are left out.
 */
export function pageMetadata(input: PageMetadataInput): Metadata {
  const { site, title } = input;
  const url = canonicalUrl(input.path, site.url);
  const description = input.description ?? site.description;
  const images = input.image
    ? [{ url: absoluteUrl(input.image.src, site.url), width: input.image.width, height: input.image.height, alt: input.image.alt }]
    : undefined;
  const base = { url, siteName: site.name, title, description, locale: input.locale, images };
  const openGraph =
    input.type === 'article'
      ? compact({
          type: 'article' as const,
          ...base,
          publishedTime: input.publishedTime,
          modifiedTime: input.modifiedTime,
          authors: input.authors,
        })
      : compact({ type: 'website' as const, ...base });
  const twitter = compact({
    card: images ? 'summary_large_image' : 'summary',
    title,
    description,
    images: images?.map((image) => image.url),
  });
  return compact({
    title,
    description,
    alternates: { canonical: url },
    openGraph,
    twitter,
    robots: input.noIndex ? { index: false, follow: false } : undefined,
  }) as Metadata;
}
