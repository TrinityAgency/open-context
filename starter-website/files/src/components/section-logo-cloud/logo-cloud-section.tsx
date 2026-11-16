import { useId, type ComponentProps } from 'react';
import type { ImageComponent, LinkComponent, LogoItem } from './site-types';

export type LogoCloudContent = { title: string; logos: LogoItem[] };

export type LogoCloudSectionProps = {
  content: LogoCloudContent;
  /** Renders the links of logos that have an `href`; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the logos; pass a next/image wrapper in a Next app. Default: a plain `img`. */
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

const ROOT = 'box-border px-6 py-12 text-neutral-900';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900';

/**
 * A row of client or partner logos under a small heading, each optionally linked. Server component. A logo's
 * accessible name is its image's alt, or the logo's name when the alt is empty.
 */
export function LogoCloudSection({
  content,
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  id,
  className,
}: LogoCloudSectionProps) {
  const headingId = useId();
  const { title, logos } = content;

  return (
    <section id={id} aria-labelledby={headingId} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <h2 id={headingId} className="m-0 text-center text-sm font-medium text-neutral-600">
          {title}
        </h2>
        {logos.length > 0 ? (
          <ul className="m-0 mt-8 grid list-none grid-cols-2 items-center justify-items-center gap-x-8 gap-y-6 p-0 sm:grid-cols-3 lg:grid-cols-6">
            {logos.map((logo, i) => {
              const image = (
                <Image
                  src={logo.image.src}
                  alt={logo.image.alt || logo.name}
                  width={logo.image.width}
                  height={logo.image.height}
                  className="block h-8 w-auto max-w-full object-contain"
                />
              );
              return (
                <li key={i} className="flex min-w-0 justify-center">
                  {logo.href ? (
                    <Link href={logo.href} className={`block rounded-sm ${FOCUS}`}>
                      {image}
                    </Link>
                  ) : (
                    image
                  )}
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
