import Airtable from 'airtable';

/**
 * Airtable Client Initialization
 * Environment Variables Required:
 *  - AIRTABLE_API_KEY (Personal Access Token - starts with "pat")
 *  - AIRTABLE_BASE_ID
 *  - AIRTABLE_TABLE_OFFERS (defaults to 'Offers')
 */

const personalAccessToken = process.env.AIRTABLE_API_KEY; // This is actually a PAT
const baseId = process.env.AIRTABLE_BASE_ID;
const tableName = process.env.AIRTABLE_TABLE_OFFERS || 'Offers';
const leadTableName = process.env.AIRTABLE_TABLE_LEADS || 'Contacts';

let base = null;
if (personalAccessToken && baseId) {
  // Airtable library accepts PAT as apiKey parameter
  base = new Airtable({ apiKey: personalAccessToken }).base(baseId);
} else {
  console.warn('[Airtable] Missing environment variables - Airtable features disabled (test mode)');
}

/**
 * Normalize offer structure for Airtable schema.
 */
function mapOfferToRecord(offer) {
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
async function findExistingOffer(offer) {
  if (!base) return null;
  
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
export async function saveOfferToAirtable(offer) {
  if (!base) {
    console.log('[Airtable] Test mode - skipping Airtable save');
    return 'test-mode-record-id';
  }

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

const escapeFormulaValue = (value) => {
  const str = String(value ?? '');
  return str
    .replace(/\\/g, '\\\\')    // escape backslashes
    .replace(/"/g, '\\"')      // escape double quotes
    .replace(/\r?\n/g, '\\n'); // normalize newlines
};

/**
 * Map lead data to Airtable record format.
 * 
 * Fallback values:
 * - First Name defaults to 'Unknown' if not provided
 * - Sign-Up Date defaults to submittedAt date or current date
 * - Empty strings for optional fields (Last Name, Phone, Role, Notes)
 * 
 * Note: Ensure these fallbacks align with Airtable schema requirements.
 * Required fields in Airtable Contacts table: First Name, Email
 */
function mapLeadToRecord(lead) {
  const signUpDate = lead.submittedAt ? lead.submittedAt.split('T')[0] : new Date().toISOString().split('T')[0];
  return {
    'First Name': lead.firstName || 'Unknown',
    'Last Name': lead.lastName || '',
    Email: lead.email || '',
    Phone: lead.phone || '',
    Business: lead.business || '',
    Website: lead.website || '',
    'Role / Title': lead.role || '',
    'Lead Source': lead.source || 'Website',
    Status: lead.status || 'New - Intake',
    Priority: lead.priority || 'High',
    'Client Type': lead.clientType || 'Business',
    'Sign-Up Date': lead.signUpDate || signUpDate,
    Notes: lead.notes || '',
    ConversationId: lead.conversationId || '',
    Transcript: lead.transcript || '',
    SubmittedAt: lead.submittedAt || new Date().toISOString(),
    PathType: lead.pathType || ''
  };
}

/**
 * Find existing lead record in Airtable.
 * 
 * Searches by Email, Phone, or ConversationId using OR logic.
 * 
 * Note: Formula values are escaped to prevent injection attacks.
 * The escapeFormulaValue function handles quotes, backslashes, and newlines.
 * If more complex queries are needed, consider using Airtable SDK's query methods.
 */
async function findExistingLead(lead) {
  if (!base) return null;

  const filters = [];
  if (lead.email) {
    filters.push(`{Email} = "${escapeFormulaValue(lead.email)}"`);
  }
  if (lead.phone) {
    filters.push(`{Phone} = "${escapeFormulaValue(lead.phone)}"`);
  }
  if (lead.conversationId) {
    filters.push(`{ConversationId} = "${escapeFormulaValue(lead.conversationId)}"`);
  }

  if (filters.length === 0) {
    return null;
  }

  const formula = `OR(${filters.join(',')})`;

  try {
    const found = await base(leadTableName).select({ filterByFormula: formula }).firstPage();
    if (found.length > 0) return found[0].id;
    return null;
  } catch (err) {
    console.error('[Airtable] findExistingLead() error:', err);
    return null;
  }
}

export async function saveLeadToAirtable(lead) {
  if (!base) {
    console.log('[Airtable] Test mode - skipping lead save');
    return 'test-mode-record-id';
  }

  if (!lead || !lead.email || !lead.firstName || !lead.business || !lead.website || !lead.phone) {
    throw new Error('Lead must include first name, email, business, website, and phone');
  }

  try {
    const recordData = mapLeadToRecord(lead);
    const existingId = await findExistingLead(lead);

    if (existingId) {
      const updated = await base(leadTableName).update(existingId, recordData);
      console.log(`[Airtable] Updated lead ${existingId}`);
      return updated.id;
    }

    const created = await base(leadTableName).create(recordData);
    console.log(`[Airtable] Created lead ${created.id}`);
    return created.id;
  } catch (error) {
    console.error('[Airtable] saveLeadToAirtable() error:', error);
    throw new Error('Failed to save lead to Airtable.');
  }
}
