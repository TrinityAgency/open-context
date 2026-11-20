import Link from 'next/link';
import type { Locale } from '@/content/locale';
import { NAV, NOT_FOUND, UI } from '@/content/site';

// The page for an address that does not exist: <main id="main"> with one h1, a way home and the main navigation.
export function NotFoundView({ locale }: { locale: Locale }) {
  const { title, text } = NOT_FOUND[locale];
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-3xl px-6 py-16 outline-none">
      <h1 className="m-0 font-oc-heading text-3xl font-semibold">{title}</h1>
      <p className="mt-4">{text}</p>
      <ul>
        <li>
          <Link className="text-oc-ink" href="/">
            {UI[locale].home}
          </Link>
        </li>
        {NAV[locale].map((item) => (
          <li key={item.href}>
            <Link className="text-oc-ink" href={item.href}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
