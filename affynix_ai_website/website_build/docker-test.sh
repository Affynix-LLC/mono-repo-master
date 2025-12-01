#!/bin/bash
# Docker test script for Affynix.ai stack

set -e

echo "🐳 Affynix.ai Docker Test Script"
echo "================================"

# Check if .env exists
if [ ! -f .env ]; then
  echo "⚠️  No .env file found. Creating from env.example..."
  cp env.example .env
  echo "📝 Please edit .env and add your OPENAI_API_KEY before continuing."
  echo "   Press Enter when ready..."
  read
fi

# Check for OPENAI_API_KEY
if ! grep -q "OPENAI_API_KEY=sk-" .env; then
  echo "⚠️  OPENAI_API_KEY not set in .env"
  echo "   LLM features will not work without it."
  echo "   Continue anyway? (y/n)"
  read -r response
  if [[ ! "$response" =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo ""
echo "🔧 Building and starting services..."
echo "   - Backend (api.affynix.ai) → http://localhost:3001"
echo "   - Frontend (affynix.ai) → http://localhost:4173"
echo "   - Admin (admin.affynix.ai) → http://localhost:3002"
echo ""

# Build and start
docker-compose down
docker-compose build
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check health
echo ""
echo "🏥 Health Checks:"
echo -n "   Backend:  "
curl -sf http://localhost:3001/health > /dev/null && echo "✅ Healthy" || echo "❌ Failed"

echo -n "   Frontend: "
curl -sf http://localhost:4173 > /dev/null && echo "✅ Healthy" || echo "❌ Failed"

echo -n "   Admin:    "
curl -sf http://localhost:3002 > /dev/null && echo "✅ Healthy" || echo "❌ Failed"

echo ""
echo "📊 Service URLs:"
echo "   🌐 Public Chat:  http://localhost:4173"
echo "   🔧 Admin Panel:  http://localhost:3002"
echo "   📡 API Server:   http://localhost:3001"
echo "   🔌 WebSocket:    ws://localhost:3001/ws"
echo ""
echo "📋 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
