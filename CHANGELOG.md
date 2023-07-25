# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2023-07-25
### Fix
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
