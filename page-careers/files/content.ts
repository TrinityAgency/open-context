// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { CtaContent } from './_sections/cta/cta-section';
import type { FeaturesContent } from './_sections/features/features-section';
import type { HeroContent } from './_sections/hero/hero-section';
import type { LinkItem } from './_sections/hero/site-types';
import type { ProcessContent } from './_sections/process/process-section';

/** The page's language: picks the text below. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Careers – Samplework Inc.',
    description: 'Open positions at Samplework in Sampletown, why people stay, and how we hire.',
  },
  de: {
    title: 'Karriere – Beispielwerk GmbH',
    description: 'Offene Stellen bei der Beispielwerk GmbH in Musterstadt, warum Menschen bleiben und wie wir einstellen.',
  },
};

/**
 * One open position. `#<id>` scrolls to it, still closed (a letter first, then letters, digits and hyphens; unique,
 * and none of the page's own ids; keep it when you translate the title). `location` and `kind` show in one line under the title; `description` is one
 * paragraph per entry; `apply` is where a candidate applies (an email address, a form, a job board).
 */
export type JobOpening = {
  id: string;
  title: string;
  location?: string;
  kind?: string;
  description: string[];
  requirements?: string[];
  apply: LinkItem;
};

export type OpeningsContent = {
  title: string;
  intro?: string;
  /** Shown above an opening's requirements. */
  requirementsLabel: string;
  /** Shown instead of the list when `items` is empty. */
  noOpenings: string;
  items: JobOpening[];
};

export type CareersContent = {
  hero: HeroContent;
  benefits: FeaturesContent;
  openings: OpeningsContent;
  process: ProcessContent;
  cta: CtaContent;
};

/** Feature icons: the `d` of one SVG path in a 24-unit box. */
const ICON = {
  clock: 'M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z',
  plan: 'M4 6h16M4 12h16M4 18h10',
  check: 'M5 12.5l4.5 4.5L19 7',
};

export const CONTENT: Record<'en' | 'de', CareersContent> = {
  en: {
    hero: {
      eyebrow: 'Careers',
      title: 'Build with us in Sampletown',
      lead: 'We are twelve people who plan, build and look after projects together, and we are looking for three more.',
      ctas: [{ href: '#openings', label: 'See the open positions', variant: 'primary' }],
    },
    benefits: {
      title: 'Why people stay',
      intro: 'A small team, fixed hours and work you can point at years later.',
      items: [
        { title: 'Home by five', description: 'Work ends at 4:30 pm, Monday to Friday. Overtime is the exception, and it is paid.', icon: ICON.clock },
        { title: 'Plans on paper', description: 'Every job starts with a written plan, so nobody has to guess on site.', icon: ICON.plan },
        { title: 'Learning on the job', description: 'Five paid training days a year, and you choose the course.', icon: ICON.check },
      ],
    },
    openings: {
      title: 'Open positions',
      intro: 'Three at the moment, all based in Sampletown.',
      requirementsLabel: 'What you bring',
      noOpenings: 'There is no open position right now. Write to us anyway: we keep good people in mind.',
      items: [
        {
          id: 'site-lead',
          title: 'Site lead',
          location: 'Sampletown',
          kind: 'Full-time',
          description: [
            'You run two or three of our sites at a time: you plan the week with the team, order the material and keep the client informed.',
            'You report to the managing director and work from our workshop and on site.',
          ],
          requirements: ['Five years or more on building sites', 'A driving licence', 'Calm on the phone, clear in writing'],
          apply: { href: 'mailto:jobs@example.com?subject=Site%20lead', label: 'Apply as site lead' },
        },
        {
          id: 'carpenter',
          title: 'Carpenter',
          location: 'Sampletown',
          kind: 'Full-time or part-time',
          description: ['You build stairs, floors and fitted furniture in the workshop and fit them on site with the team.'],
          requirements: ['A completed apprenticeship or equivalent experience', 'Care for the details nobody sees'],
          apply: { href: 'mailto:jobs@example.com?subject=Carpenter', label: 'Apply as carpenter' },
        },
        {
          id: 'apprentice',
          title: 'Apprentice carpenter, starting August 2027',
          location: 'Sampletown',
          kind: 'Apprenticeship, three years',
          description: [
            'Three years in our workshop and at the trade school, with one person on the team who looks after you from the first day.',
          ],
          apply: { href: 'mailto:jobs@example.com?subject=Apprenticeship', label: 'Apply for the apprenticeship' },
        },
      ],
    },
    process: {
      title: 'How we hire',
      intro: 'Four steps, about three weeks from your email to our offer.',
      steps: [
        { title: 'You write to us', description: 'A short email and your CV are enough. No cover letter needed.' },
        { title: 'We call you', description: 'Within a week, for about half an hour.' },
        { title: 'A day with the team', description: 'Paid: you meet the people you would work with and see a site.' },
        { title: 'Our offer', description: 'In writing, within three days of that day.' },
      ],
    },
    cta: {
      title: 'Not the right position?',
      text: 'Tell us what you do well. We read every letter and answer within two weeks.',
      ctas: [{ href: 'mailto:jobs@example.com', label: 'Write to us', variant: 'primary' }],
    },
  },
  de: {
    hero: {
      eyebrow: 'Karriere',
      title: 'Bauen Sie mit uns in Musterstadt',
      lead: 'Wir sind zwölf Menschen, die gemeinsam Projekte planen, bauen und betreuen, und wir suchen drei weitere.',
      ctas: [{ href: '#openings', label: 'Zu den offenen Stellen', variant: 'primary' }],
    },
    benefits: {
      title: 'Warum Menschen bleiben',
      intro: 'Ein kleines Team, feste Arbeitszeiten und Arbeit, auf die man Jahre später noch zeigt.',
      items: [
        { title: 'Um fünf zu Hause', description: 'Feierabend ist um 16:30 Uhr, Montag bis Freitag. Überstunden sind die Ausnahme und werden bezahlt.', icon: ICON.clock },
        { title: 'Pläne auf Papier', description: 'Jede Arbeit beginnt mit einem schriftlichen Plan, damit auf der Baustelle niemand raten muss.', icon: ICON.plan },
        { title: 'Lernen bei der Arbeit', description: 'Fünf bezahlte Fortbildungstage im Jahr, den Kurs wählen Sie.', icon: ICON.check },
      ],
    },
    openings: {
      title: 'Offene Stellen',
      intro: 'Zurzeit drei, alle mit Sitz in Musterstadt.',
      requirementsLabel: 'Was Sie mitbringen',
      noOpenings: 'Zurzeit ist keine Stelle offen. Schreiben Sie uns trotzdem: Wir behalten gute Leute im Kopf.',
      items: [
        {
          id: 'site-lead',
          title: 'Bauleitung',
          location: 'Musterstadt',
          kind: 'Vollzeit',
          description: [
            'Sie leiten zwei oder drei unserer Baustellen gleichzeitig: Sie planen die Woche mit dem Team, bestellen das Material und halten die Kundschaft auf dem Laufenden.',
            'Sie berichten an die Geschäftsführung und arbeiten in unserer Werkstatt und auf der Baustelle.',
          ],
          requirements: ['Mindestens fünf Jahre Erfahrung auf Baustellen', 'Einen Führerschein', 'Ruhe am Telefon, Klarheit im Schriftlichen'],
          apply: { href: 'mailto:jobs@example.com?subject=Bauleitung', label: 'Als Bauleitung bewerben' },
        },
        {
          id: 'carpenter',
          title: 'Tischlerin oder Tischler',
          location: 'Musterstadt',
          kind: 'Vollzeit oder Teilzeit',
          description: ['Sie bauen Treppen, Böden und Einbaumöbel in der Werkstatt und montieren sie mit dem Team vor Ort.'],
          requirements: ['Eine abgeschlossene Ausbildung oder gleichwertige Erfahrung', 'Sorgfalt bei den Details, die niemand sieht'],
          apply: { href: 'mailto:jobs@example.com?subject=Tischlerei', label: 'Als Tischlerin oder Tischler bewerben' },
        },
        {
          id: 'apprentice',
          title: 'Ausbildung in der Tischlerei, ab August 2027',
          location: 'Musterstadt',
          kind: 'Ausbildung, drei Jahre',
          description: [
            'Drei Jahre in unserer Werkstatt und an der Berufsschule, mit einer Person aus dem Team, die sich vom ersten Tag an um Sie kümmert.',
          ],
          apply: { href: 'mailto:jobs@example.com?subject=Ausbildung', label: 'Für die Ausbildung bewerben' },
        },
      ],
    },
    process: {
      title: 'So stellen wir ein',
      intro: 'Vier Schritte, etwa drei Wochen von Ihrer E-Mail bis zu unserem Angebot.',
      steps: [
        { title: 'Sie schreiben uns', description: 'Eine kurze E-Mail und Ihr Lebenslauf genügen. Kein Anschreiben nötig.' },
        { title: 'Wir rufen Sie an', description: 'Innerhalb einer Woche, für etwa eine halbe Stunde.' },
        { title: 'Ein Tag mit dem Team', description: 'Bezahlt: Sie lernen die Menschen kennen, mit denen Sie arbeiten würden, und sehen eine Baustelle.' },
        { title: 'Unser Angebot', description: 'Schriftlich, innerhalb von drei Tagen nach diesem Tag.' },
      ],
    },
    cta: {
      title: 'Nicht die passende Stelle?',
      text: 'Erzählen Sie uns, was Sie gut können. Wir lesen jeden Brief und antworten innerhalb von zwei Wochen.',
      ctas: [{ href: 'mailto:jobs@example.com', label: 'Schreiben Sie uns', variant: 'primary' }],
    },
  },
};
