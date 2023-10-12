import path from 'path';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';

/**
 * Spawn the update process
 * @param args arguments to be passed to `Update.exe`
 * @returns the spawned process, if not an error
 */
function spawnUpdate(args: string[]) {
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  let spawnedProcess: ChildProcessWithoutNullStreams | undefined;

  try {
    spawnedProcess = spawn(updateDotExe, args, { detached: true });
  } catch (error: unknown) {
    console.log(error);
  }

  return spawnedProcess;
}

/**
 * Handle events where the app is being updated/installed/uninstalled
 * @returns `true` if the app should quit and `false` otherwise
 */
export function handleSquirrelEvent(app: Electron.App): void {
  if (process.argv.length === 1) return;

  const exeName = path.basename(process.execPath);
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      break;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      break;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      break;
  }
}