// Derived from blog-card 1.0.0 (the same card): a project shows its discipline and the year it was finished instead of
// a date, reading time and authors.
import { useId, type ComponentProps } from 'react';
import type { Category, ImageComponent, LinkComponent, Post } from '@/components/blog-card/site-types';

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

const DATE_PREFIX = /^(\d{4})-(\d{2})-\d{2}(?=$|T)/;

/**
 * The year (or, with `month`, the month and year) written at the start of an ISO 8601 date, formatted for `locale`.
 * The offset never moves it: `2026-03-01T00:30:00+01:00` is March 2026, as written.
 */
export function projectDate(iso: string, locale: string, month = false): string {
  const match = DATE_PREFIX.exec(iso);
  if (!match) throw new RangeError(`not a date: ${iso}`);
  const at = Date.UTC(Number(match[1]), Number(match[2]) - 1, 1);
  return new Intl.DateTimeFormat(locale, month ? { month: 'long', year: 'numeric', timeZone: 'UTC' } : { year: 'numeric', timeZone: 'UTC' }).format(at);
}

export type ProjectCardProps = {
  project: Post;
  /** Where the title links, e.g. `/work/${project.slug}`. */
  href: string;
  /** The project's discipline, shown above the title. */
  discipline?: Category;
  /** Formats the year. Default `en`. */
  locale?: string;
  /** The title's heading level: 2 in a page's main list, 3 (default) under a section heading. */
  headingLevel?: 2 | 3;
  /** Renders the title link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the cover; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  className?: string;
};

const CARD =
  'box-border flex flex-col overflow-hidden rounded-lg border border-solid border-neutral-200 bg-white text-neutral-900';
const TITLE_LINK =
  'text-neutral-900 no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/** A project preview: cover, discipline, title link, description, then the year it was finished. */
export function ProjectCard({
  project,
  href,
  discipline,
  locale = 'en',
  headingLevel = 3,
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  className,
}: ProjectCardProps) {
  const titleId = useId();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <article aria-labelledby={titleId} className={[CARD, className].filter(Boolean).join(' ')}>
      {project.image ? (
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          className="block aspect-[40/21] h-auto w-full object-cover"
        />
      ) : null}
      <div className="box-border flex flex-1 flex-col gap-2 p-5">
        {discipline ? (
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-600">{discipline.name}</p>
        ) : null}
        <Heading id={titleId} className="m-0 text-lg font-semibold leading-snug">
          <Link href={href} className={TITLE_LINK}>
            {project.title}
          </Link>
        </Heading>
        <p className="m-0 text-sm leading-relaxed text-neutral-700">{project.description}</p>
        <p className="m-0 mt-auto pt-2 text-xs leading-normal text-neutral-600">
          <time dateTime={project.publishedAt}>{projectDate(project.publishedAt, locale)}</time>
        </p>
      </div>
    </article>
  );
}
