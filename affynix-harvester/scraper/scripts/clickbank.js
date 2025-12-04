/**
 * ClickBank Scraper
 *
 * Extracts offers from ClickBank Marketplace.
 * Requires login credentials (CLICKBANK_USERNAME, CLICKBANK_PASSWORD).
 * Uses Playwright for navigation + Cheerio for parsing.
 */

import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';
import { loadSession, saveSession } from '../utils/sessionStore.js';

const CLICKBANK_LOGIN_URL = 'https://accounts.clickbank.com/login.htm';
const CLICKBANK_MARKETPLACE_URL = 'https://accounts.clickbank.com/marketplace.htm';

export default async function clickbank() {
  const username = process.env.CLICKBANK_USERNAME;
  const password = process.env.CLICKBANK_PASSWORD;

  if (!username || !password) {
    console.log('[ClickBank] Missing credentials - skipping');
    return [];
  }

  const browser = await chromium.launch({ headless: true });
  const existingSession = loadSession('clickbank');
  
  // Create context with saved session if available
  const context = existingSession
    ? await browser.newContext({ storageState: existingSession })
    : await browser.newContext();
  
  const page = await context.newPage();
  const results = [];

  try {
    // Always start at login page to ensure we're authenticated
    console.log('[ClickBank] Navigating to login page...');
    await page.goto(CLICKBANK_LOGIN_URL, { waitUntil: 'networkidle', timeout: 30000 });
    await randomWait(page);
    await page.waitForTimeout(2000); // Extra wait for JS to render

    // Check if already logged in (redirected away from login)
    const currentUrl = page.url();
    console.log(`[ClickBank] Current URL: ${currentUrl}`);
    
    if (!currentUrl.includes('login.htm') && !currentUrl.includes('login')) {
      console.log('[ClickBank] Already logged in (session active)');
    } else {
      console.log('[ClickBank] Performing login...');
      
      // Take a screenshot for debugging (optional)
      // await page.screenshot({ path: '/usr/src/app/logs/clickbank-login.png' });
      
      // Wait for page to be fully loaded
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(3000);
      
      // Try to find any input field - ClickBank might use different selectors
      const allInputs = await page.locator('input').all();
      console.log(`[ClickBank] Found ${allInputs.length} input fields on page`);
      
      // Look for username/email field with more flexible approach
      let usernameField = null;
      const usernameSelectors = [
        'input[name="username"]',
        'input[name="email"]',
        'input[type="email"]',
        'input[id*="username"]',
        'input[id*="email"]',
        'input[id*="user"]',
        '#username',
        '#email',
        'input[placeholder*="email" i]',
        'input[placeholder*="username" i]'
      ];
      
      for (const selector of usernameSelectors) {
        try {
          const count = await page.locator(selector).count();
          if (count > 0) {
            usernameField = selector;
            console.log(`[ClickBank] Found username field: ${selector}`);
            break;
          }
        } catch (e) {}
      }
      
      if (!usernameField && allInputs.length > 0) {
        // Use first text input as fallback
        usernameField = 'input[type="text"]:first-of-type';
        console.log(`[ClickBank] Using first text input as username field`);
      }
      
      if (!usernameField) {
        console.error('[ClickBank] Could not find username field');
        throw new Error('Login form not found');
      }
      
      // Fill login form - try multiple selectors
      const usernameSelectors = [
        'input[name="username"]',
        'input[name="email"]',
        'input[type="email"]',
        'input[id*="username"]',
        'input[id*="email"]',
        '#username',
        '#email'
      ];
      
      const passwordSelectors = [
        'input[name="password"]',
        'input[type="password"]',
        '#password'
      ];
      
      let filled = false;
      for (const selector of usernameSelectors) {
        try {
          if (await page.locator(selector).count() > 0) {
            await page.fill(selector, username);
            filled = true;
            break;
          }
        } catch (e) {}
      }
      
      if (!filled) {
        console.error('[ClickBank] Could not find username field');
        throw new Error('Login form not found');
      }
      
      for (const selector of passwordSelectors) {
        try {
          if (await page.locator(selector).count() > 0) {
            await page.fill(selector, password);
            break;
          }
        } catch (e) {}
      }
      
      // Click submit button
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'button:has-text("Login")',
        'button:has-text("Sign In")',
        'button:has-text("Log In")',
        'form button',
        'button.btn-primary'
      ];
      
      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          if (await page.locator(selector).count() > 0) {
            await Promise.all([
              page.click(selector),
              page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {})
            ]);
            submitted = true;
            break;
          }
        } catch (e) {}
      }
      
      if (!submitted) {
        // Try pressing Enter as fallback
        await page.keyboard.press('Enter');
        await page.waitForTimeout(3000);
      }

      // Save session for next time
      await saveSession(context, 'clickbank');
      console.log('[ClickBank] Login attempted, session saved');
      
      // Wait a bit for redirect
      await page.waitForTimeout(2000);
    }

    // Navigate to marketplace
    console.log('[ClickBank] Navigating to marketplace...');
    await page.goto(CLICKBANK_MARKETPLACE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await randomWait(page);
    
    // Wait for content to load
    await page.waitForTimeout(3000);

    // Parse offers from marketplace
    const html = await page.content();
    const $ = cheerio.load(html);

    // ClickBank marketplace selectors (adjust if needed)
    $('.list-item, .offer-item, .product-item, [data-product]').each((i, el) => {
      const name = $(el).find('.list-title, .offer-title, .product-title, h3, h4').first().text().trim();
      const category = $(el).find('.list-cat, .category, .cat').text().trim();
      const summary = $(el).find('.list-copy, .description, .summary').text().trim();
      const raw_url = $(el).find('.list-link, a[href*="hop"], a[href*="product"]').attr('href');
      const price = $(el).find('.list-price, .price').text().trim();

      if (!name || !raw_url) return;

      // Make URL absolute if relative
      const fullUrl = raw_url.startsWith('http') ? raw_url : `https://accounts.clickbank.com${raw_url}`;

      results.push({
        network: 'ClickBank',
        name,
        category: category || 'Uncategorized',
        summary: summary || '',
        raw_url: fullUrl,
        affiliate_link: fullUrl,
        price: price || null,
        commission: null,
        recurring: false,
        assets: []
      });
    });

    console.log(`[ClickBank] Found ${results.length} offers`);

  } catch (err) {
    console.error('[ClickBank] Scraper error:', err);
  }

  await browser.close();
  return results;
}
