import path from 'path';
import { app, BrowserWindow } from 'electron';
// import bootstrap from 'bootstrap';

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: true
    },
    icon: path.join(__dirname, 'images', 'icon.png')
  });
  win.setMaximumSize(1600, 900);

  const nodeEnv = (process.env['NODE_ENV'] || '').trim();
  if (nodeEnv !== 'development') {
    win.loadFile('./src/renderer/index.html');
  } else win.loadFile('./dist/renderer/index.html');

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});