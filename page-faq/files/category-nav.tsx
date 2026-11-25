export type CategoryNavProps = {
  /** The nav's accessible name, e.g. "Topics". */
  label: string;
  /** The categories in page order: each link jumps to the section whose `id` is the category's. */
  categories: { id: string; title: string }[];
  className?: string;
};

// Design tokens (Open Context token contract v1): each reads the project's design system once its stylesheet is
// loaded, and falls back to the kit's neutral look when none is.
const ROOT = 'box-border px-6 text-[var(--oc-ink,oklch(20.5%_0_none))] wrap-break-word';
const LINK =
  'rounded-[var(--oc-radius,0.25rem)] text-base font-medium text-[var(--oc-ink,oklch(20.5%_0_none))] underline underline-offset-4 hover:text-[var(--oc-ink-muted,oklch(43.9%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))]';

/**
 * The page's topics as a list of links, each to its section further down (`#<id>`). Server component. With fewer
 * than two categories there is nothing to jump between, and it draws nothing.
 */
export function CategoryNav({ label, categories, className }: CategoryNavProps) {
  if (categories.length < 2) return null;
  return (
    <nav aria-label={label} className={className ? `${ROOT} ${className}` : ROOT}>
      <div className="mx-auto max-w-5xl">
        <ul className="m-0 flex list-none flex-wrap justify-center gap-x-6 gap-y-3 p-0">
          {categories.map((category) => (
            <li key={category.id} className="min-w-0 max-w-full">
              <a href={`#${category.id}`} className={LINK}>
                {category.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
