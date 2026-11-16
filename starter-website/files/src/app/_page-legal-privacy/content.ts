// Structure and placeholders only. The text of this page must come from the site's owner or their counsel; nothing here is legal advice.
//
// Every `[[…]]` is a placeholder: the page highlights it until you replace it. Paragraphs are separated by a blank
// line. Section ids are the anchors of the table of contents (`#controller`).
import type { PrivacyContent } from './legal-document';

/** The page's language: picks the text, the labels and the date format. Set `lang` in your root layout to match. */
export const LOCALE = 'en' as 'en' | 'de';

export const META: Record<'en' | 'de', { title: string; description: string }> = {
  en: { title: 'Privacy policy – Samplework Inc.', description: 'How Samplework Inc. handles personal data on this website.' },
  de: { title: 'Datenschutzerklärung – Beispielwerk GmbH', description: 'Wie die Beispielwerk GmbH personenbezogene Daten auf dieser Website verarbeitet.' },
};

export const CONTENT: Record<'en' | 'de', PrivacyContent> = {
  en: {
    title: 'Privacy policy',
    updatedAt: '2026-03-01',
    intro: 'This policy explains which personal data [[Samplework Inc.]] processes when you use this website, why, and what rights you have.',
    sections: [
      {
        id: 'controller',
        title: 'Who is responsible',
        summary: 'The controller is [[Samplework Inc.]].',
        body: 'Controller: [[Company name and legal form]], [[Street and number]], [[Postcode and city]], [[Country]].\n\nEmail: [[Email address]]. Phone: [[Phone number]].\n\nData protection officer: [[Name and contact, or "none appointed"]].',
      },
      {
        id: 'server-logs',
        title: 'When you visit this website',
        summary: 'Our host records technical data for [[retention period]] to keep the site running and secure.',
        body: 'Each visit is logged by [[Hosting provider]]: [[the data logged, e.g. IP address, date and time, page, browser]].\n\nPurpose and legal basis: [[purpose and legal basis]]. Retention: [[retention period]].',
      },
      {
        id: 'contact',
        title: 'When you contact us',
        summary: 'We use what you send us only to answer you.',
        body: 'When you write to us, we process [[the data you send, e.g. name, email address, message]] to answer your request.\n\nLegal basis: [[legal basis]]. Retention: [[retention period]].',
      },
      {
        id: 'cookies',
        title: 'Cookies and external media',
        summary: 'Nothing that loads from another host runs before you agree.',
        body: 'We store your choice in a cookie named [[cookie name]] for [[duration]].\n\nExternal media (e.g. [[maps, videos]]) load only after you allow them: [[providers and what they receive]].',
      },
      {
        id: 'rights',
        title: 'Your rights',
        body: 'You have the right to [[list of rights under the applicable law]].\n\nYou can complain to a supervisory authority: [[authority and contact]].',
      },
      {
        id: 'changes',
        title: 'Changes to this policy',
        body: 'We update this policy when [[when it changes]]. The date at the top shows the current version.',
      },
    ],
  },
  de: {
    title: 'Datenschutzerklärung',
    updatedAt: '2026-03-01',
    intro: 'Diese Erklärung beschreibt, welche personenbezogenen Daten die [[Beispielwerk GmbH]] verarbeitet, wenn Sie diese Website nutzen, wozu, und welche Rechte Sie haben.',
    sections: [
      {
        id: 'controller',
        title: 'Verantwortliche Stelle',
        summary: 'Verantwortlich ist die [[Beispielwerk GmbH]].',
        body: 'Verantwortlich: [[Firma und Rechtsform]], [[Straße und Hausnummer]], [[PLZ und Ort]], [[Land]].\n\nE-Mail: [[E-Mail-Adresse]]. Telefon: [[Telefonnummer]].\n\nDatenschutzbeauftragte Person: [[Name und Kontakt, oder „nicht bestellt“]].',
      },
      {
        id: 'server-logs',
        title: 'Beim Besuch dieser Website',
        summary: 'Unser Hoster speichert technische Daten für [[Speicherdauer]], damit die Website läuft und sicher bleibt.',
        body: 'Jeder Aufruf wird von [[Hosting-Anbieter]] protokolliert: [[die protokollierten Daten, z. B. IP-Adresse, Datum und Uhrzeit, Seite, Browser]].\n\nZweck und Rechtsgrundlage: [[Zweck und Rechtsgrundlage]]. Speicherdauer: [[Speicherdauer]].',
      },
      {
        id: 'contact',
        title: 'Wenn Sie uns schreiben',
        summary: 'Was Sie uns senden, nutzen wir nur für die Antwort.',
        body: 'Wenn Sie uns schreiben, verarbeiten wir [[die gesendeten Daten, z. B. Name, E-Mail-Adresse, Nachricht]], um Ihre Anfrage zu beantworten.\n\nRechtsgrundlage: [[Rechtsgrundlage]]. Speicherdauer: [[Speicherdauer]].',
      },
      {
        id: 'cookies',
        title: 'Cookies und externe Medien',
        summary: 'Nichts, was von einem anderen Server lädt, läuft vor Ihrer Zustimmung.',
        body: 'Ihre Auswahl speichern wir im Cookie [[Cookie-Name]] für [[Dauer]].\n\nExterne Medien (z. B. [[Karten, Videos]]) laden erst nach Ihrer Zustimmung: [[Anbieter und was sie erhalten]].',
      },
      {
        id: 'rights',
        title: 'Ihre Rechte',
        body: 'Sie haben das Recht auf [[Liste der Rechte nach anwendbarem Recht]].\n\nSie können sich bei einer Aufsichtsbehörde beschweren: [[Behörde und Kontakt]].',
      },
      {
        id: 'changes',
        title: 'Änderungen dieser Erklärung',
        body: 'Wir passen diese Erklärung an, wenn [[wann sie sich ändert]]. Das Datum oben zeigt den aktuellen Stand.',
      },
    ],
  },
};
