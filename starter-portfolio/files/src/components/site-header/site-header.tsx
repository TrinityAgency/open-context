import { useId, type ComponentProps } from 'react';
import { CloseOnNavigate } from './close-on-navigate';
import { isCurrent } from './is-current';
import { SITE_HEADER_LABELS, type SiteHeaderLabels } from './labels';
import type { Cta, ImageComponent, LinkComponent, LinkItem, NavItem, SiteIdentity } from './site-types';

/** The header's layouts, named as in the kit's layout vocabulary. */
export type SiteHeaderLayout = 'bar' | 'centered' | 'minimal';

export type SiteHeaderProps = {
  /** The brand: the logo when given (through ImageComponent), else the name as text. */
  identity: Pick<SiteIdentity, 'name' | 'logo'>;
  /** Where the brand links to. Default `/`. */
  homeHref?: string;
  /** Top-level items; an item with children becomes a sub-menu (its own href is not rendered). */
  nav: NavItem[];
  /** The current pathname, e.g. from `usePathname()` in a client parent or the route's params on the server. */
  currentPath: string;
  /** One call to action beside the navigation. */
  cta?: Cta;
  /** The id of the page's `main` element, the skip link's target. Default `main`. */
  mainId?: string;
  /**
   * `bar` (the default): brand, navigation and call to action in one row from `md`, a menu button and drawer below.
   * `centered`: the brand centred above a centred navigation row from `md`. `minimal`: the brand and a menu button at
   * every width; every link lives in the drawer.
   */
  layout?: SiteHeaderLayout;
  labels?: Partial<SiteHeaderLabels>;
  /** Renders every link but the skip link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the logo; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const SURFACE = 'bg-[var(--oc-surface,#fff)]';
const RADIUS = 'rounded-[calc(var(--oc-radius,0.25rem)*1.5)]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
// Under the pointer a link takes the sunk tint and ink ([ink, surface-sunk] is a contract pair).
const HOVER = 'hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] hover:text-[var(--oc-ink,oklch(20.5%_0_none))]';
const CURRENT = 'aria-[current=page]:text-[var(--oc-ink,oklch(20.5%_0_none))]';
// A word wider than its row breaks instead of pushing the page sideways.
const NAV_LINK = `block ${RADIUS} px-3 py-2 text-sm font-medium text-[var(--oc-ink-body,oklch(37.1%_0_none))] no-underline underline-offset-8 wrap-break-word ${HOVER} ${CURRENT} aria-[current=page]:underline ${FOCUS}`;
const SUMMARY = `flex cursor-pointer list-none items-center gap-1 ${RADIUS} px-3 py-2 text-sm font-medium text-[var(--oc-ink-body,oklch(37.1%_0_none))] underline-offset-8 wrap-anywhere ${HOVER} data-[current]:text-[var(--oc-ink,oklch(20.5%_0_none))] data-[current]:underline ${FOCUS} [&::-webkit-details-marker]:hidden`;
const SUB_LINK = `block ${RADIUS} px-3 py-2 text-sm text-[var(--oc-ink-body,oklch(37.1%_0_none))] no-underline wrap-break-word ${HOVER} aria-[current=page]:font-semibold ${CURRENT} ${FOCUS}`;
const DRAWER_LINK = `block ${RADIUS} px-3 py-2 text-base text-[var(--oc-ink-soft,oklch(26.9%_0_none))] no-underline wrap-break-word ${HOVER} aria-[current=page]:font-semibold ${CURRENT} aria-[current=page]:underline underline-offset-4 ${FOCUS}`;
const BUTTON = `m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center gap-2 ${RADIUS} border border-solid border-[var(--oc-line-strong,oklch(87%_0_none))] ${SURFACE} px-3 py-0 font-[family-name:var(--oc-font-body)] text-sm font-medium ${INK} hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`;
// A long call to action wraps (in the drawer) instead of leaving it; one line keeps the 40 px box.
const CTA_BASE = `box-border inline-flex min-h-10 max-w-full items-center justify-center ${RADIUS} border border-solid px-4 py-2 text-center text-sm font-medium no-underline`;
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `${CTA_BASE} border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] text-[var(--oc-on-brand,#fff)] hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] ${FOCUS}`,
  secondary: `${CTA_BASE} border-[var(--oc-line-strong,oklch(87%_0_none))] ${SURFACE} ${INK} hover:bg-[var(--oc-surface-sunk,oklch(97%_0_none))] ${FOCUS}`,
};
// The brand: the name in the heading font may wrap (and a word wider than the row breaks); a logo never shrinks.
// A sub-menu's panel opens below its item; in the second half of the navigation it is aligned to the item's end, so a
// menu near the row's right edge stays on the page.
const PANEL_BASE = `absolute top-[calc(100%+0.25rem)] z-20 m-0 box-border min-w-56 list-none ${RADIUS} border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] ${SURFACE} p-2 shadow-lg`;
const PANEL = { start: `${PANEL_BASE} left-0`, end: `${PANEL_BASE} right-0` } as const;
const BRAND_NAME = `flex min-w-0 items-center ${RADIUS} text-lg font-semibold ${INK} no-underline wrap-anywhere font-[family-name:var(--oc-font-heading)] ${FOCUS}`;
const BRAND_LOGO = `flex shrink-0 items-center ${RADIUS} text-lg font-semibold ${INK} no-underline ${FOCUS}`;

// One whole class string per layout for every element a layout changes.
const ROW: Record<SiteHeaderLayout, string> = {
  bar: 'mx-auto box-border flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-3',
  centered: 'mx-auto box-border flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-3 md:flex-col md:justify-center md:gap-2',
  minimal: 'mx-auto box-border flex min-h-16 max-w-6xl items-center justify-between gap-4 px-4 py-3',
};
const NAV_LIST: Record<SiteHeaderLayout, string> = {
  bar: 'm-0 flex list-none flex-wrap items-center gap-1 p-0',
  centered: 'm-0 flex list-none flex-wrap items-center justify-center gap-1 p-0',
  minimal: 'm-0 flex list-none flex-wrap items-center gap-1 p-0',
};
const MENU_BUTTON: Record<SiteHeaderLayout, string> = {
  bar: `${BUTTON} md:hidden`,
  centered: `${BUTTON} md:hidden`,
  minimal: BUTTON,
};
const DRAWER_BASE = `fixed inset-y-0 right-0 left-auto z-50 m-0 box-border h-full max-h-none w-80 max-w-full overflow-y-auto border-0 ${SURFACE} p-0 ${INK} shadow-xl backdrop:bg-[var(--oc-scrim,oklch(20.5%_0_none))]/40`;
const DRAWER: Record<SiteHeaderLayout, string> = {
  bar: `${DRAWER_BASE} md:hidden`,
  centered: `${DRAWER_BASE} md:hidden`,
  minimal: DRAWER_BASE,
};

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="block h-4 w-4 shrink-0 text-[var(--oc-ink-subtle,oklch(55.6%_0_none))] group-open:rotate-180 motion-safe:transition-transform"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const current = (item: LinkItem, path: string) => (isCurrent(item.href, path) ? ('page' as const) : undefined);
const parentCurrent = (item: NavItem, path: string) =>
  isCurrent(item.href, path) || (item.children ?? []).some((child) => isCurrent(child.href, path));

/**
 * The site's header: skip link, brand, navigation and one call to action, in one of three layouts (`layout`). Server
 * component. On wide screens the navigation is a row whose sub-menus are native `details` (`minimal` has none); on
 * narrow screens, and at every width in `minimal`, a menu button opens a native popover drawer with every link. One
 * small client island (CloseOnNavigate) closes menus on link clicks, Escape and outside clicks. Colours, fonts and
 * corner radius come from the design tokens.
 */
export function SiteHeader({
  identity,
  homeHref = '/',
  nav,
  currentPath,
  cta,
  mainId = 'main',
  layout = 'bar',
  labels,
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  className,
}: SiteHeaderProps) {
  const l = { ...SITE_HEADER_LABELS, ...labels };
  const id = useId();
  const drawerId = `${id}-drawer`;
  const menuName = `${id}-menu`;
  const ctaLink = cta ? (
    <Link href={cta.href} data-variant={cta.variant} className={CTA_CLASS[cta.variant]}>
      {cta.label}
    </Link>
  ) : null;

  const inlineNav =
    layout === 'minimal' ? null : (
      <nav aria-label={l.nav} className="hidden min-w-0 md:block">
        <ul className={NAV_LIST[layout]}>
          {nav.map((item, i) =>
            item.children && item.children.length > 0 ? (
              <li key={i} className="min-w-0">
                <details name={menuName} className="group relative">
                  <summary data-current={parentCurrent(item, currentPath) ? '' : undefined} className={SUMMARY}>
                    {item.label}
                    <Chevron />
                  </summary>
                  <ul data-align={i >= nav.length / 2 ? 'end' : 'start'} className={i >= nav.length / 2 ? PANEL.end : PANEL.start}>
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <Link href={child.href} aria-current={current(child, currentPath)} className={SUB_LINK}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            ) : (
              <li key={i} className="min-w-0">
                <Link href={item.href} aria-current={current(item, currentPath)} className={NAV_LINK}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
      </nav>
    );

  const actions = (
    <div className="flex shrink-0 items-center gap-2">
      {ctaLink ? <div className="hidden md:flex">{ctaLink}</div> : null}
      <button type="button" popoverTarget={drawerId} className={MENU_BUTTON[layout]}>
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="block h-4 w-4 shrink-0">
          <path d="M2.5 4h11M2.5 8h11M2.5 12h11" strokeLinecap="round" />
        </svg>
        {l.menu}
      </button>
    </div>
  );

  return (
    <header
      data-layout={layout}
      className={`relative border-b border-[var(--oc-line,oklch(92.2%_0_none))] ${SURFACE} ${INK}${className ? ` ${className}` : ''}`}
    >
      <a
        href={`#${mainId}`}
        className={`sr-only focus:top-2 focus:left-4 focus:z-50 focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-[calc(var(--oc-radius,0.25rem)*1.5)] focus:bg-[var(--oc-surface,#fff)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:whitespace-nowrap focus:text-[var(--oc-ink,oklch(20.5%_0_none))] focus:shadow-md focus:[clip-path:none] ${FOCUS}`}
      >
        {l.skip}
      </a>
      <div className={ROW[layout]}>
        <Link href={homeHref} className={identity.logo ? BRAND_LOGO : BRAND_NAME}>
          {identity.logo ? (
            <Image
              src={identity.logo.src}
              alt={identity.logo.alt || identity.name}
              width={identity.logo.width}
              height={identity.logo.height}
              className="block h-8 w-auto max-w-full"
            />
          ) : (
            identity.name
          )}
        </Link>

        {layout === 'centered' ? (
          // From md the brand sits on a line of its own; the navigation and the call to action are centred below it.
          // Below md this holds only the menu button, which never shrinks (the brand wraps instead), as in bar.
          <div className="flex shrink-0 items-center gap-4 md:max-w-full md:flex-wrap md:justify-center">
            {inlineNav}
            {actions}
          </div>
        ) : (
          <>
            {inlineNav}
            {actions}
          </>
        )}
      </div>

      <div id={drawerId} popover="auto" className={DRAWER[layout]}>
        <div className="box-border flex h-16 items-center justify-end px-4">
          <button
            type="button"
            popoverTarget={drawerId}
            popoverTargetAction="hide"
            aria-label={l.close}
            className={`${BUTTON} w-10 px-0`}
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="block h-4 w-4 shrink-0">
              <path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <nav aria-label={l.nav} className="box-border px-4 pb-6">
          <ul className="m-0 list-none p-0">
            {nav.map((item, i) =>
              item.children && item.children.length > 0 ? (
                <li key={i} className="mt-2">
                  <span
                    data-current={parentCurrent(item, currentPath) ? '' : undefined}
                    className="block px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-[var(--oc-ink-subtle,oklch(55.6%_0_none))] uppercase wrap-break-word data-[current]:text-[var(--oc-ink,oklch(20.5%_0_none))]"
                  >
                    {item.label}
                  </span>
                  <ul className="m-0 list-none p-0">
                    {item.children.map((child, j) => (
                      <li key={j}>
                        <Link href={child.href} aria-current={current(child, currentPath)} className={DRAWER_LINK}>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ) : (
                <li key={i}>
                  <Link href={item.href} aria-current={current(item, currentPath)} className={DRAWER_LINK}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          {ctaLink ? <div className="mt-6 flex">{ctaLink}</div> : null}
        </nav>
      </div>
      <CloseOnNavigate drawerId={drawerId} />
    </header>
  );
}
