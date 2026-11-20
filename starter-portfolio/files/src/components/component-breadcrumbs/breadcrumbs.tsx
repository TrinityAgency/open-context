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

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
// min-w-0 and wrap-break-word: a crumb wider than the row shrinks and breaks instead of pushing the page sideways.
const LINK = `min-w-0 rounded-[var(--oc-radius,0.25rem)] text-[var(--oc-ink-body,oklch(37.1%_0_none))] no-underline underline-offset-4 wrap-break-word hover:text-[var(--oc-ink,oklch(20.5%_0_none))] hover:underline ${FOCUS}`;
const CRUMB = 'flex min-w-0 items-center';
// The overflow's panel is as wide as its longest word (at least 12rem), as in 1.0.0: its words never break.
const MENU_LINK = `block px-2 py-1 ${LINK}`;

function Separator() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="mx-1.5 h-4 w-4 shrink-0 text-[var(--oc-ink-faint,oklch(70.8%_0_none))]"
    >
      <path d="M6 3.5 10.5 8 6 12.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A breadcrumb trail. Server component; the overflow is a native details element, no JavaScript. Colours and corners
 * come from the design tokens.
 */
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
      <span aria-current="page" className="min-w-0 font-medium text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word">
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
            <li key={`head-${i}`} className={CRUMB}>
              {i > 0 && <Separator />}
              {crumb(item, i)}
            </li>
          ))}
          {hidden.length > 0 && (
            <li className={CRUMB}>
              <Separator />
              <details className="relative">
                <summary
                  aria-label={l.more}
                  className={`box-border flex h-6 cursor-pointer list-none items-center rounded-[var(--oc-radius,0.25rem)] px-1 text-[var(--oc-ink-body,oklch(37.1%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS} [&::-webkit-details-marker]:hidden`}
                >
                  …
                </summary>
                <ol className="absolute top-full left-0 z-10 m-0 mt-1 box-border min-w-48 list-none rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] p-2 shadow-md">
                  {hidden.map((item, i) => (
                    <li key={`hidden-${i}`}>
                      <Link href={item.href} className={MENU_LINK}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ol>
              </details>
            </li>
          )}
          {tail.map((item, i) => (
            <li key={`tail-${i}`} className={CRUMB}>
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
