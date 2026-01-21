#!/bin/bash

# Script to configure backend URL for admin deployment

echo "🔧 Admin Backend URL Configuration"
echo "==================================="
echo ""

# Prompt for backend URL
read -p "Enter your backend URL (e.g., https://api.affynix.ai): " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo "❌ Backend URL is required!"
    exit 1
fi

# Update .env.production
echo "VITE_API_URL=$BACKEND_URL" > .env.production

echo "✅ Updated .env.production with:"
echo "   VITE_API_URL=$BACKEND_URL"
echo ""
echo "Ready to deploy with: vercel --prod"
