# 🚀 Quick Deploy Guide

## Backend Deployment (Railway)

### Step 1: Login (One-time)
```bash
railway login
```

### Step 2: Run Automated Script
```bash
cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website
./deploy-backend-auto.sh
```

The script will:
- ✅ Check authentication
- ✅ Link project (or use existing)
- ✅ Create railway.json config
- ✅ Guide you through environment variables
- ✅ Deploy to Railway

### Step 3: Add Domain
```bash
cd website_build/backend
railway domain add api.affynix.ai
```

---

## What's Already Done ✅

- ✅ Frontend deployed to Vercel (affynix.ai)
- ✅ Admin deployed to Vercel (admin.affynix.ai)
- ✅ Backend code ready
- ✅ Railway config files created
- ✅ Deployment scripts prepared

---

## Environment Variables Needed

Set these in Railway (via `railway variables` or dashboard):

```
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=<generate-random-32-char-string>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=<your-openai-api-key>
LLM_MODEL=gpt-4-turbo-preview
```

---

## After Deployment

1. **Test Backend:**
   ```bash
   curl https://api.affynix.ai/health
   ```

2. **Verify Frontend Connection:**
   - Visit https://affynix.ai
   - Check browser console for API connection

3. **Test Admin:**
   - Visit https://admin.affynix.ai
   - Login and verify dashboard loads

---

**Full guide:** `PRODUCTION_READY_CHECKLIST.md`

