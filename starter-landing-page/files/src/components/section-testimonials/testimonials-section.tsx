import { useId, type ComponentProps } from 'react';
import type { ImageComponent, Testimonial } from './site-types';

export type TestimonialsContent = { title: string; items: Testimonial[] };

export type TestimonialsSectionProps = {
  content: TestimonialsContent;
  /** Renders the portraits; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  id?: string;
  className?: string;
};

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

const ROOT = 'box-border px-6 py-16 text-neutral-900';

/**
 * Quotes from clients, each a `figure`: the quote in a `blockquote`, then the person's portrait, name and role in
 * its `figcaption`. Server component. One to three columns by width.
 */
export function TestimonialsSection({ content, ImageComponent: Image = PlainImage, id, className }: TestimonialsSectionProps) {
  const headingId = useId();
  const { title, items } = content;

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        {items.length > 0 ? (
          <ul className="m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <li key={i} className="flex min-w-0">
                <figure className="m-0 box-border flex w-full flex-col justify-between gap-6 rounded-lg border border-solid border-neutral-200 bg-white p-6">
                  <blockquote className="m-0">
                    <p className="m-0 text-base text-neutral-800">{item.quote}</p>
                  </blockquote>
                  <figcaption className="flex items-center gap-3">
                    {item.image ? (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        className="block size-10 shrink-0 rounded-full object-cover"
                      />
                    ) : null}
                    <span className="block min-w-0">
                      <span className="block text-sm font-semibold text-neutral-900">{item.name}</span>
                      {item.role ? (
                        <span data-role className="block text-sm text-neutral-600">
                          {item.role}
                        </span>
                      ) : null}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
