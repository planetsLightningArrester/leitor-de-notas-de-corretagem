import { BrowserWindow, ipcMain } from "electron";

export function server(win: BrowserWindow) {
  let counter = 0;

  // Listen for Counter events and send it back
  ipcMain.on("Counter", (_, args) => {
    console.log(`[INFO] Counter updated to ${args}`);
    counter = args;
    win.webContents.send("Counter", counter);
  });
}