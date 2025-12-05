#!/bin/bash

# Comprehensive endpoint testing script for AI Gateway

set -e

DOMAIN="${1:-ai-gateway-37fwhdkrk-affynix.vercel.app}"
BASE_URL="https://${DOMAIN}"

echo "🧪 Testing AI Gateway endpoints on ${BASE_URL}"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo -n "Testing ${description}... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "${BASE_URL}${endpoint}" || echo "000")
    else
        response=$(curl -s -w "\n%{http_code}" -X "${method}" \
            -H "Content-Type: application/json" \
            -d "${data}" \
            "${BASE_URL}${endpoint}" || echo "000")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ] || [ "$http_code" = "405" ]; then
        echo -e "${GREEN}✓${NC} (HTTP ${http_code})"
        return 0
    elif [ "$http_code" = "404" ]; then
        echo -e "${YELLOW}⚠${NC} Not found (HTTP ${http_code})"
        return 1
    else
        echo -e "${RED}✗${NC} (HTTP ${http_code})"
        if [ -n "$body" ]; then
            echo "  Response: $(echo "$body" | head -c 100)"
        fi
        return 1
    fi
}

# Test Chat API
echo "📡 API Endpoints:"
test_endpoint "POST" "/api/chat" '{"messages":[{"role":"user","content":"Hello"}]}' "Chat API"

# Test Tasks API
test_endpoint "GET" "/api/tasks" "" "Get Tasks"
test_endpoint "POST" "/api/tasks" '{
  "name": "Test Task",
  "cronExpression": "0 * * * *",
  "action": {
    "type": "prompt",
    "config": {
      "prompt": "Test prompt"
    }
  }
}' "Create Task"

# Test Webhooks API
test_endpoint "GET" "/api/webhooks" "" "Get Webhooks"
test_endpoint "POST" "/api/webhooks?handler=generic" '{"test": "data"}' "Webhook Receiver"

# Test Workflows API
test_endpoint "GET" "/api/workflows" "" "Get Workflows"

# Test Agents API
test_endpoint "GET" "/api/agents" "" "Get Agents"

echo ""
echo "✅ Endpoint testing complete!"
echo ""
echo "💡 To test with ai.affynix.ai domain:"
echo "   ./scripts/test-endpoints.sh ai.affynix.ai"

