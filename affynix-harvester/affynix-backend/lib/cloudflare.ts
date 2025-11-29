import axios from 'axios';

/**
 * Cloudflare Subdomain Management
 *
 * Responsibilities:
 *  - Check if a DNS record already exists for a subdomain
 *  - Create a new CNAME DNS record when needed
 *  - Return an object describing whether the subdomain was created
 *
 * Environment Variables Required:
 *  - CLOUDFLARE_API_TOKEN
 *  - CLOUDFLARE_ZONE_ID
 *  - AFFYNIX_TARGET_CNAME (the Vercel DNS target, e.g. cname.vercel-dns.com)
 */

const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ZONE = process.env.CLOUDFLARE_ZONE_ID;
const AFFYNIX_TARGET_CNAME = process.env.AFFYNIX_TARGET_CNAME || 'cname.vercel-dns.com';

if (!CF_TOKEN || !CF_ZONE) {
  console.error('[Cloudflare] Missing required Cloudflare environment variables.');
}

const CF_API = `https://api.cloudflare.com/client/v4/zones/${CF_ZONE}/dns_records`;

/**
 * Check if DNS record for subdomain already exists.
 */
async function dnsRecordExists(fqdn: string): Promise<boolean> {
  try {
    const res = await axios.get(CF_API, {
      headers: {
        Authorization: `Bearer ${CF_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: {
        type: 'CNAME',
        name: fqdn
      }
    });

    return res.data?.result?.length > 0;
  } catch (err) {
    console.error('[Cloudflare] dnsRecordExists() error:', err);
    return false;
  }
}

/**
 * Create a DNS CNAME record for the subdomain.
 */
async function createDnsRecord(fqdn: string): Promise<boolean> {
  try {
    await axios.post(
      CF_API,
      {
        type: 'CNAME',
        name: fqdn,
        content: AFFYNIX_TARGET_CNAME,
        ttl: 1,
        proxied: false
      },
      {
        headers: {
          Authorization: `Bearer ${CF_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`[Cloudflare] Created DNS record for ${fqdn}`);
    return true;
  } catch (err) {
    console.error('[Cloudflare] createDnsRecord() error:', err);
    return false;
  }
}

/**
 * Ensure subdomain exists and create if missing.
 *
 * Returns:
 *  {
 *    fqdn: string,
 *    created: boolean
 *  }
 */
export async function ensureSubdomainForCategory(subdomain: string) {
  const fqdn = `${subdomain}.affynix.com`;

  // Check if DNS record already exists
  const exists = await dnsRecordExists(fqdn);
  if (exists) {
    return { fqdn, created: false };
  }

  // Create the new DNS record
  const created = await createDnsRecord(fqdn);

  return { fqdn, created };
}
