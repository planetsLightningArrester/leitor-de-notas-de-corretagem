import { print } from 'printaeu';
import fs from 'fs';
import path from 'path';
import { Assets, NegotiationNote, Deal } from '../assets';

const jestConsole = console;

beforeEach(() => {
  global.console = require('console');
});

afterEach(() => {
  global.console = jestConsole;
});

const assets = new Assets(path.join(__dirname, '..', '..', 'stocks.json'));

test('Notes parser', async () => {
  let parsedResult: NegotiationNote[] = [];
  const dirPath: string = path.join(__dirname, '..', '..', 'adicione_notas_aqui');
  if (!fs.existsSync(dirPath)) throw new Error(`Path ${dirPath} doesn't exist`);

  let directory = fs.readdirSync(dirPath, {withFileTypes: true});
  let numberOfPdf: number = 0;
  for await (let file of directory) {
    if (file.isFile() && file.name.endsWith('.pdf')) {
      numberOfPdf++;
      let parseResult = await assets.parseNote(path.join(dirPath, file.name));
      parseResult.forEach(note => {
        if (!parsedResult.some(el => el.number === note.number)) {
          print.magenta(`Nota ${note.number} processada.`);
          parsedResult.push(note);
        }
      });
    }
  }

  print.green(`Foram encontrados ${numberOfPdf} PDFs no diretório ${dirPath}. Notas duplicadas serão analisadas e individualmente ignoradas.`);

  if (!parsedResult.length) {
    print.yellow(`Nenhuma nota foi encontrada na pasta src/tests/pdf. As notas devem estar em formato .pdf`);
    return;
  }

  let allDeals: Deal[][] = [];
  parsedResult.forEach(note => {
    note.deals.forEach(deal => {
      let index = allDeals.findIndex(el => el.some(subEl => subEl.code === deal.code));
      if (index === -1) {
        allDeals.push([deal]);
      } else {
        allDeals[index].push(deal);
      }
    })
  });

  let result: string = `Código\tData\tC/V\tQuantidade\tPreço+custos\n`;
  allDeals.forEach(stock => {
    stock.forEach(deal => {
      result += `${deal.code}\t${deal.date}\t${deal.type=='buy'?'C':'V'}\t${deal.quantity}\t${deal.price.replace(/\./g, ',')}\n`;
    })
    result += `\n`;
  });

  fs.writeFileSync(path.join(__dirname, '..', '..', 'Resultado.csv'), result);

  print.green(`Todas as ${parsedResult.length} notas foram processadas`);
  print.green(`O arquivo "Resultado.csv" foi gerado.`);

}, 5000*1000);