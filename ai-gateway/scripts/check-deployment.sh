#!/bin/bash

# Check deployment status and configuration

set -e

echo "🔍 Checking AI Gateway Deployment Status"
echo ""

# Check if project is linked
if [ ! -f ".vercel/project.json" ]; then
    echo "❌ Project not linked to Vercel"
    exit 1
fi

PROJECT_ID=$(cat .vercel/project.json | grep -o '"projectId":"[^"]*' | cut -d'"' -f4)
PROJECT_NAME=$(cat .vercel/project.json | grep -o '"projectName":"[^"]*' | cut -d'"' -f4)

echo "📦 Project: ${PROJECT_NAME}"
echo "🆔 Project ID: ${PROJECT_ID}"
echo ""

# Check Vercel CLI
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI installed: $(vercel --version)"
else
    echo "❌ Vercel CLI not found"
fi

echo ""
echo "🌐 Deployment URLs:"
echo "   Production: https://${PROJECT_NAME}-*.vercel.app"
echo "   Dashboard: https://vercel.com/affynix/${PROJECT_NAME}"

echo ""
echo "🔧 Environment Variables Status:"
vercel env ls production 2>/dev/null | grep -E "(OPENAI|AFFYNIX|WEBHOOK|DOMAIN)" || echo "   Run 'vercel env ls' to see all variables"

echo ""
echo "🌍 Domain Configuration:"
vercel domains ls 2>/dev/null | grep "ai.affynix.ai" && echo "   ✓ ai.affynix.ai configured" || echo "   ⚠️  ai.affynix.ai not found or not verified"

echo ""
echo "📊 Recent Deployments:"
vercel ls --limit 3 2>/dev/null || echo "   Run 'vercel ls' to see deployments"

echo ""
echo "💡 Useful Commands:"
echo "   vercel inspect          - View deployment details"
echo "   vercel logs             - View deployment logs"
echo "   vercel env ls           - List environment variables"
echo "   vercel domains ls       - List domains"
echo "   vercel --prod           - Redeploy to production"

