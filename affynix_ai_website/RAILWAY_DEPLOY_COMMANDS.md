# Railway Backend Deployment - Quick Commands

## Step 1: Login (if not already)
```bash
cd affynix_ai_website/website_build/backend
railway login
```

## Step 2: Link Project
```bash
railway link
```
- Select "Create new project" or choose existing
- Name it: `affynix-backend`

## Step 3: Set Environment Variables
```bash
railway variables
```

Add these variables:
```
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=<generate-random-32-char-string>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=<your-openai-api-key>
LLM_MODEL=gpt-4-turbo-preview
```

**OR** use Railway Dashboard:
- Go to: https://railway.app
- Select your project → Variables tab
- Add each variable

## Step 4: Deploy
```bash
railway up
```

This will:
- Build your project
- Deploy to Railway
- Show you the deployment URL

## Step 5: Add Custom Domain
```bash
railway domain add api.affynix.ai
```

Railway will provide DNS instructions.

## Step 6: Verify
```bash
# Check deployment status
railway status

# View logs
railway logs

# Test health endpoint
curl https://api.affynix.ai/health
```

## Quick One-Liner (after login & link)
```bash
railway up && railway domain add api.affynix.ai
```

---

**Note**: The `railway.json` config file is already created in the backend directory.

