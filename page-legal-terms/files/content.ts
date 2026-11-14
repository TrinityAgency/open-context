// Structure and placeholders only. The text of this page must come from the site's owner or their counsel; nothing here is legal advice.
//
// Every `[[…]]` is a placeholder: the page highlights it until you replace it. Paragraphs are separated by a blank
// line. Section ids are the anchors of the table of contents (`#payment`); following one opens its section.
import type { TermsContent } from './legal-document';

/** The page's language: picks the text, the labels and the date format. Set `lang` in your root layout to match. */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: { title: 'Terms – Samplework Inc.', description: 'The terms on which Samplework Inc. provides its services.' },
  de: { title: 'AGB – Beispielwerk GmbH', description: 'Die Bedingungen, zu denen die Beispielwerk GmbH ihre Leistungen erbringt.' },
};

export const CONTENT: Record<'en' | 'de', TermsContent> = {
  en: {
    title: 'Terms',
    updatedAt: '2026-03-01',
    intro: 'These terms apply to every contract between [[Samplework Inc.]] and its customers.',
    sections: [
      { id: 'scope', title: 'Scope', body: 'These terms apply to [[which services and customers]].\n\nDiffering terms of a customer apply only if [[condition]].' },
      { id: 'contract', title: 'How a contract is made', body: 'A contract is made when [[how and when a contract is concluded]].' },
      { id: 'payment', title: 'Prices and payment', body: 'Prices are [[net or gross, currency]]. Invoices are due within [[payment term]].' },
      { id: 'delivery', title: 'Work and delivery', body: 'We deliver [[what, where and by when]].\n\nIf a date cannot be kept, [[what happens]].' },
      { id: 'liability', title: 'Liability', body: '[[The liability rules that apply]].' },
      { id: 'termination', title: 'Term and termination', body: 'A contract runs for [[term]] and can be ended by [[notice period and form]].' },
      { id: 'law', title: 'Applicable law', body: 'The law of [[country]] applies. Place of jurisdiction: [[place]].' },
    ],
  },
  de: {
    title: 'Allgemeine Geschäftsbedingungen',
    updatedAt: '2026-03-01',
    intro: 'Diese Bedingungen gelten für alle Verträge zwischen der [[Beispielwerk GmbH]] und ihren Kundinnen und Kunden.',
    sections: [
      { id: 'scope', title: 'Geltungsbereich', body: 'Diese Bedingungen gelten für [[welche Leistungen und Kunden]].\n\nAbweichende Bedingungen von Kunden gelten nur, wenn [[Bedingung]].' },
      { id: 'contract', title: 'Vertragsschluss', body: 'Ein Vertrag kommt zustande, wenn [[wie und wann ein Vertrag geschlossen wird]].' },
      { id: 'payment', title: 'Preise und Zahlung', body: 'Die Preise verstehen sich [[netto oder brutto, Währung]]. Rechnungen sind innerhalb von [[Zahlungsfrist]] fällig.' },
      { id: 'delivery', title: 'Leistung und Lieferung', body: 'Wir liefern [[was, wohin und bis wann]].\n\nKann ein Termin nicht gehalten werden, [[was dann geschieht]].' },
      { id: 'liability', title: 'Haftung', body: '[[Die geltenden Haftungsregeln]].' },
      { id: 'termination', title: 'Laufzeit und Kündigung', body: 'Ein Vertrag läuft [[Laufzeit]] und kann mit [[Frist und Form]] gekündigt werden.' },
      { id: 'law', title: 'Anwendbares Recht', body: 'Es gilt das Recht von [[Land]]. Gerichtsstand: [[Ort]].' },
    ],
  },
};
