'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_HEADER_LABELS_DE } from '@/components/site-header/labels.de';
import { SITE_HEADER_LABELS } from '@/components/site-header/labels';
import { SiteHeader, type SiteHeaderProps } from '@/components/site-header/site-header';
import type { ImageComponent } from '@/components/site-header/site-types';
import { LOCALE } from '@/content/locale';

const NextImage: ImageComponent = ({ alt, ...props }) => <Image alt={alt} {...props} />;

const LABELS = { en: SITE_HEADER_LABELS, de: SITE_HEADER_LABELS_DE }[LOCALE];

/**
 * The site header with the current path, Next's Link and Image and the labels of LOCALE (the client wrapper from
 * src/components/site-header/README.md). A server layout cannot hand functions to a client component, so this
 * wrapper brings them itself and the layout passes only data.
 */
export function Header(props: Omit<SiteHeaderProps, 'currentPath' | 'labels' | 'LinkComponent' | 'ImageComponent'>) {
  return <SiteHeader {...props} currentPath={usePathname()} labels={LABELS} LinkComponent={Link} ImageComponent={NextImage} />;
}
