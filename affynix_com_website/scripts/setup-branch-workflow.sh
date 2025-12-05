#!/bin/zsh

# Script to set up proper 3-branch Git workflow
# This prevents over-deployment by using proper branching

echo "🚀 Setting up 3-branch Git workflow..."

# Create staging branch if it doesn't exist
echo "📝 Creating staging branch..."
git checkout -b staging 2>/dev/null || git checkout staging
git push -u origin staging

# Create development branch if it doesn't exist  
echo "📝 Creating development branch..."
git checkout -b development 2>/dev/null || git checkout development
git push -u origin development

# Switch back to development for active work
git checkout development

echo "✅ Branch workflow setup complete!"
echo ""
echo "📋 Branch Structure:"
echo "  🌟 main      → Production (affynix.com)"
echo "  🧪 staging   → Staging (staging.affynix.com)"  
echo "  🔧 development → Development (dev.affynix.com)"
echo ""
echo "🚀 Next steps:"
echo "  1. Create feature branches from development"
echo "  2. Test on dev environment first"
echo "  3. Merge to staging for pre-prod testing"
echo "  4. Merge to main for production"
echo ""
echo "📖 See BRANCH_WORKFLOW.md for detailed instructions"
