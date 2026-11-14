import { useId, type ComponentProps } from 'react';
import type { Feature, ImageComponent } from './site-types';

export type FeaturesContent = { title: string; intro?: string; items: Feature[] };

export type FeaturesSectionProps = {
  content: FeaturesContent;
  /** `grid` (the default): 1, 2 or 3 columns. `rows`: one item per row, the image side alternating. */
  layout?: 'grid' | 'rows';
  /** Renders the images; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

/** One SVG path in a 24-unit box: `Feature.icon` is its `d`. */
function Icon({ d }: { d: string }) {
  return (
    <span className="mb-4 flex size-10 items-center justify-center rounded-md bg-neutral-100 text-neutral-900">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" className="block size-6">
        <path d={d} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

const ROOT = 'box-border px-6 py-16 text-neutral-900';
const IMAGE = 'block h-auto w-full max-w-full rounded-lg';

/**
 * A titled list of features: each with an optional icon, a title, a description and an optional image. Server
 * component. `grid` shows them as cards in up to three columns; `rows` gives each its own row, text beside the image
 * from `md`, the image side alternating.
 */
export function FeaturesSection({
  content,
  layout = 'grid',
  ImageComponent: Image = PlainImage,
  id,
  className,
}: FeaturesSectionProps) {
  const headingId = useId();
  const { title, intro, items } = content;

  const picture = (item: Feature, cls: string) =>
    item.image ? (
      <Image src={item.image.src} alt={item.image.alt} width={item.image.width} height={item.image.height} className={cls} />
    ) : null;
  const text = (item: Feature) => (
    <>
      {item.icon ? <Icon d={item.icon} /> : null}
      <h3 className="m-0 text-lg font-semibold">{item.title}</h3>
      <p className="m-0 mt-2 text-neutral-700">{item.description}</p>
    </>
  );

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {intro ? <p className="m-0 mt-4 max-w-2xl text-lg text-neutral-700">{intro}</p> : null}
        {items.length === 0 ? null : layout === 'rows' ? (
          <ul className="m-0 mt-12 grid list-none gap-16 p-0">
            {items.map((item, i) => {
              const side = i % 2 === 0 ? 'start' : 'end';
              return (
                <li key={i} data-side={side} className="grid items-center gap-8 md:grid-cols-2">
                  <div className="min-w-0">{text(item)}</div>
                  {picture(item, side === 'start' ? `${IMAGE} md:order-first` : IMAGE)}
                </li>
              );
            })}
          </ul>
        ) : (
          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-8 p-0 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <li key={i} className="min-w-0">
                {picture(item, `${IMAGE} mb-4`)}
                {text(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
