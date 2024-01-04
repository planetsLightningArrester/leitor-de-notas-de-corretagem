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
  extends: 'standard-with-typescript',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  rules: {
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-misused-promises': 'off'
  }
}
