import type { ComponentProps } from 'react';
import { PAGINATION_LABELS, type PaginationLabels } from './labels';
import { clampPage, pageWindow } from './page-window';
import type { LinkComponent } from './site-types';

export type PaginationProps = {
  /** The current page, 1-based. NaN reads as 1, a fraction is rounded down, then it is clamped into 1…pageCount. */
  page: number;
  pageCount: number;
  /** Builds the href of a page, e.g. (n) => `/blog?page=${n}`. */
  hrefFor: (page: number) => string;
  siblings?: number;
  boundaries?: number;
  labels?: Partial<PaginationLabels>;
  /** Renders every link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is. The current page is the brand mark.
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
// A long label wraps (and a word wider than the row breaks); one line keeps the 40 px box.
const ITEM =
  'box-border inline-flex min-h-10 min-w-10 max-w-full items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid px-3 py-2 text-center text-sm leading-none no-underline wrap-anywhere';
const LINK = `${ITEM} border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink,oklch(20.5%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS} motion-safe:transition-colors`;
const CURRENT = `${ITEM} border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] font-semibold text-[var(--oc-on-brand,#fff)] ${FOCUS}`;
const DISABLED = `${ITEM} border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink-subtle,oklch(55.6%_0_none))]`;
const GAP = 'box-border inline-flex h-10 min-w-6 items-center justify-center text-sm text-[var(--oc-ink-subtle,oklch(55.6%_0_none))]';
// Every item may shrink to the row, so a long previous or next label stays on the page.
const ITEM_LI = 'min-w-0 max-w-full';

/**
 * Page links for a paged list: previous, a window of pages with gaps, next. Renders nothing for one page. Colours and
 * corners come from the design tokens.
 */
export function Pagination({
  page,
  pageCount,
  hrefFor,
  siblings,
  boundaries,
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: PaginationProps) {
  if (pageCount <= 1) return null;
  const l = { ...PAGINATION_LABELS, ...labels };
  // A page from the URL may be junk: NaN reads as 1, a fraction is rounded down, then it is clamped into range.
  const current = clampPage(Number.isNaN(page) ? 1 : Math.trunc(page), pageCount);
  const items = pageWindow(current, pageCount, { siblings, boundaries });

  return (
    <nav aria-label={l.nav} className={className}>
      <ul className="m-0 flex list-none flex-wrap items-center gap-1 p-0">
        <li className={ITEM_LI}>
          {current > 1 ? (
            <Link href={hrefFor(current - 1)} rel="prev" className={LINK}>
              {l.previous}
            </Link>
          ) : (
            <span aria-disabled="true" className={DISABLED}>
              {l.previous}
            </span>
          )}
        </li>
        {items.map((item, i) => {
          if (item === 'gap') {
            return (
              <li key={`gap-${i}`} aria-hidden="true" className={GAP}>
                {l.gap}
              </li>
            );
          }
          const isCurrent = item === current;
          return (
            <li key={item} className={ITEM_LI}>
              <Link
                href={hrefFor(item)}
                aria-current={isCurrent ? 'page' : undefined}
                aria-label={l.page(item)}
                className={isCurrent ? CURRENT : LINK}
              >
                {item}
              </Link>
            </li>
          );
        })}
        <li className={ITEM_LI}>
          {current < pageCount ? (
            <Link href={hrefFor(current + 1)} rel="next" className={LINK}>
              {l.next}
            </Link>
          ) : (
            <span aria-disabled="true" className={DISABLED}>
              {l.next}
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
