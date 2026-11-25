import { useId, type ComponentProps } from 'react';
import { Accordion } from './_parts/accordion/accordion';
import type { LinkComponent } from './_sections/hero/site-types';
import type { JobOpening, OpeningsContent } from './content';

export type OpeningsSectionProps = {
  content: OpeningsContent;
  /** Renders the apply links; pass next/link's Link in a Next app. Default: a plain `a`. */
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
const INK_BODY = 'text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const INK_MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';

const ROOT = `box-border px-6 py-16 ${INK} wrap-break-word`;
const HEADING = `m-0 text-3xl font-semibold tracking-tight ${HEADING_FONT}`;
const INTRO = `m-0 mt-4 max-w-2xl text-lg ${INK_BODY}`;
// The hero's primary call: wraps inside the row, its label in a box that may shrink below its longest word.
const APPLY = `box-border inline-flex min-h-10 max-w-full items-center justify-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-brand,oklch(20.5%_0_none))] bg-[var(--oc-brand,oklch(20.5%_0_none))] px-4 py-2 text-center text-sm font-medium text-[var(--oc-on-brand,#fff)] no-underline hover:bg-[var(--oc-brand-hover,oklch(37.1%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]`;

function OpeningTitle({ opening }: { opening: JobOpening }) {
  const meta = [opening.location, opening.kind].filter(Boolean).join(' · ');
  return (
    <>
      <span className={`block text-lg font-semibold ${HEADING_FONT}`}>{opening.title}</span>
      {meta ? (
        <span data-meta className={`mt-1 block text-sm font-normal ${INK_MUTED}`}>
          {meta}
        </span>
      ) : null}
    </>
  );
}

function OpeningBody({ opening, requirementsLabel, Link }: { opening: JobOpening; requirementsLabel: string; Link: LinkComponent }) {
  const requirements = opening.requirements ?? [];
  return (
    <>
      <div data-description className="grid grid-cols-1 gap-3">
        {opening.description.map((paragraph, i) => (
          <p key={i} className="m-0">
            {paragraph}
          </p>
        ))}
      </div>
      {requirements.length > 0 ? (
        <>
          <p className={`m-0 mt-5 font-medium ${INK}`}>{requirementsLabel}</p>
          <ul className="m-0 mt-2 grid list-disc grid-cols-1 gap-1 p-0 ps-5">
            {requirements.map((requirement, i) => (
              <li key={i} className="min-w-0">
                {requirement}
              </li>
            ))}
          </ul>
        </>
      ) : null}
      <div className="mt-6 flex flex-wrap">
        <Link href={opening.apply.href} className={APPLY}>
          <span className="min-w-0">{opening.apply.label}</span>
        </Link>
      </div>
    </>
  );
}

/**
 * The open positions: a heading, an intro and one accordion item per opening (its title and a line of where and
 * what kind, then the description, the requirements and an apply link), or `noOpenings` when there is none. Server
 * component; each item is a native `details` whose `id` is the opening's, so `#<id>` scrolls to it (closed).
 */
export function OpeningsSection({ content, LinkComponent: Link = PlainLink, id, className }: OpeningsSectionProps) {
  const headingId = useId();
  const { title, intro, requirementsLabel, noOpenings, items } = content;
  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className={HEADING}>
          {title}
        </h2>
        {intro ? <p className={INTRO}>{intro}</p> : null}
        {items.length > 0 ? (
          <Accordion
            className="mt-10 max-w-3xl"
            items={items.map((opening) => ({
              id: opening.id,
              title: <OpeningTitle opening={opening} />,
              content: <OpeningBody opening={opening} requirementsLabel={requirementsLabel} Link={Link} />,
            }))}
          />
        ) : (
          <p className={`m-0 mt-6 max-w-2xl text-lg ${INK_BODY}`}>{noOpenings}</p>
        )}
      </div>
    </section>
  );
}
