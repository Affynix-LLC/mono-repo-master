# How to Disable Vercel Authentication

## Current Status
✅ Vercel Authentication is **ACTIVE** (blocking all requests)
✅ API Key Authentication is **IMPLEMENTED** (ready to protect)
❌ Need to disable Vercel Auth so API keys can work

## Steps to Disable

### Method 1: Via Vercel Dashboard (Recommended)

1. **Go to Project Settings**
   - URL: https://vercel.com/affynix/ai-gateway/settings/deployment-protection

2. **Find "Vercel Authentication" Section**
   - Look for "Deployment Protection" or "Password Protection"
   - Should show as "Enabled" or "Active"

3. **Disable for Production**
   - Toggle OFF "Vercel Authentication" for Production environment
   - Or set it to "None" / "Disabled"
   - **Keep it enabled for Preview** (optional, for security)

4. **Save Changes**
   - Click "Save" or "Update"
   - Changes take effect immediately (no redeploy needed)

### Method 2: Via Vercel CLI (If Available)

```bash
# Check if CLI supports this (may not be available)
vercel project update ai-gateway --protection-bypass
```

Note: CLI may not support this - dashboard is the reliable method.

## After Disabling

### Test Without API Key (Should get 401 from YOUR auth)
```bash
curl https://ai-gateway-gxdd13yuz-affynix.vercel.app/api/tasks
# Expected: 401 Unauthorized (from your API key auth, not Vercel)
```

### Test With API Key (Should work)
```bash
curl -H "x-api-key: d927b1637e7a6c983e0ed28f875df803db1655e15357ef179451e783b62d19b7" \
  https://ai-gateway-gxdd13yuz-affynix.vercel.app/api/tasks
# Expected: 200 OK or empty array
```

## What Happens After Disabling

### Before (Current State):
```
Request → Vercel Auth Check → ❌ BLOCKED (authentication page)
```

### After (What We Want):
```
Request → Vercel (no auth) → API Key Check → ✅ ALLOWED or ❌ 401
```

## Security After Disabling

✅ **Still Secure Because:**
- API key authentication protects all endpoints
- Webhooks use signature verification
- Fail-secure: If no API key set, all access denied

❌ **Not Secure If:**
- You disable Vercel Auth AND don't set API_KEY
- You disable Vercel Auth AND disable API key checks

## Verification

After disabling, run:
```bash
# Should get 401 (your auth), not Vercel auth page
curl -I https://ai-gateway-gxdd13yuz-affynix.vercel.app/api/tasks

# Should work with API key
curl -H "x-api-key: d927b1637e7a6c983e0ed28f875df803db1655e15357ef179451e783b62d19b7" \
  https://ai-gateway-gxdd13yuz-affynix.vercel.app/api/tasks
```

## Quick Link

**Direct link to disable:**
https://vercel.com/affynix/ai-gateway/settings/deployment-protection

