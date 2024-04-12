
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.4.58] - [0.4.95] - 2024-03-03

### Fixed

- Fix Unknown Asset modal dismissing Password modal ([#6](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/issues/6))

### Changed

- Update parser
- Update dependencies

## [0.4.15] - [0.4.57] - 2024-01-17

### Changed

- Update parser
- Disable text selection in some places
- Update dependencies

## [0.4.9] - [0.4.14] - 2024-01-12

### Fixed

- Fix unknown assets modal not popping-up

### Changed

- Update parser

## [0.4.7] - [0.4.8] - 2024-01-11

### Fix

- MacOS path on update

### Changed

- Update parser

## [0.4.6] - 2024-01-10

### Added

- Increase test coverage

### Changed

- Update dependencies
- Update docs

## [0.4.3] - [0.4.5] - 2024-01-09

### Added

- Docs for frontend

### Fixed

- Fix update flow now downloading correctly in Linux
- Fix images not loading in built version
- Fix fonts not loading in built version
- Fix auto-update on Windows and Linux machines

### Changed

- Update parser
- Improve logs
- Improve backend docs
- Improve git hooks checks and linters (fix #3 and #4)

## [0.4.2] - 2024-01-07

### Fixed

- Auto-update versioning

## [0.4.1] - 2024-01-07

### Fixed

- Fix some translations

### Changed

- Update parser
- Improve docs

## [0.4.0] - 2024-01-06

### Added

- Add full-featured user interface with [ElectronJS](https://www.electronjs.org/pt/) + [Forge](https://www.electronforge.io/) as the backend and [Svelte](https://svelte.dev/) + [Vite](https://vitejs.dev/) as the frontend
- Add multilingual support with [svelte-i18n](https://github.com/kaisermann/svelte-i18n)
- Add complete CI testing against Windows, Linux, and Mac
- Add [Eslint](https://eslint.org/) and [Prettier](https://prettier.io/) to frontend and backend
- Add GitHub templates for pull requests and issues
- Add Git hooks with [Husky](https://github.com/typicode/husky) and [commitlint](https://github.com/conventional-changelog/commitlint)

### Changed

- No need to install [NodeJS](https://nodejs.org/) locally
- Fully portable [cross-platform](https://en.wikipedia.org/wiki/Cross-platform_software) executable
- Only [E2E tests](https://circleci.com/blog/what-is-end-to-end-testing/)
- [Playwright](https://playwright.dev/) as the test framework
- Bump to Node v20
- Update the docs with the new user flow

### Removed

- Remove the need to move PDFs to a directory
- Remove CLI support

## [0.3.2] - 2023-08-22

### Changed

- Update dependencies

## [0.3.1] - 2023-07-25

### Fixed

- Bump parser version to fix the real estate parser for Inter notes
- Fix `COSAN` not identified

## [0.3.0] - 2023-07-06

### Added

- Add CNPJ to FIIs

### Changed

- Use [parser-de-notas-de-corretagem](https://www.npmjs.com/package/parser-de-notas-de-corretagem) to parse the notes

### Removed

- No assets parser is exported anymore. Don't use this as a package, instead use [parser-de-notas-de-corretagem](https://www.npmjs.com/package/parser-de-notas-de-corretagem)

## [0.2.0] - 2023-06-04

### Added

- Add support to Inter notes, but with very few tests
- Add support to multiple manual names to the same stock
- Add support to BDRs

### Fixed

- Fix `CHANGELOG` dates
- Fix Inter notes parser failing for titles with `/`
- Fix Inter notes parser putting the stock kind in front of the stock title

### Changed

- Update dependencies
- Update assets list

### Removed

- Requires Node ^18.x

## [0.1.1] - 2022-04-30

### Added

- Add CNPJ column

### Changed

- Change `stocks*` to `assets*`

## [0.1.0] - 2022-04-30

### Added

- This `CHANGELOG.md`
- Cached listed stocks in `stocks.json`
- Listed stocks updated using `npm run update-stocks` or calling `stocksParser.getListedStocks()`

### Changed

- Split `.stocks.env` in `config.env` and `stocks.env`
- Changed `npm run start` to `npm run parse`
