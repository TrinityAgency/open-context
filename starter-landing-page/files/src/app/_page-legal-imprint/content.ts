// Structure and placeholders only. The text of this page must come from the site's owner or their counsel; nothing here is legal advice.
//
// The fields German and Austrian sites commonly show; keep the ones that apply to you and fill every `[[…]]`. Each
// value is plain text: a blank line starts a new paragraph.
import type { ImprintContent } from './legal-document';

/** The page's language: picks the text and the labels. Set `lang` in your root layout to match. */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: { title: 'Imprint – Samplework Inc.', description: 'Who provides this website, and how to reach them.' },
  de: { title: 'Impressum – Beispielwerk GmbH', description: 'Wer diese Website anbietet und wie Sie uns erreichen.' },
};

export const CONTENT: Record<'en' | 'de', ImprintContent> = {
  en: {
    title: 'Imprint',
    groups: [
      {
        title: 'Provider',
        entries: [
          { label: 'Name and legal form', value: '[[Company name and legal form]]' },
          { label: 'Address', value: '[[Street and number, postcode and city, country]]' },
          { label: 'Represented by', value: '[[Managing directors or owner]]' },
        ],
      },
      {
        title: 'Contact',
        entries: [
          { label: 'Email', value: '[[Email address]]' },
          { label: 'Phone', value: '[[Phone number]]' },
        ],
      },
      {
        title: 'Register and tax',
        entries: [
          { label: 'Register court and number', value: '[[Register court, register number]]' },
          { label: 'Firmenbuch court and number (Austria)', value: '[[Firmenbuch court, Firmenbuch number]]' },
          { label: 'VAT ID', value: '[[VAT identification number]]' },
          { label: 'UID number (Austria)', value: '[[UID number]]' },
        ],
        note: 'Keep the lines that apply to your company: register court and VAT ID in Germany, Firmenbuch and UID number in Austria.',
      },
      {
        title: 'Supervision and profession',
        entries: [
          { label: 'Supervisory authority', value: '[[Authority, if your business needs a licence]]' },
          { label: 'Professional title and chamber', value: '[[Title, country where it was awarded, chamber]]' },
          { label: 'Professional rules', value: '[[Name of the rules and where to read them]]' },
        ],
      },
      {
        title: 'Responsible for the content (§ 18 Abs. 2 MStV)',
        entries: [{ label: 'Name and address', value: '[[Name and address of the responsible person]]' }],
      },
      {
        title: 'Austria only',
        entries: [
          { label: 'Business purpose', value: '[[Business purpose]]' },
          { label: 'Disclosure under § 25 MedienG', value: '[[Owner of the medium, purpose and line of the website]]' },
        ],
      },
      {
        title: 'Consumer dispute resolution',
        entries: [{ label: 'Participation', value: '[[Whether you take part in dispute resolution before a consumer arbitration board]]' }],
      },
    ],
  },
  de: {
    title: 'Impressum',
    groups: [
      {
        title: 'Anbieter',
        entries: [
          { label: 'Name und Rechtsform', value: '[[Firma und Rechtsform]]' },
          { label: 'Anschrift', value: '[[Straße und Hausnummer, PLZ und Ort, Land]]' },
          { label: 'Vertreten durch', value: '[[Geschäftsführung oder Inhaber]]' },
        ],
      },
      {
        title: 'Kontakt',
        entries: [
          { label: 'E-Mail', value: '[[E-Mail-Adresse]]' },
          { label: 'Telefon', value: '[[Telefonnummer]]' },
        ],
      },
      {
        title: 'Register und Steuern',
        entries: [
          { label: 'Registergericht und Registernummer', value: '[[Registergericht, Registernummer]]' },
          { label: 'Firmenbuchgericht und Firmenbuchnummer (Österreich)', value: '[[Firmenbuchgericht, Firmenbuchnummer]]' },
          { label: 'Umsatzsteuer-Identifikationsnummer', value: '[[USt-IdNr.]]' },
          { label: 'UID-Nummer (Österreich)', value: '[[UID-Nummer]]' },
        ],
        note: 'Behalten Sie die Zeilen, die für Ihr Unternehmen gelten: Registergericht und USt-IdNr. in Deutschland, Firmenbuch und UID-Nummer in Österreich.',
      },
      {
        title: 'Aufsicht und Beruf',
        entries: [
          { label: 'Aufsichtsbehörde', value: '[[Behörde, falls Ihr Gewerbe eine Erlaubnis braucht]]' },
          { label: 'Berufsbezeichnung und Kammer', value: '[[Bezeichnung, verleihender Staat, Kammer]]' },
          { label: 'Berufsrechtliche Regelungen', value: '[[Bezeichnung der Regelungen und wo sie zu lesen sind]]' },
        ],
      },
      {
        title: 'Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)',
        entries: [{ label: 'Name und Anschrift', value: '[[Name und Anschrift der verantwortlichen Person]]' }],
      },
      {
        title: 'Nur Österreich',
        entries: [
          { label: 'Unternehmensgegenstand', value: '[[Unternehmensgegenstand]]' },
          { label: 'Offenlegung nach § 25 MedienG', value: '[[Medieninhaber, Zweck und Blattlinie der Website]]' },
        ],
      },
      {
        title: 'Verbraucherstreitbeilegung',
        entries: [{ label: 'Teilnahme', value: '[[Ob Sie an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilnehmen]]' }],
      },
    ],
  },
};
