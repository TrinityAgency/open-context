// The home page's text, in English and German: the sections of src/components/home-page.tsx, top to bottom.
// Sample content: replace it with your own and keep the shapes. The studio is named through SITE (src/content/site.ts);
// the projects themselves are files in content/work/ (AGENTS.md, "Writing a project").
import type { CtaContent } from '@/components/section-cta/cta-section';
import type { HeroContent } from '@/components/section-hero/hero-section';
import type { LogoCloudContent } from '@/components/section-logo-cloud/logo-cloud-section';
import type { TestimonialsContent } from '@/components/section-testimonials/testimonials-section';
import type { Locale } from './locale';
import { CONTACT, SITE } from './site';

export type HomeContent = {
  /** The page's title and description for search and sharing. */
  meta: { title: string; description: string };
  hero: HeroContent;
  /** The three newest projects: the heading over them and the link to the work under them. */
  work: { title: string; allWork: string };
  logos: LogoCloudContent;
  testimonials: TestimonialsContent;
  cta: CtaContent;
};

// Sample pictures as inline SVG, so nothing loads from another host. Replace them with your own files under public/.
// Greys are black at an opacity: no colour literal anywhere under src/ (design-sync's guards, run by pnpm test).
const g = (opacity: number) => `fill="black" fill-opacity="${opacity}"`;
const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`);

const PICTURE = svg('0 0 640 480', `<rect width="640" height="480" ${g(0.1)}/><rect x="120" y="120" width="250" height="250" rx="8" ${g(0.36)}/><circle cx="430" cy="300" r="90" ${g(0.55)}/>`);

const portrait = (opacity: number) =>
  svg('0 0 80 80', `<rect width="80" height="80" ${g(opacity)}/><circle cx="40" cy="32" r="14" fill="white"/><path d="M14 80c4-18 48-18 52 0z" fill="white"/>`);

// Invented logos (shapes only); a logo's name is its accessible name when its alt is empty.
const LOGOS: LogoCloudContent['logos'] = [
  ['Northfield Sample', `<circle cx="16" cy="16" r="12" ${g(0.68)}/><rect x="36" y="10" width="76" height="12" rx="6" ${g(0.36)}/>`],
  ['Example Builders', `<rect x="4" y="4" width="24" height="24" rx="4" ${g(0.75)}/><rect x="36" y="12" width="64" height="8" ${g(0.55)}/>`],
  ['Placeholder & Co.', `<path d="M4 28L16 4l12 24z" ${g(0.68)}/><rect x="36" y="9" width="80" height="14" rx="2" ${g(0.36)}/>`],
  ['Demo Studio', `<rect x="4" y="8" width="112" height="16" rx="8" ${g(0.55)}/>`],
  ['Sample Labs', `<circle cx="12" cy="16" r="8" ${g(0.75)}/><circle cx="32" cy="16" r="8" ${g(0.55)}/><rect x="48" y="12" width="64" height="8" ${g(0.36)}/>`],
  ['Fictional Freight', `<rect x="4" y="4" width="40" height="24" ${g(0.68)}/><rect x="52" y="4" width="64" height="24" ${g(0.17)}/>`],
].map(([name = '', shape = '']) => ({ name, image: { src: svg('0 0 120 32', shape), alt: '', width: 120, height: 32 } }));

const MAIL = `mailto:${CONTACT.email}`;

export const HOME: Record<Locale, HomeContent> = {
  en: {
    meta: {
      title: 'Careful work, start to finish',
      description: SITE.description,
    },
    hero: {
      eyebrow: SITE.name,
      title: 'Careful work, from the first sketch to the finished piece',
      lead: 'A small studio. We plan, design and build with you, and look after what we made long after the launch.',
      ctas: [
        { href: '/work', label: 'See the work', variant: 'primary' },
        { href: '/contact', label: 'Get in touch', variant: 'secondary' },
      ],
      image: { src: PICTURE, alt: 'A grey square and a darker circle on a light background', width: 640, height: 480 },
    },
    work: { title: 'Selected work', allWork: 'All work' },
    logos: { title: 'Clients we have worked with', logos: LOGOS },
    testimonials: {
      title: 'What clients say',
      items: [
        {
          quote: 'They kept to the plan and to the budget, and told us early when something changed.',
          name: 'Alex Sample',
          role: 'Operations lead, Example Builders',
          image: { src: portrait(0.55), alt: '', width: 80, height: 80 },
        },
        {
          quote: 'One person to call for everything. That alone saved us weeks.',
          name: 'Jordan Placeholder',
          role: 'Owner, Demo Studio',
          image: { src: portrait(0.68), alt: '', width: 80, height: 80 },
        },
        { quote: 'The written plan made the decision easy.', name: 'Sam Example' },
      ],
    },
    cta: {
      title: 'Have something in mind?',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [
        { href: MAIL, label: 'Write to us', variant: 'primary' },
        { href: '/services', label: 'See what we do', variant: 'secondary' },
      ],
    },
  },
  de: {
    meta: {
      title: 'Sorgfältige Arbeit, von Anfang bis Ende',
      description: 'Ein kleines Studio: Wir planen, gestalten und betreuen Arbeiten für Kundinnen und Kunden, denen Sorgfalt wichtig ist.',
    },
    hero: {
      eyebrow: SITE.name,
      title: 'Sorgfältige Arbeit – von der ersten Skizze bis zum fertigen Stück',
      lead: 'Ein kleines Studio. Wir planen, gestalten und bauen mit Ihnen und betreuen, was wir gemacht haben, auch lange nach dem Start.',
      ctas: [
        { href: '/work', label: 'Arbeiten ansehen', variant: 'primary' },
        { href: '/contact', label: 'Kontakt aufnehmen', variant: 'secondary' },
      ],
      image: { src: PICTURE, alt: 'Ein graues Quadrat und ein dunklerer Kreis auf hellem Grund', width: 640, height: 480 },
    },
    work: { title: 'Ausgewählte Arbeiten', allWork: 'Alle Arbeiten' },
    logos: { title: 'Kundinnen und Kunden, mit denen wir gearbeitet haben', logos: LOGOS },
    testimonials: {
      title: 'Was Kundinnen und Kunden sagen',
      items: [
        {
          quote: 'Sie haben Plan und Budget gehalten und uns früh gesagt, wenn sich etwas änderte.',
          name: 'Alex Beispiel',
          role: 'Leitung Betrieb, Example Builders',
          image: { src: portrait(0.55), alt: '', width: 80, height: 80 },
        },
        {
          quote: 'Eine Person für alles. Allein das hat uns Wochen gespart.',
          name: 'Jordan Platzhalter',
          role: 'Inhaber, Demo Studio',
          image: { src: portrait(0.68), alt: '', width: 80, height: 80 },
        },
        { quote: 'Der schriftliche Plan hat die Entscheidung leicht gemacht.', name: 'Sam Muster' },
      ],
    },
    cta: {
      title: 'Haben Sie etwas vor?',
      text: 'Erzählen Sie uns, was Sie planen. Wir antworten innerhalb eines Werktags.',
      ctas: [
        { href: MAIL, label: 'Schreiben Sie uns', variant: 'primary' },
        { href: '/services', label: 'Unsere Leistungen', variant: 'secondary' },
      ],
    },
  },
};
