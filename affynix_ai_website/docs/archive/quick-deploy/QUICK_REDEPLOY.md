# Quick Redeploy Admin Panel

## ✅ Fix Committed
The `vercel.json` fix has been committed to git.

## Deploy Options

### Option 1: Vercel Dashboard (Fastest - No GitHub needed)
1. **Go to**: https://vercel.com/affynix/admin
2. **Click**: **Deployments** tab
3. **Find**: Latest deployment
4. **Click**: **⋯** (three dots) → **Redeploy**
5. **Uncheck**: "Use existing Build Cache" (important!)
6. **Click**: **Redeploy**

This will rebuild with the new `vercel.json` configuration.

### Option 2: Connect to GitHub (For Future Auto-Deploys)
1. **Go to**: https://vercel.com/affynix/admin/settings/git
2. **Click**: **Connect Git Repository**
3. **Select**: `Affynix-LLC/mono-repo-master`
4. **Set Root Directory**: `affynix_ai_website/admin`
5. **Save**
6. **Push to GitHub**: `git push origin main`
7. Auto-deploys automatically!

### Option 3: Fix Root Directory First (If Still Having Issues)
1. **Go to**: https://vercel.com/affynix/admin/settings
2. **Find**: **Root Directory** setting
3. **Clear it** (leave empty) OR set to: `affynix_ai_website/admin`
4. **Save**
5. Then redeploy via Option 1

---

## After Redeploy

Test: https://admin.affynix.ai
- Should load JavaScript correctly
- No MIME type errors
- React app renders properly

---

**Recommended: Use Option 1 (Dashboard) - it's the fastest!**

