import { LOCALE } from './content';
import { NotFoundPage } from './not-found-view';

/** The default export for `app/not-found.tsx` (see README.md): the not-found page in `LOCALE`. */
export default function NotFound() {
  return <NotFoundPage locale={LOCALE} />;
}
