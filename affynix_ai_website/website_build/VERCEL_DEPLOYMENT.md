# Vercel Deployment Guide

## ✅ Git Push Complete
All changes have been pushed to `origin/main`.

## 🚀 Deploy to Vercel

You need to deploy **2 separate Vercel projects**:

### 1. Frontend (affynix.ai)

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: `Affynix-LLC/mono-repo-master`
4. Configure:
   - **Root Directory**: `affynix_ai_website/website_build/frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. **Environment Variables**:
   - `VITE_API_URL` = `https://api.affynix.ai`
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
cd affynix_ai_website/website_build/frontend
vercel
# Follow prompts, set root directory to current folder
# Add environment variable: VITE_API_URL=https://api.affynix.ai
```

**Domain Setup:**
- Add custom domain: `affynix.ai`
- Add: `www.affynix.ai` (optional)

---

### 2. Admin Panel (admin.affynix.ai)

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import same repository: `Affynix-LLC/mono-repo-master`
4. Configure:
   - **Root Directory**: `affynix_ai_website/admin`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL` = `https://api.affynix.ai`
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
cd affynix_ai_website/admin
vercel
# Follow prompts
# Add environment variable: VITE_API_URL=https://api.affynix.ai
```

**Domain Setup:**
- Add custom domain: `admin.affynix.ai`

---

### 3. Backend API (api.affynix.ai)

**⚠️ Important:** Vercel does NOT support long-running Node.js servers.

You need to deploy the backend separately using:
- **Docker on a VPS** (DigitalOcean, AWS EC2, etc.)
- **Railway** (supports Docker)
- **Render** (supports Docker)
- **Fly.io** (supports Docker)

**Backend Deployment Steps:**
1. Set up a VPS/server
2. Install Docker & Docker Compose
3. Clone your repo
4. Copy `.env` file with:
   - `OPENAI_API_KEY=your-key`
   - `JWT_SECRET=your-secret`
   - `DATABASE_PATH=/app/data/affynix.db`
5. Run: `docker-compose up -d`

**See:** `DOCKER_DEPLOYMENT.md` for detailed backend deployment instructions.

---

## 🔑 Required Environment Variables

### Frontend & Admin (Vercel)
- `VITE_API_URL` = `https://api.affynix.ai`

### Backend (VPS/Docker)
- `OPENAI_API_KEY` = `sk-proj-...` (your OpenAI key)
- `JWT_SECRET` = (generate a secure random string)
- `DATABASE_PATH` = `/app/data/affynix.db`
- `NODE_ENV` = `production`
- `PORT` = `3001`

---

## 📋 Deployment Checklist

### Before Deploying:
- [x] Code pushed to GitHub
- [x] `.env` file is NOT in git (protected by .gitignore)
- [ ] Backend API is deployed and accessible at `https://api.affynix.ai`
- [ ] DNS records point to Vercel (for frontend/admin)
- [ ] DNS records point to backend server (for API)

### After Deploying:
- [ ] Test frontend: https://affynix.ai
- [ ] Test admin: https://admin.affynix.ai
- [ ] Test API: https://api.affynix.ai/health
- [ ] Verify CORS allows frontend/admin domains
- [ ] Test LLM chat functionality

---

## 🐛 Troubleshooting

### Frontend can't connect to API
- Check `VITE_API_URL` environment variable in Vercel
- Verify backend is running and accessible
- Check CORS configuration in backend

### Build fails
- Check Node.js version (should be 20+)
- Verify all dependencies in `package.json`
- Check build logs in Vercel dashboard

### API returns 401
- Verify `OPENAI_API_KEY` is set in backend `.env`
- Check backend logs: `docker-compose logs backend`

---

## 📞 Quick Commands

```bash
# Deploy frontend via CLI
cd affynix_ai_website/website_build/frontend
vercel --prod

# Deploy admin via CLI
cd affynix_ai_website/admin
vercel --prod

# Check backend status
curl https://api.affynix.ai/health
```
