/* eslint-disable @typescript-eslint/naming-convention */
/** @type {import('eslint'.Linter.Config)} */
// eslint-disable-next-line no-undef
module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['plugin:svelte/recommended', 'standard-with-typescript'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    extraFileExtensions: ['.svelte'] // This is a required setting in `@typescript-eslint/parser` v4.24.0.
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      // Parse the `<script>` in `.svelte` as TypeScript by adding the following configuration.
      parserOptions: {
        parser: '@typescript-eslint/parser'
      }
    }
  ],
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    'no-self-assign': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    curly: 'off',
  }
}
