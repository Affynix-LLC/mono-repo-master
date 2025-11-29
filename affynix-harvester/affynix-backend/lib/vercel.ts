import axios from 'axios';

/**
 * Vercel Domain Binding Module
 *
 * Responsibilities:
 *  - Bind newly created Cloudflare subdomains to the Vercel project
 *  - Prevent duplicate domain bindings
 *  - Return success state for logging + scraper intake workflow
 *
 * Environment Variables Required:
 *  - VERCEL_API_TOKEN
 *  - VERCEL_PROJECT_ID
 *  - VERCEL_TEAM_ID  (optional, if project belongs to a team)
 */

const VERCEL_TOKEN = process.env.VERCEL_API_TOKEN;
const VERCEL_PROJECT_ID = process.env.VERCEL_PROJECT_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || null;

if (!VERCEL_TOKEN || !VERCEL_PROJECT_ID) {
  console.error('[Vercel] Missing required environment variables.');
}

const VERCEL_API_URL = `https://api.vercel.com/v9/projects/${VERCEL_PROJECT_ID}/domains`;

/**
 * Check if domain is already bound to the Vercel project.
 */
async function domainExists(domain: string): Promise<boolean> {
  try {
    const res = await axios.get(VERCEL_API_URL, {
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json'
      },
      params: VERCEL_TEAM_ID ? { teamId: VERCEL_TEAM_ID } : {}
    });

    const exists = res.data?.domains?.some((d: any) => d.name === domain);
    return Boolean(exists);

  } catch (err) {
    console.error('[Vercel] domainExists() error:', err);
    return false;
  }
}

/**
 * Bind domain to Vercel project.
 */
async function addDomain(domain: string): Promise<boolean> {
  try {
    await axios.post(
      VERCEL_API_URL,
      { name: domain },
      {
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        params: VERCEL_TEAM_ID ? { teamId: VERCEL_TEAM_ID } : {}
      }
    );

    console.log(`[Vercel] Bound domain to project: ${domain}`);
    return true;

  } catch (err) {
    console.error('[Vercel] addDomain() error:', err);
    return false;
  }
}

/**
 * Ensure subdomain is bound to Vercel.
 *
 * Returns:
 *  {
 *    fqdn: string,
 *    bound: boolean
 *  }
 */
export async function bindSubdomainToVercel(fqdn: string) {
  const exists = await domainExists(fqdn);

  if (exists) {
    return { fqdn, bound: false };
  }

  const success = await addDomain(fqdn);

  return { fqdn, bound: success };
}
