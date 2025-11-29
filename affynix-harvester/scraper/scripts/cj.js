

/**
 * CJ (Commission Junction) Scraper
 *
 * CJ requires navigating their public advertiser directory since many
 * dashboard areas require login + rotating MFA.
 * This scraper extracts:
 *  - advertiser name
 *  - category
 *  - summary/description
 *  - tracking / program URL
 *  - commission details if available
 */

import { chromium } from 'playwright';
import cheerio from 'cheerio';
import { randomWait } from '../utils/proxy.js';

const CJ_URL = 'https://www.cj.com/advertiser-directory';

export default async function cj() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const results = [];

  try {
    console.log('[CJ] Navigating to advertiser directory...');
    await page.goto(CJ_URL, { waitUntil: 'domcontentloaded' });

    await randomWait(page);

    // Scroll the directory to load more advertisers
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let totalHeight = 0;
        const distance = 800;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight - window.innerHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 600);
      });
    });

    await randomWait(page);

    const html = await page.content();
    const $ = cheerio.load(html);

    $('.advertiser-card').each((i, el) => {
      const name = $(el).find('.advertiser-card__name').text().trim();
      const category = $(el).find('.advertiser-card__category').text().trim();
      const summary = $(el).find('.advertiser-card__description').text().trim();
      const raw_url = $(el).find('a.advertiser-card__link').attr('href');
      const commission = $(el).find('.advertiser-card__commission').text().trim();

      if (!name || !raw_url) return;

      results.push({
        network: 'CJ',
        name,
        category,
        summary,
        raw_url: raw_url.startsWith('http') ? raw_url : `https://www.cj.com${raw_url}`,
        affiliate_link: raw_url.startsWith('http') ? raw_url : `https://www.cj.com${raw_url}`,
        price: null,
        commission,
        recurring: false,
        assets: []
      });
    });

  } catch (err) {
    console.error('[CJ] Scraper error:', err);
  }

  await browser.close();
  return results;
}