/**
 * subdomainRouter.js
 *
 * Affynix Category → Subdomain Taxonomy Engine
 *
 * This module receives a normalized category string such as:
 *   "Digital Marketing"
 *   "Health & Fitness"
 *   "Crypto / Trading"
 *   "AI Tools"
 *
 * And deterministically maps them to subdomains such as:
 *   marketing.affynix.com
 *   health.affynix.com
 *   crypto.affynix.com
 *   ai.affynix.com
 *
 * Any category not recognized is routed to a fallback:
 *   general.affynix.com
 *
 * This ensures:
 *  - No duplicated categories
 *  - No fragmented subdomain naming
 *  - Automatic routing for new affiliate networks
 *
 * The actual DNS creation & Vercel binding is handled by:
 *  - cloudflare.js
 *  - vercel.js
 */

const CATEGORY_MAP = {
  // Core verticals
  'digital marketing': 'marketing',
  'marketing': 'marketing',
  'business': 'business',
  'business development': 'business',
  'ecommerce': 'ecommerce',
  'e-commerce': 'ecommerce',

  // AI & Tech
  'ai': 'ai',
  'ai tools': 'ai',
  'software': 'software',
  'technology': 'tech',
  'tech': 'tech',

  // Finance
  'crypto': 'crypto',
  'trading': 'crypto',
  'investing': 'finance',
  'finance': 'finance',
  'money': 'money',

  // Health
  'health': 'health',
  'fitness': 'health',
  'health & fitness': 'health',
  'health and fitness': 'health',
  'supplements': 'health',
  'wellness': 'health',

  // Home & Lifestyle
  'home': 'home',
  'lifestyle': 'lifestyle',
  'relationships': 'relationships',
  'dating': 'relationships',

  // Education
  'courses': 'education',
  'training': 'education',
  'education': 'education',

  // Default general fallback
  'default': 'general'
};

/**
 * Normalize a category string to lowercase and strip symbols.
 */
function normalizeCategory(input) {
  if (!input) return 'default';

  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert a category into a canonical Affynix subdomain slug.
 *
 * If category is unknown, send to the general fallback.
 */
export function classifyCategoryToSubdomain(category) {
  const normalized = normalizeCategory(category);

  if (CATEGORY_MAP[normalized]) {
    return CATEGORY_MAP[normalized];
  }

  // Fallback to general
  return CATEGORY_MAP['default'];
}

/**
 * AI-powered subdomain routing
 * 
 * Uses AI to intelligently route offers to subdomains based on semantic understanding.
 * Falls back to static routing if AI is unavailable or fails.
 * 
 * @param {Object} offer - The offer object with name, category, summary, etc.
 * @returns {Promise<string>} - The subdomain slug (e.g., 'health', 'business')
 */
export async function classifyCategoryToSubdomainAI(offer) {
  try {
    // Dynamic import to avoid circular dependencies
    const { routeOffer } = await import('../lib/ai-router.js');
    const result = await routeOffer(offer);
    return result.subdomain;
  } catch (error) {
    console.error('[Subdomain Router] AI routing failed, using static fallback:', error);
    // Fallback to static routing
    return classifyCategoryToSubdomain(offer.category);
  }
}

