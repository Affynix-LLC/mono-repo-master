/**
 * login.js
 *
 * Generic login helper for networks that require credential-based login.
 * This supports:
 *  - username/password login
 *  - saving session to avoid repeated logins
 *  - loading session on next scraper run
 *
 * NOTE: Each affiliate network has DIFFERENT login flows.
 * This module provides a reusable foundation.
 */

import { loadSession, saveSession } from './sessionStore.js';
import { getProxyLaunchArgs } from './proxy.js';
import { chromium } from 'playwright';

/**
 * Perform a login flow using provided selectors.
 *
 * @param {object} opts
 *  - url: string (login page)
 *  - username: string
 *  - password: string
 *  - usernameSelector: string
 *  - passwordSelector: string
 *  - submitSelector: string
 */
export async function performLogin(opts) {
  const {
    url,
    username,
    password,
    usernameSelector,
    passwordSelector,
    submitSelector
  } = opts;

  const existingSession = loadSession();
  const launchArgs = getProxyLaunchArgs();

  const browser = await chromium.launch({ headless: true, ...launchArgs });
  const context = existingSession
    ? await browser.newContext({ storageState: existingSession })
    : await browser.newContext();

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // If session already logged in, skip login
    if (existingSession) {
      console.log('[Login] Existing session detected, skipping login.');
      await browser.close();
      return true;
    }

    console.log('[Login] Performing fresh login...');

    await page.fill(usernameSelector, username);
    await page.fill(passwordSelector, password);

    await Promise.all([
      page.click(submitSelector),
      page.waitForNavigation({ waitUntil: 'networkidle' })
    ]);

    // Save new session
    await saveSession(context);

    console.log('[Login] Login successful and session saved.');
    await browser.close();
    return true;

  } catch (err) {
    console.error('[Login] Error during login:', err);
    await browser.close();
    return false;
  }
}
