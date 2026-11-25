import type { ReactNode } from 'react';

export type AccordionItem = {
  /** Becomes the details element's id, so `#<id>` links straight to the item. */
  id: string;
  title: ReactNode;
  content: ReactNode;
};

type AccordionBaseProps = {
  items: AccordionItem[];
  /** Ids of the items open on first render. */
  defaultOpen?: string[];
  className?: string;
};

export type AccordionProps = AccordionBaseProps &
  (
    | { exclusive?: false }
    /** Only one item open at a time: every details shares `name` (unique per page). */
    | { exclusive: true; name: string }
  );

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const LINE = 'border-[var(--oc-line,oklch(92.2%_0_none))]';
const ROOT = `border-t ${LINE} wrap-break-word`;
const SUMMARY =
  'flex cursor-pointer list-none items-center justify-between gap-4 rounded-[var(--oc-radius,0.25rem)] py-4 font-medium text-[var(--oc-ink,oklch(20.5%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))] [&::-webkit-details-marker]:hidden';

/**
 * A disclosure list on native details/summary: keyboard complete with no JavaScript. Server component. Colours and
 * corners come from the design tokens; a word wider than the list breaks.
 */
export function Accordion(props: AccordionProps) {
  const { items, defaultOpen = [], className } = props;
  const name = props.exclusive ? props.name : undefined;
  return (
    <div className={className ? `${ROOT} ${className}` : ROOT}>
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          name={name}
          open={defaultOpen.includes(item.id)}
          className={`group border-b ${LINE}`}
        >
          <summary className={SUMMARY}>
            {/* min-w-0: a long title shrinks beside the chevron and its words break */}
            <span className="min-w-0">{item.title}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-4 w-4 shrink-0 text-[var(--oc-ink-subtle,oklch(55.6%_0_none))] group-open:rotate-180 motion-safe:transition-transform"
            >
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="pb-4 text-[var(--oc-ink-body,oklch(37.1%_0_none))]">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
