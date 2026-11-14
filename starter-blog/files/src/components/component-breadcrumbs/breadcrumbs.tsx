import type { ComponentProps } from 'react';
import { breadcrumbListJsonLd, jsonLdHtml } from './breadcrumb-json-ld';
import { collapseTrail } from './collapse-trail';
import { BREADCRUMBS_LABELS, type BreadcrumbsLabels } from './labels';
import type { LinkComponent, LinkItem } from './site-types';

export type BreadcrumbsProps = {
  /** The trail from the home page to the current page; the last item is the current page. */
  items: LinkItem[];
  /** Longer trails show the first item, a "…" overflow and the last maxVisible − 1 items. Default 4. */
  maxVisible?: number;
  /** The site's absolute URL. When given, a BreadcrumbList JSON-LD script is rendered beside the trail. */
  baseUrl?: string;
  labels?: Partial<BreadcrumbsLabels>;
  /** Renders every link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const LINK =
  'rounded-sm text-neutral-700 no-underline underline-offset-4 hover:text-neutral-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

function Separator() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="mx-1.5 h-4 w-4 shrink-0 text-neutral-400"
    >
      <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A breadcrumb trail. Server component; the overflow is a native details element, no JavaScript. */
export function Breadcrumbs({
  items,
  maxVisible = 4,
  baseUrl,
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: BreadcrumbsProps) {
  if (items.length === 0) return null;
  const l = { ...BREADCRUMBS_LABELS, ...labels };
  const { head, hidden, tail } = collapseTrail(items, maxVisible);
  const lastIndex = items.length - 1;
  const tailStart = items.length - tail.length;

  const crumb = (item: LinkItem, index: number) =>
    index === lastIndex ? (
      <span aria-current="page" className="font-medium text-neutral-900">
        {item.label}
      </span>
    ) : (
      <Link href={item.href} className={LINK}>
        {item.label}
      </Link>
    );

  return (
    <>
      <nav aria-label={l.nav} className={className}>
        <ol className="m-0 flex list-none flex-wrap items-center p-0 text-sm">
          {head.map((item, i) => (
            <li key={`head-${i}`} className="flex items-center">
              {i > 0 && <Separator />}
              {crumb(item, i)}
            </li>
          ))}
          {hidden.length > 0 && (
            <li className="flex items-center">
              <Separator />
              <details className="relative">
                <summary
                  aria-label={l.more}
                  className="box-border flex h-6 cursor-pointer list-none items-center rounded-sm px-1 text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 [&::-webkit-details-marker]:hidden"
                >
                  …
                </summary>
                <ol className="absolute top-full left-0 z-10 m-0 mt-1 box-border min-w-48 list-none rounded-md border border-solid border-neutral-200 bg-white p-2 shadow-md">
                  {hidden.map((item, i) => (
                    <li key={`hidden-${i}`}>
                      <Link href={item.href} className={`block px-2 py-1 ${LINK}`}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          )}
          {tail.map((item, i) => (
            <li key={`tail-${i}`} className="flex items-center">
              <Separator />
              {crumb(item, tailStart + i)}
            </li>
          ))}
        </ol>
      </nav>
      {baseUrl ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdHtml(breadcrumbListJsonLd(items, baseUrl)) }}
        />
      ) : null}
    </>
  );
}
