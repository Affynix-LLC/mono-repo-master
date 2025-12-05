# Docker Setup for Affynix Harvester + Intake API

This setup runs both the **Intake API** and **Harvester Scraper** in Docker containers.

## Quick Start

### 1. Set Environment Variables

Create a `.env` file in `affynix-harvester/`:

```bash
# Scraper Authentication
AFFYNIX_SCRAPER_KEY=1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603

# Airtable (Required)
AIRTABLE_API_KEY=patwU6DAjkobXeSizAir
AIRTABLE_BASE_ID=apprtDMPpjmYejxA3

# Cloudflare (Optional - for subdomain creation)
CLOUDFLARE_API_TOKEN=your-cloudflare-token
CLOUDFLARE_ZONE_ID=your-zone-id
AFFYNIX_TARGET_CNAME=cname.vercel-dns.com

# Vercel (Optional - for domain binding)
VERCEL_API_TOKEN=your-vercel-token
VERCEL_PROJECT_ID=your-project-id
VERCEL_TEAM_ID=your-team-id

# OpenAI (Required for AI-powered routing)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 2. Build and Start

```bash
cd affynix-harvester
docker-compose up --build -d
```

### 3. Monitor Logs

```bash
# View all logs
docker-compose logs -f

# View intake API logs only
docker-compose logs -f intake-api

# View scraper logs only
docker-compose logs -f scraper
```

### 4. Test the Intake API

```bash
# Health check
curl http://localhost:3003/health

# Test endpoint (from host machine)
curl -X POST http://localhost:3003/api/scraper-intake \
  -H "Content-Type: application/json" \
  -H "X-AFFYNIX-SCRAPER: 1b9fdfac2e5e1180a450be225c38950d965cf681680a01c6119f98e729081603" \
  -d '{
    "network": "test",
    "name": "Test Offer",
    "category": "Health & Fitness",
    "affiliate_link": "https://example.com/offer",
    "raw_url": "https://example.com"
  }'
```

## Architecture

```
┌─────────────────┐
│  Intake API     │  Port 3003 (exposed to host)
│  (Express)      │  └─ Receives offers from scraper
└─────────────────┘  └─ Creates subdomains (Cloudflare)
         ▲           └─ Binds domains (Vercel)
         │           └─ Saves to Airtable
         │
         │ HTTP POST /api/scraper-intake
         │
┌─────────────────┐
│  Scraper        │  Runs Playwright scrapers
│  (Playwright)   │  └─ ClickBank, WarriorPlus, JVZoo, etc.
└─────────────────┘  └─ Posts offers to intake-api
```

## Services

### Intake API (`intake-api`)
- **Port**: 3003 (exposed to host)
- **Health Check**: `/health`
- **Endpoints**:
  - `/api/scraper-intake` - Receive offers from scraper
  - `/api/routing-feedback` - Submit routing corrections for learning
- **Features**:
  - AI-powered subdomain routing (uses OpenAI embeddings + LLM)
  - Rate limiting (100 req/min per IP)
  - Authentication via `X-AFFYNIX-SCRAPER` header
  - Cloudflare DNS creation
  - Vercel domain binding
  - Airtable integration
  - Learning system that improves routing accuracy over time

### Scraper (`scraper`)
- **Depends on**: `intake-api` (waits for health check)
- **Volumes**: 
  - `./scraper/logs` - Scraper logs
  - `./scraper/sessions` - Browser sessions (cookies, etc.)
- **Networks**: Communicates with `intake-api` via Docker network

## Running Manually

### Run scraper once (for testing):

```bash
docker-compose exec scraper node scripts/run.js
```

### Restart services:

```bash
docker-compose restart intake-api
docker-compose restart scraper
```

### Stop services:

```bash
docker-compose down
```

### Rebuild after code changes:

```bash
docker-compose up --build -d
```

## Troubleshooting

### Intake API not starting
- Check logs: `docker-compose logs intake-api`
- Verify environment variables are set
- Check port 3003 is not in use: `lsof -i :3003`

### Scraper can't reach intake API
- Verify `intake-api` is healthy: `docker-compose ps`
- Check network: `docker network inspect affynix-harvester_affynix-network`
- Verify `AFFYNIX_INTAKE_URL=http://intake-api:3003/api/scraper-intake` in scraper env

### Rate limiting issues
- Intake API limits to 100 requests/minute per IP
- If hitting limits, add delays between scraper requests

### AI Routing not working
- Verify `OPENAI_API_KEY` is set in `.env` file
- Check logs: `docker-compose logs intake-api | grep "AI Router"`
- If OpenAI API fails, system automatically falls back to static category-based routing
- Monitor OpenAI API usage and costs

### Submitting routing feedback
- Use `/api/routing-feedback` endpoint to correct routing decisions
- Format: `POST /api/routing-feedback` with `{ offerId, offerName, correctSubdomain, reason? }`
- Feedback is stored in Airtable "RoutingHistory" table for learning

## AI Routing System

The intake API uses AI-powered routing to intelligently route offers to subdomains:

1. **Embedding-based matching**: Uses OpenAI embeddings to find semantically similar subdomains
2. **LLM refinement**: Uses GPT to make final routing decision with context
3. **Learning system**: Stores routing decisions in Airtable and learns from feedback
4. **Fallback safety**: Automatically falls back to static routing if AI fails

### Airtable Setup for Learning

Create a table called "RoutingHistory" with these fields:
- **OfferName** (Single line text)
- **Category** (Single line text)
- **OriginalSubdomain** (Single line text) - AI's routing decision
- **CorrectSubdomain** (Single line text) - Manual correction (optional)
- **Confidence** (Number) - 0-1 confidence score
- **Network** (Single line text)
- **Summary** (Long text)
- **Timestamp** (Date)
- **Status** (Single select: pending, confirmed, corrected)
- **Feedback** (Long text) - Optional reason for correction

## Production Deployment

For production, consider:
1. **Reverse Proxy**: Use nginx/traefik in front of intake-api
2. **SSL/TLS**: Add HTTPS termination
3. **Monitoring**: Add Prometheus/Grafana
4. **Logging**: Centralized logging (ELK, Loki)
5. **Scaling**: Run multiple scraper instances with different networks
6. **OpenAI Costs**: Monitor API usage and set usage limits

