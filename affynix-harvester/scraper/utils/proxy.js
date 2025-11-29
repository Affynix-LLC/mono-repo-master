

/**
 * proxy.js
 *
 * Utility helpers for:
 *  - random wait times (anti-bot)
 *  - rotating proxies from environment pool
 *  - injecting proxy settings into Playwright launch options
 *
 * This file is intentionally lightweight so it can be safely imported
 * across all scraper modules.
 */

/**
 * Wait for a random delay between 800ms and 2400ms.
 * Helps avoid anti-bot detection patterns.
 */
export async function randomWait(page, min = 800, max = 2400) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await page.waitForTimeout(delay);
}

/**
 * Pulls a random proxy from the PROXY_POOL environment variable.
 *
 * Format:
 *   export PROXY_POOL="http://user:pass@proxy1:port,http://proxy2:port"
 */
export function getRandomProxy() {
  const pool = process.env.PROXY_POOL;
  if (!pool) return null;

  const list = pool.split(',').map(p => p.trim()).filter(Boolean);
  if (list.length === 0) return null;

  const selected = list[Math.floor(Math.random() * list.length)];
  return selected;
}

/**
 * Returns Playwright launch arguments if a proxy is available.
 */
export function getProxyLaunchArgs() {
  const proxy = getRandomProxy();
  if (!proxy) return {};

  return {
    proxy: {
      server: proxy
    }
  };
}