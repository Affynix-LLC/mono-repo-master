# Affynix Harvester

Autonomous Playwright-based scraper for affiliate networks that posts offers to the Affynix intake API.

## Quick Start

### 1. Setup Environment Variables

Create a `.env` file in the `affynix-harvester/` directory:

```bash
# Intake API Configuration
AFFYNIX_INTAKE_URL=https://affynix.com/api/scraper-intake
AFFYNIX_SCRAPER_KEY=your-secure-random-key-here

# Optional: Affiliate Network Credentials (if scrapers require login)
# CLICKBANK_USERNAME=your-username
# CLICKBANK_PASSWORD=your-password
# WARRIORPLUS_USERNAME=your-username
# WARRIORPLUS_PASSWORD=your-password
```

### 2. Build and Run

```bash
cd affynix-harvester
docker-compose build
docker-compose up -d
```

### 3. Monitor Logs

```bash
docker-compose logs -f scraper
```

### 4. Run Manually (for testing)

```bash
docker-compose exec scraper node scripts/run.js
```

## How It Works

1. **Scraper runs** → Extracts offers from affiliate networks (ClickBank, WarriorPlus, JVZoo, etc.)
2. **Offers normalized** → Each offer is formatted consistently
3. **Posted to intake API** → `POST https://affynix.com/api/scraper-intake`
4. **Intake API processes** → Validates, categorizes, creates subdomains if needed, saves to Airtable

## Networks Supported

- ClickBank
- WarriorPlus
- JVZoo
- Impact
- CJ (Commission Junction)
- Generic (fallback scraper)

## Scheduled Runs

To run the harvester on a schedule, you can:

1. **Use cron** (if running on a server):
   ```bash
   # Add to crontab: Run daily at 2 AM
   0 2 * * * cd /path/to/affynix-harvester && docker-compose exec -T scraper node scripts/run.js
   ```

2. **Use GitHub Actions** (if repo is on GitHub):
   - Create `.github/workflows/harvester.yml`
   - Schedule with cron syntax

3. **Use Railway/Render cron** (if deployed there):
   - Configure scheduled tasks in dashboard

## Troubleshooting

### Scraper not posting offers
- Check `AFFYNIX_INTAKE_URL` is correct
- Verify `AFFYNIX_SCRAPER_KEY` is set
- Check logs: `docker-compose logs scraper`

### Network login failures
- Ensure credentials are set in `.env` if required
- Check network-specific scraper files for login requirements

### Intake API errors
- Verify the intake API endpoint is accessible
- Check intake API logs in Vercel dashboard
- Ensure Airtable/Cloudflare/Vercel credentials are set in platform `.env.local`

