# Electron project with Typescript
If you have the client in another place, you can also connect to it using `npm run start:dev`. [Playwright](https://github.com/microsoft/playwright) is already set for testing and also as a GitHub Workflow!

Below, I use `http://localhost:5173` as an example of server you can connect in development mode, like when you have another frontend framework being served. Nevertheless, there's a local client example inside `src/client` which is used by default.

# Usage

## Running
### `npm run start`
> npm run start
It runs `nodemon` which will:
1. Delete `dist/`
2. Compile the Typescript inside `src/` to JS inside `dist/`
3. Copy `src/client/` to `dist/`
4. Start electron opening `src/client/index.html`
5. Watch for any changes inside `src/` and re-start the run process

### `npm run start:dev`
> npm run start:dev
It runs `nodemon` which will:
1. Set `NODE_ENV` to `development`
2. Delete `dist/`
3. Compile the Typescript inside `src/` to JS inside `dist/`
4. Copy `src/client/index.html` to `dist/`, but it's not used (see #5 below)
5. Start electron opening `http://localhost:5173`
6. Watch for any changes inside `src/` and re-start the run process

## Testing
### `npm run test`
1. Delete `dist/`
2. Compile the Typescript inside `src/` to JS inside `dist/`
3. Copy `src/client/` to `dist/`
4. Run the tests inside `src/__tests__/*.spec.ts`

### `npm run test`
1. Set `NODE_ENV` to `development`
2. Delete `dist/`
3. Compile the Typescript inside `src/` to JS inside `dist/`
4. Copy `src/client/` to `dist/`, but it's not used
5. Run the tests inside `src/__tests__/*.spec.ts`, showing the page `http://localhost:5173`

## Debugging
Pre-configured debugger for Typescript in VSCode:
* `Electron: Main`: debug the Electron main process
* `Electron: Renderer`: debug the Electron renderer
* `Electron: All`: enable both debugs above

> Based on [abartho](https://github.com/abartho/electron-typescript-vscode)'s work

Use the [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for VSCode to [debug tests](https://playwright.dev/docs/getting-started-vscode)

## Pack and distribute
### `npm run make`
It creates a `out` dir with the binaries of your application
See [here](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging) and [here](https://www.electronforge.io/cli) for packaging options.