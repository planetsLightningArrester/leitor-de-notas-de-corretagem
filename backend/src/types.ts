import { type NegotiationNote, type UnknownAsset, type WrongPassword } from 'parser-de-notas-de-corretagem'

/** Object from the client that represents the PDF notes to be parsed */
export interface NoteToBeParsed {
  /** Name of the file. Doesn't have to be the full path. It's just for error tracking */
  name: string
  /** File content as an ArrayBuffer */
  content: ArrayBuffer
  /** Some notes have missing assets */
  missingAsset?: string
}

/** User defined asset */
export interface CustomAsset {
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

/** The output result to send to the client */
export class ProcessNotesResult {
  /** Array of errors found */
  errors: Array<WrongPassword | UnknownAsset>
  /** Array of negotiation notes parsed */
  results: NegotiationNote[]

  constructor(errors: Array<WrongPassword | UnknownAsset>, results: NegotiationNote[]) {
    this.errors = errors
    this.results = results
  }
}
