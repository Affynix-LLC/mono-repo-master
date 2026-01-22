# Railway Setup Guide

## Quick Setup (Recommended)

### 1. Create Railway Project

1. Go to https://railway.app/new
2. Click "Empty Project"
3. Name it: `affynix-backend`
4. Click the project to open it

### 2. Get Your Service ID (Optional but Recommended)

In your Railway project:
1. Click on your service (or create one by deploying)
2. Go to Settings
3. Copy the **Service ID** (looks like: `a1b2c3d4-e5f6-1234-5678-abcdef123456`)

### 3. Add GitHub Secrets

Go to: https://github.com/Affynix-LLC/mono-repo-master/settings/secrets/actions

Add these secrets:

#### Required:
- **RAILWAY_TOKEN**: Get from https://railway.app/account/tokens
  - Click "Create Token"
  - Name it "GitHub Actions"
  - Copy the token

#### Optional but Recommended:
- **RAILWAY_SERVICE_ID**: The Service ID from step 2 above
  - This ensures deployments go to the correct service
  - Without this, Railway might create new services each deployment

#### Already Added:
- ✅ RAILWAY_TOKEN
- ✅ VERCEL_TOKEN
- ✅ OPENAI_API_KEY
- ✅ JWT_SECRET (or will use auto-generated)

#### Optional for User Creation:
- **ADMIN_PASSWORD**: Password for first admin user (min 8 chars)

### 4. Deploy via GitHub Actions

Once secrets are added:
1. Go to: https://github.com/Affynix-LLC/mono-repo-master/actions/workflows/deploy-affynix.yml
2. Click "Run workflow"
3. Select branch: `claude/build-affynix-automation-plvPW`
4. Click "Run workflow"

## Manual Railway Setup (Alternative)

If you prefer manual setup:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to backend
cd affynix_ai_website/website_build/backend

# Create new project or link existing
railway init  # creates new project
# OR
railway link  # links to existing project

# Set environment variables
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set DATABASE_PATH=/app/data/affynix.db
railway variables set JWT_SECRET=your-generated-jwt-secret
railway variables set JWT_EXPIRES_IN=7d
railway variables set OPENAI_API_KEY=your-openai-api-key
railway variables set LLM_MODEL=gpt-4-turbo-preview

# Deploy
railway up

# Get your deployment URL
railway domain
```

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| NODE_ENV | Yes | production | Node environment |
| PORT | Yes | 3001 | Server port |
| DATABASE_PATH | Yes | /app/data/affynix.db | SQLite database path |
| JWT_SECRET | Yes | auto-generated | JWT signing secret |
| JWT_EXPIRES_IN | Yes | 7d | JWT expiration |
| OPENAI_API_KEY | No | - | OpenAI API key for AI features |
| LLM_MODEL | Yes | gpt-4-turbo-preview | LLM model to use |

## Troubleshooting

### "Could not find Railway project"
- Make sure you've created a Railway project first
- Add `RAILWAY_SERVICE_ID` to GitHub secrets
- Or run `railway link` manually first

### "RAILWAY_TOKEN invalid"
- Generate a new token at https://railway.app/account/tokens
- Update the GitHub secret with the new token

### "Deployment failed"
- Check Railway dashboard: https://railway.app/dashboard
- View deployment logs for specific errors
- Ensure all required environment variables are set

### "Health check failed"
- Railway might still be deploying (can take 2-3 minutes)
- Check Railway logs for startup errors
- Verify the `/health` endpoint is accessible

## Getting Help

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- GitHub Issues: https://github.com/Affynix-LLC/mono-repo-master/issues
