const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir:  './tests/generated',
  timeout:  90000,
  retries:  2,
  workers:  1,
  reporter: [['html', { outputFolder: 'reports/html' }], ['list']],
  use: {
    headless:         true,
    screenshot:       'only-on-failure',
    video:            'retain-on-failure',
    trace:            'on-first-retry',
  },
});