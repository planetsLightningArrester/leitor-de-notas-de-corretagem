# Brokerage Note Reader - backend

An [Electron](https://www.electronjs.org/) app in Typescript built with [Electron Forge](https://www.electronforge.io/)

# Usage

## Running

### `npm run start`

#### What's for

Close to what build will look like

#### Requirements

- Client built in `src/client`

#### What it does

> npm run start

1. Delete `dist/`
2. Compile the Typescript inside `src/` to JS inside `dist/`
3. Copy `src/images/` to `dist/`
4. Copy `src/client/` to `dist/`
5. Start electron opening `src/client/index.html`

---

### `npm run start:dev`

#### What's for

Called by parent `../package.json:npm run start`

#### Requirements

- Frontend running and serving on `http://localhost:5173`. See [frontend](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/tree/main/frontend).


#### What it does

> npm run start:dev

It runs `nodemon` (see the [configs](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/blob/main/backend/nodemon.json)) which will:
1. Set `NODE_ENV` to `development`
2. Delete `dist/`
3. Compile the Typescript inside `src/` to JS inside `dist/`
4. Copy `src/images/` to `dist/`
5. Start electron opening `http://localhost:5173` (requires Frontend to be running)
6. Watch for any changes inside `src/` and re-start the run process

## Testing

### `npm run test`

#### What's for

It's the only test in the whole repository. Called by parent `../package.json:npm run test`

#### Requirements

- Frontend must **NOT** be running, because the test will trigger it

#### What it does

1. Set `NODE_ENV` to `testing`
2. Trigger playwright, which will:
   1. Goes to `../frontend` and `npm run dev` to start the server
   2. Run the tests inside `src/__tests__/*.spec.ts` in **parallel**
   3. Tests will fail if any test or group uses `.only`. For that, use `npm run test:dev` instead

> **NOTE:** On Linux, the tests run in hidden screens (`xvfb-run`)

---

### `npm run test:dev`

#### What's for

Similar `npm run test`, but allows `.only` and watches for changes to re-run tests automatically

#### Requirements

- Frontend running and serving on `http://localhost:5173`. See [frontend](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/tree/main/frontend).

#### What it does

1. Set `NODE_ENV` to `development`
2. Runs `nodemon` (see the [configs for test](https://github.com/planetsLightningArrester/leitor-de-notas-de-corretagem/blob/main/backend/nodemon.test.json)). Nodemon triggers playwright which will
   1. Run the tests inside `src/__tests__/*.spec.ts` in **series**
   2. Auto re-run on updates under `backend/src`

> **NOTE:** Different from `npm run test`, there are no hidden screens (won't run with `xvfb-run`)

## Debugging

Pre-configured debugger for Electron + Svelte project in VSCode:
* `Electron & Svelte debug`: start both Electron (backend) and Svelte (frontend)
* `Electron rendering frontend`: start only Electron and use the built version of Svelte
* `Svelte-launch`: start only Svelte

> Based on [abartho](https://github.com/abartho/electron-typescript-vscode)'s work

Use the [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for VSCode to [debug tests](https://playwright.dev/docs/getting-started-vscode)

---

## Pack and distribute

### `npm run make`

It creates a `dist` dir with the binaries of your application. It will use the built version of the frontend inside `backend/src/client`, so to build everything from the beginning is a good idea to run `npm run build` from the parent `../package.json`.

See [here](https://www.electronjs.org/docs/latest/tutorial/tutorial-packaging) and [here](https://www.electronforge.io/cli) for packaging options.