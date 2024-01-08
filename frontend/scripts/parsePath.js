import fs from 'fs'
import path from 'path'
import process from 'process'

if (process.argv.length < 2) {
  throw new Error('Expecting the path to the .html file as the first argument')
}

const pathToHTML = path.join(process.cwd(), process.argv[2])
if (!fs.existsSync(pathToHTML)) {
  throw new Error(`File '${pathToHTML}' doesn't exist`)
}

const pattern = /(href|src)="(\/.*?)"/gm
const newContent = fs.readFileSync(pathToHTML, 'utf-8').replace(pattern, '$1=".$2"')
fs.writeFileSync(pathToHTML, newContent)
