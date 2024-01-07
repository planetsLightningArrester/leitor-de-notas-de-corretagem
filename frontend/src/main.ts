import App from './App.svelte'

const appElement = document.getElementById('app')
if (appElement === null) throw new Error("Couldn't find the element with the ID 'app")

const app = new App({
  target: appElement
})

export default app
