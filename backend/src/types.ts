/** Object from the client that represents the PDF notes to be parsed */
export interface NoteToBeParsed {
  /** Name of the file. Doesn't have to be the full path. It's just for error tracking */
  name: string,
  /** File content as an ArrayBuffer */
  content: ArrayBuffer
}