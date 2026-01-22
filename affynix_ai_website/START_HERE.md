# ⚡ START HERE - One Command to Deploy Everything

Your complete Affynix infrastructure in one command.

---

## 🚀 Deploy Everything Now

```bash
cd affynix_ai_website
./DEPLOY.sh
```

**Time required:** 5-10 minutes
**Manual steps:** Minimal (just login prompts)
**What gets deployed:** Backend API + Admin Dashboard + First User

---

## 📦 What This Does

The `DEPLOY.sh` script is a **complete automation** that:

1. ✅ Installs Railway CLI (if needed)
2. ✅ Installs Vercel CLI (if needed)
3. ✅ Logs you in to both services
4. ✅ Deploys backend to Railway
5. ✅ Configures environment variables
6. ✅ Deploys admin to Vercel
7. ✅ Tests health endpoints
8. ✅ Creates your first admin user
9. ✅ Gives you all URLs and credentials

**All configuration is automatic!**

---

## 🎯 What You'll Be Asked

The script will prompt you for:

1. **OpenAI API Key** (optional - press Enter to skip)
   - Can add later in Railway dashboard
   - Get one: https://platform.openai.com/api-keys

2. **Admin User Details**
   - Email (default: admin@affynix.ai)
   - Password (your choice, min 8 chars)
   - Name (default: Admin User)

That's it! Everything else is automatic.

---

## ✅ What You Get

After running the script:

```
🔗 Backend URL:  https://affynix-backend-production-xxxx.up.railway.app
🎨 Admin URL:    https://affynix-admin-xxxx.vercel.app
📧 Admin Email:  admin@affynix.ai (or what you chose)
🔑 Password:     [your secure password]
📄 Info File:    DEPLOYMENT_INFO.txt (saved automatically)
```

---

## 🎉 Login and Start Using

1. **Go to your admin URL** (provided by script)
2. **Login with your credentials**
3. **Start managing your Affynix system!**

---

## 📋 Before You Start

Make sure you have:

- [ ] Node.js 24.x installed (`node --version` should show v24.x)
  - If you have an older version, update: https://nodejs.org
- [ ] Railway account (free tier works) - https://railway.app
- [ ] Vercel account (free tier works) - https://vercel.com
- [ ] OpenAI API key (optional) - https://platform.openai.com

Don't have accounts? No problem! The script will open the login pages for you.

---

## 🔄 Alternative: Manual Deployment

If you prefer step-by-step control, see:

- `DEPLOY_NOW.md` - Manual step-by-step guide
- `DEPLOYMENT_GUIDE.md` - Comprehensive documentation
- `DEPLOYMENT_QUICK_REF.md` - Quick reference card

---

## 🛠️ Troubleshooting

### "Railway CLI not found"
The script will offer to install it. Say yes!

### "Vercel CLI not found"
The script will offer to install it. Say yes!

### Backend health check fails
Wait 30 seconds - backend may still be starting. Check:
```bash
curl https://your-backend-url/health
```

### Admin can't connect to backend
Check CORS in `website_build/backend/server.js`:
```javascript
const allowedOrigins = [
  'https://your-admin-url.vercel.app', // Add this
  // ... other origins
];
```

---

## 📞 Need Help?

- **Script Issues**: Check error messages in terminal
- **Backend Issues**: `railway logs`
- **Admin Issues**: Vercel Dashboard → Project → Logs
- **Full Documentation**: See `DEPLOYMENT_GUIDE.md`

---

## 🎊 Ready?

Just run:

```bash
./DEPLOY.sh
```

Sit back and watch your infrastructure deploy! ☕

---

## 📚 Additional Documentation

Located in `affynix_ai_website/`:

| File | Purpose |
|------|---------|
| `START_HERE.md` | ⭐ This file - quickstart |
| `README_DEPLOY.md` | Simple deployment instructions |
| `DEPLOY.sh` | The one-command deployment script |
| `DEPLOY_NOW.md` | Manual step-by-step guide |
| `DEPLOYMENT_GUIDE.md` | Comprehensive documentation |
| `DEPLOYMENT_QUICK_REF.md` | Quick reference card |
| `verify-deployment.sh` | Test deployments manually |
| `deploy-admin-backend.sh` | Interactive deployment wizard |

---

**Questions?** Everything is documented in `DEPLOYMENT_GUIDE.md`

**Ready to deploy?** Run `./DEPLOY.sh` and you're done! 🚀
