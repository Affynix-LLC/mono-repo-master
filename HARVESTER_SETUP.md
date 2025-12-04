# Harvester Setup - Quick Start

The harvester is now ready to connect to your live .com platform. Here's what's been set up:

## ✅ What's Complete

1. **Intake API Route** - Created at `affynix_com_website/affynix-platform/app/api/scraper-intake/route.ts`
2. **Library Files** - All required lib files (airtable, cloudflare, vercel, utils)
3. **Dependencies** - Added airtable and axios to platform package.json
4. **Docker Compose** - Harvester docker-compose.yml configured
5. **Documentation** - README.md created for harvester

## 🚀 Next Steps

### 1. Install Platform Dependencies

```bash
cd affynix_com_website/affynix-platform
npm install
```

### 2. Set Environment Variables in Vercel

Since the site is live, add these to your Vercel project environment variables:

- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_TABLE_OFFERS` (defaults to 'Offers')
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ZONE_ID`
- `AFFYNIX_TARGET_CNAME` (defaults to 'cname.vercel-dns.com')
- `VERCEL_API_TOKEN`
- `VERCEL_PROJECT_ID`
- `VERCEL_TEAM_ID` (optional)
- `AFFYNIX_SCRAPER_KEY` (for API authentication)

### 3. Setup Harvester

```bash
cd affynix-harvester

# Create .env file
cat > .env << EOF
AFFYNIX_INTAKE_URL=https://affynix.com/api/scraper-intake
AFFYNIX_SCRAPER_KEY=your-secure-random-key-here
EOF

# Build and run
docker-compose build
docker-compose up -d

# Check logs
docker-compose logs -f scraper
```

### 4. Test the Connection

Run the scraper manually to test:

```bash
docker-compose exec scraper node scripts/run.js
```

## 📋 Revenue Flow

1. Harvester scrapes affiliate networks → extracts offers
2. Offers posted to `/api/scraper-intake` → validated and normalized
3. Offers saved to Airtable → categorized by subdomain
4. Subdomains auto-created if needed → DNS + Vercel binding
5. Products displayed on subdomain pages → users click → revenue

## 🔧 Troubleshooting

- **API not responding**: Check Vercel logs for intake API errors
- **Airtable errors**: Verify API key and base ID are correct
- **DNS not creating**: Check Cloudflare API token permissions
- **Vercel binding fails**: Verify Vercel API token and project ID

