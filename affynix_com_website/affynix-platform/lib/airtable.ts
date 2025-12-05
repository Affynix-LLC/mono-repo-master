import Airtable from 'airtable';

/**
 * Airtable Client Initialization
 * Environment Variables Required:
 *  - AIRTABLE_API_KEY
 *  - AIRTABLE_BASE_ID
 *  - AIRTABLE_TABLE_OFFERS (defaults to 'Offers')
 */

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_OFFERS || 'Offers';

if (!apiKey || !baseId) {
  console.error('[Airtable] Missing required environment variables.');
}

const base = new Airtable({ apiKey }).base(baseId);

/**
 * Normalize offer structure for Airtable schema.
 */
function mapOfferToRecord(offer: any) {
  return {
    Name: offer.name,
    Network: offer.network,
    Category: offer.category,
    Subdomain: offer.subdomain,
    Price: offer.price || null,
    Commission: offer.commission || null,
    Recurring: offer.recurring || false,
    AffiliateLink: offer.affiliate_link,
    RawURL: offer.raw_url,
    Summary: offer.summary || '',
    Assets: offer.assets || [],
    Status: 'Pending'
  };
}

/**
 * Check for an existing record using RawURL or Name.
 */
async function findExistingOffer(offer: any) {
  try {
    const formula = `OR({RawURL} = "${offer.raw_url}", {Name} = "${offer.name}")`;
    const found = await base(tableName).select({ filterByFormula: formula }).firstPage();

    if (found.length > 0) return found[0].id;
    return null;
  } catch (err) {
    console.error('[Airtable] findExistingOffer() error:', err);
    return null;
  }
}

/**
 * Insert or update an offer in Airtable.
 * Returns the Airtable Record ID.
 */
export async function saveOfferToAirtable(offer: any): Promise<string> {
  try {
    const recordData = mapOfferToRecord(offer);
    const existingId = await findExistingOffer(offer);

    if (existingId) {
      const updated = await base(tableName).update(existingId, recordData);
      console.log(`[Airtable] Updated record ${existingId}`);
      return updated.id;
    }

    const created = await base(tableName).create(recordData);
    console.log(`[Airtable] Created record ${created.id}`);
    return created.id;

  } catch (error) {
    console.error('[Airtable] saveOfferToAirtable() error:', error);
    throw new Error('Failed to save offer to Airtable.');
  }
}

