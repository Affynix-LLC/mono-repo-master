# Admin Domain DNS Setup

## Status
✅ Domain `admin.affynix.ai` added to Vercel project  
⚠️ DNS needs to be configured in Cloudflare

## Next Steps: Configure DNS in Cloudflare

### Step 1: Get DNS Instructions from Vercel
1. Go to: https://vercel.com/dashboard
2. Open your **admin** project
3. Go to **Settings** → **Domains**
4. Click on `admin.affynix.ai`
5. Vercel will show DNS configuration instructions

### Step 2: Update DNS in Cloudflare
1. Go to: https://dash.cloudflare.com
2. Select `affynix.ai` domain
3. Go to **DNS** → **Records**
4. Find or create the `admin` subdomain record

**Configure based on Vercel's instructions:**

**If Vercel says to use CNAME:**
- **Type**: CNAME
- **Name**: `admin`
- **Target**: (Vercel-provided CNAME, e.g., `cname.vercel-dns.com`)
- **Proxy status**: ⚪ Off (gray cloud) - disable proxy initially
- **TTL**: Auto

**If Vercel says to use A record:**
- **Type**: A
- **Name**: `admin`
- **IPv4 address**: (Vercel-provided IP)
- **Proxy status**: ⚪ Off (gray cloud)
- **TTL**: Auto

### Step 3: Verify in Vercel
1. Go back to Vercel Dashboard
2. Check **Settings** → **Domains** → `admin.affynix.ai`
3. Status should change from "Pending" to "Valid" once DNS propagates

### Step 4: Test
Wait 5-30 minutes for DNS propagation, then:
```bash
curl -I https://admin.affynix.ai
```
Should return HTTP 200 (not 403)

---

## Troubleshooting

### Still getting 403 after DNS update?
1. Make sure Cloudflare proxy is **OFF** (gray cloud)
2. Wait longer for DNS propagation (can take up to 48 hours)
3. Check DNS records match Vercel's instructions exactly
4. Try clearing DNS cache: `nslookup admin.affynix.ai`

### Domain shows "Pending" in Vercel?
- DNS hasn't propagated yet
- Wait 15-30 minutes
- Check DNS records are correct in Cloudflare

---

## Temporary Access
While DNS propagates, admin is accessible at:
**https://admin-2w8151ols-affynix.vercel.app**

---

**The domain is added to Vercel - just need to configure DNS in Cloudflare!**

