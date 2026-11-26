// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { CtaContent } from './_sections/cta/cta-section';
import type { FeaturesContent } from './_sections/features/features-section';
import type { HeroContent } from './_sections/hero/hero-section';
import type { StatsContent } from './_sections/stats/stats-section';
import type { TeamContent } from './_sections/team/team-section';
import type { AboutStoryContent } from './about-story';

/** The page's language: picks the text below. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'About us – Samplework Inc.',
    description: 'Who we are, what we hold to, and the people you will work with.',
  },
  de: {
    title: 'Über uns – Beispielwerk GmbH',
    description: 'Wer wir sind, woran wir uns halten und mit wem Sie arbeiten.',
  },
};

export type AboutContent = {
  hero: HeroContent;
  story: AboutStoryContent;
  values: FeaturesContent;
  stats: StatsContent;
  team: TeamContent;
  cta: CtaContent;
};

// Sample pictures as inline SVG, so nothing loads from another host. Replace them with your own files.
// Greys are black at an opacity: the kit allows no colour literal.
const g = (opacity: number) => `fill="black" fill-opacity="${opacity}"`;
const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`);

const WORKSHOP = svg('0 0 640 480', `<rect width="640" height="480" ${g(0.1)}/><rect x="120" y="200" width="400" height="200" ${g(0.36)}/><path d="M100 200L320 80l220 120z" ${g(0.55)}/>`);
const portrait = (opacity: number) =>
  svg('0 0 80 80', `<rect width="80" height="80" ${g(opacity)}/><circle cx="40" cy="32" r="14" fill="white"/><path d="M14 80c4-18 48-18 52 0z" fill="white"/>`);

/** Feature icons: the `d` of one SVG path in a 24-unit box. */
const ICON = {
  plan: 'M4 6h16M4 12h16M4 18h10',
  check: 'M5 12.5l4.5 4.5L19 7',
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
};

export const CONTENT: Record<'en' | 'de', AboutContent> = {
  en: {
    hero: {
      eyebrow: 'About us',
      title: 'A small team that keeps its word',
      lead: 'Samplework plans, builds and looks after projects in and around Sampletown, since 2014.',
      ctas: [{ href: '#contact', label: 'Get in touch', variant: 'primary' }],
    },
    story: {
      title: 'How we started',
      paragraphs: [
        'Samplework began as two people with one van and a habit of writing everything down.',
        'Clients kept coming back for the same reason: the plan they signed was the plan they got. We grew around that habit, one project at a time.',
        'Today we are twelve people, and every project still starts with a written plan.',
      ],
      image: { src: WORKSHOP, alt: 'The workshop in Sampletown', width: 640, height: 480 },
    },
    values: {
      title: 'What we hold to',
      items: [
        { title: 'Say it in writing', description: 'Scope, prices and dates are agreed on paper before work starts.', icon: ICON.plan },
        { title: 'Show the work', description: 'You see every step, and nothing is hidden behind a handover.', icon: ICON.check },
        { title: 'Answer quickly', description: 'One contact person answers within a working day.', icon: ICON.clock },
      ],
    },
    stats: {
      title: 'Samplework in figures',
      items: [
        { value: '12', label: 'years in business' },
        { value: '12', label: 'people on the team' },
        { value: '340+', label: 'projects finished' },
      ],
    },
    team: {
      title: 'The team',
      intro: 'The people you will talk to.',
      members: [
        {
          name: 'Alex Sample',
          role: 'Founder',
          bio: 'Plans every project and still reads every plan before it goes out.',
          image: { src: portrait(0.55), alt: '', width: 80, height: 80 },
          links: [
            { network: 'web', label: 'Profile', href: 'https://example.com/team/alex' },
            { network: 'email', label: 'Email', href: 'mailto:alex@example.com' },
          ],
        },
        {
          name: 'Jordan Placeholder',
          role: 'Site lead',
          bio: 'Runs the building sites and the weekly updates.',
          image: { src: portrait(0.68), alt: '', width: 80, height: 80 },
          links: [{ network: 'email', label: 'Email', href: 'mailto:jordan@example.com' }],
        },
        {
          name: 'Sam Example',
          role: 'Office',
          bio: 'Answers the phone, keeps the calendar and the invoices.',
          image: { src: portrait(0.75), alt: '', width: 80, height: 80 },
        },
      ],
    },
    cta: {
      title: 'Work with us',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [{ href: 'mailto:hello@example.com', label: 'Write to us', variant: 'primary' }],
    },
  },
  de: {
    hero: {
      eyebrow: 'Über uns',
      title: 'Ein kleines Team, das Wort hält',
      lead: 'Beispielwerk plant, baut und betreut Projekte in und um Musterstadt – seit 2014.',
      ctas: [{ href: '#contact', label: 'Kontakt aufnehmen', variant: 'primary' }],
    },
    story: {
      title: 'Wie alles begann',
      paragraphs: [
        'Beispielwerk begann mit zwei Leuten, einem Transporter und der Gewohnheit, alles aufzuschreiben.',
        'Kundinnen und Kunden kamen aus demselben Grund wieder: Der Plan, den sie unterschrieben, war der Plan, den sie bekamen. Um diese Gewohnheit sind wir gewachsen, Projekt für Projekt.',
        'Heute sind wir zwölf Leute, und jedes Projekt beginnt noch immer mit einem schriftlichen Plan.',
      ],
      image: { src: WORKSHOP, alt: 'Die Werkstatt in Musterstadt', width: 640, height: 480 },
    },
    values: {
      title: 'Woran wir uns halten',
      items: [
        { title: 'Schriftlich vereinbaren', description: 'Umfang, Preise und Termine stehen auf Papier, bevor die Arbeit beginnt.', icon: ICON.plan },
        { title: 'Die Arbeit zeigen', description: 'Sie sehen jeden Schritt; nichts verschwindet hinter einer Übergabe.', icon: ICON.check },
        { title: 'Schnell antworten', description: 'Eine Ansprechperson antwortet innerhalb eines Werktags.', icon: ICON.clock },
      ],
    },
    stats: {
      title: 'Beispielwerk in Zahlen',
      items: [
        { value: '12', label: 'Jahre am Markt' },
        { value: '12', label: 'Leute im Team' },
        { value: '340+', label: 'abgeschlossene Projekte' },
      ],
    },
    team: {
      title: 'Das Team',
      intro: 'Die Menschen, mit denen Sie sprechen.',
      members: [
        {
          name: 'Alex Beispiel',
          role: 'Gründung',
          bio: 'Plant jedes Projekt und liest noch immer jeden Plan, bevor er rausgeht.',
          image: { src: portrait(0.55), alt: '', width: 80, height: 80 },
          links: [
            { network: 'web', label: 'Profil', href: 'https://example.com/team/alex' },
            { network: 'email', label: 'E-Mail', href: 'mailto:alex@example.com' },
          ],
        },
        {
          name: 'Jordan Platzhalter',
          role: 'Bauleitung',
          bio: 'Leitet die Baustellen und schreibt die wöchentlichen Berichte.',
          image: { src: portrait(0.68), alt: '', width: 80, height: 80 },
          links: [{ network: 'email', label: 'E-Mail', href: 'mailto:jordan@example.com' }],
        },
        {
          name: 'Sam Muster',
          role: 'Büro',
          bio: 'Geht ans Telefon, führt den Kalender und die Rechnungen.',
          image: { src: portrait(0.75), alt: '', width: 80, height: 80 },
        },
      ],
    },
    cta: {
      title: 'Mit uns arbeiten',
      text: 'Erzählen Sie uns, was Sie vorhaben. Wir antworten innerhalb eines Werktags.',
      ctas: [{ href: 'mailto:hallo@example.com', label: 'Schreiben Sie uns', variant: 'primary' }],
    },
  },
};
