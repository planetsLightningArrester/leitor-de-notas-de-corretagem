import { type Update } from './update'
import { ipcRenderer, contextBridge } from 'electron'
import { type ProcessNotesResult, type CustomAsset, type NoteToBeParsed } from './types'

window.addEventListener('DOMContentLoaded', () => {
  // Update the version in the Window
  for (const type of ['chrome', 'node', 'electron']) {
    const version = process.versions[type]
    if (typeof version !== 'undefined') {
      const element = document.getElementById(`${type}-version`)
      if (element !== null) element.innerText = version
    }
  }
})

/** Context bridge. Map the IPC communication between the client and the server */
contextBridge.exposeInMainWorld('api', {
  /**
   * Send a request to the server to parse brokerage notes
   * @param notes an `Array` of `NoteToBeParsed`
   * @param callback a callback with an `event` and a `result` of the parser
   */
  processNotes: async (notes: NoteToBeParsed[], passwords: string[], customAssets: CustomAsset[]): Promise<ProcessNotesResult> => {
    // TODO: type check if the incoming data is as expected
    ipcRenderer.send('process-notes', notes, passwords, customAssets)
    return await new Promise<ProcessNotesResult>(resolve => {
      ipcRenderer.on('notes-results', (_, ...args) => {
        const processNotesResults: ProcessNotesResult = args[0]
        resolve(processNotesResults)
      })
    })
  },
  /** Send a request to the server to proceed with the app update */
  checkUpdates: async (): Promise<Update | undefined> => {
    ipcRenderer.send('check-updates')
    return await new Promise<Update | undefined>(resolve => {
      ipcRenderer.on('update-results', (_, ...args) => {
        const update: Update | undefined = args[0]
        resolve(update)
      })
    })
  },
  /**
   * Send a request to the server to proceed with the app update
   * @param the update to install
   */
  proceedWithUpdate: (update: Update): void => {
    ipcRenderer.send('proceed-with-update', update)
  }
})
