import { useId, type ComponentProps } from 'react';
import { CloseOnNavigate } from './close-on-navigate';
import { isCurrent } from './is-current';
import { SITE_HEADER_LABELS, type SiteHeaderLabels } from './labels';
import type { Cta, ImageComponent, LinkComponent, LinkItem, NavItem, SiteIdentity } from './site-types';

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

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const NAV_LINK = `block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 no-underline underline-offset-8 hover:bg-neutral-100 hover:text-neutral-900 aria-[current=page]:text-neutral-900 aria-[current=page]:underline ${FOCUS}`;
const SUMMARY = `flex cursor-pointer list-none items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 underline-offset-8 hover:bg-neutral-100 hover:text-neutral-900 data-[current]:text-neutral-900 data-[current]:underline ${FOCUS} [&::-webkit-details-marker]:hidden`;
const SUB_LINK = `block rounded-md px-3 py-2 text-sm text-neutral-700 no-underline hover:bg-neutral-100 hover:text-neutral-900 aria-[current=page]:font-semibold aria-[current=page]:text-neutral-900 ${FOCUS}`;
const DRAWER_LINK = `block rounded-md px-3 py-2 text-base text-neutral-800 no-underline hover:bg-neutral-100 aria-[current=page]:font-semibold aria-[current=page]:text-neutral-900 aria-[current=page]:underline underline-offset-4 ${FOCUS}`;
const BUTTON = `m-0 box-border inline-flex h-10 cursor-pointer appearance-none items-center justify-center gap-2 rounded-md border border-solid border-neutral-300 bg-white px-3 py-0 font-sans text-sm font-medium text-neutral-900 hover:bg-neutral-100 ${FOCUS}`;
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `box-border inline-flex h-10 items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 text-sm font-medium whitespace-nowrap text-white no-underline hover:bg-neutral-700 ${FOCUS}`,
  secondary: `box-border inline-flex h-10 items-center justify-center rounded-md border border-solid border-neutral-300 bg-white px-4 text-sm font-medium whitespace-nowrap text-neutral-900 no-underline hover:bg-neutral-100 ${FOCUS}`,
};

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="block h-4 w-4 shrink-0 text-neutral-500 group-open:rotate-180 motion-safe:transition-transform"
    >
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const current = (item: LinkItem, path: string) => (isCurrent(item.href, path) ? ('page' as const) : undefined);
const parentCurrent = (item: NavItem, path: string) =>
  isCurrent(item.href, path) || (item.children ?? []).some((child) => isCurrent(child.href, path));

/**
 * The site's header: skip link, brand, navigation and one call to action. Server component. On wide screens the
 * navigation is a row whose sub-menus are native `details`; on narrow screens a menu button opens a native popover
 * drawer with every link. One small client island (CloseOnNavigate) closes menus on link clicks, Escape and outside
 * clicks.
 */
export function SiteHeader({
  identity,
  homeHref = '/',
  nav,
  currentPath,
  cta,
  mainId = 'main',
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

  return (
    <header className={`relative border-b border-neutral-200 bg-white text-neutral-900${className ? ` ${className}` : ''}`}>
      <a
        href={`#${mainId}`}
        className={`sr-only focus:top-2 focus:left-4 focus:z-50 focus:m-0 focus:h-auto focus:w-auto focus:overflow-visible focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:whitespace-nowrap focus:text-neutral-900 focus:shadow-md focus:[clip-path:none] ${FOCUS}`}
      >
        {l.skip}
      </a>
      <div className="mx-auto box-border flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          href={homeHref}
          className={`flex shrink-0 items-center rounded-md text-lg font-semibold text-neutral-900 no-underline ${FOCUS}`}
        >
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

        <nav aria-label={l.nav} className="hidden md:block">
          <ul className="m-0 flex list-none items-center gap-1 p-0">
            {nav.map((item, i) =>
              item.children && item.children.length > 0 ? (
                <li key={i}>
                  <details name={menuName} className="group relative">
                    <summary data-current={parentCurrent(item, currentPath) ? '' : undefined} className={SUMMARY}>
                      {item.label}
                      <Chevron />
                    </summary>
                    <ul className="absolute top-[calc(100%+0.25rem)] left-0 z-20 m-0 box-border min-w-56 list-none rounded-md border border-solid border-neutral-200 bg-white p-2 shadow-lg">
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
                <li key={i}>
                  <Link href={item.href} aria-current={current(item, currentPath)} className={NAV_LINK}>
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {ctaLink ? <div className="hidden md:flex">{ctaLink}</div> : null}
          <button type="button" popoverTarget={drawerId} className={`${BUTTON} md:hidden`}>
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} className="block h-4 w-4 shrink-0">
              <path d="M2.5 4h11M2.5 8h11M2.5 12h11" strokeLinecap="round" />
            </svg>
            {l.menu}
          </button>
        </div>
      </div>

      <div
        id={drawerId}
        popover="auto"
        className="fixed inset-y-0 right-0 left-auto z-50 m-0 box-border h-full max-h-none w-80 max-w-full overflow-y-auto border-0 bg-white p-0 text-neutral-900 shadow-xl backdrop:bg-neutral-900/40 md:hidden"
      >
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
                    className="block px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-neutral-500 uppercase data-[current]:text-neutral-900"
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
