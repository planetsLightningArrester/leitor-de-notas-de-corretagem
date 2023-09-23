import { NoteToBeParsed } from './types';
import { ipcRenderer, contextBridge } from 'electron';
import { NegotiationNote } from 'parser-de-notas-de-corretagem';

window.addEventListener('DOMContentLoaded', () => {

  // Update the version in the Window
  for (const type of ['chrome', 'node', 'electron']) {
    const version = process.versions[type];
    if (version) {
      const element = document.getElementById(`${type}-version`);
      if (element) element.innerText = version;
    }
  }

  // Replace URLs of Images, since `src` has to start with `/` instead of `./`
  Array.from(document.getElementsByTagName('img')).forEach(i => i.src = i.src.replace(/^file:\/\/\/\w:\//i, './'));

});

/** Context bridge. Map the IPC communication between the client and the server */
contextBridge.exposeInMainWorld("api", {
  /**
   * Send a request to the server to parse brokerage notes
   * @param notes an `Array` of `NoteToBeParsed`
   * @param callback a callback with an `event` and a `result` of the parser
   */
  processNotes: (notes: NoteToBeParsed[], callback: (event: Electron.IpcRendererEvent, result: NegotiationNote[]) => void) => {
    ipcRenderer.send("process-notes", notes);
    ipcRenderer.on("notes-results", (event, ...args) => {
      callback(event, args[0]);
    });
  }
});
