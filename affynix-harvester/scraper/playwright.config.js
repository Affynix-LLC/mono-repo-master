// playwright.config.js
// Global Playwright configuration for the Affynix Autonomous Scraper

import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './scripts',

  timeout: 60000 * 5, // 5 minutes per scraping task

  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },

    // Persistent directory for login sessions (cookies, storage)
    storageState: './sessions/storage.json',

    // Chromium is the most stable for affiliate dashboards
    browserName: 'chromium',

    // Make automation harder to detect
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119 Safari/537.36',

    ignoreHTTPSErrors: true,
    javaScriptEnabled: true,

    // SlowMo avoids certain anti-bot detections
    launchOptions: {
      slowMo: 75,
      args: [
        '--disable-blink-features=AutomationControlled',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--disable-dev-shm-usage',
        '--ignore-certificate-errors'
      ]
    }
  }
});
