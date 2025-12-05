# Docker Setup for AI Gateway

## Quick Start

### 1. Create Environment File

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your values:
```env
OPENAI_API_KEY=sk-proj-...
AI_GATEWAY_API_KEY=vck_...
API_KEY=d927b1637e7a6c983e0ed28f875df803db1655e15357ef179451e783b62d19b7
AFFYNIX_API_KEY=your-key
WEBHOOK_SECRET=your-secret
NEXT_PUBLIC_DOMAIN=ai.affynix.ai
OPENAI_MODEL=gpt-4-turbo
```

### 2. Build and Run

```bash
# Build the image
pnpm docker:build

# Or use docker-compose
docker-compose up -d
```

### 3. Access the API

```bash
# Health check
curl http://localhost:3000/health

# Test endpoint (with API key)
curl -H "x-api-key: d927b1637e7a6c983e0ed28f875df803db1655e15357ef179451e783b62d19b7" \
  http://localhost:3000/api/tasks
```

## Docker Compose Services

### Main Service: `ai-gateway`
- Runs the API server on port 3000
- Handles all API requests
- Persists data to volumes

### Optional: `redis` (with profile)
- Distributed task queue
- Enable with: `docker-compose --profile with-redis up -d`

### Optional: `scheduler` (with profile)
- Runs scheduled tasks
- Enable with: `docker-compose --profile with-scheduler up -d`

## Commands

```bash
# Start all services
docker-compose up -d

# Start with Redis and Scheduler
docker-compose --profile with-redis --profile with-scheduler up -d

# View logs
docker-compose logs -f ai-gateway

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose up -d --build

# View running containers
docker-compose ps
```

## Data Persistence

Data is persisted in:
- `./data/` - General data files
- `./.tasks.json` - Scheduled tasks
- `./.webhooks.json` - Webhook configs
- `./.workflows.json` - Workflows
- `./.agents.json` - Agents

These files are mounted as volumes, so data persists across container restarts.

## Production Deployment

### Option 1: Docker on Server

1. **Build on server:**
   ```bash
   docker build -t ai-gateway:latest .
   ```

2. **Run with environment variables:**
   ```bash
   docker run -d \
     --name ai-gateway \
     -p 3000:3000 \
     -e OPENAI_API_KEY=... \
     -e API_KEY=... \
     -v $(pwd)/data:/app/data \
     ai-gateway:latest
   ```

### Option 2: Docker Compose on Server

1. **Copy files to server:**
   ```bash
   scp -r . user@server:/opt/ai-gateway/
   ```

2. **On server:**
   ```bash
   cd /opt/ai-gateway
   docker-compose up -d
   ```

### Option 3: Use with Reverse Proxy (Nginx)

```nginx
server {
    listen 80;
    server_name ai.affynix.ai;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## Environment Variables

Required:
- `OPENAI_API_KEY` - OpenAI API key
- `API_KEY` - Your API key for authentication

Optional:
- `AI_GATEWAY_API_KEY` - Vercel AI Gateway key
- `AFFYNIX_API_KEY` - Affynix platform integration
- `WEBHOOK_SECRET` - Webhook signature secret
- `REDIS_URL` - Redis connection (if using Redis)
- `PORT` - Server port (default: 3000)

## Health Check

The container includes a health check:
```bash
# Check health
curl http://localhost:3000/health

# Docker health status
docker ps  # Check STATUS column
```

## Troubleshooting

### Container won't start
```bash
# Check logs
docker-compose logs ai-gateway

# Check if port is in use
lsof -i :3000
```

### Data not persisting
```bash
# Check volume mounts
docker-compose config

# Verify files exist
ls -la .tasks.json .webhooks.json
```

### API key not working
```bash
# Check environment variables
docker-compose exec ai-gateway env | grep API_KEY

# Test without API key (should get 401)
curl http://localhost:3000/api/tasks
```

## Migration from Vercel

If migrating from Vercel to Docker:

1. **Export environment variables from Vercel:**
   ```bash
   vercel env pull .env.production
   ```

2. **Update .env file with values**

3. **Deploy Docker container**

4. **Update DNS** to point to your server instead of Vercel

## Next Steps

- Set up reverse proxy (Nginx/Caddy)
- Configure SSL/TLS certificates
- Set up monitoring (Prometheus/Grafana)
- Configure backups for data volumes
- Set up CI/CD for Docker builds

