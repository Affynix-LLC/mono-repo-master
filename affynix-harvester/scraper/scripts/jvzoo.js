/**
 * JVZoo Scraper
 *
 * Extracts marketplace offers listed on JVZoo.
 * Uses Playwright to navigate and Cheerio to parse.
 */

import { chromium } from 'playwright';
import cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';

const JVZOO_URL = 'https://www.jvzoo.com/marketplace';

export default async function jvzoo() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    console.log('[JVZoo] Navigating to marketplace...');
    await page.goto(JVZOO_URL, { waitUntil: 'domcontentloaded' });

    await randomWait(page);

    const html = await page.content();
    const $ = cheerio.load(html);

    $('.mp-product-box').each((i, el) => {
      const name               = $(el).find('.mp-product-title').text().trim();
      const category           = $(el).find('.mp-product-category').text().trim();
      const summary            = $(el).find('.mp-product-blurb').text().trim();
      const raw_url            = $(el).find('a').attr('href');
      const price              = $(el).find('.mp-product-price').text().trim();
      const commission         = $(el).find('.mp-product-commission').text().trim();
      const recurring          = $(el).find('.mp-product-recurring').text().includes('Recurring');

      if (!name || !raw_url) return;

      results.push({
        network: 'JVZoo',
        name,
        category,
        summary,
        raw_url: raw_url.startsWith('http') ? raw_url : `https://www.jvzoo.com${raw_url}`,
        affiliate_link: raw_url.startsWith('http') ? raw_url : `https://www.jvzoo.com${raw_url}`,
        price,
        commission,
        recurring,
        assets: []
      });
    });

  } catch (err) {
    console.error('[JVZoo] Scraper error:', err);
  }

  await browser.close();
  return results;
}
