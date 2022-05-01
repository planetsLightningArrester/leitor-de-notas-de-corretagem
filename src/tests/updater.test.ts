
import { StockParser } from '../stockParser';
import path from 'path';

const stocksParser = new StockParser(path.join(__dirname, '..', '..', 'stocks.json'));

test('simple crawler', async () => {
  await stocksParser.getListedStocks();
}, 5000*1000);