# Environment Variables Setup

## For Docker Compose

Create a `.env` file in the root directory (`/Users/13omb3r/Dev/affynix-mono-repo/.env`):

```bash
# Scraper Authentication
AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603

# Airtable (Personal Access Token, not API key)
AIRTABLE_API_KEY=patwU6DAjkobXeSizAir
AIRTABLE_BASE_ID=apprtDMPpjmYejxA3
AIRTABLE_TABLE_OFFERS=Offers

# Cloudflare (optional for testing)
CLOUDFLARE_API_TOKEN=
CLOUDFLARE_ZONE_ID=

# Vercel (optional for testing)
VERCEL_API_TOKEN=
VERCEL_PROJECT_ID=
VERCEL_TEAM_ID=
```

## Note About Airtable

Airtable uses **Personal Access Tokens (PAT)** not API keys. The token starts with `pat` and works the same way - just use it as `AIRTABLE_API_KEY` in the environment variables.

## Quick Start

```bash
cd /Users/13omb3r/Dev/affynix-mono-repo

# Create .env file with the values above
# Then run:
docker-compose -f docker-compose.test.yml up --build
```

Docker Compose will automatically read the `.env` file!

