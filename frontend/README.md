# Brokerage Note Reader - frontend

A [Svelte](https://svelte.dev/) app in Typescript. Its built version under `dist` is copied to `../backend/src/client` during the build process.

# Usage

## Running

### `npm run dev`

#### What's for

Start a server for Svelte. Use the Electron app at `../backend` to load this

#### Requirements

- None

#### What it does

> npm run dev

1. Set `NODE_ENV` to `testing`
2. Start a `localhost` server
3. Hot-reload everything on any changes inside `frontend/src`

---

## Testing

There are no frontend tests. All tests are e2e and are done in `../backend`

## Debugging

Pre-configured debugger for Electron + Svelte project in VSCode:
* `Electron & Svelte debug`: start both Electron (backend) and Svelte (frontend)
* `Electron rendering frontend`: start only Electron and use the built version of Svelte
* `Svelte-launch`: start only Svelte

> Based on [abartho](https://github.com/abartho/electron-typescript-vscode)'s work

Use the [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for VSCode to [debug tests](https://playwright.dev/docs/getting-started-vscode)

## Build

### `npm run build`

#### What's for

Make a build and copy it to `../backend/src/client`

#### Requirements

- None

#### What it does

> npm run build

1. Build everything to `dist`
2. Call `scripts/parsePaths.js` to replace `href`s starting with `/` by `./` (Electron style)
3. Copy `dist` to `../backend/src/client`