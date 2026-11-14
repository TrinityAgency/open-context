// The page's sample content, in English and German. Replace it with your own; keep the shapes.
import type { CtaContent } from './_sections/cta/cta-section';
import type { FaqContent } from './_sections/faq/faq-section';
import type { PricingContent } from './_sections/pricing/pricing-section';
import type { PricingPlan } from './_sections/pricing/site-types';
import type { ComparisonContent } from './comparison-table';

/** The page's language: picks the text, the labels and the price format. Set `lang` in your root layout to match. */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: {
    title: 'Pricing – Samplework Inc.',
    description: 'Plans for every size of project: start free, change or cancel any month.',
  },
  de: {
    title: 'Preise – Beispielwerk GmbH',
    description: 'Pakete für jede Projektgröße: kostenlos starten, jeden Monat wechseln oder kündigen.',
  },
};

export type PricingPageContent = {
  header: { title: string; lead: string };
  pricing: PricingContent;
  comparison: ComparisonContent;
  faq: FaqContent;
  cta: CtaContent;
};

type PlanText = { name: string; description: string; features: string[]; cta: string };
type PlanKey = 'starter' | 'team' | 'business' | 'setup';

/** The same plans in both languages: prices in minor units (cents), one currency, an interval each. */
function plans(currency: string, text: Record<PlanKey, PlanText>, yearNote: string): PricingPlan[] {
  const plan = (id: string, key: PlanKey, interval: PricingPlan['interval'], priceMinor: number, extra: Partial<PricingPlan> = {}): PricingPlan => ({
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
  const team = { highlighted: true, cta: { href: '#contact', label: text.team.cta, variant: 'primary' as const } };
  return [
    plan('starter-month', 'starter', 'month', 0),
    plan('team-month', 'team', 'month', 2900, team),
    plan('business-month', 'business', 'month', 7950),
    plan('starter-year', 'starter', 'year', 0),
    plan('team-year', 'team', 'year', 29000, { ...team, description: yearNote }),
    plan('business-year', 'business', 'year', 79500, { description: yearNote }),
    plan('setup', 'setup', 'once', 49000),
  ];
}

const PLAN_IDS = (names: Record<'starter' | 'team' | 'business', string>) => [
  { id: 'starter', name: names.starter },
  { id: 'team', name: names.team },
  { id: 'business', name: names.business },
];

export const CONTENT: Record<'en' | 'de', PricingPageContent> = {
  en: {
    header: {
      title: 'Plans and prices',
      lead: 'Start free and change plans any month. Every plan includes the written plan and weekly updates.',
    },
    pricing: {
      title: 'Choose a plan',
      intro: 'Pay monthly, or yearly and get two months free.',
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
    comparison: {
      title: 'Compare the plans',
      plans: PLAN_IDS({ starter: 'Starter', team: 'Team', business: 'Business' }),
      rows: [
        { feature: 'Projects', values: { starter: '1', team: '5', business: 'Unlimited' } },
        { feature: 'Answers', values: { starter: 'within two days', team: 'within a day', business: 'within a day' } },
        { feature: 'Written plan', values: { starter: true, team: true, business: true } },
        { feature: 'Shared plans', values: { starter: false, team: true, business: true } },
        { feature: 'Phone support', values: { team: false, business: true } },
        { feature: 'Named contact person', values: { business: true } },
      ],
    },
    faq: {
      title: 'Questions about pricing',
      items: [
        { question: 'Can I change plans later?', answer: 'Yes, any month. A change takes effect at the start of the next billing period.' },
        { question: 'What does "two months free" mean?', answer: 'A yearly plan costs ten times the monthly price, so two of the twelve months are free.' },
        { question: 'Do prices include tax?', answer: 'Prices are shown without sales tax; the invoice adds it where it applies.' },
      ],
    },
    cta: {
      title: 'Not sure which plan fits?',
      text: 'Tell us about your project and we will suggest one. We answer within one working day.',
      ctas: [{ href: 'mailto:hello@example.com', label: 'Ask us', variant: 'primary' }],
    },
  },
  de: {
    header: {
      title: 'Pakete und Preise',
      lead: 'Kostenlos starten und jeden Monat wechseln. Jedes Paket enthält den schriftlichen Plan und wöchentliche Berichte.',
    },
    pricing: {
      title: 'Wählen Sie ein Paket',
      intro: 'Monatlich zahlen – oder jährlich, mit zwei Monaten geschenkt.',
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
    comparison: {
      title: 'Die Pakete im Vergleich',
      plans: PLAN_IDS({ starter: 'Starter', team: 'Team', business: 'Business' }),
      rows: [
        { feature: 'Projekte', values: { starter: '1', team: '5', business: 'Unbegrenzt' } },
        { feature: 'Antwort', values: { starter: 'innerhalb von zwei Tagen', team: 'innerhalb eines Tages', business: 'innerhalb eines Tages' } },
        { feature: 'Schriftlicher Plan', values: { starter: true, team: true, business: true } },
        { feature: 'Gemeinsame Pläne', values: { starter: false, team: true, business: true } },
        { feature: 'Telefonischer Support', values: { team: false, business: true } },
        { feature: 'Feste Ansprechperson', values: { business: true } },
      ],
    },
    faq: {
      title: 'Fragen zu den Preisen',
      items: [
        { question: 'Kann ich das Paket später wechseln?', answer: 'Ja, jeden Monat. Ein Wechsel gilt ab dem nächsten Abrechnungszeitraum.' },
        { question: 'Was heißt „zwei Monate geschenkt“?', answer: 'Ein Jahrespaket kostet das Zehnfache des Monatspreises – zwei der zwölf Monate sind also frei.' },
        { question: 'Sind die Preise inklusive Umsatzsteuer?', answer: 'Die Preise verstehen sich zuzüglich Umsatzsteuer; die Rechnung weist sie aus.' },
      ],
    },
    cta: {
      title: 'Nicht sicher, welches Paket passt?',
      text: 'Erzählen Sie uns von Ihrem Projekt, wir schlagen eines vor. Wir antworten innerhalb eines Werktags.',
      ctas: [{ href: 'mailto:hallo@example.com', label: 'Fragen Sie uns', variant: 'primary' }],
    },
  },
};
