import process from 'process'
import { defineConfig, devices } from '@playwright/test'

const development = process.env.NODE_ENV === 'development'

// Set mode to development, so we can run electron tests with the Playwright extension
const webSever =
  development ? undefined : { command: 'cd ../frontend && npm run dev', url: 'http://localhost:5173/', reuseExistingServer: false, }

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './src/__tests__',
  /* Run tests in files in parallel */
  fullyParallel: !development,
  /* Fail the build on testing if you accidentally left test.only in the source code. */
  forbidOnly: !development,
  /* Do not retry */
  retries: 0,
  /* Opt out of parallel tests on testing. */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: webSever,
})
