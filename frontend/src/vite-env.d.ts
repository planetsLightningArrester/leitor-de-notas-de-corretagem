/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
  api: {
    getCounterResponseFromServer: (func: (event: Electron.IpcRendererEvent, counter: number) => void) => void,
    updateServerCounter: (counter: number) => void
  }
}