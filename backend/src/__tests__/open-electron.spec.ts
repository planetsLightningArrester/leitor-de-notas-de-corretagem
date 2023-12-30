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

  const pushNotification = window.getByTestId("push-notification");
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("1 nota adicionada");

  // close app
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

  const pushNotification = window.getByTestId("push-notification");
  await pushNotification.waitFor({ state: "visible", timeout: 2000 });
  expect(await pushNotification.innerText()).toContain("1 nota adicionada");

  // close app
  await electronApp.close();
});
