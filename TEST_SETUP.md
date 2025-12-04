# Test Setup - Mono Repo Intake API

## ✅ What's Ready

1. **Intake API** - Standalone Express.js server at `intake-api/`
2. **Harvester** - Docker setup ready
3. **Combined Docker Compose** - `docker-compose.test.yml` for testing both together

## 🚀 Quick Test

### Option 1: Run Both Together (Recommended)

```bash
cd /Users/13omb3r/Dev/affynix-mono-repo

# Set environment variables (create .env in root or export)
export AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603
# Add other env vars: AIRTABLE_API_KEY, CLOUDFLARE_API_TOKEN, etc.

# Build and run both services
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml up -d

# Watch logs
docker-compose -f docker-compose.test.yml logs -f
```

### Option 2: Run Intake API Locally, Harvester in Docker

**Terminal 1 - Start Intake API:**
```bash
cd intake-api
npm install
npm run dev
```

**Terminal 2 - Run Harvester:**
```bash
cd affynix-harvester

# Update .env to point to localhost
echo "AFFYNIX_INTAKE_URL=http://host.docker.internal:3003/api/scraper-intake" > .env.local
echo "AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603" >> .env.local

docker-compose build
docker-compose up
```

### Option 3: Test Intake API Manually

```bash
cd intake-api
npm install
npm start

# In another terminal, test the endpoint:
curl -X POST http://localhost:3003/api/scraper-intake \
  -H "Content-Type: application/json" \
  -H "X-AFFYNIX-SCRAPER: 1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603" \
  -d '{
    "network": "ClickBank",
    "name": "Test Product",
    "category": "Health & Fitness",
    "affiliate_link": "https://example.com/affiliate",
    "raw_url": "https://example.com/product",
    "price": 99,
    "commission": 50
  }'
```

## 📋 Environment Variables Needed

Create a `.env` file in the root or export these:

```bash
# Scraper Auth (same for both)
AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603

# Airtable
AIRTABLE_API_KEY=your-key
AIRTABLE_BASE_ID=your-base-id

# Cloudflare
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_ZONE_ID=your-zone-id

# Vercel
VERCEL_API_TOKEN=your-token
VERCEL_PROJECT_ID=your-project-id
```

## 🎯 What Happens

1. Harvester scrapes → Posts to intake API
2. Intake API validates → Saves to Airtable
3. Intake API creates subdomain (if needed) → Cloudflare DNS + Vercel binding
4. Products appear on subdomain pages → Revenue!

## 🐛 Troubleshooting

- **Connection refused**: Make sure intake-api is running first
- **401 Unauthorized**: Check AFFYNIX_SCRAPER_KEY matches
- **Airtable errors**: Verify API key and base ID
- **DNS errors**: Check Cloudflare token permissions

