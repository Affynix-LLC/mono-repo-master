# Railway Root Directory Fix

## The Issue
Railway can't find: `/affynix_ai_website/website_build/backend`

## The Fix (In Railway Dashboard)

1. Go to: https://railway.app
2. Open your **Affynix Backend** project
3. Click on the **service** (or create one if none exists)
4. Go to **Settings** tab
5. Find **Root Directory** setting
6. Set it to: `affynix_ai_website/website_build/backend`
   - **NOT** `/affynix_ai_website/website_build/backend` (no leading slash)
   - **NOT** `website_build/backend`
   - **YES** `affynix_ai_website/website_build/backend`

7. Set **Start Command**: `npm start`
8. Save settings
9. Railway will redeploy automatically

## Verify
After saving, check the deployment logs to confirm it finds `package.json`

---

**That's it!** The root directory path is relative to your repo root, and Railway needs it set in the dashboard settings.

