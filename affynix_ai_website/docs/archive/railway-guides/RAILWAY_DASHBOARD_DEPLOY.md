# Railway Dashboard Deployment (Alternative)

Since Railway CLI authentication requires browser interaction, here's how to deploy via the Railway Dashboard:

## Step 1: Go to Railway Dashboard
1. Visit: https://railway.app
2. Login/Register if needed

## Step 2: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Connect your GitHub account if not already connected
4. Select repository: `Affynix-LLC/mono-repo-master` (or your repo name)

## Step 3: Configure Service
1. After importing, Railway will detect the repo
2. Click on the service
3. Go to **Settings** tab
4. Set **Root Directory**: `affynix_ai_website/website_build/backend`
5. Set **Start Command**: `npm start`
6. **Build Command**: Leave empty (no build needed)

## Step 4: Set Environment Variables
1. Go to **Variables** tab
2. Add these variables:

```
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=<generate-random-32-char-string>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=<your-openai-api-key>
LLM_MODEL=gpt-4-turbo-preview
```

**To generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

## Step 5: Deploy
1. Railway will automatically deploy when you save settings
2. Or click **"Deploy"** button
3. Wait for deployment to complete (check **Deployments** tab)

## Step 6: Add Custom Domain
1. Go to **Settings** → **Networking**
2. Click **"Add Domain"**
3. Enter: `api.affynix.ai`
4. Railway will provide DNS instructions
5. Add the CNAME record to your DNS provider

## Step 7: Verify Deployment
1. Check **Deployments** tab for status
2. Click on deployment to see logs
3. Test health endpoint:
   ```bash
   curl https://api.affynix.ai/health
   ```
   Should return: `{"status":"ok"}`

## Troubleshooting

### Deployment Fails
- Check **Logs** tab for errors
- Verify all environment variables are set
- Ensure `package.json` has `start` script

### Domain Not Working
- Verify DNS records are correct
- Wait for DNS propagation (can take up to 48 hours)
- Check Railway domain status in dashboard

### API Not Responding
- Check deployment logs
- Verify `OPENAI_API_KEY` is set correctly
- Test locally first: `npm start`

---

**After deployment, your frontend and admin will be able to connect to the API!**

