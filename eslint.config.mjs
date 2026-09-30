// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';
import importX, { createNodeResolver } from 'eslint-plugin-import-x';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import localRules from './eslint-rules/index.mjs';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierConfig,
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { local: localRules },
    rules: {
      'local/no-server-import-in-client': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { 'import-x': importX },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver(), createNodeResolver()],
    },
    rules: {
      'import-x/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              // Data access stays behind the API layer. Verified zero
              // violations before adding this: every current importer of
              // these modules is already a Route Handler or another lib
              // file — nothing under app pages/layouts or components
              // reaches into the DB directly today.
              target: [
                'src/components/**/*.{ts,tsx}',
                'src/app/**/page.tsx',
                'src/app/**/layout.tsx',
              ],
              from: ['src/lib/db', 'src/lib/chatbot/messages.server.ts'],
              message:
                'Data access goes through Route Handlers (src/app/api/**/route.ts), not directly from pages, layouts, or components — fetch from the API instead.',
            },
            {
              // Raw Supabase client construction stays confined to the two
              // factories. Also verified zero violations beforehand — every
              // createClient/createServerClient call already lives in one
              // of these two files.
              target: ['src/components/**/*.{ts,tsx}', 'src/app/**/*.{ts,tsx}'],
              // `from` is a filesystem path resolved from the project root,
              // not a module specifier — '@supabase/supabase-js' alone would
              // resolve to a nonexistent <repo>/@supabase/supabase-js and
              // silently never match (confirmed by testing this the hard
              // way: a deliberate violation went undetected until this fix).
              from: ['node_modules/@supabase/supabase-js', 'node_modules/@supabase/ssr'],
              message:
                'Build Supabase clients only in src/lib/supabase/{admin,server}.ts — use getServerSupabaseClient() / getAdminSupabaseClient() instead of creating your own client.',
            },
          ],
        },
      ],
    },
  },
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // Built/generated output — large bundled or minified files that
      // aren't source, and (found the hard way) can make ESLint hang for
      // tens of minutes trying to parse them.
      'storybook-static/**',
      'playwright-report/**',
      'playwright-visual-report/**',
      'test-results/**',
      'e2e-visual/__screenshots__/**',
      'coverage/**',
    ],
  },
  ...storybook.configs['flat/recommended'],
];

export default eslintConfig;
