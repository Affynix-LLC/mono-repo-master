import Airtable from 'airtable';

/**
 * Airtable Client Initialization
 * Uses environment variables:
 *  - AIRTABLE_API_KEY
 *  - AIRTABLE_BASE_ID
 *  - AIRTABLE_TABLE_OFFERS (table for affiliate offers)
 */

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_OFFERS || 'Offers';

if (!apiKey || !baseId) {
  console.error('[Airtable] Missing environment variables.');
}

const base = new Airtable({ apiKey }).base(baseId);

/**
 * Maps the offer object to Airtable row schema
 */
function mapOfferToAirtableRecord(offer: any) {
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
    Status: 'Pending',
  };
}

/**
 * Checks if the offer already exists in Airtable by RawURL or Name
 */
async function findExistingOffer(offer: any) {
  try {
    const formula = `OR({RawURL} = "${offer.raw_url}", {Name} = "${offer.name}")`;
    const records = await base(tableName).select({ filterByFormula: formula }).firstPage();

    if (records.length > 0) {
      return records[0].id;
    }
    return null;
  } catch (error) {
    console.error('[Airtable] findExistingOffer error', error);
    return null;
  }
}

/**
 * Inserts or updates an offer in Airtable.
 *
 * Returns the Airtable record ID.
 */
export async function saveOfferToAirtable(offer: any): Promise<string> {
  try {
    const data = mapOfferToAirtableRecord(offer);

    const existingId = await findExistingOffer(offer);

    // Update existing offer
    if (existingId) {
      const updated = await base(tableName).update(existingId, data);
      console.log(`[Airtable] Updated record: ${existingId}`);
      return updated.id;
    }

    // Create new offer
    const created = await base(tableName).create(data);
    console.log(`[Airtable] Created record: ${created.id}`);
    return created.id;

  } catch (error) {
    console.error('[Airtable] saveOfferToAirtable error', error);
    throw new Error('Failed to save offer to Airtable.');
  }
}