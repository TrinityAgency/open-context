import type { Locale } from '@/content/locale';
import { CONTACT, HOME, UI } from '@/content/site';

// The home page: <main id="main"> (the skip link's target) with one h1. The section ids are the targets of NAV in
// src/content/site.ts.
export function HomePage({ locale }: { locale: Locale }) {
  const { title, lead, services, about, contact } = HOME[locale];
  const ui = UI[locale];
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <section className="mx-auto max-w-5xl px-6 py-20">
        <h1 className="m-0 font-oc-heading text-4xl font-semibold">{title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-oc-ink-muted">{lead}</p>
      </section>

      <section id="services" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="m-0 font-oc-heading text-2xl font-semibold">{services.title}</h2>
        <ul className="m-0 mt-6 grid list-none gap-6 p-0 sm:grid-cols-3">
          {services.items.map((item) => (
            <li key={item.title} className="border border-oc-line p-6">
              <h3 className="m-0 font-oc-heading text-lg font-semibold">{item.title}</h3>
              <p className="mb-0 mt-2 text-oc-ink-muted">{item.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="about" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="m-0 font-oc-heading text-2xl font-semibold">{about.title}</h2>
        <p className="mt-4 max-w-2xl text-oc-ink-muted">{about.text}</p>
      </section>

      <section id="contact" className="mx-auto max-w-5xl px-6 py-12">
        <h2 className="m-0 font-oc-heading text-2xl font-semibold">{contact.title}</h2>
        <p className="mt-4 text-oc-ink-muted">{contact.text}</p>
        <p>
          {ui.phone}: <a className="text-oc-ink" href={CONTACT.phoneHref}>{CONTACT.phoneDisplay}</a>
          <br />
          {ui.email}: <a className="text-oc-ink" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        </p>
      </section>
    </main>
  );
}
