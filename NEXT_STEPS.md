# Next Steps - Get Revenue Flowing

## ✅ What's Done
- Intake API route created and ready
- All library files in place
- Harvester docker-compose configured
- Code is ready to deploy

## 🚀 Immediate Actions

### 1. Deploy Platform Changes to Vercel

The intake API needs to be deployed. Since your site is live:

```bash
cd affynix_com_website/affynix-platform

# Commit changes
git add .
git commit -m "feat: add scraper intake API and dependencies"

# Push to trigger Vercel deployment
git push origin main
```

**OR** if you're using Vercel CLI:
```bash
vercel --prod
```

### 2. Set Environment Variables in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

**Required for Intake API:**
- `AIRTABLE_API_KEY` - Your Airtable API key
- `AIRTABLE_BASE_ID` - Your Airtable base ID  
- `AIRTABLE_TABLE_OFFERS` - Table name (default: "Offers")
- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ZONE_ID` - Cloudflare zone ID
- `VERCEL_API_TOKEN` - Vercel API token
- `VERCEL_PROJECT_ID` - Your Vercel project ID
- `AFFYNIX_SCRAPER_KEY` - Random secure key (generate one)

**Optional:**
- `VERCEL_TEAM_ID` - If using team account
- `AFFYNIX_TARGET_CNAME` - Default: "cname.vercel-dns.com"

### 3. Setup Harvester

```bash
cd affynix-harvester

# Create .env file
cat > .env << 'EOF'
AFFYNIX_INTAKE_URL=https://affynix.com/api/scraper-intake
AFFYNIX_SCRAPER_KEY=<same-key-as-vercel>
EOF

# Build and test
docker-compose build
docker-compose up -d

# Watch logs
docker-compose logs -f scraper
```

### 4. Test the Connection

Run harvester manually to test:

```bash
docker-compose exec scraper node scripts/run.js
```

Check Vercel logs to see if offers are coming through.

## 📊 Verify It's Working

1. **Check Vercel logs** - Look for intake API requests
2. **Check Airtable** - Should see new offers appearing
3. **Check Cloudflare** - New subdomains should be created automatically
4. **Check Vercel domains** - New domains should be bound automatically

## 🔄 Schedule Regular Runs

Once tested, set up scheduled runs:

**Option 1: Cron (if on server)**
```bash
# Add to crontab - runs daily at 2 AM
0 2 * * * cd /path/to/affynix-harvester && docker-compose exec -T scraper node scripts/run.js
```

**Option 2: GitHub Actions** (if repo is on GitHub)
Create `.github/workflows/harvester.yml`

**Option 3: Railway/Render** - Use their cron/scheduled task feature

## 💰 Revenue Flow

Once running:
1. Harvester scrapes → Posts to intake API
2. Intake API → Saves to Airtable, creates subdomains
3. Products appear on subdomain pages
4. Users click → You earn commissions

## 🐛 Troubleshooting

- **API 401 errors**: Check `AFFYNIX_SCRAPER_KEY` matches in both places
- **Airtable errors**: Verify API key and base ID
- **DNS not creating**: Check Cloudflare token permissions
- **Vercel binding fails**: Verify Vercel API token

