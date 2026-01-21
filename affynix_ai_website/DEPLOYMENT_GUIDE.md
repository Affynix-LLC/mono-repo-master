# Affynix Admin & Backend Deployment Guide

Complete guide for deploying the Affynix admin dashboard and backend API.

---

## 🚀 Quick Deploy

### Prerequisites
- Vercel account (for admin)
- Railway account (for backend) OR Vercel Pro
- Node.js 18.x or higher
- Git repository connected

---

## 📋 Part 1: Backend API Deployment

### Option A: Deploy to Railway (Recommended)

Railway is the recommended platform for the backend as it provides:
- Built-in persistent storage for SQLite
- Easy environment variable management
- Automatic SSL certificates
- WebSocket support

**Steps:**

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Navigate to backend directory**
   ```bash
   cd affynix_ai_website/website_build/backend
   ```

4. **Initialize Railway project**
   ```bash
   railway init
   ```

5. **Set environment variables**
   ```bash
   # Required variables
   railway variables set NODE_ENV=production
   railway variables set PORT=3001
   railway variables set DATABASE_PATH=/app/data/affynix.db
   railway variables set JWT_SECRET=$(openssl rand -hex 32)
   railway variables set JWT_EXPIRES_IN=7d
   railway variables set OPENAI_API_KEY=your_openai_key_here
   railway variables set LLM_MODEL=gpt-4-turbo-preview

   # Optional variables
   railway variables set ZAPIER_AGENT_WEBHOOK_URL=your_zapier_url
   railway variables set VITE_CONTACT_WEBHOOK_URL=your_webhook_url
   ```

6. **Deploy**
   ```bash
   railway up
   ```

7. **Get your deployment URL**
   ```bash
   railway status
   ```

   Example output: `https://affynix-backend-production-xxxx.up.railway.app`

8. **Add custom domain (optional)**
   ```bash
   railway domain
   # Recommended: api.affynix.ai
   ```

9. **Verify deployment**
   ```bash
   curl https://your-backend-url.railway.app/health
   ```

   Expected response:
   ```json
   {
     "status": "healthy",
     "timestamp": "2026-01-21T10:00:00.000Z"
   }
   ```

---

### Option B: Deploy to Vercel (Serverless)

**Note**: Vercel requires Vercel Pro for WebSocket support. SQLite will use in-memory storage (data resets on each deploy).

1. **Create vercel.json**
   ```bash
   cd affynix_ai_website/website_build/backend
   ```

   Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server.js"
       }
     ],
     "env": {
       "NODE_ENV": "production",
       "PORT": "3001",
       "DATABASE_PATH": "/tmp/affynix.db"
     }
   }
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

3. **Set environment variables in Vercel dashboard**
   - Go to Vercel project settings
   - Add all variables from `.env.example`

---

## 📱 Part 2: Admin Dashboard Deployment

### Deploy to Vercel

1. **Navigate to admin directory**
   ```bash
   cd affynix_ai_website/admin
   ```

2. **Create production environment file (optional)**
   ```bash
   cp .env.example .env.production
   ```

   Edit `.env.production`:
   ```env
   VITE_API_URL=https://your-backend-url.railway.app
   ```

3. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

4. **Configure environment variables in Vercel**
   - Go to Vercel dashboard → Your Project → Settings → Environment Variables
   - Add:
     ```
     VITE_API_URL = https://your-backend-url.railway.app
     ```

5. **Add custom domain**
   - Go to Vercel dashboard → Your Project → Settings → Domains
   - Add domain: `admin.affynix.ai`
   - Configure DNS:
     ```
     Type: CNAME
     Name: admin
     Value: cname.vercel-dns.com
     ```

6. **Verify deployment**
   ```bash
   curl https://admin.affynix.ai
   ```

   Should return HTML content of the admin dashboard.

---

## 🔒 Security Configuration

### Backend Security

1. **Generate secure JWT secret**
   ```bash
   openssl rand -hex 32
   ```

2. **Set strong password policies**
   Edit `auth.js` if needed to adjust password requirements.

3. **Enable CORS only for your domains**
   In `server.js`, verify CORS configuration:
   ```javascript
   const allowedOrigins = [
     'https://admin.affynix.ai',
     'https://affynix.ai',
     'https://www.affynix.ai'
   ];
   ```

4. **Set secure cookie options**
   Verify in `auth.js`:
   ```javascript
   httpOnly: true,
   secure: true,
   sameSite: 'strict'
   ```

### Admin Security

1. **Use Vercel Password Protection (Optional)**
   - Go to Vercel dashboard → Project → Settings → Security
   - Enable "Password Protection"
   - Set a strong password

2. **Implement app-level authentication**
   The admin already has JWT-based authentication with the backend.

---

## 🧪 Testing Deployments

### Test Backend

```bash
# Health check
curl https://your-backend-url/health

# Test authentication (should fail without credentials)
curl https://your-backend-url/api/test

# Test registration (create admin user)
curl -X POST https://your-backend-url/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@affynix.ai",
    "password": "YourSecurePassword123!",
    "name": "Admin User"
  }'

# Test login
curl -X POST https://your-backend-url/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@affynix.ai",
    "password": "YourSecurePassword123!"
  }'
```

### Test Admin

1. Open `https://admin.affynix.ai` in browser
2. You should see the login page
3. Login with credentials created above
4. Verify dashboard loads correctly

---

## 🔄 Environment Variables Reference

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `3001` |
| `DATABASE_PATH` | SQLite database path | `/app/data/affynix.db` |
| `JWT_SECRET` | JWT signing secret | `<generated-32-char-hex>` |
| `JWT_EXPIRES_IN` | JWT expiration | `7d` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `LLM_MODEL` | OpenAI model | `gpt-4-turbo-preview` |

### Backend Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ZAPIER_AGENT_WEBHOOK_URL` | Zapier webhook | `https://hooks.zapier.com/...` |
| `VITE_CONTACT_WEBHOOK_URL` | Contact form webhook | `https://...` |

### Admin Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.affynix.ai` |

---

## 📊 Monitoring & Logs

### Railway Monitoring

```bash
# View logs
railway logs

# Check status
railway status

# Open dashboard
railway open
```

### Vercel Monitoring

1. Go to Vercel dashboard → Your Project
2. View "Deployments" tab for deployment history
3. View "Analytics" tab for performance metrics
4. View "Logs" tab for runtime logs

---

## 🐛 Troubleshooting

### Backend Issues

**Issue: Database not persisting**
- **Cause**: Using in-memory database or no persistent volume
- **Solution**: Use Railway with persistent storage OR configure PostgreSQL

**Issue: CORS errors**
- **Cause**: Admin URL not in allowed origins
- **Solution**: Add admin URL to CORS configuration in `server.js`

**Issue: JWT errors**
- **Cause**: Invalid or missing JWT_SECRET
- **Solution**: Generate new secret with `openssl rand -hex 32`

**Issue: OpenAI API errors**
- **Cause**: Invalid API key or rate limit
- **Solution**: Verify key is valid and has credits

### Admin Issues

**Issue: "Failed to fetch" errors**
- **Cause**: Wrong backend URL or CORS issue
- **Solution**:
  1. Verify `VITE_API_URL` is correct
  2. Check backend CORS allows admin domain
  3. Verify backend is running

**Issue: Build fails**
- **Cause**: Missing dependencies or wrong Node version
- **Solution**:
  1. Verify Node 18.x is being used
  2. Run `npm install` locally to test
  3. Check build logs in Vercel dashboard

**Issue: Blank page after deployment**
- **Cause**: Router configuration issue
- **Solution**: Verify `vercel.json` has correct rewrites

---

## 🔄 Update & Redeploy

### Backend Updates

```bash
cd affynix_ai_website/website_build/backend

# Make your changes
git add .
git commit -m "Update backend"
git push

# Railway auto-deploys from git
# OR manually deploy:
railway up
```

### Admin Updates

```bash
cd affynix_ai_website/admin

# Make your changes
git add .
git commit -m "Update admin"
git push

# Vercel auto-deploys from git
# OR manually deploy:
vercel --prod
```

---

## 🎯 Production Checklist

### Before Going Live

- [ ] Backend deployed to Railway with persistent storage
- [ ] All environment variables configured
- [ ] Strong JWT_SECRET generated
- [ ] OpenAI API key with sufficient credits
- [ ] Admin deployed to Vercel
- [ ] Custom domains configured (api.affynix.ai, admin.affynix.ai)
- [ ] DNS records updated
- [ ] SSL certificates active (automatic with Vercel/Railway)
- [ ] CORS configured correctly
- [ ] First admin user created
- [ ] Health checks passing
- [ ] Logs monitoring enabled
- [ ] Backup strategy in place

### Post-Deploy

- [ ] Test login flow
- [ ] Test API endpoints
- [ ] Monitor logs for errors
- [ ] Set up alerts for downtime
- [ ] Document any custom configuration

---

## 📞 Support

If you encounter issues:

1. Check logs:
   - Railway: `railway logs`
   - Vercel: Dashboard → Logs tab

2. Verify environment variables are set correctly

3. Test backend health endpoint

4. Check CORS configuration

5. Review deployment checklist above

---

## 🔗 Useful Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Backend Repository**: [Your Git URL]
- **Admin Repository**: [Your Git URL]

---

**Deployment Complete** ✅

Your Affynix admin and backend are now deployed and ready for production use!
