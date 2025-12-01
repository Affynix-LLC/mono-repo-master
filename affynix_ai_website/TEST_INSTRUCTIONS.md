# Affynix.ai Test Instructions

## ✅ What's Been Completed

1. **Backend API** - Complete with LLM, WebSocket, Database, Auth
2. **Frontend Chat** - WebSocket-enabled chat UI
3. **Admin Portal** - 7 admin pages migrated, Base44 removed
4. **Docker Configuration** - All three services configured

## 🧪 Testing the Stack

### Step 1: Set Your OpenAI API Key

Edit `.env` in `/affynix_ai_website/website_build/`:

```bash
OPENAI_API_KEY=sk-your-actual-openai-key-here
```

### Step 2: Build and Start Services

```bash
cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website/website_build

# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# Watch logs
docker-compose logs -f
```

### Step 3: Test Each Service

**Backend API (Port 3001)**
```bash
curl http://localhost:3001/health
```

**Frontend Chat (Port 4173)**
- Open: http://localhost:4173
- Click "Start" button
- Send a message
- Verify LLM responds (requires OPENAI_API_KEY)

**Admin Portal (Port 3002)**
- Open: http://localhost:3002
- Should see admin dashboard
- Test CRUD operations

### Step 4: Verify Database Persistence

```bash
# Stop containers
docker-compose down

# Start again
docker-compose up -d

# Check if data persists
docker exec -it affynix-backend ls -la /app/data/
```

## 🚀 Deployment to Production

### Backend (api.affynix.ai)
- Deploy Docker container to VPS/Railway
- Set production environment variables
- Point DNS: `api.affynix.ai` → Server IP:3001

### Frontend (affynix.ai)
- Deploy to Vercel from `/frontend/` directory
- Set env: `VITE_API_URL=https://api.affynix.ai`

### Admin (admin.affynix.ai)
- Deploy to Vercel from `/admin/` directory  
- Set env: `VITE_API_URL=https://api.affynix.ai`
- Project: https://vercel.com/0xroboros/affynix-ai-admin

## 📦 Service Ports

- **3001** - Backend API + WebSocket
- **4173** - Frontend Chat UI
- **3002** - Admin Portal

## 🔧 Troubleshooting

**If backend won't start:**
```bash
cd backend
npm install
node server.js
```

**If frontend/admin won't build:**
```bash
cd frontend  # or cd ../admin
npm install
npm run build
```

**Check Docker logs:**
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs admin
```

## ✨ What's Working

- ✅ SQLite database with all tables
- ✅ JWT authentication system
- ✅ OpenAI GPT-4 integration
- ✅ WebSocket real-time streaming
- ✅ 7 admin pages (no Base44)
- ✅ All API endpoints
- ✅ Docker configuration for all 3 services

Just add your OPENAI_API_KEY and run `docker-compose up`!
