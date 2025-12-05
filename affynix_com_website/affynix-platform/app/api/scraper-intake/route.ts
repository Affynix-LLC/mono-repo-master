import { NextRequest, NextResponse } from 'next/server';
import { saveOfferToAirtable } from '@/lib/airtable';
import { ensureSubdomainForCategory } from '@/lib/cloudflare';
import { bindSubdomainToVercel } from '@/lib/vercel';
import { classifyCategoryToSubdomain } from '@/lib/utils/subdomainRouter';
import { formatOffer } from '@/lib/utils/formatOffer';

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

export async function POST(request: NextRequest) {
  try {
    // Optional: Validate scraper authentication header
    const authHeader = request.headers.get('X-AFFYNIX-SCRAPER');
    const expectedKey = process.env.AFFYNIX_SCRAPER_KEY;
    
    if (expectedKey && authHeader !== expectedKey) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const payload = await request.json();

    if (!payload) {
      return NextResponse.json(
        { message: 'Missing body.' },
        { status: 400 }
      );
    }

    // Basic required fields
    const required = ['network', 'name', 'category', 'affiliate_link', 'raw_url'];
    for (const field of required) {
      if (!payload[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
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

    return NextResponse.json({
      status: 'ok',
      airtableRecordId,
      subdomain: offer.subdomain,
      offer
    });

  } catch (error: any) {
    console.error('[Affynix Intake] Error:', error);
    return NextResponse.json(
      {
        message: 'Internal error',
        error: String(error)
      },
      { status: 500 }
    );
  }
}

// Only allow POST method
export async function GET() {
  return NextResponse.json(
    { message: 'POST only.' },
    { status: 405 }
  );
}

