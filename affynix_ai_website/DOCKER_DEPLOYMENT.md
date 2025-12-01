# Affynix.ai Docker Deployment Guide

## Architecture Overview

Three-service architecture, all self-hosted:

1. **Backend API** (`api.affynix.ai`) - Port 3001
   - Express.js server
   - SQLite database
   - OpenAI LLM integration
   - WebSocket for real-time chat
   - JWT authentication

2. **Frontend** (`affynix.ai`) - Port 4173
   - React + Vite
   - Public chat interface
   - Real-time WebSocket streaming

3. **Admin Portal** (`admin.affynix.ai`) - Port 3002
   - React + Vite
   - Admin dashboard
   - Client/agent/payment management
   - AI content editor

## Quick Start

### 1. Set Environment Variables

```bash
cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website/website_build
cp env.example .env
```

Edit `.env` and set:
```bash
OPENAI_API_KEY=sk-your-actual-key-here
JWT_SECRET=your-random-secret-key
```

### 2. Build and Run All Services

```bash
# Using the test script (recommended)
./docker-test.sh

# Or manually
docker-compose build
docker-compose up -d
```

### 3. Access Services

- **Public Chat**: http://localhost:4173
- **Admin Panel**: http://localhost:3002
- **API**: http://localhost:3001
- **WebSocket**: ws://localhost:3001/ws

## Service Details

### Backend (Port 3001)

**Features:**
- SQLite database (persisted in `./backend/data/`)
- OpenAI GPT-4 integration
- WebSocket server for real-time chat
- JWT authentication
- CRUD endpoints for all entities

**Key Endpoints:**
```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
POST /api/conversations
POST /api/conversations/:id/messages
GET  /api/entities/:entityName
POST /api/entities/:entityName
WS   /ws?conversation_id=:id
```

**Environment:**
- `OPENAI_API_KEY` - Required for LLM
- `JWT_SECRET` - Required for auth
- `DATABASE_PATH` - SQLite file location

### Frontend (Port 4173)

**Features:**
- Chat interface with AI agent
- WebSocket streaming
- Real-time message updates

**Environment:**
- `VITE_API_URL` - Backend API URL

### Admin (Port 3002)

**Pages:**
- Dashboard - Overview stats
- Clients - CRUD management
- Agents - AI agent configuration
- Payments - Revenue tracking
- Intakes - Lead management
- AI Editor - Content generation
- Settings - App configuration

**Environment:**
- `VITE_API_URL` - Backend API URL

## Database

SQLite database persisted at `./backend/data/affynix.db`

**Tables:**
- users
- conversations
- messages
- clients
- agents
- payments
- intake_submissions
- app_configurations
- products
- chat_sessions

## Development Workflow

### View Logs
```bash
docker-compose logs -f
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f admin
```

### Restart Services
```bash
docker-compose restart backend
docker-compose restart frontend
docker-compose restart admin
```

### Rebuild After Changes
```bash
docker-compose down
docker-compose build
docker-compose up -d
```

### Database Access
```bash
# Access SQLite database
docker exec -it affynix-backend sh
cd data
sqlite3 affynix.db
```

## Production Deployment

### DNS Configuration

Point these domains to your server:
- `affynix.ai` → Port 4173 (Frontend)
- `api.affynix.ai` → Port 3001 (Backend + WebSocket)
- `admin.affynix.ai` → Port 3002 (Admin)

### Environment Variables (Production)

```bash
NODE_ENV=production
PORT=3001
VITE_API_URL=https://api.affynix.ai
OPENAI_API_KEY=sk-prod-key-here
JWT_SECRET=strong-random-secret
DATABASE_PATH=/app/data/affynix.db
```

### SSL/TLS

Use a reverse proxy (Nginx, Caddy, or Cloudflare) for HTTPS.

Example Nginx config:
```nginx
# affynix.ai → Frontend
server {
  listen 80;
  server_name affynix.ai;
  location / {
    proxy_pass http://localhost:4173;
  }
}

# api.affynix.ai → Backend + WebSocket
server {
  listen 80;
  server_name api.affynix.ai;
  location / {
    proxy_pass http://localhost:3001;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}

# admin.affynix.ai → Admin
server {
  listen 80;
  server_name admin.affynix.ai;
  location / {
    proxy_pass http://localhost:3002;
  }
}
```

## Troubleshooting

### Backend won't start
- Check OPENAI_API_KEY is set
- Check database directory permissions
- View logs: `docker-compose logs backend`

### Frontend/Admin can't connect to backend
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Check backend is healthy: `curl localhost:3001/health`

### WebSocket not connecting
- Ensure backend is running
- Check WebSocket URL in browser console
- Verify port 3001 is accessible

### Database errors
- Check `./backend/data/` directory exists
- Verify write permissions
- Check SQLite is initialized: `docker exec affynix-backend ls -la /app/data`

## Testing Checklist

- [ ] Backend health check responds
- [ ] Frontend loads at localhost:4173
- [ ] Admin loads at localhost:3002
- [ ] Can create conversation in frontend
- [ ] LLM responds to messages (requires OPENAI_API_KEY)
- [ ] WebSocket streaming works
- [ ] Admin can view entities (clients, agents, etc.)
- [ ] Admin CRUD operations work
- [ ] Database persists after `docker-compose down && docker-compose up`

## Stack Summary

| Service | Port | URL (Production) | Technology |
|---------|------|------------------|------------|
| Backend | 3001 | api.affynix.ai | Express + SQLite + OpenAI + WebSocket |
| Frontend | 4173 | affynix.ai | React + Vite |
| Admin | 3002 | admin.affynix.ai | React + Vite |
