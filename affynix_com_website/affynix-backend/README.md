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
