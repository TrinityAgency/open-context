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

const LINK =
  'box-border inline-flex h-9 items-center rounded-md border border-solid border-neutral-300 bg-white px-3 font-sans text-sm font-medium text-neutral-900 no-underline hover:border-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900';

/**
 * Share links as plain links (no third-party script, nothing loaded from a network on your page), then native share
 * and copy link where the browser has them. Renders on the server; the two buttons are the client island.
 */
export function ShareButtons({ url, title, networks = SHARE_NETWORKS, labels, className }: ShareButtonsProps) {
  const text = { ...SHARE_LABELS, ...labels };
  const titleId = useId();
  const page = { url, title };
  return (
    <div role="group" aria-labelledby={titleId} className={['min-w-0', className].filter(Boolean).join(' ')}>
      <p id={titleId} className="m-0 font-sans text-sm font-semibold text-neutral-900">
        {text.title}
      </p>
      <ul className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
        {networks.map((network) => (
          <li key={network} className="m-0 p-0">
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
