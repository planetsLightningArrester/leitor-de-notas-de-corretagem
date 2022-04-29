import { StockParser } from '../assets';

const stockParser = new StockParser();

test('simple parses', async () => {
  expect(await stockParser.getCodeFromTitle('FII CSHGURB HGRU11 CI ER')).toBe('HGRU11');
  expect(await stockParser.getCodeFromTitle('ITAUSA PN N1')).toBe('ITSA4');
}, 5000*1000);