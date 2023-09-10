import path from 'path';
import { server } from './server';
import { app, BrowserWindow } from 'electron';

/** Creates a new window and starts the server. Called by `app.whenReady()` */
function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 600,
    maxWidth: 1600,
    maxHeight: 900,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true
    },
    show: false,
    icon: path.join(__dirname, 'images', 'icon.png')
  });

  // Event listeners on the window
  win.webContents.on("did-finish-load", () => {
    win.show();
    win.focus();
  });

  const nodeEnv = (process.env['NODE_ENV'] || '').trim();
  if (nodeEnv === 'development') win.loadURL('http://localhost:5173/');
  else win.loadFile('./dist/client/index.html');

  // Start the IPC server
  server(win);

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
