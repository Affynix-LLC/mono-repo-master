#!/bin/bash

# Deployment script for ai.affynix.ai

set -e

echo "🚀 Deploying AI Gateway to ai.affynix.ai..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check environment variables
if [ -z "$AI_GATEWAY_API_KEY" ]; then
    echo "⚠️  Warning: AI_GATEWAY_API_KEY not set"
fi

# Deploy to Vercel
echo "📦 Building and deploying..."
vercel --prod --yes

# Set domain if not already set
echo "🌐 Configuring domain..."
vercel domains add ai.affynix.ai || echo "Domain may already be configured"

echo "✅ Deployment complete!"
echo "📍 Gateway available at: https://ai.affynix.ai"

