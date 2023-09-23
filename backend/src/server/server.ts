import { NoteToBeParsed } from "../types";
import { BrowserWindow, ipcMain } from "electron";
import { NegotiationNote, NoteParser, WrongPassword } from "parser-de-notas-de-corretagem";
import { Print, color } from "printaeu";

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

  // Listen to client requests
  ipcMain.on("process-notes", async (_, args) => {
    const pdfs: NoteToBeParsed[] = args;
    info.log(`Got ${pdfs.length} notes to parse`);
    const results: NegotiationNote[] = [];
    for await (const pdf of pdfs) {
      try {
        results.push(...await noteParser.parseNote(
          pdf.name,
          Buffer.from(pdf.content),
          ["123"]
        ));
      } catch (error) {
        if (error instanceof WrongPassword) {
          warn.log(`No provided password could open the file '${pdf.name}'`);
        } else err.log(`Error parsing '${pdf.name}'`);
      }
    }
    info.log(`Got ${results.length} results`);
    win.webContents.send("notes-results", results);
  });
}