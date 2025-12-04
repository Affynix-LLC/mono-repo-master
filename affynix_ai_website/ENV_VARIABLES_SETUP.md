# Environment Variables Setup

## Step 2: Verify Environment Variables

### Backend (Railway) - Required Variables

**Where**: Railway Dashboard → Your Project → Variables tab

**Variables to set:**
```
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=<generate-random-32-char-string>
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=<your-openai-api-key>
LLM_MODEL=gpt-4-turbo-preview
```

**How to set:**
1. Go to: https://railway.app
2. Open your **Affynix Backend** project
3. Click **Variables** tab
4. Click **+ New Variable** for each one
5. Enter name and value
6. Save

**Generate JWT_SECRET:**
```bash
openssl rand -hex 32
```

---

### Frontend (Vercel) - Required Variables

**Where**: Vercel Dashboard → Your Project → Settings → Environment Variables

**Variables to set:**
```
VITE_API_URL=https://api.affynix.ai
```

**How to set:**
1. Go to: https://vercel.com/dashboard
2. Open your **frontend** project (affynix.ai)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Name: `VITE_API_URL`
6. Value: `https://api.affynix.ai`
7. Environment: Production (and Preview if you want)
8. Save
9. **Redeploy** for changes to take effect

---

### Admin (Vercel) - Required Variables

**Where**: Vercel Dashboard → Your Admin Project → Settings → Environment Variables

**Variables to set:**
```
VITE_API_URL=https://api.affynix.ai
```

**How to set:**
1. Go to: https://vercel.com/dashboard
2. Open your **admin** project (admin.affynix.ai)
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Name: `VITE_API_URL`
6. Value: `https://api.affynix.ai`
7. Environment: Production (and Preview if you want)
8. Save
9. **Redeploy** for changes to take effect

---

## Quick Checklist

- [ ] Railway backend: `OPENAI_API_KEY` set
- [ ] Railway backend: `JWT_SECRET` set
- [ ] Railway backend: Other variables set
- [ ] Vercel frontend: `VITE_API_URL=https://api.affynix.ai`
- [ ] Vercel admin: `VITE_API_URL=https://api.affynix.ai`
- [ ] Frontend redeployed (if you added variables)
- [ ] Admin redeployed (if you added variables)

---

**After setting variables, test:**
- Frontend: https://affynix.ai (should connect to API)
- Admin: https://admin.affynix.ai (should connect to API)
- Backend: https://api.affynix.ai/health (should return {"status":"ok"})

