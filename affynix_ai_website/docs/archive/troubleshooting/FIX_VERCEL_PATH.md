# Fix Vercel Admin Project Path Issue

## Problem
Vercel is looking for: `~/Dev/affynix-mono-repo/affynix_ai_website/admin/affynix_ai_website/admin`
This is wrong - the path is duplicated.

## Fix in Vercel Dashboard

### Step 1: Go to Project Settings
1. Go to: https://vercel.com/affynix/admin/settings
2. Scroll to **Root Directory** setting

### Step 2: Fix Root Directory
**Current (wrong)**: `affynix_ai_website/admin/affynix_ai_website/admin`  
**Should be**: Leave **EMPTY** or set to: `affynix_ai_website/admin`

**Action**:
- Clear the Root Directory field (leave empty)
- OR set it to: `affynix_ai_website/admin` (relative to repo root)
- Save

### Step 3: Redeploy
After fixing the path:
1. Go to **Deployments** tab
2. Click **Redeploy** on latest deployment
3. Or push to GitHub if connected

## Alternative: Deploy via Dashboard

Since CLI has path issues:

1. Go to: https://vercel.com/affynix/admin
2. Click **Deployments** → **Redeploy**
3. Or: **Settings** → **Git** → Connect to GitHub → Push changes

---

**The root directory setting in Vercel dashboard needs to be fixed or cleared!**

