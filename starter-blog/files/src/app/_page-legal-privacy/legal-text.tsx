import { splitPlaceholders } from './placeholders';

export type LegalTextProps = {
  /** Paragraphs separated by blank lines; `[[…]]` marks a placeholder. */
  text: string;
  /** Read by screen readers before each placeholder, e.g. "Placeholder:". */
  placeholderLabel: string;
};

/**
 * A legal text: one paragraph per block between blank lines, every `[[…]]` placeholder shown as a highlighted `mark`
 * and announced as one. Server component.
 */
export function LegalText({ text, placeholderLabel }: LegalTextProps) {
  const paragraphs = text.split(/\r?\n[ \t]*\r?\n/).filter((p) => p.trim() !== '');
  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="m-0 mt-4 text-[var(--oc-ink-body,oklch(37.1%_0_none))] first:mt-0">
          {splitPlaceholders(paragraph).map((part, j) =>
            'placeholder' in part ? (
              <span key={j}>
                <span className="sr-only">{`${placeholderLabel} `}</span>
                <mark data-placeholder className="rounded-[var(--oc-radius,0.25rem)] bg-[var(--oc-line,oklch(92.2%_0_none))] px-1 text-[var(--oc-ink,oklch(20.5%_0_none))]">
                  {part.placeholder}
                </mark>
              </span>
            ) : (
              part.text
            ),
          )}
        </p>
      ))}
    </>
  );
}
