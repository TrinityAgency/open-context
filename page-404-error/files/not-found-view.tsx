import Link from 'next/link';
import type { ComponentProps } from 'react';
import { NOT_FOUND, type NotFoundContent } from './content';
import type { LinkComponent } from './site-types';

export type NotFoundViewProps = {
  content: NotFoundContent;
  /** Renders the links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const LINK =
  'rounded-[var(--oc-radius,0.25rem)] font-medium text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/** The not-found page: a title, a line of text and the ways onward. Server component. */
export function NotFoundView({ content, LinkComponent: L = PlainLink }: NotFoundViewProps) {
  const { title, text, linksLabel, links } = content;
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <div className="box-border px-6 py-24 text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word">
        <div className="mx-auto max-w-2xl">
          <h1 className="m-0 text-4xl font-semibold tracking-tight sm:text-5xl font-[family-name:var(--oc-font-heading)]">{title}</h1>
          <p className="m-0 mt-5 text-lg text-[var(--oc-ink-body,oklch(37.1%_0_none))]">{text}</p>
          {links.length > 0 ? (
            <nav aria-label={linksLabel} className="mt-10">
              <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0">
                {links.map((link, i) => (
                  <li key={i} className="max-w-full">
                    <L href={link.href} className={LINK}>
                      {link.label}
                    </L>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </div>
    </main>
  );
}

/** The not-found page in one locale, with Next's `Link`. */
export function NotFoundPage({ locale }: { locale: 'en' | 'de' }) {
  return <NotFoundView content={NOT_FOUND[locale]} LinkComponent={Link} />;
}
