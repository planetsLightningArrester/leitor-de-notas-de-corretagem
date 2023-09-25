import { Print, color } from "printaeu";
import { NoteToBeParsed } from "../types";
import { BrowserWindow, ipcMain } from "electron";
import { NegotiationNote, NoteParser, WrongPassword as _WrongPassword, UnknownAsset as _UnknownAsset } from "parser-de-notas-de-corretagem";

/** Logs an info */
const info = Print.create();
info.preAppend(`[${color.green}SERV${color.reset}] [${color.cyan}INFO${color.reset}] `);
/** Logs a warning */
const warn = Print.create();
warn.preAppend(`[${color.green}SERV${color.reset}] [${color.yellow}WARN${color.reset}] `);
/** Logs an error */
const err = Print.create();
err.preAppend(`[${color.green}SERV${color.reset}] [${color.red}ERROR${color.reset}] `);


// ? Unfortunately, Error messages extended from `Error` will be stripped out once sent by IPC
// ? Issue: https://github.com/electron/electron/issues/24427
// ? Docs: https://github.com/electron/electron/blob/main/docs/api/ipc-renderer.md#ipcrendererinvokechannel-args
// ? "[...] However, the Error object in the renderer process will not be the same as the one thrown in the main process."
class BasicError {
  /** The error message */
  message: string;
  /** The name of the error */
  name = 'WrongPassword';
  constructor(name: string, message: string) {
    this.name = name;
    this.message = message;
  }
}
class WrongPassword extends BasicError {
  /** File that triggered the error */
  file: string;
  /** Tried passwords */
  passwords: string[];

  /**
   * Create a WrongPassword error
   * @param message error message
   * @param file file that triggered the error
   * @param passwords tried passwords
   */
  constructor(message: string, file: string, passwords: string[]) {
    super("WrongPassword", message);
    this.file = file;
    this.passwords = passwords;
  }
}
class UnknownAsset extends BasicError {
  /** File that triggered the error */
  file: string;
  /** The unknown asset name in the note */
  asset: string;

  /**
   * Create a UnknownAsset error
   * @param message error message
   * @param file file that triggered the error
   * @param asset the unknown asset name in the note
   */
  constructor(message: string, file: string, asset: string) {
    super("UnknownError", message);
    this.file = file;
    this.asset = asset;
  }
}

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

    const errors: Array<WrongPassword | UnknownAsset> = [];
    let results: NegotiationNote[] = [];
    for await (const pdf of pdfs) {
      try {
        results.push(...await noteParser.parseNote(
          pdf.name,
          Buffer.from(pdf.content),
          passwords
        ));
      } catch (error) {
        if (error instanceof _WrongPassword) {
          warn.log(`No provided password could open the file '${error.file}'`);
          errors.push(new WrongPassword(error.message, error.file, error.passwords));
        } else if (error instanceof _UnknownAsset) {
          warn.log(`Unknown asset '${error.asset}'`);
          errors.push(new UnknownAsset(error.message, error.file, error.asset));
        } else {
          console.log(error);
          err.log(`Error parsing '${pdf.name}'`);
        }
      }
    }

    // ? Remove duplicated notes
    results = results.filter((r, i, arr) => !arr.some((_r, _i) => i > _i && r.number === _r.number));
    info.log(`Got ${results.length} results`);

    win.webContents.send("notes-results", [errors, results]);
  });
}