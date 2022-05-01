import { print } from "printaeu";
import fs from 'fs';
import path from 'path';
import axios from "axios";
import https from 'https';
const httpsAgent = new https.Agent({rejectUnauthorized: false });
const manuallySetStocks = require('dotenv').config({ path: path.join(__dirname, '..', 'stocks.env') }).parsed;

/**
 * Request constructor
 */
class ListedStocksRequest {
  language: string = 'pt-br';
  pageNumber: number;
  pageSize: 20|40|60|120 = 120;
  
  constructor(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.pageSize = 120;
  }

}

/**
 * Infos about the stock
 */
interface StockInfos {
  /**
   * CVM code
   */
  codeCVM: string;
  /**
   * Issuing Company (B3 Code)
   */
  issuingCompany: string;
  /**
   * Company name
   */
  companyName: string;
  /**
   * Trading name (same name as in the brokerage note)
   */
  tradingName: string;
  /**
   * Company's CNPJ
   */
  cnpj: string;
  marketIndicator: string;
  typeBDR: string;
  dateListing: string;
  status: string;
  segment: string;
  segmentEng: string;
  type: string;
  market: string;
}

/**
 * Infos about the page and the total amount of records
 */
interface PageInfo {
  /**
   * Current page number
   */
  pageNumber: number;
  /**
   * Number of results in the page (can be less if it's the last page)
   */
  pageSize: number;
  /**
   * Number of total records
   */
  totalRecords: number;
  /**
   * Number of total pages
   */
  totalPages: number;
}

interface CrawlerRequestResult {
  "page": PageInfo;
  "results": StockInfos[];
}

export class StockParser {

  /**
   * Stocks cached
   */
  protected stocks: StockInfos[] = [];
  /**
   * Auto-update flag
   */
  autoUpdate: boolean = false;
  /**
   * Auto-update timeout
   */
  updaterTimeout = 7*24*3600*1000;
  /**
   * Auto-update timeout when any failure happens
   */
  updaterTimeoutIfFailed = 60*1000;

  /**
   * Crawler URLs
   */
  private urls = {
    listedStocks: `https://sistemaswebb3-listados.b3.com.br/listedCompaniesProxy/CompanyCall/GetInitialCompanies`
  }

  constructor(private outputFullPath: string, autoUpdate: boolean = false) {
    if (!fs.existsSync(outputFullPath)) throw new Error(`[SP] Faltando arquivo ${path.basename(outputFullPath)}`);
    this.stocks = JSON.parse(fs.readFileSync(outputFullPath, 'utf-8'));
    this.autoUpdate = autoUpdate;
    if (this.autoUpdate) {
      this.updater(0);
    }
  }

  /**
   * Update the listed stocks after a timeout
   * @param timeout update after `timeout` milliseconds
   */
  updater(timeout: number = this.updaterTimeout) {
    setTimeout(() => {
      this.getListedStocks()
      .catch(err => {
        print.yellow(`[AS] Error getting listed stocks. Trying again in 1 min`);
        if (err instanceof Error) print.log(err.message);
        this.updater(this.updaterTimeoutIfFailed);
      })
      .then(() => {
        this.updater();
      })
    }, timeout);
  }

  /**
   * Generate a URL page to get the information from. Input is the page number.
   * @param page page number
   * @returns the URL to retrieve the information
   */
  private getUrlByPage(page: number): string {
    return `${this.urls.listedStocks}/${Buffer.from(JSON.stringify(new ListedStocksRequest(page))).toString('base64')}`
  }

  /**
   * Update the current listed stocks
   */
  async getListedStocks(): Promise<void> {
    print.cyan(`[CR] Getting listed stocks`);
    print.high.cyan(`[CR] Page 1`);
    const firstResult = await axios.get(this.getUrlByPage(1), { httpsAgent });
    if (!('data' in firstResult)) throw new Error(`Unexpected response: ${firstResult}`);

    
    let data: CrawlerRequestResult = firstResult.data;
    let results: StockInfos[] = data.results;
    
    while(data.page.totalPages > data.page.pageNumber) {
      print.high.cyan(`[CR] Page ${data.page.pageNumber + 1}`);
      const getResult = await axios.get(this.getUrlByPage(data.page.pageNumber + 1), { httpsAgent });
      if (!('data' in getResult)) throw new Error(`Unexpected response: ${getResult}`);
      data = getResult.data;
      data.page = data.page;
      results.push(...data.results);
    }
    
    print.high.cyan(`[CR] Writing file ${path.basename(this.outputFullPath)}`);
    fs.writeFileSync(this.outputFullPath, JSON.stringify(results));
    this.stocks = results;
    print.green(`[CR] Done. ${results.length} updates.`);

  }

  /**
   * Parse the stock name and returns the stock code
   * @param name title of the stock in the brokerage note
   * @returns the stock code
   */
  getCodeFromTitle(name: string): string {
    // If the stock was manually set
    let legacy: string | undefined = Object.keys(manuallySetStocks).find(key => {
      const envVar = process.env[key];
      return envVar && name.includes(envVar);
    });
    if (legacy) return legacy;

    // If it's a FII, the code is in the name
    let match = name.match(/FII\s.*?\s([^\s]+?)\sCI/i);
    if (match && match[1]) return match[1];

    // Else, parse it
    let type: '3'|'4'|'11' = '3';
    let indexOf: number;
    if (name.indexOf(' ON') !== -1) { indexOf = name.indexOf(' ON'); type = '3'}
    else if (name.indexOf(' PN') !== -1) { indexOf = name.indexOf(' PN'); type = '4'}
    else if (name.indexOf(' UNT') !== -1) { indexOf = name.indexOf(' UNT'); type = '11'}
    else indexOf = name.length;
    let justTheName = name.slice(0, indexOf);
    const stock = this.stocks.find(el => el.tradingName === justTheName);
    if (!stock) throw new Error(`[SP] No stock found for ${name}`);

    return stock.issuingCompany + type;

  }

}
