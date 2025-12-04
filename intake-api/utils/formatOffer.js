/**
 * formatOffer.js
 *
 * This module normalizes and sanitizes the raw offer payload coming from the
 * Docker Playwright scraper. The scraper can return slightly different shapes
 * depending on the affiliate network, so this ensures a consistent structure
 * for Airtable, subdomain routing, modal building, and ISR triggering.
 */

export function formatOffer(raw) {

  // Normalize strings, trim, fallback to empty string
  const clean = (val) =>
    typeof val === 'string' ? val.trim() : (val || '');

  // Remove querystring junk, ensure link is HTTPS
  const normalizeAffiliateLink = (url) => {
    if (!url) return '';
    try {
      const u = new URL(url);
      u.protocol = 'https:'; // enforce https
      return u.toString();
    } catch {
      return url.trim();
    }
  };

  return {
    network: clean(raw.network),
    name: clean(raw.name),
    category: clean(raw.category),
    price: raw.price ?? null,
    commission: raw.commission ?? null,
    recurring: Boolean(raw.recurring),
    summary: clean(raw.summary),
    assets: Array.isArray(raw.assets) ? raw.assets : [],
    affiliate_link: normalizeAffiliateLink(raw.affiliate_link),
    raw_url: clean(raw.raw_url),
    // Subdomain assigned later by cloudflare + vercel modules
    subdomain: ''
  };
}

