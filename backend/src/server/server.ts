import { Print, color } from "printaeu";
import { NoteToBeParsed } from "../types";
import { BrowserWindow, ipcMain } from "electron";
import { NegotiationNote, NoteParser, WrongPassword } from "parser-de-notas-de-corretagem";

/** Logs an info */
const info = Print.create();
info.preAppend(`[${color.green}SERV${color.reset}] [${color.cyan}INFO${color.reset}] `);
/** Logs a warning */
const warn = Print.create();
warn.preAppend(`[${color.green}SERV${color.reset}] [${color.yellow}WARN${color.reset}] `);
/** Logs an error */
const err = Print.create();
err.preAppend(`[${color.green}SERV${color.reset}] [${color.red}ERROR${color.reset}] `);

/**
 * Starts an IPC server to communicate with the client. The
 * context bridge defining the IPC is declared inside `preload.ts`
 * @param win an Electron `BrowserWindow`
 */
export async function server(win: BrowserWindow) {
  const noteParser = new NoteParser();
  const passwords: string[] = ['000'];

  // Listen to client requests
  ipcMain.on("process-notes", async (_, ...args) => {
    const pdfs: NoteToBeParsed[] = args[0];
    const _passwords: string[] = args[1];
    passwords.push(..._passwords.filter(i => !passwords.includes(i)));
    info.log(`Got ${pdfs.length} notes to parse`);

    const errors: WrongPassword[] = [];
    let results: NegotiationNote[] = [];
    for await (const pdf of pdfs) {
      try {
        results.push(...await noteParser.parseNote(
          pdf.name,
          Buffer.from(pdf.content),
          passwords
        ));
      } catch (error) {
        if (error instanceof WrongPassword) {
          warn.log(`No provided password could open the file '${pdf.name}'`);
          errors.push(new WrongPassword(pdf.name));
        } else {
          console.log(error);
          err.log(`Error parsing '${pdf.name}'`);
        }
      }
    }
    results = results.filter((r, i, arr) => !arr.some((_r, _i) => i > _i && r.number === _r.number));
    info.log(`Got ${results.length} results`);
    win.webContents.send("notes-results", [errors, results]);
  });
}