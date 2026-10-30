import type { Metadata } from 'next';
import { CONTACT, HOME } from '@/content/site';

export const metadata: Metadata = {
  title: HOME.metaTitle,
  description: HOME.lead,
};

// The section ids are the targets of NAV in src/content/site.ts.
export default function Home() {
  const { title, lead, services, about, contact } = HOME;
  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="m-0 text-4xl font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-neutral-600">{lead}</p>
      </section>

      <section id="leistungen" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="m-0 text-2xl font-semibold">{services.title}</h2>
        <ul className="m-0 mt-6 grid list-none gap-6 p-0 sm:grid-cols-3">
          {services.items.map((item) => (
            <li key={item.title} className="border border-neutral-200 p-6">
              <h3 className="m-0 text-lg font-semibold">{item.title}</h3>
              <p className="mb-0 mt-2 text-neutral-600">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="ueber-uns" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="m-0 text-2xl font-semibold">{about.title}</h2>
        <p className="mt-4 max-w-2xl text-neutral-600">{about.text}</p>
      </section>

      <section id="kontakt" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="m-0 text-2xl font-semibold">{contact.title}</h2>
        <p className="mt-4 text-neutral-600">{contact.text}</p>
        <p>
          Telefon: <a href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
          <br />
          E-Mail: <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </section>
    </>
  );
}
