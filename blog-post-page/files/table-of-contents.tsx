import { useId } from 'react';
import type { Heading } from './_parts/blog-content/mdx';

export type TableOfContentsProps = {
  /** The post's h2 and h3 headings, in order (getPost's `headings`). */
  headings: Heading[];
  /** The visible title, which also names the navigation. */
  label: string;
};

type Entry = { heading: Heading; children: Heading[] };

const LINK =
  'text-[var(--oc-ink-body,oklch(37.1%_0_none))] no-underline hover:text-[var(--oc-ink,oklch(20.5%_0_none))] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/** Each h3 goes under the h2 before it; an h3 before any h2 stays at the top level. */
function nest(headings: Heading[]): Entry[] {
  const entries: Entry[] = [];
  for (const heading of headings) {
    const parent = entries.at(-1);
    if (heading.depth === 3 && parent && parent.heading.depth === 2) parent.children.push(heading);
    else entries.push({ heading, children: [] });
  }
  return entries;
}

/**
 * The post's headings as in-page links. Renders nothing for fewer than two headings. Server component. Each list is
 * one minmax(0, 1fr) column and the text breaks a word wider than it, so a long heading stays inside the aside.
 */
export function TableOfContents({ headings, label }: TableOfContentsProps) {
  const titleId = useId();
  if (headings.length < 2) return null;
  return (
    <nav aria-labelledby={titleId} className="min-w-0 font-[family-name:var(--oc-font-body)] wrap-break-word">
      <p id={titleId} className="m-0 text-sm font-semibold text-[var(--oc-ink,oklch(20.5%_0_none))]">
        {label}
      </p>
      <ol className="m-0 mt-3 grid list-none grid-cols-1 gap-2 p-0 text-sm leading-snug">
        {nest(headings).map(({ heading, children }) => (
          <li key={heading.id} className="m-0 p-0">
            <a href={`#${heading.id}`} className={LINK}>
              {heading.text}
            </a>
            {children.length ? (
              <ol className="m-0 mt-2 grid list-none grid-cols-1 gap-2 p-0 pl-4">
                {children.map((child) => (
                  <li key={child.id} className="m-0 p-0">
                    <a href={`#${child.id}`} className={LINK}>
                      {child.text}
                    </a>
                  </li>
                ))}
              </ol>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
