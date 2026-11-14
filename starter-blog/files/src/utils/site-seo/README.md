# Site SEO

Helpers for what search engines and link previews read: `pageMetadata` builds a page's Next metadata (title,
description, canonical URL, Open Graph, Twitter card), and five builders write schema.org JSON-LD (Organization,
WebSite, Article, BreadcrumbList, FAQPage) that `JsonLd` renders safely. Plain functions and one server component.

## Usage

### Page metadata

```ts
// app/services/page.tsx
import { pageMetadata } from '@/src/utils/site-seo';
import { SITE } from '@/site'; // your SiteIdentity: { name, url, description, logo? }

export const metadata = pageMetadata({
  site: SITE,
  path: '/services',
  title: 'Services',
  description: 'What we do.',
  image: { src: '/og/services.png', alt: 'Our services', width: 1200, height: 630 },
  locale: 'en_US',
});
```

The result has `title`, `description` (default: the site's), `alternates.canonical`, `openGraph` (`website` by
default; `type: 'article'` adds `publishedTime`, `modifiedTime`, `authors`) and `twitter` (`summary_large_image` when
there is an image, else `summary`). `noIndex: true` adds `robots: { index: false, follow: false }`. Every URL is
absolute, and a key without a value (undefined or empty) is left out.

### JSON-LD

```tsx
import { JsonLd, faqPageJsonLd, organizationJsonLd, websiteJsonLd } from '@/src/utils/site-seo';

<JsonLd data={[organizationJsonLd(SITE, { contact, sameAs: ['https://social.example/@us'] }), websiteJsonLd(SITE)]} />
<JsonLd data={faqPageJsonLd(faqItems)} />
```

| Builder | |
|---|---|
| `organizationJsonLd(site, { contact?, sameAs? })` | name, url, description, logo, email, telephone, `PostalAddress`, sameAs |
| `websiteJsonLd(site)` | name, url, description |
| `articleJsonLd(post, { url, site, authors })` | headline, description, datePublished, dateModified (`updatedAt`, else `publishedAt`), url and mainEntityOfPage, image, each author as a `Person` in `post.authorIds` order, the site as publisher with its logo as `ImageObject`; an id missing from `authors` throws `unknown author id: <id>` |
| `breadcrumbListJsonLd(items, siteUrl)` | positions from 1, absolute item URLs |
| `faqPageJsonLd(items)` | each `{ question, answer }` as a `Question` with an accepted `Answer` |

Every object carries `@context: 'https://schema.org'`. Show the same content on the page that the data describes
(the FAQ's questions and answers, the article's title and authors): search engines compare them.

`JsonLd` renders one `<script type="application/ld+json">`; a list becomes a JSON array. Its body comes from
`jsonLdHtml(data)`, which writes `<`, `>` and `&` as `\u003c`, `\u003e` and `\u0026`, so a title such as
`</script>` cannot end the element or open a comment; the JSON still parses to the same object.

### URLs

```ts
import { absoluteUrl, canonicalUrl } from '@/src/utils/site-seo';

canonicalUrl('/blog/?page=2#top', 'https://example.com'); // https://example.com/blog
canonicalUrl('/', 'https://example.com');                 // https://example.com/
absoluteUrl('/og.png', 'https://example.com');            // https://example.com/og.png
```

`canonicalUrl` drops the query, the hash and a trailing slash (except on the origin root); an absolute input keeps
its own origin. Both throw a `TypeError` unless the site URL is absolute http(s).

## Props

`JsonLd`: `data` (`object | object[]`). For the functions, see above; the types (`SiteIdentity`, `ContactFacts`,
`PostalAddress`, `Post`, `Author`, `FaqItem`, `LinkItem`, `ImageRef`) are in `site-types.ts`.

## Labels

None: nothing here is shown on the page.

## Keyboard and screen readers

Nothing visible; the tags live in the page's `head` and in script elements.

## Client islands

None. `metadata.ts` imports only Next's `Metadata` type.

## Notes

- Uses the kit's `SiteIdentity`, `Post` and `Author` shapes, so data from the other website-kit templates fits as is.
- Next's `metadataBase` is not needed: every URL is made absolute from `site.url`.
