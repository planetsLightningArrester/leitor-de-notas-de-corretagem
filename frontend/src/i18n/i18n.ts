import { addMessages, getLocaleFromNavigator, init } from 'svelte-i18n'

import ptBr from './locales/pt-br.json'
import enUs from './locales/en-us.json'
import esMX from './locales/es-mx.json'
import zhCN from './locales/zh-cn.json'

addMessages('pt-BR', ptBr)
addMessages('en-US', enUs)
addMessages('es-MX', esMX)
addMessages('zh-CN', zhCN)

const initPromise = init({
  fallbackLocale: 'pt-BR',
  initialLocale: getLocaleFromNavigator(),
})

if (initPromise instanceof Object && 'then' in initPromise) initPromise.catch(reason => {
  console.error('Error setting up the supported languages')
  if (reason instanceof Error) console.error(reason.message)
  else console.error(reason)
})
