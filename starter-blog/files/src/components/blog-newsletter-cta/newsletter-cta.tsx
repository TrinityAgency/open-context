import { useId, type ComponentProps } from 'react';
import { NEWSLETTER_LABELS, type NewsletterLabels } from './labels';
import type { NewsletterAction } from './newsletter';
import { NewsletterForm } from './newsletter-form';
import type { LinkComponent, LinkItem } from './site-types';

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

export type NewsletterCtaProps = {
  content: { title: string; text?: string; privacy?: LinkItem };
  /** Your server action: a `'use server'` function that calls handleNewsletter(form, subscribe). */
  action: NewsletterAction;
  /** `inline` (default): a full-width band. `sticky`: a framed card that stays in view in a column taller than itself. */
  variant?: 'inline' | 'sticky';
  /** The section's id, e.g. `newsletter` for a `/#newsletter` link. */
  id?: string;
  labels?: Partial<NewsletterLabels>;
  /** Renders the privacy link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  className?: string;
};

const INLINE = 'box-border w-full rounded-lg bg-neutral-100 px-6 py-10 text-neutral-900';
const STICKY = 'box-border sticky top-6 rounded-lg border border-solid border-neutral-200 bg-white p-5 text-neutral-900';
const LINK =
  'text-neutral-900 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/** A newsletter signup: a heading, a line of text, the form and a privacy notice. The form is the client island. */
export function NewsletterCta({
  content,
  action,
  variant = 'inline',
  id,
  labels,
  LinkComponent: Link = PlainLink,
  className,
}: NewsletterCtaProps) {
  const text = { ...NEWSLETTER_LABELS, ...labels };
  const titleId = useId();
  const sticky = variant === 'sticky';
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
  return (
    <section id={id} aria-labelledby={titleId} className={[sticky ? STICKY : INLINE, className].filter(Boolean).join(' ')}>
      <div className={sticky ? 'min-w-0' : 'mx-auto box-border min-w-0 max-w-xl'}>
        <h2 id={titleId} className={sticky ? 'm-0 text-lg font-semibold leading-snug' : 'm-0 text-2xl font-bold leading-tight'}>
          {content.title}
        </h2>
        {content.text ? <p className="m-0 mt-2 leading-relaxed text-neutral-700">{content.text}</p> : null}
        <div className="mt-5">
          <NewsletterForm action={action} labels={text} notice={notice} />
        </div>
      </div>
    </section>
  );
}
