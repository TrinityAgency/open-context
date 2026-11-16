import type { Metadata } from 'next';
import { HomePage } from '@/components/HomePage';
import { LOCALE } from '@/content/locale';
import { HOME } from '@/content/site';

export const metadata: Metadata = {
  title: HOME[LOCALE].metaTitle,
  description: HOME[LOCALE].lead,
};

export default function Home() {
  return <HomePage locale={LOCALE} />;
}
