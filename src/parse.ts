import fs from 'fs';
import path from 'path';
import { print } from 'printaeu';
import { NegotiationNote, Deal, NoteParser } from 'parser-de-notas-de-corretagem';

const passwords = require('dotenv').config({ path: path.join(__dirname, '..', 'config.env') }).parsed;
const manuallySetAssets: { [key: string]: string } = require('dotenv').config({ path: path.join(__dirname, '..', 'assets.env') }).parsed;

async function main() {

  print.green(`Leitor de Notas de Negociação - GNU GPLv3`);
  
  const noteParser = new NoteParser();
  if (manuallySetAssets) {
    Object.keys(manuallySetAssets).forEach(key => {
      noteParser.defineStock(key, manuallySetAssets[key]);
    });
  }
  
  const result: NegotiationNote[] = [];
  const notesPath: string = path.join(__dirname, '..', 'adicione_notas_aqui');
  print.dim.magenta(`Lendo diretório ${notesPath}`);
  if (!fs.existsSync(notesPath)) throw new Error(`Path ${notesPath} doesn't exist`);
  
  const directory = fs.readdirSync(notesPath, {withFileTypes: true});
  let numberOfPdf = 0;
  for await (const file of directory) {
    if (file.isFile() && file.name.endsWith('.pdf')) {
      numberOfPdf++;
      const filePath = path.join(notesPath, file.name);
      const parseResult = await noteParser.parseNote(filePath, fs.readFileSync(filePath), Object.values(passwords))
      .catch((err: Error) => print.red(err.message));
      if (parseResult) {
        parseResult.forEach(note => {
          if (!result.some(el => el.number === note.number)) {
            print.magenta(`Nota ${note.number} processada.`);
            result.push(note);
          }
        });
      }
    }
  }
  
  print.green(`Foram encontrados ${numberOfPdf} PDFs no diretório ${notesPath}. Notas duplicadas serão analisadas e individualmente ignoradas.`);
  
  if (!result.length) {
    print.yellow(`Nenhuma nota foi encontrada na pasta ${notesPath}. As notas devem estar em formato .pdf`);
    return;
  }
  
  const allDeals: Deal[][] = [];
  result.forEach(note => {
    note.deals.forEach(deal => {
      const index = allDeals.findIndex(el => el.some(subEl => subEl.code === deal.code));
      if (index === -1) {
        allDeals.push([deal]);
      } else {
        allDeals[index].push(deal);
      }
    });
  });
  
  let csvResult = `Código\tCNPJ\tData\tC/V\tQuantidade\tPreço+custos\n`;
  allDeals.forEach(asset => {
    asset.forEach(deal => {
      csvResult += `${deal.code}\t${deal.cnpj}\t${deal.date}\t${deal.type === 'buy'?'C':'V'}\t${deal.quantity}\t${deal.price.replace(/\./g, ',')}\n`;
    });
    csvResult += `\n`;
  });
  
  fs.writeFileSync(path.join(__dirname, '..', 'Resultado.csv'), csvResult);
  
  print.green(`Todas as ${result.length} notas foram processadas`);
  print.green(`O arquivo "Resultado.csv" foi gerado no diretório atual.`);
}

main();
