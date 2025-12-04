#!/bin/bash

# Redeploy admin via Vercel API
# This bypasses the CLI path issue

PROJECT_ID="prj_0V6bV5TFUUliN7WbotaMA2jS6e4x"
TEAM_ID="team_ffSkbObQFzckEPWZSlpzwGMq"

echo "🚀 Redeploying admin panel via Vercel API..."

# Get deployment URL from latest deployment
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $(cat ~/.vercel/auth.json 2>/dev/null | grep -o '"token":"[^"]*' | cut -d'"' -f4 || echo '')" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"admin\",
    \"project\": \"$PROJECT_ID\",
    \"target\": \"production\"
  }" 2>&1 || echo "API method not available - use dashboard instead"

echo ""
echo "📋 Alternative: Use Vercel Dashboard"
echo "1. Go to: https://vercel.com/affynix/admin"
echo "2. Click 'Deployments' → 'Redeploy'"
echo "3. Uncheck 'Use existing Build Cache'"
echo "4. Click 'Redeploy'"

