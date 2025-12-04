# Final Deployment Steps

## Current Status
- ✅ Frontend: Deployed to Vercel (affynix.ai)
- ✅ Admin: Deployed to Vercel (admin.affynix.ai)  
- ⚠️ Backend: Ready but needs deployment

## Railway CLI Issue
Railway CLI requires interactive browser login which can't be automated. The token stored (`da25fc76-fdac-4918-871f-eee3daa4b140`) appears to be a project token, not an auth token.

## Solution: Use Railway Dashboard

Since you're already logged into Railway dashboard, this is the fastest path:

### Step 1: Go to Railway Dashboard
https://railway.app

### Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository

### Step 3: Configure Service
- **Root Directory**: `affynix_ai_website/website_build/backend`
- **Start Command**: `npm start`
- **Build Command**: (leave empty)

### Step 4: Environment Variables
Add these in Railway → Variables:

```
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=<run: openssl rand -hex 32>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=<your-openai-key>
LLM_MODEL=gpt-4-turbo-preview
```

### Step 5: Deploy
Railway will auto-deploy. Check the Deployments tab.

### Step 6: Add Domain
- Settings → Networking → Add Domain
- Enter: `api.affynix.ai`
- Follow DNS instructions

### Step 7: Test
```bash
curl https://api.affynix.ai/health
```

Should return: `{"status":"ok"}`

---

## Alternative: Fix CLI Login

If you want to use CLI:

1. **In your terminal, run:**
   ```bash
   railway login
   ```

2. **Complete browser authentication**

3. **Then run:**
   ```bash
   cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website
   ./deploy-backend-auto.sh
   ```

---

**The dashboard method is recommended - it's faster and you're already logged in!**

