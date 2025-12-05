#!/bin/bash

# Script to help set up environment variables in Vercel

set -e

echo "🔧 Vercel Environment Variables Setup"
echo ""
echo "This script will help you set environment variables in Vercel."
echo "You'll need to provide the values when prompted."
echo ""

# Check if Vercel CLI is available
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Please install it first:"
    echo "   npm install -g vercel"
    exit 1
fi

# Required variables
REQUIRED_VARS=(
    "OPENAI_API_KEY:OpenAI API key (starts with sk-):required"
    "AI_GATEWAY_API_KEY:Vercel AI Gateway key (starts with vck_):required"
)

# Optional variables
OPTIONAL_VARS=(
    "AFFYNIX_API_KEY:Affynix platform API key:optional"
    "WEBHOOK_SECRET:Webhook signature secret:optional"
    "NEXT_PUBLIC_DOMAIN:Public domain (default: ai.affynix.ai):optional"
    "OPENAI_MODEL:OpenAI model (default: gpt-4-turbo):optional"
)

echo "📝 Required Environment Variables:"
echo ""

# Set required variables
for var_info in "${REQUIRED_VARS[@]}"; do
    IFS=':' read -r var_name var_desc var_required <<< "$var_info"
    
    if [ -z "${!var_name}" ]; then
        echo "Enter ${var_desc}"
        read -s -p "${var_name}: " value
        echo ""
        
        if [ -n "$value" ]; then
            echo "Setting ${var_name}..."
            vercel env add "${var_name}" production <<< "$value" || echo "⚠️  Failed to set ${var_name}"
        else
            echo "⚠️  Skipping ${var_name} (empty value)"
        fi
    else
        echo "✓ ${var_name} already set in environment"
    fi
done

echo ""
echo "📝 Optional Environment Variables (press Enter to skip):"
echo ""

# Set optional variables
for var_info in "${OPTIONAL_VARS[@]}"; do
    IFS=':' read -r var_name var_desc var_required <<< "$var_info"
    
    echo "${var_desc}"
    read -p "${var_name} (optional): " value
    
    if [ -n "$value" ]; then
        echo "Setting ${var_name}..."
        vercel env add "${var_name}" production <<< "$value" || echo "⚠️  Failed to set ${var_name}"
    fi
done

echo ""
echo "✅ Environment variables setup complete!"
echo ""
echo "💡 You can also set them manually in Vercel Dashboard:"
echo "   https://vercel.com/affynix/ai-gateway/settings/environment-variables"
echo ""
echo "🔄 After setting variables, redeploy:"
echo "   vercel --prod"

