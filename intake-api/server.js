import express from 'express';
import dotenv from 'dotenv';
import { saveOfferToAirtable } from './lib/airtable.js';
import { ensureSubdomainForCategory } from './lib/cloudflare.js';
import { bindSubdomainToVercel } from './lib/vercel.js';
import { classifyCategoryToSubdomain } from './utils/subdomainRouter.js';
import { formatOffer } from './utils/formatOffer.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

/**
 * Scraper Intake Endpoint
 *
 * This endpoint receives POSTed JSON payloads from the Docker Playwright
 * Affiliate Harvester. Each payload represents 1 fully extracted affiliate offer.
 *
 * Responsibilities:
 *  1. Validate payload structure
 *  2. Normalize + sanitize fields
 *  3. Determine correct Affynix subdomain
 *  4. Auto-create subdomain if needed
 *  5. Push offer into Airtable
 *  6. Respond with canonical offer object
 */
// Simple in-memory rate limiter for scraper intake
const scraperRateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  
  // Clean old entries
  for (const [key, timestamps] of scraperRateLimit.entries()) {
    const filtered = timestamps.filter(ts => ts > windowStart);
    if (filtered.length === 0) {
      scraperRateLimit.delete(key);
    } else {
      scraperRateLimit.set(key, filtered);
    }
  }
  
  // Check current IP
  const timestamps = scraperRateLimit.get(ip) || [];
  const recentRequests = timestamps.filter(ts => ts > windowStart);
  
  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false; // Rate limited
  }
  
  recentRequests.push(now);
  scraperRateLimit.set(ip, recentRequests);
  return true; // OK
}

app.post('/api/scraper-intake', async (req, res) => {
  try {
    // Validate scraper authentication header
    const authHeader = req.headers['x-affynix-scraper'];
    const expectedKey = process.env.AFFYNIX_SCRAPER_KEY;
    
    if (expectedKey && authHeader !== expectedKey) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Rate limiting (by IP)
    const clientIp = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({ 
        message: 'Rate limit exceeded. Please slow down requests.' 
      });
    }

    const payload = req.body;

    if (!payload) {
      return res.status(400).json({ message: 'Missing body.' });
    }

    // Basic required fields
    const required = ['network', 'name', 'category', 'affiliate_link', 'raw_url'];
    for (const field of required) {
      if (!payload[field]) {
        return res.status(400).json({ message: `Missing required field: ${field}` });
      }
    }

    // Normalize + validate the offer object
    const offer = formatOffer(payload);

    // Determine subdomain based on category taxonomy
    const subdomain = classifyCategoryToSubdomain(offer.category);

    // If subdomain does not exist → create it (Cloudflare)
    // Wrap in try-catch to prevent Cloudflare failures from blocking the response
    let ensuredSubdomain = { fqdn: `${subdomain}.affynix.com`, created: false };
    try {
      ensuredSubdomain = await ensureSubdomainForCategory(subdomain);
    } catch (err) {
      console.error('[Affynix Intake] Cloudflare error (non-blocking):', err);
    }

    // Bind new subdomain to Vercel project (if new)
    // Also wrapped to prevent blocking
    if (ensuredSubdomain.created) {
      try {
        await bindSubdomainToVercel(ensuredSubdomain.fqdn);
        console.log(`[Affynix Intake] Created + bound new subdomain: ${ensuredSubdomain.fqdn}`);
      } catch (err) {
        console.error('[Affynix Intake] Vercel binding error (non-blocking):', err);
      }
    }

    // Attach subdomain to offer
    offer.subdomain = ensuredSubdomain.fqdn;

    // Save to Airtable (critical operation - let this fail if needed)
    const airtableRecordId = await saveOfferToAirtable(offer);

    return res.status(200).json({
      status: 'ok',
      airtableRecordId,
      subdomain: offer.subdomain,
      offer
    });

  } catch (error) {
    console.error('[Affynix Intake] Error:', error);
    return res.status(500).json({
      message: 'Internal error',
      error: String(error)
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'intake-api' });
});

app.listen(PORT, () => {
  console.log(`[Intake API] Server running on port ${PORT}`);
  console.log(`[Intake API] Endpoint: http://localhost:${PORT}/api/scraper-intake`);
});

