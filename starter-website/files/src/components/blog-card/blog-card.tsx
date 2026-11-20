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

/** The layouts, in the manifest's order: the first is the default and draws what 1.0.0 drew. */
export type BlogCardLayout = 'stacked' | 'split';

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
  /** `stacked` (default): the cover above the text. `split`: the cover beside the text from sm; without one, stacked. */
  layout?: BlogCardLayout;
  className?: string;
};

// The colours, radius and heading font are the token contract's (design-tokens), each with its default, so a card
// without a design system draws what 1.0.0 drew. The card and its text column may shrink (min-w-0) so a word wider
// than the card breaks inside it instead of widening the card; the card clips its cover to its corners in every layout.
const CARD_BASE =
  'box-border flex min-w-0 overflow-hidden rounded-[calc(var(--oc-radius,0.25rem)*2)] border border-solid border-[var(--oc-line,oklch(92.2%_0_none))] bg-[var(--oc-surface,#fff)] text-[var(--oc-ink,oklch(20.5%_0_none))]';
const CARD: Record<BlogCardLayout, string> = {
  stacked: `${CARD_BASE} flex-col`,
  split: `${CARD_BASE} flex-col sm:flex-row`,
};
const IMAGE_BASE = 'block aspect-[40/21] h-auto w-full object-cover';
const IMAGE: Record<BlogCardLayout, string> = {
  stacked: IMAGE_BASE,
  // beside the text from sm: two fifths of the card, as tall as the text (or the text as tall as the cover)
  split: `${IMAGE_BASE} sm:aspect-auto sm:w-2/5 sm:shrink-0 sm:self-stretch`,
};
const TEXT = 'box-border flex min-w-0 flex-1 flex-col gap-2 p-5 wrap-break-word';
const MUTED = 'text-[var(--oc-ink-muted,oklch(43.9%_0_none))]';
const TITLE = 'm-0 text-lg font-semibold leading-snug font-[family-name:var(--oc-font-heading)]';
const TITLE_LINK =
  'text-[var(--oc-ink,oklch(20.5%_0_none))] no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/**
 * A post preview: image, category, title link, description, then date, reading time and authors. The root carries
 * `data-layout` with the layout it drew.
 */
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
  layout = 'stacked',
  className,
}: BlogCardProps) {
  const text = { ...BLOG_CARD_LABELS, ...labels };
  const titleId = useId();
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  // split needs a cover; without one the card is stacked
  const drawn: BlogCardLayout = layout === 'split' && post.image ? 'split' : 'stacked';
  const names = post.authorIds.flatMap((id) => authors.filter((author) => author.id === id).map((author) => author.name));
  return (
    <article
      aria-labelledby={titleId}
      data-layout={drawn}
      className={[CARD[drawn], className].filter(Boolean).join(' ')}
    >
      {post.image ? (
        <Image
          src={post.image.src}
          alt={post.image.alt}
          width={post.image.width}
          height={post.image.height}
          className={IMAGE[drawn]}
        />
      ) : null}
      <div className={TEXT}>
        {category ? (
          <p className={`m-0 text-xs font-semibold uppercase tracking-wide ${MUTED}`}>{category.name}</p>
        ) : null}
        <Heading id={titleId} className={TITLE}>
          <Link href={href} className={TITLE_LINK}>
            {post.title}
          </Link>
        </Heading>
        <p className="m-0 text-sm leading-relaxed text-[var(--oc-ink-body,oklch(37.1%_0_none))]">{post.description}</p>
        <p className={`m-0 mt-auto pt-2 text-xs leading-normal ${MUTED}`}>
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
