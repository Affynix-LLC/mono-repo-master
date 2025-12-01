#!/bin/bash
# Quick start script for Affynix.ai

echo "🚀 Affynix.ai Quick Start"
echo "========================="
echo ""

cd /Users/13omb3r/Dev/affynix-mono-repo/affynix_ai_website/website_build

# Check .env
if [ ! -f .env ]; then
  echo "❌ No .env file found!"
  echo "   Creating from env.example..."
  cp env.example .env
  echo "✅ Created .env"
  echo ""
fi

# Check for OpenAI key
if grep -q "sk-REPLACE" .env || grep -q "sk-your-openai" .env; then
  echo "⚠️  OpenAI API Key not set!"
  echo ""
  echo "Please edit .env and add your OpenAI API key:"
  echo "   nano .env"
  echo ""
  echo "Then run this script again."
  exit 1
fi

echo "✅ Environment configured"
echo ""
echo "🐳 Starting Docker services..."
echo ""

# Start services
docker-compose up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "🏥 Health Checks:"
curl -sf http://localhost:3001/health > /dev/null && echo "   ✅ Backend (3001)" || echo "   ❌ Backend failed"
curl -sf http://localhost:4173 > /dev/null && echo "   ✅ Frontend (4173)" || echo "   ❌ Frontend failed"
curl -sf http://localhost:3002 > /dev/null && echo "   ✅ Admin (3002)" || echo "   ❌ Admin failed"

echo ""
echo "🌐 Access your services:"
echo "   Chat:  http://localhost:4173"
echo "   Admin: http://localhost:3002"
echo "   API:   http://localhost:3001"
echo ""
echo "📋 View logs: docker-compose logs -f"
echo "🛑 Stop: docker-compose down"
echo ""
