# Railway CLI Login Steps

The Railway CLI requires separate authentication from the dashboard.

## Quick Steps:

1. **Run login command:**
   ```bash
   railway login
   ```

2. **A browser window will open** (or you'll get a URL)
   - Visit the URL if browser doesn't open automatically
   - Enter the pairing code shown in terminal

3. **After successful login**, verify:
   ```bash
   railway whoami
   ```
   Should show your username/email

4. **Then run deployment:**
   ```bash
   cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website
   ./deploy-backend-auto.sh
   ```

---

## Alternative: Use Dashboard (Easier!)

If CLI login is giving you trouble, use the Railway Dashboard:

1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Follow: `RAILWAY_DASHBOARD_DEPLOY.md`

The dashboard is often faster and doesn't require CLI authentication!

