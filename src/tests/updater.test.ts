
import { AssetParser } from '../assetParser';
import path from 'path';

const assetsParser = new AssetParser(path.join(__dirname, '..', '..', 'assets.json'));

test('simple crawler', async () => {
  await assetsParser.getListedAssets();
}, 5000*1000);