import Link from 'next/link';
import { NAV, NOT_FOUND } from '@/content/site';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="m-0 text-3xl font-semibold">{NOT_FOUND.title}</h1>
      <p className="mt-4">{NOT_FOUND.text}</p>
      <ul>
        <li>
          <Link href="/">Startseite</Link>
        </li>
        {NAV.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
