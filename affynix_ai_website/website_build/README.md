# Affynix Website Build

This directory contains the Docker setup for the Affynix website.

## Architecture

- **Frontend**: `affynix.ai` - Public website and chat interface
- **Backend API**: `api.affynix.ai` - API server
- **Admin**: `admin.affynix.ai` - Admin interface

## Services

### Frontend (`affynix-frontend`)
- **Port**: 4173
- **URL**: `affynix.ai` (production)
- **Technology**: Vite + React
- **API Endpoint**: `https://api.affynix.ai`

### Backend API (`affynix-backend`)
- **Port**: 3001
- **URL**: `api.affynix.ai` (production)
- **Technology**: Express.js
- **CORS**: Allows requests from `affynix.ai`, `admin.affynix.ai`, and their www variants

## Development

```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Production Deployment

### DNS Configuration
- Point `affynix.ai` → Frontend server (port 4173)
- Point `api.affynix.ai` → Backend API server (port 3001)
- Point `admin.affynix.ai` → Admin interface (same backend, different routes)

### SSL/TLS
Both domains should have SSL certificates configured (Let's Encrypt recommended).

### Environment Variables

**Frontend:**
- `VITE_API_URL=https://api.affynix.ai` (set in docker-compose.yml)

**Backend:**
- `PORT=3001` (default)
- `NODE_ENV=production`
- `ZAPIER_AGENT_WEBHOOK_URL` - Optional. If set, every Agent01 conversation update is POSTed to this Zapier hook with the latest user input plus the message history transcript.
- `VITE_CONTACT_WEBHOOK_URL` - Optional. If set, the Contact page submits directly to this Zapier hook (e.g., to drive an Airtable Zap).

## API Endpoints

- `GET /health` - Health check
- `GET /api/auth/me` - Get current user
- `GET /api/entities/:entityName` - List entities
- `POST /api/entities/:entityName` - Create entity
- `POST /api/entities/:entityName/filter` - Filter entities
- `PUT /api/entities/:entityName/:id` - Update entity
- `DELETE /api/entities/:entityName/:id` - Delete entity
- `POST /api/functions/:functionName` - Invoke function
- `POST /api/integrations/core/invoke-llm` - LLM integration

## Local Development

For local development, the frontend will automatically detect `localhost` and use `http://localhost:3001` for the API.
