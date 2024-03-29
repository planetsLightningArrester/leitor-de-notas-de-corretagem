// import crypto from 'crypto'
import path from 'path'
import { URL } from 'url'
import { server } from './server'
import { Print, color } from 'printaeu'
import { app, BrowserWindow } from 'electron'

const tempDir = app.getPath('temp')
const logDir = app.getPath('logs')

/** Logs an info */
const info = Print.create()
info.preAppend(`[${color.orange}MAIN${color.reset}] [${color.cyan}INFO${color.reset}] `)
info.logToFile(path.join(logDir, 'app.log'))
/** Logs an error */
const err = Print.create()
err.preAppend(`[${color.orange}MAIN${color.reset}] [${color.red}ERROR${color.reset}] `)
err.logToFile(path.join(logDir, 'app.log'))

info.log(`Temp directory: ${tempDir}`)
info.log(`Log directory: ${logDir}`)

/** Creates a new window and starts the server. Called by `app.whenReady()` */
function createWindow(): void {
  const win = new BrowserWindow({
    width: 1600,
    height: 900,
    minWidth: 800,
    minHeight: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true,
      // https://github.com/doyensec/electronegativity/wiki/AUXCLICK_JS_CHECK
      disableBlinkFeatures: 'Auxclick',
      // https://github.com/doyensec/electronegativity/wiki/NODE_INTEGRATION_JS_CHECK
      nodeIntegration: false
    },
    show: false,
    icon: path.join(__dirname, 'images', 'icon.png')
  })

  // Event listeners on the window
  win.webContents.on('did-finish-load', () => {
    win.menuBarVisible = false
    win.show()
    win.focus()
  })

  const nodeEnv: string = (process.env.NODE_ENV ?? '').trim()
  if (nodeEnv === 'development' || nodeEnv === 'testing') {
    win.loadURL('http://localhost:5173/') /* eng-disable HTTP_RESOURCES_JS_CHECK */
      .catch(reason => {
        err.log(`Error loading the client in '${nodeEnv}' mode`)
        if (reason instanceof Error) err.log(reason.message)
        else err.log(reason)
      })
  } else {
    win.loadFile('./dist/client/index.html')
      .catch(reason => {
        err.log('Error loading the client in "production" mode')
        if (reason instanceof Error) err.log(reason.message)
        else err.log(reason)
      })
  }

  // Start the IPC server
  server(win)
    .catch(reason => {
      err.log('Error starting the IPC server')
      if (reason instanceof Error) err.log(reason.message)
      else err.log(reason)
    })
}

app.whenReady()
  .then(() => {
    createWindow()

    app.on('activate', () => {
      // INFO: On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  })
  .catch(reason => {
    err.log('Error waiting for the app to be ready')
    if (reason instanceof Error) err.log(reason.message)
    else err.log(reason)
  })

app.on('window-all-closed', () => {
  info.log('Closing app')
  // INFO: Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('web-contents-created', (_, contents) => {
  // INFO: If your app has no need to navigate or only needs to navigate to known pages, it is a good idea to limit navigation outright to that known scope, disallowing any other kinds of navigation.
  // https://github.com/electron/electron/blob/main/docs/tutorial/security.md#13-disable-or-limit-navigation
  contents.on('will-navigate', (event, navigationUrl) => {
    if (new URL(navigationUrl).origin !== 'https://github.com') {
      event.preventDefault()
    }
  })
  contents.setWindowOpenHandler(details => {
    if (details.disposition === 'new-window' && new URL(details.url).origin !== 'https://github.com') {
      return { action: 'deny' }
    } else return { action: 'allow' }
  })

  contents.session.setPermissionRequestHandler((webContents, permission, handle) => {
    if (webContents.getURL() !== 'https://github.com' && permission === 'openExternal') {
      handle(false)
    } else handle(true)
  })

  // CSP
  contents.session.webRequest.onHeadersReceived((details, listener) => {
    listener({
      responseHeaders: { /* eng-disable CSP_GLOBAL_CHECK */
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "style-src 'unsafe-inline' 'self' https://cdn.jsdelivr.net https://fonts.googleapis.com",
          "font-src 'unsafe-inline' 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com",
          "img-src 'self' data: ",
          "script-src 'self'",
          "object-src 'none'",
          "require-trusted-types-for 'script'",
        ],
      }
    })
  })
})
