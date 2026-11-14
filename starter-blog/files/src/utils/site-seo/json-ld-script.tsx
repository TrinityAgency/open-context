import { jsonLdHtml } from './json-ld';

/** One `<script type="application/ld+json">` holding `data` (an object, or a list written as a JSON array), escaped. */
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(data) }} />;
}
