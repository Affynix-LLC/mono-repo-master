#!/bin/zsh

# Affynix Deployment Script
# Builds and deploys both frontend and backend services via Docker Compose.

set -euo pipefail

print_usage() {
  cat <<'USAGE'
Usage: ./deploy.sh [options]

Options:
  --env-file <path>      Specify the env file passed to docker compose (default: .env)
  --dev                  Use docker-compose.dev.yml in addition to docker-compose.yml
  --compose-file <path>  Append an extra compose file (-f flag)
  --no-cache             Build images without cache
  -h, --help             Show this help message
USAGE
}

echo "🚀 Starting Affynix deployment..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ENV_FILE=".env"
typeset -a COMPOSE_FILES
COMPOSE_FILES=("docker-compose.yml")
NO_CACHE=false

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      [[ $# -lt 2 ]] && { echo "Missing value for --env-file"; exit 1; }
      ENV_FILE="$2"
      shift 2
      ;;
    --dev)
      COMPOSE_FILES=("docker-compose.yml" "docker-compose.dev.yml")
      shift
      ;;
    --compose-file|-f)
      [[ $# -lt 2 ]] && { echo "Missing value for $1"; exit 1; }
      COMPOSE_FILES+=("$2")
      shift 2
      ;;
    --no-cache)
      NO_CACHE=true
      shift
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      print_usage
      exit 1
      ;;
  esac
done

if [[ ! -f "${COMPOSE_FILES[1]}" ]]; then
  echo -e "${RED}Missing compose file: ${COMPOSE_FILES[1]}${NC}"
  exit 1
fi

ENV_ARGS=()
if [[ -f "$ENV_FILE" ]]; then
  ENV_ARGS=(--env-file "$ENV_FILE")
  set -a
  source "$ENV_FILE"
  set +a
else
  echo -e "${RED}⚠️  Env file '$ENV_FILE' not found. Using defaults.${NC}"
fi

BACKEND_PORT="${PORT:-3001}"
FRONTEND_PORT="${FRONTEND_PORT:-4173}"

typeset -a COMPOSE_ARGS
COMPOSE_ARGS=()
for file in "${COMPOSE_FILES[@]}"; do
  COMPOSE_ARGS+=(-f "$file")
done

compose() {
  docker compose "${COMPOSE_ARGS[@]}" "${ENV_ARGS[@]}" "$@"
}

echo -e "${BLUE}📦 Building Docker images...${NC}"
if [[ "$NO_CACHE" == true ]]; then
  compose build --no-cache
else
  compose build
fi

echo -e "${BLUE}🛑 Stopping existing containers...${NC}"
compose down

echo -e "${BLUE}▶️  Starting services...${NC}"
compose up -d

echo -e "${BLUE}⏳ Waiting for services to start...${NC}"
sleep 5

echo -e "${BLUE}🏥 Checking service health...${NC}"
if curl -sf "http://localhost:${BACKEND_PORT}/health" > /dev/null; then
  echo -e "${GREEN}✅ Backend is healthy${NC}"
else
  echo -e "${RED}❌ Backend health check failed${NC}"
  exit 1
fi

if curl -sf "http://localhost:${FRONTEND_PORT}" > /dev/null; then
  echo -e "${GREEN}✅ Frontend is healthy${NC}"
else
  echo -e "${RED}❌ Frontend health check failed${NC}"
  exit 1
fi

echo -e "${BLUE}📊 Service status:${NC}"
compose ps

echo -e "${GREEN}✨ Deployment complete!${NC}"
echo ""
echo "Frontend: http://localhost:${FRONTEND_PORT} (affynix.ai in production)"
echo "Backend:  http://localhost:${BACKEND_PORT} (admin.affynix.ai in production)"
echo ""
echo "View logs: docker compose ${COMPOSE_ARGS[*]} logs -f"
