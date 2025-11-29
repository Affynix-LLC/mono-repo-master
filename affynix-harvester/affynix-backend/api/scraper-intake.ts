import type { NextApiRequest, NextApiResponse } from 'next';
import { saveOfferToAirtable } from '../../lib/airtable';
import { ensureSubdomainForCategory } from '../../lib/cloudflare';
import { bindSubdomainToVercel } from '../../lib/vercel';
import { classifyCategoryToSubdomain } from '../../utils/subdomainRouter';
import { formatOffer } from '../../utils/formatOffer';

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
 *  6. Trigger ISR (handled separately by Zapier → /api/revalidate)
 *  7. Respond with canonical offer object
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'POST only.' });
  }

  try {
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
    const ensuredSubdomain = await ensureSubdomainForCategory(subdomain);

    // Bind new subdomain to Vercel project (if new)
    if (ensuredSubdomain.created) {
      await bindSubdomainToVercel(ensuredSubdomain.fqdn);
      console.log(`[Affynix Intake] Created + bound new subdomain: ${ensuredSubdomain.fqdn}`);
    }

    // Attach subdomain to offer
    offer.subdomain = ensuredSubdomain.fqdn;

    // Save to Airtable
    const airtableRecordId = await saveOfferToAirtable(offer);

    return res.status(200).json({
      status: 'ok',
      airtableRecordId,
      subdomain: offer.subdomain,
      offer
    });

  } catch (error: any) {
    console.error('[Affynix Intake] Error:', error);
    return res.status(500).json({
      message: 'Internal error',
      error: String(error)
    });
  }
}
