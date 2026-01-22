# 🚀 Deploy Now - Step-by-Step Guide

**Ready-to-deploy configuration for Affynix Admin & Backend**

---

## ✅ Pre-Deployment Checklist

All configuration files are ready:
- [x] Backend `.env.production.template` with generated JWT secret
- [x] Admin `.env.production` template
- [x] Railway configuration (`railway.toml`)
- [x] Vercel configuration (`vercel.json`)
- [x] Deployment scripts
- [x] Verification scripts

---

## 🎯 Deploy in 4 Steps

### Step 1: Deploy Backend to Railway

```bash
cd website_build/backend

# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Initialize project
railway init

# 4. Set environment variables
# Copy from .env.production.template and update with your OPENAI_API_KEY
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set DATABASE_PATH=/app/data/affynix.db
railway variables set JWT_SECRET=4d8a0a607ab63d151d1eff6254d4495f9ab78d9829f810962a85c8093ba1e20d
railway variables set JWT_EXPIRES_IN=7d
railway variables set OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
railway variables set LLM_MODEL=gpt-4-turbo-preview

# 5. Deploy
railway up

# 6. Get your URL
railway status
# Example output: https://affynix-backend-production-xxxx.up.railway.app
```

**Save your backend URL - you'll need it for Step 2!**

---

### Step 2: Configure Admin with Backend URL

```bash
cd ../../admin

# Run the configuration script
./configure-backend-url.sh
# When prompted, enter your backend URL from Step 1

# Example:
# Enter your backend URL: https://affynix-backend-production-xxxx.up.railway.app
```

---

### Step 3: Deploy Admin to Vercel

```bash
# Still in admin/ directory

# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy to production
vercel --prod

# 4. Your admin URL will be shown in the output
# Example: https://affynix-admin-xyz123.vercel.app
```

---

### Step 4: Verify Deployments

```bash
cd ..

# Run verification script
./verify-deployment.sh

# Choose option 5: Full verification
# Enter your backend URL when prompted
# Enter your admin URL when prompted
# Create your first admin user when prompted
```

---

## 🎉 You're Done!

Your deployments should now be live:

- **Backend API**: `https://your-backend-url.railway.app`
- **Admin Dashboard**: `https://your-admin-url.vercel.app`

### Next Steps:

1. **Login to Admin Dashboard**
   - Go to your admin URL
   - Use the credentials you created in Step 4

2. **Add Custom Domains** (Optional)
   - Backend: `api.affynix.ai`
   - Admin: `admin.affynix.ai`

3. **Configure CORS**
   - If admin can't connect to backend, add your admin URL to CORS config in `backend/server.js`

---

## 📋 Quick Reference

### Backend URLs to Test:
- Health: `https://your-backend-url/health`
- API: `https://your-backend-url/api/test` (should return 401)

### Admin URLs to Test:
- Login: `https://your-admin-url/login`
- Dashboard: `https://your-admin-url/dashboard`

### Environment Variables:

**Backend (Railway):**
```env
NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db
JWT_SECRET=4d8a0a607ab63d151d1eff6254d4495f9ab78d9829f810962a85c8093ba1e20d
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
LLM_MODEL=gpt-4-turbo-preview
```

**Admin (Vercel):**
```env
VITE_API_URL=https://your-backend-url.railway.app
```

---

## 🔧 Troubleshooting

### Backend not responding:
- Check Railway logs: `railway logs`
- Verify environment variables are set
- Check health endpoint: `curl https://your-backend-url/health`

### Admin can't connect to backend:
- Verify `VITE_API_URL` is correct in `.env.production`
- Check backend CORS configuration
- Verify backend is running and accessible

### CORS errors:
- Edit `backend/server.js`
- Add your admin URL to `allowedOrigins` array
- Redeploy backend: `railway up`

---

## 📞 Need Help?

- **Backend Logs**: `railway logs`
- **Vercel Logs**: Dashboard → Project → Logs
- **Documentation**: See `DEPLOYMENT_GUIDE.md` for detailed instructions
- **Quick Reference**: See `DEPLOYMENT_QUICK_REF.md`

---

## 🔐 Security Notes

- The JWT secret has been pre-generated for you
- Change it if you need to: `openssl rand -hex 32`
- Never commit `.env` files with real API keys
- Use strong passwords for admin users
- Enable Vercel password protection if needed

---

**Ready to Deploy?** Start with Step 1! 🚀
