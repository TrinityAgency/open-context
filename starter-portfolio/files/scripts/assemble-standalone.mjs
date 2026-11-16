// Runs after `next build` (the postbuild script). The standalone server in .next/standalone does not contain the
// static assets or public/; copy both next to server.js, so `pnpm start` serves a styled site and the folder can be
// shipped to a server as it is.
import { cpSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';

const standalone = join('.next', 'standalone');
const fail = (message) => {
  console.error(`assemble-standalone: ${message}`);
  process.exit(1);
};

if (!existsSync(join(standalone, 'server.js'))) fail('.next/standalone/server.js is missing; is output: "standalone" set in next.config.ts?');
// Without .next/static the server answers every stylesheet and script with 404: refuse rather than ship that.
if (!existsSync(join('.next', 'static'))) fail('.next/static is missing; the build produced no static assets, so the site would be unstyled.');

for (const [from, to, optional] of [
  [join('.next', 'static'), join(standalone, '.next', 'static'), false],
  ['public', join(standalone, 'public'), true],
]) {
  if (optional && !existsSync(from)) continue; // a site without public/ is fine
  rmSync(to, { recursive: true, force: true });
  cpSync(from, to, { recursive: true, dereference: true });
  console.log(`assemble-standalone: ${from} -> ${to}`);
}
