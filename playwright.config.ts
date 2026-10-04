import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 60000,
  workers: 2,
  use: {
    baseURL: 'http://localhost:4321',
    headless: true,
    launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] },
  },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'artifacts/browser-report' }]],
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 15000,
  },
});
