import { useId, type ComponentProps } from 'react';
import { NEWSLETTER_LABELS, type NewsletterLabels } from './labels';
import type { NewsletterAction } from './newsletter';
import { NewsletterForm } from './newsletter-form';
import type { LinkComponent, LinkItem } from './site-types';

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

/** The layouts, in the manifest's order: the first is the default; `inline` and `sticky` draw what 1.x's variant drew. */
export type NewsletterLayout = 'inline' | 'sticky' | 'split';

export type NewsletterCtaProps = {
  content: { title: string; text?: string; privacy?: LinkItem };
  /** Your server action: a `'use server'` function that calls handleNewsletter(form, subscribe). */
  action: NewsletterAction;
  /**
   * `inline` (default): a full-width band. `sticky`: a framed card that stays in view in a column taller than itself.
   * `split`: the band with the title and text beside the form from md.
   */
  layout?: NewsletterLayout;
  /** @deprecated 1.x's name for `layout` (`inline`, `sticky`); still drawn as before. `layout` wins when both are set. */
  variant?: 'inline' | 'sticky';
  /** The section's id, e.g. `newsletter` for a `/#newsletter` link. */
  id?: string;
  labels?: Partial<NewsletterLabels>;
  /** Renders the privacy link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

// The colours, radius and heading font are the token contract's (design-tokens), each with its default, so a signup
// without a design system draws what 1.0.0 drew. Its text breaks a word wider than the band.
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const BAND = `box-border w-full rounded-[calc(var(--oc-radius,0.25rem)*2)] bg-[var(--oc-surface-sunk,oklch(97%_0_none))] px-6 py-10 ${INK}`;
const ROOT: Record<NewsletterLayout, string> = {
  inline: BAND,
  sticky: `box-border sticky top-6 rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] p-5 ${INK}`,
  split: BAND,
};
const INNER: Record<NewsletterLayout, string> = {
  inline: 'mx-auto box-border min-w-0 max-w-xl wrap-break-word',
  sticky: 'min-w-0 wrap-break-word',
  split: 'mx-auto box-border grid min-w-0 max-w-5xl grid-cols-1 gap-6 wrap-break-word md:grid-cols-2 md:items-center md:gap-10',
};
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const TITLE: Record<NewsletterLayout, string> = {
  inline: `m-0 text-2xl font-bold leading-tight ${HEADING_FONT}`,
  sticky: `m-0 text-lg font-semibold leading-snug ${HEADING_FONT}`,
  split: `m-0 text-2xl font-bold leading-tight ${HEADING_FONT}`,
};
const TEXT = 'm-0 mt-2 leading-relaxed text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const LINK = `${INK} underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]`;

/**
 * A newsletter signup: a heading, a line of text, the form and a privacy notice. The form is the client island. The
 * section carries `data-layout` with the layout it drew.
 */
export function NewsletterCta({
  content,
  action,
  layout,
  variant,
  id,
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: NewsletterCtaProps) {
  const text = { ...NEWSLETTER_LABELS, ...labels };
  const titleId = useId();
  const drawn: NewsletterLayout = layout ?? variant ?? 'inline';
  const notice = content.privacy ? (
    <>
      {text.notice}{' '}
      <Link href={content.privacy.href} className={LINK}>
        {content.privacy.label}
      </Link>
    </>
  ) : (
    text.notice
  );
  const heading = (
    <h2 id={titleId} className={TITLE[drawn]}>
      {content.title}
    </h2>
  );
  const lead = content.text ? <p className={TEXT}>{content.text}</p> : null;
  // in split the field and the button share a half-width column, so they stand side by side only from lg
  const form = <NewsletterForm action={action} labels={text} notice={notice} wideFrom={drawn === 'split' ? 'lg' : 'sm'} />;
  return (
    <section
      id={id}
      aria-labelledby={titleId}
      data-layout={drawn}
      className={[ROOT[drawn], className].filter(Boolean).join(' ')}
    >
      {drawn === 'split' ? (
        <div className={INNER.split}>
          <div data-intro="" className="min-w-0">
            {heading}
            {lead}
          </div>
          <div className="min-w-0">{form}</div>
        </div>
      ) : (
        <div className={INNER[drawn]}>
          {heading}
          {lead}
          <div className="mt-5">{form}</div>
        </div>
      )}
    </section>
  );
}
