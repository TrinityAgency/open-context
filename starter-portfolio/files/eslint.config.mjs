import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  // design-sync.mjs belongs to the design-tokens part (src/design-system/design-tokens): it is updated by installing a
  // newer version, never edited.
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts', 'src/design-system/design-tokens/design-sync.mjs']),
]);
