#!/bin/zsh

# Script to deploy to staging environment
# Only deploys from staging branch

echo "🧪 Deploying to staging environment..."

# Check if we're on staging branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "staging" ]; then
    echo "❌ Error: Must be on staging branch to deploy to staging"
    echo "Current branch: $CURRENT_BRANCH"
    echo "Switch to staging: git checkout staging"
    exit 1
fi

# Pull latest changes
git pull origin staging

# Deploy to Vercel (staging environment)
echo "🚀 Deploying to Vercel staging..."
npx vercel --yes

echo "✅ Staging deployment complete!"
echo "🌐 Staging URL: https://staging.affynix.com"
