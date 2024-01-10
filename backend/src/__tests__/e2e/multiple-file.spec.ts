import path from 'path'
import { test, expect, _electron as electron, type FileChooser, type ElectronApplication, type Page } from '@playwright/test'

test.describe.serial('open multiple files', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test('change locale to en-us', async () => {
    const enUsButton = window.getByTestId('en-US-button')
    expect(enUsButton).not.toBe(undefined)
    await enUsButton.click()
    expect(await window.getByTestId('main-page-title').innerText()).toBe('Brokerage note reader')
  })
  test('select file from file chooser', async () => {
    const dropZoneButton = window.getByTestId('drop-zone-button')
    expect(dropZoneButton).not.toBe(undefined)
    const fileChooserPromise = new Promise<void>((resolve) => {
      const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
        window.off('filechooser', fileChooserListener)
        await fileChooser.setFiles([path.join(__dirname, '..', 'notes', 'clear_multi_page.pdf'), path.join(__dirname, '..', 'notes', 'clear_single_page_sell.pdf')])
        resolve()
      }
      window.on('filechooser', fileChooserListener)
    })
    await dropZoneButton.click()
    await fileChooserPromise
    await window.getByTestId('table-container').waitFor({ state: 'visible' })
  })

  test('check if the push notification is shown', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('2 notes added')
  })

  test('check if notes the notes were added', async () => {
    let noteTab = window.getByTestId('tab-33333')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabXPML = window.getByTestId('tab-33333-XPML11')
    await noteTabXPML.waitFor({ state: 'visible', timeout: 2000 })

    noteTab = window.getByTestId('tab-44444')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabITSA = window.getByTestId('tab-44444-ITSA3')
    await noteTabITSA.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open multiple files with password', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test('change locale to en-us', async () => {
    const enUsButton = window.getByTestId('en-US-button')
    expect(enUsButton).not.toBe(undefined)
    await enUsButton.click()
    expect(await window.getByTestId('main-page-title').innerText()).toBe('Brokerage note reader')
  })

  test('select file from file chooser', async () => {
    const dropZoneButton = window.getByTestId('drop-zone-button')
    expect(dropZoneButton).not.toBe(undefined)
    const fileChooserPromise = new Promise<void>((resolve) => {
      const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
        window.off('filechooser', fileChooserListener)
        await fileChooser.setFiles([
          path.join(__dirname, '..', 'notes', 'rico_single_page_pwd.pdf'),
          path.join(__dirname, '..', 'notes', 'clear_single_page_sell_pwd.pdf')
        ])
        resolve()
      }
      window.on('filechooser', fileChooserListener)
    })
    await dropZoneButton.click()
    await fileChooserPromise
  })

  test('check if the push notification for a warning', async () => {
    expect(await window.getByTestId('drop-zone-button').isVisible()).toBeTruthy()
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('No new notes added. Duplicates are ignored')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('insert a valid password', async () => {
    // Enter the password
    const passwordInput1 = window.getByTestId('password-input-1')
    const passwordInput2 = window.getByTestId('password-input-2')
    await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
    await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
    await passwordInput1.fill('123')
    await passwordInput2.fill('456')

    const retryPasswordButton = window.getByTestId('retry-password-button')
    await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
    await retryPasswordButton.click()

    await passwordInput1.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('check if the push notification notes added', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('2 notes added')
  })

  test('check if notes the notes were added', async () => {
    let noteTab = window.getByTestId('tab-11111')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabALZR = window.getByTestId('tab-11111-ALZR11')
    await noteTabALZR.waitFor({ state: 'visible', timeout: 2000 })

    noteTab = window.getByTestId('tab-44444')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabITSA = window.getByTestId('tab-44444-ITSA3')
    await noteTabITSA.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open multiple files, some with password', async () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test('change locale to en-us', async () => {
    const enUsButton = window.getByTestId('en-US-button')
    expect(enUsButton).not.toBe(undefined)
    await enUsButton.click()
    expect(await window.getByTestId('main-page-title').innerText()).toBe('Brokerage note reader')
  })

  test('select file from file chooser', async () => {
    const dropZoneButton = window.getByTestId('drop-zone-button')
    expect(dropZoneButton).not.toBe(undefined)
    const fileChooserPromise = new Promise<void>((resolve) => {
      const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
        window.off('filechooser', fileChooserListener)
        await fileChooser.setFiles([
          path.join(__dirname, '..', 'notes', 'rico_single_page_pwd.pdf'),
          path.join(__dirname, '..', 'notes', 'clear_single_page_sell.pdf'),
          path.join(__dirname, '..', 'notes', 'rico_multi_page.pdf'),
        ])
        resolve()
      }
      window.on('filechooser', fileChooserListener)
    })
    await dropZoneButton.click()
    await fileChooserPromise
    await window.getByTestId('table-container').waitFor({ state: 'visible' })
  })

  test('check if the push notification show that some notes were added', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('2 notes added')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('insert a valid password', async () => {
    const passwordInput1 = window.getByTestId('password-input-1')
    const passwordInput2 = window.getByTestId('password-input-2')
    await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
    await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
    await passwordInput1.fill('123')
    await passwordInput2.fill('456')

    const retryPasswordButton = window.getByTestId('retry-password-button')
    await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
    await retryPasswordButton.click()
  })

  test('check if the push notification show some notes added', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('1 note added')
  })

  test('check if notes were added', async () => {
    let noteTab = window.getByTestId('tab-11111')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabALZR = window.getByTestId('tab-11111-ALZR11')
    await noteTabALZR.waitFor({ state: 'visible', timeout: 2000 })

    noteTab = window.getByTestId('tab-44444')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabITSA = window.getByTestId('tab-44444-ITSA3')
    await noteTabITSA.waitFor({ state: 'visible', timeout: 2000 })

    noteTab = window.getByTestId('tab-22222')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabXPML = window.getByTestId('tab-22222-XPML11')
    await noteTabXPML.waitFor({ state: 'visible', timeout: 2000 })
  })
})
//
// test('open multiple duplicated files', async () => {
//   const electronApp = await electron.launch({ args: ['.'] })
//
//   const window = await electronApp.firstWindow()
//
//   // Change locale to en-us
//   const enUsButton = window.getByTestId('en-US-button')
//   expect(enUsButton).not.toBe(undefined)
//   await enUsButton.click()
//
//   const dropZoneButton = window.getByTestId('drop-zone-button')
//   expect(dropZoneButton).not.toBe(undefined)
//   const fileChooserPromise = new Promise<void>((resolve) => {
//     const fileChooserListener = async (fileChooser: FileChooser): Promise<void> => {
//       window.off('filechooser', fileChooserListener)
//       await fileChooser.setFiles([path.join(__dirname, '..', 'notes', 'clear_single_page_sell.pdf'), path.join(__dirname, '..', 'notes', 'clear_single_page_sell_pwd.pdf')])
//       resolve()
//     }
//     window.on('filechooser', fileChooserListener)
//   })
//   await dropZoneButton.click()
//   await fileChooserPromise
//
//   // Check for the push notification with a warning and close it
//   const pushNotification = window.getByTestId('push-notification')
//   await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
//   expect(await pushNotification.innerText()).toContain('1 note added')
//   const pushNotificationCloseButton = window.getByTestId('push-notification-close')
//   await pushNotificationCloseButton.click()
//   await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
//
//   // Enter the password
//   const passwordInput1 = window.getByTestId('password-input-1')
//   const passwordInput2 = window.getByTestId('password-input-2')
//   await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
//   await passwordInput2.waitFor({ state: 'visible', timeout: 2000 })
//   await passwordInput1.fill('123')
//   await passwordInput2.fill('456')
//
//   // Press enter to retry
//   const retryPasswordButton = window.getByTestId('retry-password-button')
//   await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
//   await retryPasswordButton.click()
//
//   // Check for the push notification
//   await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
//   expect(await pushNotification.innerText()).toContain('No new notes added. Duplicates are ignored')
// })
