# Affynix Intake API

Standalone Express.js API server for processing harvester offers. Part of the mono repo for easy testing and deployment.

## Quick Start

### 1. Install Dependencies

```bash
cd intake-api
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env with your actual values
```

### 3. Run Locally

```bash
npm run dev
# or
npm start
```

Server runs on `http://localhost:3003`

### 4. Test Endpoint

```bash
curl -X POST http://localhost:3003/api/scraper-intake \
  -H "Content-Type: application/json" \
  -H "X-AFFYNIX-SCRAPER: your-scraper-key" \
  -d '{
    "network": "ClickBank",
    "name": "Test Product",
    "category": "Health & Fitness",
    "affiliate_link": "https://example.com/affiliate",
    "raw_url": "https://example.com/product"
  }'
```

## Docker

### Build

```bash
docker build -t affynix-intake-api .
```

### Run

```bash
docker run -p 3003:3003 --env-file .env affynix-intake-api
```

## Endpoints

- `POST /api/scraper-intake` - Main intake endpoint for harvester offers
- `GET /health` - Health check endpoint

## Environment Variables

See `.env.example` for all required variables.

## Integration with Harvester

Update harvester `.env`:

```bash
AFFYNIX_INTAKE_URL=http://localhost:3003/api/scraper-intake
# or for production:
AFFYNIX_INTAKE_URL=https://your-intake-api-domain.com/api/scraper-intake
```

