import path from 'path'
import { test, expect, _electron as electron, type FileChooser } from '@playwright/test'

test('open a single page file', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles(path.join(__dirname, 'notes', 'rico_single_page.pdf'))
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('1 nota adicionada')

  // Click on the tab and check its content
  const noteTab = window.getByTestId('tab-11111')
  await noteTab.waitFor({ state: 'visible', timeout: 2000 })
  await noteTab.click()
  const noteTabALZR = window.getByTestId('tab-11111-ALZR11')
  await noteTabALZR.waitFor({ state: 'visible', timeout: 2000 })
})

test('open a single page file with password', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles(path.join(__dirname, 'notes', 'clear_single_page_sell_pwd.pdf'))
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification with a warning and close it
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('Nenhuma nova nota adicionada')
  const pushNotificationCloseButton = window.getByTestId('push-notification-close')
  await pushNotificationCloseButton.click()
  await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })

  // Enter the password
  const passwordInput1 = window.getByTestId('password-input-1')
  const passwordInput2 = window.getByTestId('password-input-2')
  await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput1.fill('123')
  await passwordInput2.fill('456')

  // Press enter to retry
  const retryPasswordButton = window.getByTestId('retry-password-button')
  await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
  await retryPasswordButton.click()

  // Check for the push notification
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('1 nota adicionada')

  // Click on the tab and check its content
  const noteTab = window.getByTestId('tab-44444')
  await noteTab.waitFor({ state: 'visible', timeout: 2000 })
  await noteTab.click()
  const noteTabITSA = window.getByTestId('tab-44444-ITSA3')
  await noteTabITSA.waitFor({ state: 'visible', timeout: 2000 })
})

test('open a multi page file', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles(path.join(__dirname, 'notes', 'clear_multi_page.pdf'))
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('1 nota adicionada')

  // Click on the tab and check its content
  const noteTab = window.getByTestId('tab-33333')
  await noteTab.waitFor({ state: 'visible', timeout: 2000 })
  await noteTab.click()
  const noteTabXPML = window.getByTestId('tab-33333-XPML11')
  await noteTabXPML.waitFor({ state: 'visible', timeout: 2000 })
})

test('open multiple files', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles([path.join(__dirname, 'notes', 'clear_multi_page.pdf'), path.join(__dirname, 'notes', 'clear_single_page_sell.pdf')])
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('2 notas adicionadas')

  // Click on the tab and check its content
  let noteTab = window.getByTestId('tab-33333')
  await noteTab.waitFor({ state: 'visible', timeout: 2000 })
  await noteTab.click()
  const noteTabXPML = window.getByTestId('tab-33333-XPML11')
  await noteTabXPML.waitFor({ state: 'visible', timeout: 2000 })

  // Click on the tab and check its content
  noteTab = window.getByTestId('tab-44444')
  await noteTab.waitFor({ state: 'visible', timeout: 2000 })
  await noteTab.click()
  const noteTabITSA = window.getByTestId('tab-44444-ITSA3')
  await noteTabITSA.waitFor({ state: 'visible', timeout: 2000 })
})

test('open multiple files with password', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles([path.join(__dirname, 'notes', 'rico_single_page_pwd.pdf'), path.join(__dirname, 'notes', 'clear_single_page_sell_pwd.pdf')])
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification with a warning and close it
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('Nenhuma nova nota adicionada')
  const pushNotificationCloseButton = window.getByTestId('push-notification-close')
  await pushNotificationCloseButton.click()
  await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })

  // Enter the password
  const passwordInput1 = window.getByTestId('password-input-1')
  const passwordInput2 = window.getByTestId('password-input-2')
  await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput1.fill('123')
  await passwordInput2.fill('456')

  // Press enter to retry
  const retryPasswordButton = window.getByTestId('retry-password-button')
  await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
  await retryPasswordButton.click()

  // Check for the push notification
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('2 notas adicionadas')
})

test('open multiple files, some with password', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles([
        path.join(__dirname, 'notes', 'rico_single_page_pwd.pdf'),
        path.join(__dirname, 'notes', 'clear_single_page_sell.pdf'),
        path.join(__dirname, 'notes', 'rico_multi_page.pdf'),
      ])
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification with a warning and close it
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('2 notas adicionadas')
  const pushNotificationCloseButton = window.getByTestId('push-notification-close')
  await pushNotificationCloseButton.click()
  await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })

  // Enter the password
  const passwordInput1 = window.getByTestId('password-input-1')
  const passwordInput2 = window.getByTestId('password-input-2')
  await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput1.fill('123')
  await passwordInput2.fill('456')

  // Press enter to retry
  const retryPasswordButton = window.getByTestId('retry-password-button')
  await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
  await retryPasswordButton.click()

  // Check for the push notification
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('1 nota adicionada')
})

test('open multiple duplicated files', async () => {
  const electronApp = await electron.launch({ args: ['.'] })

  const window = await electronApp.firstWindow()

  // Change locale to pt-br
  const ptBrButton = window.getByTestId('pt-BR-button')
  expect(ptBrButton).not.toBe(undefined)
  await ptBrButton.click()

  const dropZoneButton = window.getByTestId('drop-zone-button')
  expect(dropZoneButton).not.toBe(undefined)
  const fileChooserPromise = new Promise<void>((resolve) => {
    const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
      window.off('filechooser', fileChooserListener)
      await fileChooser.setFiles([path.join(__dirname, 'notes', 'clear_single_page_sell.pdf'), path.join(__dirname, 'notes', 'clear_single_page_sell_pwd.pdf')])
      resolve()
    }
    window.on('filechooser', fileChooserListener)
  })
  await dropZoneButton.click()
  await fileChooserPromise

  // Check for the push notification with a warning and close it
  const pushNotification = window.getByTestId('push-notification')
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('1 nota adicionada')
  const pushNotificationCloseButton = window.getByTestId('push-notification-close')
  await pushNotificationCloseButton.click()
  await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })

  // Enter the password
  const passwordInput1 = window.getByTestId('password-input-1')
  const passwordInput2 = window.getByTestId('password-input-2')
  await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
  await passwordInput1.fill('123')
  await passwordInput2.fill('456')

  // Press enter to retry
  const retryPasswordButton = window.getByTestId('retry-password-button')
  await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
  await retryPasswordButton.click()

  // Check for the push notification
  await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
  expect(await pushNotification.innerText()).toContain('Nenhuma nova nota adicionada')
})
