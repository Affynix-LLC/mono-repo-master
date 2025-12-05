#!/usr/bin/env zsh

# ═══════════════════════════════════════════════════════════════
# AFFYNIX BACKEND INFRASTRUCTURE BOOTSTRAP (Simplified)
# ═══════════════════════════════════════════════════════════════

set -euo pipefail

# Colors
readonly COLOR_RESET='\033[0m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_CYAN='\033[0;36m'

log_info() {
  echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"
}

log_success() {
  echo -e "${COLOR_GREEN}[✓]${COLOR_RESET} $1"
}

log_section() {
  echo -e "\n${COLOR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
  echo -e "${COLOR_CYAN}$1${COLOR_RESET}"
  echo -e "${COLOR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}\n"
}

# Project root
readonly PROJECT_ROOT="${PWD}/affynix-backend"

log_section "AFFYNIX BACKEND BOOTSTRAP"

# Create project structure
log_info "Creating project structure..."

mkdir -p "${PROJECT_ROOT}"
cd "${PROJECT_ROOT}"

# Services
mkdir -p services/auth/{src/{controllers,middleware,models,routes,utils,validators},config,migrations,tests/{unit,integration}}
mkdir -p services/data/{src/{graphql/{resolvers,schema},rest,models,services,websocket},config,migrations,seed,tests}
mkdir -p services/admin/{app/{dashboard/{analytics,products,subdomains,users,financial,seo},api/{products,analytics,subdomains}},components/{charts,tables,forms,layout},lib,public/images,styles}
mkdir -p services/api-gateway/{src/{routes,middleware,federation,ratelimit,websocket},config,tests}

# Shared infrastructure
mkdir -p shared/{database/{migrations,seeds},redis/config,messaging/{queues,topics},monitoring/{prometheus,grafana},storage/s3}

# Infrastructure as code
mkdir -p infrastructure/{docker/{auth,data,admin,gateway},kubernetes/{base,overlays/{development,staging,production}},terraform/{aws,cloudflare},nginx/conf.d}

# DevOps
mkdir -p devops/{scripts/{db,deploy,monitoring},ci-cd/{github-actions,gitlab}}

log_success "Directory structure created"

# Create package.json
cat > package.json << 'EOF'
{
  "name": "affynix-backend",
  "version": "1.0.0",
  "description": "Affynix Backend Infrastructure - Microservices Mesh",
  "private": true,
  "workspaces": [
    "services/*",
    "shared/*"
  ],
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
EOF

# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.9'

services:
  postgres:
    image: timescale/timescaledb:latest-pg15
    container_name: affynix-postgres
    environment:
      POSTGRES_DB: affynix
      POSTGRES_USER: affynix_user
      POSTGRES_PASSWORD: development
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - affynix-network

  redis:
    image: redis:7-alpine
    container_name: affynix-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - affynix-network

  data-service:
    build:
      context: ./services/data
      dockerfile: Dockerfile
    container_name: affynix-data
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://affynix_user:development@postgres:5432/affynix
      REDIS_URL: redis://redis:6379
    ports:
      - "3002:3002"
    depends_on:
      - postgres
      - redis
    networks:
      - affynix-network

volumes:
  postgres_data:
  redis_data:

networks:
  affynix-network:
    driver: bridge
EOF

# Create .env.example
cat > .env.example << 'EOF'
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/affynix
POSTGRES_PASSWORD=development

# Redis
REDIS_URL=redis://localhost:6379

# Service URLs
DATA_SERVICE_URL=https://data.affynix.com
EOF

# Create turbo.json
cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
EOF

# Create service package.json files
cat > services/data/package.json << 'EOF'
{
  "name": "@affynix/data-service",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "node src/server.js",
    "start": "node src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2"
  }
}
EOF

# Create basic server file
cat > services/data/src/server.js << 'EOF'
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3002;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'data-service' });
});

app.listen(PORT, () => {
  console.log(`Data service running on port ${PORT}`);
});
EOF

# Create Dockerfile for data service
cat > services/data/Dockerfile << 'EOF'
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]
EOF

log_success "Configuration files created"

# Create README
cat > README.md << 'EOF'
# AFFYNIX BACKEND INFRASTRUCTURE

## Quick Start

```bash
# Start infrastructure
docker-compose up -d

# Install dependencies
npm install

# Start data service
cd services/data
npm install
npm run dev
```

## Services

- **Data Service** (Port 3002) - Product management API
- **PostgreSQL** (Port 5432) - Database
- **Redis** (Port 6379) - Cache

## Development

```bash
# Start all services
npm run dev

# Build all services
npm run build
```
EOF

log_success "Documentation created"

log_section "BOOTSTRAP COMPLETE"
log_success "Backend infrastructure initialized!"
log_info "Next steps:"
log_info "1. cd affynix-backend"
log_info "2. docker-compose up -d"
log_info "3. cd services/data && npm install && npm run dev"
