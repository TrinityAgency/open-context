// The home page's text, in English and German: the sections of src/components/home-page.tsx, top to bottom.
// Sample content: replace it with your own and keep the shapes. The company is named through SITE (src/content/site.ts).
// Prices and questions are on the pricing page (src/content/pages.ts).
import type { CtaContent } from '@/components/section-cta/cta-section';
import type { FeaturesContent } from '@/components/section-features/features-section';
import type { HeroContent } from '@/components/section-hero/hero-section';
import type { LogoCloudContent } from '@/components/section-logo-cloud/logo-cloud-section';
import type { StatsContent } from '@/components/section-stats/stats-section';
import type { TestimonialsContent } from '@/components/section-testimonials/testimonials-section';
import type { Locale } from './locale';
import { CONTACT, SITE } from './site';

export type HomeContent = {
  /** The page's title and description for search and sharing. */
  meta: { title: string; description: string };
  hero: HeroContent;
  logos: LogoCloudContent;
  features: FeaturesContent;
  stats: StatsContent;
  testimonials: TestimonialsContent;
  /** The three newest posts: the heading over them and the link to the blog under them. */
  latest: { title: string; allPosts: string };
  cta: CtaContent;
};

// Sample pictures as inline SVG, so nothing loads from another host. Replace them with your own files under public/.
// Greys are black at an opacity: no colour literal outside src/design/ (src/design/no-hardcoded-colour.test.ts).
const g = (opacity: number) => `fill="black" fill-opacity="${opacity}"`;
const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`);

const PICTURE = svg('0 0 640 480', `<rect width="640" height="480" ${g(0.1)}/><circle cx="320" cy="240" r="120" ${g(0.36)}/>`);

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

/** Feature icons: the `d` of one SVG path in a 24-unit box. */
const ICON = {
  plan: 'M4 6h16M4 12h16M4 18h10',
  check: 'M5 12.5l4.5 4.5L19 7',
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
};

const MAIL = `mailto:${CONTACT.email}`;

export const HOME: Record<Locale, HomeContent> = {
  en: {
    meta: {
      title: 'Plans that hold',
      description: SITE.description,
    },
    hero: {
      eyebrow: SITE.name,
      title: 'Plans that hold, from the first sketch to the finished work',
      lead: 'We plan, build and look after what you need, with one team and one point of contact from start to finish.',
      ctas: [
        { href: '/contact', label: 'Book a call', variant: 'primary' },
        { href: '/pricing', label: 'See the prices', variant: 'secondary' },
      ],
      image: { src: PICTURE, alt: 'A grey circle on a light background', width: 640, height: 480 },
    },
    logos: { title: 'Trusted by teams who plan ahead', logos: LOGOS },
    features: {
      title: 'What you get',
      intro: 'Three things every project with us includes, whatever its size.',
      items: [
        { title: 'A plan that holds', description: 'We agree scope, budget and dates before work starts.', icon: ICON.plan },
        { title: 'Work you can check', description: 'Every step is written down and shown to you.', icon: ICON.check },
        { title: 'Answers within a day', description: 'One contact person who knows your project.', icon: ICON.clock },
      ],
    },
    stats: {
      title: `${SITE.name} in figures`,
      intro: 'What twelve years of careful work add up to.',
      items: [
        { value: '12', label: 'years in business' },
        { value: '340+', label: 'projects finished', description: 'from a single team to a whole company' },
        { value: '98%', label: 'on time', description: 'handed over on or before the agreed date' },
        { value: '1', label: 'contact person per project' },
      ],
    },
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
    latest: { title: 'From the blog', allPosts: 'All posts' },
    cta: {
      title: 'Ready when you are',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [
        { href: MAIL, label: 'Write to us', variant: 'primary' },
        { href: '/pricing#faq', label: 'Read the questions first', variant: 'secondary' },
      ],
    },
  },
  de: {
    meta: {
      title: 'Pläne, die halten',
      description: 'Wir planen, bauen und betreuen, was Sie brauchen – mit einem Team und einer Ansprechperson.',
    },
    hero: {
      eyebrow: SITE.name,
      title: 'Pläne, die halten – von der ersten Skizze bis zum fertigen Werk',
      lead: 'Wir planen, bauen und betreuen, was Sie brauchen – mit einem Team und einer Ansprechperson vom Anfang bis zum Ende.',
      ctas: [
        { href: '/contact', label: 'Gespräch vereinbaren', variant: 'primary' },
        { href: '/pricing', label: 'Preise ansehen', variant: 'secondary' },
      ],
      image: { src: PICTURE, alt: 'Ein grauer Kreis auf hellem Grund', width: 640, height: 480 },
    },
    logos: { title: 'Teams, die vorausplanen, vertrauen uns', logos: LOGOS },
    features: {
      title: 'Was Sie bekommen',
      intro: 'Drei Dinge, die jedes Projekt bei uns enthält, ganz gleich wie groß.',
      items: [
        { title: 'Ein Plan, der hält', description: 'Umfang, Budget und Termine stehen fest, bevor die Arbeit beginnt.', icon: ICON.plan },
        { title: 'Arbeit, die Sie prüfen können', description: 'Jeder Schritt wird festgehalten und Ihnen gezeigt.', icon: ICON.check },
        { title: 'Antwort innerhalb eines Tages', description: 'Eine Ansprechperson, die Ihr Projekt kennt.', icon: ICON.clock },
      ],
    },
    stats: {
      title: `${SITE.name} in Zahlen`,
      intro: 'Was zwölf Jahre sorgfältige Arbeit ergeben.',
      items: [
        { value: '12', label: 'Jahre am Markt' },
        { value: '340+', label: 'abgeschlossene Projekte', description: 'vom einzelnen Team bis zur ganzen Firma' },
        { value: '98 %', label: 'pünktlich', description: 'am oder vor dem vereinbarten Termin übergeben' },
        { value: '1', label: 'Ansprechperson pro Projekt' },
      ],
    },
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
    latest: { title: 'Aus dem Blog', allPosts: 'Alle Beiträge' },
    cta: {
      title: 'Bereit, wenn Sie es sind',
      text: 'Erzählen Sie uns, was Sie vorhaben. Wir antworten innerhalb eines Werktags.',
      ctas: [
        { href: MAIL, label: 'Schreiben Sie uns', variant: 'primary' },
        { href: '/pricing#faq', label: 'Erst die Fragen lesen', variant: 'secondary' },
      ],
    },
  },
};
