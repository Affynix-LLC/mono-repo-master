/**
 * WarriorPlus Scraper
 *
 * Navigates to WarriorPlus Marketplace, extracts available offers, 
 * captures name, category, summary, pricing, URLs, and prepares them 
 * for ingestion by the Affynix backend.
 */

import { chromium } from 'playwright';
import * as cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';

const WARRIORPLUS_URL = 'https://warriorplus.com/marketplace/offers';

export default async function warriorplus() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const offers = [];

  try {
    console.log('[WarriorPlus] Navigating to marketplace...');
    await page.goto(WARRIORPLUS_URL, { waitUntil: 'domcontentloaded' });

    await randomWait(page);

    const html = await page.content();
    const $ = cheerio.load(html);

    $('.marketplace-offer').each((i, el) => {
      const name = $(el).find('.offer-title').text().trim();
      const summary = $(el).find('.offer-description').text().trim();
      const category = $(el).find('.offer-category').text().trim();
      const raw_url = $(el).find('a.offer-link').attr('href');
      const price = $(el).find('.price').text().trim();
      const commission = $(el).find('.percentage').text().trim();

      if (!name || !raw_url) return;

      offers.push({
        network: 'WarriorPlus',
        name,
        category,
        summary,
        raw_url: `https://warriorplus.com${raw_url}`,
        affiliate_link: `https://warriorplus.com${raw_url}`,
        price,
        commission,
        recurring: false,
        assets: []
      });
    });

  } catch (err) {
    console.error('[WarriorPlus] Scraper error:', err);
  }

  await browser.close();
  return offers;
}
