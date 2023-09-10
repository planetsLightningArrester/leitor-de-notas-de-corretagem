import { ipcRenderer, contextBridge } from 'electron';

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
  updateServerCounter: function (counter: number) {
    ipcRenderer.send("Counter", counter);
  },
  getCounterResponseFromServer: function (func: (event: Electron.IpcRendererEvent, counter: number) => void) {
    ipcRenderer.on("Counter", (event, ...args) => {
      func(event, args[0]);
    });
  }
});
