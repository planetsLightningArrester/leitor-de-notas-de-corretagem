import { AssetParser } from '../assetParser';
import path from 'path';

async function main() {
  const crawler = new AssetParser(path.join(__dirname, '..', '..', 'assets.json'));
  await crawler.getListedAssets();
}

main();
