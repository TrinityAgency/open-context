import type { ComponentProps, ComponentPropsWithoutRef } from 'react';
import type { MdxComponents } from './mdx';
import type { LinkComponent } from './site-types';

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';
const HEADING_2 = 'm-0 mt-10 mb-4 scroll-mt-24 text-2xl font-bold leading-tight text-neutral-900';
const HEADING_3 = 'm-0 mt-8 mb-3 scroll-mt-24 text-xl font-semibold leading-snug text-neutral-900';
const HEADING_4 = 'm-0 mt-6 mb-2 text-lg font-semibold leading-snug text-neutral-900';
const PARAGRAPH = 'm-0 mb-4 leading-relaxed';
const LINK = `text-neutral-900 underline underline-offset-2 hover:text-neutral-600 ${FOCUS}`;
const LIST = 'm-0 mb-4 list-disc pl-6 leading-relaxed';
const ORDERED_LIST = 'm-0 mb-4 list-decimal pl-6 leading-relaxed';
const LIST_ITEM = 'm-0 mt-1 p-0 pl-1';
const QUOTE = 'm-0 mb-4 box-border border-l-4 border-neutral-300 py-1 pl-4 italic text-neutral-700';
const CODE = 'rounded bg-neutral-100 px-1 py-0.5 font-mono text-[0.875em] text-neutral-900';
const PRE = `m-0 mb-4 box-border overflow-x-auto rounded-md bg-neutral-900 p-4 font-mono text-sm leading-relaxed text-white [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em] [&_code]:text-inherit ${FOCUS}`;
const RULE = 'm-0 my-8 h-px border-0 bg-neutral-200';
const IMAGE = 'm-0 my-6 block h-auto max-w-full rounded-md';

function Heading2({ id, children }: ComponentPropsWithoutRef<'h2'>) {
  return (
    <h2 id={id} className={HEADING_2}>
      {children}
    </h2>
  );
}

function Heading3({ id, children }: ComponentPropsWithoutRef<'h3'>) {
  return (
    <h3 id={id} className={HEADING_3}>
      {children}
    </h3>
  );
}

function Heading4({ id, children }: ComponentPropsWithoutRef<'h4'>) {
  return (
    <h4 id={id} className={HEADING_4}>
      {children}
    </h4>
  );
}

function Paragraph({ children }: ComponentPropsWithoutRef<'p'>) {
  return <p className={PARAGRAPH}>{children}</p>;
}

function List({ children }: ComponentPropsWithoutRef<'ul'>) {
  return <ul className={LIST}>{children}</ul>;
}

function OrderedList({ start, children }: ComponentPropsWithoutRef<'ol'>) {
  return (
    <ol start={start} className={ORDERED_LIST}>
      {children}
    </ol>
  );
}

function ListItem({ children }: ComponentPropsWithoutRef<'li'>) {
  return <li className={LIST_ITEM}>{children}</li>;
}

function Quote({ children }: ComponentPropsWithoutRef<'blockquote'>) {
  return <blockquote className={QUOTE}>{children}</blockquote>;
}

function Code({ className, children }: ComponentPropsWithoutRef<'code'>) {
  return <code className={className ? `${CODE} ${className}` : CODE}>{children}</code>;
}

// A wide code block scrolls sideways; tabIndex lets a keyboard reach and scroll it.
function Pre({ children }: ComponentPropsWithoutRef<'pre'>) {
  return (
    <pre tabIndex={0} className={PRE}>
      {children}
    </pre>
  );
}

function Rule() {
  return <hr className={RULE} />;
}

// Lazy: React's server renderer preloads every eager img it serializes. Markdown gives no size, so none is set.
function Image({ src, alt = '', title, width, height }: ComponentPropsWithoutRef<'img'>) {
  return (
    <img
      src={src}
      alt={alt}
      title={title}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      className={IMAGE}
    />
  );
}

function Strong({ children }: ComponentPropsWithoutRef<'strong'>) {
  return <strong className="font-semibold">{children}</strong>;
}

function Emphasis({ children }: ComponentPropsWithoutRef<'em'>) {
  return <em className="italic">{children}</em>;
}

/**
 * Styled post elements for `<Content components={mdxComponents({ LinkComponent: Link })} />`, the same with and
 * without Tailwind's preflight. h2 and h3 keep their ids (the table of contents links to them). A link to a path on
 * this site renders through `LinkComponent` (default: a plain `a`); any other link is a plain `a`.
 */
export function mdxComponents(options: { LinkComponent?: LinkComponent } = {}): MdxComponents {
  const Link = options.LinkComponent ?? PlainLink;
  function Anchor({ href = '', children }: ComponentPropsWithoutRef<'a'>) {
    if (/^\/(?![/\\])/.test(href)) {
      return (
        <Link href={href} className={LINK}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} className={LINK} rel={href.startsWith('#') ? undefined : 'noopener noreferrer'}>
        {children}
      </a>
    );
  }
  return {
    h2: Heading2,
    h3: Heading3,
    h4: Heading4,
    p: Paragraph,
    a: Anchor,
    ul: List,
    ol: OrderedList,
    li: ListItem,
    blockquote: Quote,
    code: Code,
    pre: Pre,
    hr: Rule,
    img: Image,
    strong: Strong,
    em: Emphasis,
  };
}
