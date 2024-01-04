/// <reference types="svelte" />
/// <reference types="vite/client" />

/** Object from the client that represents the PDF notes to be parsed */
interface NoteToBeParsed {
  /** Name of the file. Doesn't have to be the full path. It's just for error tracking */
  name: string
  /** File content as an ArrayBuffer */
  content: ArrayBuffer
  /** Some notes have missing assets */
  missingAsset?: string
}

/** User defined asset */
interface CustomAsset {
  /**
   * Asset code
   * @example "ABEV3"
   */
  code: string
  /** The asset name */
  name: string
  /** Code CNPJ */
  cnpj: string
  /** Whether the asset is a FII (Fundo de Investimento Imobiliário) */
  isFII: boolean
}

/** The info about the new update */
interface Update {
  /** The update version */
  version: string
  /** The update file name */
  name: string
  /** The update URL */
  url: string
}

interface Window {
  api: {
    /**
     * Send a request to the server to parse brokerage notes
     * @param notes an `Array` of `NoteToBeParsed`
     * @param callback a callback with an `event` and a `result` of the parser
     */
    processNotes: (notes: NoteToBeParsed[], passwords: string[], customAssets: CustomAsset[]) => Promise<[Array<WrongPassword | UnknownAsset>, NegotiationNote[]]>
    /**
     * Check if there are updates
     * @returns a `Promise` that resolves to the name of the file
     * if there are updates, otherwise resolves to an empty string
     */
    checkUpdates: () => Promise<Update | undefined>
    /**
     * Send a request to the server to proceed with the app update
     * @param the update to install
     */
    proceedWithUpdate: (update: Update) => void
  }
}
