import type { Metadata } from 'next';
import { WorkIndex } from '@/components/work/work-index';
import { blogMetadata } from '@/content/blog';
import { LOCALE } from '@/content/locale';
import { WORK_TEXT, workPaths } from '@/content/work';

export const metadata: Metadata = blogMetadata({ path: workPaths.index(), ...WORK_TEXT[LOCALE].index.meta });

// Every project, newest first. Its view: src/components/work/work-index.tsx.
export default function Work() {
  return <WorkIndex locale={LOCALE} />;
}
