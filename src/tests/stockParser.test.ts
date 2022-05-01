import { StockParser } from '../stockParser';
import path from 'path';

const stockParser = new StockParser(path.join(__dirname, '..', '..', 'stocks.json'));

test('simple parses', async () => {
  expect(stockParser.getCodeFromTitle('FII CSHGURB HGRU11 CI ER')).toBe('HGRU11');
  expect(stockParser.getCodeFromTitle('ITAUSA PN N1')).toBe('ITSA4');
}, 5000*1000);