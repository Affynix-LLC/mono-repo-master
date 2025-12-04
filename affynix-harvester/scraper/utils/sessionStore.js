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

const SESSIONS_DIR = path.resolve('./sessions');

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

/**
 * Get session file path for a network.
 * @param {string} network - Network name (e.g., 'clickbank', 'warriorplus')
 * @returns {string} Path to session file
 */
function getSessionPath(network = 'default') {
  return path.join(SESSIONS_DIR, `${network}-storage.json`);
}

/**
 * Load session state if it exists.
 * @param {string} network - Network name (optional, defaults to 'default')
 * @returns {string|null} Path to storage.json or null if no session exists
 */
export function loadSession(network = 'default') {
  try {
    const sessionPath = getSessionPath(network);
    if (fs.existsSync(sessionPath)) {
      console.log(`[Session] Loaded existing session state for ${network}.`);
      return sessionPath;
    }
    console.log(`[Session] No existing session found for ${network}.`);
    return null;
  } catch (err) {
    console.error('[Session] Error loading session:', err);
    return null;
  }
}

/**
 * Save Playwright browser context state to disk.
 * Called after successful login or after scrapers finish.
 * @param {BrowserContext} context - Playwright browser context
 * @param {string} network - Network name (optional, defaults to 'default')
 */
export async function saveSession(context, network = 'default') {
  try {
    const sessionPath = getSessionPath(network);
    const state = await context.storageState();
    fs.writeFileSync(sessionPath, JSON.stringify(state, null, 2));
    console.log(`[Session] Session state saved for ${network}.`);
  } catch (err) {
    console.error('[Session] Error saving session:', err);
  }
}
