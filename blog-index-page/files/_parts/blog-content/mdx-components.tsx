import type { ComponentProps, ComponentPropsWithoutRef } from 'react';
import type { MdxComponents } from './mdx';
import type { LinkComponent } from './site-types';

function PlainLink(props: ComponentProps<LinkComponent>) {
  return <a {...props} />;
}

// The colours, radius and heading font are the token contract's (design-tokens), each with its default, so a project
// without a design system draws what 1.0.0 drew. Text breaks a word wider than the column (a long compound at 390 px).
const INK = 'text-[var(--oc-ink,oklch(20.5%_0_none))]';
const HEADING_FONT = 'font-[family-name:var(--oc-font-heading)]';
const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';
const HEADING_2 = `m-0 mt-10 mb-4 scroll-mt-24 text-2xl font-bold leading-tight wrap-break-word ${HEADING_FONT} ${INK}`;
const HEADING_3 = `m-0 mt-8 mb-3 scroll-mt-24 text-xl font-semibold leading-snug wrap-break-word ${HEADING_FONT} ${INK}`;
const HEADING_4 = `m-0 mt-6 mb-2 text-lg font-semibold leading-snug wrap-break-word ${HEADING_FONT} ${INK}`;
const PARAGRAPH = 'm-0 mb-4 leading-relaxed wrap-break-word';
const LINK = `${INK} underline underline-offset-2 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] ${FOCUS}`;
const LIST = 'm-0 mb-4 list-disc pl-6 leading-relaxed wrap-break-word';
const ORDERED_LIST = 'm-0 mb-4 list-decimal pl-6 leading-relaxed wrap-break-word';
const LIST_ITEM = 'm-0 mt-1 p-0 pl-1';
const QUOTE = 'm-0 mb-4 box-border border-l-4 border-[var(--oc-line-strong,oklch(87%_0_none))] py-1 pl-4 italic wrap-break-word text-[var(--oc-ink-body,oklch(37.1%_0_none))]';
const CODE = `rounded-[var(--oc-radius,0.25rem)] bg-[var(--oc-surface-sunk,oklch(97%_0_none))] px-1 py-0.5 font-mono text-[0.875em] ${INK}`;
// A code block is an inverse block, no brand mark (R13): the ink ground with surface text, dark in a light theme and
// light in a dark one; its code inherits both.
const PRE = `m-0 mb-4 box-border overflow-x-auto rounded-[calc(var(--oc-radius,0.25rem)*1.5)] bg-[var(--oc-ink,oklch(20.5%_0_none))] p-4 font-mono text-sm leading-relaxed text-[var(--oc-surface,#fff)] [&_code]:rounded-none [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em] [&_code]:text-inherit ${FOCUS}`;
const RULE = 'm-0 my-8 h-px border-0 bg-[var(--oc-line,oklch(92.2%_0_none))]';
const IMAGE = 'm-0 my-6 block h-auto max-w-full rounded-[calc(var(--oc-radius,0.25rem)*1.5)]';

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
 * Styled post elements for `<Content components={mdxComponents({ LinkComponent: Link })} />`, in the project's design
 * tokens, the same with and without Tailwind's preflight. h2 and h3 keep their ids (the table of contents links to them). A link to a path on
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
