import type { ComponentProps } from 'react';
import { DismissButton, Dismissible } from './dismissible';
import { ANNOUNCEMENT_LABELS, type AnnouncementLabels } from './labels';
import type { LinkComponent, LinkItem } from './site-types';

/** The bar's layouts, named as in the kit's layout vocabulary. */
export type AnnouncementLayout = 'bar' | 'band';

export type AnnouncementContent = {
  /** The notice, one sentence. */
  text: string;
  /** An optional link after the text, e.g. to the page the notice is about. */
  link?: LinkItem;
};

export type AnnouncementBarProps = {
  content: AnnouncementContent;
  /** `bar` (the default): a quiet bar in the sunk ground. `band`: a band on the brand colour, everything in on-brand. */
  layout?: AnnouncementLayout;
  /** A dismiss button that hides the bar until the page is loaded again (nothing is stored). Default: `true`. */
  dismissible?: boolean;
  /** The fixed strings; pass `ANNOUNCEMENT_LABELS_DE` from `./labels.de` for German. */
  labels?: Partial<AnnouncementLabels>;
  /** Draws the link, e.g. `next/link`'s `Link`. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const ON_BRAND = 'text-[var(--oc-on-brand,#fff)]';
const FOCUS_RING = 'focus-visible:outline-2 focus-visible:outline-offset-2';
const FOCUS = `${FOCUS_RING} focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]`;
// On the brand band the focus colour may be the brand itself, so the rings are drawn in on-brand.
const FOCUS_ON_BRAND = `${FOCUS_RING} focus-visible:outline-[var(--oc-on-brand,#fff)]`;

// One whole class string per layout for every element a layout changes.
const ROOT: Record<AnnouncementLayout, string> = {
  bar: `box-border bg-[var(--oc-surface-sunk,oklch(97%_0_none))] px-6 py-2.5 text-sm ${INK}`,
  band: `box-border bg-[var(--oc-brand,oklch(20.5%_0_none))] px-6 py-2.5 text-sm ${ON_BRAND}`,
};
const LINK: Record<AnnouncementLayout, string> = {
  bar: `rounded-[var(--oc-radius,0.25rem)] font-medium ${INK} underline underline-offset-2 hover:decoration-2 ${FOCUS}`,
  band: `rounded-[var(--oc-radius,0.25rem)] font-medium ${ON_BRAND} underline underline-offset-2 hover:decoration-2 ${FOCUS_ON_BRAND}`,
};
const BUTTON_BASE =
  'm-0 box-border inline-flex size-8 shrink-0 cursor-pointer appearance-none items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border-0 bg-transparent p-0';
const BUTTON: Record<AnnouncementLayout, string> = {
  bar: `${BUTTON_BASE} ${INK} hover:bg-[var(--oc-line,oklch(92.2%_0_none))] ${FOCUS}`,
  band: `${BUTTON_BASE} ${ON_BRAND} hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS_ON_BRAND}`,
};
// With a dismiss button the text sits in the middle column and an empty column of the button's width balances it,
// so the text stays centred on the bar.
const ROW_DISMISSIBLE = 'mx-auto grid max-w-5xl grid-cols-[2rem_minmax(0,1fr)_2rem] items-center gap-3 wrap-break-word';
const ROW = 'mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)] items-center wrap-break-word';
const TEXT_DISMISSIBLE = 'col-start-2 m-0 min-w-0 text-center';
const TEXT = 'm-0 min-w-0 text-center';

/**
 * A one-line notice across the top of the page: a `section` named by `labels.region`, the text and an optional link
 * centred in one row, and a dismiss button at the row's end that hides the bar until the page is loaded again
 * (nothing is stored). Server component;
 * the dismiss state and button are the one client island (`dismissible.tsx`), and the button shows only once the page
 * is hydrated. Place it right after your header, so the header's skip link stays the first stop. Colours, fonts and
 * corner radius come from the design tokens.
 */
export function AnnouncementBar({
  content,
  layout = 'bar',
  dismissible = true,
  labels,
  LinkComponent: Link = PlainLink,
  id,
  className,
}: AnnouncementBarProps) {
  const l = { ...ANNOUNCEMENT_LABELS, ...labels };
  const { text, link } = content;
  const bar = (
    <section id={id} aria-label={l.region} data-layout={layout} className={className ? `${ROOT[layout]} ${className}` : ROOT[layout]}>
      <div className={dismissible ? ROW_DISMISSIBLE : ROW}>
        <p className={dismissible ? TEXT_DISMISSIBLE : TEXT}>
          {text}
          {link ? (
            <>
              {' '}
              <Link href={link.href} className={LINK[layout]}>
                {link.label}
              </Link>
            </>
          ) : null}
        </p>
        {dismissible ? <DismissButton label={l.dismiss} className={BUTTON[layout]} /> : null}
      </div>
    </section>
  );
  return dismissible ? <Dismissible>{bar}</Dismissible> : bar;
}
