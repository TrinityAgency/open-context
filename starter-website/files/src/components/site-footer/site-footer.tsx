import type { ComponentProps } from 'react';
import { SITE_FOOTER_LABELS, type SiteFooterLabels } from './labels';
import type { ContactFacts, LinkComponent, LinkItem, SiteIdentity, SocialLink } from './site-types';

export type FooterColumn = { title: string; links: LinkItem[] };

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
  labels?: Partial<SiteFooterLabels>;
  /** Renders every link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const LINK = `rounded-sm text-neutral-700 no-underline underline-offset-4 hover:text-neutral-900 hover:underline ${FOCUS}`;
const HEADING = 'm-0 text-sm font-semibold text-neutral-900';
const LIST = 'm-0 mt-3 flex list-none flex-col gap-2 p-0 text-sm';

/**
 * A phone number as a `tel:` URL: everything but digits and `+` removed. After a country code, a `(0)` trunk
 * prefix (`+49 (0)30 …`) is dropped too: it is not dialled from abroad.
 */
const telHref = (phone: string) => {
  const international = phone.trim().startsWith('+');
  return `tel:${(international ? phone.replace(/\(\s*0\s*\)/g, '') : phone).replace(/[^\d+]/g, '')}`;
};

/**
 * The site's footer: identity, link columns, contact block, social links, legal links and the copyright line.
 * Server component. With `cookieSettings` it adds a button carrying `data-consent-open`, which a consent module
 * (such as site-cookie-consent) listens for; without one the button does nothing.
 */
export function SiteFooter({
  identity,
  columns = [],
  contact,
  social = [],
  legal = [],
  cookieSettings = false,
  copyright,
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: SiteFooterProps) {
  const l = { ...SITE_FOOTER_LABELS, ...labels };
  const address = contact?.address;
  const hasContact = Boolean(contact && (contact.email || contact.phone || address));

  return (
    <footer className={`border-t border-neutral-200 bg-neutral-50 text-neutral-700${className ? ` ${className}` : ''}`}>
      <div className="mx-auto box-border max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-flow-col lg:grid-cols-none lg:auto-cols-fr">
          <div>
            <p className="m-0 text-base font-semibold text-neutral-900">{identity.name}</p>
            {identity.description ? <p className="m-0 mt-2 max-w-xs text-sm">{identity.description}</p> : null}
          </div>

          {columns.map((column, i) => (
            <div key={i}>
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
            <div>
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
                    <span className="font-medium text-neutral-900">{l.email}</span>{' '}
                    <Link href={`mailto:${contact.email}`} className={LINK}>
                      {contact.email}
                    </Link>
                  </p>
                ) : null}
                {contact.phone ? (
                  <p className="m-0">
                    <span className="font-medium text-neutral-900">{l.phone}</span>{' '}
                    <Link href={telHref(contact.phone)} className={LINK}>
                      {contact.phone}
                    </Link>
                  </p>
                ) : null}
              </address>
            </div>
          ) : null}

          {social.length > 0 ? (
            <div>
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

        <div className="mt-10 flex flex-col gap-4 border-t border-neutral-200 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="m-0 text-sm">{copyright ?? l.copyright(identity.name)}</p>
          {legal.length > 0 || cookieSettings ? (
            <nav aria-label={l.legal}>
              <ul className="m-0 flex list-none flex-wrap items-center gap-x-6 gap-y-2 p-0 text-sm">
                {legal.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className={LINK}>
                      {link.label}
                    </Link>
                  </li>
                ))}
                {cookieSettings ? (
                  <li>
                    <button
                      type="button"
                      data-consent-open=""
                      className={`m-0 cursor-pointer appearance-none rounded-sm border-0 bg-transparent p-0 font-sans text-sm font-normal text-neutral-700 underline-offset-4 hover:text-neutral-900 hover:underline ${FOCUS}`}
                    >
                      {l.cookieSettings}
                    </button>
                  </li>
                ) : null}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
