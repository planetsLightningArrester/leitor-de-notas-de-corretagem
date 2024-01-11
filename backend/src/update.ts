import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import stream from 'stream'
import { app } from 'electron'
import { execSync, spawn } from 'child_process'
import { Print, color } from 'printaeu'
import { finished } from 'stream/promises'
import type { ReadableStream } from 'stream/web'

const logDir = app.getPath('logs')
const tempDir = app.getPath('temp')

/** Logs an info */
const info = Print.create()
info.preAppend(`[${color.magenta}UPDT${color.reset}] [${color.cyan}INFO${color.reset}] `)
info.logToFile(path.join(logDir, 'app.log'))
/** Logs an error */
const err = Print.create()
err.preAppend(`[${color.magenta}UPDT${color.reset}] [${color.red}ERROR${color.reset}] `)
err.logToFile(path.join(logDir, 'app.log'))

/** The info about the new update */
export interface Update {
  /** The update version */
  version: string
  /** The update file name */
  name: string
  /** The update URL */
  url: string
}

/**
 * Check for updates
 * @returns a `Promise` that resolves to the name of the file
 * if there are updates, otherwise resolves to an empty string
 */
export async function getUpdates(): Promise<Update | undefined> {
  const currentVersion = app.getVersion()
  info.log(`App current version is v${currentVersion}`)
  const [currentMajor, currentMinor, currentPatch] = currentVersion.split('.').map(Number)
  const latestReleaseUrl = new URL('https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/releases/latest')
  try {
    const res = await fetch(latestReleaseUrl, { redirect: 'follow' })
    const match = res.url.match(/\/tag\/v(.*)/)
    if (match === null || match.length < 1 || match[1] === '') throw new Error(`Unexpected URL without version number: ${res.url}`)
    else {
      const latestVersion = match[1]
      const [latestMajor, latestMinor, latestPatch] = latestVersion.split('.').map(Number)
      if (
        latestMajor > currentMajor ||
        (latestMajor === currentMajor && latestMinor > currentMinor) ||
        (latestMajor === currentMajor && latestMinor === currentMinor && latestPatch > currentPatch)
      ) {
        let fileName: string
        switch (process.platform) {
          case 'darwin':
            fileName = `Leitor.de.notas.de.corretagem-darwin-x64-${latestVersion}.zip`
            break
          case 'win32':
            fileName = `Leitor.de.notas.de.corretagem-win32-x64-${latestVersion}.zip`
            break
          case 'linux':
            fileName = `Leitor.de.notas.de.corretagem-linux-x64-${latestVersion}.zip`
            break
          default:
            err.log(`Unsupported OS '${process.platform}'`)
            return
        }
        info.log(`Newer version found: v${latestVersion}`)
        return {
          version: latestVersion,
          url: res.url.replace('/tag/', '/download/') + `/${fileName}`,
          name: fileName
        }
      }
    }
  } catch (error: unknown) {
    err.log(`Error reaching the latest release URL ${latestReleaseUrl.href}`)
    if (error instanceof Error) err.log(error.message)
    else err.log(error)
  }
}

/**
 * Download, closes the current app, and install the latest update
 * @param update the `Update` object with version, name, and url to download
 * @throws Error on download failure
 * @copyright modified from https://stackoverflow.com/a/51302466/9139005
 */
export async function installUpdate({ version, name, url }: Update): Promise<void> {
  // Download
  info.log(`Downloading new version v${version}`)
  const compressedFullPath = path.join(tempDir, `leitor-update-${version}.zip`)
  await downloadFile(url, compressedFullPath)
  info.log('New version downloaded successfully')

  // Clean previous install, unzip, and run again
  const installDir = path.dirname(process.execPath)
  let command: string = ''
  switch (process.platform) {
    case 'darwin':
      // INFO: MacOS path is `Leitor de notas de corretagem.app/Contents/MacOS/leitor`
      command = `rm -rf "${installDir}"`
      command += ` && mkdir -p "${path.join(installDir, '..', '..', '..')}"`
      command += ` && unzip -o -d "${path.join(installDir, '..', '..', '..')}" "${compressedFullPath}"`

      // ? INFO: had to split it otherwise the cascade command are killed before the app closes
      execSync(command)
      spawn(process.execPath, { detached: true })

      break
    case 'linux':
      command = `rm -rf "${installDir}"`
      command += ` && mkdir -p "${path.join(installDir, '..')}"`
      command += ` && unzip -o -d "${path.join(installDir, '..')}" "${compressedFullPath}"`

      // ? INFO: had to split it otherwise the cascade command are killed before the app closes
      execSync(command)
      spawn(process.execPath, { detached: true })

      break
    case 'win32':
      command = 'powershell -command "'
      command += `Remove-Item -Recurse -Force '${installDir}';`
      command += `mkdir '${installDir}';`
      command += `Expand-Archive '${compressedFullPath}' -DestinationPath '${installDir}';`
      command += `& '${process.execPath}';`
      command += '"'
      spawn(command, { shell: true, detached: true, cwd: tempDir })
      break
    default:
      err.log(`Unsupported OS to update '${process.platform}'`)
      return
  }

  info.log('File decompressed successfully')
  app.quit()
}

/**
 * Download a file from a `update.url` and save it with a `update.name`
 * @param update the `Update` object with version, name, and url to download
 * @throws Error on download failure
 * @copyright modified from https://stackoverflow.com/a/51302466/9139005
 */
async function downloadFile(url: string, outputFullPath: string): Promise<void> {
  const res = await fetch(url)
  if (res.status !== 200) throw new Error(`Error downloading ${url}: (${res.status}) ${res.statusText}`)
  if (!fs.existsSync(outputFullPath)) {
    const fileStream = fs.createWriteStream(outputFullPath, { flags: 'wx' })

    if (res.body !== null) {
      // INFO: Cast required since Node 18 (https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/65542)
      await finished(stream.Readable.fromWeb(res.body as ReadableStream<any>).pipe(fileStream))
    }
  }
}
