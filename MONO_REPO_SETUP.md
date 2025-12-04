# Mono Repo Setup Complete! 🎉

## ✅ What's Been Created

### 1. Intake API Service (`intake-api/`)
- **Express.js server** - Standalone API for processing harvester offers
- **All library files** - airtable.js, cloudflare.js, vercel.js, utils/
- **Dockerfile** - Ready for containerization
- **Dependencies installed** - All npm packages ready
- **.env configured** - Scraper key set

### 2. Harvester (`affynix-harvester/`)
- **Docker setup** - Already configured
- **.env file** - Points to live site (can be changed for testing)
- **Docker image built** - Ready to run

### 3. Combined Testing (`docker-compose.test.yml`)
- **Both services** - Intake API + Harvester together
- **Network configured** - Services can communicate
- **Health checks** - Intake API health check included

## 🚀 Quick Start - Test Everything

### Step 1: Start Intake API Locally (for testing)

```bash
cd intake-api
npm start
```

Server runs on `http://localhost:3003`

### Step 2: Test the API Manually

```bash
curl -X POST http://localhost:3003/api/scraper-intake \
  -H "Content-Type: application/json" \
  -H "X-AFFYNIX-SCRAPER: 1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603" \
  -d '{
    "network": "ClickBank",
    "name": "Test Product",
    "category": "Health & Fitness",
    "affiliate_link": "https://example.com/affiliate",
    "raw_url": "https://example.com/product"
  }'
```

### Step 3: Update Harvester to Use Local API

```bash
cd affynix-harvester

# Create .env.local for testing
cat > .env.local << EOF
AFFYNIX_INTAKE_URL=http://host.docker.internal:3003/api/scraper-intake
AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603
EOF

# Run harvester
docker-compose --env-file .env.local up
```

### Step 4: Or Run Both Together

```bash
# From root of mono repo
export AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603
# Add other env vars as needed

docker-compose -f docker-compose.test.yml up --build
```

## 📁 File Structure

```
affynix-mono-repo/
├── intake-api/              ← NEW! Standalone API server
│   ├── server.js           ← Express server
│   ├── lib/                ← Airtable, Cloudflare, Vercel clients
│   ├── utils/              ← Format offer, subdomain router
│   ├── package.json        ← Dependencies
│   ├── Dockerfile          ← Container config
│   └── .env               ← Scraper key configured
│
├── affynix-harvester/       ← Scraper (already existed)
│   ├── scraper/           ← Playwright scrapers
│   ├── docker-compose.yml ← Harvester docker config
│   └── .env              ← Points to live site
│
└── docker-compose.test.yml ← NEW! Combined testing setup
```

## 🎯 Next Steps

1. **Add environment variables** to `intake-api/.env`:
   - Airtable credentials
   - Cloudflare credentials  
   - Vercel credentials

2. **Test locally** using the steps above

3. **Deploy intake API** to Railway/Render/Vercel when ready

4. **Update harvester** to point to deployed intake API

## 💰 Revenue Flow

1. Harvester scrapes → Posts to intake API
2. Intake API → Validates, saves to Airtable
3. Intake API → Creates subdomains (Cloudflare + Vercel)
4. Products appear → Users click → Revenue!

## 📚 Documentation

- `intake-api/README.md` - Intake API details
- `affynix-harvester/README.md` - Harvester details
- `TEST_SETUP.md` - Testing guide
- `NEXT_STEPS.md` - Deployment guide

Everything is ready to test! 🚀

