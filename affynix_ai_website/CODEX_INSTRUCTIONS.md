# 🤖 CODEX DEPLOYMENT INSTRUCTIONS

**Automated deployment guide for executing on your local machine**

---

## ⚡ QUICK EXECUTION

Copy and paste these commands in your terminal:

```bash
# Step 1: Navigate and pull latest code
cd /Users/13omb3r/Dev/affynix-mono-repo
git fetch origin
git checkout claude/build-affynix-automation-plvPW
git pull

# Step 2: Navigate to deployment directory
cd affynix_ai_website

# Step 3: Verify files are present
ls -la DEPLOY.sh

# Step 4: Make executable (if needed)
chmod +x DEPLOY.sh

# Step 5: Run deployment
./DEPLOY.sh
```

---

## 📋 WHAT THE SCRIPT WILL DO

The `DEPLOY.sh` script will:

1. **Check Prerequisites** ✅
   - Verify Node.js version
   - Install Railway CLI (if needed)
   - Install Vercel CLI (if needed)

2. **Backend Deployment** 🔧
   - Prompt for Railway login (opens browser)
   - Deploy to Railway
   - Set environment variables automatically
   - Test health endpoint
   - Give you backend URL

3. **Admin Deployment** 🎨
   - Prompt for Vercel login (opens browser)
   - Configure with backend URL automatically
   - Deploy to Vercel
   - Test accessibility
   - Give you admin URL

4. **User Creation** 👤
   - Ask for admin email
   - Ask for password
   - Create first user
   - Save all info to file

---

## 🎯 WHAT YOU'LL BE PROMPTED FOR

### During Backend Deployment:
```
1. Railway Login (browser will open)
   → Just log in to Railway

2. OpenAI API Key
   → Enter your key, OR press Enter to skip and add later
```

### During Admin Deployment:
```
1. Vercel Login (browser will open)
   → Just log in to Vercel
```

### During User Creation:
```
1. Email: admin@affynix.ai (or your choice)
2. Password: [your secure password]
3. Name: Admin User (or your choice)
```

---

## 📝 COPY-PASTE EXECUTION STEPS

### Step 1: Pull Code
```bash
cd /Users/13omb3r/Dev/affynix-mono-repo
git pull origin claude/build-affynix-automation-plvPW
```

**Expected output:**
```
From https://github.com/Affynix-LLC/mono-repo-master
 * branch            claude/build-affynix-automation-plvPW -> FETCH_HEAD
Updating [hash]..[hash]
Fast-forward
 [files changed summary]
```

---

### Step 2: Navigate to Deployment
```bash
cd affynix_ai_website
```

---

### Step 3: Run Deployment
```bash
./DEPLOY.sh
```

**The script will now:**
- ✅ Guide you through everything
- ✅ Open browsers for login when needed
- ✅ Configure everything automatically
- ✅ Deploy both services
- ✅ Create your first user
- ✅ Give you all URLs

---

## 🎬 EXPECTED FLOW

```
╔═══════════════════════════════════════════════════════════╗
║           🚀 AFFYNIX ONE-COMMAND DEPLOYMENT 🚀           ║
╚═══════════════════════════════════════════════════════════╝

STEP 0: Checking Prerequisites
✓ Node.js installed: v24.21.1
✓ npm installed: v10.9.4
⚠ Railway CLI not installed
Install Railway CLI now? (y/n): y
✓ Railway CLI installed
⚠ Vercel CLI not installed
Install Vercel CLI now? (y/n): y
✓ Vercel CLI installed

STEP 1: Backend Deployment to Railway
▶ Checking Railway authentication...
⚠ Not logged in to Railway
▶ Opening Railway login...
[Browser opens - you log in]
✓ Successfully logged in to Railway
▶ Setting up Railway project...
▶ Configuring environment variables...
Enter your OpenAI API key (or press Enter to skip): [your key or skip]
✓ Environment variables configured
▶ Deploying backend to Railway...
[Deployment progress...]
✓ Backend deployed to Railway!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔗 Backend: https://affynix-backend-production-xxxx.up.railway.app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Backend health check passed! ✓

STEP 2: Configuring Admin with Backend URL
✓ Admin configured with backend URL

STEP 3: Admin Deployment to Vercel
▶ Checking Vercel authentication...
⚠ Not logged in to Vercel
▶ Opening Vercel login...
[Browser opens - you log in]
✓ Successfully logged in to Vercel
▶ Deploying admin to Vercel...
[Deployment progress...]
✓ Admin deployed to Vercel!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 Admin: https://affynix-admin-xxxx.vercel.app
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ Admin is accessible! ✓

STEP 4: Verification & Admin User Creation
Email (default: admin@affynix.ai): [enter or use default]
Password (min 8 characters): [enter password]
Confirm password: [confirm password]
Full name (default: Admin User): [enter or use default]
✓ Admin user created successfully! ✓

╔═══════════════════════════════════════════════════════════╗
║                    DEPLOYMENT SUMMARY                      ║
╚═══════════════════════════════════════════════════════════╝

✅ Backend API (Railway)
   URL: https://affynix-backend-production-xxxx.up.railway.app
   Status: Deployed
   Health: /health

✅ Admin Dashboard (Vercel)
   URL: https://affynix-admin-xxxx.vercel.app
   Status: Deployed
   Login: admin@affynix.ai

📋 NEXT STEPS:
1. Login to Admin Dashboard: [URL]/login
2. Add Custom Domains (Optional)
3. Monitor Your Deployments

✅ Deployment information saved to DEPLOYMENT_INFO.txt

🎉 All done! Your Affynix infrastructure is live!

Open admin dashboard in browser? (y/n): y
[Browser opens to login page]
```

---

## 🆘 IF SOMETHING GOES WRONG

### Railway CLI won't install
```bash
npm install -g @railway/cli
# Then run ./DEPLOY.sh again
```

### Vercel CLI won't install
```bash
npm install -g vercel
# Then run ./DEPLOY.sh again
```

### Backend deployment fails
```bash
# Check Railway logs
cd website_build/backend
railway logs
```

### Admin deployment fails
```bash
# Check Vercel dashboard
# Or try manual deployment:
cd admin
vercel --prod
```

### Script stops or errors
```bash
# Just run it again - it will pick up where it left off
./DEPLOY.sh
```

---

## ✅ VERIFICATION CHECKLIST

After deployment completes:

- [ ] Backend URL received
- [ ] Admin URL received
- [ ] Admin user created
- [ ] DEPLOYMENT_INFO.txt file created
- [ ] Can access backend/health endpoint
- [ ] Can access admin login page
- [ ] Can log in with your credentials

---

## 🎯 FINAL STEP

After deployment completes, open your admin URL:

```
https://your-admin-url.vercel.app/login
```

Login with:
- **Email:** admin@affynix.ai (or what you chose)
- **Password:** [what you entered]

**You're done!** 🎉

---

## 📞 SUPPORT

If you encounter any issues:

1. **Check the script output** - it's very descriptive
2. **Look at DEPLOYMENT_INFO.txt** - has all your URLs
3. **Check Railway logs:** `railway logs`
4. **Check Vercel dashboard** for admin logs
5. **See DEPLOYMENT_GUIDE.md** for detailed troubleshooting

---

## 🚀 READY?

Just run:
```bash
./DEPLOY.sh
```

The script does everything else! 🎊
