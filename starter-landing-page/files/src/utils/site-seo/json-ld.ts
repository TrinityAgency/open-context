import { absoluteUrl, compact } from './metadata';
import type { Author, ContactFacts, FaqItem, LinkItem, Post, SiteIdentity } from './site-types';

/** One schema.org object as these builders return it. */
export type JsonLdObject = { '@context': 'https://schema.org'; '@type': string; [key: string]: unknown };

const CONTEXT = 'https://schema.org' as const;

/** The site's own URL, normalised (and checked: TypeError unless absolute http(s)). */
const siteHref = (site: SiteIdentity) => absoluteUrl(site.url, site.url);

/** schema.org `Organization`: name, url, description, logo, email, telephone, postal address, sameAs. */
export function organizationJsonLd(site: SiteIdentity, opts: { contact?: ContactFacts; sameAs?: string[] } = {}): JsonLdObject {
  const address = opts.contact?.address;
  return compact({
    '@context': CONTEXT,
    '@type': 'Organization',
    name: site.name,
    url: siteHref(site),
    description: site.description,
    logo: site.logo ? absoluteUrl(site.logo.src, site.url) : undefined,
    email: opts.contact?.email,
    telephone: opts.contact?.phone,
    address: address
      ? {
          '@type': 'PostalAddress',
          streetAddress: address.street,
          postalCode: address.postalCode,
          addressLocality: address.city,
          addressCountry: address.country,
        }
      : undefined,
    sameAs: opts.sameAs && opts.sameAs.length > 0 ? opts.sameAs : undefined,
  });
}

/** schema.org `WebSite`: name, url, description. */
export function websiteJsonLd(site: SiteIdentity): JsonLdObject {
  return compact({ '@context': CONTEXT, '@type': 'WebSite', name: site.name, url: siteHref(site), description: site.description });
}

/**
 * schema.org `Article` for a post at `url` (a path or absolute URL): headline, description, datePublished,
 * dateModified (updatedAt, else publishedAt), url and mainEntityOfPage, image, the authors as `Person` in
 * `post.authorIds` order, the site as publisher. Throws `unknown author id: <id>` for an id not in `authors`.
 */
export function articleJsonLd(post: Post, opts: { url: string; site: SiteIdentity; authors: Author[] }): JsonLdObject {
  const { site } = opts;
  const url = absoluteUrl(opts.url, site.url);
  const byId = new Map(opts.authors.map((a) => [a.id, a]));
  return compact({
    '@context': CONTEXT,
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: post.image ? absoluteUrl(post.image.src, site.url) : undefined,
    author: post.authorIds.map((id) => {
      const author = byId.get(id);
      if (!author) throw new Error(`unknown author id: ${id}`);
      return compact({ '@type': 'Person', name: author.name, url: author.url ? absoluteUrl(author.url, site.url) : undefined });
    }),
    publisher: compact({
      '@type': 'Organization',
      name: site.name,
      url: siteHref(site),
      logo: site.logo
        ? { '@type': 'ImageObject', url: absoluteUrl(site.logo.src, site.url), width: site.logo.width, height: site.logo.height }
        : undefined,
    }),
  });
}

/** schema.org `BreadcrumbList`: positions from 1, every href made absolute against `siteUrl`. */
export function breadcrumbListJsonLd(items: LinkItem[], siteUrl: string): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href, siteUrl),
    })),
  };
}

/** schema.org `FAQPage`: each item a `Question` with an accepted `Answer`. */
export function faqPageJsonLd(items: FaqItem[]): JsonLdObject {
  return {
    '@context': CONTEXT,
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
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
