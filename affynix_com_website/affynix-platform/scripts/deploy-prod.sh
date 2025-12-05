#!/bin/zsh

# Script to deploy to production environment
# Only deploys from main branch

echo "🌟 Deploying to production environment..."

# Check if we're on main branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ Error: Must be on main branch to deploy to production"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Switch to main: git checkout main"
    exit 1
fi

# Pull latest changes
git pull origin main

# Deploy to Vercel (production environment)
echo "🚀 Deploying to Vercel production..."
npx vercel --prod --yes

echo "✅ Production deployment complete!"
echo "🌐 Production URL: https://affynix.com"
