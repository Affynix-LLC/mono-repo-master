# Affynix Monorepo

> Enterprise-grade monorepo for Affynix's AI-powered platform, multi-tenant website, and autonomous web harvesting system.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Project Documentation](#project-documentation)
- [Development Workflows](#development-workflows)
- [Docker Architecture](#docker-architecture)
- [Deployment](#deployment)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

This monorepo contains three primary applications:

### 1. **Affynix AI Website** (`affynix_ai_website/`)
A multi-service AI-powered intake system with:
- **Frontend** (Vite + React) - Client-facing chat interface at `affynix.ai`
- **Backend API** (Express.js) - OpenAI agent orchestration at `api.affynix.ai`
- **Admin Interface** (Next.js) - Internal management at `admin.affynix.ai`

**Use Case**: AI-powered client onboarding, intake, and consultation scheduling.

### 2. **Affynix Platform** (`affynix_com_website/`)
A Next.js 14 multi-tenant platform supporting dynamic subdomains:
- **Main site**: `affynix.com`
- **Dynamic subdomains**: `{client}.affynix.com`

**Use Case**: Multi-tenant SaaS platform with per-client customization.

### 3. **Affynix Harvester** (`affynix-harvester/`)
Autonomous web scraping and content ingestion pipeline:
- **Scraper** (Playwright + Node.js) - Automated data extraction
- **Intake API** (Express.js) - Data classification, DNS provisioning, Vercel binding

**Use Case**: Automated content discovery, classification, and multi-tenant provisioning.

---

## 📁 Repository Structure

```
affynix-mono-repo/
├── affynix_ai_website/
│   └── website_build/
│       ├── frontend/              # Vite + React frontend
│       ├── backend/               # Express.js API server
│       ├── docker-compose.yml     # Production compose
│       ├── docker-compose.dev.yml # Development overrides
│       ├── Dockerfile.frontend    # Multi-stage frontend build
│       ├── Dockerfile.backend     # Backend build
│       ├── deploy.sh              # Deployment script
│       ├── env.example            # Environment template
│       └── README.md              # AI site documentation
│
├── affynix_com_website/
│   └── affynix-platform/
│       ├── app/                   # Next.js 14 App Router
│       ├── middleware.ts          # Subdomain routing logic
│       ├── docker-compose.yml     # Platform compose
│       ├── Dockerfile             # Next.js production build
│       └── README.md              # Platform documentation
│
├── affynix-harvester/
│   ├── scraper/
│   │   ├── scripts/               # Playwright scraping logic
│   │   └── utils/                 # Helper functions
│   ├── affynix-backend/
│   │   ├── api/                   # Express.js intake endpoints
│   │   ├── lib/                   # Cloudflare, Vercel, Airtable clients
│   │   └── server.ts              # API server entry
│   ├── docker-compose.yml         # Harvester orchestration
│   └── README.md                  # Harvester documentation
│
├── affynix_logo_images/           # Brand assets (SVG logos)
├── .gitignore                     # Git exclusions
└── README.md                      # This file
```

---

## ⚙️ Prerequisites

### Required Software

| Tool | Version | Purpose |
|------|---------|---------|
| **Docker** | 24.0+ | Container runtime |
| **Docker Compose** | 2.20+ | Multi-container orchestration |
| **Node.js** | 20.x | JavaScript runtime (for local dev) |
| **Git** | 2.40+ | Version control |
| **curl/wget** | Latest | Health check utilities |

### System Requirements

- **OS**: macOS 12+, Linux (Ubuntu 22.04+), Windows 11 with WSL2
- **RAM**: 8GB minimum (16GB recommended for full stack)
- **Disk**: 20GB free space
- **Network**: Stable internet for API integrations (OpenAI, Vercel, Cloudflare)

### API Keys & Secrets

Each project requires environment variables. See `env.example` files in respective directories:

- **AI Site**: `VITE_API_URL`, OpenAI API keys
- **Platform**: Vercel deployment tokens, database URLs
- **Harvester**: Airtable API key, Cloudflare API token, Vercel API token

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:Affynix-LLC/mono-repo-master.git
cd mono-repo-master
```

### 2. Choose Your Project

#### **AI Website (Recommended for first-time setup)**

```bash
cd affynix_ai_website/website_build

# Copy environment template
cp env.example .env

# Edit .env with your configuration
nano .env

# Start in development mode (hot reload enabled)
./deploy.sh --dev

# Or start in production mode
./deploy.sh
```

**Access**:
- Frontend: http://localhost:4173
- Backend API: http://localhost:3001
- Health check: http://localhost:3001/health

#### **Platform (.com Site)**

```bash
cd affynix_com_website/affynix-platform

# Install dependencies
npm install

# Start development server
npm run dev

# Or build and run in Docker
docker compose up --build
```

**Access**: http://localhost:3000

#### **Harvester**

```bash
cd affynix-harvester

# Configure environment
cp .env.example .env
nano .env

# Start scraper and intake API
docker compose up --build
```

---

## 📚 Project Documentation

Each project has detailed documentation in its respective directory:

- **[AI Website README](./affynix_ai_website/website_build/README.md)** - Architecture, API routes, agent configuration
- **[AI Website Vercel Instructions](./affynix_ai_website/website_build/VERCEL_INSTRUCTIONS.md)** - Deployment guide
- **[Platform README](./affynix_com_website/affynix-platform/README.md)** - Subdomain routing, middleware setup
- **Harvester README** (TBD) - Scraper configuration, intake API endpoints

---

## 💻 Development Workflows

### AI Website Development

#### Hot Reload Development
```bash
cd affynix_ai_website/website_build
./deploy.sh --dev
```

**What happens**:
- Frontend: Vite dev server with HMR on port 4173
- Backend: Nodemon auto-restart on port 3001
- Bind mounts: Code changes reflect immediately without rebuilds

#### Production Build
```bash
./deploy.sh --no-cache
```

**What happens**:
- Multi-stage Docker builds for optimized images
- Frontend: Vite production build + preview server
- Backend: Express.js with production optimizations
- Health checks: Automatic service monitoring

#### Viewing Logs
```bash
# All services
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
```

#### Stopping Services
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Remove volumes (data loss!)
docker compose down -v
```

### Platform Development

```bash
cd affynix_com_website/affynix-platform

# Install dependencies
npm install

# Run Next.js dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Run in Docker
docker compose up --build
```

### Harvester Development

```bash
cd affynix-harvester

# Start services
docker compose up -d

# View scraper logs
docker compose logs -f scraper

# Run scraper manually
docker compose exec scraper node scripts/run.js

# Restart intake API
docker compose restart intake-api
```

---

## 🐳 Docker Architecture

### AI Website Stack

#### Services
- **backend**: Express.js API server
  - Base: `node:20-alpine`
  - Port: `3001`
  - Health check: `http://localhost:3001/health`
  
- **frontend**: Vite/React SPA
  - Base: `node:20-alpine` (multi-stage)
  - Port: `4173`
  - Depends on: `backend` (healthy)

#### Development vs Production

| Feature | Development (`--dev`) | Production (default) |
|---------|----------------------|---------------------|
| **Build** | Standard Node.js image | Multi-stage optimized |
| **Volumes** | Bind mounts + anon `node_modules` | No volumes (immutable) |
| **Command** | `npm run dev` (Vite/nodemon) | `npm start` / `npm run preview` |
| **Hot Reload** | ✅ Enabled | ❌ Disabled |
| **Env** | `NODE_ENV=development` | `NODE_ENV=production` |

#### Environment Variables

```bash
# Frontend
VITE_API_URL=http://localhost:3001  # Local dev
VITE_API_URL=https://api.affynix.ai # Production
FRONTEND_PORT=4173

# Backend
PORT=3001
NODE_ENV=development # or production
```

### Platform Stack

- **Next.js App**: Single service, port `3000`
- **Subdomain Routing**: Handled by `middleware.ts`
- **Database**: External (not containerized)

### Harvester Stack

- **scraper**: Playwright-based crawler
- **intake-api**: Express.js data processor
- **Integrations**: Airtable, Cloudflare DNS, Vercel API

---

## 🚢 Deployment

### AI Website → Vercel

See [VERCEL_INSTRUCTIONS.md](./affynix_ai_website/website_build/VERCEL_INSTRUCTIONS.md) for detailed steps.

**Quick summary**:
```bash
# Deploy frontend
cd affynix_ai_website/website_build/frontend
vercel --prod

# Configure domains
# - affynix.ai → frontend
# - api.affynix.ai → backend (VPS/Railway)
# - admin.affynix.ai → admin (Vercel)
```

### Platform → Vercel

```bash
cd affynix_com_website/affynix-platform
vercel --prod

# Add wildcard domain: *.affynix.com
```

### Backend Services → VPS/Railway

```bash
# SSH into VPS
ssh user@your-vps.com

# Clone repo
git clone git@github.com:Affynix-LLC/mono-repo-master.git
cd mono-repo-master/affynix_ai_website/website_build

# Configure environment
cp env.example .env
nano .env

# Deploy with systemd/PM2
./deploy.sh

# Or use Railway/Render/Fly.io
```

---

## ✅ Best Practices

### Do's ✅

#### General
- ✅ **Always use environment files**: Never hardcode secrets
- ✅ **Run health checks**: Verify services before deployment
- ✅ **Use bind mounts in dev**: Enable hot reload with `--dev` flag
- ✅ **Follow Docker Compose profiles**: Separate dev/prod configs
- ✅ **Version lock dependencies**: Use `package-lock.json` / `yarn.lock`
- ✅ **Test locally first**: Run `docker compose up` before pushing
- ✅ **Use `.gitignore`**: Exclude `node_modules/`, `.env`, `dist/`

#### Docker
- ✅ **Multi-stage builds**: Minimize production image sizes
- ✅ **Alpine images**: Use `-alpine` variants for smaller footprints
- ✅ **Health checks**: Define `healthcheck` in compose files
- ✅ **Restart policies**: Use `restart: unless-stopped` for stability
- ✅ **Named volumes**: Persist data with explicit volume names

#### Code
- ✅ **Lint before commit**: Run `npm run lint` 
- ✅ **Meaningful commits**: Use conventional commit messages
- ✅ **Branch protection**: Never force push to `main`
- ✅ **Code reviews**: Require PR approvals for merges

### Don'ts ❌

#### Security
- ❌ **Never commit `.env` files**: Use `.env.example` as templates
- ❌ **Don't hardcode API keys**: Always use environment variables
- ❌ **Don't expose debug ports**: Keep Docker ports internal in production
- ❌ **Don't run as root**: Use non-root users in containers

#### Docker
- ❌ **Don't use `latest` tags**: Pin specific versions (e.g., `node:20.11-alpine`)
- ❌ **Don't skip `.dockerignore`**: Exclude unnecessary files from builds
- ❌ **Don't mix dev/prod**: Use separate compose files with overrides
- ❌ **Don't neglect cleanup**: Run `docker system prune` periodically

#### Development
- ❌ **Don't install globally**: Use project-local dependencies
- ❌ **Don't skip health checks**: Always verify services are ready
- ❌ **Don't force push**: Especially to `main` branch
- ❌ **Don't ignore linter errors**: Fix issues before committing

#### Deployment
- ❌ **Don't deploy untested code**: Always test locally first
- ❌ **Don't skip migrations**: Run database migrations before deployment
- ❌ **Don't ignore logs**: Monitor application logs regularly
- ❌ **Don't deploy on Fridays**: Leave time for issues to surface 😉

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**

**Symptom**:
```
Error starting userland proxy: listen tcp 0.0.0.0:3001: bind: address already in use
```

**Solution**:
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=3002
```

#### 2. **Container Health Check Failing**

**Symptom**:
```
backend | health check failed: wget: error: Connection refused
```

**Solution**:
```bash
# Check if service is actually running
docker compose logs backend

# Verify port mapping
docker compose ps

# Test manually
curl http://localhost:3001/health

# Restart service
docker compose restart backend
```

#### 3. **Hot Reload Not Working**

**Symptom**: Code changes don't reflect in browser

**Solution**:
```bash
# Ensure you're using dev mode
./deploy.sh --dev

# Check bind mounts
docker compose -f docker-compose.yml -f docker-compose.dev.yml config | grep volumes

# Restart with clean build
docker compose down
./deploy.sh --dev --no-cache
```

#### 4. **Environment Variables Not Loading**

**Symptom**: `undefined` values in application

**Solution**:
```bash
# Verify .env file exists
ls -la .env

# Check env_file in compose
docker compose config | grep env_file

# Restart containers after .env changes
docker compose down && docker compose up -d
```

#### 5. **Node Modules Out of Sync**

**Symptom**:
```
Error: Cannot find module 'express'
```

**Solution**:
```bash
# For bind mounts (dev mode), use anonymous volumes
# Already configured in docker-compose.dev.yml

# Or rebuild with --no-cache
./deploy.sh --dev --no-cache

# For local dev, remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 6. **Permission Denied (SSH)**

**Symptom**:
```
ERROR: Repository not found.
fatal: Could not read from remote repository.
```

**Solution**:
```bash
# Verify SSH key
ssh -T git@github.com

# Add SSH key to agent
ssh-add ~/.ssh/id_ed25519_affynix

# Check SSH config
cat ~/.ssh/config

# Verify remote URL
git remote -v
```

---

## 🐛 Debug Commands

### Docker Inspection

```bash
# List running containers
docker compose ps

# Inspect container logs
docker compose logs -f <service>

# Execute commands in container
docker compose exec backend sh

# Check container health
docker inspect <container_id> | grep -A 10 Health

# View resource usage
docker stats
```

### Network Debugging

```bash
# Test backend from frontend container
docker compose exec frontend curl http://backend:3001/health

# Test external connectivity
docker compose exec backend curl https://api.openai.com

# Inspect networks
docker network ls
docker network inspect affynix_default
```

### Volume Management

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect <volume_name>

# Remove unused volumes
docker volume prune

# Backup volume
docker run --rm -v <volume_name>:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
```

---

## 🤝 Contributing

### Workflow

1. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes and test locally**:
   ```bash
   # Test in Docker
   ./deploy.sh --dev
   
   # Run linter
   npm run lint
   ```

3. **Commit with conventional format**:
   ```bash
   git commit -m "feat(ai-site): add conversation export feature"
   git commit -m "fix(backend): resolve CORS issue on /api/agents"
   git commit -m "docs(readme): update deployment instructions"
   ```

4. **Push and create PR**:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Request review** and address feedback

6. **Merge to main** after approval

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Scopes**: `ai-site`, `platform`, `harvester`, `docker`, `ci`

---

## 📄 License

MIT License - see LICENSE file for details

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Affynix-LLC/mono-repo-master/issues)
- **Documentation**: Project READMEs in each directory
- **Contact**: contact@affynix.ai

---

## 🗺️ Roadmap

- [ ] CI/CD pipelines (GitHub Actions)
- [ ] Kubernetes manifests for production
- [ ] Automated testing (Jest, Playwright)
- [ ] Monitoring (Prometheus, Grafana)
- [ ] Centralized logging (ELK stack)
- [ ] Infrastructure as Code (Terraform)

---

**Built with ❤️ by the Affynix Team**

