# Admin MIME Type Fix

## Issue
JavaScript modules are being served as `text/html` instead of `application/javascript`, causing:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "text/html"
```

## Fix Applied
Updated `vercel.json` to use the same format as the frontend (which works correctly).

## Deploy the Fix

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/affynix/admin
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Or push to GitHub if connected

### Option 2: Via CLI (if path issue is fixed)
```bash
cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website/admin
vercel --prod
```

### Option 3: Connect to GitHub for Auto-Deploy
1. Go to: https://vercel.com/affynix/admin/settings/git
2. Connect to: `Affynix-LLC/mono-repo-master`
3. Set Root Directory: `affynix_ai_website/admin`
4. Push changes to GitHub → auto-deploys

## What Changed
- Updated `vercel.json` to use `rewrites` instead of `routes`
- Matches the working frontend configuration
- Vercel will automatically serve static files with correct MIME types

## After Deployment
Test: https://admin.affynix.ai
- Should load JavaScript correctly
- No MIME type errors
- React app should render

---

**The fix is ready - just needs to be deployed!**

