import { CustomAsset, NoteToBeParsed } from './types';
import { ipcRenderer, contextBridge } from 'electron';
import { NegotiationNote, UnknownAsset, WrongPassword } from 'parser-de-notas-de-corretagem';

window.addEventListener('DOMContentLoaded', () => {

  // Update the version in the Window
  for (const type of ['chrome', 'node', 'electron']) {
    const version = process.versions[type];
    if (version) {
      const element = document.getElementById(`${type}-version`);
      if (element) element.innerText = version;
    }
  }

});

/** Context bridge. Map the IPC communication between the client and the server */
contextBridge.exposeInMainWorld("api", {
  /**
   * Send a request to the server to parse brokerage notes
   * @param notes an `Array` of `NoteToBeParsed`
   * @param callback a callback with an `event` and a `result` of the parser
   */
  processNotes: async (notes: NoteToBeParsed[], passwords: string[], customAssets: CustomAsset[]): Promise<[Array<WrongPassword | UnknownAsset>, NegotiationNote[]]> => {
    ipcRenderer.send("process-notes", notes, passwords, customAssets);
    return await new Promise<[Array<WrongPassword | UnknownAsset>, NegotiationNote[]]>(resolve => {
      ipcRenderer.on("notes-results", (_, ...args) => {
        const errors: Array<WrongPassword | UnknownAsset> = args[0][0];
        const results: NegotiationNote[] = args[0][1];
        resolve([errors, results]);
      });
    });
  }
});
