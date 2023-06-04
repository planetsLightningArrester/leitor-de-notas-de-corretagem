import fs from 'fs';
import path from 'path';
import { Assets, NegotiationNote } from '../assets';

const assets = new Assets(path.join(__dirname, '..', '..', 'assets.json'));

describe('single page', () => {
  const expected: NegotiationNote[] = [
    {
      "number": "18772836",
      "buyTotal": "2056.61",
      "sellTotal": "0.00",
      "buyFees": "0.61",
      "sellFees": "0.00",
      "fees": "0.61",
      "date": "29/11/2022",
      "holder": "inter",
      "deals": [{
        "type": "buy",
        "code": "KDIF11",
        "quantity": 16,
        "average": "128.54",
        "price": "2056.61",
        "date": "29/11/2022",
        "cnpj": "00.000.000/0000-00"
      }]
    }
  ];
  test('without password', async () => {
    const filePath: string = path.join(__dirname, 'notes', 'inter_single_page.pdf');
    if (!fs.existsSync(filePath)) throw new Error(`Path ${filePath} doesn't exist`);
    
    let parseResult = await assets.parseNote(filePath);
    expect<NegotiationNote[]>(parseResult).toEqual(expected);
  });
});
