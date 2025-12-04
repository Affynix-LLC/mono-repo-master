# Quick Start - Everything is Ready!

## ✅ What's Set Up

1. **Intake API** - `intake-api/` folder with Express.js server
2. **Harvester** - `affynix-harvester/` with Docker setup
3. **Docker Compose** - `docker-compose.test.yml` for running both together
4. **Airtable Credentials** - Added to `intake-api/.env`

## 🚀 Run Everything in Docker

### Step 1: Set Environment Variables

```bash
cd /Users/13omb3r/Dev/affynix-mono-repo

export AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603
export AIRTABLE_API_KEY=patwU6DAjkobXeSizAir
export AIRTABLE_BASE_ID=apprtDMPpjmYejxA3
```

### Step 2: Build and Run

```bash
docker-compose -f docker-compose.test.yml up --build
```

This will:
- Build intake-api Docker image
- Build harvester Docker image  
- Start intake-api on port 3003
- Wait for intake-api to be healthy
- Start harvester (which will scrape and post to intake-api)

### Step 3: Watch Logs

```bash
docker-compose -f docker-compose.test.yml logs -f
```

## 📋 What Happens

1. Intake API starts → Listens on port 3003
2. Harvester starts → Scrapes affiliate networks
3. Offers posted → Intake API receives them
4. Airtable saves → Offers saved to your base
5. Subdomains created → (if Cloudflare/Vercel configured)

## 🐛 Troubleshooting

**Port already in use:**
```bash
lsof -ti:3003 | xargs kill -9
```

**Check if containers are running:**
```bash
docker-compose -f docker-compose.test.yml ps
```

**View logs:**
```bash
docker-compose -f docker-compose.test.yml logs intake-api
docker-compose -f docker-compose.test.yml logs scraper
```

**Stop everything:**
```bash
docker-compose -f docker-compose.test.yml down
```

## 📁 Files

- `intake-api/` - Express.js API server
- `affynix-harvester/` - Playwright scraper
- `docker-compose.test.yml` - Runs both together
- `intake-api/.env` - Has Airtable credentials

Everything is ready - just run the docker-compose command!

