// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { CtaContent } from './_sections/cta/cta-section';
import type { FaqItem } from './_sections/faq/site-types';
import type { HeroContent } from './_sections/hero/hero-section';

/** The page's language: picks the text below. Set it to 'de' for the German set (and `lang` in your root layout). */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Frequently asked questions – Samplework Inc.',
    description: 'Answers about how a project with us starts, what it costs and what happens after it.',
  },
  de: {
    title: 'Häufige Fragen – Beispielwerk GmbH',
    description: 'Antworten darauf, wie ein Projekt mit uns beginnt, was es kostet und was danach geschieht.',
  },
};

/**
 * One topic: a section of its own, reached from the topic list by `#<id>`. The `id` starts with a letter and holds
 * letters, digits and hyphens only; keep it when you translate the title, so links to it keep working.
 */
export type FaqCategory = { id: string; title: string; intro?: string; items: FaqItem[] };

export type FaqPageContent = {
  hero: HeroContent;
  /** The topic list's accessible name. */
  nav: string;
  categories: FaqCategory[];
  cta: CtaContent;
};

export const CONTENT: Record<'en' | 'de', FaqPageContent> = {
  en: {
    hero: {
      eyebrow: 'Help',
      title: 'Frequently asked questions',
      lead: 'Short answers about how a project with Samplework starts, what it costs and what happens after it.',
    },
    nav: 'Topics',
    categories: [
      {
        id: 'getting-started',
        title: 'Getting started',
        intro: 'From the first call to the signed plan.',
        items: [
          {
            question: 'How does a project with you start?',
            answer:
              'Write to us or call. We visit you within a week, look at the place and the plans, and send a written offer with the scope, the price and the dates.',
          },
          {
            question: 'Is the first visit free?',
            answer: 'Yes. The first visit and the written offer cost nothing and commit you to nothing.',
          },
          {
            question: 'How far ahead do we need to book?',
            answer: 'Most projects start four to eight weeks after the offer is signed. Small repairs often fit in sooner; ask us.',
          },
        ],
      },
      {
        id: 'prices',
        title: 'Prices and payment',
        intro: 'What you sign is what you pay.',
        items: [
          {
            question: 'How do you set the price?',
            answer:
              'Every offer lists each piece of work with its price. The price you sign is the price you pay, unless you ask for more work.',
          },
          {
            question: 'When do we pay?',
            answer:
              'A third when the work starts, a third halfway, and the rest once you have accepted the finished work.\n\nEvery invoice comes by email, and you pay it by bank transfer.',
          },
          {
            question: 'What if something unexpected comes up?',
            answer: 'We stop, show you what we found, and agree on the change and its price in writing before we go on.',
          },
        ],
      },
      {
        id: 'after',
        title: 'After the project',
        items: [
          {
            question: 'Is there a warranty?',
            answer: 'Yes. Our work carries a five-year warranty, set out in the contract you sign.',
          },
          {
            question: 'Who do we call if something is wrong later?',
            answer: 'Your contact person from the project, at the same number. We answer within a working day.',
          },
        ],
      },
    ],
    cta: {
      title: 'Still have a question?',
      text: 'Write to us. One person on the team answers within a working day.',
      ctas: [{ href: 'mailto:hello@example.com', label: 'Write to us', variant: 'primary' }],
    },
  },
  de: {
    hero: {
      eyebrow: 'Hilfe',
      title: 'Häufige Fragen',
      lead: 'Kurze Antworten darauf, wie ein Projekt mit der Beispielwerk GmbH beginnt, was es kostet und was danach geschieht.',
    },
    nav: 'Themen',
    categories: [
      {
        id: 'getting-started',
        title: 'Der Anfang',
        intro: 'Vom ersten Anruf bis zum unterschriebenen Plan.',
        items: [
          {
            question: 'Wie beginnt ein Projekt mit Ihnen?',
            answer:
              'Schreiben Sie uns oder rufen Sie an. Wir kommen innerhalb einer Woche vorbei, sehen uns den Ort und die Pläne an und schicken ein schriftliches Angebot mit Umfang, Preis und Terminen.',
          },
          {
            question: 'Ist der erste Besuch kostenlos?',
            answer: 'Ja. Der erste Besuch und das schriftliche Angebot kosten nichts und verpflichten Sie zu nichts.',
          },
          {
            question: 'Wie früh müssen wir buchen?',
            answer:
              'Die meisten Projekte beginnen vier bis acht Wochen nach der Unterschrift. Kleine Reparaturen passen oft früher hinein; fragen Sie uns.',
          },
        ],
      },
      {
        id: 'prices',
        title: 'Preise und Zahlung',
        intro: 'Was Sie unterschreiben, zahlen Sie.',
        items: [
          {
            question: 'Wie kommt der Preis zustande?',
            answer:
              'Jedes Angebot nennt jede Arbeit mit ihrem Preis. Der Preis, den Sie unterschreiben, ist der Preis, den Sie zahlen, es sei denn, Sie wünschen mehr Arbeit.',
          },
          {
            question: 'Wann zahlen wir?',
            answer:
              'Ein Drittel zu Beginn, ein Drittel zur Hälfte und den Rest, sobald Sie die fertige Arbeit abgenommen haben.\n\nJede Rechnung kommt per E-Mail, Sie zahlen sie per Überweisung.',
          },
          {
            question: 'Und wenn etwas Unerwartetes auftaucht?',
            answer:
              'Wir halten an, zeigen Ihnen, was wir gefunden haben, und vereinbaren die Änderung und ihren Preis schriftlich, bevor wir weitermachen.',
          },
        ],
      },
      {
        id: 'after',
        title: 'Nach dem Projekt',
        items: [
          {
            question: 'Gibt es eine Gewährleistung?',
            answer: 'Ja. Auf unsere Arbeit gibt es fünf Jahre Gewährleistung, festgehalten im Vertrag, den Sie unterschreiben.',
          },
          {
            question: 'Wen rufen wir an, wenn später etwas nicht stimmt?',
            answer: 'Ihre Ansprechperson aus dem Projekt, unter derselben Nummer. Wir antworten innerhalb eines Werktags.',
          },
        ],
      },
    ],
    cta: {
      title: 'Noch eine Frage offen?',
      text: 'Schreiben Sie uns. Eine Person aus dem Team antwortet innerhalb eines Werktags.',
      ctas: [{ href: 'mailto:hallo@example.com', label: 'Schreiben Sie uns', variant: 'primary' }],
    },
  },
};
