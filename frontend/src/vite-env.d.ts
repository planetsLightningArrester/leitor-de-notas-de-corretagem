/// <reference types="svelte" />
/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/naming-convention
const { NegotiationNote } = require("parser-de-notas-de-corretagem");

/** Object from the client that represents the PDF notes to be parsed */
interface NoteToBeParsed {
  /** Name of the file. Doesn't have to be the full path. It's just for error tracking */
  name: string,
  /** File content as an ArrayBuffer */
  content: ArrayBuffer
}

interface Window {
  api: {
    /**
     * Send a request to the server to parse brokerage notes
     * @param notes an `Array` of `NoteToBeParsed`
     * @param callback a callback with an `event` and a `result` of the parser
     */
    processNotes: (notes: NoteToBeParsed[], callback: (event: Electron.IpcRendererEvent, result: NegotiationNote[]) => void) => void
  }
}