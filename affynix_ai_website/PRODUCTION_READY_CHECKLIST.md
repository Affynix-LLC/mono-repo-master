# 🚀 Affynix.ai Production Readiness Checklist

## Current Status

✅ **Frontend**: Builds successfully (tested)  
✅ **Backend**: Code complete, needs deployment  
✅ **Admin**: Code complete, needs deployment  
⚠️ **Deployment**: Not yet deployed  

---

## 📋 Step-by-Step Deployment Plan

### **Phase 1: Backend API Deployment** (CRITICAL - Do First)

The backend must be deployed BEFORE frontend/admin can work.

#### Option A: Railway (Recommended - Easiest)
1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository: `Affynix-LLC/mono-repo-master`
4. Configure:
   - **Root Directory**: `affynix_ai_website/website_build/backend`
   - **Start Command**: `npm start`
   - **Build Command**: (leave empty, no build needed)
5. **Environment Variables** (Railway → Variables):
   ```
   NODE_ENV=production
   PORT=3001
   DATABASE_PATH=/app/data/affynix.db
   JWT_SECRET=<generate-random-string>
   OPENAI_API_KEY=<your-openai-key>
   LLM_MODEL=gpt-4-turbo-preview
   ```
6. **Custom Domain**: Add `api.affynix.ai` in Railway → Settings → Domains
7. Railway will provide DNS instructions

#### Option B: Render (Alternative)
1. Go to https://render.com
2. New → Web Service → Connect GitHub
3. Configure:
   - **Name**: `affynix-api`
   - **Root Directory**: `affynix_ai_website/website_build/backend`
   - **Build Command**: (empty)
   - **Start Command**: `npm start`
   - **Environment**: Node
4. Add environment variables (same as Railway)
5. Add custom domain: `api.affynix.ai`

#### Option C: Docker on VPS (Most Control)
See `DOCKER_DEPLOYMENT.md` for detailed instructions.

**After Backend Deployment:**
- Test: `curl https://api.affynix.ai/health`
- Should return: `{"status":"ok"}`

---

### **Phase 2: Frontend Deployment** (affynix.ai)

#### Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import: `Affynix-LLC/mono-repo-master`
4. **Configure Project:**
   - **Root Directory**: `affynix_ai_website/website_build/frontend`
   - **Framework Preset**: Vite (auto-detected)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. **Environment Variables:**
   - `VITE_API_URL` = `https://api.affynix.ai`
6. Click "Deploy"
7. **Add Custom Domain:**
   - Settings → Domains → Add `affynix.ai`
   - Add `www.affynix.ai` (optional)
   - Follow DNS instructions

#### Via Vercel CLI:
```bash
cd affynix_ai_website/website_build/frontend
vercel
# Follow prompts
# Set root directory to current folder
# Add environment variable: VITE_API_URL=https://api.affynix.ai
vercel --prod
```

---

### **Phase 3: Admin Panel Deployment** (admin.affynix.ai)

#### Via Vercel Dashboard:
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import: `Affynix-LLC/mono-repo-master` (same repo)
4. **Configure Project:**
   - **Root Directory**: `affynix_ai_website/admin`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables:**
   - `VITE_API_URL` = `https://api.affynix.ai`
6. Click "Deploy"
7. **Add Custom Domain:**
   - Settings → Domains → Add `admin.affynix.ai`

#### Via Vercel CLI:
```bash
cd affynix_ai_website/admin
vercel
# Follow prompts
# Add environment variable: VITE_API_URL=https://api.affynix.ai
vercel --prod
```

---

### **Phase 4: DNS Configuration**

Configure DNS records for all domains:

#### For `affynix.ai` and `www.affynix.ai`:
- **Type**: CNAME or A record
- **Value**: Vercel-provided DNS (from Vercel dashboard)
- **TTL**: 3600

#### For `admin.affynix.ai`:
- **Type**: CNAME or A record
- **Value**: Vercel-provided DNS (from admin project)
- **TTL**: 3600

#### For `api.affynix.ai`:
- **Type**: CNAME
- **Value**: Railway/Render-provided hostname
- **TTL**: 3600

**DNS Propagation**: Can take 24-48 hours, but usually works within minutes.

---

### **Phase 5: Testing & Verification**

#### ✅ Health Checks:
```bash
# Backend API
curl https://api.affynix.ai/health
# Expected: {"status":"ok"}

# Frontend
curl -I https://affynix.ai
# Expected: 200 OK

# Admin
curl -I https://admin.affynix.ai
# Expected: 200 OK
```

#### ✅ Functional Tests:
1. **Frontend → API Connection:**
   - Visit https://affynix.ai
   - Open browser console (F12)
   - Check for API connection errors
   - Try the chat interface

2. **Admin → API Connection:**
   - Visit https://admin.affynix.ai
   - Login (create account if needed)
   - Verify dashboard loads
   - Test AI Editor

3. **WebSocket Test:**
   - Open chat on frontend
   - Send a message
   - Verify real-time response

4. **LLM Integration:**
   - Test chat functionality
   - Verify OpenAI responses are working
   - Check backend logs for errors

---

## 🔧 Required Environment Variables

### Backend (Railway/Render/VPS):
```bash
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=<generate-random-32-char-string>
OPENAI_API_KEY=sk-proj-...
LLM_MODEL=gpt-4-turbo-preview
ZAPIER_AGENT_WEBHOOK_URL=<optional>
VITE_CONTACT_WEBHOOK_URL=<optional>
```

### Frontend (Vercel):
```bash
VITE_API_URL=https://api.affynix.ai
```

### Admin (Vercel):
```bash
VITE_API_URL=https://api.affynix.ai
```

---

## 🐛 Troubleshooting

### Frontend can't connect to API
- ✅ Verify `VITE_API_URL` is set correctly in Vercel
- ✅ Check backend is running: `curl https://api.affynix.ai/health`
- ✅ Verify CORS allows `https://affynix.ai` origin
- ✅ Check browser console for errors

### Backend returns 500 errors
- ✅ Check `OPENAI_API_KEY` is set correctly
- ✅ Verify database path is writable
- ✅ Check backend logs in Railway/Render dashboard
- ✅ Test locally first: `npm start`

### SSL/HTTPS issues
- ✅ Vercel provides SSL automatically
- ✅ Railway/Render provide SSL automatically
- ✅ Wait for DNS propagation (up to 48 hours)
- ✅ Verify DNS records are correct

### Build failures
- ✅ Check Node.js version (should be 20+)
- ✅ Verify all dependencies in `package.json`
- ✅ Check build logs in Vercel dashboard
- ✅ Test build locally: `npm run build`

---

## 📊 Post-Deployment Checklist

- [ ] All 3 domains are live and accessible
- [ ] SSL certificates are active (HTTPS works)
- [ ] Frontend connects to backend API
- [ ] Admin panel connects to backend API
- [ ] Chat functionality works end-to-end
- [ ] WebSocket connections work
- [ ] OpenAI integration is functional
- [ ] No console errors in browser
- [ ] Mobile responsive design works
- [ ] Analytics/tracking is configured (if needed)

---

## 🚨 Critical Notes

1. **Backend MUST be deployed first** - Frontend/admin depend on it
2. **Environment variables** must be set correctly in all platforms
3. **DNS propagation** can take time - be patient
4. **CORS configuration** is already set in backend for production domains
5. **Database** will be created automatically on first backend start

---

## 📞 Quick Commands Reference

```bash
# Test backend locally
cd affynix_ai_website/website_build/backend
npm install
npm start

# Test frontend locally
cd affynix_ai_website/website_build/frontend
npm install
npm run dev

# Deploy frontend to Vercel
cd affynix_ai_website/website_build/frontend
vercel --prod

# Deploy admin to Vercel
cd affynix_ai_website/admin
vercel --prod

# Check backend health
curl https://api.affynix.ai/health
```

---

## ✅ Success Criteria

Your site is production-ready when:
1. ✅ https://affynix.ai loads without errors
2. ✅ https://admin.affynix.ai loads without errors
3. ✅ https://api.affynix.ai/health returns `{"status":"ok"}`
4. ✅ Chat interface works and connects to OpenAI
5. ✅ No console errors in browser
6. ✅ All HTTPS/SSL working

---

**Estimated Time**: 1-2 hours for deployment + DNS propagation (24-48 hours)

**Next Steps**: After deployment, monitor logs and test all features thoroughly.

