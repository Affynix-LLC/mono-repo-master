#!/bin/bash

# Backend Deployment Helper Script
# This script helps prepare the backend for deployment to Railway/Render

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 Backend Deployment Preparation${NC}"
echo "=================================="
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BACKEND_DIR="$SCRIPT_DIR/website_build/backend"

echo "📁 Backend directory: $BACKEND_DIR"
echo ""

# Check if backend directory exists
if [ ! -d "$BACKEND_DIR" ]; then
    echo -e "${RED}❌ Backend directory not found${NC}"
    exit 1
fi

# Check if package.json exists
if [ ! -f "$BACKEND_DIR/package.json" ]; then
    echo -e "${RED}❌ package.json not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Backend directory found${NC}"
echo ""

# Generate JWT secret if needed
echo -e "${YELLOW}🔑 Generating JWT secret...${NC}"
JWT_SECRET=$(openssl rand -hex 32)
echo "JWT_SECRET=$JWT_SECRET"
echo ""

# Create .env.example for backend
echo -e "${BLUE}📝 Creating .env.example for backend...${NC}"
cat > "$BACKEND_DIR/.env.example" << EOF
# Backend Environment Variables
# Copy this to .env and fill in your values

NODE_ENV=production
PORT=3001
DATABASE_PATH=/app/data/affynix.db

# Authentication
JWT_SECRET=$JWT_SECRET
JWT_EXPIRES_IN=7d

# OpenAI LLM
OPENAI_API_KEY=sk-proj-your-openai-api-key-here
LLM_MODEL=gpt-4-turbo-preview

# Webhooks (optional)
ZAPIER_AGENT_WEBHOOK_URL=
VITE_CONTACT_WEBHOOK_URL=
EOF

echo -e "${GREEN}✅ Created .env.example${NC}"
echo ""

# Check dependencies
echo -e "${BLUE}📦 Checking dependencies...${NC}"
cd "$BACKEND_DIR"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo -e "${GREEN}✅ Dependencies already installed${NC}"
fi

echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Backend is ready for deployment!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}📋 Deployment Instructions:${NC}"
echo ""
echo "1. ${GREEN}Railway (Recommended)${NC}:"
echo "   → Go to https://railway.app"
echo "   → New Project → Deploy from GitHub"
echo "   → Select your repository"
echo "   → Root Directory: affynix_ai_website/website_build/backend"
echo "   → Start Command: npm start"
echo "   → Add environment variables from .env.example"
echo ""
echo "2. ${GREEN}Render${NC}:"
echo "   → Go to https://render.com"
echo "   → New → Web Service → Connect GitHub"
echo "   → Root Directory: affynix_ai_website/website_build/backend"
echo "   → Start Command: npm start"
echo "   → Add environment variables from .env.example"
echo ""
echo "3. ${GREEN}After deployment:${NC}"
echo "   → Add custom domain: api.affynix.ai"
echo "   → Test: curl https://api.affynix.ai/health"
echo ""
echo -e "${BLUE}📖 See PRODUCTION_READY_CHECKLIST.md for full details${NC}"
echo ""

