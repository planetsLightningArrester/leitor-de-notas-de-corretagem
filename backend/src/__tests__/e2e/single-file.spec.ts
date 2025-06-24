import path from 'path'
import { test, expect, _electron as electron, type FileChooser, type ElectronApplication, type Page } from '@playwright/test'

test.describe.serial('open a single page file (rico)', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test.afterAll(async () => {
    await electronApp.close()
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
        await fileChooser.setFiles(path.join(__dirname, '..', 'notes', 'rico_single_page.pdf'))
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
    expect(await pushNotification.innerText()).toContain('1 note added')
  })

  test('check if the note was added', async () => {
    const noteTab = window.getByTestId('tab-11111')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabALZR = window.getByTestId('tab-11111-ALZR11')
    await noteTabALZR.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open a single page file (nubank)', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test.afterAll(async () => {
    await electronApp.close()
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
        await fileChooser.setFiles(path.join(__dirname, '..', 'notes', 'nubank_single_page.pdf'))
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
    expect(await pushNotification.innerText()).toContain('1 note added')
  })

  test('check if the note was added', async () => {
    const noteTab = window.getByTestId('tab-8242')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabALZR = window.getByTestId('tab-8242-ALZR11')
    await noteTabALZR.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open a single page file with password and unknown data', async () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test.afterAll(async () => {
    await electronApp.close()
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
        await fileChooser.setFiles(path.join(__dirname, '..', 'notes', 'clear_single_page_sell_pwd.pdf'))
        resolve()
      }
      window.on('filechooser', fileChooserListener)
    })
    await dropZoneButton.click()
    await fileChooserPromise
  })

  test('check if the push notification is shown with a warning', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('No new notes added. Duplicates are ignored')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('enter a wrong possible password and check if the notification is shown and the password modal is still there', async () => {
    const passwordInput1 = window.getByTestId('password-input-1')
    await passwordInput1.waitFor({ state: 'visible', timeout: 2000 })
    await passwordInput1.fill('123')

    const retryPasswordButton = window.getByTestId('retry-password-button')
    await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
    await retryPasswordButton.click()

    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('No new notes added. Duplicates are ignored')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })

    expect(await passwordInput1.isVisible()).toBeTruthy()
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

    await passwordInput1.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('check if the push notification is shown', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('1 note added')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('insert the unknown asset data', async () => {
    let codeInput = window.getByTestId('BANCO INTER ON-code-input')
    await codeInput.waitFor({ state: 'visible', timeout: 2000 })
    await codeInput.fill('BIDI3')

    let cnpjInput = window.getByTestId('BANCO INTER ON-cnpj-input')
    await cnpjInput.waitFor({ state: 'visible', timeout: 2000 })
    await cnpjInput.fill('00.416.968/0001-01')

    codeInput = window.getByTestId('BANCO INTER UNT-code-input')
    await codeInput.waitFor({ state: 'visible', timeout: 2000 })
    await codeInput.fill('BIDI11')

    cnpjInput = window.getByTestId('BANCO INTER UNT-cnpj-input')
    await cnpjInput.waitFor({ state: 'visible', timeout: 2000 })
    await cnpjInput.fill('00.416.968/0001-01')

    const retryPasswordButton = window.getByTestId('retry-unknown-asset-button')
    await retryPasswordButton.waitFor({ state: 'visible', timeout: 2000 })
    await retryPasswordButton.click()
  })

  test('check if the push notification is shown after updating unknown data', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('Note reloaded')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('check if the note was added', async () => {
    const noteTab = window.getByTestId('tab-44444')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabITSA = window.getByTestId('tab-44444-ITSA3')
    await noteTabITSA.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open a multi page file', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test.afterAll(async () => {
    await electronApp.close()
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
        await fileChooser.setFiles(path.join(__dirname, '..', 'notes', 'clear_multi_page.pdf'))
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
    expect(await pushNotification.innerText()).toContain('1 note added')
  })

  test('check if the note was added', async () => {
    const noteTab = window.getByTestId('tab-33333')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabXPML = window.getByTestId('tab-33333-XPML11')
    await noteTabXPML.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open a file with unknown assets', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test.afterAll(async () => {
    await electronApp.close()
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
        await fileChooser.setFiles(path.join(__dirname, '..', 'notes', 'clear_single_page_sell.pdf'))
        resolve()
      }
      window.on('filechooser', fileChooserListener)
    })
    await dropZoneButton.click()
    await fileChooserPromise
    await window.getByTestId('table-container').waitFor({ state: 'visible' })
  })

  test('check if the push notification is shown without a warning', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('1 note added')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('enter the info about the missing asset', async () => {
    const codeField1 = window.getByTestId('BANCO INTER ON-code-input')
    const cnpjField1 = window.getByTestId('BANCO INTER ON-cnpj-input')
    const codeField2 = window.getByTestId('BANCO INTER UNT-code-input')
    const cnpjField2 = window.getByTestId('BANCO INTER UNT-cnpj-input')
    await codeField1.waitFor({ state: 'visible', timeout: 2000 })
    await codeField1.fill('BIDI3')
    await cnpjField1.fill('00.416.968/0001-01')
    await codeField2.waitFor({ state: 'visible', timeout: 2000 })
    await codeField2.fill('BIDI11')
    await cnpjField2.fill('00.416.968/0001-01')

    const retryUnknownAssetButton = window.getByTestId('retry-unknown-asset-button')
    await retryUnknownAssetButton.waitFor({ state: 'visible', timeout: 2000 })
    await retryUnknownAssetButton.click()

    await codeField1.waitFor({ state: 'hidden', timeout: 2000 })
    await codeField2.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('check if the note was added with the correct info', async () => {
    const noteTab = window.getByTestId('tab-44444')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabBIDI3 = window.getByTestId('tab-44444-BIDI3')
    await noteTabBIDI3.waitFor({ state: 'visible', timeout: 2000 })
    const noteTabBIDI11 = window.getByTestId('tab-44444-BIDI11')
    await noteTabBIDI11.waitFor({ state: 'visible', timeout: 2000 })
  })
})

test.describe.serial('open a file with unknown assets and add it', () => {
  let electronApp: ElectronApplication
  let window: Page

  test.beforeAll(async () => {
    electronApp = await electron.launch({ args: ['.'] })
    window = await electronApp.firstWindow()
  })

  test.afterAll(async () => {
    await electronApp.close()
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
        await fileChooser.setFiles(path.join(__dirname, '..', 'notes', 'inter_cpti_kdif.pdf'))
        resolve()
      }
      window.on('filechooser', fileChooserListener)
    })
    await dropZoneButton.click()
    await fileChooserPromise
    await window.getByTestId('table-container').waitFor({ state: 'visible' })
  })

  test('check if the push notification is shown without a warning', async () => {
    const pushNotification = window.getByTestId('push-notification')
    await pushNotification.waitFor({ state: 'visible', timeout: 10000 })
    expect(await pushNotification.innerText()).toContain('1 note added')
    const pushNotificationCloseButton = window.getByTestId('push-notification-close')
    await pushNotificationCloseButton.click()
    await pushNotification.waitFor({ state: 'hidden', timeout: 2000 })
  })

  test('check if the note was added with the correct name', async () => {
    const noteTab = window.getByTestId('tab-24402609')
    await noteTab.waitFor({ state: 'visible', timeout: 2000 })
    await noteTab.click()
    const noteTabCPTI11 = window.getByTestId('tab-24402609-CPTI11')
    await noteTabCPTI11.waitFor({ state: 'visible', timeout: 2000 })
  })
})
