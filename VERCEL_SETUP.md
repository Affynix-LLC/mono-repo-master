# Vercel API Token Setup

## What You Need

The intake API needs a Vercel API token to automatically bind newly created subdomains to your Vercel project.

## Required Information

✅ **Already Added:**
- `VERCEL_PROJECT_ID`: `prj_SDMeaVh0GEc7gdmbxBtSfbJ50LcC` (affynix.com project - for subdomains like health.affynix.com, business.affynix.com)
- `VERCEL_TEAM_ID`: `team_ffSkbObQFzckEPWZSlpzwGMq` (from affynix.com project)

❌ **Still Needed:**
- `VERCEL_API_TOKEN` - You need to create this

## How to Get Vercel API Token

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/account/tokens
   - Or: Dashboard → Settings → Tokens

2. **Create New Token**
   - Click "Create Token"
   - Name it: `Affynix Intake API`
   - Set expiration (or leave as "No expiration")
   - Click "Create"

3. **Copy the Token**
   - **IMPORTANT**: Copy it immediately - you won't see it again!
   - It will look like: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

4. **Add to .env File**

Add this line to `/Users/13omb3r/Dev/affynix-mono-repo/affynix-harvester/.env`:

```bash
VERCEL_API_TOKEN=your-token-here
```

## What It Does

When the scraper finds a new product category:
1. Cloudflare creates the DNS record (e.g., `health.affynix.com`)
2. Vercel automatically binds the domain to your project
3. The subdomain becomes live on Vercel

## Current Configuration

Your `.env` file should have:
```bash
VERCEL_PROJECT_ID=prj_SDMeaVh0GEc7gdmbxBtSfbJ50LcC
VERCEL_TEAM_ID=team_ffSkbObQFzckEPWZSlpzwGMq
VERCEL_API_TOKEN=your-token-here  # ← Add this
```

## Optional

If you don't set the API token, the scraper will still work, but domains won't be automatically bound to Vercel. You'll need to add them manually in the Vercel dashboard.

