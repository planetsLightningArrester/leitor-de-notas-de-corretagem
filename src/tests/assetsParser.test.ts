import { AssetParser } from '../assetParser';
import path from 'path';

const assetParser = new AssetParser(path.join(__dirname, '..', '..', 'assets.json'));

test('simple parses', async () => {
  expect(assetParser.getCodeFromTitle('FII CSHGURB HGRU11 CI ER').code).toBe('HGRU11');
  expect(assetParser.getCodeFromTitle('ITAUSA PN N1').code).toBe('ITSA4');
}, 5000*1000);