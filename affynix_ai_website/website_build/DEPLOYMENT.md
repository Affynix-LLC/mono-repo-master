# Affynix Deployment Guide

## Railway Deployment (Production)

### Live URL
**Production Backend:** https://affynix-backend-production.up.railway.app

### Project Details
- **Project ID:** `2ed7d840-58c5-4ac6-aed3-7985afb09bc6`
- **Service ID:** `93c04435-fd32-4194-baf7-5e02759cd2ed`
- **Environment:** `production`

### Manual Deployment to Railway

Deploy manually from your local machine:

```bash
cd affynix_ai_website/website_build/backend
railway up --detach
```

### Automated Deployment (GitHub Actions)

The backend automatically deploys to Railway when:
- Code is pushed to the `main` branch
- Changes are made in `affynix_ai_website/website_build/backend/`

#### Required GitHub Secret

Add the following secret to your GitHub repository:

1. Go to: **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Add:
   - **Name:** `RAILWAY_TOKEN`
   - **Value:** Your Railway API token

To get your Railway token:
```bash
cat ~/.railway/config.json | grep token
```

Or get it from Railway dashboard: Settings → Tokens

### Railway Environment Variables

The following environment variables are configured in Railway:

- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_PATH=/app/data/affynix.db`
- `JWT_SECRET` (configured)
- `JWT_EXPIRES_IN=7d`
- `OPENAI_API_KEY` (configured)
- `LLM_MODEL=gpt-4-turbo-preview`
- `HUME_API_KEY` (configured)
- `HUME_SECRET_KEY` (configured)
- `HUME_CONFIG_ID` (configured)
- `ZAPIER_AGENT_WEBHOOK_URL` (configured)
- `VITE_CONTACT_WEBHOOK_URL` (configured)

### Health Check

Verify Railway deployment:
```bash
curl https://affynix-backend-production.up.railway.app/health
```

Expected response: `200 OK`

### Railway Troubleshooting

**View logs:**
```bash
cd affynix_ai_website/website_build/backend
railway logs
```

**Check status:**
```bash
railway status
```

**Re-link project:**
```bash
railway link 2ed7d840-58c5-4ac6-aed3-7985afb09bc6
```

**Rollback deployment:**
1. Go to: https://railway.com/project/2ed7d840-58c5-4ac6-aed3-7985afb09bc6
2. Navigate to Deployments
3. Select a previous deployment and click "Redeploy"

---

## Docker Deployment (Alternative)

### Prerequisites

- Docker and Docker Compose installed
- Domain names configured:
  - `affynix.ai` → Frontend server
  - `api.affynix.ai` → Backend API server
  - `admin.affynix.ai` → Admin interface
- SSL certificates for both domains (Let's Encrypt recommended)
- Server with ports 4173 (frontend) and 3001 (backend) available

## Quick Deployment

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Manual Deployment

### 1. Build Services

```bash
docker-compose build
```

### 2. Start Services

```bash
docker-compose up -d
```

### 3. Verify Deployment

```bash
# Check backend health
curl http://localhost:3001/health

# Check frontend
curl http://localhost:4173

# View logs
docker-compose logs -f
```

## Production Server Setup

### Using Nginx as Reverse Proxy

Create nginx configuration files:

**Frontend (`/etc/nginx/sites-available/affynix.ai`):**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name affynix.ai www.affynix.ai;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name affynix.ai www.affynix.ai;

    ssl_certificate /etc/letsencrypt/live/affynix.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/affynix.ai/privkey.pem;

    location / {
        proxy_pass http://localhost:4173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Backend (`/etc/nginx/sites-available/api.affynix.ai`):**
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.affynix.ai;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name api.affynix.ai;

    ssl_certificate /etc/letsencrypt/live/api.affynix.ai/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.affynix.ai/privkey.pem;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### SSL Certificate Setup (Let's Encrypt)

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d affynix.ai -d www.affynix.ai
sudo certbot --nginx -d api.affynix.ai
sudo certbot --nginx -d admin.affynix.ai

# Auto-renewal (already configured by certbot)
sudo certbot renew --dry-run
```

## Environment Variables

### Frontend
- `VITE_API_URL=https://api.affynix.ai` (already set in docker-compose.yml)

### Backend
- `PORT=3001` (default)
- `NODE_ENV=production` (already set in docker-compose.yml)

## Monitoring

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks
```bash
# Backend API health
curl https://api.affynix.ai/health

# Frontend (should return HTML)
curl https://affynix.ai

# Admin interface
curl https://admin.affynix.ai
```

### Restart Services
```bash
docker-compose restart
# or specific service
docker-compose restart backend
docker-compose restart frontend
```

## Updates

To update the deployment:

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or use deploy script
./deploy.sh
```

## Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check if ports are in use
sudo lsof -i :4173
sudo lsof -i :3001
```

### CORS errors
- Verify backend CORS configuration allows `affynix.ai` and `admin.affynix.ai`
- Check backend logs for origin information

### Frontend can't reach backend
- Verify `VITE_API_URL` is set correctly
- Check network connectivity between services
- Verify backend is accessible at `api.affynix.ai`

## Backup

The backend uses in-memory storage. For production, you should:
1. Add a database (PostgreSQL, MongoDB, etc.)
2. Set up regular backups
3. Configure persistent volumes for data

## Security Checklist

- [ ] SSL certificates installed and auto-renewing
- [ ] Firewall configured (only ports 80, 443 open)
- [ ] Docker containers running as non-root user
- [ ] Environment variables secured
- [ ] Regular security updates applied
- [ ] Database backups configured (when database is added)
- [ ] Rate limiting configured on backend
- [ ] CORS properly configured

