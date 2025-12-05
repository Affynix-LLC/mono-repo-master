# Railway GitHub Deployment Setup

Since Railway deploys from GitHub, you need to set the **Root Directory** in Railway dashboard.

## Steps:

1. **Go to Railway Dashboard**: https://railway.app
2. **Open your project**: "Affynix Backend"
3. **Click on the service** (or create one if needed)
4. **Go to Settings tab**
5. **Find "Root Directory"** field
6. **Set it to**: `affynix_ai_website/website_build/backend`
   - This is the path **relative to your GitHub repo root**
   - Your repo: `Affynix-LLC/mono-repo-master`
   - Backend is at: `affynix_ai_website/website_build/backend/`

7. **Set Start Command**: `npm start`
8. **Set Build Command**: (leave empty - no build needed)
9. **Save** - Railway will redeploy

## Your GitHub Repo Structure:
```
mono-repo-master/
├── affynix_ai_website/
│   └── website_build/
│       └── backend/          ← Railway needs to point here
│           ├── package.json
│           ├── server.js
│           └── ...
```

## Root Directory Setting:
**Correct**: `affynix_ai_website/website_build/backend`  
**Wrong**: `/affynix_ai_website/website_build/backend` (no leading slash)  
**Wrong**: `website_build/backend` (missing affynix_ai_website)

---

After setting this, Railway will:
- Find your `package.json`
- Install dependencies
- Run `npm start`
- Deploy your backend!

