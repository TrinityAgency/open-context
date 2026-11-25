import { CALL_LABELS, type CallLabels } from './labels';
import type { CallLink } from './site-types';
import { telHref } from './tel-href';

/** The call button's layouts, named as in the kit's layout vocabulary. */
export type CallLayout = 'card' | 'bar';

export type CallContent = {
  /** The ways to reach you, the first drawn as the primary one: a phone number, or a messenger's chat link. */
  links: CallLink[];
  /** A short line above the links, e.g. "Questions? Talk to us." (in the card; in the bar from md). */
  title?: string;
};

export type CallButtonProps = {
  content: CallContent;
  /**
   * `card` (the default): a floating card at the bottom corner, the links stacked. `bar`: on a phone a full-width bar
   * along the bottom edge, the links side by side; from `md` the card.
   */
  layout?: CallLayout;
  /** The fixed strings; pass `CALL_LABELS_DE` from `./labels.de` for German. */
  labels?: Partial<CallLabels>;
  id?: string;
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const FOCUS =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';

// One whole class string per layout for every element a layout changes. The panel is drawn twice: fixed (POSITION
// and LOOK) and, invisible, in the page's flow (LOOK only), so the page can scroll clear of it.
// Not drawn while a consent banner that marks itself (`data-consent-banner`, site-cookie-consent 2.1.0) is on the
// page, so the two never stand side by side; the spacer stays, so nothing moves when the banner goes. Only where
// scripts run: without JavaScript a banner the server rendered cannot be answered and never leaves, while these
// links work without it. z-30: under a banner that does not mark itself (z-40), which is then drawn over it where the
// two meet until the visitor chooses.
// While the panel is on the page, the root keeps room below whatever has keyboard focus (scroll-padding-bottom: 16rem
// beside the card, 10rem above the bar on a phone), so tabbing never scrolls a link or button under it.
const BANNER_UP = '[@media(scripting:enabled)]:[:root:has([data-consent-banner])_&]:hidden';
const POSITION: Record<CallLayout, string> = {
  card: `fixed bottom-4 end-4 z-30 [:root:has(&)]:scroll-pb-64 ${BANNER_UP}`,
  bar: `fixed start-0 end-0 bottom-0 z-30 md:start-auto md:end-4 md:bottom-4 [:root:has(&)]:scroll-pb-40 md:[:root:has(&)]:scroll-pb-64 ${BANNER_UP}`,
};
const LOOK: Record<CallLayout, string> = {
  card: 'box-border w-72 max-w-[calc(100vw-2rem)] rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] p-4 text-[var(--oc-ink,oklch(20.5%_0_none))] shadow-lg wrap-break-word',
  bar: 'box-border w-full border-0 border-t border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] px-4 py-3 text-[var(--oc-ink,oklch(20.5%_0_none))] shadow-lg wrap-break-word md:w-72 md:max-w-[calc(100vw-2rem)] md:rounded-[calc(var(--oc-radius,0.25rem)*2)] md:border md:p-4',
};
// The spacer's own room below the copy: the card's offset from the bottom edge. Its ground is the footer's
// (`surface-alt`, the ground site-footer draws), so the room reads as the end of the footer, not a band of the page.
const SPACER: Record<CallLayout, string> = {
  card: 'box-border bg-[var(--oc-surface-alt,oklch(98.5%_0_none))] pb-4',
  bar: 'box-border bg-[var(--oc-surface-alt,oklch(98.5%_0_none))] md:pb-4',
};
const TITLE: Record<CallLayout, string> = {
  card: `m-0 mb-3 text-sm font-semibold ${HEADING_FONT}`,
  bar: `m-0 mb-3 hidden text-sm font-semibold md:block ${HEADING_FONT}`,
};
const LIST: Record<CallLayout, string> = {
  card: 'm-0 grid list-none gap-2 p-0',
  bar: 'm-0 grid list-none grid-flow-col auto-cols-fr gap-2 p-0 md:grid-flow-row',
};
const LINK: Record<CallLayout, string> = {
  card: `box-border flex min-h-10 w-full items-center gap-2 rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid px-4 py-2 text-sm font-medium no-underline ${FOCUS}`,
  bar: `box-border flex min-h-10 w-full flex-col items-center justify-center gap-1 rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid px-2 py-2 text-center text-sm font-medium no-underline md:flex-row md:justify-start md:gap-2 md:px-4 md:text-start ${FOCUS}`,
};
const VARIANT = {
  primary:
    'border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] text-[var(--oc-on-brand,#fff)] hover:border-[var(--oc-brand-hover,oklch(37.1%_0_none))] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))]',
  secondary:
    'border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink,oklch(20.5%_0_none))] hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))]',
} as const;
const GLYPH = 'block size-5 shrink-0';

/** A glyph per kind of link (decoration: the link's label says what it is). No brand logos. */
function Glyph({ kind }: { kind: CallLink['kind'] }) {
  const common = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    className: GLYPH,
  };
  if (kind === 'phone') {
    return (
      <svg {...common} data-glyph="handset">
        <path d="M5 4h3.5l1.5 4.5-2 1.5a12 12 0 0 0 6 6l1.5-2 4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />
      </svg>
    );
  }
  if (kind === 'telegram') {
    return (
      <svg {...common} data-glyph="plane">
        <path d="M21 3L3 10.5l7 2.5 2.5 7L21 3z" />
        <path d="M10 13l4.5-4.5" />
      </svg>
    );
  }
  return (
    <svg {...common} data-glyph="bubble">
      <path d="M4 5h16v11H9l-5 4V5z" />
    </svg>
  );
}

function hrefOf(link: CallLink) {
  return link.kind === 'phone' ? telHref(link.number) : link.href;
}

/**
 * A floating contact card at the bottom corner of the page, or a bar along the bottom edge on a phone: an `aside`
 * named by `labels.region`, the optional title and one plain link per way to reach you (a `tel:` link, a messenger's
 * chat link), the first the primary one. Nothing is requested before a click. While a consent banner that marks itself
 * (`data-consent-banner`) is on the page it is not drawn (where scripts run; without JavaScript it always is); under
 * one that does not, it sits below (`z-30` below its
 * `z-40`: where they meet, the banner is on top). An invisible copy in the page's flow lets the page
 * scroll clear of it, so the last line of your footer is never under it, and the root keeps room below the element
 * that has keyboard focus. Renders nothing without links. Server component. Place it last in `<body>`,
 * after your footer. Colours, fonts and corner radius come from the design tokens.
 */
export function CallButton({ content, layout = 'card', labels, id, className }: CallButtonProps) {
  const l = { ...CALL_LABELS, ...labels };
  const { title, links } = content;
  if (!links.length) return null;

  // the panel's content; the copy in the spacer draws the same boxes with no links in it
  const body = (ghost: boolean) => (
    <>
      {title ? <p className={TITLE[layout]}>{title}</p> : null}
      <ul className={LIST[layout]}>
        {links.map((link, i) => {
          const variant = i === 0 ? 'primary' : 'secondary';
          const cls = `${LINK[layout]} ${VARIANT[variant]}`;
          const inner = (
            <>
              <Glyph kind={link.kind} />
              {/* max-w-full: in the bar's columns a label is no wider than its link, so a long word breaks */}
              <span className="min-w-0 max-w-full">{link.label}</span>
            </>
          );
          return (
            <li key={i} className="m-0 min-w-0 p-0">
              {ghost ? (
                <span className={cls}>{inner}</span>
              ) : (
                <a href={hrefOf(link)} rel={link.kind === 'phone' ? undefined : 'noopener noreferrer'} data-variant={variant} className={cls}>
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <>
      <div data-call-spacer aria-hidden="true" className={SPACER[layout]}>
        <div className={`${LOOK[layout]} invisible`}>{body(true)}</div>
      </div>
      <aside
        id={id}
        aria-label={l.region}
        data-layout={layout}
        className={className ? `${POSITION[layout]} ${LOOK[layout]} ${className}` : `${POSITION[layout]} ${LOOK[layout]}`}
      >
        {body(false)}
      </aside>
    </>
  );
}
