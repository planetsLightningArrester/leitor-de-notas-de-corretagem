# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.1.1] - 2021-04-30
### Added
- Add CNPJ column

### Changed
- Change `stocks*` to `assets*`

## [0.1.0] - 2021-04-30
### Added
- This `CHANGELOG.md`
- Cached listed stocks in `stocks.json`
- Listed stocks updated using `npm run update-stocks` or calling `stocksParser.getListedStocks()`

### Changed
- Split `.stocks.env` in `config.env` and `stocks.env`
- Changed `npm run start` to `npm run parse`
