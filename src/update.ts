import { StockParser } from './stockParser';
import path from 'path';

async function main() {
  const crawler = new StockParser(path.join(__dirname, '..', 'stocks.json'));
  await crawler.getListedStocks();
}

main();
