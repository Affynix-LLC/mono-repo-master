# Admin Domain Fix

## Issue
`admin.affynix.ai` returns Cloudflare error: "DNS points to prohibited IP"

## Status
- ✅ Admin is deployed and working on Vercel: https://admin-2w8151ols-affynix.vercel.app
- ❌ Custom domain `admin.affynix.ai` not configured correctly

## Fix: Configure Domain in Vercel

### Step 1: Add Domain in Vercel Dashboard
1. Go to: https://vercel.com/dashboard
2. Open your **admin** project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter: `admin.affynix.ai`
6. Click **Add**

### Step 2: Configure DNS in Cloudflare
Vercel will show DNS instructions. You need to add:

**Option A: CNAME Record (Recommended)**
- **Type**: CNAME
- **Name**: `admin`
- **Target**: Vercel-provided CNAME (e.g., `cname.vercel-dns.com`)
- **Proxy**: Off (gray cloud) initially, then can enable

**Option B: A Record**
- **Type**: A
- **Name**: `admin`
- **Target**: Vercel-provided IP address
- **Proxy**: Off (gray cloud)

### Step 3: Verify in Cloudflare
1. Go to Cloudflare Dashboard
2. Select `affynix.ai` domain
3. Go to **DNS** → **Records**
4. Check if `admin` record exists
5. If it points to wrong IP, update it with Vercel's instructions

### Step 4: Wait for DNS Propagation
- Can take 5 minutes to 48 hours
- Usually works within 15-30 minutes

### Step 5: Test
```bash
curl -I https://admin.affynix.ai
```
Should return HTTP 200 (not 403)

---

## Temporary Access
While DNS propagates, you can access admin at:
**https://admin-2w8151ols-affynix.vercel.app**

---

## Common Issues

### Cloudflare Proxy Enabled
If Cloudflare proxy (orange cloud) is enabled, it might conflict. Try:
1. Disable proxy (gray cloud) in Cloudflare
2. Wait for DNS to update
3. Re-enable proxy if needed

### Wrong IP Address
If DNS points to wrong IP:
1. Remove old DNS record
2. Add new record with Vercel's instructions
3. Wait for propagation

---

**The admin is working - just needs DNS configuration!**

