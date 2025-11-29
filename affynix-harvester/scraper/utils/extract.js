/**
 * extract.js
 *
 * Shared HTML extraction helpers used by all scraper modules.
 * These functions help clean DOM text, handle missing elements safely,
 * and normalize extracted fields including names, prices, summaries,
 * commissions, and asset links.
 */

/**
 * Safely extract trimmed text from a Cheerio element.
 * Returns "" if selector does not exist.
 */
export function text($, el, selector) {
  const node = $(el).find(selector);
  if (!node || node.length === 0) return '';
  return node.text().trim();
}

/**
 * Extract attribute safely from a Cheerio element.
 * Returns "" if attribute or selector is missing.
 */
export function attr($, el, selector, attribute) {
  const node = $(el).find(selector);
  if (!node || node.length === 0) return '';
  const raw = node.attr(attribute);
  return raw ? raw.trim() : '';
}

/**
 * Normalize a price string to a clean format.
 * Example:
 *  "$297.00" → "297.00"
 *  "Free" → "0"
 */
export function normalizePrice(value) {
  if (!value) return null;

  const cleaned = value.replace(/[^0-9.]/g, '');
  if (cleaned === '') return null;

  return cleaned;
}

/**
 * Normalize commission percentage.
 * Example:
 *  "75%" → "75"
 *  "Recurring 40%" → "40"
 */
export function normalizeCommission(value) {
  if (!value) return null;

  const cleaned = value.replace(/[^0-9.]/g, '');
  if (cleaned === '') return null;

  return cleaned;
}

/**
 * Extract all asset/image URLs within a given selector.
 * Returns [] if none found.
 */
export function extractAssets($, el, selector) {
  const assets = [];
  $(el)
    .find(selector)
    .each((i, img) => {
      const src = $(img).attr('src');
      if (src) assets.push(src.trim());
    });
  return assets;
}
