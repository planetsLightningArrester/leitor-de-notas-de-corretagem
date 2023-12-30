import path from 'path';
import { test, expect } from '@playwright/test';
import { _electron as electron } from '@playwright/test';

test('open a single page file', async () => {
  const electronApp = await electron.launch({ args: ['.'] });

  const window = await electronApp.firstWindow();

  const dropZoneButton = window.getByTestId('drop-zone-button');
  expect(dropZoneButton).not.toBe(undefined);
  dropZoneButton.click();

  await new Promise<void>(resolve => {
    window.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles(path.join(__dirname, 'notes', 'rico_single_page.pdf'));
      resolve();
    });
  });

  // Check for the push notification
  const pushNotification = window.getByTestId("push-notification");
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("1 nota adicionada");

  await electronApp.close();
});

test('open a single page file with password', async () => {
  const electronApp = await electron.launch({ args: ['.'] });

  const window = await electronApp.firstWindow();

  const dropZoneButton = window.getByTestId('drop-zone-button');
  expect(dropZoneButton).not.toBe(undefined);
  dropZoneButton.click();

  await new Promise<void>(resolve => {
    window.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles(path.join(__dirname, 'notes', 'clear_single_page_sell_pwd.pdf'));
      resolve();
    });
  });
  // Check for the push notification with a warning anc close it
  const pushNotification = window.getByTestId("push-notification");
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("Nenhuma nova nota adicionada");
  const pushNotificationCloseButton = window.getByTestId("push-notification-close");
  pushNotificationCloseButton.click();
  await pushNotification.waitFor({ state: "hidden", timeout: 2000 });

  // Enter the password
  const passwordInput1 = window.getByTestId("password-input-1");
  const passwordInput2 = window.getByTestId("password-input-2");
  await passwordInput1.waitFor({ state: "visible", timeout: 2000 });
  await passwordInput2.waitFor({ state: "visible", timeout: 2000 });
  await passwordInput1.type("123");
  await passwordInput2.type("456");

  // Press enter to retry
  const retryPasswordButton = window.getByTestId("retry-password-button");
  retryPasswordButton.waitFor({ state: "visible", timeout: 2000 })
  retryPasswordButton.click();

  // Check for the push notification
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("1 nota adicionada");

  await electronApp.close();
});

test('open a multi page file', async () => {
  const electronApp = await electron.launch({ args: ['.'] });

  const window = await electronApp.firstWindow();

  const dropZoneButton = window.getByTestId('drop-zone-button');
  expect(dropZoneButton).not.toBe(undefined);
  dropZoneButton.click();

  await new Promise<void>(resolve => {
    window.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles(path.join(__dirname, 'notes', 'clear_multi_page.pdf'));
      resolve();
    });
  });

  // Check for the push notification
  const pushNotification = window.getByTestId("push-notification");
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("1 nota adicionada");

  await electronApp.close();
});

test('open multiple files', async () => {
  const electronApp = await electron.launch({ args: ['.'] });

  const window = await electronApp.firstWindow();

  const dropZoneButton = window.getByTestId('drop-zone-button');
  expect(dropZoneButton).not.toBe(undefined);
  dropZoneButton.click();

  await new Promise<void>(resolve => {
    window.on('filechooser', async (fileChooser) => {
      await fileChooser.setFiles([
        path.join(__dirname, 'notes', 'clear_multi_page.pdf'),
        path.join(__dirname, 'notes', 'clear_single_page_sell.pdf'),
      ]);
      resolve();
    });
  });

  // Check for the push notification
  const pushNotification = window.getByTestId("push-notification");
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("2 notas adicionadas");

  await electronApp.close();
});
