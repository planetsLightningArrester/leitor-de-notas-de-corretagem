# Brokerage Note Reader

<p align="center">
  <a href="https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/blob/main/README.zh-cn.md"><b>简体中文</b></a> |
  <a href="https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/blob/main/README.en-us.md"><b>English</b></a> |
  <a href="https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/blob/main/README.es-mx.md"><b>Español</b></a> |
  <a href="https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/blob/main/README.md"><b>Português</b></a>
</p>

<h2 align="center">User-friendly interface for the <a href="https://www.npmjs.com/package/parser-de-notas-de-corretagem"><b>parser-de-notas-de-corretagem</b></a></h2>

![alt](./art/demo.gif)

## About
Brokerage note reader that can export to `.csv`. Primarily tested with notes from Rico and Clear brokers but also supports Inter. Automatically ignores duplicate notes, even across different PDFs.

## How to Use
1. Go to the [releases](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/releases) and download the latest portable version according to your operating system.
2. Run the portable version.
3. Drag the PDFs of the notes you want to convert or click to browse for the PDFs. Add as many notes as needed.

## Possible Issues
- If the notes have passwords, a message will appear, and you can enter up to three possible passwords to open the files.
- If any asset is not identified, a message will appear, and you can manually enter the code, CNPJ, and whether the asset is a real estate fund.
- If conversion issues arise, the list of stocks may not be up-to-date. Check if you are using the latest version of the program.
- Error messages can be found at:
  - Linux: `~/.config/leitor-de-notas-de-corretagem-backend/log`
  - Mac: `~/Library/Application Support/leitor-de-notas-de-corretagem-backend/log`
  - Windows: `%APPDATA%/leitor-de-notas-de-corretagem-backend/log`

## Exporting Results
- Total or individual results can be exported to `.csv`.
- You can open the `.csv` directly in Excel, but it is recommended to import it differently for better visualization.
   - Open a new Excel file, select the `Data` tab, and click on `From Text/CSV` (or type `csv` in Excel's search). Then, select the `.csv` file and finish the import.

### My PDF was not identified
- Duplicate notes are not processed twice.
- Try using a PDF optimizer. Some PDFs have "hidden" spaces that we cannot see but disrupt the program. These spaces are removed when using PDF optimizers.

## Considerations
- Total values already include the total costs of the notes distributed proportionally.
- Values may deviate in the cents range. Please always verify if the result aligns with expectations.
- It may work for other brokers, but it has not been tested.
- If any asset is not ON, PN, UNT, DR1, DR2, or DR3, it must be entered manually (see the [Possible Issues](#possible-issues) section or consider reporting an [Issue](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/issues))
- If you encounter any other issues, consider reporting an [Issue](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/issues)

## Contributors
Thanks to those who sent me trading notes for testing ❤️. Personal data is not stored or used in tests, only the content of the notes.

## Thank You? You're Welcome
If I helped you, send a "Thanks!" 👋 through [pix](https://www.bcb.gov.br/en/financialstability/pix_en) 😊
> a09e5878-2355-45f7-9f36-6df4ccf383cf

## Development

Requires Node `>=18`.

### Setup
To run on WSL, some packages need to be installed:

```bash
sudo apt install libgconf-2-4 libatk1.0-0 libatk-bridge2.0-0 libgdk-pixbuf2.0-0 libgtk-3-0 libgbm-dev libnss3-dev libxss-dev libasound2 zip
```

### Tests

```bash
npm ci
npm run test
```

## License

According to the license, this software provides no warranty, and the author disclaims any responsibility for use. Use at your own responsibility and risk.

[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)