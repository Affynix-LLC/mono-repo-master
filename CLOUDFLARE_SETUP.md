# Cloudflare API Token Setup

## What You Need

The scraper needs a Cloudflare API token to automatically create DNS records for new subdomains (e.g., `business.affynix.com`, `health.affynix.com`).

## Required Permissions

The token needs these permissions:
- **Zone** → **DNS** → **Edit** (to create CNAME records)
- **Zone** → **Zone** → **Read** (to check existing records)

## How to Create the Token

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com/profile/api-tokens
   - Or: Dashboard → My Profile → API Tokens

2. **Create Custom Token**
   - Click "Create Token"
   - Click "Get started" on "Create Custom Token"

3. **Set Permissions**
   - **Zone** → **DNS** → **Edit**
   - **Zone** → **Zone** → **Read**
   - **Zone Resources** → Select "Include" → "Specific zone" → Choose `affynix.com`

4. **Set Account Resources** (optional)
   - Leave as default or select your account

5. **Token Name**
   - Name it: `Affynix Scraper DNS`

6. **Create Token**
   - Click "Continue to summary"
   - Click "Create Token"
   - **COPY THE TOKEN** (you won't see it again!)

## Get Your Zone ID

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Click on `affynix.com` domain

2. **Find Zone ID**
   - Scroll down on the Overview page
   - Look for "Zone ID" in the right sidebar
   - Copy it (it's a long string like `abc123def456...`)

## Add to .env File

Add these to `/Users/13omb3r/Dev/affynix-mono-repo/affynix-harvester/.env`:

```bash
CLOUDFLARE_API_TOKEN=your-token-here
CLOUDFLARE_ZONE_ID=your-zone-id-here
AFFYNIX_TARGET_CNAME=cname.vercel-dns.com
```

## What It Does

When the scraper finds a new product category, it will:
1. Check if a subdomain exists (e.g., `health.affynix.com`)
2. If not, create a CNAME DNS record pointing to Vercel
3. The subdomain will automatically work once DNS propagates

## Optional

If you don't set these, the scraper will still work, but it won't automatically create subdomains. You'll need to create them manually in Cloudflare.

