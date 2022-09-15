import fs from 'fs';
import path from 'path';
import { Assets, NegotiationNote } from '../assets';

const assets = new Assets(path.join(__dirname, '..', '..', 'assets.json'));

describe('single page', () => {
  const expected: NegotiationNote[] = [
    {
      "number": "11111",
      "buyTotal": "4054.58",
      "sellTotal": "0.00",
      "buyFees": "1.24",
      "sellFees": "0.00",
      "fees": "1.24",
      "date": "28/03/2022",
      "holder": "rico",
      "deals": [
        {
          "type": "buy",
          "code": "FLRY3",
          "quantity": 62,
          "average": "16.30",
          "price": "1010.91",
          "date": "28/03/2022",
          "cnpj": "60.840.055/0001-31"
        },
        {
          "type": "buy",
          "code": "ALZR11",
          "quantity": 5,
          "average": "112.80",
          "price": "564.02",
          "date": "28/03/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "HGRU11",
          "quantity": 5,
          "average": "112.03",
          "price": "560.17",
          "date": "28/03/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "VISC11",
          "quantity": 15,
          "average": "97.38",
          "price": "1460.69",
          "date": "28/03/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "XPML11",
          "quantity": 5,
          "average": "91.76",
          "price": "458.79",
          "date": "28/03/2022",
          "cnpj": "00.000.000/0000-00"
        }
      ]
    }
  ];
  test('with password', async () => {
    const filePath: string = path.join(__dirname, 'notes', 'rico_single_page_pwd.pdf');
    if (!fs.existsSync(filePath)) throw new Error(`Path ${filePath} doesn't exist`);
    
    let parseResult = await assets.parseNote(filePath);
    expect<NegotiationNote[]>(parseResult).toEqual(expected);
  });
  test('without password', async () => {
    const filePath: string = path.join(__dirname, 'notes', 'rico_single_page.pdf');
    if (!fs.existsSync(filePath)) throw new Error(`Path ${filePath} doesn't exist`);
    
    let parseResult = await assets.parseNote(filePath);
    expect<NegotiationNote[]>(parseResult).toEqual(expected);
  });
});
test('multi page', async () => {
  const filePath: string = path.join(__dirname, 'notes', 'rico_multi_page.pdf');
  if (!fs.existsSync(filePath)) throw new Error(`Path ${filePath} doesn't exist`);
  
  let parseResult = await assets.parseNote(filePath);
  expect<NegotiationNote[]>(parseResult).toEqual([
    {
      "number": "22222",
      "buyTotal": "3556.22",
      "sellTotal": "0.00",
      "buyFees": "1.12",
      "sellFees": "0.00",
      "fees": "1.12",
      "date": "26/07/2022",
      "holder": "rico",
      "deals": [
        {
          "type": "buy",
          "code": "AESB3",
          "quantity": 7,
          "average": "10.44",
          "price": "73.10",
          "date": "26/07/2022",
          "cnpj": "37.663.076/0001-07"
        },
        {
          "type": "buy",
          "code": "B3SA3",
          "quantity": 28,
          "average": "10.75",
          "price": "301.09",
          "date": "26/07/2022",
          "cnpj": "09.346.601/0001-25"
        },
        {
          "type": "buy",
          "code": "CSAN3",
          "quantity": 11,
          "average": "17.70",
          "price": "194.65",
          "date": "26/07/2022",
          "cnpj": "50.746.577/0001-15"
        },
        {
          "type": "buy",
          "code": "FLRY3",
          "quantity": 35,
          "average": "15.05",
          "price": "526.92",
          "date": "26/07/2022",
          "cnpj": "60.840.055/0001-31"
        },
        {
          "type": "buy",
          "code": "ITSA4",
          "quantity": 10,
          "average": "8.53",
          "price": "85.33",
          "date": "26/07/2022",
          "cnpj": "61.532.644/0001-15"
        },
        {
          "type": "buy",
          "code": "KLBN4",
          "quantity": 97,
          "average": "3.71",
          "price": "359.98",
          "date": "26/07/2022",
          "cnpj": "89.637.490/0001-45"
        },
        {
          "type": "buy",
          "code": "RADL3",
          "quantity": 10,
          "average": "20.25",
          "price": "202.46",
          "date": "26/07/2022",
          "cnpj": "61.585.865/0001-51"
        },
        {
          "type": "buy",
          "code": "SAPR4",
          "quantity": 19,
          "average": "3.71",
          "price": "70.51",
          "date": "26/07/2022",
          "cnpj": "76.484.013/0001-45"
        },
        {
          "type": "buy",
          "code": "ALZR11",
          "quantity": 1,
          "average": "112.94",
          "price": "112.94",
          "date": "26/07/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "HGLG11",
          "quantity": 3,
          "average": "167.28",
          "price": "501.85",
          "date": "26/07/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "HGRU11",
          "quantity": 2,
          "average": "119.49",
          "price": "238.98",
          "date": "26/07/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "HGRE11",
          "quantity": 4,
          "average": "127.04",
          "price": "508.16",
          "date": "26/07/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "XPLG11",
          "quantity": 3,
          "average": "94.74",
          "price": "284.22",
          "date": "26/07/2022",
          "cnpj": "00.000.000/0000-00"
        },
        {
          "type": "buy",
          "code": "XPML11",
          "quantity": 1,
          "average": "96.03",
          "price": "96.03",
          "date": "26/07/2022",
          "cnpj": "00.000.000/0000-00"
        }
      ]
    }
  ]);
  
});
