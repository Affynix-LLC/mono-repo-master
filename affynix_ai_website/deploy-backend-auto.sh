#!/bin/bash

# Automated Railway Backend Deployment
# Run this AFTER: railway login

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚂 Automated Railway Backend Deployment${NC}"
echo "=========================================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/website_build/backend"

cd "$BACKEND_DIR"

# Check Railway auth
if ! railway whoami &> /dev/null; then
    echo -e "${RED}❌ Not authenticated with Railway${NC}"
    echo ""
    echo "Please run: railway login"
    echo "Then run this script again."
    exit 1
fi

echo -e "${GREEN}✅ Authenticated with Railway${NC}"
USER=$(railway whoami 2>/dev/null | grep -oP '(?<=Logged in as: )\S+' || echo "user")
echo "Logged in as: $USER"
echo ""

# Check if already linked
if [ -f ".railway/project.json" ] || [ -f "railway.json" ]; then
    echo -e "${YELLOW}⚠️  Project already linked${NC}"
    read -p "Continue with existing link? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
else
    echo -e "${BLUE}🔗 Linking project to Railway...${NC}"
    echo ""
    railway link
fi

echo ""
echo -e "${BLUE}📋 Checking configuration...${NC}"

# Ensure railway.json exists
if [ ! -f "railway.json" ]; then
    echo "Creating railway.json..."
    cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
    echo -e "${GREEN}✅ Created railway.json${NC}"
fi

echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Set environment variables${NC}"
echo ""
echo "Run: railway variables"
echo ""
echo "Required variables:"
echo "  NODE_ENV=production"
echo "  PORT=3001"
echo "  DATABASE_PATH=/app/data/affynix.db"
echo "  JWT_SECRET=<random-32-char-string>"
echo "  JWT_EXPIRES_IN=7d"
echo "  OPENAI_API_KEY=<your-openai-key>"
echo "  LLM_MODEL=gpt-4-turbo-preview"
echo ""

read -p "Have you set the environment variables? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Setting up variables interactively..."
    railway variables
fi

echo ""
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
echo ""

railway up

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""

# Get deployment info
echo -e "${BLUE}📡 Deployment Information:${NC}"
railway status

echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Add custom domain: railway domain add api.affynix.ai"
echo "2. Test health: curl \$(railway domain)/health"
echo "3. View logs: railway logs"
echo ""

