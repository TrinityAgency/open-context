import { useId } from 'react';
import { SHARE_LABELS, type ShareLabels } from './labels';
import { ShareActions } from './share-actions';
import { SHARE_NETWORKS, shareHref, type ShareNetwork } from './share-targets';

export type ShareButtonsProps = {
  /** The page's absolute address (`https://…`). */
  url: string;
  title: string;
  /** Which networks, in which order. Default: all six (`SHARE_NETWORKS`). */
  networks?: ShareNetwork[];
  labels?: Partial<ShareLabels>;
  className?: string;
};

// The colours, radius and font are the token contract's (design-tokens), each with its default, so the links without
// a design system draw what 2.0.0 drew. A link grows in height for a label wider than itself and breaks only between
// words; its list item may shrink to the row.
const LINK =
  'box-border inline-flex min-h-9 max-w-full items-center rounded-[calc(var(--oc-radius,0.25rem)*1.5)] border border-solid border-[var(--oc-line-strong,oklch(87%_0_none))] bg-[var(--oc-surface,#fff)] px-3 py-1.5 font-[family-name:var(--oc-font-body)] text-sm font-medium wrap-break-word text-[var(--oc-ink,oklch(20.5%_0_none))] hover:border-[var(--oc-ink,oklch(20.5%_0_none))] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--oc-focus,oklch(20.5%_0_none))] no-underline';

/**
 * Share links as plain links (no third-party script, nothing loaded from a network on your page), then native share
 * and copy link where the browser has them. Renders on the server; the two buttons are the client island.
 */
export function ShareButtons({ url, title, networks = SHARE_NETWORKS, labels, className }: ShareButtonsProps) {
  const text = { ...SHARE_LABELS, ...labels };
  const titleId = useId();
  const page = { url, title };
  return (
    <div role="group" aria-labelledby={titleId} className={['min-w-0 wrap-break-word', className].filter(Boolean).join(' ')}>
      <p id={titleId} className="m-0 font-[family-name:var(--oc-font-body)] text-sm font-semibold text-[var(--oc-ink,oklch(20.5%_0_none))]">
        {text.title}
      </p>
      <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
        {networks.map((network) => (
          <li key={network} className="m-0 min-w-0 max-w-full p-0">
            {network === 'email' ? (
              <a href={shareHref(network, page)} className={LINK}>
                {text.networks[network]}
              </a>
            ) : (
              <a href={shareHref(network, page)} target="_blank" rel="noopener noreferrer" className={LINK}>
                {text.networks[network]}{' '}
                <span className="sr-only">{text.newTab}</span>
              </a>
            )}
          </li>
        ))}
      </ul>
      <ShareActions url={url} title={title} labels={text} />
    </div>
  );
}
