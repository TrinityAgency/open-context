import type { ComponentProps } from 'react';
import { SITE_FOOTER_LABELS, type SiteFooterLabels } from './labels';
import type { ContactFacts, LinkComponent, LinkItem, SiteIdentity, SocialLink } from './site-types';

export type FooterColumn = { title: string; links: LinkItem[] };

/** The footer's layouts, named as in the kit's layout vocabulary. */
export type SiteFooterLayout = 'columns' | 'centered' | 'minimal';

export type SiteFooterProps = {
  identity: Pick<SiteIdentity, 'name' | 'description'>;
  /** Link columns, each under its own heading. */
  columns?: FooterColumn[];
  /** Email, phone and postal address, shown in an `address` block. */
  contact?: ContactFacts;
  /** Social profiles as plain text links. */
  social?: SocialLink[];
  /** Imprint, privacy and the like, in a `nav` named by `labels.legal`. */
  legal?: LinkItem[];
  /** Adds a "cookie settings" button with `data-consent-open` after the legal links. */
  cookieSettings?: boolean;
  /** Replaces the default copyright line `labels.copyright(identity.name)`. */
  copyright?: string;
  /**
   * `columns` (the default): the identity beside titled link columns, contact and social links, the legal row below.
   * `centered`: the same, centred, the identity above the columns. `minimal`: one wrapping row with the name, the
   * address, every link, the legal links and the copyright, no titles and no description.
   */
  layout?: SiteFooterLayout;
  labels?: Partial<SiteFooterLabels>;
  /** Renders every link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const LINE = 'border-[var(--oc-line,oklch(92.2%_0_none))]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const LINK = `rounded-[var(--oc-radius,0.25rem)] text-[var(--oc-ink-body,oklch(37.1%_0_none))] no-underline underline-offset-4 hover:text-[var(--oc-ink,oklch(20.5%_0_none))] hover:underline ${FOCUS}`;
const HEADING = `m-0 text-sm font-semibold ${INK} font-[family-name:var(--oc-font-heading)]`;
const NAME = `m-0 min-w-0 text-base font-semibold ${INK} font-[family-name:var(--oc-font-heading)]`;
const LIST = 'm-0 mt-3 flex list-none flex-col gap-2 p-0 text-sm';
const COOKIE_BUTTON = `m-0 cursor-pointer appearance-none rounded-[var(--oc-radius,0.25rem)] border-0 bg-transparent p-0 font-[family-name:var(--oc-font-body)] text-sm font-normal text-[var(--oc-ink-body,oklch(37.1%_0_none))] underline-offset-4 hover:text-[var(--oc-ink,oklch(20.5%_0_none))] hover:underline ${FOCUS}`;

// One whole class string per layout for every element a layout changes; a word wider than its column breaks.
const INNER: Record<SiteFooterLayout, string> = {
  columns: 'mx-auto box-border max-w-6xl px-4 py-12 wrap-break-word',
  centered: 'mx-auto box-border max-w-6xl px-4 py-12 text-center wrap-break-word',
  minimal: 'mx-auto box-border flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-6 text-sm wrap-break-word',
};
const BLOCKS: Record<Exclude<SiteFooterLayout, 'minimal'>, string> = {
  columns: 'grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-none lg:auto-cols-fr',
  centered: 'flex flex-wrap justify-center gap-x-12 gap-y-8',
};
const IDENTITY: Record<Exclude<SiteFooterLayout, 'minimal'>, string> = {
  columns: 'min-w-0',
  centered: 'min-w-0 basis-full',
};
const DESCRIPTION: Record<Exclude<SiteFooterLayout, 'minimal'>, string> = {
  columns: 'm-0 mt-2 max-w-xs text-sm',
  centered: 'm-0 mx-auto mt-2 max-w-xs text-sm',
};
const LEGAL_ROW: Record<Exclude<SiteFooterLayout, 'minimal'>, string> = {
  columns: `mt-10 flex flex-col gap-4 border-t ${LINE} pt-6 md:flex-row md:items-center md:justify-between`,
  centered: `mt-10 flex flex-col gap-4 border-t ${LINE} pt-6`,
};
const LEGAL_LIST: Record<SiteFooterLayout, string> = {
  columns: 'm-0 flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0 text-sm',
  centered: 'm-0 flex list-none flex-wrap items-center justify-center gap-x-6 gap-y-2 p-0 text-sm',
  minimal: 'm-0 flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0 text-sm',
};

/**
 * A phone number as a `tel:` URL: everything but digits and `+` removed. After a country code, a `(0)` trunk
 * prefix (`+49 (0)30 …`) is dropped too: it is not dialled from abroad.
 */
const telHref = (phone: string) => {
  const international = phone.trim().startsWith('+');
  return `tel:${(international ? phone.replace(/\(\s*0\s*\)/g, '') : phone).replace(/[^\d+]/g, '')}`;
};

/**
 * The site's footer: identity, link columns, contact block, social links, legal links and the copyright line, in one
 * of three layouts (`layout`). Server component. With `cookieSettings` it adds a button carrying `data-consent-open`,
 * which a consent module (such as site-cookie-consent) listens for; without one the button does nothing. Colours,
 * fonts and corner radius come from the design tokens.
 */
export function SiteFooter({
  identity,
  columns = [],
  contact,
  social = [],
  legal = [],
  cookieSettings = false,
  copyright,
  layout = 'columns',
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: SiteFooterProps) {
  const l = { ...SITE_FOOTER_LABELS, ...labels };
  const address = contact?.address;
  const hasContact = Boolean(contact && (contact.email || contact.phone || address));
  const copyrightLine = copyright ?? l.copyright(identity.name);

  const legalNav =
    legal.length > 0 || cookieSettings ? (
      <nav aria-label={l.legal} className="min-w-0">
        <ul className={LEGAL_LIST[layout]}>
          {legal.map((link, i) => (
            <li key={i} className="min-w-0">
              <Link href={link.href} className={LINK}>
                {link.label}
              </Link>
            </li>
          ))}
          {cookieSettings ? (
            <li className="min-w-0">
              <button type="button" data-consent-open="" className={COOKIE_BUTTON}>
                {l.cookieSettings}
              </button>
            </li>
          ) : null}
        </ul>
      </nav>
    ) : null;

  const root = `border-t ${LINE} bg-[var(--oc-surface-alt,oklch(98.5%_0_none))] text-[var(--oc-ink-body,oklch(37.1%_0_none))]${className ? ` ${className}` : ''}`;

  if (layout === 'minimal') {
    // One wrapping row, no titles: the name, the address, every column and social link, the legal links, the copyright.
    const rowLinks = [...columns.flatMap((column) => column.links), ...social];
    const postal = address ? [address.street, `${address.postalCode} ${address.city}`, address.country].filter(Boolean).join(', ') : '';
    return (
      <footer data-layout={layout} className={root}>
        <div className={INNER.minimal}>
          <p className={NAME}>{identity.name}</p>
          {hasContact && contact ? (
            <address className="m-0 flex min-w-0 flex-wrap gap-x-4 gap-y-1 not-italic">
              {postal ? <span className="min-w-0">{postal}</span> : null}
              {contact.email ? (
                <span className="min-w-0">
                  <Link href={`mailto:${contact.email}`} className={LINK}>
                    {contact.email}
                  </Link>
                </span>
              ) : null}
              {contact.phone ? (
                <span className="min-w-0">
                  <Link href={telHref(contact.phone)} className={LINK}>
                    {contact.phone}
                  </Link>
                </span>
              ) : null}
            </address>
          ) : null}
          {rowLinks.length > 0 ? (
            <ul className="m-0 flex min-w-0 list-none flex-wrap gap-x-4 gap-y-2 p-0">
              {rowLinks.map((link, i) => (
                <li key={i} className="min-w-0">
                  <Link href={link.href} className={LINK}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}
          {legalNav}
          <p className="m-0 min-w-0">{copyrightLine}</p>
        </div>
      </footer>
    );
  }

  return (
    <footer data-layout={layout} className={root}>
      <div className={INNER[layout]}>
        <div className={BLOCKS[layout]}>
          <div className={IDENTITY[layout]}>
            <p className={NAME}>{identity.name}</p>
            {identity.description ? <p className={DESCRIPTION[layout]}>{identity.description}</p> : null}
          </div>

          {columns.map((column, i) => (
            <div key={i} className="min-w-0">
              <h2 className={HEADING}>{column.title}</h2>
              <ul className={LIST}>
                {column.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {hasContact && contact ? (
            <div className="min-w-0">
              <h2 className={HEADING}>{l.contact}</h2>
              <address className="m-0 mt-3 flex flex-col gap-2 text-sm not-italic">
                {address ? (
                  <p className="m-0">
                    {address.street}
                    <br />
                    {address.postalCode} {address.city}
                    {address.country ? (
                      <>
                        <br />
                        {address.country}
                      </>
                    ) : null}
                  </p>
                ) : null}
                {contact.email ? (
                  <p className="m-0">
                    <span className={`font-medium ${INK}`}>{l.email}</span>{' '}
                    <Link href={`mailto:${contact.email}`} className={LINK}>
                      {contact.email}
                    </Link>
                  </p>
                ) : null}
                {contact.phone ? (
                  <p className="m-0">
                    <span className={`font-medium ${INK}`}>{l.phone}</span>{' '}
                    <Link href={telHref(contact.phone)} className={LINK}>
                      {contact.phone}
                    </Link>
                  </p>
                ) : null}
              </address>
            </div>
          ) : null}

          {social.length > 0 ? (
            <div className="min-w-0">
              <h2 className={HEADING}>{l.social}</h2>
              <ul className={LIST}>
                {social.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className={LEGAL_ROW[layout]}>
          <p className="m-0 min-w-0 text-sm">{copyrightLine}</p>
          {legalNav}
        </div>
      </div>
    </footer>
  );
}
