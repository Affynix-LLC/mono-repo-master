# 🚀 One-Command Deployment

Deploy your entire Affynix infrastructure with a single command.

---

## ⚡ Quick Start (Just Run This)

```bash
cd affynix_ai_website
./DEPLOY.sh
```

That's it! The script will:
1. ✅ Check prerequisites (install CLIs if needed)
2. ✅ Deploy backend to Railway
3. ✅ Configure admin with backend URL
4. ✅ Deploy admin to Vercel
5. ✅ Create your first admin user
6. ✅ Verify everything works

**Estimated time:** 5-10 minutes

---

## 📋 What You Need

Before running the script, have ready:

1. **Railway Account** (free tier works)
   - Sign up: https://railway.app

2. **Vercel Account** (free tier works)
   - Sign up: https://vercel.com

3. **OpenAI API Key** (optional, can add later)
   - Get one: https://platform.openai.com/api-keys

That's all! The script handles everything else.

---

## 🎯 What Happens

### Step 1: Backend to Railway
- Checks/installs Railway CLI
- Logs you in to Railway
- Configures environment variables (JWT secret already generated!)
- Deploys backend
- Gets backend URL

### Step 2: Admin Configuration
- Automatically configures admin with backend URL
- No manual editing needed!

### Step 3: Admin to Vercel
- Checks/installs Vercel CLI
- Logs you in to Vercel
- Deploys admin dashboard
- Gets admin URL

### Step 4: Verification
- Tests backend health
- Tests admin accessibility
- Creates your first admin user
- Saves deployment info

---

## 📝 During Deployment

The script will ask you for:

1. **OpenAI API Key** (optional - can skip and add later in Railway dashboard)
2. **Admin User Email** (default: admin@affynix.ai)
3. **Admin User Password** (secure password, min 8 characters)
4. **Admin User Name** (default: Admin User)

Everything else is automatic!

---

## ✅ After Deployment

You'll get:

1. **Backend URL**: `https://affynix-backend-production-xxxx.up.railway.app`
2. **Admin URL**: `https://affynix-admin-xxxx.vercel.app`
3. **Admin Credentials**: Email and password you set
4. **Deployment Info**: Saved to `DEPLOYMENT_INFO.txt`

---

## 🔗 Login

After deployment completes:

```
Admin Dashboard: https://your-admin-url.vercel.app/login
Email: admin@affynix.ai (or what you chose)
Password: [your password]
```

---

## 🛠️ Manual Alternative

If you prefer manual deployment, see:
- `DEPLOY_NOW.md` - Step-by-step guide
- `DEPLOYMENT_GUIDE.md` - Comprehensive documentation

---

## 🔧 Troubleshooting

### Script fails at Railway CLI install
```bash
npm install -g @railway/cli
./DEPLOY.sh
```

### Script fails at Vercel CLI install
```bash
npm install -g vercel
./DEPLOY.sh
```

### Backend health check fails
- Wait 30 seconds and check again
- Backend may still be starting up
- Check Railway logs: `railway logs`

### Admin can't connect to backend
- Check CORS configuration in `website_build/backend/server.js`
- Add your admin URL to `allowedOrigins`
- Redeploy: `cd website_build/backend && railway up`

### Need to add OpenAI key later
```bash
cd website_build/backend
railway variables set OPENAI_API_KEY=sk-proj-your-key-here
```

---

## 📞 Get Help

- **Backend Issues**: `railway logs`
- **Admin Issues**: Check Vercel dashboard → Logs
- **Full Guide**: See `DEPLOYMENT_GUIDE.md`

---

## 🎉 That's It!

Literally just run:

```bash
./DEPLOY.sh
```

Everything else is handled automatically! 🚀

---

**Questions?** Check `DEPLOYMENT_GUIDE.md` for detailed documentation.
