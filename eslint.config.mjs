import { fixupConfigRules, fixupPluginRules } from '@eslint/compat'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import _import from 'eslint-plugin-import'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

/**
 * @param {{ [s: string]: any; } | ArrayLike<any>} globalsObj
 */
function cleanGlobals(globalsObj) {
  return Object.fromEntries(Object.entries(globalsObj).map(([key, value]) => [key.trim(), value]))
}

export default [
  js.configs.recommended,
  ...fixupConfigRules(
    compat.extends(
      'plugin:@typescript-eslint/recommended',
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'prettier'
    )
  ),
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react: fixupPluginRules(react),
      'react-hooks': fixupPluginRules(reactHooks),
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: {
        ...cleanGlobals(globals.browser),
        ...cleanGlobals(globals.node),
      },

      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: './tsconfig.json',
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },

    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], 'internal', ['parent', 'sibling'], 'index'],

          pathGroups: [
            {
              pattern: '~/**',
              group: 'internal',
            },
          ],

          'newlines-between': 'always',

          alphabetize: {
            order: 'asc',
          },
        },
      ],
    },
  },
]
