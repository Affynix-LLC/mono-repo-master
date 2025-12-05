#!/bin/zsh

# Script to deploy to development environment
# Only deploys from development branch

echo "🧪 Deploying to development environment..."

# Check if we're on development branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "development" ]; then
    echo "❌ Error: Must be on development branch to deploy to dev"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Switch to development: git checkout development"
    exit 1
fi

# Pull latest changes
git pull origin development

# Deploy to Vercel (development environment)
echo "🚀 Deploying to Vercel development..."
npx vercel --yes

echo "✅ Development deployment complete!"
echo "🌐 Dev URL: https://dev.affynix.com"
