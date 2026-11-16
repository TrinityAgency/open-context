import { useId, type ComponentProps } from 'react';
import { formatPostDate } from './format-date';
import { BLOG_CARD_LABELS, type BlogCardLabels } from './labels';
import type { Author, Category, ImageComponent, LinkComponent, Post } from './site-types';

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

function PlainImage({ src, alt, width, height, className }: ComponentProps<ImageComponent>) {
  return <img src={src} alt={alt} width={width} height={height} className={className} />;
}

export type BlogCardProps = {
  post: Post;
  /** Where the title links, e.g. `/blog/${post.slug}`. */
  href: string;
  /** The authors to name, matched by post.authorIds (unknown ids are skipped). */
  authors?: Author[];
  /** The post's category, shown above the title. */
  category?: Category;
  /** Formats the date and joins the author names. Default `en`. */
  locale?: string;
  /** The title's heading level: 2 in a page's main list, 3 (default) under a section heading. */
  headingLevel?: 2 | 3;
  labels?: Partial<BlogCardLabels>;
  /** Renders the title link; pass next/link's Link in a Next app. Default: a plain `a`. */
  LinkComponent?: LinkComponent;
  /** Renders the post image; pass a next/image wrapper in a Next app. Default: a plain `img`. */
  ImageComponent?: ImageComponent;
  className?: string;
};

const CARD =
  'box-border flex flex-col overflow-hidden rounded-lg border border-solid border-neutral-200 bg-white text-neutral-900';
const TITLE_LINK =
  'text-neutral-900 no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/** A post preview: image, category, title link, description, then date, reading time and authors. */
export function BlogCard({
  post,
  href,
  authors = [],
  category,
  locale = 'en',
  headingLevel = 3,
  labels,
  LinkComponent: Link = PlainLink,
  ImageComponent: Image = PlainImage,
  className,
}: BlogCardProps) {
  const text = { ...BLOG_CARD_LABELS, ...labels };
  const titleId = useId();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const names = post.authorIds.flatMap((id) => authors.filter((author) => author.id === id).map((author) => author.name));
  return (
    <article
      aria-labelledby={titleId}
      className={[CARD, className].filter(Boolean).join(' ')}
    >
      {post.image ? (
        <Image
          src={post.image.src}
          alt={post.image.alt}
          width={post.image.width}
          height={post.image.height}
          className="block aspect-[40/21] h-auto w-full object-cover"
        />
      ) : null}
      <div className="box-border flex flex-1 flex-col gap-2 p-5">
        {category ? (
          <p className="m-0 text-xs font-semibold uppercase tracking-wide text-neutral-600">{category.name}</p>
        ) : null}
        <Heading id={titleId} className="m-0 text-lg font-semibold leading-snug">
          <Link href={href} className={TITLE_LINK}>
            {post.title}
          </Link>
        </Heading>
        <p className="m-0 text-sm leading-relaxed text-neutral-700">{post.description}</p>
        <p className="m-0 mt-auto pt-2 text-xs leading-normal text-neutral-600">
          <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt, locale)}</time>
          <span aria-hidden="true"> · </span>
          <span>{text.minutes(post.readingMinutes)}</span>
          {names.length ? (
            <>
              <span aria-hidden="true"> · </span>
              <span>{`${text.by} ${new Intl.ListFormat(locale, { type: 'conjunction' }).format(names)}`}</span>
            </>
          ) : null}
        </p>
      </div>
    </article>
  );
}
