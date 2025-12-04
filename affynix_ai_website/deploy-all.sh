#!/bin/bash

# Affynix.ai Complete Deployment Script
# This script automates deployment of frontend and admin to Vercel
# Backend deployment requires manual setup on Railway/Render

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Affynix.ai Deployment Script${NC}"
echo "=================================="
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Install with: npm i -g vercel${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Vercel CLI found${NC}"
echo ""

# Check if logged into Vercel
if ! vercel whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Vercel. Please login first:${NC}"
    echo "   Run: vercel login"
    echo ""
    read -p "Do you want to login now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel login
    else
        echo -e "${RED}❌ Please login to Vercel first${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Logged into Vercel${NC}"
echo ""

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
REPO_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"

echo "📁 Repository root: $REPO_ROOT"
echo ""

# Step 1: Deploy Frontend
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 1: Deploying Frontend (affynix.ai)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$REPO_ROOT/affynix_ai_website/website_build/frontend"

# Check if .vercel directory exists (project already linked)
if [ -d ".vercel" ]; then
    echo -e "${YELLOW}⚠️  Project already linked to Vercel${NC}"
    read -p "Deploy to existing project? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying frontend..."
        vercel --prod --yes
    else
        echo "Skipping frontend deployment"
    fi
else
    echo "🔗 Linking frontend project to Vercel..."
    echo -e "${YELLOW}When prompted:${NC}"
    echo "  - Set root directory to: website_build/frontend"
    echo "  - Confirm project settings"
    echo ""
    vercel link --yes
    
    echo ""
    echo "🚀 Deploying frontend..."
    vercel --prod --yes
fi

echo ""
echo -e "${GREEN}✅ Frontend deployment initiated${NC}"
echo ""

# Step 2: Deploy Admin
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Step 2: Deploying Admin Panel (admin.affynix.ai)${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

cd "$REPO_ROOT/affynix_ai_website/admin"

if [ -d ".vercel" ]; then
    echo -e "${YELLOW}⚠️  Admin project already linked to Vercel${NC}"
    read -p "Deploy to existing project? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🚀 Deploying admin..."
        vercel --prod --yes
    else
        echo "Skipping admin deployment"
    fi
else
    echo "🔗 Linking admin project to Vercel..."
    echo -e "${YELLOW}When prompted:${NC}"
    echo "  - Set root directory to: admin"
    echo "  - Confirm project settings"
    echo ""
    vercel link --yes
    
    echo ""
    echo "🚀 Deploying admin..."
    vercel --prod --yes
fi

echo ""
echo -e "${GREEN}✅ Admin deployment initiated${NC}"
echo ""

# Step 3: Summary and Next Steps
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}✅ Deployment Complete!${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo ""
echo "1. ${GREEN}Backend API Deployment (REQUIRED)${NC}"
echo "   → Go to https://railway.app or https://render.com"
echo "   → Deploy backend from: affynix_ai_website/website_build/backend"
echo "   → See PRODUCTION_READY_CHECKLIST.md for details"
echo ""
echo "2. ${GREEN}Add Custom Domains in Vercel${NC}"
echo "   → Frontend: https://vercel.com/dashboard → Your Project → Settings → Domains"
echo "   → Add: affynix.ai and www.affynix.ai"
echo "   → Admin: Add: admin.affynix.ai"
echo ""
echo "3. ${GREEN}Configure DNS${NC}"
echo "   → Point domains to Vercel (instructions in Vercel dashboard)"
echo "   → Point api.affynix.ai to your backend service"
echo ""
echo "4. ${GREEN}Set Environment Variables${NC}"
echo "   → Frontend: VITE_API_URL=https://api.affynix.ai (already set in vercel.json)"
echo "   → Admin: VITE_API_URL=https://api.affynix.ai (already set in vercel.json)"
echo "   → Backend: See PRODUCTION_READY_CHECKLIST.md"
echo ""
echo -e "${BLUE}📖 Full guide: affynix_ai_website/PRODUCTION_READY_CHECKLIST.md${NC}"
echo ""

