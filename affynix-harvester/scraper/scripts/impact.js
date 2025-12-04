

/**
 * Impact.com Scraper
 *
 * Navigates Impact Marketplace, extracts available offers,
 * captures merchant name, category, description, commission,
 * and the affiliate link (Impact deep link).
 */

import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';

const IMPACT_URL = 'https://app.impact.com/advertiser-directory';

export default async function impact() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    console.log('[Impact] Navigating to marketplace...');
    await page.goto(IMPACT_URL, { waitUntil: 'domcontentloaded' });

    await randomWait(page);

    // Scroll to load dynamic items
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 600;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 400);
      });
    });

    await randomWait(page);

    const html = await page.content();
    const $ = cheerio.load(html);

    $('.advertiser-card').each((i, el) => {
      const name = $(el).find('.advertiser-name').text().trim();
      const category = $(el).find('.advertiser-categories').text().trim();
      const summary = $(el).find('.advertiser-description').text().trim();
      const raw_url = $(el).find('a.advertiser-link').attr('href');
      const commission = $(el).find('.payout-info').text().trim();

      if (!name || !raw_url) return;

      results.push({
        network: 'Impact',
        name,
        category,
        summary,
        raw_url: raw_url.startsWith('http') ? raw_url : `https://app.impact.com${raw_url}`,
        affiliate_link: raw_url.startsWith('http') ? raw_url : `https://app.impact.com${raw_url}`,
        price: null,
        commission,
        recurring: false,
        assets: []
      });
    });

  } catch (err) {
    console.error('[Impact] Scraper error:', err);
  }

  await browser.close();
  return results;
}