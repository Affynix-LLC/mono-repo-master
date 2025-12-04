#!/bin/bash

# Health check script for ai.affynix.ai

DOMAIN="${1:-ai.affynix.ai}"

echo "🏥 Health check for $DOMAIN..."

# Check if domain is accessible
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN/api/chat" || echo "000")

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "405" ]; then
    echo "✅ Domain is accessible (HTTP $HTTP_CODE)"
else
    echo "❌ Domain returned HTTP $HTTP_CODE"
    exit 1
fi

# Check API endpoints
ENDPOINTS=(
    "/api/chat"
    "/api/tasks"
    "/api/webhooks"
    "/api/workflows"
    "/api/agents"
)

for endpoint in "${ENDPOINTS[@]}"; do
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN$endpoint" || echo "000")
    if [ "$CODE" = "200" ] || [ "$CODE" = "405" ] || [ "$CODE" = "404" ]; then
        echo "✅ $endpoint (HTTP $CODE)"
    else
        echo "⚠️  $endpoint returned HTTP $CODE"
    fi
done

echo "✅ Health check complete!"

