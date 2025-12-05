#!/usr/bin/env zsh

# ═══════════════════════════════════════════════════════════════
# AFFYNIX BACKEND INFRASTRUCTURE BOOTSTRAP
# Architectural Pattern: Microservices Mesh with Shared Substrate
# Execution Context: ZSH (macOS/Linux)
# ═══════════════════════════════════════════════════════════════

set -euo pipefail  # Strict error handling

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0x0 — CONFIGURATION & CONSTANTS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

readonly PROJECT_ROOT="${PWD}/affynix-backend"
readonly TIMESTAMP=$(date +%Y%m%d_%H%M%S)
readonly BACKUP_DIR="${HOME}/.affynix_backups/${TIMESTAMP}"

# Color codes for output
readonly COLOR_RESET='\033[0m'
readonly COLOR_GREEN='\033[0;32m'
readonly COLOR_BLUE='\033[0;34m'
readonly COLOR_YELLOW='\033[1;33m'
readonly COLOR_RED='\033[0;31m'
readonly COLOR_CYAN='\033[0;36m'

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xI — ARCHITECTURAL TOPOLOGY DEFINITION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

declare -A SERVICE_TOPOLOGY=(
  # ═══════════════════════════════════════════════════════════
  # Authentication Service (login.affynix.com)
  # ═══════════════════════════════════════════════════════════
  ["services/auth"]="
    src/
    src/controllers/
    src/middleware/
    src/models/
    src/routes/
    src/utils/
    src/validators/
    config/
    migrations/
    tests/
    tests/unit/
    tests/integration/
  "
  
  # ═══════════════════════════════════════════════════════════
  # Data Service (data.affynix.com)
  # ═══════════════════════════════════════════════════════════
  ["services/data"]="
    src/
    src/graphql/
    src/graphql/resolvers/
    src/graphql/schema/
    src/rest/
    src/models/
    src/services/
    src/websocket/
    config/
    migrations/
    seed/
    tests/
  "
  
  # ═══════════════════════════════════════════════════════════
  # Admin Service (admin.affynix.com)
  # ═══════════════════════════════════════════════════════════
  ["services/admin"]="
    app/
    app/(dashboard)/
    app/(dashboard)/analytics/
    app/(dashboard)/products/
    app/(dashboard)/subdomains/
    app/(dashboard)/users/
    app/(dashboard)/financial/
    app/(dashboard)/seo/
    app/api/
    app/api/products/
    app/api/analytics/
    app/api/subdomains/
    components/
    components/charts/
    components/tables/
    components/forms/
    components/layout/
    lib/
    public/
    public/images/
    styles/
  "
  
  # ═══════════════════════════════════════════════════════════
  # API Gateway (api.affynix.com)
  # ═══════════════════════════════════════════════════════════
  ["services/api-gateway"]="
    src/
    src/routes/
    src/middleware/
    src/federation/
    src/ratelimit/
    src/websocket/
    config/
    tests/
  "
  
  # ═══════════════════════════════════════════════════════════
  # Shared Infrastructure Layer
  # ═══════════════════════════════════════════════════════════
  ["shared"]="
    database/
    database/migrations/
    database/seeds/
    redis/
    redis/config/
    messaging/
    messaging/queues/
    messaging/topics/
    monitoring/
    monitoring/prometheus/
    monitoring/grafana/
    storage/
    storage/s3/
  "
  
  # ═══════════════════════════════════════════════════════════
  # Infrastructure as Code
  # ═══════════════════════════════════════════════════════════
  ["infrastructure"]="
    docker/
    docker/auth/
    docker/data/
    docker/admin/
    docker/gateway/
    kubernetes/
    kubernetes/base/
    kubernetes/overlays/
    kubernetes/overlays/development/
    kubernetes/overlays/staging/
    kubernetes/overlays/production/
    terraform/
    terraform/aws/
    terraform/cloudflare/
    nginx/
    nginx/conf.d/
  "
  
  # ═══════════════════════════════════════════════════════════
  # DevOps & Tooling
  # ═══════════════════════════════════════════════════════════
  ["devops"]="
    scripts/
    scripts/db/
    scripts/deploy/
    scripts/monitoring/
    ci-cd/
    ci-cd/github-actions/
    ci-cd/gitlab/
  "
)

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xII — UTILITY FUNCTIONS
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

log_info() {
  echo -e "${COLOR_BLUE}[INFO]${COLOR_RESET} $1"
}

log_success() {
  echo -e "${COLOR_GREEN}[✓]${COLOR_RESET} $1"
}

log_warning() {
  echo -e "${COLOR_YELLOW}[WARNING]${COLOR_RESET} $1"
}

log_error() {
  echo -e "${COLOR_RED}[ERROR]${COLOR_RESET} $1"
}

log_section() {
  echo -e "\n${COLOR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}"
  echo -e "${COLOR_CYAN}$1${COLOR_RESET}"
  echo -e "${COLOR_CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${COLOR_RESET}\n"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xIII — INFRASTRUCTURE INITIALIZATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

initialize_project() {
  log_section "0x0 — PROJECT INITIALIZATION"
  
  if [[ -d "${PROJECT_ROOT}" ]]; then
    log_warning "Project directory exists. Creating backup..."
    mkdir -p "${BACKUP_DIR}"
    cp -R "${PROJECT_ROOT}" "${BACKUP_DIR}/" 2>/dev/null || true
    log_success "Backup created at: ${BACKUP_DIR}"
  fi
  
  log_info "Creating project root: ${PROJECT_ROOT}"
  mkdir -p "${PROJECT_ROOT}"
  cd "${PROJECT_ROOT}"
  
  log_success "Project root initialized"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xIV — DIRECTORY TOPOLOGY GENERATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

create_directory_structure() {
  log_section "0xI — DIRECTORY TOPOLOGY GENERATION"
  
  local total_dirs=0
  
  for service_path in "${(@k)SERVICE_TOPOLOGY}"; do
    log_info "Generating: ${service_path}"
    
    # Create base service directory
    mkdir -p "${service_path}"
    
    # Parse and create subdirectories
    local subdirs_str="${SERVICE_TOPOLOGY[$service_path]}"
    local subdirs=()
    while IFS= read -r line; do
      subdirs+=("$line")
    done <<< "$subdirs_str"
    
    for subdir in "${subdirs[@]}"; do
      # Trim whitespace
      subdir="${subdir##*( )}"
      subdir="${subdir%%*( )}"
      
      if [[ -n "${subdir}" ]]; then
        mkdir -p "${service_path}/${subdir}"
        ((total_dirs++))
      fi
    done
    
    log_success "Created: ${service_path} (${#subdirs[@]} subdirectories)"
  done
  
  log_success "Total directories created: ${total_dirs}"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xV — CONFIGURATION SCAFFOLDING
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

create_configuration_files() {
  log_section "0xII — CONFIGURATION SCAFFOLDING"
  
  # Root-level configuration
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment
.env
.env.local
.env.*.local
*.env

# Build outputs
dist/
build/
.next/
out/

# Logs
logs/
*.log
npm-debug.log*
pnpm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
coverage/
.nyc_output/

# Database
*.db
*.sqlite

# Secrets
*.pem
*.key
secrets/
EOF
  
  log_success "Created: .gitignore"
  
  # Root package.json
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
    "lint": "turbo run lint",
    "deploy": "bash ./devops/scripts/deploy/production.sh",
    "db:migrate": "bash ./devops/scripts/db/migrate.sh",
    "db:seed": "bash ./devops/scripts/db/seed.sh"
  },
  "devDependencies": {
    "turbo": "latest"
  }
}
EOF
  
  log_success "Created: package.json (monorepo configuration)"
  
  # Docker Compose for local development
  cat > docker-compose.yml << 'EOF'
version: '3.9'

services:
  # ═══════════════════════════════════════════════════════════
  # Infrastructure Layer
  # ═══════════════════════════════════════════════════════════
  
  postgres:
    image: timescale/timescaledb:latest-pg15
    container_name: affynix-postgres
    environment:
      POSTGRES_DB: affynix
      POSTGRES_USER: affynix_user
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-development}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./shared/database/migrations:/docker-entrypoint-initdb.d
    networks:
      - affynix-network
  
  redis:
    image: redis:7-alpine
    container_name: affynix-redis
    command: redis-server --appendonly yes
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - affynix-network
  
  rabbitmq:
    image: rabbitmq:3-management-alpine
    container_name: affynix-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: affynix
      RABBITMQ_DEFAULT_PASS: ${RABBITMQ_PASSWORD:-development}
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - affynix-network
  
  # ═══════════════════════════════════════════════════════════
  # Services Layer
  # ═══════════════════════════════════════════════════════════
  
  auth-service:
    build:
      context: ./services/auth
      dockerfile: ../../infrastructure/docker/auth/Dockerfile
    container_name: affynix-auth
    environment:
      NODE_ENV: development
      DATABASE_URL: postgresql://affynix_user:development@postgres:5432/affynix
      REDIS_URL: redis://redis:6379
    ports:
      - "3001:3001"
    depends_on:
      - postgres
      - redis
    networks:
      - affynix-network
    volumes:
      - ./services/auth:/app
      - /app/node_modules
  
  data-service:
    build:
      context: ./services/data
      dockerfile: ../../infrastructure/docker/data/Dockerfile
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
  
  api-gateway:
    build:
      context: ./services/api-gateway
      dockerfile: ../../infrastructure/docker/gateway/Dockerfile
    container_name: affynix-gateway
    environment:
      NODE_ENV: development
      AUTH_SERVICE_URL: http://auth-service:3001
      DATA_SERVICE_URL: http://data-service:3002
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - auth-service
      - data-service
      - redis
    networks:
      - affynix-network
  
  admin-dashboard:
    build:
      context: ./services/admin
      dockerfile: ../../infrastructure/docker/admin/Dockerfile
    container_name: affynix-admin
    environment:
      NODE_ENV: development
      NEXT_PUBLIC_API_URL: http://localhost:3000
    ports:
      - "3003:3003"
    depends_on:
      - api-gateway
    networks:
      - affynix-network

volumes:
  postgres_data:
  redis_data:
  rabbitmq_data:

networks:
  affynix-network:
    driver: bridge
EOF
  
  log_success "Created: docker-compose.yml (local development environment)"
  
  # Environment template
  cat > .env.example << 'EOF'
# ═══════════════════════════════════════════════════════════
# AFFYNIX BACKEND CONFIGURATION
# Copy to .env and fill in production values
# ═══════════════════════════════════════════════════════════

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/affynix
POSTGRES_PASSWORD=

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=

# Message Queue
RABBITMQ_URL=amqp://localhost:5672
RABBITMQ_PASSWORD=

# Authentication
JWT_SECRET=
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET=affynix-storage

# Analytics
CLOUDFILT_SITE_ID=
CHARLA_WIDGET_ID=
CLICKRANK_DOMAIN=

# Service URLs (Production)
AUTH_SERVICE_URL=https://login.affynix.com
DATA_SERVICE_URL=https://data.affynix.com
API_GATEWAY_URL=https://api.affynix.com
ADMIN_URL=https://admin.affynix.com
EOF
  
  log_success "Created: .env.example"
  
  # Turbo configuration
  cat > turbo.json << 'EOF'
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    }
  }
}
EOF
  
  log_success "Created: turbo.json (monorepo build orchestration)"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xVI — SERVICE PACKAGE INITIALIZATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

create_service_packages() {
  log_section "0xIII — SERVICE PACKAGE INITIALIZATION"
  
  # Auth Service
  cat > services/auth/package.json << 'EOF'
{
  "name": "@affynix/auth-service",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest",
    "migrate": "node migrations/migrate.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2",
    "bcrypt": "^5.1.1",
    "jsonwebtoken": "^9.0.2",
    "helmet": "^7.0.0",
    "cors": "^2.8.5",
    "joi": "^17.9.2",
    "speakeasy": "^2.0.0"
  }
}
EOF
  log_success "Created: services/auth/package.json"
  
  # Data Service
  cat > services/data/package.json << 'EOF'
{
  "name": "@affynix/data-service",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "apollo-server-express": "^3.12.0",
    "graphql": "^16.7.1",
    "pg": "^8.11.3",
    "ioredis": "^5.3.2",
    "ws": "^8.13.0"
  }
}
EOF
  log_success "Created: services/data/package.json"
  
  # API Gateway
  cat > services/api-gateway/package.json << 'EOF'
{
  "name": "@affynix/api-gateway",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "http-proxy-middleware": "^2.0.6",
    "express-rate-limit": "^6.10.0",
    "ioredis": "^5.3.2",
    "helmet": "^7.0.0"
  }
}
EOF
  log_success "Created: services/api-gateway/package.json"
  
  # Admin Dashboard
  cat > services/admin/package.json << 'EOF'
{
  "name": "@affynix/admin-dashboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3003",
    "build": "next build",
    "start": "next start -p 3003",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "recharts": "^2.10.0",
    "zustand": "^4.4.0"
  }
}
EOF
  log_success "Created: services/admin/package.json"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xVII — README GENERATION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

create_documentation() {
  log_section "0xIV — DOCUMENTATION GENERATION"
  
  cat > README.md << 'EOF'
# AFFYNIX BACKEND INFRASTRUCTURE

## 0x0 — ARCHITECTURAL OVERVIEW

Multi-service backend infrastructure supporting the Affynix affiliate network ecosystem.

### Service Topology

- **Authentication Service** (`login.affynix.com`) - JWT-based auth, OAuth integration
- **Data Service** (`data.affynix.com`) - GraphQL API, product management, analytics
- **API Gateway** (`api.affynix.com`) - Request routing, rate limiting, federation
- **Admin Dashboard** (`admin.affynix.com`) - Management interface, analytics

### Technology Stack

- **Runtime**: Node.js 18+
- **Database**: PostgreSQL with TimescaleDB
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Orchestration**: Docker Compose (dev), Kubernetes (prod)
- **Monitoring**: Prometheus + Grafana

## 0xI — QUICK START

```zsh
# Clone and bootstrap
git clone <repository>
cd affynix-backend
chmod +x scripts/bootstrap-backend.sh
./scripts/bootstrap-backend.sh

# Start development environment
docker-compose up -d

# Install dependencies
npm install

# Run all services
npm run dev
```

## 0xII — SERVICE DOCUMENTATION

### Authentication Service
- **Port**: 3001
- **Endpoints**: `/auth/login`, `/auth/register`, `/auth/refresh`
- **Features**: JWT tokens, OAuth (Google, GitHub), 2FA

### Data Service  
- **Port**: 3002
- **GraphQL**: `/graphql`
- **REST**: `/api/v1/products`
- **Features**: Product CRUD, analytics, real-time subscriptions

### API Gateway
- **Port**: 3000
- **Features**: Request routing, rate limiting, authentication
- **Routes**: `/auth/*` → auth-service, `/data/*` → data-service

### Admin Dashboard
- **Port**: 3003
- **Features**: Analytics, product management, user management
- **Framework**: Next.js 14

## 0xIII — DEVELOPMENT

```zsh
# Start specific service
npm run dev --workspace=@affynix/auth-service

# Run tests
npm run test

# Database migrations
npm run db:migrate

# Seed database
npm run db:seed
```

## 0xIV — DEPLOYMENT

```zsh
# Production deployment
npm run deploy

# Kubernetes deployment
kubectl apply -f infrastructure/kubernetes/overlays/production/
```

## 0xV — MONITORING

- **Metrics**: http://localhost:9090 (Prometheus)
- **Dashboards**: http://localhost:3001 (Grafana)
- **Logs**: `docker-compose logs -f [service-name]`
EOF
  
  log_success "Created: README.md"
}

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# 0xVIII — MAIN EXECUTION
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

main() {
  log_section "AFFYNIX BACKEND INFRASTRUCTURE BOOTSTRAP"
  log_info "Starting infrastructure initialization..."
  
  initialize_project
  create_directory_structure
  create_configuration_files
  create_service_packages
  create_documentation
  
  log_section "BOOTSTRAP COMPLETE"
  log_success "Affynix backend infrastructure initialized successfully!"
  log_info "Next steps:"
  log_info "1. cd ${PROJECT_ROOT}"
  log_info "2. cp .env.example .env"
  log_info "3. docker-compose up -d"
  log_info "4. npm install"
  log_info "5. npm run dev"
  
  log_success "Happy coding! 🚀"
}

# Execute main function
main "$@"
