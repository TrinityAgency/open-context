import { useId, type ComponentProps } from 'react';
import type { Cta, LinkComponent } from './site-types';

export type CtaContent = { title: string; text?: string; ctas: Cta[] };

export type CtaSectionProps = {
  content: CtaContent;
  /** Renders the links; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `box-border inline-flex h-10 items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 text-sm font-medium whitespace-nowrap text-white no-underline hover:bg-neutral-700 ${FOCUS}`,
  secondary: `box-border inline-flex h-10 items-center justify-center rounded-md border border-solid border-neutral-300 bg-white px-4 text-sm font-medium whitespace-nowrap text-neutral-900 no-underline hover:bg-neutral-100 ${FOCUS}`,
};
const ROOT = 'box-border bg-neutral-100 px-6 py-16 text-neutral-900';

/**
 * A call-to-action band: a title, an optional line of text and its links, centred on a light band. Server component.
 */
export function CtaSection({ content, LinkComponent: Link = PlainLink, id, className }: CtaSectionProps) {
  const headingId = useId();
  const { title, text, ctas } = content;

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl text-center">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
        {text ? <p className="m-0 mx-auto mt-4 max-w-2xl text-lg text-neutral-700">{text}</p> : null}
        {ctas.length > 0 ? (
          <div data-ctas className="mt-8 flex flex-wrap justify-center gap-3">
            {ctas.map((cta, i) => (
              <Link key={i} href={cta.href} data-variant={cta.variant} className={CTA_CLASS[cta.variant]}>
                {cta.label}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
