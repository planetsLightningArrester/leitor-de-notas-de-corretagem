import path from 'path';
import { test, expect } from '@playwright/test';
import { _electron as electron } from '@playwright/test';

test('open and take a screenshot', async () => {
  const electronApp = await electron.launch({ args: ['.'] });
  const isPackaged = await electronApp.evaluate(async ({ app }) => {
    // This runs in Electron's main process, parameter here is always
    // the result of the require('electron') in the main app script.
    return app.isPackaged;
  });

  expect(isPackaged).toBe(false);

  // Wait for the first BrowserWindow to open
  // and return its Page object
  const window = await electronApp.firstWindow();
  // await window.screenshot({ path: 'intro.png' });

  // close app
  await electronApp.close();
});

test('click on the count button twice', async () => {
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
  })

  await new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });

  // await window.getByTitle('count-button').click();
  // await window.getByTitle('count-button').click();
  // expect(await window.getByTitle('count-button').textContent()).toBe('count is 2');

  // close app
  await electronApp.close();
});