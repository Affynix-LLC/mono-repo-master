#!/bin/bash

# Railway Backend Deployment Script
# This script helps deploy the backend to Railway

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🚂 Railway Backend Deployment${NC}"
echo "=================================="
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Install with: npm i -g @railway/cli${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI found${NC}"
echo ""

# Get backend directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/website_build/backend"

if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found${NC}"
    exit 1
fi

cd "$BACKEND_DIR"

echo "📁 Backend directory: $BACKEND_DIR"
echo ""

# Check if logged into Railway
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Railway${NC}"
    echo "Logging in..."
    railway login
fi

echo -e "${GREEN}✅ Logged into Railway${NC}"
echo ""

# Check if project is linked
if [ ! -f "railway.json" ] && [ ! -d ".railway" ]; then
    echo -e "${BLUE}🔗 Linking project to Railway...${NC}"
    echo ""
    echo -e "${YELLOW}When prompted:${NC}"
    echo "  - Create new project or select existing"
    echo "  - Project name: affynix-backend (or your choice)"
    echo ""
    railway link
    echo ""
else
    echo -e "${GREEN}✅ Project already linked${NC}"
fi

echo ""
echo -e "${BLUE}📋 Setting up deployment...${NC}"
echo ""

# Create railway.json if it doesn't exist
if [ ! -f "railway.json" ]; then
    cat > railway.json << EOF
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
echo -e "${YELLOW}⚠️  IMPORTANT: Set these environment variables in Railway:${NC}"
echo ""
echo "  NODE_ENV=production"
echo "  PORT=3001"
echo "  DATABASE_PATH=/app/data/affynix.db"
echo "  JWT_SECRET=<generate-random-32-char-string>"
echo "  JWT_EXPIRES_IN=7d"
echo "  OPENAI_API_KEY=<your-openai-key>"
echo "  LLM_MODEL=gpt-4-turbo-preview"
echo ""
echo -e "${BLUE}To set variables:${NC}"
echo "  railway variables"
echo "  OR"
echo "  Railway Dashboard → Your Project → Variables"
echo ""

read -p "Have you set the environment variables? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please set environment variables first${NC}"
    echo "Run: railway variables"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
echo ""

# Deploy
railway up

echo ""
echo -e "${GREEN}✅ Deployment initiated!${NC}"
echo ""

# Get deployment URL
echo -e "${BLUE}📡 Getting deployment URL...${NC}"
DEPLOYMENT_URL=$(railway domain 2>&1 | grep -oP 'https://[^\s]+' | head -1 || echo "")

if [ -n "$DEPLOYMENT_URL" ]; then
    echo ""
    echo -e "${GREEN}✅ Backend deployed!${NC}"
    echo ""
    echo "🌐 Deployment URL: $DEPLOYMENT_URL"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Add custom domain: api.affynix.ai"
    echo "   Run: railway domain add api.affynix.ai"
    echo ""
    echo "2. Test health endpoint:"
    echo "   curl $DEPLOYMENT_URL/health"
    echo ""
else
    echo ""
    echo -e "${YELLOW}⚠️  Deployment started. Check Railway dashboard for URL${NC}"
    echo "   Run: railway open"
fi

echo ""
echo -e "${BLUE}📖 Full guide: PRODUCTION_READY_CHECKLIST.md${NC}"
echo ""

