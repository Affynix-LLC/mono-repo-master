/**
 * ClickBank Scraper
 *
 * Extracts offers from ClickBank Marketplace.
 * Uses Playwright for navigation + Cheerio for parsing.
 */

import { chromium } from 'playwright';
import cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';

const CLICKBANK_URL = 'https://accounts.clickbank.com/marketplace.htm';

export default async function clickbank() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];

  try {
    console.log('[ClickBank] Navigating to marketplace...');
    await page.goto(CLICKBANK_URL, { waitUntil: 'domcontentloaded' });

    await randomWait(page);

    const html = await page.content();
    const $ = cheerio.load(html);

    $('.list-item').each((i, el) => {
      const name = $(el).find('.list-title').text().trim();
      const category = $(el).find('.list-cat').text().trim();
      const summary = $(el).find('.list-copy').text().trim();
      const raw_url = $(el).find('.list-link').attr('href');
      const price = $(el).find('.list-price').text().trim();

      if (!name || !raw_url) return;

      results.push({
        network: 'ClickBank',
        name,
        category,
        summary,
        raw_url,
        affiliate_link: raw_url,
        price,
        commission: null,
        recurring: false,
        assets: []
      });
    });

  } catch (err) {
    console.error('[ClickBank] Scraper error:', err);
  }

  await browser.close();
  return results;
}
