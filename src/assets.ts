import fs from 'fs';
import path from "path";
import { print } from "printaeu";
import * as pdfjs from 'pdfjs-dist';
import { Asset, AssetParser } from "./assetParser";
/** Manually set passwords */
const envsSet = require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') }).parsed;

/** Deals made in a `NegotiationNote` */
export interface Deal {
  /** Deal type */
  type: 'buy' | 'sell'
  /** Stock/FII code */
  code: string
  /** Amount bought/sold */
  quantity: number
  /** Average value bought/sold with fees applied */
  average: string
  /** Total amount bought/sold with fees applied */
  price: string
  /** Deal date in format yyyy-MM-dd */
  date: string
  /** Asset's CNPJ */
  cnpj: string
}

/** A parsed Negotiation Note */
export class NegotiationNote {
  /** Negotiation note number */
  number: string = '';
  /** The total amount bought with fees applied */
  buyTotal: string = '0'
  /** The total amount sold with fees applied */
  sellTotal: string = '0'
  /** The total amount of buy fees */
  buyFees: string = '0'
  /** The total amount of sell fees */
  sellFees: string = '0'
  /** The total amount of fees */
  fees: string = '0'
  /** Negotiation note date in format yyyy-MM-dd */
  date: string = ''
  /** Negotiation note holder */
  holder: string = ''
  /** Array of deals with buys and sells */
  deals: Deal[] = []
}

/** Assets handler */
export class Assets {

  recordData: boolean = false;
  /** Path to the JSON data file */
  private stockParser: AssetParser;

  private cachedPasswords: string[] = [];

  constructor(listedStocksFullPath: string) {
    this.stockParser = new AssetParser(listedStocksFullPath);
  }

  /**
   * Read and parse a given PDF negotiation note by its full path
   * @param noteFullPath the full path to the PDF note to be parsed
   * @returns an `Array` of `NegotiationNote`
   */
  async parseNote(noteFullPath: string): Promise<NegotiationNote[]> {

    if (!fs.existsSync(noteFullPath)) throw new Error(`[AS] Couldn't find the file ${noteFullPath}`);
    
    let parseResults: NegotiationNote[] = []
    const noteName: string = path.basename(noteFullPath);
    let pdf: pdfjs.PDFDocumentProxy | undefined;
    const possiblePasswords: string[] = [...this.cachedPasswords, ...Object.keys(envsSet)];
    for await (const key of possiblePasswords) {
      try {
        pdf = await pdfjs.getDocument({url: noteFullPath, password: envsSet[key], useSystemFonts: true}).promise;
        if (!this.cachedPasswords.includes(envsSet[key])) this.cachedPasswords.push(envsSet[key]);
        break;
      } catch (error) {/** Prevent the  failure and try again with another password */}
    }
    
    // Check if PDF was loaded
    if (!pdf) throw new Error(`Não foi possível abrir a nota ${noteFullPath}. Verifique se esse PDF possui senha. Caso positivo, adicione a senha em uma nova linha no arquivo "config.env" no formato "PDF_PASSWORD1=123". Você pode adicionar mais de uma senha.`);
    
    try {
      // Patterns
      let holderPattern = /data.*\s+\d{2}\/\d{2}\/\d{4}\s+(\w+)/i;
      let noteNumberPattern = /Nr\. nota\s+(\d+)/i;
      let datePattern = /data.*\s+(\d{2}\/\d{2}\/\d{4})/i;
      // ?* Clear and Rico summary pattern
      // ? Debentures
      // ? Vendas a vista
      // ? Compras a vista
      // ? Opções - compras
      // ? Opções - vendas
      // ? Operações a termo
      // ? Valor das oper/ c/títulos públ. (v. nom.)
      // ? Valor das operações
      let buysAndSellsClearRicoPattern = /\d[\d,.]*\s+(\d[\d,.]*)\s+(\d[\d,.]*)\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\n\nResumo dos Negócios/;
      // ?* Inter summary pattern
      // ? Valor das oper/ c/títulos públ. (v. nom.)
      // ? Valor das operações
      // ? Opções - compras
      // ? Debentures
      // ? Operações a termo
      // ? Opções - vendas
      // ? Compras a vista
      // ? Vendas a vista
      let buysAndSellsInterPattern = /Debêntures\n\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)\s+(\d[\d,.]*)/;
      // ?* Clear and Rico fees pattern
      let feesClearRicoPattern = [
        /(\d[\d,.]*)\nTaxa de liquidação/,
        /(\d[\d,.]*)\nTaxa de Registro/,
        /(\d[\d,.]*)\nTaxa de termo\/opções/,
        /(\d[\d,.]*)\nTaxa A.N.A./,
        /(\d[\d,.]*)\nEmolumentos/,
        /(\d[\d,.]*)\nTaxa Operacional/,
        /(\d[\d,.]*)\nExecução/,
        /(\d[\d,.]*)\nTaxa de Custódia/,
        /(\d[\d,.]*)\nImpostos/,
        /(\d[\d,.]*)\nI\.R\.R\.F\. s\/ operações, base/,
        /(\d[\d,.]*)\nOutros/
      ];
      // ?* Inter fees pattern
      let feesInterPattern = [
        // Taxa de Liquidação
        /Taxa de Registro\s+\w+\s+\w+\s+\w+\s+Total\s+\d[\d,.]*\s+\w+\s+\d[\d,.]*\s+(\d[\d,.]*)\s+\d[\d,.]*/,
        // Taxa de Registro
        /Taxa de Registro\s+\w+\s+\w+\s+\w+\s+Total\s+\d[\d,.]*\s+\w+\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)/,
        // Emolumentos
        /Emolumentos\s+\w+\s+\w+\s+\w+\s+(\d[\d,.]*)\s+\d[\d,.]*\s+\d[\d,.]*/,
        // Taxa A.N.A.
        /Emolumentos\s+\w+\s+\w+\s+\w+\s+\d[\d,.]*\s+(\d[\d,.]*)\s+\d[\d,.]*/,
        // Taxa de opções/futuro
        /Emolumentos\s+\w+\s+\w+\s+\w+\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)/,
        // Clearing
        /Clearing\s+(\d[\d,.]*)\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*/,
        // Execução
        /Clearing\s+\d[\d,.]*\s+(\d[\d,.]*)\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*/,
        // Execução casa
        /Clearing\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*/,
        // Impostos
        /Clearing\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)\s+\d[\d,.]*\s+\d[\d,.]*/,
        // IRRF s/ operações
        /Clearing\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)\s+\d[\d,.]*/,
        // Outras
        /Clearing\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+\d[\d,.]*\s+(\d[\d,.]*)/,
      ];
      // ?* Clear and Rico stock pattern
      let stockClearRicoPattern = /1-BOVESPA\s+(\w)\s+(\w+)\s+([\t \s+\w\/.]+)\s+(?:#\w*\s+)?(\d+)\s+([\w,]+)\s+([\w,.]+)\s+/g;
      // ?* Inter stock pattern
      let stockInterPattern = /Bovespa\s+(\w+)\s+(\w+)\s+(\d+)\s+(\d+[\d,.]*)\s+(\d+[\d,.]*)\s+\w+\s(\w+\s+[\w \t]+)/g;
      let match: RegExpMatchArray | null;

      // Iterate over the pages
      let pageContent: string = '';
      for await (const index of Array(pdf.numPages).keys()) {
        let i = index + 1;
        let page = await pdf.getPage(i);
        let data = await page.getTextContent();
        // Get page content
        for (let j = 0; j < data.items.length; j++) {
          const item = data.items[j];
          if ('str' in item) {
            pageContent += `${item.str}\n`;
          }
        }
        if ((pageContent.match(buysAndSellsClearRicoPattern) || pageContent.match(buysAndSellsInterPattern)) && pageContent.match(noteNumberPattern)) {
          // fs.writeFileSync(path.join(__dirname, 'content.txt'), pageContent, {encoding: 'utf-8', flag: 'a+'});

          // Get note's number
          let noteNumber: string | undefined
          match = pageContent.match(noteNumberPattern);
          if (match && match[1]) noteNumber = match[1];
          else throw new Error(`[AS] No note number found for the negotiation note '${noteName}'`);
          let parseResult = parseResults.find(el => el.number === noteNumber);
          if (!parseResult) {
            parseResult = new NegotiationNote();
            parseResults.push(parseResult);
          }
          parseResult.number = noteNumber;

          // Get the holder
          let holder: string | undefined;
          match = pageContent.match(holderPattern);
          if (match && match[1]) holder = match[1][0].toUpperCase() + match[1].slice(1).toLowerCase();
          else throw new Error(`[AS] No holder found for the negotiation note '${noteName}'`);
          parseResult.holder = holder.toLocaleLowerCase();

          // Get the date
          let date: string | undefined;
          match = pageContent.match(datePattern);
          if (match && match[1]) date = formatDateToShow(match[1]);
          else throw new Error(`[AS] No date found for the negotiation note '${noteName}'`);
          parseResult.date = date;

          // Note total
          let buyTotal: number = 0;
          let sellTotal: number = 0;
          if ((match = pageContent.match(buysAndSellsClearRicoPattern)) !== null) {
            sellTotal = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
            buyTotal = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
          } else if ((match = pageContent.match(buysAndSellsInterPattern)) !== null) {
            buyTotal = parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
            sellTotal = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
          } else print.yellow(`[AS] Error parsing note '${noteName}'. Couldn't get note buys and sells values`);

          // Get the fees
          let fees: number = 0;
          if (parseResult.holder.toLowerCase() === 'inter') {
            feesInterPattern.forEach(fee => {
              let match = pageContent.match(fee);
              if (match && match[1]) {
                fees += parseFloat(match[1].replace(/\./g, '').replace(',', '.')); 
              }
            });
          } else {
            feesClearRicoPattern.forEach(fee => {
              let match = pageContent.match(fee);
              if (match && match[1]) {
                fees += parseFloat(match[1].replace(/\./g, '').replace(',', '.')); 
              }
            });
          }
          if (fees) parseResult.fees = (parseFloat(parseResult.fees) + fees).toFixed(2);
          
          // Generate the CheckOut for the value bought
          if (buyTotal) parseResult.buyTotal = buyTotal.toFixed(2);
          
          // Generate the CheckIn for the value sold
          if (sellTotal) parseResult.sellTotal = sellTotal.toFixed(2);

          let stockPattern = parseResult.holder.toLowerCase() === 'inter'?stockInterPattern:stockClearRicoPattern;

          while ((match = stockPattern.exec(pageContent)) != null) {
            let op: string;
            // let market: string;
            let stock: Asset;
            let quantity: number;
            // let each: number;
            let transactionValue: number;

            if (parseResult.holder.toLowerCase() === 'inter') {
              op = match[2] || '';
              // market = match[1] || '';
              stock = this.stockParser.getCodeFromTitle(match[6].replace(/\s+/g, ' '));
              quantity = parseInt(match[3] || '');
              // each = parseFloat(match[4].replace('.', '').replace(',', '.'));
              transactionValue = parseFloat(match[5].replace('.', '').replace(',', '.'));
            } else {
              op = match[1];
              // market = match[2];
              stock = this.stockParser.getCodeFromTitle(match[3].replace(/\s+/g, ' '));
              quantity = parseInt(match[4]);
              // each = parseFloat(match[5].replace('.', '').replace(',', '.'));
              transactionValue = parseFloat(match[6].replace('.', '').replace(',', '.'));
            }

            if (!stock) print.yellow(`[AS] Can't find ${match[3]}`);

            // if (market === 'FRACIONARIO') stock += 'F';
            
            // Actually, asset can only be Transaction because of the `filter`. But TS doesn't allow.
            if (op === 'C') {
              let deal = parseResult.deals.find(el => el.code === stock.code && el.type === 'buy');
              if (!deal) {
                deal = {
                  type: 'buy',
                  code: stock.code,
                  quantity: quantity,
                  average: '0',
                  price: transactionValue.toFixed(2),
                  date: parseResult.date,
                  cnpj: stock.cnpj?stock.cnpj:''
                };
                parseResult.deals.push(deal);
              } else {
                deal.price = (parseFloat(deal.price) + transactionValue).toString();
                deal.quantity = deal.quantity + quantity;
              }
            } else {
              let deal = parseResult.deals.find(el => el.code === stock.code && el.type === 'sell');
              if (!deal) {
                deal = {
                  type: 'sell',
                  code: stock.code,
                  quantity: quantity,
                  average: '0',
                  price: transactionValue.toFixed(2),
                  date: parseResult.date,
                  cnpj: stock.cnpj?stock.cnpj:''
                };
                parseResult.deals.push(deal);
              } else {
                deal.price = (parseFloat(deal.price) + transactionValue).toString();
                deal.quantity = deal.quantity - quantity
              }
            }

          }

          pageContent = '';
        }
      }

    } catch (error: any) {
      if (error instanceof Error) {
        print.red(error.message);
        print.track(error);
      } else {
        print.red(`[AS] An error occurred during the notes parse`);
        print.log(error);
      }
    }

    try {
      // Process the fees
      parseResults.forEach(note => {
        const fees: number = parseFloat(note.fees);
        if (fees) {
          const buyTotal: number = parseFloat(note.buyTotal);
          const sellTotal: number = parseFloat(note.sellTotal);
          const buyFees: number = fees*buyTotal/(buyTotal+sellTotal);
          const sellFees: number = fees*sellTotal/(buyTotal+sellTotal);
          note.deals.forEach(deal => {
            const price: number = parseFloat(deal.price);
            if (deal.type === 'buy') {
              deal.price = (Math.fround(10*(price + buyFees*price/buyTotal))/10).toFixed(2);
            } else {
              deal.price = (Math.fround(10*(price - sellFees*price/sellTotal))/10).toFixed(2);
            }
            deal.average = (parseFloat(deal.price)/Math.abs(deal.quantity)).toFixed(2);
          });
          note.buyFees = buyFees.toFixed(2);
          note.sellFees = sellFees.toFixed(2);
          note.buyTotal = (buyTotal + buyFees).toFixed(2);
          note.sellTotal = (sellTotal - sellFees).toFixed(2);
        }
      });
    } catch (error: any) {
      if (error instanceof Error) {
        print.red(error.message);
        print.track(error);
      } else {
        print.red(`[AS] An error occurred while processing the notes`);
        print.log(error);
      }
    }

    // Format the CNPJs
    parseResults.forEach(el => {
      el.deals.forEach(deal => {
        // For some reason, CNPJs starting wit zeros have them suppressed, even thought it's a string and not a number ¯\_(ツ)_/¯
        if (deal.cnpj.length < 14) deal.cnpj = new Array(14 - deal.cnpj.length).fill('0').join('') + deal.cnpj;

        deal.cnpj = deal.cnpj.split('').map((c, index) => {
          if (index === 2 || index === 5) return '.' + c;
          else if (index === 8) return '/' + c;
          else if (index === 12) return '-' + c;
          else return c;
        }).join('');
      })
    });

    // console.log(noteResults);
    return parseResults;
  }

  /**
   * Add stock definition
   * @param code stock code
   * @param name stock name
   * @param cnpj stock CNPJ
   */
  defineStock(code: string, name: string, cnpj?: string): void {
    // Skip duplicates
    if (!this.stockParser.customAssets.find(a => a.code === code)) {
      this.stockParser.customAssets.push({code, name, cnpj});
    };
  }

}

/**
 * Convert a date to be displayed by local
 * @param date the date formatted as yyyy-MM-dd
 * @returns the formatted date
 */
 export function formatDateToShow (date: string | Date) {
  if (typeof date === 'string') {
    if (!date.match(/\d{4}-\d{2}-\d{2}/)) {
      return date;
    } else {
      return date.split('-').reverse().join('/');
    }
  } else {
    return '';
  }
}