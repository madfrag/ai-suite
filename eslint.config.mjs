// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-plugin-prettier/recommended';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  prettierConfig,
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
