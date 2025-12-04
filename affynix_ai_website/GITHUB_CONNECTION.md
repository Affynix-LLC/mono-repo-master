# GitHub Connection for Admin Project

## Current Status
The admin project is currently deployed via **CLI** (manual deployment). It's **not** connected to GitHub for automatic deployments.

## Do You Need GitHub Connection?

### ✅ **Benefits of Connecting to GitHub:**
1. **Automatic Deployments** - Deploys automatically when you push to main branch
2. **Preview Deployments** - Creates preview URLs for pull requests
3. **Deployment History** - Better tracking of deployments
4. **CI/CD Integration** - Automatic builds on every commit

### ❌ **Current Setup (CLI) Works Fine:**
- Manual deployments via `vercel --prod`
- Still works perfectly
- Just requires manual deployment when you make changes

## How to Connect to GitHub (Optional)

### Option 1: Via Vercel Dashboard (Recommended)
1. Go to: https://vercel.com/affynix/admin
2. Go to **Settings** → **Git**
3. Click **Connect Git Repository**
4. Select: `Affynix-LLC/mono-repo-master`
5. Configure:
   - **Root Directory**: `affynix_ai_website/admin`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Save

**After connecting:**
- Every push to `main` branch will auto-deploy
- Pull requests get preview deployments
- No need to run `vercel --prod` manually

### Option 2: Keep Current Setup
- Continue using `vercel --prod` when you make changes
- Works fine, just manual
- No GitHub connection needed

---

## Recommendation

**For production**: Connect to GitHub for automatic deployments  
**For now**: Current setup works fine - you can connect later if needed

---

**Bottom line**: GitHub connection is **optional** but **recommended** for automatic deployments. Your current setup works perfectly fine!

