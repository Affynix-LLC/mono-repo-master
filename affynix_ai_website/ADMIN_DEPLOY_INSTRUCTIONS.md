# Admin Panel - Deploy Fixed Configuration

## Issue
JavaScript assets are being served as HTML due to routing configuration.

## Fix Applied
Updated `vercel.json` to use correct format (matches working frontend).

## Deploy the Fix

### Option 1: Via Vercel Dashboard (Easiest)
1. Go to: https://vercel.com/affynix/admin
2. Go to **Deployments** tab
3. Click **Redeploy** on the latest deployment
4. Select **Use existing Build Cache**: No (to rebuild with new config)
5. Click **Redeploy**

### Option 2: Connect to GitHub (Recommended for Future)
1. Go to: https://vercel.com/affynix/admin/settings/git
2. Click **Connect Git Repository**
3. Select: `Affynix-LLC/mono-repo-master`
4. Set **Root Directory**: `affynix_ai_website/admin`
5. Save
6. Push changes to GitHub → auto-deploys

### Option 3: Fix Root Directory First
If you see path errors:
1. Go to: https://vercel.com/affynix/admin/settings
2. Find **Root Directory** setting
3. Clear it (leave empty) OR set to: `affynix_ai_website/admin`
4. Save
5. Then redeploy

## After Deployment

Test: https://admin.affynix.ai
- Open browser console (F12)
- Should see no MIME type errors
- JavaScript should load correctly
- React app should render

---

**The fix is in `vercel.json` - just needs to be deployed!**

