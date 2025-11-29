/**
 * sessionStore.js
 *
 * Responsible for:
 *  - Saving & loading Playwright browser storage state
 *  - Persisting login cookies across scraper runs
 *  - Ensuring sessions survive container restarts
 *
 * The scraper runner uses this to avoid repeated logins.
 */

import fs from 'fs';
import path from 'path';

const SESSION_PATH = path.resolve('./sessions/storage.json');

/**
 * Load session state if it exists.
 * Returns:
 *   - path to storage.json (string)
 *   - or null if no session exists
 */
export function loadSession() {
  try {
    if (fs.existsSync(SESSION_PATH)) {
      console.log('[Session] Loaded existing session state.');
      return SESSION_PATH;
    }
    console.log('[Session] No existing session found.');
    return null;
  } catch (err) {
    console.error('[Session] Error loading session:', err);
    return null;
  }
}

/**
 * Save Playwright browser context state to disk.
 * Called after successful login or after scrapers finish.
 */
export async function saveSession(context) {
  try {
    const state = await context.storageState();
    fs.writeFileSync(SESSION_PATH, JSON.stringify(state, null, 2));
    console.log('[Session] Session state saved.');
  } catch (err) {
    console.error('[Session] Error saving session:', err);
  }
}
