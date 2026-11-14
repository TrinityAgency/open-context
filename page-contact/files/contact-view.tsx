import Link from 'next/link';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { ContactForm } from './contact-form';
import { CONTENT } from './content';
import { CONTACT_LABELS_DE } from './labels.de';
import { CONTACT_LABELS, type ContactLabels } from './labels';
import type { ContactFacts, LinkComponent, LinkItem } from './site-types';

export type ContactContent = {
  title: string;
  intro?: string;
  contact: ContactFacts;
  /** The privacy page, linked from the notice under the form. */
  privacy: LinkItem;
  /** A link to a map (e.g. OpenStreetMap); a `map` slot replaces it. */
  map?: { href: string; label: string };
};

export type ContactViewProps = {
  content: ContactContent;
  /** When the page was rendered (ms since the epoch), for the form's time trap. */
  startedAt: number;
  /** Replaces the map link, e.g. an embedded map behind a consent gate (see README.md). */
  map?: ReactNode;
  labels?: Partial<ContactLabels>;
  /** Renders the privacy, email and phone links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

/**
 * A phone number as a `tel:` URL: everything but digits and `+` removed. After a country code, a `(0)` trunk
 * prefix (`+49 (0)30 …`) is dropped too: it is not dialled from abroad.
 */
const telHref = (phone: string) => {
  const international = phone.trim().startsWith('+');
  return `tel:${(international ? phone.replace(/\(\s*0\s*\)/g, '') : phone).replace(/[^\d+]/g, '')}`;
};

const LINK =
  'rounded-sm text-neutral-900 underline underline-offset-2 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const CARD = 'box-border rounded-lg border border-solid border-neutral-200 p-4';
const CARD_LABEL = 'm-0 text-sm font-medium text-neutral-600';

/**
 * The contact page body: the title (`h1`), an intro, the form and the contact details with a map. Server
 * component; only the form is a client island.
 */
export function ContactView({ content, startedAt, map, labels, LinkComponent: L = PlainLink }: ContactViewProps) {
  const l = { ...CONTACT_LABELS, ...labels };
  const detailsId = useId();
  const { title, intro, contact, privacy } = content;
  const { email, phone, address } = contact;
  const mapNode =
    map ??
    (content.map ? (
      <a href={content.map.href} rel="noopener noreferrer" className={LINK}>
        {content.map.label}
      </a>
    ) : null);
  const notice = (
    <>
      {l.notice}{' '}
      <L href={privacy.href} className={LINK}>
        {privacy.label}
      </L>
    </>
  );

  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 py-16 text-neutral-900">
        <div className="mx-auto max-w-5xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
          {intro ? <p className="m-0 mt-5 max-w-2xl text-lg text-neutral-700">{intro}</p> : null}
          <div className="mt-12 grid gap-12 md:grid-cols-[3fr_2fr]">
            <ContactForm startedAt={startedAt} labels={l} notice={notice} />
            <section aria-labelledby={detailsId} className="min-w-0">
              <h2 id={detailsId} className="m-0 text-xl font-semibold">
                {l.contact}
              </h2>
              {email || phone || address ? (
                <ul className="m-0 mt-5 grid list-none gap-4 p-0">
                  {email ? (
                    <li className={CARD}>
                      <p className={CARD_LABEL}>{l.email}</p>
                      <L href={`mailto:${email}`} className={LINK}>
                        {email}
                      </L>
                    </li>
                  ) : null}
                  {phone ? (
                    <li className={CARD}>
                      <p className={CARD_LABEL}>{l.phone}</p>
                      <L href={telHref(phone)} className={LINK}>
                        {phone}
                      </L>
                    </li>
                  ) : null}
                  {address ? (
                    <li className={CARD}>
                      <p className={CARD_LABEL}>{l.address}</p>
                      <address className="m-0 not-italic">
                        {address.street}
                        <br />
                        {address.postalCode} {address.city}
                        {address.country ? (
                          <>
                            <br />
                            {address.country}
                          </>
                        ) : null}
                      </address>
                    </li>
                  ) : null}
                </ul>
              ) : null}
              {mapNode ? <div className="mt-5">{mapNode}</div> : null}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

/** The contact page in one locale: its content and labels, with Next's `Link`. */
export function ContactPage({ locale, startedAt, map }: { locale: 'en' | 'de'; startedAt: number; map?: ReactNode }) {
  return (
    <ContactView
      content={CONTENT[locale]}
      startedAt={startedAt}
      map={map}
      labels={{ en: CONTACT_LABELS, de: CONTACT_LABELS_DE }[locale]}
      LinkComponent={Link}
    />
  );
}
