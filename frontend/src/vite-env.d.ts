/// <reference types="svelte" />
/// <reference types="vite/client" />

interface Window {
  api: {
    processNotes: (callback: (event: Electron.IpcRendererEvent, counter: number) => void) => void
  }
}