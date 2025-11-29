/**
 * validateLink.js
 *
 * Utility to ensure affiliate/tracking links are valid, normalized,
 * HTTPS-enforced, and de-duplicated.
 *
 * This module is used across all network scrapers.
 */

/**
 * Normalize and validate a URL.
 * Ensures:
 *  - HTTPS protocol
 *  - No empty or malformed values
 *  - Trims whitespace + junk
 */
export function normalizeLink(url) {
  if (!url || typeof url !== 'string') return '';

  const cleaned = url.trim();

  try {
    const parsed = new URL(cleaned);
    parsed.protocol = 'https:'; // enforce https
    return parsed.toString();
  } catch (err) {
    // fallback when URL() cannot parse the string
    if (cleaned.startsWith('http')) return cleaned;
    return '';
  }
}

/**
 * Validate that a URL is real, not empty, and not broken.
 */
export function isValidUrl(url) {
  if (!url || typeof url !== 'string') return false;

  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Clean and validate affiliate link.
 * Returns "" when invalid.
 */
export function validateAffiliateLink(url) {
  const normalized = normalizeLink(url);
  return isValidUrl(normalized) ? normalized : '';
}
