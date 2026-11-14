// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { CtaContent } from './_sections/cta/cta-section';
import type { FeaturesContent } from './_sections/features/features-section';
import type { HeroContent } from './_sections/hero/hero-section';

/** The page's language: picks the text below. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'What we do – Samplework Inc.',
    description: 'Planning, building and looking after it: what every project with Samplework includes.',
  },
  de: {
    title: 'Leistungen – Beispielwerk GmbH',
    description: 'Planen, bauen, betreuen: was jedes Projekt mit Beispielwerk enthält.',
  },
};

/** One group of features: a section of its own, with an id for in-page links such as `#planning`. */
export type FeatureGroup = { id: string; content: FeaturesContent };
export type FeaturesPageContent = { hero: HeroContent; groups: FeatureGroup[]; cta: CtaContent };

// Sample pictures as inline SVG, so nothing loads from another host. Replace them with your own files.
// Greys are black at an opacity: the kit allows no colour literal.
const g = (opacity: number) => `fill="black" fill-opacity="${opacity}"`;
const picture = (shade: number) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 400"><rect width="640" height="400" ${g(shade)}/>` +
      `<rect x="200" y="120" width="240" height="160" rx="16" ${g(0.36)}/></svg>`,
  );

/** Feature icons: the `d` of one SVG path in a 24-unit box. */
const ICON = {
  plan: 'M4 6h16M4 12h16M4 18h10',
  check: 'M5 12.5l4.5 4.5L19 7',
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
};

export const CONTENT: Record<'en' | 'de', FeaturesPageContent> = {
  en: {
    hero: {
      eyebrow: 'What we do',
      title: 'Everything a project needs, from one team',
      lead: 'We plan it with you, build it, and look after it afterwards. Here is what each step includes.',
      ctas: [
        { href: '#contact', label: 'Book a call', variant: 'primary' },
        { href: '#planning', label: 'Start with planning', variant: 'secondary' },
      ],
    },
    groups: [
      {
        id: 'planning',
        content: {
          title: 'Planning',
          intro: 'Before any work starts, you know what it costs and when it is done.',
          items: [
            {
              title: 'A first call, at no cost',
              description: 'Thirty minutes to understand what you need and whether we are the right team.',
              image: { src: picture(0.1), alt: 'A sketch on a table', width: 640, height: 400 },
            },
            {
              title: 'A written plan',
              description: 'Scope, prices and dates on paper, so you can hold us to them.',
              image: { src: picture(0.17), alt: 'A plan on a wall', width: 640, height: 400 },
            },
          ],
        },
      },
      {
        id: 'building',
        content: {
          title: 'Building',
          intro: 'One team does the work, and you see every step.',
          items: [
            { title: 'Weekly updates', description: 'What was done, what comes next, and anything that changed.', icon: ICON.clock },
            {
              title: 'Work you can check',
              description: 'Every step is written down and shown to you before we move on.',
              image: { src: picture(0.1), alt: 'A checklist beside a finished room', width: 640, height: 400 },
            },
          ],
        },
      },
      {
        id: 'care',
        content: {
          title: 'Looking after it',
          intro: 'The handover is not the end of the project.',
          items: [
            { title: 'One contact person', description: 'The person who knows your project answers within a day.', icon: ICON.check },
            { title: 'A yearly check', description: 'We look at the finished work once a year and fix what needs it.', icon: ICON.plan },
          ],
        },
      },
    ],
    cta: {
      title: 'Ready when you are',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [
        { href: 'mailto:hello@example.com', label: 'Write to us', variant: 'primary' },
        { href: '#main', label: 'Back to the top', variant: 'secondary' },
      ],
    },
  },
  de: {
    hero: {
      eyebrow: 'Leistungen',
      title: 'Alles, was ein Projekt braucht, aus einem Team',
      lead: 'Wir planen mit Ihnen, bauen und betreuen danach. Hier steht, was jeder Schritt enthält.',
      ctas: [
        { href: '#contact', label: 'Gespräch vereinbaren', variant: 'primary' },
        { href: '#planning', label: 'Mit der Planung beginnen', variant: 'secondary' },
      ],
    },
    groups: [
      {
        id: 'planning',
        content: {
          title: 'Planung',
          intro: 'Bevor die Arbeit beginnt, wissen Sie, was sie kostet und wann sie fertig ist.',
          items: [
            {
              title: 'Ein erstes Gespräch, kostenlos',
              description: 'Dreißig Minuten, um zu verstehen, was Sie brauchen – und ob wir das richtige Team sind.',
              image: { src: picture(0.1), alt: 'Eine Skizze auf einem Tisch', width: 640, height: 400 },
            },
            {
              title: 'Ein schriftlicher Plan',
              description: 'Umfang, Preise und Termine auf Papier, damit Sie uns beim Wort nehmen können.',
              image: { src: picture(0.17), alt: 'Ein Plan an einer Wand', width: 640, height: 400 },
            },
          ],
        },
      },
      {
        id: 'building',
        content: {
          title: 'Umsetzung',
          intro: 'Ein Team macht die Arbeit, und Sie sehen jeden Schritt.',
          items: [
            { title: 'Wöchentliche Berichte', description: 'Was erledigt ist, was als Nächstes kommt und was sich geändert hat.', icon: ICON.clock },
            {
              title: 'Arbeit, die Sie prüfen können',
              description: 'Jeder Schritt wird festgehalten und Ihnen gezeigt, bevor es weitergeht.',
              image: { src: picture(0.1), alt: 'Eine Checkliste neben einem fertigen Raum', width: 640, height: 400 },
            },
          ],
        },
      },
      {
        id: 'care',
        content: {
          title: 'Betreuung',
          intro: 'Mit der Übergabe endet das Projekt nicht.',
          items: [
            { title: 'Eine Ansprechperson', description: 'Wer Ihr Projekt kennt, antwortet innerhalb eines Tages.', icon: ICON.check },
            { title: 'Eine jährliche Prüfung', description: 'Einmal im Jahr sehen wir uns das fertige Werk an und beheben, was nötig ist.', icon: ICON.plan },
          ],
        },
      },
    ],
    cta: {
      title: 'Bereit, wenn Sie es sind',
      text: 'Erzählen Sie uns, was Sie vorhaben. Wir antworten innerhalb eines Werktags.',
      ctas: [
        { href: 'mailto:hallo@example.com', label: 'Schreiben Sie uns', variant: 'primary' },
        { href: '#main', label: 'Zurück nach oben', variant: 'secondary' },
      ],
    },
  },
};
