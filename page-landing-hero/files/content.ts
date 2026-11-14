// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { CtaContent } from './_sections/cta/cta-section';
import type { FeaturesContent } from './_sections/features/features-section';
import type { HeroContent } from './_sections/hero/hero-section';

/** The page's language: picks the text below. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Samplework Inc. – plans that hold',
    description: 'We plan, build and look after what you need, with one team and one point of contact.',
  },
  de: {
    title: 'Beispielwerk GmbH – Pläne, die halten',
    description: 'Wir planen, bauen und betreuen, was Sie brauchen – mit einem Team und einer Ansprechperson.',
  },
};

export type LandingContent = { hero: HeroContent; features: FeaturesContent; cta: CtaContent };

/** Feature icons: the `d` of one SVG path in a 24-unit box. */
const ICON = {
  plan: 'M4 6h16M4 12h16M4 18h10',
  check: 'M5 12.5l4.5 4.5L19 7',
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
};

export const CONTENT: Record<'en' | 'de', LandingContent> = {
  en: {
    hero: {
      eyebrow: 'Samplework Inc.',
      title: 'Plans that hold, from the first sketch to the finished work',
      lead: 'We plan, build and look after what you need, with one team and one point of contact from start to finish.',
      ctas: [
        { href: '#contact', label: 'Book a call', variant: 'primary' },
        { href: '#features', label: 'See what we do', variant: 'secondary' },
      ],
    },
    features: {
      title: 'What you get',
      intro: 'Three things every project with us includes, whatever its size.',
      items: [
        { title: 'A plan that holds', description: 'We agree scope, budget and dates before work starts.', icon: ICON.plan },
        { title: 'Work you can check', description: 'Every step is written down and shown to you.', icon: ICON.check },
        { title: 'Answers within a day', description: 'One contact person who knows your project.', icon: ICON.clock },
      ],
    },
    cta: {
      title: 'Ready when you are',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [
        { href: 'mailto:hello@example.com', label: 'Write to us', variant: 'primary' },
        { href: '#features', label: 'Read more first', variant: 'secondary' },
      ],
    },
  },
  de: {
    hero: {
      eyebrow: 'Beispielwerk GmbH',
      title: 'Pläne, die halten – von der ersten Skizze bis zum fertigen Werk',
      lead: 'Wir planen, bauen und betreuen, was Sie brauchen – mit einem Team und einer Ansprechperson vom Anfang bis zum Ende.',
      ctas: [
        { href: '#contact', label: 'Gespräch vereinbaren', variant: 'primary' },
        { href: '#features', label: 'Leistungen ansehen', variant: 'secondary' },
      ],
    },
    features: {
      title: 'Was Sie bekommen',
      intro: 'Drei Dinge, die jedes Projekt bei uns enthält, ganz gleich wie groß.',
      items: [
        { title: 'Ein Plan, der hält', description: 'Umfang, Budget und Termine stehen fest, bevor die Arbeit beginnt.', icon: ICON.plan },
        { title: 'Arbeit, die Sie prüfen können', description: 'Jeder Schritt wird festgehalten und Ihnen gezeigt.', icon: ICON.check },
        { title: 'Antwort innerhalb eines Tages', description: 'Eine Ansprechperson, die Ihr Projekt kennt.', icon: ICON.clock },
      ],
    },
    cta: {
      title: 'Bereit, wenn Sie es sind',
      text: 'Erzählen Sie uns, was Sie vorhaben. Wir antworten innerhalb eines Werktags.',
      ctas: [
        { href: 'mailto:hallo@example.com', label: 'Schreiben Sie uns', variant: 'primary' },
        { href: '#features', label: 'Erst mehr lesen', variant: 'secondary' },
      ],
    },
  },
};
