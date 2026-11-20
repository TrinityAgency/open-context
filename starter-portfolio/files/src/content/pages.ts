// The text of the services, about and contact pages, in English and German. Derived from the website kit's page
// templates (page-features, page-about and page-contact 1.0.0); AGENTS.md, "The pages". Sample
// content: replace it with your own and keep the shapes. Facts (the company's email and address) come from
// src/content/site.ts; the layout adds the company's name to each title.
import type { AboutStoryContent } from '@/components/about/about-story';
import type { TeamGridContent } from '@/components/about/team-grid';
import type { CtaContent } from '@/components/section-cta/cta-section';
import type { FaqContent } from '@/components/section-faq/faq-section';
import type { FeaturesContent } from '@/components/section-features/features-section';
import type { HeroContent } from '@/components/section-hero/hero-section';
import type { StatsContent } from '@/components/section-stats/stats-section';
import type { Locale } from './locale';
import { CONTACT } from './site';

/** A page's title and description for search and sharing. */
export type PageMeta = { title: string; description: string };

/** One group of features: a section of its own, with an id for in-page links such as `#planning`. */
export type FeatureGroup = { id: string; content: FeaturesContent };
export type ServicesPageContent = {
  meta: PageMeta;
  hero: HeroContent;
  groups: FeatureGroup[];
  faq: FaqContent;
  cta: CtaContent;
};

export type AboutPageContent = {
  meta: PageMeta;
  hero: HeroContent;
  story: AboutStoryContent;
  values: FeaturesContent;
  stats: StatsContent;
  team: TeamGridContent;
  cta: CtaContent;
};

/** The contact page's own text; src/content/contact.ts adds the facts from site.ts and the privacy link. */
export type ContactPageContent = {
  meta: PageMeta;
  title: string;
  intro?: string;
  /** A link to a map, shown until a visitor agrees to embedded maps (AGENTS.md, "The contact form"). */
  map?: { href: string; label: string };
};

// Sample pictures as inline SVG, so nothing loads from another host. Replace them with your own files under public/.
// Greys are black at an opacity: no colour literal anywhere under src/ (design-sync's guards, run by pnpm test).
const g = (opacity: number) => `fill="black" fill-opacity="${opacity}"`;
const svg = (viewBox: string, body: string) =>
  'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${body}</svg>`);
const picture = (shade: number) =>
  svg('0 0 640 400', `<rect width="640" height="400" ${g(shade)}/><rect x="200" y="120" width="240" height="160" rx="16" ${g(0.36)}/>`);
const OFFICE = svg('0 0 640 480', `<rect width="640" height="480" ${g(0.1)}/><rect x="120" y="200" width="400" height="200" ${g(0.36)}/><path d="M100 200L320 80l220 120z" ${g(0.55)}/>`);
const portrait = (opacity: number) =>
  svg('0 0 80 80', `<rect width="80" height="80" ${g(opacity)}/><circle cx="40" cy="32" r="14" fill="white"/><path d="M14 80c4-18 48-18 52 0z" fill="white"/>`);

/** Feature icons: the `d` of one SVG path in a 24-unit box. */
const ICON = {
  plan: 'M4 6h16M4 12h16M4 18h10',
  check: 'M5 12.5l4.5 4.5L19 7',
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
};

/** The company's email (CONTACT in site.ts) as a link. */
const MAIL = `mailto:${CONTACT.email}`;

/** The company's address (CONTACT in site.ts) on OpenStreetMap: a plain link, nothing loads until it is followed. */
const MAP = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${CONTACT.address.street}, ${CONTACT.address.city}`)}`;

export const SERVICES_PAGE: Record<Locale, ServicesPageContent> = {
  en: {
    meta: {
      title: 'Services',
      description: 'Planning, building and looking after it: what every project with Samplework includes.',
    },
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
              image: { src: picture(0.1), alt: 'A checklist beside a finished design', width: 640, height: 400 },
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
    faq: {
      title: 'Questions, answered',
      intro: 'What people ask us before a first call.',
      items: [
        {
          question: 'How long does a typical project take?',
          answer: 'Most projects take six to ten weeks from the first call to the handover.\n\nWe agree the dates in writing before work starts.',
        },
        { question: 'Do you work with clients far away?', answer: 'Yes. Most of the work happens in calls and shared documents; we meet in person when a project needs it.' },
        { question: 'What does the first call cost?', answer: 'Nothing. It takes about thirty minutes.' },
      ],
    },
    cta: {
      title: 'Ready when you are',
      text: 'Tell us what you are planning. We answer within one working day.',
      ctas: [
        { href: MAIL, label: 'Write to us', variant: 'primary' },
        { href: '#main', label: 'Back to the top', variant: 'secondary' },
      ],
    },
  },
  de: {
    meta: {
      title: 'Leistungen',
      description: 'Planen, bauen, betreuen: was jedes Projekt mit Beispielwerk enthält.',
    },
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
              image: { src: picture(0.1), alt: 'Eine Checkliste neben einem fertigen Entwurf', width: 640, height: 400 },
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
    faq: {
      title: 'Häufige Fragen',
      intro: 'Was man uns vor einem ersten Gespräch fragt.',
      items: [
        {
          question: 'Wie lange dauert ein typisches Projekt?',
          answer: 'Die meisten Projekte dauern sechs bis zehn Wochen vom ersten Gespräch bis zur Übergabe.\n\nDie Termine vereinbaren wir schriftlich, bevor die Arbeit beginnt.',
        },
        { question: 'Arbeiten Sie auch mit Kundinnen und Kunden weiter weg?', answer: 'Ja. Die meiste Arbeit geschieht in Gesprächen und gemeinsamen Dokumenten; wir treffen uns, wenn ein Projekt es braucht.' },
        { question: 'Was kostet das erste Gespräch?', answer: 'Nichts. Es dauert etwa dreißig Minuten.' },
      ],
    },
    cta: {
      title: 'Bereit, wenn Sie es sind',
      text: 'Erzählen Sie uns, was Sie vorhaben. Wir antworten innerhalb eines Werktags.',
      ctas: [
        { href: MAIL, label: 'Schreiben Sie uns', variant: 'primary' },
        { href: '#main', label: 'Zurück nach oben', variant: 'secondary' },
      ],
    },
  },
};

export const ABOUT_PAGE: Record<Locale, AboutPageContent> = {
  en: {
    meta: {
      title: 'About us',
      description: 'Who we are, what we hold to, and the people you will work with.',
    },
    hero: {
      eyebrow: 'About us',
      title: 'A small team that keeps its word',
      lead: 'Samplework designs and builds websites, brands and products, and looks after them once they are live, since 2014.',
      ctas: [{ href: '#contact', label: 'Get in touch', variant: 'primary' }],
    },
    story: {
      title: 'How we started',
      paragraphs: [
        'Samplework began as two people at one desk and a habit of writing everything down.',
        'Clients kept coming back for the same reason: the plan they signed was the plan they got. We grew around that habit, one project at a time.',
        'Today we are twelve people, and every project still starts with a written plan.',
      ],
      image: { src: OFFICE, alt: 'The office in Sampletown', width: 640, height: 480 },
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
          bio: 'Plans each project with the client and leads its design.',
          image: { src: portrait(0.55), alt: '', width: 80, height: 80 },
          links: [
            { network: 'web', label: 'Profile', href: 'https://example.com/team/alex' },
            { network: 'email', label: 'Email', href: 'mailto:alex@example.com' },
          ],
        },
        {
          name: 'Casey Example',
          role: 'Development',
          bio: 'Builds what the studio designs, and looks after it once it is live.',
          image: { src: portrait(0.68), alt: '', width: 80, height: 80 },
          links: [{ network: 'email', label: 'Email', href: 'mailto:casey@example.com' }],
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
      ctas: [{ href: MAIL, label: 'Write to us', variant: 'primary' }],
    },
  },
  de: {
    meta: {
      title: 'Über uns',
      description: 'Wer wir sind, woran wir uns halten und mit wem Sie arbeiten.',
    },
    hero: {
      eyebrow: 'Über uns',
      title: 'Ein kleines Team, das Wort hält',
      lead: 'Beispielwerk gestaltet und baut Websites, Marken und Produkte und betreut sie, wenn sie live sind – seit 2014.',
      ctas: [{ href: '#contact', label: 'Kontakt aufnehmen', variant: 'primary' }],
    },
    story: {
      title: 'Wie alles begann',
      paragraphs: [
        'Beispielwerk begann mit zwei Leuten an einem Schreibtisch und der Gewohnheit, alles aufzuschreiben.',
        'Kundinnen und Kunden kamen aus demselben Grund wieder: Der Plan, den sie unterschrieben, war der Plan, den sie bekamen. Um diese Gewohnheit sind wir gewachsen, Projekt für Projekt.',
        'Heute sind wir zwölf Leute, und jedes Projekt beginnt noch immer mit einem schriftlichen Plan.',
      ],
      image: { src: OFFICE, alt: 'Das Büro in Musterstadt', width: 640, height: 480 },
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
          name: 'Alex Sample',
          role: 'Gründung',
          bio: 'Plant jedes Projekt mit der Kundin oder dem Kunden und leitet die Gestaltung.',
          image: { src: portrait(0.55), alt: '', width: 80, height: 80 },
          links: [
            { network: 'web', label: 'Profil', href: 'https://example.com/team/alex' },
            { network: 'email', label: 'E-Mail', href: 'mailto:alex@example.com' },
          ],
        },
        {
          name: 'Casey Example',
          role: 'Entwicklung',
          bio: 'Baut, was das Studio gestaltet, und betreut es, wenn es live ist.',
          image: { src: portrait(0.68), alt: '', width: 80, height: 80 },
          links: [{ network: 'email', label: 'E-Mail', href: 'mailto:casey@example.com' }],
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
      ctas: [{ href: MAIL, label: 'Schreiben Sie uns', variant: 'primary' }],
    },
  },
};

export const CONTACT_PAGE: Record<Locale, ContactPageContent> = {
  en: {
    meta: {
      title: 'Contact',
      description: 'Write to us, call us or visit us. We answer within one working day.',
    },
    title: 'Contact',
    intro: 'Write to us, call us or visit us. We answer within one working day.',
    map: { href: MAP, label: 'Open the map' },
  },
  de: {
    meta: {
      title: 'Kontakt',
      description: 'Schreiben Sie uns, rufen Sie an oder besuchen Sie uns. Wir antworten innerhalb eines Werktags.',
    },
    title: 'Kontakt',
    intro: 'Schreiben Sie uns, rufen Sie an oder besuchen Sie uns. Wir antworten innerhalb eines Werktags.',
    map: { href: MAP, label: 'Karte öffnen' },
  },
};
