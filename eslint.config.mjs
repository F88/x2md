// @ts-check
import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// This is just an example default config for ESLint.
// You should change it to your needs following the documentation.
export default tseslint.config(
  {
    ignores: [
      'dist/',
      'lib/',
      'coverage/',
    ],
  },

  eslint.configs.recommended,

  tseslint.configs.strictTypeChecked,

  {
    languageOptions: {
      // parser: tseslint.parser,
      // ecmaVersion: 2020,
      // sourceType: 'module',

      globals: {
        ...globals.node,
      },

      parserOptions: {
        projectService: {
          allowDefaultProject: [
            'eslint.config.mjs',
            'prettier.config.mjs',
            'vitest.config.ts'
          ],
          defaultProject: 'tsconfig.json',
        },

        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    extends: [...tseslint.configs.recommended],

    files: ['**/*.ts', '**/*.mts'],

    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },

  },


  // // GitHub - import-js/eslint-plugin-import: ESLint plugin with rules that help validate proper imports.
  // // https://github.com/import-js/eslint-plugin-import
  //
  // // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  // importPlugin.flatConfigs.recommended,
  // {
  //   // files: ['**/*.{js,mjs,cjs}'],
  //   rules: {
  //     'import/order': [
  //       'error',
  //       {
  //         alphabetize: {
  //           order: 'asc',
  //           caseInsensitive: true,
  //         },
  //         'newlines-between': 'always',
  //       },
  //     ],
  //   },
  // },
  //
  // // GitHub - import-js/eslint-import-resolver-typescript: This resolver adds `TypeScript` support to `eslint-plugin-import(-x)`
  // // https://github.com/import-js/eslint-import-resolver-typescript
  // {
  //   settings: {
  //     'import/resolver': {
  //       typescript: {
  //         alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
  //         project: 'tsconfig.json',
  //       },
  //     },
  //   },
  // },

  // prettier/eslint-config-prettier: Turns off all rules that are unnecessary or might conflict with Prettier.
  // https://github.com/prettier/eslint-config-prettier?tab=readme-ov-file#cli-helper-tool
  //
  // With the new ESLint “flat config” format, you can control what things override what yourself.
  // One way of solving the above conflict is to reorder the config objects so that eslint-config-prettier is last:
  eslintConfigPrettier, // eslint-config-prettier last

  {

    files: ['test/**/*.ts'],

    plugins: {
      vitest,
    },

    rules: {
      // disable `any` checks in tests
      // '@typescript-eslint/no-unsafe-assignment': 'off',
      ...vitest.configs.recommended.rules,
    },

    settings: {
      vitest: {
        typecheck: true,
      },

    },
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },

  },
);
