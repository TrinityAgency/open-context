import { useId, type ComponentProps } from 'react';
import type { Cta, ImageComponent, ImageRef, LinkComponent } from './site-types';

export type HeroContent = { eyebrow?: string; title: string; lead?: string; ctas?: Cta[]; image?: ImageRef };

export type HeroSectionProps = {
  content: HeroContent;
  /** The heading's level: `1` (the page's title, the default) or `2` (a hero further down a page). */
  headingLevel?: 1 | 2;
  /** Renders the calls to action; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the image; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const CTA_CLASS: Record<Cta['variant'], string> = {
  primary: `box-border inline-flex h-10 items-center justify-center rounded-md border border-solid border-neutral-900 bg-neutral-900 px-4 text-sm font-medium whitespace-nowrap text-white no-underline hover:bg-neutral-700 ${FOCUS}`,
  secondary: `box-border inline-flex h-10 items-center justify-center rounded-md border border-solid border-neutral-300 bg-white px-4 text-sm font-medium whitespace-nowrap text-neutral-900 no-underline hover:bg-neutral-100 ${FOCUS}`,
};

/**
 * The opening section of a page: an optional eyebrow, the title, a lead, calls to action and an optional image.
 * Server component. With an image, text and image sit side by side from `md`; without one, the text is centred.
 */
export function HeroSection({
  content,
  headingLevel = 1,
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: HeroSectionProps) {
  const headingId = useId();
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  const { eyebrow, title, lead, ctas = [], image } = content;
  const centred = !image;

  const text = (
    <div className={centred ? 'mx-auto max-w-3xl text-center' : 'min-w-0'}>
      {eyebrow ? <p className="m-0 mb-3 text-sm font-medium text-neutral-600">{eyebrow}</p> : null}
      <Heading id={headingId} className="m-0 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
        {title}
      </Heading>
      {lead ? <p className="m-0 mt-5 text-lg text-neutral-700">{lead}</p> : null}
      {ctas.length > 0 ? (
        <div data-ctas className={centred ? 'mt-8 flex flex-wrap justify-center gap-3' : 'mt-8 flex flex-wrap gap-3'}>
          {ctas.map((cta, i) => (
            <Link key={i} href={cta.href} data-variant={cta.variant} className={CTA_CLASS[cta.variant]}>
              {cta.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={className ? `box-border px-6 py-16 text-neutral-900 ${className}` : 'box-border px-6 py-16 text-neutral-900'}
    >
      <div className="mx-auto max-w-5xl">
        {image ? (
          <div className="grid items-center gap-10 md:grid-cols-2">
            {text}
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="block h-auto w-full max-w-full rounded-lg"
            />
          </div>
        ) : (
          text
        )}
      </div>
    </section>
  );
}
