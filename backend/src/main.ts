import path from 'path';
import { URL } from 'url';
import { server } from './server';
import { app, BrowserWindow } from 'electron';
import { handleSquirrelEvent } from './update';

// ? Prevent the app from start if it's being updated/installed/uninstalled
// ? https://www.electronforge.io/config/makers/squirrel.windows
handleSquirrelEvent(app);

/** Creates a new window and starts the server. Called by `app.whenReady()` */
function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      disableBlinkFeatures: "Auxclick",  // https://github.com/doyensec/electronegativity/wiki/AUXCLICK_JS_CHECK
    },
    show: false,
    icon: path.join(__dirname, 'images', 'icon.png')
  });

  // Event listeners on the window
  win.webContents.on("did-finish-load", () => {
    win.menuBarVisible = false;
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

// If your app has no need to navigate or only needs to navigate to known pages, it is a good idea to limit navigation outright to that known scope, disallowing any other kinds of navigation.
// https://github.com/electron/electron/blob/main/docs/tutorial/security.md#13-disable-or-limit-navigation
app.on('web-contents-created', (_, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    if (new URL(navigationUrl).origin !== 'https://github.com') {
      event.preventDefault()
    }
  })
})