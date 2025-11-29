

/**
 * Generic Scraper
 *
 * This scraper is used for affiliate networks that:
 *  - do not expose a formal marketplace
 *  - have simple HTML pages with product listings
 *  - follow consistent patterns (cards, grids, lists)
 *
 * It attempts to extract:
 *  - product name
 *  - category (fallback: "General")
 *  - summary/description
 *  - destination/raw URL
 *  - affiliate/tracking link if present
 */

import { chromium } from 'playwright';
import cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';

// Placeholder: This will be replaced by environment variables or scraper config
const GENERIC_URL = process.env.GENERIC_SCRAPE_URL || 'https://example.com';

export default async function generic() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    console.log(`[Generic] Navigating to ${GENERIC_URL} ...`);
    await page.goto(GENERIC_URL, { waitUntil: 'domcontentloaded' });

    await randomWait(page);

    const html = await page.content();
    const $ = cheerio.load(html);

    // Attempt common card-based selectors
    const cardSelectors = [
      '.product-card',
      '.item-card',
      '.offer-card',
      '.listing',
      '.product',
      '.item'
    ];

    let foundCards = false;

    for (const selector of cardSelectors) {
      const cards = $(selector);
      if (cards.length === 0) continue;

      foundCards = true;

      cards.each((i, el) => {
        const name = $(el).find('h1, h2, h3, .title, .product-title').first().text().trim();
        const summary = $(el).find('p, .desc, .summary').first().text().trim();
        const raw_url = $(el).find('a').attr('href');
        const category = $(el).find('.category, .tag').first().text().trim() || 'General';

        if (!name || !raw_url) return;

        results.push({
          network: 'Generic',
          name,
          category,
          summary,
          raw_url: raw_url.startsWith('http') ? raw_url : `${GENERIC_URL}${raw_url}`,
          affiliate_link: raw_url.startsWith('http') ? raw_url : `${GENERIC_URL}${raw_url}`,
          price: null,
          commission: null,
          recurring: false,
          assets: []
        });
      });

      break; // Stop after first successful selector
    }

    if (!foundCards) {
      console.log('[Generic] No recognizable product cards found. Returning empty set.');
    }

  } catch (err) {
    console.error('[Generic] Scraper error:', err);
  }

  await browser.close();
  return results;
}