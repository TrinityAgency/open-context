// The home page's text, in English and German: the eight sections of src/components/home-page.tsx, top to bottom.
// Sample content: replace it with your own and keep the shapes. The company is named through SITE (src/content/site.ts).
import type { CtaContent } from '@/components/section-cta/cta-section';
import type { FaqContent } from '@/components/section-faq/faq-section';
import type { FeaturesContent } from '@/components/section-features/features-section';
import type { HeroContent } from '@/components/section-hero/hero-section';
import type { LogoCloudContent } from '@/components/section-logo-cloud/logo-cloud-section';
import type { PricingContent } from '@/components/section-pricing/pricing-section';
import type { PricingPlan } from '@/components/section-pricing/site-types';
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
  pricing: PricingContent;
  faq: FaqContent;
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

type PlanText = { name: string; description: string; features: string[]; cta: string };

/** The same plans in both languages: prices in minor units (cents), a currency, an interval. */
const plans = (currency: string, text: Record<'starter' | 'team' | 'business' | 'setup', PlanText>, yearNote: string): PricingPlan[] => {
  const plan = (id: string, key: keyof typeof text, interval: PricingPlan['interval'], priceMinor: number, extra: Partial<PricingPlan> = {}): PricingPlan => ({
    id,
    name: text[key].name,
    description: text[key].description,
    priceMinor,
    currency,
    interval,
    features: text[key].features,
    cta: { href: '#contact', label: text[key].cta, variant: 'secondary' },
    ...extra,
  });
  const primary = (label: string) => ({ href: '#contact', label, variant: 'primary' as const });
  return [
    plan('starter-month', 'starter', 'month', 0),
    plan('team-month', 'team', 'month', 2900, { highlighted: true, cta: primary(text.team.cta) }),
    plan('business-month', 'business', 'month', 7950),
    plan('starter-year', 'starter', 'year', 0),
    plan('team-year', 'team', 'year', 29000, { highlighted: true, cta: primary(text.team.cta), description: yearNote }),
    plan('business-year', 'business', 'year', 79500, { description: yearNote }),
    plan('setup', 'setup', 'once', 49000),
  ];
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
        { href: '#contact', label: 'Book a call', variant: 'primary' },
        { href: '#pricing', label: 'See the prices', variant: 'secondary' },
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
      intro: 'What twelve years of planning and building add up to.',
      items: [
        { value: '12', label: 'years in business' },
        { value: '340+', label: 'projects finished', description: 'from one-room refits to whole buildings' },
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
    pricing: {
      title: 'Plans and prices',
      intro: 'Start free. Change or cancel any month.',
      plans: plans(
        'USD',
        {
          starter: { name: 'Starter', description: 'For a first small project.', features: ['One project', 'Email answers within two days'], cta: 'Start free' },
          team: { name: 'Team', description: 'For a team that plans ahead.', features: ['Five projects', 'Answers within a day', 'Shared plans'], cta: 'Choose Team' },
          business: { name: 'Business', description: 'For several teams.', features: ['Unlimited projects', 'A named contact person', 'Phone support'], cta: 'Choose Business' },
          setup: { name: 'Setup package', description: 'We set everything up with you, once.', features: ['Two workshops', 'Your plans imported'], cta: 'Book the setup' },
        },
        'Two months free.',
      ),
    },
    faq: {
      title: 'Questions, answered',
      intro: 'What people ask us before a first call.',
      items: [
        {
          question: 'How long does a typical project take?',
          answer: 'Most projects take six to ten weeks from the first call to the handover.\n\nWe agree the dates in writing before work starts.',
        },
        { question: `Do you work outside ${CONTACT.address.city}?`, answer: 'Yes, within about 100 km. Further away, ask us.' },
        { question: 'What does the first call cost?', answer: 'Nothing. It takes about thirty minutes.' },
      ],
    },
    cta: {
      title: 'Ready when you are',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [
        { href: MAIL, label: 'Write to us', variant: 'primary' },
        { href: '#faq', label: 'Read the questions first', variant: 'secondary' },
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
        { href: '#contact', label: 'Gespräch vereinbaren', variant: 'primary' },
        { href: '#pricing', label: 'Preise ansehen', variant: 'secondary' },
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
      intro: 'Was zwölf Jahre Planen und Bauen ergeben.',
      items: [
        { value: '12', label: 'Jahre am Markt' },
        { value: '340+', label: 'abgeschlossene Projekte', description: 'vom Einzelraum bis zum ganzen Gebäude' },
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
    pricing: {
      title: 'Pakete und Preise',
      intro: 'Kostenlos starten. Jeden Monat wechseln oder kündigen.',
      plans: plans(
        'EUR',
        {
          starter: { name: 'Starter', description: 'Für ein erstes kleines Projekt.', features: ['Ein Projekt', 'Antwort per E-Mail innerhalb von zwei Tagen'], cta: 'Kostenlos starten' },
          team: { name: 'Team', description: 'Für ein Team, das vorausplant.', features: ['Fünf Projekte', 'Antwort innerhalb eines Tages', 'Gemeinsame Pläne'], cta: 'Team wählen' },
          business: { name: 'Business', description: 'Für mehrere Teams.', features: ['Unbegrenzte Projekte', 'Eine feste Ansprechperson', 'Telefonischer Support'], cta: 'Business wählen' },
          setup: { name: 'Einrichtungspaket', description: 'Wir richten alles einmal mit Ihnen ein.', features: ['Zwei Workshops', 'Ihre Pläne übernommen'], cta: 'Einrichtung buchen' },
        },
        'Zwei Monate geschenkt.',
      ),
    },
    faq: {
      title: 'Häufige Fragen',
      intro: 'Was man uns vor einem ersten Gespräch fragt.',
      items: [
        {
          question: 'Wie lange dauert ein typisches Projekt?',
          answer: 'Die meisten Projekte dauern sechs bis zehn Wochen vom ersten Gespräch bis zur Übergabe.\n\nDie Termine vereinbaren wir schriftlich, bevor die Arbeit beginnt.',
        },
        { question: `Arbeiten Sie auch außerhalb von ${CONTACT.address.city}?`, answer: 'Ja, im Umkreis von etwa 100 km. Weiter weg: fragen Sie uns.' },
        { question: 'Was kostet das erste Gespräch?', answer: 'Nichts. Es dauert etwa dreißig Minuten.' },
      ],
    },
    cta: {
      title: 'Bereit, wenn Sie es sind',
      text: 'Erzählen Sie uns, was Sie vorhaben. Wir antworten innerhalb eines Werktags.',
      ctas: [
        { href: MAIL, label: 'Schreiben Sie uns', variant: 'primary' },
        { href: '#faq', label: 'Erst die Fragen lesen', variant: 'secondary' },
      ],
    },
  },
};
