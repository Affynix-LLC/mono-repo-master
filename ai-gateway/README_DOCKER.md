# AI Gateway - Docker Deployment

## Quick Start

```bash
# 1. Create .env file
cp .env.docker.example .env
# Edit .env with your API keys

# 2. Build and run
docker-compose up -d

# 3. Test
curl http://localhost:3000/health
```

## What's Included

✅ **Dockerfile** - Production-ready container
✅ **docker-compose.yml** - Multi-service orchestration
✅ **server.ts** - HTTP server for Docker
✅ **Data persistence** - Volumes for tasks, workflows, agents
✅ **Health checks** - Built-in health monitoring
✅ **Optional Redis** - For distributed task queue
✅ **Optional Scheduler** - Separate container for cron jobs

## Services

- **ai-gateway** - Main API server (port 3000)
- **redis** - Task queue (optional, use `--profile with-redis`)
- **scheduler** - Cron worker (optional, use `--profile with-scheduler`)

## Environment Variables

See `.env.docker.example` for all required variables.

## Production Deployment

Deploy to any Docker host:
- Your own server
- AWS ECS
- Google Cloud Run
- Azure Container Instances
- DigitalOcean App Platform
- Railway
- Render

## Benefits of Docker

✅ **Portable** - Run anywhere Docker runs
✅ **Isolated** - No conflicts with other services
✅ **Scalable** - Easy to scale horizontally
✅ **Consistent** - Same environment everywhere
✅ **Easy Updates** - Just rebuild and redeploy

