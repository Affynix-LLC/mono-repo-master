# 🚀 Quick Deployment Reference

**Last Updated**: January 21, 2026

---

## Backend (Railway)

```bash
cd affynix_ai_website/website_build/backend
railway login
railway up
railway status  # Get your URL
```

**Environment Variables to Set:**
```bash
railway variables set NODE_ENV=production
railway variables set PORT=3001
railway variables set DATABASE_PATH=/app/data/affynix.db
railway variables set JWT_SECRET=$(openssl rand -hex 32)
railway variables set JWT_EXPIRES_IN=7d
railway variables set OPENAI_API_KEY=sk-proj-your-key
railway variables set LLM_MODEL=gpt-4-turbo-preview
```

**Backend URL**: `https://affynix-backend-production.up.railway.app`
(or your custom domain: `api.affynix.ai`)

---

## Admin (Vercel)

```bash
cd affynix_ai_website/admin

# Update .env.production with your backend URL
echo "VITE_API_URL=https://your-backend-url.railway.app" > .env.production

vercel login
vercel --prod
```

**Admin URL**: Check Vercel dashboard after deployment
(or your custom domain: `admin.affynix.ai`)

---

## Automated Deployment

```bash
cd affynix_ai_website
./deploy-admin-backend.sh
```

Follow the interactive prompts.

---

## Create First Admin User

```bash
curl -X POST https://your-backend-url/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@affynix.ai",
    "password": "YourSecurePassword123!",
    "name": "Admin User"
  }'
```

---

## Test Deployments

**Backend Health Check:**
```bash
curl https://your-backend-url/health
```

**Admin Check:**
```bash
curl -I https://your-admin-url
# Should return 200 OK
```

---

## Common Issues

| Issue | Solution |
|-------|----------|
| Backend CORS errors | Add admin URL to CORS config in `server.js` |
| Admin "Failed to fetch" | Verify `VITE_API_URL` is correct and backend is running |
| Database not persisting | Use Railway (not Vercel) for backend |
| JWT errors | Generate new secret: `openssl rand -hex 32` |

---

## View Logs

**Railway:**
```bash
railway logs
```

**Vercel:**
Dashboard → Project → Logs

---

## Custom Domains

**Backend (Railway):**
```bash
railway domain
# Add: api.affynix.ai
```

**Admin (Vercel):**
Dashboard → Project → Settings → Domains
- Add: `admin.affynix.ai`
- DNS: `CNAME admin → cname.vercel-dns.com`

---

## File Locations

- Backend: `affynix_ai_website/website_build/backend/`
- Admin: `affynix_ai_website/admin/`
- Full Guide: `affynix_ai_website/DEPLOYMENT_GUIDE.md`

---

**Need Help?** See `DEPLOYMENT_GUIDE.md` for detailed instructions.
