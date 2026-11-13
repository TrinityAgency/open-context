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

/** A disclosure list on native details/summary: keyboard complete with no JavaScript. Server component. */
export function Accordion(props: AccordionProps) {
  const { items, defaultOpen = [], className } = props;
  const name = props.exclusive ? props.name : undefined;
  return (
    <div className={className ? `border-t border-neutral-200 ${className}` : 'border-t border-neutral-200'}>
      {items.map((item) => (
        <details
          key={item.id}
          id={item.id}
          name={name}
          open={defaultOpen.includes(item.id)}
          className="group border-b border-neutral-200"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-sm py-4 font-medium text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 [&::-webkit-details-marker]:hidden">
            <span>{item.title}</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="h-4 w-4 shrink-0 text-neutral-500 group-open:rotate-180 motion-safe:transition-transform"
            >
              <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <div className="pb-4 text-neutral-700">{item.content}</div>
        </details>
      ))}
    </div>
  );
}
